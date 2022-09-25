<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import HomePageHero from '@/components/heros/HomePageHero.vue';
import TokenSearchInput from '@/components/inputs/TokenSearchInput.vue';
import FeaturedProtocols from '@/components/sections/FeaturedProtocols.vue';
import PoolsTable from '@/components/tables/PoolsTable/PoolsTable.vue';
import usePoolFilters from '@/composables/pools/usePoolFilters';
import useStreamedPoolsQuery from '@/composables/queries/useStreamedPoolsQuery';
import useBreakpoints from '@/composables/useBreakpoints';
import useTokens from '@/composables/useTokens';
import useWeb3 from '@/services/web3/useWeb3';

import segniorageImg from './segniorage.svg';
import singleStakingImg from './single-staking.svg';
import classicImg from './classic.svg';
import { InvestmentPool } from '@balancer-labs/typechain';

// COMPOSABLES
const router = useRouter();
const { appNetworkConfig } = useWeb3();
const isElementSupported = appNetworkConfig.supportsElementPools;
const { selectedTokens, addSelectedToken, removeSelectedToken } =
  usePoolFilters();

const {
  dataStates,
  result: investmentPools,
  loadMore,
  isLoadingMore,
} = useStreamedPoolsQuery(selectedTokens);
const { upToMediumBreakpoint, isMobile, isDesktop } = useBreakpoints();
const { priceQueryLoading } = useTokens();

const isInvestmentPoolsTableLoading = computed(
  () => dataStates.value['basic'] === 'loading' || priceQueryLoading.value
);

/**
 * METHODS
 */
function navigateToCreatePool() {
  router.push({ name: 'create-pool' });
}
</script>

<template>
  <HomePageHero />
  <div class="mt-[81px] pt-10 md:pt-12 xl:container xl:mx-auto">
    <BalStack vertical>
      <div class="px-4 xl:px-0">
        <div
          class="flex w-full flex-col items-end justify-between md:flex-row lg:items-center"
          v-if="isDesktop"
        >
          <!-- <TokenSearchInput
            v-model="selectedTokens"
            class="w-full md:w-2/3"
            @add="addSelectedToken"
            @remove="removeSelectedToken"
          /> -->
          <div class="flex gap-[18px]">
            <div class="search flex items-center">
              <img src="./search.svg" class="mr-[12px]" />
              <input type="text" placeholder="Filter by token" class="input" />
            </div>
            <div
              class="pool-types flex items-center gap-[8px] pl-[12px] pt-[8px] pb-[8px] pr-[16px]"
            >
              <div class="favourites-text mr-[12px]">Favourites</div>
              <a href="#segniorage"
                ><div class="segniorage-btn cursor-pointer">
                  Segniorage Pools
                </div></a
              >
              <a href="#singlestaking">
                <div class="pool-type-btn cursor-pointer">Single Staking</div>
              </a>
              <a href="#classicpools">
                <div class="pool-type-btn cursor-pointer">Classic Pools</div>
              </a>
            </div>
          </div>

          <button
            class="create-pool-btn flex items-center"
            @click="navigateToCreatePool"
          >
            <img src="./plus.svg" class="mr-[8px]" />
            <div>Create a pool</div>
          </button>
        </div>

        <div v-if="isMobile">
          <div
            class="flex w-full items-center rounded-[12px] bg-[#231928] px-[24px] pb-[9px] pt-[9px] pl-[16px]"
          >
            <img src="./search.svg" class="mr-[12px]" />
            <input type="text" placeholder="Filter by token" class="input" />
          </div>
          <div class="mt-[8px] flex justify-center gap-[8px]">
            <a href="#segniorage">
              <div class="segniorage mobile-pool-btn">Segniorage Pools</div>
            </a>
            <a href="#singlestaking">
              <div class="mobile-pool-btn">Single Staking</div>
            </a>
            <a href="#classicpools">
              <div class="mobile-pool-btn">Classic Pools</div>
            </a>
          </div>
          <button
            class="create-pool-btn-mobile mt-[8px] flex w-full items-center justify-center"
            @click="navigateToCreatePool"
          >
            <img src="./plus.svg" class="mr-[8px]" />
            <div>Create a pool</div>
          </button>
        </div>
      </div>
      <div id="segniorage">
        <PoolsTable
          :data="investmentPools"
          :noPoolsLabel="$t('noPoolsFound')"
          :isLoadingMore="isLoadingMore"
          :selectedTokens="selectedTokens"
          class="mb-8"
          :hiddenColumns="['migrate', 'actions', 'lockEndDate']"
          :columnStates="dataStates"
          :isPaginated="true"
          :isLoading="isInvestmentPoolsTableLoading"
          @load-more="loadMore"
          :title="'Segniorage Pools'"
          :img="segniorageImg"
        />
      </div>
      <div id="singlestaking">
        <PoolsTable
          :data="investmentPools"
          :noPoolsLabel="$t('noPoolsFound')"
          :isLoadingMore="isLoadingMore"
          :selectedTokens="selectedTokens"
          class="mb-8"
          :hiddenColumns="['migrate', 'actions', 'lockEndDate']"
          :columnStates="dataStates"
          :isPaginated="true"
          :isLoading="isInvestmentPoolsTableLoading"
          @load-more="loadMore"
          :title="'Single Staking'"
          :img="singleStakingImg"
        />
      </div>
      <div id="classicpools">
        <PoolsTable
          :data="investmentPools"
          :noPoolsLabel="$t('noPoolsFound')"
          :isLoadingMore="isLoadingMore"
          :selectedTokens="selectedTokens"
          class="mb-8"
          :hiddenColumns="['migrate', 'actions', 'lockEndDate']"
          :columnStates="dataStates"
          :isPaginated="true"
          :isLoading="isInvestmentPoolsTableLoading"
          @load-more="loadMore"
          :title="'Classic Pools'"
          :img="classicImg"
        />
      </div>
      <div v-if="isElementSupported" class="mt-16 p-4 xl:p-0">
        <FeaturedProtocols />
      </div>
    </BalStack>
  </div>
