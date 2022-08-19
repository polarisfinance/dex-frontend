<template>
  <BalModal :show="isVisible" @close="$emit('close')">
    <div>
      <div class="title">Connect a wallet</div>
      <WalletButton v-for="wallet in wallets" :key="wallet" :wallet="wallet" />
    </div>
  </BalModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import WalletButton from '@/components/web3/WalletButton.vue';
import { EXTERNAL_LINKS } from '@/constants/links';
import { SupportedWallets } from '@/services/web3/web3.plugin';
export default defineComponent({
  components: {
    WalletButton,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    onShowThirdParty: {
      type: Function,
      required: true,
    },
  },
  emits: ['close'],
  setup() {
    return {
      wallets: SupportedWallets.filter(id => id !== 'gnosis'),
      EXTERNAL_LINKS,
    };
  },
});
</script>

<style>
.title {
  padding: '1em' !important;
}
</style>
