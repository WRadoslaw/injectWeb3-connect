import { ApiPromise, ApiRx } from '@polkadot/api'
import { getSpecTypes } from '@polkadot/types-known'
import { base64Encode } from '@polkadot/util-crypto'

import supportedWallets from './supportedWallets'
import { InjectedWindow, MetadataDef } from './types/polkadotTypes'
import { firstValueFrom } from './utils'

import { BaseDotsamaWallet, Wallet } from '../index'

const supportedWalletsNames = supportedWallets.map((wallet) => wallet.extensionName)

export function getWallets(): Wallet[] {
  return supportedWallets
}

export function getAllWallets() {
  const unknownWallets = Object.keys((window as Window & InjectedWindow)?.injectedWeb3 ?? {})
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

export const getPolkadotApiChainInfo = async (api: ApiRx | ApiPromise): Promise<MetadataDef> => {
  const systemChain = (await firstValueFrom(api.rpc.system.chain())) as string

  return {
    icon: 'beachball',
    chainType: 'substrate',
    chain: systemChain,
    metaCalls: base64Encode(api.runtimeMetadata.asCallsOnly.toU8a()),
    types: getSpecTypes(
      api.registry,
      systemChain,
      api.runtimeVersion.specName,
      api.runtimeVersion.specVersion,
    ) as unknown as Record<string, string>,
    specVersion: api.runtimeVersion.specVersion.toNumber(),
    ss58Format: api.registry.chainSS58 ?? 0,
    tokenDecimals: api.registry.chainDecimals[0],
    tokenSymbol: api.registry.chainTokens[0],
    genesisHash: api.genesisHash.toHex(),
  }
}
