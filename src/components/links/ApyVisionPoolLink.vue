<script lang="ts" setup>
import { TitleTokens, useApyVisionHelpers } from '@/composables/external/useApyVisionHelpers';
import { getAddressFromPoolId } from '@/lib/utils';

/**
 * TYPES
 */
type Props = {
  poolId: string;
  titleTokens: TitleTokens;
};

/**
 * PROPS & EMITS
 */
defineProps<Props>();

/**
 * COMPOSABLES
 */
const { poolPathSymbolSegment, apyVisionNetworkName } = useApyVisionHelpers();
</script>

<template>
  <div class="w-fit h-fit group mt-6 flex items-center">
    <BalLink
      :href="'https://app.apy.vision/pools/balancerv2_' + apyVisionNetworkName + '-' + poolPathSymbolSegment(titleTokens) + '-' + getAddressFromPoolId(poolId)"
      external
      noStyle
      class="link link-black flex items-center font-medium"
    >
      <img width="32" height="32" class="mr-2 rounded-full transition group-hover:shadow-lg" src="@/assets/images/icons/apy-vision.svg" alt="" />
      {{ $t('apyvisionPoolInsights') }}
      <BalIcon name="arrow-up-right" size="sm" class="ml-0.5 text-gray-500 transition-colors hover:text-blue-400 group-hover:text-blue-500" />
    </BalLink>
  </div>
</template>
