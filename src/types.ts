import { InjectedWindowProvider } from '@polkadot/extension-inject/types'

export interface NamedInjectedWindowProvider extends InjectedWindowProvider {
	name: string
}

export type InjectedExtensionRaw = Record<string, InjectedWindowProvider>
