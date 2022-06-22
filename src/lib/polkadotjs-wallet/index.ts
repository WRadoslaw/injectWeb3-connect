import { BaseDotsamaWallet } from '../base-dotsama-wallet'

export class PolkadotjsWallet extends BaseDotsamaWallet {
	extensionName = 'polkadot-js'
	title = 'Polkadot.js'
	noExtensionMessage =
		'You can use any Polkadot compatible wallet but we recommend using Talisman'
	installUrl =
		'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd/related'
	logo = {
		src: './PolkadotjsLogo.svg',
		alt: 'Polkadotjs Logo',
	}
}
