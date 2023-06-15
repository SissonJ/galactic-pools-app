<script setup lang="ts">
import {storeToRefs} from 'pinia';
import { defineProps, ref } from 'vue';
import {useWallet} from '../../stores/walletStore';
import DepositModal from '../modal/DepositModal.vue';
import {Observable} from 'rxjs';
import {TxResponse} from 'secretjs';
import {getConfig} from '../../lib/utils';

const config = getConfig();

const props = defineProps({
  data: {
    type: String,
    required: true,
  }
});

const walletStore = useWallet();
const {
  updateWallet
} = walletStore;
const {
  wallet
} = storeToRefs(walletStore);

const isDepositModalOpen = ref(false);
const toggleIsDepositModalOpen = () => {
  isDepositModalOpen.value = !isDepositModalOpen.value;
};

const depositCoins = (depositOperation: Observable<TxResponse>) => {
  // TODO set some loading state
  depositOperation.subscribe({
    next: (txResponse) => {
      // TODO do something with the tx response
      toggleIsDepositModalOpen(); // Close the modal
    },
    complete: () => {
      // TODO update user data
      // TODO success message
    },
  });
};

</script>
<template>
  <div class="cell-pool">
    <button v-if="wallet.isConnected" @click.stop="toggleIsDepositModalOpen"> Deposit </button>
    <button v-else @click.stop="updateWallet(Object.keys(config.chains))"> Connect Wallet </button>
  </div>
  <DepositModal
      :open="isDepositModalOpen"
      :contract="data"
      @trigger-modal="toggleIsDepositModalOpen"
      @trigger-deposit="depositCoins"
  />
</template>
<style lang="scss" scoped>
.cell-pool {
  display: flex;
  align-items: center;
  justify-content: right;

  button {
    width: 150px;
  }
}
</style>
