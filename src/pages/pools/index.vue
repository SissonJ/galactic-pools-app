<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {interval, Subscription, tap} from 'rxjs';
import {onMounted, onUnmounted} from 'vue';
import TablePool from '../../components/table/TablePool.vue';
import {usePools} from '../../stores/poolStore';
import {Pool} from '../../types/pool';
import {getConfig} from '../../lib/utils';

const config = getConfig();

const poolStore = usePools();
poolStore.updatePoolInfo('secret1j6ly79zfvh83g8te9utystt8hc6vm84u23gnmn','0d21c959e0f195e792e391b7b1729f6c6af70912ce76572faaa3db1f10412dfc');
const {
  isReady,
} = storeToRefs(poolStore);
const {
  updatePoolsInfo,
} = poolStore;

const pools: Pool[] = config.poolContracts.map((nextContract) => {
  // TODO get data
  return {
    contractAddress: nextContract.address,
    subRows: {},
  }
});

let updateInterval: Subscription | undefined;

onMounted(() => {
  // update pool on load if it hasn't been queried yet
  if(!isReady.value) {
    updatePoolsInfo(config.poolContracts);
  }
  // Update pool data every 15 seconds
  updateInterval = interval(15000).pipe(
    tap(() => updatePoolsInfo(config.poolContracts))
  ).subscribe();
});
onUnmounted(() => {
  if(updateInterval !== undefined) {
    updateInterval.unsubscribe();
  }
});
</script>
<template>
  <div class="page">
    <h2>Staking Pools</h2>
    <div class="line" />
    <TablePool
      :data="pools"
    />
  </div>
</template>

<style lang="scss" scoped>
.page {
  margin: 0 230px ;

  .line {
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
  }

  .ph-item {
    background-color: none;
  }
}
</style>
