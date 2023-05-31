<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import AppHero from '@/components/heros/AppHero.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import HeroConnectWalletButton from '@/components/heros/HeroConnectWalletButton.vue';
import useWeb3 from '@/services/web3/useWeb3';

const { isMobile, isDesktop } = useBreakpoints();
const { isWalletReady, isWalletConnecting } = useWeb3();
type Props = {
  title: string;
  description: string;
};
defineProps<Props>();

const classes = computed(() => ({
  // ['h-48']: !isWalletReady.value && !isWalletConnecting.value,
  // ['h-44']: isWalletReady.value || isWalletConnecting.value,
}));
</script>

<template>
  <AppHero :class="classes" class="mb-10">
    <h1
      class="mx-auto font-semibold headline mt-[130px]"
      :class="{
        'text-hero': isDesktop,
        'text-[44px] leading-[50px]': isMobile,
      }"
    >
      {{ title }}
    </h1>
    <div class="flex icons">
      <div><AddLiquidityIcon />Add Liquidity</div>

      <div><StakeIcon />Stake your LP</div>
      <div><BoostIcon />Get boost</div>
      <div><ClaimIcon />Claim anytime</div>
    </div>
    <div class="my-20 text-xl font-medium dark:text-polaris-3">
      Polaris Finance Protocol liquidity incentives are directed to pools by
      veXPOLAR voters. Stake in these pools to earn incentives. Boost with
      veXPOLAR for up to 2.5x extra on Mainnet pools.
    </div>

    <template v-if="!isWalletReady && !isWalletConnecting">
      <div class="text-3xl font-semibold text-white"></div>
      <HeroConnectWalletButton class="mt-4" />
    </template>
  </AppHero>
</template>

<style scoped>
.headline {
  @apply text-gray-800 dark:text-polaris-white;
}
.icons {
  @apply dark:text-polaris-white text-xl font-semibold mt-20;
}
.icons div svg {
  @apply block mb-5;
}
.icons div {
  @apply w-full text-left;
}
</style>
