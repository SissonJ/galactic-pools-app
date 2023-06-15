<script setup lang="ts">
import {
  ref, h, defineProps, watch,
} from 'vue';
/**
 * This is the main table factory
 * It can be used to compose other tables
 */
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useVueTable,
  SortingState,
  Row,
  getFilteredRowModel,
  FilterFnOption,
} from '@tanstack/vue-table';
import IconHorizontalDownArrow from '../svgs/IconHorizontalDownArrow.vue';

const props = defineProps<{
  data: any[]
  columns: any[],
  subRowComponent?: any,
  subRowAccessor?: string,
  globalFilterFn?: FilterFnOption<any>,
  globalFilterColumns?: string[],
  globalFilterValue?: string,
  customRowClassFn?:(input: any) => {},
  customRowClassColumnId?: string,
  sortingState?: SortingState,
}>();

/**
 * Prepare the columns information based on the options given
 */
const defaultColumns = props.columns.reduce((acc, columnItem) => {
  let cell = (cellData: any) => h('span', { innerHTML: cellData });

  if (columnItem.cellComponent !== undefined) {
    cell = (cellData: any) => h(columnItem.cellComponent, {
      data: cellData,
    });
  }

  const extraColumnOptions: {
    size?: number,
    minSize?: number,
    maxSize?: number,
    header?: string,
    sortingFn?: string,
  } = {};

  // Define column size
  if (columnItem.size) {
    extraColumnOptions.size = columnItem.size;
  }

  if (columnItem.minSize) {
    extraColumnOptions.minSize = columnItem.minSize;
  }

  if (columnItem.maxSize) {
    extraColumnOptions.maxSize = columnItem.maxSize;
  }

  if (columnItem.sortingFn) {
    extraColumnOptions.sortingFn = columnItem.sortingFn;
  }

  extraColumnOptions.header = columnItem.header ?? undefined;

  const dataColumn = {
    accessorKey: columnItem.accessor,
    cell,
    ...extraColumnOptions,
  };
  return [...acc, dataColumn];
}, []);

/**
 * Sorting State
 */
const sorting = ref<SortingState>(props.sortingState ?? []);

/**
 * Keep track of the searchable string for the global
 * filter
 */
const globalFilter = ref(props.globalFilterValue);
watch(() => props.globalFilterValue, (next) => {
  globalFilter.value = next;
});

/**
 * Instantiate the table based on the configurations created above
 */
const instance = useVueTable({
  get data() {
    return props.data;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get globalFilter() {
      return globalFilter.value;
    },
  },
  columns: defaultColumns,
  getExpandedRowModel: getExpandedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === 'function'
      ? updaterOrValue(sorting.value)
      : updaterOrValue;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  debugTable: import.meta.env.MODE !== 'production',
  enableFilters: !props.globalFilterValue,
  getColumnCanGlobalFilter: (column) => !!props.globalFilterColumns?.includes(column.id),
  globalFilterFn: props.globalFilterFn,
});

/**
 * Toggle sub row
 * @param {Row} row
 */
const subRowProperty = props.subRowAccessor ? props.subRowAccessor : 'subRows';
const rowExpandHandler = (row: Row<any>) => row.toggleExpanded();
const canExpand = (row: Row<any>) => row.original[subRowProperty]?.length > 0
    || row.original[subRowProperty];
</script>

