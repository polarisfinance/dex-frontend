<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import HomePageHero from '@/components/heros/HomePageHero.vue';
import TokenSearchInput from '@/components/inputs/TokenSearchInput.vue';
import FeaturedProtocols from '@/components/sections/FeaturedProtocols.vue';
import PoolsTable from '@/components/tables/PoolsTable/PoolsTable.vue';
import usePoolFilters from '@/composables/pools/usePoolFilters';
import useBreakpoints from '@/composables/useBreakpoints';
import useNetwork from '@/composables/useNetwork';
import useWeb3 from '@/services/web3/useWeb3';
import usePools from '@/composables/pools/usePools';
import { InvestmentPool } from '@balancer-labs/typechain';
import useTokens from '@/composables/useTokens';
import PoolCard from '@/components/cards/PoolCard/PoolCard.vue';

const { prices } = useTokens();
import { POOLS } from '@/constants/pools';
import BalModal from '@/components/_global/BalModal/BalModal.vue';

const polarisPoolsIds = [
  '0x2ec560ba933e8994482af76d63378bdc5354402100020000000000000000002a',
  '0x4200333dc021ea5fb1050b8e4f8f3ed7cb1d22ed00020000000000000000000c',
  '0xb3a04902b78fbe61185b766866193630db4db8a300020000000000000000000d',
  '0xd88a378abfe6b6e232525dfb03fbe01ecc863c10000200000000000000000004',
  '0x244caf21eaa7029db9d6b42ddf2d95800a2f5eb500020000000000000000000a',
  '0x9127442d0a170cc0efb5d164582948f21c37312e000200000000000000000028',
  '0x9cd44e44e8a61bc7dc34b04c762a3c0137a3707c000200000000000000000002',
  '0x0993fa12d3256e85da64866354ec3532f187e178000200000000000000000008',
  '0xceecce984f498ee00832670e9ca6d372f6ce155a000200000000000000000014',
  '0xf53a4381f3a4f08726970bc6bb23c4ee3ef101ed000200000000000000000033',
  '0xa6ac7ce1d7aefd7abd06d93e6b89489aedf03d14000200000000000000000029',
  '0x454adaa07eec2c432c0df4379a709b1fa4c800ed000200000000000000000016',
  '0x293bbbef6087f681a8110f08bbdedadd13599fc3000200000000000000000007',
  '0x23a8a6e5d468e7acf4cc00bd575dbecf13bc7f78000100000000000000000015',
  '0x0fb037f35f5a00f66e3fc9a29f2dca59c12bfc5f000200000000000000000027',
  '0xa215a58225b344cbb62fcf762e8e884dbedfbe58000200000000000000000006',
  '0xa83f9fa9b51fc26e9925a07bc3375617b473e051000200000000000000000005',
  '0x435de7d1c13cfec80997510bd38bcb45282e6a0f000200000000000000000034',
  '0x6e7c170f95aba8ffbccaf5155706be0682cc5bd900020000000000000000002b',
  '0xe03dc509b05e7d80ee863c0d4144ddc5a03e652300020000000000000000002d',
  '0x5f5f57abf920a88e77513a28d41df39a0e0b4b6a000200000000000000000035',
  '0x3c5b26cde094fe7e5c75651a7ab5e9520ec06e5700020000000000000000002e',
  '0x4652df40de98c20e73d88983a8b74e4aa014bdf3000200000000000000000032',
  '0x80cba127d820f0138d252009b7a073955a4e7d75000200000000000000000039',
  '0xcfcd512c217c584f3bd78bea18eaf1a3e3fca913000200000000000000000003',
  '0xa5e2525631f9581a2db43d7008a4e7777f5a6df3000200000000000000000004',
  '0xc3a597155e4e33e93341db43623bf90c2ae90752000200000000000000000005',
  '0x21cfce445e0ec8444fd6e9195fea2a43952cbacd000200000000000000000007',
  '0x2621c0c2559a0d04a208f85e9720402ca5fdc779000200000000000000000008',
  '0x6b69bcc57ff6a6de441122bc7bc932834f10442300020000000000000000000a',
  '0x1396c11194d7da6f285fcb05886fc15a73f9816500020000000000000000000b',
  '0x40d708b40d97419d8da1412b08c2358e5bea2f5700020000000000000000000c',
  '0x25528334ce2f2f77072362f2681251fa05699f5e00020000000000000000000f',
  '0xe84e5418432beeeb543bbcdf9fa54fd7ea3aa65b000200000000000000000049',
  '0x46218d1962f39d96b9295a86d01849f36bf52a3e000000000000000000000047',
  '0xf45db6b9ea5a531fbde51e3f2915979e9210246d00020000000000000000004a',
  '0x7c2bb9c37036912228f36449d14f0f7e19c861f200020000000000000000004b',
  '0x6f6b70c5b9731fe5e4b1ade898dbb50a23dcb61600020000000000000000004c',
  '0x1ed3bbef2de9fb1b50827a27ee591f09c1ebda9a00020000000000000000004d',
  '0xde394782872384aec124ffc034c065efe1979d8d00020000000000000000004f',
  '0xbfb55273488fda258fda2224a5cb117efd01951e000000000000000000000012',
  '0x04964e22b2daafedba21d8029436712bb4b03114000200000000000000000015',
  '0xef0f1a69dd10373e3c98a9c13f71183cbf5419c7000200000000000000000016',
  '0x2a226c8726e0811ac58c1bbb53c883e064548771000200000000000000000018',
  '0x8466a3c4d60e120f9a2dbfa8bbf350c570f37afb000200000000000000000019',
  '0x747cdbc2f2ed7cfa0fad1f19c3fda05aaa252a15000200000000000000000014',
];

