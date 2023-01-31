<template>
  <div class="heading container mx-auto flex px-7">
    <div class="w-full">
      <h1 v-if="isSegnioragePool(poolID) == true">Segniorage Pool</h1>
      <h1 v-if="isClassicPool(poolID) == true">Classic Pool</h1>
      <h1 v-if="isCommunityPool(poolID) == true">Community Pool</h1>
      <div class="current-fees mb-5">
        Dynamic swap fees: Currently
        {{ (parseFloat(pool?.swapFee) * 100 || '-') + '%' }}
      </div>
    </div>
    <div class="flex flex-none">
      <div class="px-3">
        <div class="flex">
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
        <div>
          <a href="" class="detail-link underline">
            Pool details <img :src="arrow" class="ml-[12px] inline" />
          </a>
        </div>
      </div>
      <div>
        <BalAssetSet
          :size="36"
          :addresses="iconAddresses(tableData)"
          :width="60"
        />
      </div>
    </div>
  </div>
  <div class="container mx-auto">
    <div class="card-container">
      <PoolChart
        :pool="pool"
        :historicalPrices="historicalPrices"
        :snapshots="snapshots"
        :loading="isLoadingSnapshots"
        :totalLiquidity="pool?.totalLiquidity"
        :tokensList="pool?.tokensList"
        :poolType="pool?.poolType"
      />
      <div class="pool-data">
        <PoolStatCards
          :pool="pool"
          :stakedBalance="stakedBalance"
          :poolApr="poolApr"
          :loading="loadingPool"
          :loadingApr="loadingPool"
          :aprString="apr.yearlyAPR"
          :xpolarPrice="xpolarPrice"
          :xpolarToClaim="xpolarToClaim"
        />
      </div>
    </div>
  </div>
  <div class="container mx-auto mt-[120px] flex justify-center gap-8">
    <PoolBalancesCard :pool="pool" :loading="loadingPool" />
  </div>
  <div class="container mx-auto mt-[120px] flex justify-center gap-8">
    <PoolUserDashboard
      v-if="stakedBalance > 0"
      :pool="pool"
      :stakedBalance="stakedBalance"
      :poolApr="poolApr"
      :loading="loadingPool"
      :xpolarPrice="xpolarPrice"
      :xpolarToClaim="xpolarToClaim"
      :dailyAPR="apr.dailyAPR"
    />
  </div>
  <div class="container mx-auto" ref="intersectionSentinel" />
  <div class="container mx-auto">
    <PoolTransactionsCard
      v-if="isSentinelIntersected"
      :pool="pool"
      :loading="loadingPool"
    />
  </div>

  <!-- <div :class="{ 'px-8': isMobile }">
    <div class="mx-auto flex xl:container">
      <div class="flex-1 pt-8">
        <div class="mb-[24px] flex justify-between">
          <div class="flex-column">
            <div class="pool-title">Liquidity Pool</div>
            <div class="pool-subtitle">
              
            </div>
          </div>
          <div class="flex items-center" v-if="isDesktop">
            <div class="mr-[12px] flex items-center">
              
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
        <div
          class="AC-container mt-5 mb-5"
          v-if="isMobile && !isCommunityPool(poolID())"
        >
          <div>Staking incentives</div>
          <div class="incentives-border my-[12px]"></div>
          <div class="incentives-text flex justify-between">
            <div>Staked LP tokens</div>
            <div>{{ stakedBalance }}</div>
          </div>
          <div class="incentives-text flex justify-between">
            <div>Unstaked LP tokens</div>

            <div>{{ balanceFor(address).slice(0, -15) }}</div>
            <div>$0.00</div>
          </div>
          <div class="incentives-text flex justify-between">
            <div>XPOLAR to claim</div>
            <div>{{ xpolarToClaim }}</div>
          </div>
          <div v-if="isApproved" class="incentives-text mt-3 flex gap-[8px]">
            <button class="incentives-btn w-full" @click="toggleStakeModal()">
              Stake
            </button>
            <StakeModal
              :depositBol="true"
              :isVisible="isStakeModalVisible"
              :token="tokenName"
              :balance="balanceFor(address)"
              :address="address"
              @close="toggleStakeModal"
            />
            <button
              class="unstake-incentives-btn w-full"
              @click="toggleUnstakeModal()"
            >
              Unstake
            </button>
            <StakeModal
              :depositBol="false"
              :isVisible="isUnstakeModalVisible"
              :token="tokenName"
              :balance="stakedBalance"
              :address="address"
              @close="toggleUnstakeModal"
            />
            <button class="incentives-btn w-full" @click="claim()">
              Claim
            </button>
          </div>
          <div v-else class="incentives-text mt-3 flex gap-[8px]">
            <button class="incentives-btn w-full" @click="approve()">
              Approve
            </button>
          </div>
        </div>
        <div class="">
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
                  :aprString="apr"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex-none pt-28"
        :class="{ 'pl-8': isDesktop }"
        :style="[isDesktop ? { width: '25%' } : {}]"
      >
        <MyPoolBalancesCard
          v-if="isDesktop && pool"
          :pool="pool"
          :missingPrices="missingPrices"
          class="mb-4"
        />
        <div
          class="AC-container mt-5 mb-5"
          v-if="isDesktop && !isCommunityPool(poolID())"
        >
          <div>Staking incentives</div>
          <div class="incentives-border my-[12px]"></div>
          <div class="incentives-text flex justify-between">
            <div>Staked LP tokens</div>
            <div>{{ stakedBalance }}</div>
          </div>
          <div class="incentives-text flex justify-between">
            <div>Unstaked LP tokens</div>
            <div>{{ balanceFor(address).slice(0, -15) }}</div>
          </div>
          <div class="incentives-text flex justify-between">
            <div>XPOLAR to claim</div>
            <div>{{ xpolarToClaim }}</div>
          </div>
          <div v-if="isApproved" class="incentives-text mt-3 flex gap-[8px]">
            <button class="incentives-btn w-full" @click="toggleStakeModal()">
              Stake
            </button>
            <StakeModal
              :depositBol="true"
              :isVisible="isStakeModalVisible"
              :token="tokenName"
              :balance="balanceFor(address)"
              :address="address"
              @close="toggleStakeModal"
            />
            <button
              class="unstake-incentives-btn w-full"
              @click="toggleUnstakeModal()"
            >
              Unstake
            </button>
            <StakeModal
              :depositBol="false"
              :isVisible="isUnstakeModalVisible"
              :token="tokenName"
              :balance="stakedBalance"
              :address="address"
              @close="toggleUnstakeModal"
            />
            <button class="incentives-btn w-full" @click="claim()">
              Claim
            </button>
          </div>
          <div v-else class="incentives-text mt-3 flex gap-[8px]">
            <button class="incentives-btn w-full" @click="approve()">
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>

  </div> -->
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
import { usePool, orderedTokenAddresses } from '@/composables/usePool';
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
import { InvestmentPool } from '@balancer-labs/typechain';
import PoolUserDashboard from '@/components/contextual/pages/pool/PoolUserDashboard.vue';
import useStake from '../../composables/PolarisFinance/useStake';
import useTransactions from '@/composables/useTransactions';
import useEthers from '../../composables/useEthers';
import { TransactionResponse } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import arrow from './table-arrow.svg';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { totalAprLabel } from '@/composables/usePool';
import MyPoolInvsetmentFiat, {
  MyPollInvestmentFiatType,
} from '@/components/pool/MyPoolInvsetmentFiat.vue';
import {
  BigNumberToString,
  sunriseNameToAddress,
  SPOLAR,
  getDisplayBalance,
} from '@/composables/PolarisFinance/utils';

