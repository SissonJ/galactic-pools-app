<script setup lang="ts">
import { computed, defineProps } from 'vue';
import {usePools} from '../../stores/poolStore';
import Logo from '../Logo.vue';
import {getConfig} from '../../lib/utils';

const config = getConfig();

const props = defineProps({
  data: {
    type: String,
    required: true,
  }
});

const pools = usePools();

const tokenConfig = computed(() => {
  if(pools.isReady) {
    return config.tokens[pools.pools[props.data].token.addrOrDenom];
  }
  return undefined;
});
const loading = computed(() => {
  return !pools.isReady;});
</script>
<template>
  <div class="cell-pool">
    <Logo v-if="!loading" :token-name="tokenConfig.name" :logo-link="tokenConfig.logoPath"/>
    <h2 v-if="!loading"> {{ tokenConfig.name }} Staking Pool </h2>
  </div>
</template>
<style lang="scss" scoped>
.cell-pool {
  display: flex;
  align-items: center;
  justify-content: left;

  h2 {
    margin-left: 8px;
  }

  .loading {
    height: 40px;
    width: 100px;
  }
}
</style>
