<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useWallet } from '../stores/walletStore';
import PoolsLogo from '../components/svgs/PoolsLogo.vue';
import {storeToRefs} from 'pinia';
import {createClients} from '../lib/wallet';
import {keplrAccountChange$} from '../services/keplr';
import Wallet from '../components/Wallet.vue';
import {getConfig} from '../lib/utils';

const config = getConfig();

const walletStore = useWallet();
const {
  updateWallet,
} = walletStore;
const {
  isAuto,
  wallet,
} = storeToRefs(walletStore);

// Create new clients each time wallet changes
watch(wallet, () => {
  if(wallet.value.isConnected) {
    createClients(Object.keys(wallet.value.chainAddresses));
  }
});

onMounted(() => {
  // Autoconnect if they've connected before
  if(isAuto.value) {
    updateWallet(Object.keys(config.chains)); //TODO use config
  }
  // Change wallet data on wallet change
  keplrAccountChange$().subscribe({
    next: () => {
      if(wallet.value.isConnected) {
        updateWallet(Object.keys(config.chains));
      }
    },
  });
});
</script>

<template>
  <div class="layout-default">
    <nav>
      <PoolsLogo class="logo"/>
      <div class="nav-card" >
        <button
          @click="$router.push('/home')"
          class="nav-button"
          >
          Home
        </button>
        <button
          @click="$router.push('/pools')"
          class="nav-button">
          Pools
        </button>
        <button 
          @click="$router.push('/analytics')"
          class="nav-button">
          Analytics
        </button>
        <button 
          class="nav-button">
          FAQ
        </button>
      </div>
    </nav>
    <main>
      <header>
        <Wallet />
      </header>
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.layout-default {
  display: flex;
  height: 100%;
  width: 100%;

  nav {
    position: fixed;
    width: 100%;
    height: 100%;
    border-right: 1.5px solid rgb(228 228 228 / 10%);
    max-width: 215px;
    padding: 40px;

    .logo {
      margin-bottom: 47px;
    }
    .nav-card {
      height: 158px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      border-radius: 8px;
      padding: 16px 24px;

      .nav-button {
        width: 167px;
        height: 29px;
        padding: 0px;
        margin-bottom: 12px;
      }

    }
  }
  
  main {
    margin-left: 294px;
    width: calc(100% - 294px);

    header {
      width: 100%;
      display: flex;
      justify-content: right;
      
    }
  }
}
</style>