</template>

<style scoped>
.create-pool-btn {
  background: #7b307f;
  border-radius: 12px;

  padding: 10px 16px;
  color: white;
}

.create-pool-btn:hover {
  background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    rgba(123, 48, 127, 0.7) 0%,
    rgba(123, 48, 127, 0.567) 100%
  );
}

.create-pool-btn:active {
  background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    rgba(123, 48, 127, 0.5) 0%,
    rgba(123, 48, 127, 0.405) 100%
  );
}

.search {
  background: #231928;
  border-radius: 12px;
  padding-left: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 160px;

  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #b9babb;
}

.pool-types {
  background: #231928;
  border-radius: 12px;
}

.input {
  background-color: #231928;
}

.input::placeholder {
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #b9babb;
}

.favourites-text {
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #b9babb;
}

.segniorage-btn {
  padding: 4px 16px;

  background: #2e2433;
  border-radius: 12px;

  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #fdfdfd;
  background: linear-gradient(#2e2433, #2e2433) padding-box,
    linear-gradient(to bottom left, #fbaaff, #9747ff, #f89c01) border-box;
  border: 1px solid transparent;
}

.pool-type-btn {
  padding: 4px 16px;
  background: #2e2433;
  border-radius: 12px;

  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #fdfdfd;
}

.segniorage {
  background: linear-gradient(#2e2433, #2e2433) padding-box,
    linear-gradient(to bottom left, #fbaaff, #9747ff, #f89c01) border-box;
  border: 1px solid transparent;
}

.mobile-pool-btn {
  border-radius: 12px;
  padding: 4px 5px;
  background-color: #2e2433;

  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #fdfdfd;
}

.create-pool-btn-mobile {
  background: #7b307f;
  border-radius: 12px;

  padding: 10px 16px;
  color: white;
}

.create-pool-btn-mobile:hover {
  background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    rgba(123, 48, 127, 0.7) 0%,
    rgba(123, 48, 127, 0.567) 100%
  );
}

.create-pool-btn-mobile:active {
  background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    rgba(123, 48, 127, 0.5) 0%,
    rgba(123, 48, 127, 0.405) 100%
  );
}
</style>
