import { WalletData } from './types'
import { BaseDotsamaWallet } from './base-dotsama-wallet'
import { PolkadotLogo, TalismanLogo, SubwalletLogo } from './assets'

export const polkadotjsWallet: WalletData = {
	extensionName: 'polkadot-js',
	title: 'Polkadot.js',
	noExtensionMessage:
		'You can use any Polkadot compatible wallet but we recommend using Talisman',
	installUrl:
		'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd/related',
	logo: {
		src: PolkadotLogo,
		alt: 'Polkadotjs Logo',
	},
}

export const subWallet: WalletData = {
	extensionName: 'subwallet-js',
	title: 'SubWallet',
	noExtensionMessage:
		'You can use any Polkadot compatible wallet but we recommend using Talisman',
	installUrl:
		'https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn?hl=en&authuser=0',
	logo: {
		src: SubwalletLogo,
		alt: 'Subwallet Logo',
	},
}

export const talismanWallet: WalletData = {
	extensionName: 'talisman',
	title: 'Talisman',
	noExtensionMessage:
		'You can use any Polkadot compatible wallet but we recommend using Talisman',
	installUrl: 'https://app.talisman.xyz/spiritkeys',
	logo: {
		src: TalismanLogo,
		alt: 'Talisman Logo',
	},
}

export default [
	new BaseDotsamaWallet(polkadotjsWallet),
	new BaseDotsamaWallet(subWallet),
	new BaseDotsamaWallet(talismanWallet),
]
