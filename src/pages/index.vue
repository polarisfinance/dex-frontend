<script setup lang="ts">
import { watch,Ref } from 'vue';
import { useRouter } from 'vue-router';

import HomePageHero from '@/components/heros/HomePageHero.vue';
import TokenSearchInput from '@/components/inputs/TokenSearchInput.vue';
import FeaturedProtocols from '@/components/sections/FeaturedProtocols.vue';
import PoolsTable from '@/components/tables/PoolsTable/PoolsTable.vue';
import PoolCard from '@/components/cards/PoolCard/PoolCard.vue';
import ClaimCard from '@/components/cards/ClaimCard/ClaimCard.vue';
import usePoolFilters from '@/composables/pools/usePoolFilters';
import useStreamedPoolsQuery from '@/composables/queries/useStreamedPoolsQuery';
import useBreakpoints from '@/composables/useBreakpoints';
import useWeb3 from '@/services/web3/useWeb3';

import segniorageImg from './pool-icon-seigniorage.svg';
import classicImg from './pool-icon-classic.svg';
import communityImg from './pool-icon-community.svg';
import { InvestmentPool } from '@balancer-labs/typechain';

import { TOKENS } from '@/constants/tokens';
import SingleStake from './SingleStakeTable.vue';

const { priceQueryLoading, tokens, getTokens, prices } = useTokens();

// COMPOSABLES
const router = useRouter();
const { appNetworkConfig } = useWeb3();
const isElementSupported = appNetworkConfig.supportsElementPools;
const { selectedTokens, addSelectedToken, removeSelectedToken } =
  usePoolFilters();

// var segnioragepools,classicpools,singlepools,communitypools;

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

const classicPoolsIds = [
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

const superHotPoolsIds = [
  '0x23a8a6e5d468e7acf4cc00bd575dbecf13bc7f78000100000000000000000015',
  '0x293bbbef6087f681a8110f08bbdedadd13599fc3000200000000000000000007',
  '0xd88a378abfe6b6e232525dfb03fbe01ecc863c10000200000000000000000004',
  '0x0993fa12d3256e85da64866354ec3532f187e178000200000000000000000008',
  '0xe370d4d0727d4e9b70db1a2f7d2efd1010ff1d6d000200000000000000000021',
  '0x244caf21eaa7029db9d6b42ddf2d95800a2f5eb500020000000000000000000a',
  
];

const contains = (arr1, arr2) => {
  for (let el of arr1) {
    if (arr2.includes(el)) return true;
  }

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
    investmentPools.value.filter(pool =>
      classicPoolsIds.includes(pool.id)
    ) as InvestmentPool[]
);

const communityPools = computed(
  () =>
    investmentPools.value.filter(
      pool =>
        !segniorageIds.includes(pool.id) && !classicPoolsIds.includes(pool.id)
    ) as InvestmentPool[]
);
const superHotPools = computed(() => {
  return investmentPools.value.filter(pool =>
    superHotPoolsIds.includes(pool.id)
  ) as InvestmentPool[];
});

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
    const tokenName: string = token[1][1]['symbol'];
    // console.log(token);
    tokenList.push(tokenName);
  }

  return tokenList;
};

