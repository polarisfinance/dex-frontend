<template>
  <div class="flex">
    <div class="pt-8 lg:px-4 xl:container xl:mx-auto">
      <div class="mb-[24px] flex justify-between">
        <div class="flex-column">
          <div class="pool-title">Liquidity Pool</div>
          <div class="pool-subtitle">
            Dynamic swap fees: Currently
            {{ (parseFloat(pool?.swapFee) * 100 || '-') + '%' }}
          </div>
        </div>
        <div class="flex items-center" v-if="isDesktop">
          <div class="mr-[12px] flex items-center">
            <div
              v-for="(token, idx) in tableData"
              :key="idx"
              class="token-name flex"
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
          <div class="mr-[12px] flex items-center">
            <div
              v-for="(token, idx) in tableData"
              :key="idx"
              class="token-name flex"
            >
              <div>
                {{ symbolFor(token.address) }}
              </div>
              <div v-if="idx < tableData.length - 1">-</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isPPool" class="alert my-[10px]">
        <a class="underline" href="https://app.polarisfinance.io/#/trade"
          >You need to wrap your {{ isPPool }} into p{{ isPPool }} using the
          Swap page!</a
        >
      </div>

      <MyPoolBalancesCard
        v-if="isMobile"
        :pool="pool"
        :missingPrices="missingPrices"
        class="mb-4"
      />
      <div class="AC-container" v-if="isMobile">
        <div>Staking incentives</div>
        <div class="incentives-border"></div>
        <div class="incentives-text flex justify-between">
          <div>Staked LP tokens</div>
          <div>{{ stakedBalance }}</div>
        </div>
        <div class="incentives-text flex justify-between">
          <div>Untaked LP tokens</div>
          <div>{{ balanceFor(pool.address).slice(0, -15) }}</div>
        </div>
        <div class="incentives-text flex justify-between">
          <div>XPOLAR to claim</div>
          <div>{{ xpolarToClaim }}</div>
        </div>
        <div v-if="isApproved" class="incentives-text flex gap-[8px]">
          <button class="incentives-btn" @click="toggleStakeModal()">
            Stake
          </button>
          <StakeModal
            :depositBol="true"
            :isVisible="isStakeModalVisible"
            :token="tokenName"
            :balance="balanceFor(pool.address)"
            :address="pool.address"
            @close="toggleStakeModal"
          />
          <button class="incentives-btn" @click="toggleUnstakeModal()">
            Unstake
          </button>
          <StakeModal
            :depositBol="false"
            :isVisible="isUnstakeModalVisible"
            :token="tokenName"
            :balance="stakedBalance"
            :address="pool.address"
            @close="toggleUnstakeModal"
          />
          <button class="incentives-btn" @click="claim()">Claim</button>
        </div>
        <div v-else class="incentives-text flex gap-[8px]">
          <button class="incentives-btn" @click="approve()">Approve</button>
        </div>
      </div>
      <!-- <div class="AC-container my-[16px]" v-if="isMobile">
        <div>Auto Compounder</div>
        <div class="brd my-[12px]" />
        <div class="deposit mb-[16px]">
          Deposit SPOLAR-NEAR-LP to an autocompounder
        </div>
        <div class="flex justify-center gap-[50px]">
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
        <button class="approve-btn-placeholder mt-[16px] w-full">
          <div class="approve-btn">Approve LP</div>
        </button>
      </div> -->
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
        <div class="order-2 col-span-2 lg:order-1">
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
            <div class="mb-[70px] px-4 lg:px-0">
              <PoolStatCards
                :pool="pool"
                :poolApr="poolApr"
                :loading="loadingPool"
                :loadingApr="loadingPool"
              />
            </div>
            <div class="mb-4">
              <h4
                class="table-title mb-[12px] px-4 lg:px-0"
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
      </div>
    </div>
    <div class="pt-28" :class="{ margin: isDesktop }">
      <MyPoolBalancesCard
        v-if="isDesktop && pool"
        :pool="pool"
        :missingPrices="missingPrices"
        class="mb-4"
      />
      <div class="AC-container" v-if="isDesktop">
        <div>Staking incentives</div>
        <div class="incentives-border"></div>
        <div class="incentives-text flex justify-between">
          <div>Staked LP tokens</div>
          <div>{{ stakedBalance }}</div>
        </div>
        <div class="incentives-text flex justify-between">
          <div>Untaked LP tokens</div>
          <div>{{ balanceFor(pool.address).slice(0, -15) }}</div>
        </div>
        <div class="incentives-text flex justify-between">
          <div>XPOLAR to claim</div>
          <div>{{ xpolarToClaim }}</div>
        </div>
        <div v-if="isApproved" class="incentives-text flex gap-[8px]">
          <button class="incentives-btn" @click="toggleStakeModal()">
            Stake
          </button>
          <StakeModal
            :depositBol="true"
            :isVisible="isStakeModalVisible"
            :token="tokenName"
            :balance="balanceFor(pool.address)"
            :address="pool.address"
            @close="toggleStakeModal"
          />
          <button class="incentives-btn" @click="toggleUnstakeModal()">
            Unstake
          </button>
          <StakeModal
            :depositBol="false"
            :isVisible="isUnstakeModalVisible"
            :token="tokenName"
            :balance="stakedBalance"
            :address="pool.address"
            @close="toggleUnstakeModal"
          />
          <button class="incentives-btn" @click="claim()">Claim</button>
        </div>
        <div v-else class="incentives-text flex gap-[8px]">
          <button class="incentives-btn" @click="approve()">Approve</button>
        </div>
      </div>

      <!-- <div class="AC-container my-[16px]" v-if="isDesktop">
        <div>Auto Compounder</div>
        <div class="brd my-[12px]" />
        <div class="deposit mb-[16px]">
          Deposit SPOLAR-NEAR-LP to an autocompounder
        </div>
        <div class="flex justify-center gap-[50px]">
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
        <button class="approve-btn-placeholder mt-[16px] w-full">
          <div class="approve-btn">Approve LP</div>
        </button>
      </div> -->
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
import StakeModal from './StakeModal.vue';

