import { defineStore } from 'pinia';
import {ref} from 'vue';
import {Contract, PoolStore, UserPoolStore} from '../types/pool';
import {updatePool$, updatePools$} from '../orchestrator/pools';

const usePools = defineStore('pools', () => {
  const pools = ref<PoolStore>({});
  const userPools = ref<UserPoolStore>({});
  const isLoading = ref<boolean>(true);
  const isReady = ref<boolean>(false);

  const updatePoolInfo = (contractAddress: string, codeHash: string) => {
    isLoading.value = true;
    updatePool$(contractAddress, codeHash).subscribe({
      next: (poolData) => {
        //put data in store
        pools.value = {
          ...pools.value,
          [poolData.poolContract.address]: poolData,
        };
      },
      complete: () => {
        isReady.value = true;
        isLoading.value = false;
      }
    });

  };

  // update multiple pools
  const updatePoolsInfo = (contracts: Contract[]) => {
    isLoading.value = true;
    updatePools$(contracts).subscribe({
      next: (poolData) => {
        //put data in store
        pools.value = {
          ...pools.value,
          [poolData.poolContract.address]: poolData,
        };
      },
      complete: () => {
        isReady.value = true;
        isLoading.value = false;
      }
    });
  };

  return {
    pools,
    userPools,
    isLoading,
    isReady,
    updatePoolInfo,
    updatePoolsInfo,
  };
});

export {
  usePools,
};