const getTokenMapping = () => {
  const { tokens } = useTokens();
  const Tokens = Object.entries(tokens.value);
  const tokenList = {};

  for (const token of Object.entries(Tokens)) {
    const tokenName: string = token[1][1]['symbol'];
    const tokenAddress: string = token[1][1]['address'];
    // console.log(token[1][1]['symbol']);
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
import useBreakPoints from '@/composables/useBreakpoints';
var segnioragepools,classicpools,singlepools,communitypools;
const { upToMediumBreakpoint, isMobile, isDesktop } = useBreakPoints();
export default defineComponent({
  created() {
    const { tokens, getToken } = useTokens();
    this.tokens = Object.entries(tokens.value);
    Object.entries(tokens.value).forEach(token => {
      this.tokenNames[getToken(token[0]).symbol] = token[0];
    });

    window.addEventListener('scroll', this.onScroll);
    
  },
  
  data() {
    return {
      filteredTokensList: [] as string[],
      tokens: [] as [string, TokenInfo][],
      inputFocused: false,
      tokenNames: {},
      stickyPanel: false,
      selectedPool:'segniorage',
      singlepoolsTop:0,
      classicpoolsTop:0,
      segnioragepoolsTop:0,
      communitypoolsTop:0,
    };
  },
  mounted () {
    singlepools = this.$refs['singlepools'];
    segnioragepools = this.$refs['segnioragepools']
    classicpools = this.$refs['classicpools']
    communitypools = this.$refs['communitypools'];
    console.log('MOUNTED: '+segnioragepools);
  },
  methods: {
    filterToken(e) {
      const filteredToken = e.target.value;
      this.filteredTokensList.length = 0;
      const tokens = this.tokens;
      const tokenList = [] as string[];

      for (const token of Object.entries(this.tokenNames)) {
        const tokenName: string = token[0] as string;
        const tokenAddress: string = token[1] as string;

        if (
          tokenName &&
          filteredToken &&
          tokenName.toLowerCase().includes(filteredToken.toLowerCase())
        ) {
          tokenList.push(tokenAddress);
        }
      }

      this.filteredTokensList = tokenList;
    },
    onScroll() {
      console.log(segnioragepools);
      if ( 
        (segnioragepools.getBoundingClientRect().top<250 && isMobile.value) ||
        (segnioragepools.getBoundingClientRect().top<125 && isDesktop.value) 
      ) {
        this.stickyPanel = true;
      } else {
        this.stickyPanel = false;
      }

      if(singlepools != undefined &&  singlepools.getBoundingClientRect().top<100){
        this.selectedPool = 'single';
      }
      else if(communitypools != undefined && communitypools.getBoundingClientRect().top<100){
        this.selectedPool = 'community';
      }
      else if(classicpools != undefined && classicpools.getBoundingClientRect().top<100){
        this.selectedPool = 'classic';
      }
      else if(segnioragepools != undefined && segnioragepools.getBoundingClientRect().top<100){
        this.selectedPool = 'segniorage';
      }
      
    },
  },
  watch:{
  }
});
</script>

<template>
    <HomePageHero />
    <ClaimCard
    :pools="segnioragePools.concat(communityPools).concat(investmentPoolsWithoutSeigniorage)"
    :prices="prices"
    />

    <div class="container mx-auto" id="hot-pools">
      <h3 class="mx-7 my-7 font-semibold">Super Hot Pools</h3>
      <div class="grid gap-6" :class="{'grid-cols-1':isMobile, 'grid-cols-3':isDesktop}">
        <template v-for="(pool, idx)      in      (isDesktop) ? superHotPools.slice(0, 6) :superHotPools.slice(0, 3)  " :key="idx">
          <PoolCard
          :pool="pool"
          :prices="prices"
          ></PoolCard>
        </template>
      </div>
    </div>
  
    <div class="mt-[81px] pt-10 md:pt-12 xl:container xl:mx-auto ">
      <BalStack vertical>
        <div
          class="container px-4 xl:px-0 mb-4 pool-panel"
          :class="{
            'is-sticky': stickyPanel,
            'navbar-bg': stickyPanel,
            'not-sticky': !stickyPanel,
            'filter-panel-mobile': isMobile,
          }"
        >
          <div
            class="flex w-full flex-col items-end justify-between md:flex-row lg:items-center mb-0"
            v-if="isDesktop"
          >
            <div class="search flex items-center" @click="inputFocused = true">
              <img src="./search.svg" class="mr-[12px]" />
              <input
                type="text"
                placeholder="Filter by token"
                class="input w-full"
                v-on:input="filterToken"
                v-model="searchTerm"
              />
            </div>
            <div
              class="pool-types flex items-center gap-[8px] pl-[12px] pr-[16px]"
            >
              <!--<div class="favourites-text mr-[12px]">Favourites</div>-->
              <a href="#segniorage">
                <div class="pool-type-btn cursor-pointer mx-[12px]" :class="{'selected-pool': selectedPool =='segniorage'}">Seigniorage Pools</div>
              </a>
              <a href="#classicpools">
                <div class="pool-type-btn cursor-pointer mx-[12px]" :class="{'selected-pool': selectedPool =='classic'}">Classic Pools</div>
              </a>
              <a href="#communitypools">
                <div class="pool-type-btn cursor-pointer mx-[12px]" :class="{'selected-pool': selectedPool =='community'}">Community Pools</div>
              </a>
              <a href="#singlestaking">
                <div class="pool-type-btn cursor-pointer mx-[12px]" :class="{'selected-pool': selectedPool =='single'}">Single Staking</div>
              </a>
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
              class="flex w-full items-center rounded-[12px] bg-[#261737] px-[24px] pb-[9px] pt-[9px] pl-[16px]"
            >
              <img src="./search.svg" class="mr-[12px]" />
              <input type="text" placeholder="Filter by token" class="input" />
            </div>
            <div class="mt-[8px] flex justify-center gap-[8px] px-5">
              <a href="#segniorage">
                <div class="pool-type-btn cursor-pointer px-[9px] py-[16px] text-center" :class="{'selected-pool': selectedPool =='segniorage'}">Seigniorage Pools</div>
              </a>
              <a href="#classicpools">
                <div class="pool-type-btn cursor-pointer px-[9px] py-[16px] text-center" :class="{'selected-pool': selectedPool =='classic'}">Classic Pools</div>
              </a>
              <a href="#communitypools">
                <div class="pool-type-btn cursor-pointer px-[9px] py-[16px] text-center" :class="{'selected-pool': selectedPool =='community'}">Community Pools</div>
              </a>
              <a href="#singlestaking">
                <div class="pool-type-btn cursor-pointer px-[9px] py-[16px] text-center" :class="{'selected-pool': selectedPool =='single'}">Single Staking</div>
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
        <div id="segniorage" ref="segnioragepools" :class="{
            'mt-[50px]': stickyPanel && isDesktop,
            'mt-[250px]': stickyPanel && isMobile,
          }">
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
            :title="'Seigniorage Pools'"
            :type="'seigniorage'"
            :img="segniorageImg"
            :prices="prices"
          />
        </div>
        <div id="classicpools" ref="classicpools">
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
            :prices="prices"
            :type="'classic'"
            :img="classicImg"
          />
        </div>
        <div id="communitypools" ref="communitypools" >
          <PoolsTable
            :key="filteredTokensList"
            :data="communityPools"
            :noPoolsLabel="$t('noPoolsFound')"
            :isLoadingMore="isLoadingMore"
            :selectedTokens="filteredTokensList"
            class="mb-8"
            :hiddenColumns="['migrate', 'actions', 'lockEndDate']"
            :columnStates="dataStates"
            :isPaginated="true"
            :isLoading="isInvestmentPoolsTableLoading"
            @load-more="loadMore"
            :title="'Community Pools'"
            :type="'community'"
            :img="communityImg"
            :noApr="true"
          />
        </div>
        <div id="singlestaking" ref="singlepools" >
          <SingleStake />
        </div>
        <!-- <div v-if="isElementSupported" class="mt-16 p-4 xl:p-0">
          <FeaturedProtocols />
        </div> -->
      </BalStack>
    </div>
    
