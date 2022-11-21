import { ApiPromise, ApiRx } from '@polkadot/api'
import { MetadataDef } from '@polkadot/extension-inject/types'
import { base64Encode } from '@polkadot/util-crypto'
import { getSpecTypes } from '@polkadot/types-known'

export const capitalizeFirstLetter = <T extends string>(str: T) =>
	(str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>

export const getPolkadotApiChainInfo = async (
	api: ApiRx | ApiPromise,
): Promise<MetadataDef> => {
	const systemChain = (await firstValueFrom(api.rpc.system.chain())) as string

	return {
		icon: 'beach-ball',
		chainType: 'substrate',
		chain: systemChain,
		metaCalls: base64Encode(api.runtimeMetadata.asCallsOnly.toU8a()),
		types: getSpecTypes(
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
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

const firstValueFrom = <T>(source: any): Promise<T> =>
	source instanceof Promise
		? source
		: new Promise<T>((resolve, reject) => {
				const subscriber = source.subscribe({
					next: (value: T) => {
						resolve(value)
						subscriber.unsubscribe()
					},
					error: reject,
					complete: () => {
						reject(
							new Error(
								'Failed to extract first value from source',
							),
						)
					},
				})
		  })
