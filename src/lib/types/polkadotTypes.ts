import { Signer as InjectedSigner } from '@polkadot/api/types'
import { ProviderInterface } from '@polkadot/rpc-provider/types'
import { ExtDef } from '@polkadot/types/extrinsic/signedExtensions/types'
import { KeypairType } from '@polkadot/util-crypto/types'

declare type This = typeof globalThis
export interface MetadataDefBase {
  chain: string
  genesisHash: string
  icon: string
  ss58Format: number
  chainType?: 'substrate' | 'ethereum'
}
export interface MetadataDef extends MetadataDefBase {
  color?: string
  specVersion: number
  tokenDecimals: number
  tokenSymbol: string
  types: Record<string, Record<string, string> | string>
  metaCalls?: string
  userExtensions?: ExtDef
}

export interface ProviderMeta {
  network: string
  node: 'full' | 'light'
  source: string
  transport: string
}

export type ProviderList = Record<string, ProviderMeta>

export interface InjectedProvider extends ProviderInterface {
  listProviders: () => Promise<ProviderList>
  startProvider: (key: string) => Promise<ProviderMeta>
}

export interface InjectedMetadataKnown {
  genesisHash: string
  specVersion: number
}
export interface InjectedMetadata {
  get: () => Promise<InjectedMetadataKnown[]>
  provide: (definition: MetadataDef) => Promise<boolean>
}

export interface InjectedAccount {
  address: string
  genesisHash?: string | null
  name?: string
  type?: KeypairType
}

export interface InjectedAccounts {
  get: (anyType?: boolean) => Promise<InjectedAccount[]>
  subscribe: (cb: (accounts: InjectedAccount[]) => void | Promise<void>) => () => void
}

export interface Injected {
  accounts: InjectedAccounts
  metadata?: InjectedMetadata
  provider?: InjectedProvider
  signer: InjectedSigner
}
export interface InjectedWindowProvider {
  enable: (origin: string) => Promise<Injected>
  version: string
}
export interface InjectedWindow extends This {
  injectedWeb3: Record<string, InjectedWindowProvider>
}

export interface InjectedExtensionInfo {
  name: string
  version: string
}

export type InjectedExtension = InjectedExtensionInfo & Injected

export interface InjectedAccountWithMeta {
  address: string
  meta: {
    genesisHash?: string | null
    name?: string
    source: string
  }
  type?: KeypairType
}
