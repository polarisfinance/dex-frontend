<script setup lang="ts">
import { format } from 'date-fns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { ColumnDefinition } from '@/components/_global/BalTable/BalTable.vue';
import BalChipNew from '@/components/chips/BalChipNew.vue';
import { PRETTY_DATE_FORMAT } from '@/components/forms/lock_actions/constants';
import { POOL_MIGRATIONS_MAP } from '@/components/forms/pool_actions/MigrateForm/constants';
import { PoolMigrationType } from '@/components/forms/pool_actions/MigrateForm/types';
import APRTooltip from '@/components/tooltips/APRTooltip/APRTooltip.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import useDarkMode from '@/composables/useDarkMode';
import useFathom from '@/composables/useFathom';
import useNumbers from '@/composables/useNumbers';
import {
  absMaxApr,
  isMigratablePool,
  isStableLike,
  orderedPoolTokens,
  orderedTokenAddresses,
  totalAprLabel,
} from '@/composables/usePool';
import { bnum } from '@/lib/utils';
import { PoolWithShares } from '@/services/pool/types';
import { POOLS } from '@/constants/pools';

import PoolsTableActionsCell from './PoolsTableActionsCell.vue';
import TokenPills from './TokenPills/TokenPills.vue';
import TokenWeightsPills from './TokenPills/TokenWeightPill.vue';
import useStake from '@/composables/PolarisFinance/useStake';
import seigniorageAssetBackImg from '@/assets/images/coins/seigniorage-border.svg';
import communityAssetBackImg from '@/assets/images/coins/community-border.svg';
import classicAssetBackImg from '@/assets/images/coins/classic-border.svg';
const { isMobile, isDesktop } = useBreakpoints();

/**
 * TYPES
 */
