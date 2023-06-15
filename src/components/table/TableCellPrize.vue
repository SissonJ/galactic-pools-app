<script setup lang="ts">
import { defineProps } from 'vue';
import BigNumber from 'bignumber.js';
import {usePools} from '../../stores/poolStore';

const props = defineProps({
  data: {
    type: String,
    required: true,
  }
});
const pools = usePools();

</script>
<template>
  <div class="cell-pool">
    <h2 v-if="pools.isReady"> ${{ new BigNumber(pools.pools[data].prize).toFormat() }} </h2>
    <h2 v-else> $0</h2>
  </div>
</template>
<style lang="scss" scoped>
.cell-pool {
  display: flex;
  align-items: center;
  justify-content: left;
}
</style>
