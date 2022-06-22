import { BaseDotsamaWallet, Wallet } from '../index'
import { InjectedWindow } from '@polkadot/extension-inject/types'
import supportedWallets from './supportedWallets'

const supportedWalletsNames = supportedWallets.map(
	(wallet) => wallet.extensionName,
)

export function getWallets(): Wallet[] {
	return supportedWallets
}

export function getAllWallets() {
	const unknownWallets = Object.keys(
		(window as Window & InjectedWindow)?.injectedWeb3 ?? {},
	)
		.filter((name) => !supportedWalletsNames.includes(name))
		.map((wallet) => new BaseDotsamaWallet({ extensionName: wallet }))

	return [...supportedWallets, ...unknownWallets]
}

export function getWalletBySource(source: string): Wallet | undefined {
	const supportedWallet = supportedWallets.find((wallet) => {
		return wallet.extensionName === source
	})
	return supportedWallet ?? new BaseDotsamaWallet({ extensionName: source })
}

export function isWalletInstalled(source: string): boolean {
	const wallet = getWalletBySource(source)
	return wallet?.installed as boolean
}
