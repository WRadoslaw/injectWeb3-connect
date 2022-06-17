import {
    InjectedAccount,
    InjectedAccountWithMeta,
    InjectedExtension,
    Unsubcall,
} from '@polkadot/extension-inject/types'
import {InjectedExtensionRaw, NamedInjectedWindowProvider} from "./types";
import {enableSingleExtension, mapAccounts, toNamedInjectedWindowProvider} from "./helpers";

const wallets: InjectedExtension[] = []


export const getInjectedExtensionsNames = (): string[] =>
    Object.keys((window as any).injectedWeb3 as InjectedExtensionRaw)

export function getRawExtensionBySource(
    extensionName: string | string[]
): NamedInjectedWindowProvider | NamedInjectedWindowProvider[] | undefined {
    const injectedExtensions = Object.entries((window as any).injectedWeb3 as InjectedExtensionRaw)
    if(!injectedExtensions.length) return;
    const isSingle = typeof extensionName === 'string'

    const foundExtensions = injectedExtensions.filter(extension => {
        if(isSingle) {
            return extension[0] === extensionName
        }
        return extensionName.includes(extension[0])
    })

    if(!foundExtensions.length) return;
    return isSingle ? toNamedInjectedWindowProvider(foundExtensions[0]) :  foundExtensions.map(toNamedInjectedWindowProvider)
}

export const enableExtension = async (extensionsNames: string | string[], origin: string): Promise<InjectedExtension[] | undefined> => {
    const extensions = getRawExtensionBySource(extensionsNames)
    if(!extensions) return;
    try {
        const enabledExtensions = await Promise.all([extensions].flat().map(enableSingleExtension(origin)))
        wallets.length = 0
        wallets.push(...enabledExtensions)

        return enabledExtensions
    } catch (e) {
        throw e
    }
}

export const getAccountsFromExtension = (extension?: InjectedExtension | InjectedExtension[]): InjectedAccountWithMeta[] | void => {
    if(!extension && !wallets.length) throw Error('Pass extension or use enableExtension to allow usage')
    Promise.all(
        (extension ? [extension].flat() : wallets).map(async (extension) => {
            try {
                const list = await extension.accounts.get()

                return mapAccounts(extension.name, list)
            } catch (e) {
                return []
            }
        })
    ).then((result) => result.flat())
}

export async function web3AccountsSubscribe(
    extension: InjectedExtension,
    cb: (accounts: InjectedAccountWithMeta[]) => void | Promise<void>
): Promise<Unsubcall> {
    const accounts: Record<string, InjectedAccount[]> = {}

    const triggerUpdate = (): void | Promise<void> =>
        cb(
            Object.entries(accounts).reduce(
                (result: InjectedAccountWithMeta[], [source, list]): InjectedAccountWithMeta[] => {
                    result.push(...mapAccounts(source, list))

                    return result
                },
                []
            )
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

export * from './helpers'
export * from './types'
