import { BaseDotsamaWallet } from '../base-dotsama-wallet'
// @ts-ignore
import logo from './TalismanLogo.svg'

export class TalismanWallet extends BaseDotsamaWallet {
	extensionName = 'talisman'
	title = 'Talisman'
	installUrl = 'https://app.talisman.xyz/spiritkeys'
	noExtensionMessage =
		'You can use any Polkadot compatible wallet but we recommend using Talisman'
	logo = {
		src: logo,
		alt: 'Talisman Logo',
	}
}