</template>
<style scoped>

.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-text {
  position: absolute;
  font-weight: 600;
  font-size: 64px;
  line-height: 82px;
  text-align: center;
  color: #fdfdfd;
}

.create-pool-btn {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
  border-radius: 24px;
  padding: 10px 17px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
}

.create-pool-btn:hover{
  background: linear-gradient(93.62deg, rgba(192, 4, 254, 0.7) 2.98%, rgba(126, 2, 245, 0.7) 97.02%);
}

.search {

  max-width: 300px;
  border-radius: 12px;
  padding-left: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 10px;
  width: 100%;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #b9babb;
}

.pool-types {
  text-align: center;
}

.input {
  background-color: transparent;
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

.selected-pool {
  padding: 9px 16px;

  background: #150128;
  border-radius: 48px;

  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #fdfdfd;
  background: linear-gradient(#1e0d2c, #1e0d2c) padding-box,
    linear-gradient(90deg,rgba(192, 4, 254, 1), rgba(126, 2, 245, 1)) border-box;
  border: 1px solid transparent;
}
.filter-panel-mobile .selected-pool{
  margin-top: 5px;
}

.pool-type-btn {
  border-radius: 48px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: rgba(189, 178, 221, 1);
}
.pool-type-btn:hover{
  color: #FDFDFD;
}

.segniorage {
  background: linear-gradient(#261737, #261737) padding-box,
    linear-gradient(to bottom left, #fbaaff, #9747ff, #f89c01) border-box;
  border: 1px solid transparent;
}

.mobile-pool-btn {
  border-radius: 12px;
  padding: 4px 5px;
  background-color: #261737;

  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #fdfdfd;
}

.create-pool-btn-mobile {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
  border-radius: 12px;

  padding: 10px 16px;
  color: white;
}

.create-pool-btn-mobile:hover {
  /* background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    rgba(123, 48, 127, 0.7) 0%,
    rgba(123, 48, 127, 0.567) 100%
  ); */
}

.create-pool-btn-mobile:active {
  /* background: radial-gradient(
    49.66% 488.58% at 50% 30%,
    rgba(123, 48, 127, 0.5) 0%,
    rgba(123, 48, 127, 0.405) 100%
  ); */
}

.list {
  z-index: 100;
  background: #231928;
}
.pool-panel{
  background-color: #292043;
  border-radius: 48px;

}
.is-sticky {
  position: fixed;
  top: 79px;
  z-index: 21;
  background: linear-gradient(
    90.08deg,
    rgba(19, 7, 25, 0.7) -0.61%,
    rgba(19, 7, 25, 0.7) 100%
  );
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
.not-sticky {
  position: relative;
}


.filter-panel-mobile{
  border-radius: 0px;
  width: 100%;
  max-width: none;
  padding-top: 20px;
}
.is-sticky.filter-panel-mobile{
  top: 69px;
}
</style>