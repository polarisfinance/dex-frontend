<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';

import HomePageHero from '@/components/heros/HomePageHero.vue';
import TokenSearchInput from '@/components/inputs/TokenSearchInput.vue';
import FeaturedProtocols from '@/components/sections/FeaturedProtocols.vue';
import PoolsTable from '@/components/tables/PoolsTable/PoolsTable.vue';
import usePoolFilters from '@/composables/pools/usePoolFilters';
import useStreamedPoolsQuery from '@/composables/queries/useStreamedPoolsQuery';
import useBreakpoints from '@/composables/useBreakpoints';
import useWeb3 from '@/services/web3/useWeb3';

import segniorageImg from './segniorage.svg';
import singleStakingImg from './single-staking.svg';
import classicImg from './classic.svg';
import { InvestmentPool } from '@balancer-labs/typechain';

import { TOKENS } from '@/constants/tokens';

const { priceQueryLoading, tokens, getTokens } = useTokens();

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

const isInvestmentPoolsTableLoading = computed(
  () => dataStates.value['basic'] === 'loading' || priceQueryLoading.value
);

const segniorageIds = [
  '0xd88a378abfe6b6e232525dfb03fbe01ecc863c10000200000000000000000004',
  '0xa83f9fa9b51fc26e9925a07bc3375617b473e051000200000000000000000005',
  '0xa215a58225b344cbb62fcf762e8e884dbedfbe58000200000000000000000006',
  '0x293bbbef6087f681a8110f08bbdedadd13599fc3000200000000000000000007',
  '0x0993fa12d3256e85da64866354ec3532f187e178000200000000000000000008',
  '0xf0b6cf745afe642c4565165922ad62d6a93857c100020000000000000000000e',
];

const contains = (arr1, arr2) => {
  for (let el of arr1) {
    if (arr2.includes(el)) return true;
  }
  console.log('x');

  return false;
};

// const filteredTokensList: String[] = [];

// function filterToken(e) {
//   const filteredToken = e.target.value.toLowerCase();
//   filteredTokensList.length = 0;

//   for (const token of Object.entries(tokens.value)) {
//     const tokenName = token[1].name;
//     const tokenAddress = token[1].address;

//     if (tokenName.toLowerCase().includes(filteredToken)) {
//       filteredTokensList.push(tokenAddress);
//     }
//   }

//   console.log(filteredTokensList);
// }

const segnioragePools = computed(() => {
  return investmentPools.value.filter(pool =>
    segniorageIds.includes(pool.id)
  ) as InvestmentPool[];
});
const investmentPoolsWithoutSeigniorage = computed(
  () =>
    investmentPools.value.filter(
      pool => !segniorageIds.includes(pool.id)
    ) as InvestmentPool[]
);
/**
 * METHODS
 */
function navigateToCreatePool() {
  router.push({ name: 'create-pool' });
}

let searchTerm = ref('');

const getTokenNames = () => {
  const { tokens } = useTokens();
  const Tokens = Object.entries(tokens.value);
  const tokenList = [] as string[];

  for (const token of Object.entries(Tokens)) {
    const tokenName: string = token[1][1]['name'];

    tokenList.push(tokenName);
  }
  console.log(tokenList);

  return tokenList;
};

const getTokenMapping = () => {
  const { tokens } = useTokens();
  const Tokens = Object.entries(tokens.value);
  const tokenList = {};

  for (const token of Object.entries(Tokens)) {
    const tokenName: string = token[1][1]['name'];
    const tokenAddress: string = token[1][1]['address'];

    tokenList[tokenName] = tokenAddress;
  }

  return tokenList;
};

const mapping = getTokenMapping();

const searchTokens = computed(() => {
  if (searchTerm.value === '') {
    return [];
  }

  const tokenNames = getTokenNames();

  return tokenNames.filter(token => {
    if (token.toLowerCase().includes(searchTerm.value.toLowerCase())) {
      return token;
    }
  });
});

let selectedToken = ref('');

const selectToken = token => {
  selectedToken.value = token;
  searchTerm.value = token;
};
</script>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import useTokens from '@/composables/useTokens';
import { TokenInfo } from '@/types/TokenList';

export default defineComponent({
  created() {
    const { tokens } = useTokens();
    this.tokens = Object.entries(tokens.value);
  },
  data() {
    return {
      filteredTokensList: [] as string[],
      tokens: [] as [string, TokenInfo][],
      inputFocused: false,
    };
  },
  methods: {
    filterToken(e) {
      const filteredToken = e.target.value;
      this.filteredTokensList.length = 0;
      const tokens = this.tokens;
      const tokenList = [] as string[];

      for (const token of Object.entries(tokens)) {
        const tokenName: string = token[1]['name'];
        const tokenAddress: string = token[1]['address'];

        if (
          tokenName &&
          filteredToken &&
          !tokenName.toLowerCase().includes(filteredToken.toLowerCase())
        ) {
          tokenList.push(tokenAddress);
        }
      }

      this.filteredTokensList = tokenList;
    },
  },
});
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
          <div class="flex gap-[18px]">
            <div class="relative" @click="inputFocused = true">
              <div class="search flex items-center">
                <img src="./search.svg" class="mr-[12px]" />
                <input
                  type="text"
                  placeholder="Filter by token"
                  class="input"
                  v-on:input="filterToken"
                  v-model="searchTerm"
                />
              </div>
              <!-- <ul class="absolute w-full text-center list" v-if="inputFocused">
                <li
                  v-for="token in searchTokens"
                  :key="token"
                  @click="selectToken(token)"
                >
                  <div class="flex justify-between px-[10px] py-[5px]">
                    <BalAsset :address="mapping[token]" />
                    <div>{{ token }}</div>
                  </div>
                </li>
              </ul> -->
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
          :key="filteredTokensList"
          :data="segnioragePools"
          :noPoolsLabel="$t('noPoolsFound')"
          :isLoadingMore="isLoadingMore"
          :selectedTokens="filteredTokensList"
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
      <!-- <div id="singlestaking">
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
      </div> -->
      <div id="classicpools">
        <PoolsTable
          :key="filteredTokensList"
          :data="investmentPoolsWithoutSeigniorage"
          :noPoolsLabel="$t('noPoolsFound')"
          :isLoadingMore="isLoadingMore"
          :selectedTokens="filteredTokensList"
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
      <!-- <div v-if="isElementSupported" class="mt-16 p-4 xl:p-0">
        <FeaturedProtocols />
      </div> -->
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

.list {
  z-index: 100;
  background: #231928;
}
</style>
