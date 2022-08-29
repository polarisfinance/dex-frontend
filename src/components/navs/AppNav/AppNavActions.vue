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
  <div class="grid grid-rows-1 grid-flow-col gap-2 items-grid">
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
      <span class="hidden lg:inline-block" v-text="$t('connectWallet')" />
      <span class="lg:hidden" v-text="$t('connect')" />
    </button>
    <AppNavMenu /> 
    <button v-if="isMobile" @click="setSidebarOpen(true)" class="menu-btn">
      <BalIcon name="menu" size="lg" />
    </button>
  </div>
</template>

<style>
button {
  background: linear-gradient(
    94.14deg,
    #391b40 23.11%,
    rgba(57, 27, 64, 0.81) 81.52%
  );
  border-radius: 16px;
  padding: 10px 25px;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #fbaaff;
}

.menu-btn {
  background: none;
  color: white;
}

.btn:hover {
  background: linear-gradient(
    94.14deg,
    #391b40 23.11%,
    rgba(57, 27, 64, 0.81) 81.52%
  );
  border: 0.5px solid #ffffff;
  box-shadow: inset 0px 0px 1px rgba(255, 247, 247, 0.25);
  border-radius: 16px;
  padding: 10px 25px;
}

.btn:active {
  background: linear-gradient(
    94.14deg,
    #391b40 23.11%,
    rgba(57, 27, 64, 0.81) 81.52%
  );
  border: 1px solid #ffffff;
  box-shadow: inset 0px 0px 1px rgba(255, 247, 247, 0.25);
  border-radius: 16px;
}
</style>