import {
  spolarABI,
  sunriseABI,
  xpolarRewardPoolABI,
  ERC20ABI,
} from '@/composables/PolarisFinance/ABI';
import { Contract } from 'ethers';

import { sendTransaction } from '@/lib/utils/balancer/web3';
import { MaxUint256 } from '@ethersproject/constants';
import moment from 'moment';

import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { accountToAddress, Network } from '@balancer-labs/sdk';
import { Web3Provider } from '@ethersproject/providers';
import useTokensBal from '@/composables/useTokens';
import { getBptBalanceFiatValue } from '@/lib/utils/balancer/pool';
import BigNumberJs from 'bignumber.js';

import prices from '@/providers/tokens.provider';
import { AprProviderService } from '@/services/pool/apr.provider';
import { Pool } from '@/services/pool/types';

interface PoolPageData {
  id: string;
}

const segniorageIds = [
  '0xd88a378abfe6b6e232525dfb03fbe01ecc863c10000200000000000000000004',
  '0xa83f9fa9b51fc26e9925a07bc3375617b473e051000200000000000000000005',
  '0xa215a58225b344cbb62fcf762e8e884dbedfbe58000200000000000000000006',
  '0x293bbbef6087f681a8110f08bbdedadd13599fc3000200000000000000000007',
  '0x0993fa12d3256e85da64866354ec3532f187e178000200000000000000000008',
  '0xf0b6cf745afe642c4565165922ad62d6a93857c100020000000000000000000e',
];

