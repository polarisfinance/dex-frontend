<script setup lang="ts">
import { Pool, PoolToken } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';
import { computed, toRefs } from 'vue';
import { TokensData } from './composables/useTokenBreakdown';

import { isWeightedLike, usePool } from '@/composables/usePool';
import { useTokens } from '@/providers/tokens.provider';

/**
 * TYPES
 */
type Props = {
  token: PoolToken;
  parentLevel?: number;
  showUserShares: boolean;
  rootPool: Pool;
  tokensData: TokensData;
};

/**
 * PROPS
 */
const props = withDefaults(defineProps<Props>(), {
  parentLevel: 0,
});

const { token, showUserShares, rootPool } = toRefs(props);
const tokenData = computed(() => props.tokensData[token.value.address]);

/**
 * COMPOSABLES
 */
const { explorerLinks } = useWeb3();
const { isDeepPool } = usePool(rootPool);
const isWeighted = isWeightedLike(rootPool.value.poolType);
const { getToken } = useTokens();

/**
 * COMPUTED
 */
// The nested level, the top level being 0, the level below that 1, etc.
const currentLevel = computed(() => props.parentLevel + 1);

const nestedPaddingClass = computed(() => {
  return;
  switch (currentLevel.value) {
    case 1:
      return 'level-1';
    case 2:
      return 'level-2';
    case 3:
      return 'level-3';
    case 4:
      return 'level-4';
    default:
      return 'pl-4';
  }
});

/**
 * METHODS
 */
function symbolFor(token: PoolToken): string {
  return getToken(token.address)?.symbol || token.symbol || '---';
}
</script>

<template>
  <div class="flex flex-col"
    :class="[
      '',
      nestedPaddingClass,
    ]"
  >
    <div class="dark:bg-polaris-card-medium dark:text-polaris-white text-center text-xsm rounded-[12px] font-bold mb-3">Pool Composition</div>

    <BalLink
      :href="explorerLinks.addressLink(token.address)"
      external
      noStyle
      class="group flex items-center"
    >
      <BalAsset
        :address="token.address"
        :class="
          isDeepPool && currentLevel > 1 ? 'nested-token' : 'mr-2 shrink-0 z-10'
        "
        :size="isDeepPool && currentLevel > 1 ? 28 : 36"
      />
      <span
        class="dark:text-polaris-white font-semibold text-xl"
        >{{ symbolFor(token) }}</span
      >
      <BalIcon
        name="arrow-up-right"
        size="sm"
        class="ml-1 text-gray-500 group-hover:text-purple-500 dark:group-hover:text-yellow-500 transition-colors"
      />
    </BalLink>
    <div class="composition-data flex p-2 dark:text-polaris-white font-semibold">
      <div class="flex-1 text-left">
        <div class="subheadline">{{ $t('poolComposition.token%') }}</div>
        {{ tokenData.getTokenPercentageLabel() }}
      </div>
      <div v-if="isWeighted" class="flex-1 text-center">
        <div class="subheadline">{{ $t('weight') }}</div>
        {{ tokenData.tokenWeightLabel }}
      </div>
      <div class="flex-1 text-center">
        <div class="subheadline">{{ $t('balance') }}</div>
        {{ showUserShares ? tokenData.userBalanceLabel : tokenData.balanceLabel }}
      </div>
      <div class="flex-1 text-right">
        <div class="subheadline">{{ $t('value') }}</div>
        {{ showUserShares ? tokenData.userFiatLabel : tokenData.fiatLabel }}
      </div>
      
    </div>
  </div>

  <template v-if="isDeepPool">
    <TokenBreakdown
      v-for="nestedToken in token.token?.pool?.tokens"
      :key="nestedToken.address"
      :token="nestedToken"
      :parentLevel="currentLevel"
      :showUserShares="showUserShares"
      :rootPool="rootPool"
      :tokensData="tokensData"
    />
  </template>
</template>
<style scoped>

.composition-data{
  border-top: 1px solid rgba(65, 54, 94, 0.4);
  margin-top: 24px;
  font-size: 16px;
  line-height: 20px;
}
.subheadline{
  @apply dark:text-polaris-2;
  border-radius: 12px;
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
  margin-top: 16px;
  margin-bottom: 16px;
}
.nested-token {
  @apply flex-shrink-0 mr-2 relative ml-1 sm:ml-0;
}

.nested-token :deep(img) {
  position: relative;
  z-index: 1;
}

.nested-token::after {
  content: '';
  top: 14px;
  left: -15px;
  @apply absolute border border-solid bg-gray-200 border-gray-200 dark:border-gray-700 w-3 dark:bg-gray-700;
}

.nested-token::before {
  content: '';
  height: calc(100% + 14px);
  left: -15px;
  top: -28px;
  @apply absolute border bg-gray-200 border-gray-200 dark:border-gray-700 dark:bg-gray-700;
}

.level-1 {
  @apply pl-4 z-20;
}

.level-2 {
  @apply pl-12 z-10;
}

.level-3 {
  @apply pl-20 relative -left-1;
}

.level-3 a {
  @apply relative;
}

.level-3 a::before {
  content: '';
  height: calc(100% + 16px);
  left: -36px;
  top: -28px;
  @apply absolute bg-gray-200 border border-gray-200 dark:border-gray-700 dark:bg-gray-700;
}

@media (min-width: 640px) {
  .level-3 a::before {
    left: -43px;
  }
}

.level-3:last-child a::before,
.level-3:nth-last-child(2) a::before {
  content: '';
  @apply border-0;
}

.level-4 {
  @apply pl-24;
}
</style>