<template>
  <div class="table">
    <div class="table-header">
      <div
        v-for="headerGroup in instance.getHeaderGroups()"
        :key="headerGroup.id"
        class="table-row-header"
      >
        <div
          v-for="header in headerGroup.headers"
          :key="header.id"
          class="table-header-column"
          :style="{ width: `${header.column.getSize()}px` }"
        >
          <div
            data-testid="table-header-column-sort-cta"
            @click="header.column.getToggleSortingHandler()?.($event)"
          >
            <span>
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="(header.getContext())"
              />
            </span>
            <button
              v-if="header.column.getIsSorted()"
              class="table-header-column-sort-cta"
            >
              <IconHorizontalDownArrow
                :class="{'sort-cta-desc': header.column.getIsSorted() === 'desc'}"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="table-body">
      <div
        v-for="row in instance.getRowModel().rows"
        :key="row.id"
        class="card table-row"
        :class="[
          {'table-row-expanded' : row.getIsExpanded() && canExpand(row)},
          {'table-row-custom' : (
            customRowClassColumnId !== undefined
            && customRowClassFn !== undefined
            && customRowClassFn(row.getValue(customRowClassColumnId)))
          },
        ]"
        data-testid="table-row"
      >
        <div
          class="table-cells"
          :class="{'table-cells-expanded' : row.getIsExpanded() && canExpand(row),
                   'table-cells-expandable' : canExpand(row)}"
          @click="() => rowExpandHandler(row)"
        >
          <div
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            class="table-cell"
            data-testid="table-cell"
            :style="{ width: `${cell.column.getSize()}px` }"
          >
            <component
              :is="cell.column.columnDef.cell(cell.getValue() as any)"
              v-if="typeof cell.column.columnDef.cell === 'function'"
            />
          </div>
        </div>
        <div
          v-if="row.getIsExpanded() && canExpand(row)"
          class="table-expand"
        >
          <component
            :is="subRowComponent"
            :data="row.original[subRowProperty]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.table {
  width: 100%;
  border: none;
  border-radius: 10px;
  padding-top: 15px;

  &-transparent {
    background-color: transparent;
  }

  &-black {
    background-color: black;
  }

  &-inner {
    padding: 32px;
  }

  .plus {
    color: #ceee86;

    &::before {
      content: "+";
    }
  }

  .minus {
    color: #e76c45;
  }

  .table-header {
    margin-bottom: 15px;

    .table-row-header {
      display: flex;
      padding-left: 30px;
      padding-right: 30px;
    }

    .table-row {
      padding-top: 15px;
    }

    .table-header-column {
      border: none;
      color: #fff;
      font-family: 'Space Grotesk';
      font-size: 10px;
      text-transform: capitalize;
      padding: 0;
      text-align: left;

      > div {
        display: flex;
        align-items: center;
        width: fit-content;
        cursor: pointer;
      }
    }

    .table-header-column-sort-cta {
      background-color: transparent;
      border: none;
      padding: 0;
      margin-left: 10px;
      margin-top: -1px;
      outline: 0;
      cursor: pointer;

      svg {
        width: 10px;
        fill: #fff;

        &.sort-cta-desc {
          transform: rotate(-180deg);
        }
      }
    }
  }

  .table-body {
    .table-row {
      display: flex;
      border-radius: 10px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }

    &:last-child {
      margin-bottom: 0;
    }

    .table-cells {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 20px 30px;

      &-expandable {
        cursor: pointer;
      }
    }

    .table-expand {
      width: 100%;
      padding: 20px 30px;
      border-radius: 0 0 10px 10px;
    }

    .table-cell {
      color: #fff;
      font-size: 14px;
    }
  }
}

.table-cell-pool {
  display: flex;
  align-items: center;

  .table-cell-pool-icons {
    display: flex;
    align-items: center;
    margin-right: 10px;

    .table-cell-pool-icon {
      width: 35px;
      margin-right: 5px;

      svg {
        width: 100%;
      }

      &:last-child {
        margin-right: 0;
      }

      .logo {
        .logo-background {
          min-height: 35px;
        }
      }
    }
  }

  .table-cell-pool-body {
    .table-cell-pool-pairs {
      span {
        font-size: 16px;
        color: #fff;
      }
    }

    .table-cell-pool-exchange {
      span {
        font-size: 13px;
        color: #777e90;
      }
    }
  }
}

.table-cell-swap {
  display: flex;
  align-items: center;
  width: 100%;

  .table-cell-body {
    width: 100%;
    max-width: 100%;
    font-size: 13px;
    color: #fff;

    .pool {
      display: flex;
      align-items: center;

      .pool-icons {
        display: flex;
        align-items: center;
        margin-right: 10px;

        .pool-icon {
          margin-right: 5px;

          &:last-child {
            margin-right: 0;
          }
        }
      }

      .pool-pair {
        span {
          font-size: 16px;
        }
      }
    }

    .token {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 200px;
      max-width: 100%;
      overflow: hidden;

      .token-icon {
        margin-right: 5px;
      }

      .pool-pair {
        p {
          font-size: 16px;
        }

        .sub-text {
          max-width: 180px;

          span {
            color: #777e90;
          }
        }
      }
    }

    .money-with-change {
      display: flex;

      .total {
        margin-right: 5px;
      }

      .change {
        font-size: 11px;
      }
    }

    .user-pools {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-left: 20px;
      width: 36px;

      .user-pool {
        width: 12px;
        height: 12px;
        border-radius: 100%;
      }

      .lp-key {
        width: 11.4px;
        height: 11px;
        background: #6d7ee5;
        box-shadow:
          inset 0 0 5px #919eeb,
          inset 2px 0 8px #6d7ee5,
          inset -2px 0 8px #454f82,
          inset 2px 0 10px #6d7ee5,
          inset -2px 0 10px #454f82,
          0 0 5px #919eeb,
          -1px 0 8px #6d7ee5,
          1px 0 8px #454f82;
      }

      .lp-balance {
        width: 11.4px;
        height: 11px;
        background: #ceee86;
        box-shadow:
          inset 0 0 5px #daf2a4,
          inset 2px 0 8px #ceee86,
          inset -2px 0 8px #86ab33,
          inset 2px 0 10px #ceee86,
          inset -2px 0 10px #86ab33,
          0 0 5px #daf2a4,
          -1px 0 8px #ceee86,
          1px 0 8px #86ab33;
      }
    }

    .pool-rewards {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: #777e90;

      .pool-reward {
        margin-bottom: 5px;
      }
    }
  }
}

@media (max-width: 1309px) {
  .table {
    .table-body {
      .table-row {
        .table-expand {
          padding: 20px 15px;
        }
      }

      .table-cells {
        padding: 20px 15px;
      }
    }

    &-inner {
      padding: 15px;
    }
  }
}
</style>
