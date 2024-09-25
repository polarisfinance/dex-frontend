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
  return pools.value.filter(pool => !hiddenPoolsIds.includes(pool.id));
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
