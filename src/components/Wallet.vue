<script setup lang="ts">
import { computed, ref } from 'vue';
import { useWallet } from '../stores/walletStore';
import {storeToRefs} from 'pinia';
import {getConfig} from '../lib/utils';

const config = getConfig();
const secretChainId: string = Object.keys(config.chains).find((nextChainId) => config.chains[nextChainId].name === 'Secret') ?? 'Not found';

const walletStore = useWallet();
const {
  clearWallet,
  updateWallet,
} = walletStore;
const {
  wallet
} = storeToRefs(walletStore);

const showWalletDropdown = ref(false);

const buttonTitle = computed(() => {
  if(!wallet.value.isConnected) {
    return 'Connect Wallet';
  }
  return wallet.value.name;
});

const walletButton = () => {
  if(!wallet.value.isConnected) {
    updateWallet(Object.keys(config.chains))
  }
  showWalletDropdown.value = !showWalletDropdown.value;
};

const disconnectWallet = () => {
  showWalletDropdown.value = false;
  clearWallet();
};

const minify = (addr: string) => `${addr.slice(0, 12)}...${addr.slice(addr.length - 4, addr.length)}`;

</script>
<template>
  <div class="wallet-outline">
    <button @click="walletButton()" class="wallet-button">
      {{ buttonTitle }}
    </button>
  </div >
  <div class="card wallet-dropdown" :class="{'wallet-hidden': !showWalletDropdown}">
    <h2> {{ buttonTitle }} </h2>
    <div v-if="wallet.isConnected" class="card addr-card">
      <p>{{ minify(wallet.chainAddresses[secretChainId]) }}</p>
    </div>
    <div class="info-row">
      <p>Copy Address</p>
    </div>
    <div class="info-row">
      <p>View in Explorter</p>
    </div>
    <button @click="disconnectWallet()" class="disconnect-button">
      Disconnect Wallet
    </button>
  </div>
</template>
<style lang="scss" scoped>
.wallet-outline{
  border-radius: 8px;
  margin: 48px 40px;

  .wallet-button {
    height: 29px;
    width: 160px;
  }
}
.wallet-hidden {
  visibility: hidden;
}
.wallet-dropdown {
  position: fixed;
  margin-right: 40px;
  margin-top: 92px;
  z-index: 1;
  padding: 12px 16px; 

  .addr-card {
    margin-top: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
  }
  .info-row {
    margin-top: 8px;
    cursor: pointer;
  }
  .disconnect-button{
    margin-top: 8px;
    width: 256px;
    background: linear-gradient(180deg, #F2A44F 0%, #944825 100%);
    backdrop-filter: blur(8px);
    border: none;
  }
}
</style>
