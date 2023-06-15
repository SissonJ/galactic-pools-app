import {SecretNetworkClient} from "secretjs";
import {Signer} from "secretjs/dist/wallet_amino";

type Wallets = {
  name: string,
  isConnected: boolean,
  chainAddresses: {
    [chainId: string]: string,
  },
}

type WalletSigner = {
  signer: Signer,
  encryptionUtils?: any,
}

type Clients = {
  [chainId: string]: SecretNetworkClient,
}

export {
  Wallets,
  WalletSigner,
  Clients
};
