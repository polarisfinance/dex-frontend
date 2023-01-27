<script lang="ts" setup>
import { computed } from 'vue';

import AppHero from '@/components/heros/AppHero.vue';
import useFathom from '@/composables/useFathom';
import { EXTERNAL_LINKS } from '@/constants/links';
import useWeb3 from '@/services/web3/useWeb3';
import useBreakpoints from '@/composables/useBreakpoints';
import HeroConnectWalletButton from './HeroConnectWalletButton.vue';
import ArrowDownIcon2 from '../_global/icons/ArrowDownIcon2.vue';

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
  //['h-72']: !isWalletReady.value && !isWalletConnecting.value,
  //['h-46']: isWalletReady.value || isWalletConnecting.value,
}));
</script>

<template>
  <AppHero :class="classes" class="app-hero">
    <!-- <h1 class="headline" v-text="$t('ammPlatform')" /> -->
    <h1 class="home-title mx-auto">Put your assests to work.</h1>
    <h1 class="home-subtitle max-w-md mx-auto mt-[32px]">Collect fees from pool and rebalance automatically.</h1>
    <template v-if="!isWalletReady && !isWalletConnecting">
      <div class="mt-[60px] flex w-full justify-center">
        <HeroConnectWalletButton class="mr-[16px]" />
        <a
          :href="EXTERNAL_LINKS.Balancer.Home"
          target="_blank"
          rel="noreferrer"
          @click="trackGoal(Goals.ClickStartEarning)"
          class="start-earning-button"
        >
          Start earning
          <ArrowDownIcon2 class="inline ml-[20px]"/>
        </a>
      </div>
    </template>
    <div class="my-[80px] flex w-full justify-center" v-if="isDesktop">
      <div>
        <div class="boost flex my-12">
          <div>
            <div class="boost-value">2.5x</div>
            Up to current APR
          </div>
          <h5 class="boost-info self-center">Boost liquidity mining yield up to 2.5x</h5>
        </div>
        <div class="boost flex  my-12">
          <div>
            <div class="boost-value">30%</div>
            Up to current APR
          </div>
          <h5 class="boost-info self-center">Boost liquidity mining yield up to 2.5x</h5>
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

<style scoped>
.app-hero{
  margin-top:200px;
}
.headline {
  @apply pb-2 text-center font-display text-4xl font-black text-white md:text-5xl;

  font-weight: 600;
  font-variation-settings: 'wght' 700;
}

.home-title {
  font-weight: 600;
  font-size: 84px;
  line-height: 104px;
  text-align: center;
  color: #fdfdfd;
  max-width:600px;
}

.home-subtitle {
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  color: #A99BC6;
  max-width:300px;
}

.start-earning-button {
  border: 1px solid rgba(64, 51, 71, 0.5);
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  padding: 12px 14px 12px 44px;
  color: #FDFDFD;

}

.start-earning-button:hover {
  border: 1px solid #50456E;
}

.start-earning-button:active {
  border: 1px solid #50456E;
}
.boost-value{
  color: #A99BC6;
  font-weight: 600;
  font-size: 84px;
  line-height: 65px;
  letter-spacing: -0.02em;
}
.boost{
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: #A99BC6;
}
.boost-info{
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  margin-left: 31px;
  max-width: 40%;
  text-align: left;
  color: #FDFDFD;
}
.balancer-info{
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
}
.yield{
  background: linear-gradient(93.62deg, #C004FE 2.98%, #7E02F5 97.02%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
</style>
