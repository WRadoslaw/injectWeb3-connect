import type { Signer as InjectedSigner } from '@polkadot/api/types'
import {
  InjectedAccount,
  InjectedAccountWithMeta,
  InjectedExtension,
  InjectedWindow,
  MetadataDef,
} from '@polkadot/extension-inject/types'

import { AuthError, NotInstalledError, WalletError } from '../errors'
import { SubscriptionFn, Wallet, WalletAccount, WalletData } from '../types'
import { capitalizeFirstLetter } from '../utils'

// TODO: Create a proper BaseWallet class to offload common checks
export class BaseDotsamaWallet implements Wallet {
  extensionName = ''
  title = ''
  installUrl = ''
  noExtensionMessage = ''
  logo = {
    src: '',
    alt: '',
  }

  constructor({ installUrl, logo, extensionName, noExtensionMessage, title }: Partial<WalletData>) {
    this.extensionName = extensionName ?? ''
    this.title = title ?? capitalizeFirstLetter(this.extensionName.toLowerCase())
    this.installUrl = installUrl ?? ''
    this.noExtensionMessage = noExtensionMessage ?? ''
    this.logo = logo ?? {
      src: '',
      alt: '',
    }
  }

  _extension: InjectedExtension | undefined
  _signer: InjectedSigner | undefined

  // API docs: https://polkadot.js.org/docs/extension/
  get extension() {
    return this._extension
  }

  // API docs: https://polkadot.js.org/docs/extension/
  get signer() {
    return this._signer
  }

  get installed() {
    const injectedWindow = window as Window & InjectedWindow
    const injectedExtension = injectedWindow?.injectedWeb3?.[this.extensionName]

    return !!injectedExtension
  }

  get rawExtension() {
    const injectedWindow = window as Window & InjectedWindow
    return injectedWindow?.injectedWeb3?.[this.extensionName]
  }

  transformError = (err: Error): WalletError | Error => {
    if (err.message.includes('pending authorization request')) {
      return new AuthError(err.message, this)
    }
    return err
  }

  updateMetadata = async (chainInfo: MetadataDef): Promise<boolean> => {
    if (!this.extension) {
      throw new Error('EnabledError: Enable extension to update metadata')
    }

    if (!this.extension.metadata?.provide) {
      throw new Error('No metadata update function')
    }

    const currentMetadata = (await this.extension.metadata.get()).find(
      ({ genesisHash }) => genesisHash === chainInfo.genesisHash,
    )

    if (currentMetadata && chainInfo.specVersion >= currentMetadata.specVersion) {
      return false
    }

    return this.extension.metadata.provide(chainInfo)
  }

  enable = async (dappName: string) => {
    if (!dappName) {
      throw new Error('MissingParamsError: Dapp name is required.')
    }
    if (!this.installed) {
      throw new NotInstalledError(`Refresh the browser if ${this.title} is already installed.`, this)
    }
    try {
      const injectedExtension = this.rawExtension
      const rawExtension = await injectedExtension?.enable(dappName)
      if (!rawExtension) {
        throw new NotInstalledError(
          `${this.title} is installed but is not returned by the 'Wallet.enable(dappname)' function`,
          this,
        )
      }

      const extension: InjectedExtension = {
        ...rawExtension,
        // Manually add `InjectedExtensionInfo` to have a consistent response.
        name: this.extensionName,
        version: injectedExtension.version,
      }

      this._extension = extension
      this._signer = extension?.signer
    } catch (err) {
      throw this.transformError(err as WalletError)
    }
  }

  getAccounts = async (anyType?: boolean): Promise<WalletAccount[]> => {
    if (!this._extension) {
      throw new NotInstalledError(`The 'Wallet.enable(dappname)' function should be called first.`, this)
    }
    const accounts = await this._extension.accounts.get(anyType)
    return accounts.map((account) => {
      return {
        ...account,
        source: this._extension?.name as string,
        // Added extra fields here for convenience
        wallet: this,
        signer: this._extension?.signer,
      }
    })
  }

  subscribeAccounts = async (callback: SubscriptionFn) => {
    if (!this._extension) {
      throw new NotInstalledError(`The 'Wallet.enable(dappname)' function should be called first.`, this)
    }

    return this._extension.accounts.subscribe((accounts: InjectedAccount[]) => {
      const accountsWithWallet = accounts.map((account) => {
        return {
          ...account,
          source: this._extension?.name as string,
          // Added extra fields here for convenience
          wallet: this,
          signer: this._extension?.signer,
        }
      })
      callback(accountsWithWallet)
    })
  }

  walletAccountToInjectedAccountWithMeta = (account: WalletAccount): InjectedAccountWithMeta => ({
    address: account.address,
    type: account.type,
    meta: {
      genesisHash: account.genesisHash,
      name: account.name,
      source: account.source,
    },
  })
}