const hiddenPoolsIds = [
  '0x89cc63050ade84bffafd7ec84d24fc0feb5f96c9000200000000000000000020',
  '0x6e7c170f95aba8ffbccaf5155706be0682cc5bd900020000000000000000002b',
];

// COMPOSABLES
const router = useRouter();
const { appNetworkConfig } = useWeb3();
const isElementSupported = appNetworkConfig.supportsElementPools;
const { selectedTokens, addSelectedToken, removeSelectedToken } =
  usePoolFilters();

const poolsSortField = ref('totalLiquidity');

const { pools, isLoading, poolsIsFetchingNextPage, loadMorePools } = usePools(
  selectedTokens,
  poolsSortField
);

const { upToMediumBreakpoint, isMobile, isDesktop } = useBreakpoints();
const { networkSlug, networkConfig } = useNetwork();

const isPaginated = computed(
  () => pools.value.length >= POOLS.Pagination.PerPage
);
const polarisPools = computed(() => {
  return pools.value.filter(
    pool =>
      polarisPoolsIds.includes(pool.id) && !hiddenPoolsIds.includes(pool.id)
  );
});
const communityPools = computed(() => {
  return pools.value.filter(
    pool =>
      !polarisPoolsIds.includes(pool.id) && !hiddenPoolsIds.includes(pool.id)
  );
});

const hotPools = computed(() => {
  return polarisPools.value.sort((a, b) => b.apr?.max - a.apr?.max).slice(0, 6);
});
const hiddenColumns = computed(() => {
  if (isDesktop.value) return ['migrate', 'actions', 'lockEndDate'];
  else return ['icons', 'migrate', 'actions', 'lockEndDate', 'volume'];
});

/**
 * METHODS
 */
function navigateToCreatePool() {
  router.push({ name: 'create-pool', params: { networkSlug } });
}

function onColumnSort(columnId: string) {
  //This causes page to freeze. When there is no pagination, this is useless
  // poolsSortField.value = columnId;
}
</script>

<template>
  <div>
    <HomePageHero />

    <div id="hot-pools" class="container mx-auto">
      <h3 class="my-7 mx-7 font-semibold dark:text-polaris-white">
        Super Hot Pools
      </h3>
      <div
        class="grid gap-6"
        :class="{ 'grid-cols-1': isMobile, 'grid-cols-3': isDesktop }"
      >
        <BalLoadingBlock
          v-for="n in isDesktop ? 6 : 3"
          v-if="isLoading"
          class="h-56"
        />
        <template
          v-for="(pool, idx) in isDesktop
            ? hotPools.slice(0, 6)
            : hotPools.slice(0, 3)"
          v-else
          :key="idx"
        >
          <PoolCard :pool="pool" :selectedTokens="selectedTokens"></PoolCard>
        </template>
      </div>
    </div>

    <div class="xl:container xl:px-4 pt-10 md:pt-8 xl:mx-auto">
      <BalStack vertical>
        <div class="px-4 xl:px-0">
          <div
            class="flex justify-between items-end mb-2 font-semibold dark:text-polaris-white"
          >
            <!-- <h3>
              {{ networkConfig.chainName }}
              <span class="lowercase">{{ $t('pools') }}</span>
            </h3> -->
            <BalBtn
              v-if="upToMediumBreakpoint"
              class="font-semibold text-white polaris-small-button"
              :class="{ 'mt-4': upToMediumBreakpoint }"
              @click="navigateToCreatePool"
            >
              {{ $t('createAPool.title') }}
            </BalBtn>
          </div>

          <div
            class="flex flex-col md:flex-row justify-between items-end lg:items-center w-full dark:bg-polaris-card-default"
            :class="{ 'rounded-big': isDesktop, 'rounded-small': isMobile }"
          >
            <TokenSearchInput
              v-model="selectedTokens"
              class="w-full md:w-2/3"
              @add="addSelectedToken"
              @remove="removeSelectedToken"
            />
            <button
              v-if="!upToMediumBreakpoint"
              class="font-semibold text-white polaris-small-button"
              :class="{ 'mt-4': upToMediumBreakpoint }"
              :block="upToMediumBreakpoint"
              @click="navigateToCreatePool"
            >
              {{ $t('createAPool.title') }}
            </button>
          </div>
        </div>
        <PoolsTable
          :data="polarisPools"
          :noPoolsLabel="$t('noPoolsFound')"
          :isLoading="isLoading"
          :selectedTokens="selectedTokens"
          class="mt-7 mb-8"
          :hiddenColumns="hiddenColumns"
          :isLoadingMore="poolsIsFetchingNextPage"
          :isPaginated="isPaginated"
          skeletonClass="pools-table-loading-height"
          firstColumnHeading="Polaris Finance pools"
          @on-column-sort="onColumnSort"
          @load-more="loadMorePools"
        />
        <PoolsTable
          :data="communityPools"
          :noPoolsLabel="$t('noPoolsFound')"
          :isLoading="isLoading"
          :selectedTokens="selectedTokens"
          class="mt-7 mb-8"
          :hiddenColumns="hiddenColumns"
          :isLoadingMore="poolsIsFetchingNextPage"
          :isPaginated="isPaginated"
          skeletonClass="pools-table-loading-height"
          firstColumnHeading="Community pools"
          @on-column-sort="onColumnSort"
          @load-more="loadMorePools"
        />
        <!-- <div v-if="isElementSupported" class="p-4 xl:p-0 mt-16">
          <FeaturedProtocols />
        </div> -->
      </BalStack>
    </div>
  </div>
</template>

<style>
.pools-table-loading-height {
  height: 40rem;
}
</style>