type Props = {
  data: PoolWithShares[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  showPoolShares?: boolean;
  noPoolsLabel?: string;
  isPaginated?: boolean;
  selectedTokens?: string[];
  hiddenColumns?: string[];
  showBoost?: boolean;
  columnStates?: Record<string, string>;
  title: String;
  prices: any;
  noApr?: boolean;
  img: String;
  type: String;
};

/**
 * PROPS & EMITS
 */

const props = withDefaults(defineProps<Props>(), {
  isLoadingMore: false,
  showPoolShares: false,
  noPoolsLabel: 'No pools',
  isPaginated: false,
  hiddenColumns: () => [],
  showBoost: false,
  columnStates: () => ({}),
  data: () => [],
  selectedTokens: () => [],
  prices: [],
  noApr: false,
});

const emit = defineEmits(['loadMore', 'triggerStake']);

/**
 * COMPOSABLES
 */
const { fNum2 } = useNumbers();
const router = useRouter();
const { t } = useI18n();
const { trackGoal, Goals } = useFathom();
const { darkMode } = useDarkMode();
const { upToLargeBreakpoint, upToMediumBreakpoint } = useBreakpoints();

const wideCompositionWidth = computed(() =>
  upToMediumBreakpoint.value ? 450 : undefined
);

/**
 * DATA
 */
const columns = computed<ColumnDefinition<PoolWithShares>[]>(() => [
  {
    name: 'Icons',
    id: 'icons',
    accessor: 'uri',
    Header: 'iconColumnHeader',
    Cell: 'iconColumnCell',
    width: 125,
    noGrow: true,
  },
  {
    name: t('composition'),
    id: 'poolName',
    accessor: 'id',
    Cell: 'poolNameCell',
    width: props.hiddenColumns.length >= 2 ? wideCompositionWidth.value : 350,
  },
  {
    name: t('myBalance'),
    accessor: pool =>
      fNum2(pool.shares, {
        style: 'currency',
        maximumFractionDigits: 0,
        fixedFormat: true,
      }),
    align: 'right',
    id: 'myBalance',
    hidden: !props.showPoolShares,
    sortKey: pool => Number(pool.shares),
    width: 160,
    cellClassName: 'font-numeric',
  },
  {
    name: t('poolValue'),
    accessor: pool =>
      fNum2(pool.totalLiquidity, {
        style: 'currency',
        maximumFractionDigits: 0,
      }),
    align: 'right',
    id: 'poolValue',
    sortKey: pool => {
      const apr = Number(pool.totalLiquidity);
      if (apr === Infinity || isNaN(apr)) return 0;
      return apr;
    },
    width: 150,
    cellClassName: 'font-numeric',
  },
  {
    name: t('volume24h', [t('hourAbbrev')]),
    accessor: pool => pool?.volumeSnapshot || '0',
    align: 'right',
    id: 'poolVolume',
    Cell: 'volumeCell',
    sortKey: pool => {
      const volume = Number(pool?.volumeSnapshot);
      if (volume === Infinity || isNaN(volume)) return 0;
      return volume;
    },
    width: 175,
    cellClassName: 'font-numeric',
  },
  {
    name: t('myBoost'),
    accessor: pool =>
      pool?.boost ? `${bnum(pool?.boost).toFixed(3)}x` : 'N/A',
    align: 'right',
    id: 'myBoost',
    hidden: !props.showBoost,
    sortKey: pool => Number(pool?.boost || '0'),
    width: 150,
    cellClassName: 'font-numeric',
  },
  {
    name: props.showPoolShares ? t('myApr') : t('apr'),
    Cell: 'aprCell',
    accessor: pool => pool?.apr?.total.unstaked || '0',
    align: 'right',
    id: 'poolApr',
    sortKey: pool => {
      let apr = 0;

      if (pool?.apr) {
        apr = Number(absMaxApr(pool.apr, pool.boost));
      }

      return isFinite(apr) ? apr : 0;
    },
    width: 250,
  },
  {
    name: t('expiryDate'),
    Cell: 'lockEndDateCell',
    accessor: 'lockedEndDate',
    align: 'right',
    id: 'lockEndDate',
    width: 150,
  },
  {
    name: t('migrate'),
    Cell: 'migrateCell',
    accessor: 'migrate',
    align: 'center',
    id: 'migrate',
    width: 150,
  },
  {
    name: t('actions'),
    Cell: 'actionsCell',
    accessor: 'actions',
    align: 'center',
    id: 'actions',
    width: 150,
  },
]);

const visibleColumns = computed(() =>
  columns.value.filter(column => !props.hiddenColumns.includes(column.id))
);

/**
 * METHODS
 */
function handleRowClick(pool: PoolWithShares) {
  trackGoal(Goals.ClickPoolsTableRow);
  router.push({ name: 'pool', params: { id: pool.id } });
}

function navigateToPoolMigration(pool: PoolWithShares) {
  router.push({
    name: 'migrate-pool',
    params: {
      from: pool.id,
      to: POOL_MIGRATIONS_MAP[PoolMigrationType.AAVE_BOOSTED_POOL].toPoolId,
    },
    query: { returnRoute: 'home' },
  });
}

function aprLabelFor(pool: PoolWithShares): string {
  const poolAPRs = pool?.apr;
  if (!poolAPRs) return '0';

  return totalAprLabel(poolAPRs, pool.boost);
}

async function yearlyApr(pool: PoolWithShares) {
  const { getPoolApr } = useStake();
  const apr = await getPoolApr(pool.address, pool.id);
  return apr.yearlyAPR;
}

async function dailyApr(pool: PoolWithShares) {
  const { getPoolApr } = useStake();
  const apr = await getPoolApr(pool.address, pool.id);
  return apr.dailyAPR;
}

function lockedUntil(lockEndDate?: number) {
  return lockEndDate ? format(lockEndDate, PRETTY_DATE_FORMAT) : '—';
}

function iconAddresses(pool: PoolWithShares) {
  return POOLS.Metadata[pool.id]?.hasIcon
    ? [pool.address]
    : orderedTokenAddresses(pool);
}

function findCommonElements3(arr1, arr2) {
  for (let el1 of arr1) {
    for (let el2 of arr2) {
      if (el1.toLowerCase() === el2.toLowerCase()) {
        return false;
      }
    }
  }
  return true;
}
function poolAssetBackImage(type:String){
  if(type=='seigniorage')
    return seigniorageAssetBackImg;
  if(type=='classic')
    return classicAssetBackImg;
  if(type=='community')
    return communityAssetBackImg;
}
function selected(pool) {
  let found = true;
  const poolTokens = Object.values(pool.tokensList);
  const selectedTokens = Object.values(props.selectedTokens);

  if (selectedTokens.length == 0) return true;

  return !findCommonElements3(selectedTokens, poolTokens);
}
</script>

<script lang="ts">
import { defineComponent } from 'vue';

import { BigNumber } from 'ethers';
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
import usePoolQuery from '@/composables/queries/usePoolQuery';
import usePoolFilters from '@/composables/pools/usePoolFilters';
import useStreamedPoolsQuery from '@/composables/queries/useStreamedPoolsQuery';

export default defineComponent({
  data() {
    return {
      xpolarPoolQuery: usePoolQuery(
        '0x23a8a6e5d468e7acf4cc00bd575dbecf13bc7f78000100000000000000000015'
      ),
      aprs: {},
      pid: {
        '0x0993fa12d3256e85da64866354ec3532f187e178': 0,
        '0xf0b6cf745afe642c4565165922ad62d6a93857c1': 1,
        '0xd88a378abfe6b6e232525dfb03fbe01ecc863c10': 2,
        '0xa83f9fa9b51fc26e9925a07bc3375617b473e051': 3,
        '0xa215a58225b344cbb62fcf762e8e884dbedfbe58': 4,
        '0x293bbbef6087f681a8110f08bbdedadd13599fc3': 5,
        '0xceecce984f498ee00832670e9ca6d372f6ce155a': 6,
        '0x244caf21eaa7029db9d6b42ddf2d95800a2f5eb5': 7,
        '0x9cd44e44e8a61bc7dc34b04c762a3c0137a3707c': 8,
        '0x454adaa07eec2c432c0df4379a709b1fa4c800ed': 9,
        '0xb3a04902b78fbe61185b766866193630db4db8a3': 10,
        '0x4200333dc021ea5fb1050b8e4f8f3ed7cb1d22ed': 11,
        '0xd8e9e1916a4d98fb0dc6db725a8c8c2af08a329b': 12,
        '0x23a8a6e5d468e7acf4cc00bd575dbecf13bc7f78': 13,
        '0xf0f3b9eee32b1f490a4b8720cf6f005d4ae9ea86': 14,
        '0x3ac55ea8d2082fabda674270cd2367da96092889': 15,
        '0xafe0d6ca6aabb43cda024895d203120831ba0370': 16,
        '0xa69d9ba086d41425f35988613c156db9a88a1a96': 17,
        '0x17cbd9c274e90c537790c51b4015a65cd015497e': 18,
        '0x3a4773e600086a753862621a26a2e3274610da43': 19,
        '0x266437e6c7500a947012f19a3de96a3881a0449e': 20,
        '0x192bdcdd7b95a97ec66de5630a85967f6b79e695': 21,
        '0xce32b28c19c61b19823395730a0c7d91c671e54b': 22,
        '0xfa32616447c51f056db97bc1d0e2d4c0c4d059c9': 23,
        '0x89cc63050ade84bffafd7ec84d24fc0feb5f96c9': 24,
        '0xe370d4d0727d4e9b70db1a2f7d2efd1010ff1d6d': 25,
      },
      prices: this.prices,
      data: this.data,
    };
  },
  methods: {
    async fetchAll() {
      if (this.data.length == 0) {
        await new Promise((resolve, reject) => {
          const loop = () =>
            this.data.length !== 0
              ? resolve(this.data.length)
              : setTimeout(loop, 100);
          loop();
        });
      }
      const aprsPromises: any[] = [];
      for (var i = 0; i < this.data.length; i++) {
        aprsPromises.push(this.fetch(this.data[i]));
      }
      const aprs = await Promise.all(aprsPromises);
      for (var i = 0; i < this.data.length; i++) {
        this.aprs[this.data[i].address] = aprs[i];
      }
    },
    async fetch(pool) {
      const w3 = rpcProviderService.getJsonProvider(Network.AURORA);

      const xpolarRewardPoolAddress =
        '0x140e8a21d08CbB530929b012581a7C7e696145eF';
      const xpolarRewardPool = new Contract(
        xpolarRewardPoolAddress,
        xpolarRewardPoolABI,
        w3
      );

      const poolAddress = pool.address;

      const PID = {
        '0x0993fa12d3256e85da64866354ec3532f187e178': 0,
        '0xf0b6cf745afe642c4565165922ad62d6a93857c1': 1,
        '0xd88a378abfe6b6e232525dfb03fbe01ecc863c10': 2,
        '0xa83f9fa9b51fc26e9925a07bc3375617b473e051': 3,
        '0xa215a58225b344cbb62fcf762e8e884dbedfbe58': 4,
        '0x293bbbef6087f681a8110f08bbdedadd13599fc3': 5,
        '0xceecce984f498ee00832670e9ca6d372f6ce155a': 6,
        '0x244caf21eaa7029db9d6b42ddf2d95800a2f5eb5': 7,
        '0x9cd44e44e8a61bc7dc34b04c762a3c0137a3707c': 8,
        '0x454adaa07eec2c432c0df4379a709b1fa4c800ed': 9,
        '0xb3a04902b78fbe61185b766866193630db4db8a3': 10,
        '0x4200333dc021ea5fb1050b8e4f8f3ed7cb1d22ed': 11,
        '0xd8e9e1916a4d98fb0dc6db725a8c8c2af08a329b': 12,
        '0x23a8a6e5d468e7acf4cc00bd575dbecf13bc7f78': 13,
        '0xf0f3b9eee32b1f490a4b8720cf6f005d4ae9ea86': 14,
        '0x3ac55ea8d2082fabda674270cd2367da96092889': 15,
        '0xafe0d6ca6aabb43cda024895d203120831ba0370': 16,
        '0xa69d9ba086d41425f35988613c156db9a88a1a96': 17,
        '0x17cbd9c274e90c537790c51b4015a65cd015497e': 18,
        '0x3a4773e600086a753862621a26a2e3274610da43': 19,
        '0x266437e6c7500a947012f19a3de96a3881a0449e': 20,
        '0x192bdcdd7b95a97ec66de5630a85967f6b79e695': 21,
        '0xce32b28c19c61b19823395730a0c7d91c671e54b': 22,
        '0xfa32616447c51f056db97bc1d0e2d4c0c4d059c9': 23,
        '0x89cc63050ade84bffafd7ec84d24fc0feb5f96c9': 24,
        '0xe370d4d0727d4e9b70db1a2f7d2efd1010ff1d6d': 25,
      };

      if (this.xpolarPoolQuery?.data === undefined) {
        await new Promise((resolve, reject) => {
          const loop = () =>
            this.xpolarPoolQuery?.data !== undefined
              ? resolve(this.xpolarPoolQuery?.data)
              : setTimeout(loop, 100);
          loop();
        });
      }

      if (
        this.prices['0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d'] === undefined
      ) {
        await new Promise((resolve, reject) => {
          const loop = () =>
            this.prices['0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d'] !==
            undefined
              ? resolve(
                  this.prices['0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d']
                )
              : setTimeout(loop, 100);
          loop();
        });
      }

      if (pool.totalLiquidity == '0') {
        await new Promise((resolve, reject) => {
          const loop = () => {
            pool.totalLiquidity != '0'
              ? resolve(pool.totalLiquidity)
              : setTimeout(loop, 100);
            console.log('fetching pool total liquidity');
          };

          loop();
        });
      }
      const poolTotalLiquidty = pool.totalLiquidity;
      const xpolarPool = this.xpolarPoolQuery?.data;

      const xpolarBalance =
        xpolarPool?.onchain?.tokens[
          '0xeaf7665969f1daa3726ceada7c40ab27b3245993'
        ]?.balance;
      const nearBalance =
        xpolarPool?.onchain?.tokens[
          '0x990e50e781004ea75e2ba3a67eb69c0b1cd6e3a6'
        ]?.balance;

      const nearPrice =
        this.prices['0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d']['usd'];

      const xpolarPrice =
        (Number(nearBalance) / Number(xpolarBalance) / (0.2 / 0.4)) *
        Number(nearPrice);

      const pid = PID[poolAddress.toLowerCase()];
      const depositToken = new Contract(poolAddress, ERC20ABI, w3);

      const [xpolarPerSecond, allocPoint, stakedInPoolBigNumber] =
        await Promise.all([
          xpolarRewardPool.xpolarPerSecond(),
          xpolarRewardPool.poolInfo(pid),
          depositToken.balanceOf(xpolarRewardPoolAddress),
        ]);

      const stakedInPool = BigNumberToString(stakedInPoolBigNumber, 14, 4);

      const TVL = new BigNumberJs(poolTotalLiquidty || '')
        .div(pool.totalShares || '')
        .times(stakedInPool)
        .toString();

      const finalXpolarPerSecond = BigNumberToString(
        xpolarPerSecond.mul(allocPoint.allocPoint).div(800000),
        14,
        4
      );
      const tokenPerHour = Number(finalXpolarPerSecond) * 60 * 60;
      const totalRewardPricePerYear = tokenPerHour * 24 * 365 * xpolarPrice;
      const totalRewardPricePerDay = tokenPerHour * 24 * xpolarPrice;

      const dailyAPR = ((totalRewardPricePerDay / Number(TVL)) * 100)
        .toFixed(2)
        .toString();
      const yearlyAPR = ((totalRewardPricePerYear / Number(TVL)) * 100)
        .toFixed(2)
        .toString();

      return { dailyAPR: dailyAPR, yearlyAPR: yearlyAPR };
    },
  },
  created() {
    this.fetchAll();
  },
  async mounted() {
    const { selectedTokens } = usePoolFilters();
  },

  watch: {
    async data() {
      // this.fetchAll();
    },
    async prices() {
      // this.fetchAll();
    },
  },
});
</script>

<template>
  <div v-if="isMobile" class="pool-table-mobile mb-[24px]">
    <div class="table-title flex justify-between">
      <div class="flex w-full items-center">
        <!-- <img :src="img" class="mr-[12px] h-[14px] w-[24px]" /> -->
        <div>Pool name</div>
      </div>
      <div class="w-full justify-end text-right">TVL & APR</div>
    </div>
    <div class="mt-[12px]border w-full" />
    <div
      class="flex w-full items-center"
      v-for="(pool, idx) in data"
      :key="idx"
    >
      <router-link
        class="flex w-full items-center justify-between"
        :to="'/pool/' + pool.id"
      >
        <div class="flex-column mt-[20px]">
          <BalAssetSet
            :size="36"
            :addresses="iconAddresses(pool)"
            :width="100"
          />
          <div v-if="POOLS.Metadata[pool.id]" class="mt-[8px] text-left">
            {{ POOLS.Metadata[pool.id].name }}
          </div>
          <div v-else class="mt-[8px]">
            <TokenPills
              :tokens="
                orderedPoolTokens(pool.poolType, pool.address, pool.tokens)
              "
              :isStablePool="false"
              :selectedTokens="selectedTokens"
              :showWeight="pool['poolType'] != 'Stable'"
            />
          </div>
        </div>
        <div class="flex text-right">
          <div class="flex-column">
            <div class="tvl">
              <BalLoadingBlock v-if="!pool?.apr?.total?.unstaked" />
              <template v-else>
                <div>
                  {{
                    fNum2(pool?.totalLiquidity, {
                      style: 'currency',
                      maximumFractionDigits: 0,
                    }) + ' TVL'
                  }}
                </div>
              </template>
            </div>

            <div class="APR">
              <template v-if="noApr">
                <div class="h-4 w-12">
                  {{ '0' + '%' }}
                </div>
              </template>
              <BalLoadingBlock
                v-else-if="
                  !aprs ||
                  !aprs[pool.address] ||
                  !aprs[pool.address]['dailyAPR']
                "
              />
              <template v-else>
                <div>
                  {{ aprs[pool.address]['dailyAPR'] + '%' }}
                </div>
              </template>
            </div>
            <div class="APR">
              <template v-if="noApr">
                <div class="h-4 w-12">
                  {{ '0' + '%' }}
                </div>
              </template>
              <BalLoadingBlock
                v-else-if="
                  !aprs ||
                  !aprs[pool.address] ||
                  !aprs[pool.address]['yearlyAPR']
                "
              />
              <template v-else>
                <div>
                  {{ aprs[pool.address]['yearlyAPR'] + '%' }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
  <div class="pool-table mb-[40px]" v-if="isDesktop">
    <div class="table-title mt-[48px] flex w-full">
      <div class="grid-table">
        <div class="heading h-4 ">
          <div> <img v-if="img" 
                width="24"
                height="14"
                class="pool-icon inline-block mr-2"
                :src="img"
              /> {{ title }}</div>
        </div>
        <div class="heading h-4">APR</div>
        <div class="heading h-4">Liquidity</div>
        <div class="heading h-4">Volume (24h)</div>
        <!-- div>To Claim</div -->

        <div class="my-[24px] border" data-v-4eafebf8=""></div>

        <template
          class="flex w-full items-center"
          v-for="(pool, idx) in data"
          :key="idx"
        >
            <router-link
            :to="'/pool/' + pool.id"
            class="my-[18px] flex w-full items-center"
            v-if="selected(pool)"
          >
            <div class="flex w-full items-center">
              <BalAssetSet
                :size="34"
                :addresses="iconAddresses(pool)"
                :width="100"
                :backImage="poolAssetBackImage(type)"
              />
              <div v-if="POOLS.Metadata[pool.id]" class="text-left">
                {{ POOLS.Metadata[pool.id].name }}
              </div>
              <div v-else class="flex">
                <TokenPills class="token-pill"
                  :tokens="
                    orderedPoolTokens(pool.poolType, pool.address, pool.tokens)
                  "
                  :isStablePool="false"
                  :selectedTokens="selectedTokens"
                  :showWeight="false"
                />
                <TokenWeightsPills
                  :tokens="
                    orderedPoolTokens(pool.poolType, pool.address, pool.tokens)
                  "
                />
              </div>
            </div>
          </router-link>
            <div v-if="selected(pool)" class="apr flex my-[18px] self-center" >
              <template v-if="noApr">
                <div>{{ '0' + '%' }}</div>
              </template>
              <BalLoadingBlock
                v-else-if="
                  !aprs ||
                  !aprs[pool.address] ||
                  !aprs[pool.address]['yearlyAPR']
                "
                
              />
              <template v-else>
                <div>
                  {{ aprs[pool.address]['yearlyAPR'] + '%' }}
                </div>
                <div class="daily self-end">
                  <template v-if="noApr">
                    <div>
                      {{ '0' + '%' }} Daily
                    </div>
                  </template>
                  <BalLoadingBlock
                    v-else-if="
                      !aprs ||
                      !aprs[pool.address] ||
                      !aprs[pool.address]['dailyAPR']
                    "
                  />
                  <template v-else>
                      {{ aprs[pool.address]['dailyAPR'] + '%' }} Daily
                  </template>
                </div>
              </template>
            </div>
            <div v-if="selected(pool)" class="flex my-[18px] self-center">
              <BalLoadingBlock v-if="!pool?.totalLiquidity" class="h-4 w-12" />
              <span v-else class="h-4 w-12 text-right">
                {{
                  fNum2(pool?.totalLiquidity, {
                    style: 'currency',
                    maximumFractionDigits: 0,
                  })
                }}
              </span>
            </div>
            <div v-if="selected(pool)" class="flex my-[18px] self-center">
              <BalLoadingBlock v-if="!pool?.volumeSnapshot" class="h-4 w-12" />
              <span v-else class="h-4 w-12 text-right">
                {{ '$' + Math.round(pool?.volumeSnapshot, 2) }}
              </span>
            </div>
            <!-- div>
              <BalLoadingBlock
                v-if="!pool?.apr?.total?.unstaked"
                class="h-4 w-12"
              />
              <template v-else>
                <div class="h-4 w-12">
                  {{ Math.round(aprLabelFor(pool), 2) }}
                </div>
              </template>
            </div -->
    </template>

      </div>
    </div>
    
  </div>
  <!-- <BalCard
    shadow="lg"
    :square="upToLargeBreakpoint"
    :noBorder="upToLargeBreakpoint"
    noPad
  >
    <BalTable
      :columns="visibleColumns"
      :data="data"
      :noResultsLabel="noPoolsLabel"
      :isLoading="isLoading"
      :isLoadingMore="isLoadingMore"
      skeletonClass="h-64"
      sticky="both"
      :square="upToLargeBreakpoint"
      :link="{
        to: 'pool',
        getParams: pool => ({ id: pool.id || '' }),
      }"
      :onRowClick="handleRowClick"
      :isPaginated="isPaginated"
      :initialState="{
        sortColumn: 'poolValue',
        sortDirection: 'desc',
      }"
      @load-more="emit('loadMore')"
    >
      <template #iconColumnHeader>
        <div class="flex items-center">
          <img
            v-if="darkMode"
            :src="require('@/assets/images/icons/tokens_white.svg')"
          />
          <img
            v-else
            :src="require('@/assets/images/icons/tokens_black.svg')"
          />
        </div>
      </template>
      <template #iconColumnCell="pool">
        <div v-if="!isLoading" class="py-4 px-6">
          <BalAssetSet :addresses="iconAddresses(pool)" :width="100" />
        </div>
      </template>
      <template #poolNameCell="pool">
        <div v-if="!isLoading" class="flex items-center py-4 px-6">
          <div v-if="POOLS.Metadata[pool.id]" class="text-left">
            {{ POOLS.Metadata[pool.id].name }}
          </div>
          <div v-else>
            <TokenPills
              :tokens="
                orderedPoolTokens(pool.poolType, pool.address, pool.tokens)
              "
              :isStablePool="isStableLike(pool.poolType)"
              :selectedTokens="selectedTokens"
            />
            <BalChipNew v-if="pool?.isNew" class="ml-2" />
          </div>
        </div>
      </template>
      <template #volumeCell="pool">
        <div
          :key="columnStates.volume"
          class="flex justify-end py-4 px-6 -mt-1 font-numeric"
        >
          <BalLoadingBlock v-if="!pool?.volumeSnapshot" class="w-12 h-4" />
          <span v-else class="text-right">
            {{
              fNum2(pool?.volumeSnapshot, {
                style: 'currency',
                maximumFractionDigits: 0,
              })
            }}
          </span>
        </div>
      </template>
      <template #aprCell="pool">
        <div
          :key="columnStates.aprs"
          class="flex justify-end py-4 px-6 -mt-1 text-right font-numeric"
        >
          <BalLoadingBlock
            v-if="!pool?.apr?.total?.unstaked"
            class="w-12 h-4"
          />
          <template v-else>
            {{ aprLabelFor(pool) }}
            <APRTooltip v-if="pool?.apr?.total?.unstaked" :pool="pool" />
          </template>
        </div>
      </template>
      <template #migrateCell="pool">
        <div class="flex justify-center py-4 px-2">
          <BalBtn
            v-if="isMigratablePool(pool)"
            color="gradient"
            size="sm"
            @click.prevent="navigateToPoolMigration(pool)"
          >
            {{ $t('migrate') }}
          </BalBtn>
        </div>
      </template>
      <template #lockEndDateCell="pool">
        <div class="py-4 px-6 text-right">
          {{ lockedUntil(pool.lockedEndDate) }}
        </div>
      </template>
      <template #actionsCell="pool">
        <PoolsTableActionsCell
          :pool="pool"
          @click:stake="pool => emit('triggerStake', pool)"
        />
      </template>
    </BalTable>
  </BalCard> -->
</template>

<style scoped>
.pool-table {
  padding-top:0px;

  font-weight: 600;
  font-size: 20px;
  line-height: 26px;
  background-color: rgba(21, 1, 40, 1);
  color: #ffffff;
}

.table-title {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #d7b3ff;
}


.pool-table-mobile {
  background: #1e0d2c;
  box-shadow: 0px 0.949153px 1.89831px rgba(0, 0, 0, 0.25);
  border-radius: 16px;

  font-weight: 600;
  font-size: 20px;
  line-height: 26px;

  color: #ffffff;

  padding: 8px 12px;
}

.table-title {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: rgba(189, 178, 221, 1)
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 0.5fr);
  width: 100%;
}

.grid-table {
  display: grid;
  grid-template-columns: 50% auto;
  width: 100%;
  color: rgba(253, 253, 253, 1);
}
.grid-table .heading{
  color: #BDB2DD;;
}
.grid-table .border{
  grid-column: 1 / span 4;
  border: 0.5px solid rgba(151, 71, 255, 0.4);
}
.tvl {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: rgba(189, 178, 221, 1)
}

.apr {
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
}
.daily{
  color: #BDB2DD;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  padding-left: 12px;
}
.token-pill{
  margin-top: 0px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
}
</style>
