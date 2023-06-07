<script setup lang="ts">
import { Pool, PoolToken } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';
import { computed, toRefs, ref, onMounted, onBeforeMount } from 'vue';
import { TokensData } from './composables/useTokenBreakdown';

import { isWeightedLike, usePoolHelpers } from '@/composables/usePoolHelpers';
import { useTokens } from '@/providers/tokens.provider';
import { tokenInfo as tokenInfoFunc } from '@/lib/config/aurora/tokensInfo';
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
const { isDeepPool } = usePoolHelpers(rootPool);
const isWeighted = isWeightedLike(rootPool.value.poolType);
const { getToken } = useTokens();
// const tokenInfo: typeof TokenInfo = getTokenInfo(token.value.address);
/**
 * COMPUTED
 */
// The nested level, the top level being 0, the level below that 1, etc.
const currentLevel = computed(() => props.parentLevel + 1);
const tokenInfo = tokenInfoFunc(token.value.address);
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
const dots = ref(null);
const more = ref(null);
const moreButton = ref(null);
onMounted(() => {});
function symbolFor(token: PoolToken): string {
  return getToken(token.address)?.symbol || token.symbol || '---';
}
function getSocialIcon(link: string): string | undefined {
  if (link.includes('twitter.com')) return 'twitter';
  if (link.includes('facebook.com')) return 'facebook';
  if (link.includes('coingecko.com')) return 'trending-up';
  if (link.includes('discord.com')) return 'message-circle';
  return 'link-2';
}
function toggleText(this) {
  var button = moreButton;

  if (dots.value.classList.contains('hidden')) {
    dots.value.classList.remove('hidden');
    more.value.classList.add('hidden');
    moreButton.value.innerHTML = 'Read more';
  } else {
    dots.value.classList.add('hidden');
    more.value.classList.remove('hidden');
    moreButton.value.innerHTML = 'Read less';
  }
}
</script>

<template>
  <div class="flex flex-col p-3" :class="['', nestedPaddingClass]">
    <div
      class="py-1 mb-3 text-xsm font-bold text-center dark:text-polaris-white dark:bg-polaris-card-medium rounded-[12px]"
    >
      Pool Composition
    </div>
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
        :size="
          isDeepPool && currentLevel > 2
            ? 24
            : isDeepPool && currentLevel > 1
            ? 28
            : 36
        "
      />
      <span class="text-xl font-semibold dark:text-polaris-white">{{
        symbolFor(token)
      }}</span>
      <BalIcon
        name="arrow-up-right"
        size="lg"
        class="ml-1 text-gray-500 group-hover:text-purple-500 dark:text-polaris-white dark:group-hover:text-yellow-500 transition-colors"
      />
    </BalLink>
    <template v-if="tokenInfo != undefined">
      <div class="mt-2 font-medium">
        <span ref="dots">{{ tokenInfo?.Info.substring(0, 80) }} ...</span>
        <span ref="more" class="hidden">{{ tokenInfo?.Info }} </span>
      </div>
      <div class="flex">
        <div class="flex-1 pt-4">
          <template
            v-for="(link, index) in tokenInfo?.Links"
            v-if="tokenInfo != undefined"
          >
            <BalLink external :href="link" tag="a" class="mr-2">
              <BalIcon :name="getSocialIcon(link)" size="sm" />
            </BalLink>
          </template>
        </div>
        <button
          ref="moreButton"
          class="mt-3 ml-3 font-semibold dark:text-polaris-white duration-300"
          @click="toggleText"
        >
          Read more
        </button>
      </div>
    </template>
    <div
      class="flex p-2 font-semibold dark:text-polaris-white composition-data"
    >
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
        {{
          showUserShares ? tokenData.userBalanceLabel : tokenData.balanceLabel
        }}
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
.composition-data {
  border-top: 1px solid rgba(65, 54, 94, 0.4);
  margin-top: 24px;
  font-size: 16px;
  line-height: 20px;
}
.subheadline {
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

.level-1 {
  @apply py-4 font-medium hover:bg-gray-50 hover:dark:bg-gray-800;
}

.level-2 {
  @apply py-3.5 bg-gray-100/20 hover:bg-gray-50 dark:bg-gray-850 hover:dark:bg-gray-800;
}

.level-3 {
  @apply py-3 text-sm text-secondary bg-gray-100/50 hover:bg-gray-100/70 dark:bg-gray-900/50 hover:dark:bg-gray-800;
}

.level-4 {
  @apply py-2.5 text-sm text-secondary bg-gray-100 hover:bg-gray-100/50 dark:bg-gray-900 hover:dark:bg-gray-800;
}

.level-2 > a {
  @apply pl-8;
}

.level-3 > a {
  @apply pl-16;
}

.level-4 > a {
  @apply pl-20;
}
</style>
