<template>
  <button class="wallet-connect-btn" @click="handleClick">
    <div class="flex items-center justify-between" style="width: 100%">
      <h5 class="text-base text-gray-700 dark:text-white">
        <span class="capitalize">{{ WalletNameMap[wallet] }}</span>
      </h5>
      <img :src="require(`@/assets/images/connectors/${wallet}.svg`)" class="h-[24px] w-[24px]" />
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import useWeb3 from '@/services/web3/useWeb3';
import { Wallet, WalletNameMap } from '@/services/web3/web3.plugin';
export default defineComponent({
  props: {
    wallet: {
      type: String as PropType<Wallet>,
      required: true,
    },
  },
  setup(props) {
    const { connectWallet, toggleWalletSelectModal } = useWeb3();
    function handleClick() {
      connectWallet(props.wallet);
      toggleWalletSelectModal(false);
    }
    return {
      WalletNameMap,
      handleClick,
    };
  },
});
</script>

<style scoped>
.wallet-connect-btn {
  @apply transition-all;
  /* @apply bg-white dark:bg-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800; */
  /* @apply border dark:border-gray-900; */
  @apply flex h-14 w-full items-center justify-start rounded-md bg-frame-light shadow-lg;
  box-shadow: inset 0px 0px 1px rgba(255, 251, 251, 0.25);
  border-radius: 16px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding-left: 16px;
  padding-right: 16px;
}
</style>
