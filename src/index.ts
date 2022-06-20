import {
	InjectedAccount,
	InjectedAccountWithMeta,
	InjectedExtension,
	Unsubcall,
} from '@polkadot/extension-inject/types'
import { InjectedExtensionRaw, NamedInjectedWindowProvider } from './types'
import {
	mapAccounts,
	toNamedInjectedWindowProvider,
	enableSingleExtension,
} from './helpers'

const wallets: InjectedExtension[] = []

export const getInjectedExtensionsNames = (): string[] =>
	Object.keys((window as any).injectedWeb3 as InjectedExtensionRaw)

export const getRawExtensionBySource = (
	extensionName: string | string[],
): NamedInjectedWindowProvider | NamedInjectedWindowProvider[] | undefined => {
	const injectedExtensions = Object.entries(
		(window as any).injectedWeb3 as InjectedExtensionRaw,
	)
	if (!injectedExtensions.length) return
	const isSingle = typeof extensionName === 'string'

	const foundExtensions = injectedExtensions.filter((extension) => {
		if (isSingle) {
			return extension[0] === extensionName
		}
		return extensionName.includes(extension[0])
	})

	if (!foundExtensions.length) return
	return isSingle
		? toNamedInjectedWindowProvider(foundExtensions[0])
		: foundExtensions.map(toNamedInjectedWindowProvider)
}

export const enableExtension = async (
	extensionsNames: string | string[],
	origin: string,
): Promise<InjectedExtension[] | undefined> => {
	const extensions = getRawExtensionBySource(extensionsNames)
	if (!extensions) return
	try {
		const enabledExtensions = (await Promise.all(
			[extensions].flat().map(enableSingleExtension(origin)),
		)) as InjectedExtension[]
		wallets.length = 0
		wallets.push(...enabledExtensions)

		return enabledExtensions
	} catch (e) {
		throw e
	}
}

export const getAccountsFromExtension = (
	extension?: InjectedExtension | InjectedExtension[],
): Promise<InjectedAccountWithMeta[] | void> => {
	if (!extension && !wallets.length)
		throw Error('Pass extension or use enableExtension to allow usage')

	return Promise.all(
		(extension ? [extension].flat() : wallets).map(async (extension) => {
			try {
				const list = await extension.accounts.get()

				return mapAccounts(extension.name, list)
			} catch (e) {
				return []
			}
		}),
	).then((result) => result.flat())
}

export const getExtensionByAddress = async (address: string) => {
	const accounts = await getAccountsFromExtension()
	if (!accounts) throw new Error('')

	const account = accounts.find(
		(rawAccount) => rawAccount.address === address,
	)

	if (!account) return

	return wallets.find((wallet) => wallet.name === account.meta.source)
}

export const web3AccountsSubscribe = async (
	extension: InjectedExtension,
	cb: (accounts: InjectedAccountWithMeta[]) => void | Promise<void>,
): Promise<Unsubcall> => {
	const accounts: Record<string, InjectedAccount[]> = {}

	const triggerUpdate = (): void | Promise<void> =>
		cb(
			Object.entries(accounts).reduce(
				(
					result: InjectedAccountWithMeta[],
					[source, list],
				): InjectedAccountWithMeta[] => {
					result.push(...mapAccounts(source, list))

					return result
				},
				[],
			),
		)

	const unsub = extension.accounts.subscribe((result) => {
		accounts[extension.name] = result

		try {
			triggerUpdate()?.catch(console.error)
		} catch (error) {
			console.error(error)
		}
	})

	return (): void => {
		unsub()
	}
}
