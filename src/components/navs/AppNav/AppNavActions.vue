<script lang="ts" setup>
import { computed } from 'vue';

import DarkModeToggle from '@/components/btns/DarkModeToggle.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import { useSidebar } from '@/composables/useSidebar';
import useWeb3 from '@/services/web3/useWeb3';

import AppNavAccountBtn from './AppNavAccountBtn.vue';
import AppNavActivityBtn from './AppNavActivityBtn/AppNavActivityBtn.vue';
import AppNavMenu from './AppNavMenu.vue';

/**
 * COMPOSABLES
 */
const { isMobile, isDesktop } = useBreakpoints();
const { account, connector, startConnectWithInjectedProvider } = useWeb3();
const { setSidebarOpen } = useSidebar();

/**
 * COMPUTED
 */
const hideNetworkSelect = computed(() => connector.value?.id === 'gnosis');
</script>

<template>
  <div class="items-grid grid grid-flow-col grid-rows-1 gap-2">
    <!-- <DarkModeToggle v-if="isDesktop" /> -->
    <!-- <AppNavActivityBtn v-if="account" /> -->
    <AppNavAccountBtn v-if="account" />
    <button
      class="btn"
      v-else-if="isDesktop"
      :size="isMobile ? 'md' : 'sm'"
      @click="startConnectWithInjectedProvider"
    >
      <!-- <WalletIcon class="mr-2" /> -->
      <span class="hidden lg:inline-block w-[100px]" v-text="$t('connectWallet')" />
      <span class="lg:hidden" v-text="$t('connect')" />
    </button>
    <AppNavMenu />
    <button v-if="isMobile" @click="setSidebarOpen(true)" class="menu-btn">
      <BalIcon name="menu" size="lg" />
    </button>
  </div>
</template>

<style scoped>
button {
  @apply bg-transparent;
  padding: 9px 49px;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #fdfdfd;
  border: 1px solid rgba(64, 51, 71, 0.5);
  border-radius: 12px;
}

.menu-btn {
  background: none;
  color: white;
}

.btn:hover {

}

.btn:active {

}
</style>