const classicPoolsIds = [
  '0xcb9eb3f264be622a6d707947765db5c79d969ca7000000000000000000000009',
  '0x244caf21eaa7029db9d6b42ddf2d95800a2f5eb500020000000000000000000a',
  '0x9cd44e44e8a61bc7dc34b04c762a3c0137a3707c000200000000000000000002',
  '0xfbfcd8d689a3689db0f35277bf7cc11663a672e000020000000000000000000b',
  '0xb3a04902b78fbe61185b766866193630db4db8a300020000000000000000000d',
  '0x24f58ab36c212e54b248ebfb17eff2ca21dc95d5000200000000000000000013',
  '0x4200333dc021ea5fb1050b8e4f8f3ed7cb1d22ed00020000000000000000000c',
  '0xd8e9e1916a4d98fb0dc6db725a8c8c2af08a329b00020000000000000000000f',
  '0x8bd71de52a3be3aadeb375f8d69aed37adf83d80000200000000000000000010',
  '0xceecce984f498ee00832670e9ca6d372f6ce155a000200000000000000000014',
  '0x23a8a6e5d468e7acf4cc00bd575dbecf13bc7f78000100000000000000000015',
  '0x454adaa07eec2c432c0df4379a709b1fa4c800ed000200000000000000000016',
  '0x89cc63050ade84bffafd7ec84d24fc0feb5f96c9000200000000000000000020',
  '0xe370d4d0727d4e9b70db1a2f7d2efd1010ff1d6d000200000000000000000021',
];

const isCommunityPool = pool => {
  return !segniorageIds.includes(pool) && !classicPoolsIds.includes(pool);
};
const isSegnioragePool = pool => {
  return segniorageIds.includes(pool);
};
const isClassicPool = pool => {
  return classicPoolsIds.includes(pool);
};

