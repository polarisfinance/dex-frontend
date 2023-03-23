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
    <h1 class="headline mx-auto font-semibold" :class="{'text-hero':isDesktop,'text-[44px] leading-[50px]':isMobile}">Put your assets to work.</h1>
    <h1 class="home-subtitle max-w-md mx-auto mt-[32px]">Collect fees from pool and rebalances automatically.</h1>
    <template v-if="!isWalletReady && !isWalletConnecting">
      <div class="flex justify-center mt-6">
        <HeroConnectWalletButton class="mr-4" />

        <BalBtn
          tag="a"
          :href="EXTERNAL_LINKS.Balancer.Home"
          target="_blank"
          rel="noreferrer"
          color="white"
          outline
          @click="trackGoal(Goals.ClickHeroLearnMore)"
        >
          {{ $t('learnMore') }}
          <BalIcon name="arrow-up-right" size="sm" class="ml-1" />
        </BalBtn>
      </div>
    </template>
    <div class="my-[80px] flex w-full justify-center dark:text-polaris-white font-semibold text-base" v-if="isDesktop">
      <div>
        <div class="boost flex my-12">
          <div class="dark:text-polaris-2">
            <div class="text-hero leading-[65px]">2.5x</div>
            Up to current APR
          </div>
          <div class="self-center max-w-[44%]">Boost liquidity mining yields up to 2.5x</div>
        </div>
        <div class="boost flex  my-12">
          <div class="dark:text-polaris-2">
            <div class="text-hero leading-[65px]">30%</div>
            Up to current APR
          </div>
          <div class="self-center max-w-[44%]">Boost liquidity mining yields up to 2.5x</div>
        </div>
      </div>
      <div class="text-left self-end mb-12">
        <div class="balancer-info mb-[16px]">
        Portfolios that <span class="yield">generate yield </span>
        and rebalance automatically.
        </div>
        <a
          href="https://medium.com/@PolarisFinance/polaris-dex-917e45c4869c"
          target="_blank"
          rel="noreferrer"
          @click="trackGoal(Goals.ClickHeroLearnMore)"
          class="read-button"
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
.read-button{
  padding: 8px 20px;
  gap: 10px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #FDFDFD;
  background: linear-gradient(rgba(21, 1, 40, 1),rgba(21, 1, 40, 1)) padding-box,
  linear-gradient(90deg,rgba(192, 4, 254, 1), rgba(126, 2, 245, 1)) border-box;
  border: 1px solid transparent;
}
.read-button:hover{
  background: linear-gradient(93.62deg, #C004FE 2.98%, #7E02F5 97.02%);
}
.yield{
  background: linear-gradient(93.62deg, #C004FE 2.98%, #7E02F5 97.02%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
