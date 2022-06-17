import {
    InjectedAccount,
    InjectedAccountWithMeta,
    InjectedExtension,
    InjectedWindowProvider
} from "@polkadot/extension-inject/types";
import {decodeAddress, encodeAddress} from "@polkadot/util-crypto";
import {NamedInjectedWindowProvider} from "./types";

export const mapAccounts = (source: string, list: InjectedAccount[], ss58Format?: number): InjectedAccountWithMeta[] => {
    return list.map(
        ({ address, genesisHash, name, type }): InjectedAccountWithMeta => ({
            address: address.length === 42 ? address : encodeAddress(decodeAddress(address), ss58Format),
            meta: { genesisHash, name, source },
            type,
        })
    )
}

export const toNamedInjectedWindowProvider = (rawExtension: [string, InjectedWindowProvider]): NamedInjectedWindowProvider  => ({
    name: rawExtension[0],
    version: rawExtension[1].version,
    enable: rawExtension[1].enable
})

export const enableSingleExtension = (origin: string) => (extension: NamedInjectedWindowProvider): Promise<InjectedExtension> =>  extension.enable(origin).then(injected => ({
    name: extension.name,
    version: extension.version,
    ...injected
}))