export default defineComponent({
  components: {
    ...PoolPageComponents,
    StakingIncentivesCard,
    // StakingProvider,
    ApyVisionPoolLink,
    PoolPageHeader,
    StakeModal,
    MyPoolInvsetmentFiat,
    PoolUserDashboard,
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
    const { fNum2 } = useNumbers();
    const { isMobile, isDesktop } = useBreakpoints();

    const { account, connector, startConnectWithInjectedProvider } = useWeb3();

    const tableData = computed(() => {
      const onchainTokens = pool.value?.onchain?.tokens || [];
      return Object.keys(onchainTokens).map((address, index) => ({
        address,
        index,
      }));
    });

    const poolID = () => data.id;

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

    function iconAddresses(tableData) {
      let addresses: string[] = [];
      tableData.forEach(token => {
        addresses.push(token?.address);
      });
      // if (pool != undefined)
      //   return POOLS.Metadata[pool.id]?.hasIcon
      //     ? [pool.address]
      //     : orderedTokenAddresses(pool);
      return addresses;
    }
    // onMounted(() => {
    // });
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

    const { getPoolApr } = useStake();

    const dailyApr = ref('-');
    const apr = ref('-');

    const { prices: balPrices } = useTokensBal();

    onMounted(async () => {
      addIntersectionObserver();
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
      prices,
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
      isCommunityPool,
      isSegnioragePool,
      isClassicPool,
      poolID,
      getPoolApr,
      dailyApr,
      apr,
      balPrices,
      iconAddresses,
      arrow,
      fNum2,
      FNumFormats,
      totalAprLabel,
    };
  },
  data() {
    return {
      stakedBalance: '0',
      xpolarToClaim: '0',
      xpolarPrice: 0,
      isApproved: false,
      apr: '0',
      address: '',
      data: [] as Pool[],
      xpolarPoolQuery: usePoolQuery(
        '0x23a8a6e5d468e7acf4cc00bd575dbecf13bc7f78000100000000000000000015'
      ),
    };
  },
  methods: {
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
          this.fetch();
        },
        onTxFailed: () => {},
      });
    },

    async fetch() {
      const { balance, isApproved, pendingShare } = useStake();
      let poolAddress = '';
      let poolId = '';

      if (this.pool != undefined) {
        poolAddress = this.pool.address;
        poolId = this.pool.id;
        this.address = poolAddress;
      } else {
        return;
      }
      if (!this.pool) {
        await new Promise((resolve, reject) => {
          const loop = () =>
            this.pool !== undefined
              ? resolve(this.pool)
              : setTimeout(loop, 100);
          loop();
        });
      }

      const aprProviderClass = new AprProviderService(
        [this.pool],
        this.prices,
        this.xpolarPoolQuery
      );
      aprProviderClass.init();
      aprProviderClass.aprsReceived = (aprs: any) => {
        this.apr = aprs[0];
      };
      aprProviderClass.fetchAll();

      if (this.account != '') {
      } else {
        return;
      }

      this.stakedBalance = await balance(poolAddress, this.account);
      // this.apr = (await getPoolApr(poolAddress, poolId, this.prices)).yearlyAPR;

      this.xpolarToClaim = BigNumberToString(
        await pendingShare(poolAddress, this.account),
        14,
        4
      );
      // this.xpolarToClaim = await pendingShare(poolAddress, this.account);

      const approval = await isApproved(poolAddress, this.account);
      this.isApproved = approval;
    },
  },
  async mounted() {},
  watch: {
    async account() {
      await this.fetch();
    },
    async pool() {
      await this.fetch();
    },
    async prices() {
      await this.fetch();
    },
  },
});
</script>

<style scoped>
h1 {
  font-weight: 600;
  font-size: 40px;
  line-height: 52px;
  color: #fdfdfd;
}
.current-fees {
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #bdb2dd;
}
.card-container {
  background: #292043;
  box-shadow: 0px 1.52198px 3.04396px rgba(0, 0, 0, 0.25);
  border-radius: 32px;
  overflow: hidden;
  color: #fdfdfd;
}
.pool-data {
  background: #41365e;
  padding: 24px;
}
.pool-invest {
  border-top: 1px solid rgba(151, 71, 255, 0.4);
  text-align: center;
  padding-top: 24px;
}
.chart {
  padding: 24px;
}
.pool-actions-card {
  @apply relative;
}

.invest-btn {
  background: linear-gradient(92.92deg, #c004fe 4.85%, #7e02f5 95.15%);
  border-radius: 40px;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #fdfdfd;
  padding: 12px 20px;
  margin: 12px auto 0px auto;
  max-width: 520px;
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
  font-size: 24px;
  line-height: 32px;
  color: #fdfdfd;
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
  font-size: 14px;
  line-height: 20px;

  color: #fdfdfd;
}

.unstake-incentives-btn {
  border-radius: 12px;
  padding-left: 8px;
  padding-right: 8px;
  background: #160d22;
  box-shadow: inset -2px -2px 4px #2e1b46, inset 2px 2px 4px #050309;
  border-radius: 12px;
}

.incentives-btn {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  padding: 8px;
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

.detail-link {
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-decoration-line: underline;
  color: #bdb2dd;
}

.pool-stats-label {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #bdb2dd;
}

.pool-stats-funds {
  font-weight: 600;
  font-size: 32px;
  line-height: 32px;
  color: #fdfdfd;
}
.pool-stats-funds.claim {
  color: #0ce6b5;
}
</style>
