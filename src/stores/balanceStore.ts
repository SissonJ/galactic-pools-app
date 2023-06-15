import { defineStore } from 'pinia';
import {ref} from 'vue';
import {updateBalance$, updateBalances$} from '../orchestrator/balances';
import {Balances} from '../types/balances';

const useBalances = defineStore('balances', () => {
  const balances = ref<Balances>({});
  const isLoading = ref<boolean>(false);

  const updateBalance = (token: string) => {
    isLoading.value = true;
    updateBalance$(token).subscribe({
      next: (balance) => {
        balances.value = {
          ...balances.value,
          [balance.id]: balance,
        }
      },
      complete: () => {
        isLoading.value = false;
      }
    });
  }

  const updateBalances = (token: string[]) => {
    isLoading.value = true;
    updateBalances$ (token).subscribe({
      next: (balance) => {
        balances.value = {
          ...balances.value,
          [balance.id]: balance,
        }
      },
      complete: () => {
        isLoading.value = false;
      }
    });
  }

  const getBalance = (token:string) => balances.value[token]?.amount;

  return {
    balances,
    isLoading,
    updateBalance,
    updateBalances,
    getBalance,
  }

});

export {
  useBalances,
};
