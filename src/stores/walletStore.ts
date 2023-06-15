import { forkJoin, switchMap, first } from 'rxjs';
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import { Wallets } from '../types/wallet';
import { enableKeplr$, getKeplrAccountAddress$, getKeplrAccountName$, } from '../services/keplr';

const useWallet = defineStore('wallet', () => {
  const wallet: Ref<Wallets> = ref({
    name: '',
    chainAddresses: {},
    isConnected: false,
  });
  const isLoading: Ref<boolean> = ref(false);
  const isReady: Ref<boolean> = ref(false);
  const isAuto: Ref<boolean> = useStorage('isAutoConnect', false);

  /**
  * When called
  * updates the info associated with the wallet including the name and chain/address pair
  */
  function updateWallet(
    chainIds: string[],
  ) {
    isLoading.value = true;

    enableKeplr$(chainIds).pipe(
      switchMap(() => { //TODO add support for more chains
        return forkJoin([getKeplrAccountName$('secret-4')].concat(chainIds.map((nextId) => getKeplrAccountAddress$(nextId))));
      }),
      first(),
    ).subscribe({
      next: ([name, addresses]) => {
        wallet.value = {
          name,
          chainAddresses: chainIds.reduce((chainAddrs, nextId)=>{
            return {
              ...chainAddrs,
              [nextId]: addresses, // TODO
            };
          },{}),
          isConnected: true,
        }
      },
      complete: () => {
        isLoading.value = false;
        isReady.value = true;
        isAuto.value = true;
      }
    });
  }

  /**
  * Clears wallet data from the store
  */
  function clearWallet() {
    // clear wallet data
    wallet.value = {
      name: '',
      chainAddresses: {},
      isConnected: false,
    };
    isAuto.value = false;
  }

  /**
  * Given a wallet provider and chain, returns the active wallet address associated with it
  */
  const getWalletAddress = computed(
    () => (chainId: string) => wallet.value.chainAddresses[chainId],
  );

  /**
  * Given a wallet provider and chain, returns the active wallet name associated with it
  */
  const getWalletName = computed(
    () => () => wallet.value.name,
  );

  return {
    wallet,
    isLoading,
    isReady,
    isAuto,
    clearWallet,
    updateWallet,
    getWalletAddress,
    getWalletName,
  };
});

export {
  useWallet,
};
