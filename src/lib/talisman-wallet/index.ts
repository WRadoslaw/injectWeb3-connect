import { BaseDotsamaWallet } from '../base-dotsama-wallet'

export class TalismanWallet extends BaseDotsamaWallet {
	extensionName = 'talisman'
	title = 'Talisman'
	installUrl = 'https://app.talisman.xyz/spiritkeys'
	noExtensionMessage =
		'You can use any Polkadot compatible wallet but we recommend using Talisman'
	logo = {
		src: './TalismanLogo.svg',
		alt: 'Talisman Logo',
	}
}
