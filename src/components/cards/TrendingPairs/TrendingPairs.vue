<script setup lang="ts">
import { getAddress } from '@ethersproject/address';
import { getUnixTime } from 'date-fns';
import { computed } from 'vue';
import { useQuery } from 'vue-query';

import { useTradeState } from '@/composables/trade/useTradeState';
import useBreakpoints from '@/composables/useBreakpoints';
import QUERY_KEYS from '@/constants/queryKeys';
import { balancerSubgraphService } from '@/services/balancer/subgraph/balancer-subgraph.service';
import useWeb3 from '@/services/web3/useWeb3';

type TrendingPair = {
  symbol: string;
  address: string;
};

const { setTokenOutAddress, setTokenInAddress } = useTradeState();
const { chainId: userNetworkId, appNetworkConfig } = useWeb3();
const { upToLargeBreakpoint } = useBreakpoints();

const getTrendingTradePairs = async () => {
  return await balancerSubgraphService.tradePairSnapshots.get({
    orderBy: 'totalSwapVolume',
    orderDirection: 'desc',
    where: {
      timestamp_gte: getUnixTime(new Date().setUTCHours(0, 0, 0, 0)),
    },
    first: 6,
  });
};

const { data: tradePairSnapshots } = useQuery(
  QUERY_KEYS.Tokens.TrendingPairs(userNetworkId),
  () => getTrendingTradePairs()
);

function formatToken({ address, symbol }: { address: string; symbol: string }) {
  const formatted = getAddress(address);

  if (formatted === appNetworkConfig.addresses.weth) {
    return {
      address: appNetworkConfig.nativeAsset.address,
      symbol: appNetworkConfig.nativeAsset.symbol,
    };
  }

  return {
    address: formatted,
    symbol,
  };
}

const trendingPairs = computed(() => {
  return (tradePairSnapshots.value || []).map(pairSnapshot => [
    formatToken(pairSnapshot.pair.token0),
    formatToken(pairSnapshot.pair.token1),
  ]);
});

const setTradePair = (pair: TrendingPair[]) => {
  setTokenInAddress(pair[0].address);
  setTokenOutAddress(pair[1].address);
};
</script>

<template>
  <div class="container">
    <div class="trending-pairs">
      <div v-if="!upToLargeBreakpoint" class="flex justify-between p-3">
        <h6 class="title">{{ $t('trendingPairs') }}</h6>
      </div>
      <div class="border" />
      <div class="flex flex-wrap gap-3 lg:p-3 px-1">
        <button
          v-for="(pair, i) in trendingPairs"
          :key="`trendingPair-${i}`"
          class="flex items-center py-1 px-2 text-sm font-medium lg:font-normal hover:text-white bg-transparent hover:bg-blue-500 dark:hover:bg-blue-400 rounded-lg border dark:border-gray-800 shadow-sm transition-colors pair"
          @click="setTradePair(pair)"
        >
          <div>{{ pair[0].symbol }}&nbsp;</div>
          <img src="./leftarrow.svg" />
          <div>&nbsp;{{ pair[1].symbol }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  color: #be95c0;
}

.border {
  border: 0.5px solid rgba(111, 71, 115, 0.4);
  margin-left: 0.8em !important;
  margin-right: 0.8em !important;
}

.container {
  background: #231928;
  border-radius: 12px;
}

.trending-pairs {
  @apply flex flex-col bg-transparent;

  min-height: 200px;
}

.pair {
  background: #2e2433;
  border-radius: 16px;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;

  color: #ffffff;
}
</style>
