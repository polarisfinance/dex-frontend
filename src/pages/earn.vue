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

const isPaginated = computed(() => pools.value.length >= 10);

/**
 * METHODS
 */
function navigateToCreatePool() {
  router.push({ name: 'create-pool', params: { networkSlug } });
}

function onColumnSort(columnId: string) {
  poolsSortField.value = columnId;
}



</script>

<template>
  <div>
    <HomePageHero />

    <div class="container mx-auto" id="hot-pools">
      <h3 class="mx-7 my-7 dark:text-polaris-white font-semibold">Super Hot Pools</h3>
      <div class="grid gap-6" :class="{'grid-cols-1':isMobile, 'grid-cols-3':isDesktop}">
        <template v-for="(pool, idx)      in      (isDesktop) ? pools.slice(0, 6) :pools.slice(0, 3)  " :key="idx">
          <PoolCard
          :pool="pool"
          :selectedTokens="selectedTokens"
          ></PoolCard>
        </template>
      </div>
    </div>

    <div class="xl:container xl:px-4 pt-10 md:pt-8 xl:mx-auto">
      <BalStack vertical>
        <div class="px-4 xl:px-0">
          <div class="flex justify-between items-end mb-2">
            <h3>
              {{ networkConfig.chainName }}
              <span class="lowercase">{{ $t('pools') }}</span>
            </h3>
            <BalBtn
              v-if="upToMediumBreakpoint"
              color="blue"
              size="sm"
              outline
              :class="{ 'mt-4': upToMediumBreakpoint }"
              @click="navigateToCreatePool"
            >
              {{ $t('createAPool.title') }}
            </BalBtn>
          </div>

          <div
            class="flex flex-col md:flex-row justify-between items-end lg:items-center w-full dark:bg-polaris-card-default rounded-big"
          >
            <TokenSearchInput
              v-model="selectedTokens"
              class="w-full md:w-2/3 "
              @add="addSelectedToken"
              @remove="removeSelectedToken"
            />
            <button
              v-if="!upToMediumBreakpoint"
              class="polaris-small-button text-white font-semibold"
              :class="{ 'mt-4': upToMediumBreakpoint }"
              :block="upToMediumBreakpoint"
              @click="navigateToCreatePool"
          >
            {{ $t('createAPool.title') }}
          </button>
          </div>
        </div>
        <PoolsTable
          :data="pools"
          :noPoolsLabel="$t('noPoolsFound')"
          :isLoading="isLoading"
          :selectedTokens="selectedTokens"
          class="mb-8"
          :hiddenColumns="['migrate', 'actions', 'lockEndDate']"
          :isLoadingMore="poolsIsFetchingNextPage"
          :isPaginated="isPaginated"
          skeletonClass="pools-table-loading-height"
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
