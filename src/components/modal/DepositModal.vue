<script lang="ts" setup>
import {
  defineProps, defineEmits, computed, ref, onMounted, watch,
} from 'vue';
import Logo from '../Logo.vue';
import BaseModal from './BaseModal.vue';
import {usePools} from '../../stores/poolStore';
import {useBalances} from '../../stores/balanceStore';
import InputBigNumber from '../InputBigNumber.vue';
import Range from '../Range.vue';
import {getConfig} from '../../lib/utils';
import {sendDepositTx$} from '../../services/pool';

const config = getConfig();

const props = defineProps({
  open: Boolean,
  contract: String,
});

defineEmits(['triggerModal', 'triggerDeposit']);

const depositAmount = ref('');

const pools = usePools();

const balances = useBalances();

const poolInfo = computed(() => {
  if(pools.isReady) {
    return pools.pools[props.contract as string];
  }
  return undefined;
})

const tokenConfig = computed(() => {
  if(pools.isReady) {
    return config.tokens[pools.pools[props.contract as string].token.addrOrDenom];
  }
  return undefined;
});

const tokenBal = computed(() => {
  return balances.getBalance(tokenConfig.value?.addr ?? '');
});

const depositObservable$ = computed(() => (
  sendDepositTx$({ // TODO
    contractAddress: poolInfo.value?.poolContract.address!,
    codeHash: poolInfo.value?.poolContract.address!,
    denomOrAddr: poolInfo.value?.token.addrOrDenom!,
    amountUDenom: depositAmount.value,
  })
));

const maxAmount = () => {
  depositAmount.value = tokenBal.value;
};

watch(tokenConfig, () => {
  if(tokenConfig.value !== undefined && balances.getBalance(tokenConfig.value.addr) === undefined) {
    balances.updateBalance(tokenConfig.value.addr);
  }
})

onMounted(() => {
  if(tokenConfig.value !== undefined && balances.getBalance(tokenConfig.value.addr) === undefined) {
    balances.updateBalance(tokenConfig.value.addr);
  }
});
</script>

<template>
  <BaseModal
    v-if="open"
    @close="() => $emit('triggerModal', false)"
    title="Deposit"
  >
    <template #body>
      <div class="body">
        <div class="balance">
          <p> Available: </p>
          <button @click="maxAmount"> {{ tokenBal ?? '-' }} </button>
        </div>
        <div class="card input-container">
          <div class="logo-and-name">
            <Logo
              v-if="tokenConfig !== undefined"
              :token-name="tokenConfig.name"
              :logo-link="tokenConfig.logoPath"
            />
            <h2 v-if="tokenConfig !== undefined"> 
              {{ tokenConfig.name }}
            </h2>
          </div>
          <div class="input">
            <InputBigNumber
              v-model="depositAmount"
              :decimals="6"
            />
          </div>
        </div>
        <div class="slider">
          <Range 
            v-model="depositAmount"
            :max="tokenBal"
          />
        </div>
        <div class="card">
          <div class="stats-row">
            <p>My Liquidity:</p>
            <p>$0.00</p>
          </div>
          <div class="stats-row">
            <p>My Share of Pool:</p>
            <p>0.00%</p>
          </div>
          <div class="stats-row">
            <p>APY:</p>
            <p>0.00%</p>
          </div>
          <div class="stats-row">
            <p>Other</p>
            <p>$0.00</p>
          </div>
        </div>
        <div class="deposit-button">
          <button
              @click="() => $emit('triggerDeposit', depositObservable$)"
            > Deposit </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
.body {
  padding: 0 55px;

  .balance {
    display: flex;
    justify-content: right;
    align-items: center;

    p {
      font-size: 14px;
    }

    button {
      font-size: 16px;
      backdrop-filter: none;
      border: none;
      background-color: transparent;
    }
  }

  .input-container {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    margin-bottom: 36px;

    .logo-and-name {
      display: flex;
      align-items: center;

      h2 {
        margin-left: 5px;
      }
    }
  }

  .slider {
    margin-bottom: 36px;
  }
  
  .card {
    padding: 16px;
    margin-bottom: 24px;

    .stats-row {
      display: flex;
      justify-content: space-between;

      p {
        font-size: 13px;
      }
    }
  }

  .deposit-button {
    button {
      width: 100%;
      height: 60px;
      font-size: 18px;
      border: 1px solid #F2A44F;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
    }

    button:hover {
      background: linear-gradient(180deg, #F2A44F 0%, #944825 100%);
      box-shadow: 4px 4px 8px rgba(28, 28, 31, 0.25);
      border: none;
    }
  }
}
</style>
