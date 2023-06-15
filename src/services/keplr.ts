import {
  defer,
  from,
  first,
  fromEvent,
  map,
} from 'rxjs';
import { Signer } from 'secretjs/dist/wallet_amino';
import { createFetchClient } from '../services';
import { WalletSigner } from '../types/wallet';
import {getConfig} from '../lib/utils';

const config = getConfig();

const secretChainId: string = Object.keys(config.chains).find((nextChainId) => config.chains[nextChainId].name === 'Secret') ?? 'Not found';

/**
 * Gets keplr from the browser window api
 */
function getKeplr() {
  if (window.keplr === undefined) {
    throw new Error('keplr not available');
  }
  return window.keplr;
}

/**
 * Gets signer information from the keplr wallet
 */
function getKeplrSigner(chainId: string) {
  const keplr = getKeplr();
  return keplr.getOfflineSignerOnlyAmino(chainId) as Signer;
}

/**
 * Enable chains in keplr
 */
function enableKeplr$(chainIds: string[]) {
  const keplr = getKeplr();
  return from(keplr.enable(chainIds));
}

/**
 * Gets the encryption utilities from the keplr wallet
 */
function getKeplrEncryptionUtils(chainId: string) {
  const keplr = getKeplr();
  return keplr.getEnigmaUtils(chainId);
}

/**
 * fetches viewing key from keplr
 */
const fetchSecret20ViewingKey$ = (
  chainId: string,
  contractAddress: string,
) => {
  const keplr = getKeplr();
  return createFetchClient(
    defer(() => from(keplr.getSecret20ViewingKey(chainId, contractAddress))),
  );
};

/**
 * Sets up the observable for fetching a viewing key from keplr
 */
const getViewingKeyFromKeplr$ = (
  chainId:string,
  contractAddr: string,
) => fetchSecret20ViewingKey$(chainId, contractAddr).pipe(first());

/**
 * Fetch observable for getting the account information from the keplr wallet
 */
const getKeplrAccounts$ = (chainId: string) => {
  const offlineSigner = getKeplrSigner(chainId);
  return createFetchClient(defer(
    () => from(offlineSigner.getAccounts()),
  ));
};

/**
 * Fetch observable for getting the account key from the keplr wallet
 */
function getKeplrAccountKey$(chainId: string) {
  const keplr = getKeplr();
  return createFetchClient(defer(
    () => from(keplr.getKey(chainId)),
  ));
}

/**
 * Observable for getting the account name from the keplr wallet
 */
const getKeplrAccountName$ = (chainId: string) => getKeplrAccountKey$(chainId)
  .pipe(
    map(({ name }) => name),
    first(),
  );

/**
 * Sets up the observable for getting the account name from the keplr wallet
 */
const getKeplrAccountAddress$ = (chainId: string) => getKeplrAccounts$(chainId)
  .pipe(
    map((accounts) => {
      if (accounts[0] !== undefined) {
        return accounts[0].address;
      }
      throw new Error(`Keplr account does not exist for chainId: ${chainId}`);
    }),
    first(),
  );

/**
 * Sets up the keplr wallet signer observable
 */
const getKeplrWalletSigner$ = (
  chainId: string,
) => getKeplrAccounts$(chainId)
  .pipe(
    map(() => {
      // Secret client requires encryption utils
      // TODO move to config
      if (chainId === secretChainId) {
        const walletSigner: WalletSigner = {
          signer: getKeplrSigner(chainId),
          encryptionUtils: getKeplrEncryptionUtils(chainId),
        };
        console.log(walletSigner);
        return walletSigner;
      }
      // non-secret client does not need encryption utils
      const walletSigner: WalletSigner = {
        signer: getKeplrSigner(chainId),
      };
      return walletSigner;
    }),
    first(),
  );

/**
 * Observable that watches for changes to the keplr wallet account
 */
const keplrAccountChange$ = () => fromEvent(window, 'keplr_keystorechange');

export {
  getKeplr,
  getKeplrSigner,
  enableKeplr$,
  getKeplrAccounts$,
  getKeplrAccountKey$,
  getKeplrAccountAddress$,
  getKeplrWalletSigner$,
  getViewingKeyFromKeplr$,
  keplrAccountChange$,
  getKeplrAccountName$,
  fetchSecret20ViewingKey$,
  getKeplrEncryptionUtils,
};
