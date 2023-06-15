<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps({
  tokenName: {
    type: String,
    required: true,
  },
  logoLink: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="logo">
    <img
      class="icon-img"
      :src="logoLink"
      :alt="`${tokenName} Icon`"
    >
  </div>
</template>

<style lang="scss" scoped>
  .icon-img {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
