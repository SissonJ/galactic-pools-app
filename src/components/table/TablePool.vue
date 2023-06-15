<script lang="ts" setup>
import {
  defineProps, PropType,
} from 'vue';
import { Pool } from '../types/pool';
import Table from './Table.vue';
import TableCellPool from './TableCellPool.vue';
import TableCellPrize from './TableCellPrize.vue';
import TableCellCountdown from './TableCellCountdown.vue';
import TableCellDeposit from './TableCellDeposit.vue';
import TablePoolSubRow from './TablePoolSubRow.vue';

defineProps({
  data: {
    type: Array as PropType<Pool[]>, // TODO search and filter
    required: true,
  },
});

const columns = [
  {
    header: 'Pool',
    accessor: 'contractAddress',
    minSize: 250,
    cellComponent: TableCellPool
  },
  {
    header: 'Prize',
    accessor: 'contractAddress',
    minSize: 200,
    cellComponent: TableCellPrize
  },
  {
    header: 'Countdown',
    accessor: 'contractAddress',
    minSize: 300,
    cellComponent: TableCellCountdown
  },
  {
    header: '',
    accessor: 'contractAddress',
    minSize: 340,
    cellComponent: TableCellDeposit
  }
];
</script>
<template>
  <Table
    :data="data" 
    :columns="columns"
    :sub-row-component="TablePoolSubRow"
    class="table-transparent"
  />
</template>
<style lang="scss" scoped>
</style>
