import {SecretNetworkClient} from "secretjs";
import {getKeplrWalletSigner$} from "../services/keplr";
import { useWallet } from "../stores/walletStore";
import {Clients, WalletSigner} from "../types/wallet";
import {getConfig} from '../lib/utils';

const config = getConfig();

let clients: Clients = {};

function createClient (chainId: string) {
  const wallet = useWallet();
  const {
    getWalletAddress
  } = wallet;

  const address = getWalletAddress(chainId);
  getKeplrWalletSigner$(chainId).subscribe({
    next: (walletSigner: WalletSigner) => {
      clients[chainId] = new SecretNetworkClient({
        url: config.chains[chainId].url,
        chainId: chainId,
        wallet: walletSigner.signer,
        walletAddress: address,
        encryptionUtils: walletSigner.encryptionUtils,
      });
      console.log(clients);
    },
  });
}

function createClients (chainIds: string[]) {
  chainIds.forEach((id) => createClient(id));
}

function getClient(chainId: string) {
  if(clients[chainId] === undefined) {
    // if no user client, return a query client
    return new SecretNetworkClient({
      chainId,
      url: config.chains[chainId].url,
    });
  }
  return clients[chainId];
}

function deleteClient(chainId: string = '') {
  if(chainId === '') {
    clients = {};
    return;
  }
  delete clients[chainId];
}

export {
  createClient,
  createClients,
  getClient,
  deleteClient,
};
