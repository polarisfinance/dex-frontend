<template>
  <div class="flex">
    <div class="xl:container lg:px-4 pt-8 xl:mx-auto">
      <div class="flex justify-between mb-[24px]">
        <div class="flex-column">
          <div class="pool-title">Segniorage Pool</div>
          <div class="pool-subtitle">
            Dynamic swap fees: Currently
            <!-- {{ parseFloat(pool.swapFee) * 100 + '%' }} -->
          </div>
        </div>
        <div class="flex items-center" v-if="isDesktop">
          <div class="flex items-center mr-[12px]">
            <div
              v-for="(token, idx) in tableData"
              :key="idx"
              class="flex token-name"
            >
              <div>
                {{ symbolFor(token.address) }}
              </div>
              <div v-if="idx < tableData.length - 1">-</div>
            </div>
          </div>
          <div class="flex items-center">
            <div v-for="(token, idx) in tableData" :key="idx">
              <BalAsset :address="token.address" :size="33" />
            </div>
          </div>
        </div>
        <div v-else>
          <div class="flex items-center">
            <div v-for="(token, idx) in tableData" :key="idx">
              <BalAsset :address="token.address" :size="33" />
            </div>
          </div>
          <div class="flex items-center mr-[12px]">
            <div
              v-for="(token, idx) in tableData"
              :key="idx"
              class="flex token-name"
            >
              <div>
                {{ symbolFor(token.address) }}
              </div>
              <div v-if="idx < tableData.length - 1">-</div>
            </div>
          </div>
        </div>
      </div>
      <MyPoolBalancesCard
        v-if="isMobile"
        :pool="pool"
        :missingPrices="missingPrices"
        class="mb-4"
      />
      <!-- <div class="my-pool-container" v-if="isMobile">
        <div class="my-pool-upper">
          <div>My pool balance</div>
          <div class="border my-[12px]" />
          <div>
            <div
              v-for="(token, idx) in tableData"
              :key="idx"
              class="flex token-name items-center justify-between mb-[12px]"
            >
              <div class="flex items-center">
                <BalAsset
                  :address="token.address"
                  :size="32"
                  class="mr-[12px]"
                />
                <div class="flex-column">
                  <div>
                    {{ symbolFor(token.address) }}
                  </div>
                  <div class="token-subtitle">
                    {{ symbolFor(token.address) }}
                  </div>
                </div>
              </div>
              <div>-</div>
            </div>
          </div>
        </div>
        <div class="bg-[#2E2433] p-[12px]">
          <div class="small-text">Based on pool tokens in your wallet</div>
          <div class="mb-[12px]">You can invest</div>
          <button
            class="w-full connect-btn-pool"
            @click="startConnectWithInjectedProvider"
          >
            Connect Wallet
          </button>
        </div>
      </div> -->
      <div class="AC-container my-[16px]" v-if="isMobile">
        <div>Auto Compounder</div>
        <div class="brd my-[12px]" />
        <div class="deposit mb-[16px]">
          Deposit SPOLAR-NEAR-LP to an autocompounder
        </div>
        <div class="flex gap-[50px] justify-center">
          <div class="flex-col gap-[8px] text-right">
            <div>APY</div>
            <div>Daily APY</div>
            <div>Deposit Fee</div>
            <div>Withdraw Fee</div>
            <div>On Profits Fee</div>
          </div>
          <div class="flex-col gap-[8px] text-right">
            <div>372.8%</div>
            <div>0.23%</div>
            <div>0%</div>
            <div>0.1%</div>
            <div>3.5%</div>
          </div>
        </div>
        <button class="mt-[16px] w-full approve-btn-placeholder">
          <div class="approve-btn">Approve LP</div>
        </button>
      </div>
      <div class="">
        <!-- this shit doesnt work for some reason :( -->
        <!-- <PoolPageHeader
        :loadingPool="loadingPool"
        :pool="pool"
        :isStableLikePool="isStableLikePool"
        :noInitLiquidity="noInitLiquidity"
        :titleTokens="titleTokens"
        :missingPrices="missingPrices"
        :isLiquidityBootstrappingPool="isLiquidityBootstrappingPool"
        :isStablePhantomPool="isLiquidityBootstrappingPool"
      /> -->
        <div class="hidden lg:block" />
        <div class="order-2 lg:order-1 col-span-2">
          <div class="grid grid-cols-1 gap-y-8">
            <div class="px-4 lg:px-0">
              <PoolChart
                :pool="pool"
                :historicalPrices="historicalPrices"
                :snapshots="snapshots"
                :loading="isLoadingSnapshots"
                :totalLiquidity="pool?.totalLiquidity"
                :tokensList="pool?.tokensList"
                :poolType="pool?.poolType"
              />
            </div>
            <div class="px-4 lg:px-0 mb-[70px]">
              <PoolStatCards
                :pool="pool"
                :poolApr="poolApr"
                :loading="loadingPool"
                :loadingApr="loadingPool"
              />
              <!-- <ApyVisionPoolLink
              v-if="!loadingPool"
              :poolId="pool?.id"
              :titleTokens="titleTokens"
            /> -->
            </div>
            <div class="mb-4">
              <h4
                class="px-4 lg:px-0 mb-[12px] table-title"
                v-text="$t('poolComposition')"
              />
              <PoolBalancesCard :pool="pool" :loading="loadingPool" />
            </div>

            <div ref="intersectionSentinel" />
            <PoolTransactionsCard
              v-if="isSentinelIntersected"
              :pool="pool"
              :loading="loadingPool"
            />
          </div>
        </div>

        <!-- <div
          v-if="!isLiquidityBootstrappingPool"
          class="order-1 lg:order-2 px-4 lg:px-0"
        >
          <StakingProvider :poolAddress="getAddressFromPoolId(id)">
            <BalStack vertical>
              <BalLoadingBlock
                v-if="loadingPool"
                class="mb-4 h-60 pool-actions-card"
              />
              <MyPoolBalancesCard
                v-else-if="!noInitLiquidity"
                :pool="pool"
                :missingPrices="missingPrices"
                class="mb-4"
              />

              <BalLoadingBlock
                v-if="loadingPool"
                class="h-40 pool-actions-card"
              />
              <StakingIncentivesCard
                v-if="isStakablePool && !loadingPool"
                :pool="pool"
                class="staking-incentives"
              />
            </BalStack>
          </StakingProvider>
        </div> -->
      </div>
    </div>
    <div class="pt-28">
      <MyPoolBalancesCard
        v-if="isDesktop"
        :pool="pool"
        :missingPrices="missingPrices"
        class="mb-4"
      />
      <!-- <div class="my-pool-container" v-if="isDesktop">
        <div class="my-pool-upper">
          <div>My pool balance</div>
          <div class="border my-[12px]" />
          <div>
            <div
              v-for="(token, idx) in tableData"
              :key="idx"
              class="flex token-name items-center justify-between mb-[12px]"
            >
              <div class="flex items-center">
                <BalAsset
                  :address="token.address"
                  :size="32"
                  class="mr-[12px]"
                />
                <div class="flex-column">
                  <div>
                    {{ symbolFor(token.address) }}
                  </div>
                  <div class="token-subtitle">
                    {{ symbolFor(token.address) }}
                  </div>
                </div>
              </div>
              <div>-</div>
            </div>
          </div>
        </div>
        <div class="bg-[#2E2433] p-[12px]">
          <div class="small-text">Based on pool tokens in your wallet</div>
          <div class="mb-[12px]">You can invest</div>
          <button
            v-if="account"
            @click="startConnectWithInjectedProvider"
            class="w-full connect-btn-pool"
          >
            Connect Wallet
          </button>
          <div v-else>
            <div class="flex w-full gap-[8px]">
              <button class="w-full invest-btn">Invest</button>
              <button class="w-full withdraw-btn">Withdraw</button>
            </div>
          </div>
        </div>
      </div> -->
      <div class="AC-container my-[16px]" v-if="isDesktop">
        <div>Auto Compounder</div>
        <div class="brd my-[12px]" />
        <div class="deposit mb-[16px]">
          Deposit SPOLAR-NEAR-LP to an autocompounder
        </div>
        <div class="flex gap-[50px] justify-center">
          <div class="flex-col gap-[8px] text-right">
            <div>APY</div>
            <div>Daily APY</div>
            <div>Deposit Fee</div>
            <div>Withdraw Fee</div>
            <div>On Profits Fee</div>
          </div>
          <div class="flex-col gap-[8px] text-right">
            <div>372.8%</div>
            <div>0.23%</div>
            <div>0%</div>
            <div>0.1%</div>
            <div>3.5%</div>
          </div>
        </div>
        <button class="mt-[16px] w-full approve-btn-placeholder">
          <div class="approve-btn">Approve LP</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import * as PoolPageComponents from '@/components/contextual/pages/pool';
import StakingIncentivesCard from '@/components/contextual/pages/pool/StakingIncentivesCard/StakingIncentivesCard.vue';
import ApyVisionPoolLink from '@/components/links/ApyVisionPoolLink.vue';
import PoolPageHeader from '@/components/pool/PoolPageHeader.vue';
// import usePoolAprQuery from '@/composables/queries/usePoolAprQuery';
import usePoolQuery from '@/composables/queries/usePoolQuery';
import usePoolSnapshotsQuery from '@/composables/queries/usePoolSnapshotsQuery';
import useAlerts, { AlertPriority, AlertType } from '@/composables/useAlerts';
import { isL2 } from '@/composables/useNetwork';
import { usePool } from '@/composables/usePool';
import { usePoolWarning } from '@/composables/usePoolWarning';
import useTokens from '@/composables/useTokens';
import { POOLS } from '@/constants/pools';
import { getAddressFromPoolId, includesAddress } from '@/lib/utils';
// import StakingProvider from '@/providers/local/staking/staking.provider';
import useWeb3 from '@/services/web3/useWeb3';
import { shortenLabel } from '@/lib/utils';
import useBreakpoints from '@/composables/useBreakpoints';

import { MyPoolBalancesCard } from '@/components/contextual/pages/pool/index';

interface PoolPageData {
  id: string;
}

export default defineComponent({
  components: {
    ...PoolPageComponents,
    StakingIncentivesCard,
    // StakingProvider,
    ApyVisionPoolLink,
    PoolPageHeader,
  },

  setup() {
    /**
     * COMPOSABLES
     */
    const { t } = useI18n();
    const route = useRoute();
    const { explorerLinks } = useWeb3();
    const { prices } = useTokens();
    const { addAlert, removeAlert } = useAlerts();
    const { isAffected, warnings } = usePoolWarning(route.params.id as string);

    const { isMobile, isDesktop } = useBreakpoints();

    const { account, connector, startConnectWithInjectedProvider } = useWeb3();

    const tableData = computed(() => {
      const onchainTokens = pool.value?.onchain?.tokens || [];
      return Object.keys(onchainTokens).map((address, index) => ({
        address,
        index,
      }));
    });

    function symbolFor(address: string) {
      if (!pool || !pool.value) return '-';
      const symbol = pool.value?.onchain?.tokens?.[address]?.symbol;
      return symbol ? symbol : shortenLabel(address);
    }

    /**
     * STATE
     */
    const data = reactive<PoolPageData>({
      id: route.params.id as string,
    });

    //#region pool query
    const poolQuery = usePoolQuery(route.params.id as string);
    const pool = computed(() => poolQuery.data.value);
    const poolQueryLoading = computed(
      () =>
        poolQuery.isLoading.value ||
        poolQuery.isIdle.value ||
        Boolean(poolQuery.error.value)
    );
    const loadingPool = computed(() => poolQueryLoading.value || !pool.value);

    const {
      isStableLikePool,
      isLiquidityBootstrappingPool,
      isStablePhantomPool,
    } = usePool(poolQuery.data);
    //#endregion

    //#region pool snapshot query
    const poolSnapshotsQuery = usePoolSnapshotsQuery(
      route.params.id as string,
      undefined,
      // in order to prevent multiple coingecko requests
      { refetchOnWindowFocus: false }
    );
    const isLoadingSnapshots = computed(
      () =>
        poolSnapshotsQuery.isLoading.value || poolSnapshotsQuery.isIdle.value
    );

    const snapshots = computed(() => poolSnapshotsQuery.data.value?.snapshots);
    const historicalPrices = computed(
      () => poolSnapshotsQuery.data.value?.prices
    );
    //#endregion

    //#region APR query
    // const aprQuery = usePoolAprQuery(route.params.id as string);
    // const loadingApr = computed(
    //   () =>
    //     aprQuery.isLoading.value ||
    //     aprQuery.isIdle.value ||
    //     Boolean(aprQuery.error.value)
    // );
    // const poolApr = computed(() => aprQuery.data.value);
    //#endregion

    //#region Intersection Observer
    const intersectionSentinel = ref<HTMLDivElement | null>(null);
    const isSentinelIntersected = ref(false);
    let observer: IntersectionObserver | undefined;

    function addIntersectionObserver(): void {
      if (
        !('IntersectionObserver' in window) ||
        !('IntersectionObserverEntry' in window) ||
        !intersectionSentinel.value
      ) {
        isSentinelIntersected.value = true;
        return;
      }

      const options = {
        rootMargin: '-100px',
      };

      const callback = (entries: IntersectionObserverEntry[]): void => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isSentinelIntersected.value = true;
          }
        });
      };
      observer = new IntersectionObserver(callback, options);
      observer.observe(intersectionSentinel.value);
    }
    onMounted(() => {
      addIntersectionObserver();
    });
    onBeforeUnmount(() => {
      observer?.disconnect();
    });
    //#endregion

    const noInitLiquidity = computed(
      () =>
        !loadingPool.value &&
        pool.value &&
        Number(pool.value?.onchain?.totalSupply || '0') === 0
    );

    const missingPrices = computed(() => {
      if (pool.value) {
        const tokensWithPrice = Object.keys(prices.value);

        const tokens =
          isStablePhantomPool.value && pool.value.mainTokens
            ? pool.value.mainTokens
            : pool.value.tokensList;

        return !tokens.every(token => includesAddress(tokensWithPrice, token));
      }
      return false;
    });

    const titleTokens = computed(() => {
      if (!pool.value || !pool.value.onchain?.tokens) return [];

      return Object.entries(pool.value.onchain.tokens).sort(
        ([, a]: any[], [, b]: any[]) => b.weight - a.weight
      );
    });

    const isStakablePool = computed((): boolean =>
      POOLS.Stakable.AllowList.includes(route.params.id as string)
    );

    /**
     * WATCHERS
     */
    watch(poolQuery.error, () => {
      if (poolQuery.error.value) {
        addAlert({
          id: 'pool-fetch-error',
          label: t('alerts.pool-fetch-error'),
          type: AlertType.ERROR,
          persistent: true,
          action: poolQuery.refetch.value,
          actionLabel: t('alerts.retry-label'),
          priority: AlertPriority.MEDIUM,
        });
      } else {
        removeAlert('pool-fetch-error');
      }
    });

    return {
      // data
      ...toRefs(data),
      intersectionSentinel,
      isSentinelIntersected,
      // computed
      pool,
      explorer: explorerLinks,
      noInitLiquidity,
      historicalPrices,
      snapshots,
      isLoadingSnapshots,
      loadingPool,
      missingPrices,
      isStableLikePool,
      isLiquidityBootstrappingPool,
      isStablePhantomPool,
      isAffected,
      warnings,
      isL2,
      isStakablePool,
      titleTokens,
      // methods
      getAddressFromPoolId,
      tableData,
      symbolFor,
      // poolApr,
      // loadingApr,
      isMobile,
      isDesktop,
      startConnectWithInjectedProvider,
      account,
      MyPoolBalancesCard,
    };
  },
});
</script>

