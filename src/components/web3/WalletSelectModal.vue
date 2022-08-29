<template>
  <BalModal :show="isVisible" noPad @close="$emit('close')">
    <div class="p-[12px]">
      <div class="header px-[8px]">
        <div class="title">Connect a wallet</div>
        <X v-on:click="$emit('close')" />
      </div>
      <WalletButton v-for="wallet in wallets" :key="wallet" :wallet="wallet" />
    </div>
  </BalModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import WalletButton from '@/components/web3/WalletButton.vue';
import { EXTERNAL_LINKS } from '@/constants/links';
import { SupportedWallets } from '@/services/web3/web3.plugin';
import X from './x.vue';

export default defineComponent({
  components: {
    WalletButton,
    X,
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
      wallets: SupportedWallets,
      EXTERNAL_LINKS,
    };
  },
});
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
}

.title {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
}
</style>
