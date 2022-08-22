<script lang="ts" setup>
import { useRoute } from 'vue-router';

import useWeb3 from '@/services/web3/useWeb3';

const { isGoerli } = useWeb3();

import DesktopLinkItem from './DesktopLinkItem.vue';

/**
 * COMPOSABLES
 */
const route = useRoute();

/**
 * METHODS
 */
function isActive(page: string): boolean {
  if (route.name === page) return true;
  return false;
}
</script>

<template>
  <div class="desktop-links">
    <DesktopLinkItem to="/trade" :active="isActive('trade')">
      {{ $t('Swap') }}
    </DesktopLinkItem>
    <DesktopLinkItem to="/" :active="isActive('home')">
      {{ $t('Dawn') }}
    </DesktopLinkItem>
    <!-- <DesktopLinkItem v-if="isGoerli" to="/faucet" :active="isActive('faucet')">
      Faucet
    </DesktopLinkItem> -->
    <DesktopLinkItem to="/portfolio" :active="isActive('portfolio')">
      {{ $t('Sunrise') }}
    </DesktopLinkItem>
    <DesktopLinkItem to="/vebal" :active="isActive('vebal')">
      Bond
    </DesktopLinkItem>
    <DesktopLinkItem to="/vebal" :active="isActive('vebal')">
      Portfolio
    </DesktopLinkItem>
    <DesktopLinkItem to="/vebal" :active="isActive('vebal')">
      vexPolar
    </DesktopLinkItem>
    <!-- <DesktopLinkItem to="/claim" :active="isActive('claim')">
      <div class="flex items-center">
        {{ $t('claim') }}
        <StarsIcon class="ml-0.5 w-3.5 h-5" />
      </div>
    </DesktopLinkItem> -->
  </div>
</template>

<style scoped>
.desktop-links {
  @apply grid gap-x-6 grid-flow-col grid-rows-1 h-full content-center;
}
</style>