<style scoped>
.pool-actions-card {
  @apply relative;
}

@media (min-width: 768px) and (min-height: 600px) {
  .pool-actions-card {
    @apply sticky top-24;
  }
}

.staking-incentives :deep(.active-section) {
  @apply border-transparent;
}

.table-title {
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;

  color: #ffffff;
}

.pool-title {
  font-weight: 600;
  font-size: 24px;
  line-height: 31px;

  color: #ffffff;
}

.pool-subtitle {
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;

  color: rgba(245, 225, 255, 0.7);
}

.token-name {
  font-weight: 600;
  font-size: 18px;
  line-height: 23px;

  color: #ffffff;
}

.my-pool-balance {
  background: #231928;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
}

.my-pool-container {
  background: #231928;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 16px;

  font-weight: 600;
  font-size: 18px;
  line-height: 23px;

  color: #ffffff;
}

.my-pool-upper {
  padding: 12px;
}

.border {
  border: 0.5px solid rgba(111, 71, 115, 0.4);
}

.token-subtitle {
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;

  color: rgba(245, 225, 255, 0.7);
}

.small-text {
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;

  color: rgba(245, 225, 255, 0.7);
}

.connect-btn-pool {
  background: #7b307f;
  border-radius: 12px;
  padding: 12px 0px;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #fdfdfd;
}

