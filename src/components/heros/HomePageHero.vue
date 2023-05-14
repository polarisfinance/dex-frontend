<script lang="ts" setup>
import { computed } from 'vue';

import AppHero from '@/components/heros/AppHero.vue';
import useFathom from '@/composables/useFathom';
import { EXTERNAL_LINKS } from '@/constants/links';
import useWeb3 from '@/services/web3/useWeb3';
import useBreakpoints from '@/composables/useBreakpoints';
import HeroConnectWalletButton from './HeroConnectWalletButton.vue';

/**
 * COMPOSABLES
 */
const { isWalletReady, isWalletConnecting } = useWeb3();
const { trackGoal, Goals } = useFathom();
const { upToMediumBreakpoint, isMobile, isDesktop } = useBreakpoints();
/**
 * COMPUTED
 */
const classes = computed(() => ({
  // ['h-64']: !isWalletReady.value && !isWalletConnecting.value,
  // ['h-44']: isWalletReady.value || isWalletConnecting.value,
}));
</script>

<template>
  <AppHero :class="classes">
    <h1
      class="mx-auto font-semibold headline"
      :class="{
        'text-hero': isDesktop,
        'text-[44px] leading-[50px]': isMobile,
      }"
    >
      Put your assets to work.
    </h1>
    <h1 class="mx-auto max-w-md home-subtitle mt-[32px]">
      Collect fees from pool and rebalances automatically.
    </h1>
    <template v-if="!isWalletReady && !isWalletConnecting">
      <div class="flex justify-center mt-6">
        <HeroConnectWalletButton class="mr-4" />
        <BalBtn
          tag="a"
          :href="`#hot-pools`"
          rel="noreferrer"
          color="white"
          class="font-semibold"
          @click="trackGoal(Goals.ClickHeroLearnMore)"
        >
          Start earning
          <BalIcon name="arrow-down" size="sm" class="ml-1" />
        </BalBtn>
      </div>
    </template>
    <div
      v-if="isDesktop"
      class="flex justify-center w-full text-base font-semibold dark:text-polaris-white my-[80px]"
    >
      <div>
        <div class="flex my-12 boost">
          <div class="dark:text-polaris-2">
            <div class="text-hero leading-[65px]">2.5x</div>
            Up to current APR
          </div>
          <div class="self-center max-w-[44%]">
            Boost liquidity mining yields up to 2.5x
          </div>
        </div>
        <div class="flex my-12 boost">
          <div class="dark:text-polaris-2">
            <div class="text-hero leading-[65px]">30%</div>
            Up to current APR
          </div>
          <div class="self-center max-w-[44%]">
            Boost liquidity mining yields up to 2.5x
          </div>
        </div>
      </div>
      <div class="self-end mb-12 text-left">
        <div class="balancer-info mb-[16px]">
          Portfolios that <span class="yield">generate yield </span>
          and rebalance automatically.
        </div>
        <a
          href="https://medium.com/@PolarisFinance/polaris-dex-917e45c4869c"
          target="_blank"
          rel="noreferrer"
          class="read-button"
          @click="trackGoal(Goals.ClickHeroLearnMore)"
        >
          Read our medium
        </a>
      </div>
    </div>
  </AppHero>
</template>

<style>
.headline {
  @apply text-gray-800 dark:text-polaris-white;
}
.read-button {
  padding: 8px 20px;
  gap: 10px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #fdfdfd;
  background: linear-gradient(rgba(21, 1, 40, 1), rgba(21, 1, 40, 1))
      padding-box,
    linear-gradient(90deg, rgba(192, 4, 254, 1), rgba(126, 2, 245, 1))
      border-box;
  border: 1px solid transparent;
}
.read-button:hover {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
}
.yield {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
