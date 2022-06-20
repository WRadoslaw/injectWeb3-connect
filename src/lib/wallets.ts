import { TalismanWallet } from './talisman-wallet'
import { PolkadotjsWallet } from './polkadotjs-wallet'
import { SubWallet } from './subwallet-wallet'
import { BaseDotsamaWallet, Wallet } from '../index'
import { InjectedWindow } from '@polkadot/extension-inject/types'

// Export wallets as well for one and done usage
export { TalismanWallet, SubWallet, PolkadotjsWallet }

// Add new wallets here
const supportedWallets = [
	new TalismanWallet(),
	new SubWallet(),
	new PolkadotjsWallet(),
]

export function getWallets(): Wallet[] {
	return supportedWallets
}

export function getAllWallets() {
	const supportedWalletsNames = supportedWallets.map(
		(wallet) => wallet.extensionName,
	)

	const unknownWallets = Object.keys(
		(window as Window & InjectedWindow)?.injectedWeb3 ?? {},
	)
		.filter((name) => !supportedWalletsNames.includes(name))
		.map((wallet) => new BaseDotsamaWallet(wallet))

	return [...supportedWallets, ...unknownWallets]
}

export function getWalletBySource(source: string): Wallet | undefined {
	const supportedWallet = supportedWallets.find((wallet) => {
		return wallet.extensionName === source
	})
	return supportedWallet ?? new BaseDotsamaWallet(source)
}

export function isWalletInstalled(source: string): boolean {
	const wallet = getWalletBySource(source)
	return wallet?.installed as boolean
}