.connect-btn-pool:hover {
  background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    rgba(123, 48, 127, 0.7) 0%,
    rgba(123, 48, 127, 0.567) 100%
  );
}

.connect-btn-pool:active {
  background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    rgba(123, 48, 127, 0.5) 0%,
    rgba(123, 48, 127, 0.405) 100%
  );
}

.AC-container {
  background: linear-gradient(#180a1e, #180a1e) padding-box,
    linear-gradient(to bottom left, #fbaaff, #ea8d3a, #734a79) border-box;
  border: 1px solid transparent;
  border-radius: 22px;

  font-weight: 600;
  font-size: 18px;
  line-height: 23px;

  color: #ffffff;

  padding: 12px 24px;
}

.brd {
  border: 0.5px solid rgba(111, 71, 115, 0.4);
}

.deposit {
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;

  color: rgba(245, 225, 255, 0.7);
}

.approve-btn {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  background: linear-gradient(
    90.64deg,
    #fbaaff -20.45%,
    #f89c35 36.77%,
    #7b307f 100.27%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
}

.approve-btn-placeholder {
  background: #2e2433;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
}

.invest-btn {
  background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    #7b307f 0%,
    rgba(123, 48, 127, 0.81) 100%
  );
  border-radius: 12px;
  padding: 12px 0px;
  color: #fdfdfd;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
}

.withdraw-btn {
  padding: 12px 0px;
  background: #231928;
  border-radius: 12px;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: rgba(245, 225, 255, 0.7);
}
</style>