import useStake from '../../composables/PolarisFinance/useStake';
import useTransactions from '@/composables/useTransactions';
import useEthers from '../../composables/useEthers';
import { TransactionResponse } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import {
  BigNumberToString,
  sunriseNameToAddress,
  SPOLAR,
  getDisplayBalance,
} from '@/composables/PolarisFinance/utils';
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
    StakeModal,
  },

  setup() {
    /**
     * COMPOSABLES
     */
    const { t } = useI18n();
    const route = useRoute();
    const { explorerLinks } = useWeb3();
    const { prices, balanceFor } = useTokens();
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

    const isPPool = computed(() => {
      for (let token of tableData.value) {
        if ('0x990e50e781004ea75e2ba3a67eb69c0b1cd6e3a6' == token.address)
          return 'NEAR';
        if ('0xfbe0ec68483c0b0a9d4bcea3ccf33922225b8465' == token.address)
          return 'STNEAR';
      }

      return undefined;
    });
    const tokenName = computed(() => {
      let name = '';
      for (let i = 0; i < tableData.value.length; i++) {
        name += symbolFor(tableData.value[i].address);
        if (i < tableData.value.length - 1) {
          name += '-';
        }
      }
      return name;
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
        console.log(poolQuery.error.value);
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

    const isStakeModalVisible = ref(false);
    const isUnstakeModalVisible = ref(false);

    const toggleStakeModal = (value?: boolean) => {
      isStakeModalVisible.value = value ?? !isStakeModalVisible.value;
    };

    const toggleUnstakeModal = (value?: boolean) => {
      isUnstakeModalVisible.value = value ?? !isUnstakeModalVisible.value;
    };

    const { addTransaction } = useTransactions();
    const { txListener } = useEthers();

    const txHandler = (tx: TransactionResponse): void => {
      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'approve',
        summary: 'approve for staking',
      });
    };
    const { getProvider } = useWeb3();

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
      isPPool,
      toggleStakeModal,
      isStakeModalVisible,
      tokenName,
      balanceFor,
      toggleUnstakeModal,
      isUnstakeModalVisible,
      txHandler,
      txListener,
      getProvider,
    };
  },
  data() {
    return {
      stakedBalance: '0',
      xpolarToClaim: '0',
      isApproved: false,
    };
  },
  methods: {
    async fetchStakedBalance() {
      const { balance } = useStake();
      let poolAddress = '';
      if (this.pool) {
        poolAddress = this.pool.address;
      }
      this.stakedBalance = await balance(poolAddress, this.account);
    },
    async fetchXpolarToClaim() {
      const { pendingShare } = useStake();
      let poolAddress = '';
      if (this.pool) {
        poolAddress = this.pool.address;
      }
      this.xpolarToClaim = BigNumberToString(
        await pendingShare(poolAddress, this.account),
        14,
        4
      );
    },
    async claim() {
      const { withdraw } = useStake();
      let poolAddress = '';
      if (this.pool) {
        poolAddress = this.pool.address;
      }
      const tx = await withdraw(
        poolAddress,
        BigNumber.from(0),
        this.getProvider()
      );
      this.txHandler(tx);
    },
    async approve() {
      const { approve } = useStake();
      let poolAddress = '';
      if (this.pool) {
        poolAddress = this.pool.address;
      }
      const tx = await approve(poolAddress, this.getProvider());
      this.txHandler(tx);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.fetchIsApproved();
        },
        onTxFailed: () => {},
      });
    },
    async fetchIsApproved() {
      const { isApproved } = useStake();
      let poolAddress = '';
      if (this.pool) {
        poolAddress = this.pool.address;
      }
      const approval = await isApproved(poolAddress, this.account);
      this.isApproved = approval;
    },
  },
  async mounted() {
    await this.fetchStakedBalance();
    await this.fetchXpolarToClaim();
    await this.fetchIsApproved();
  },
  watch: {
    async account() {
      await this.fetchStakedBalance();
      await this.fetchXpolarToClaim();
      await this.fetchIsApproved();
    },
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

.incentives-border {
  border: 0.25px solid rgba(151, 71, 255, 0.4);
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
  background: linear-gradient(#160d22, #160d22) padding-box,
    linear-gradient(to bottom left, #fbaaff, #ea8d3a, #734a79) border-box;
  border: 1px solid transparent;
  border-radius: 22px;

  font-weight: 600;
  font-size: 18px;
  line-height: 23px;

  color: #ffffff;

  padding: 12px 24px;
}

.incentives-text {
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;

  color: #fdfdfd;
}

.incentives-btn {
  background: #301d45;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding-left: 8px;
  padding-right: 8px;
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

.alert {
  background: #7b307f;
  border-radius: 16px;
  padding: 12px 14px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #ffffff;

  align-items: center;
  text-align: center;
}

.incentives-container {
  /* background: #160d22; */
  /* box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25); */
  border-radius: 22px;

  background: linear-gradient(#180a1e, #180a1e) padding-box,
    linear-gradient(to bottom left, #fbaaff, #ea8d3a, #734a79) border-box !important;
}

.margin {
  padding-right: 16px;
}
</style>
