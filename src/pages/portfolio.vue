<script setup lang="ts">
import { orderBy } from 'lodash';
import { computed, reactive, toRef, watch } from 'vue';
import StakedPoolsTable from '@/components/contextual/pages/pools/StakedPoolsTable.vue';
import UnstakedPoolsTable from '@/components/contextual/pages/pools/UnstakedPoolsTable.vue';
import VeBalPoolTable from '@/components/contextual/pages/pools/VeBalPoolTable.vue';
import PortfolioPageHero from '@/components/heros/PortfolioPageHero.vue';
import { useLock } from '@/composables/useLock';
import { providerUserPools } from '@/providers/local/user-pools.provider';
import { provideUserStaking } from '@/providers/local/user-staking.provider';
import { useTokens } from '@/providers/tokens.provider';
import { TokenInfoMap } from '@/types/TokenList';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useVeBal from '@/composables/useVeBAL';

/**
 * PROVIDERS
 */
const userStaking = provideUserStaking();
providerUserPools(userStaking);

/**
 * COMPOSABLES
 */
const { lockPool, lock } = useLock();
const { searchTokens, priceFor, balanceFor, dynamicDataLoading, nativeAsset } =
  useTokens();
const { fNum } = useNumbers();
interface ComponentState {
  loading: boolean;
  selectTokenList: boolean;
  query: string;
  results: TokenInfoMap;
  focussedToken: number;
}
const { veBalTokenInfo, isVeBalSupported } = useVeBal();
/**
 * STATE
 */
const state: ComponentState = reactive({
  loading: false,
  selectTokenList: false,
  query: '',
  results: {},
  focussedToken: 0,
});

const tokens = computed(() => {
  const tokensWithValues = Object.values(state.results).map(token => {
    const balance = balanceFor(token.address);
    const price = priceFor(token.address);
    const value = Number(balance) * price;
    return {
      ...token,
      price,
      balance,
      value,
    };
  });

  return orderBy(tokensWithValues, ['value', 'balance'], ['desc', 'desc']);
});
/**
 * WATCHERS
 */
watch(
  toRef(state, 'query'),
  async newQuery => {
    state.loading = true;
    state.results = await searchTokens(newQuery, {
      excluded: [isVeBalSupported ? veBalTokenInfo.value.address : ''],
      // disableInjection: props.disableInjection,
      disableInjection: true,
      subset: [],
    }).finally(() => {
      state.loading = false;
    });
    console.log(state.results);
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <PortfolioPageHero />
    <div class="xl:container xl:px-4 pt-10 md:pt-12 xl:mx-auto">
      <div v-if="tokens.length > 0" class="flex flex-wrap gap-3 justify-evenly">
        <template v-for="(token, index) in tokens">
          <div v-if="token.balance >= 0.0001" class="px-5 pb-5 text-center">
            <BalAsset
              :address="token.address"
              :iconURI="token.logoURI"
              :size="34"
            />
            <div class="text-lg font-semibold dark:text-polaris-white">
              {{ token.symbol }}
            </div>
            <BalLoadingBlock v-if="dynamicDataLoading" class="w-14 h-4" />
            <template v-else>
              <template v-if="token.balance > -1">
                <template v-if="token.balance >= 0.0001">
                  <div class="font-semibold dark:text-polaris-2">
                    {{ fNum(token.balance, FNumFormats.token) }}
                  </div>
                </template>
              </template>
            </template>
          </div>
        </template>
      </div>
      <div
        v-else-if="state.loading"
        class="flex justify-center items-center h-96"
      >
        <BalLoadingIcon />
      </div>
      <div
        v-else
        class="p-12 h-96 text-center text-secondary"
        v-text="$t('errorNoTokens')"
      />
    </div>
    <div class="xl:container xl:px-4 pt-10 md:pt-12 xl:mx-auto">
      <BalStack vertical>
        <!-- <div class="px-4 xl:px-0">
          <BalStack horizontal justify="between" align="center">
            <h3>{{ $t('myLiquidityInBalancerPools') }}</h3>
          </BalStack>
        </div> -->
        <BalStack vertical spacing="2xl">
          <UnstakedPoolsTable />
          <StakedPoolsTable />
          <VeBalPoolTable
            v-if="lockPool && Number(lock?.lockedAmount) > 0"
            :lock="lock"
            :lockPool="lockPool"
          />
        </BalStack>
      </BalStack>
    </div>
  </div>
</template>
