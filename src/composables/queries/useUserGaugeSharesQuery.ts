import { computed, reactive, Ref } from 'vue';
import { useQuery, UseQueryOptions } from '@tanstack/vue-query';

import QUERY_KEYS from '@/constants/queryKeys';
import { subgraphRequest } from '@/lib/utils/subgraph';
import { configService } from '@/services/config/config.service';
import useWeb3 from '@/services/web3/useWeb3';
import { AURORA_POOL_GAUGES, AURORA_GAUGE_POOLS } from '@/lib/config/aurora/gauges';
import { getMulticaller } from '@/dependencies/Multicaller';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';

/**
 * TYPES
 */
export type GaugeShare = {
  balance: string;
  gauge: {
    id: string;
    poolId: string;
    totalSupply: string;
  };
};

export type UserGaugeShares = {
  __name: 'GaugeShares';
  gaugeShares: GaugeShare[];
};
type QueryOptions = UseQueryOptions<GaugeShare[]>;

/**
 * useUserGaugeSharesQuery
 *
 * Fetches all gaugeShares for the current user or for a specific pool if
 * poolAddress is provided.
 *
 * @param {Ref<string>} poolAddress - Pool to fetch gaugeShares for.
 * @param {QueryOptions} options - useQuery options.
 * @returns {GaugeShare[]} An array of user gauge shares.
 */
export default function useUserGaugeSharesQuery(
  poolAddress?: Ref<string>,
  options: QueryOptions = {}
) {
  /**
   * COMPOSABLES
   */
  const { account, isWalletReady } = useWeb3();

  /**
   * QUERY KEY
   */
  const queryKey = reactive(QUERY_KEYS.User.Gauges(account, poolAddress));

  /**
   * COMPUTED
   */
  const enabled = computed((): boolean => isWalletReady.value);

  const queryArgs = computed(() => {
    if (poolAddress?.value)
      return {
        where: {
          user: account.value.toLowerCase(),
          balance_gt: '0',
          gauge_: { pool: poolAddress.value.toLowerCase() },
        },
      };

    return { where: { user: account.value.toLowerCase(), balance_gt: '0' } };
  });

  const subgraphQuery = computed(() => ({
    __name: 'GaugeShares',
    gaugeShares: {
      __args: queryArgs.value,
      balance: true,
      gauge: {
        id: true,
        poolId: true,
        totalSupply: true,
      },
    },
  }));

  /**
   * Fetch gauge shares on-chain for Aurora (no subgraph)
   */
  const fetchGaugeSharesOnChain = async (): Promise<GaugeShare[]> => {
    const gaugeShares: GaugeShare[] = [];
    const Multicaller = getMulticaller();
    const multicaller = new Multicaller();

    // Determine which gauges to check
    let gaugesToCheck: { gaugeAddress: string; poolId: string }[] = [];

    if (poolAddress?.value) {
      // Check specific pool's gauge
      const poolId = Object.keys(AURORA_POOL_GAUGES).find(
        id => id.toLowerCase().startsWith(poolAddress.value!.toLowerCase())
      );
      if (poolId && AURORA_POOL_GAUGES[poolId]) {
        gaugesToCheck = [{ gaugeAddress: AURORA_POOL_GAUGES[poolId], poolId }];
      }
    } else {
      // Check all gauges
      gaugesToCheck = Object.entries(AURORA_POOL_GAUGES).map(([poolId, gaugeAddress]) => ({
        gaugeAddress,
        poolId,
      }));
    }

    if (gaugesToCheck.length === 0) return [];

    // Setup multicalls for balance checks
    gaugesToCheck.forEach(({ gaugeAddress, poolId }) => {
      multicaller.call({
        key: `${poolId}.balance`,
        address: gaugeAddress,
        function: 'balanceOf',
        abi: ['function balanceOf(address) view returns (uint256)'],
        params: [account.value],
      });
      multicaller.call({
        key: `${poolId}.totalSupply`,
        address: gaugeAddress,
        function: 'totalSupply',
        abi: ['function totalSupply() view returns (uint256)'],
        params: [],
      });
    });

    const result = await multicaller.execute() as Record<string, { balance: BigNumber; totalSupply: BigNumber }>;

    // Transform results into GaugeShare format
    for (const { gaugeAddress, poolId } of gaugesToCheck) {
      const data = result[poolId];
      if (data && data.balance && !data.balance.isZero()) {
        gaugeShares.push({
          balance: formatUnits(data.balance, 18),
          gauge: {
            id: gaugeAddress,
            poolId: poolId,
            totalSupply: formatUnits(data.totalSupply, 18),
          },
        });
      }
    }

    return gaugeShares;
  };

  /**
   * QUERY FUNCTION
   */
  const queryFn = async () => {
    try {
      // Check if subgraph URL is empty (Aurora case)
      const gaugeSubgraphUrl = configService.network.subgraphs.gauge;
      if (!gaugeSubgraphUrl) {
        return await fetchGaugeSharesOnChain();
      }

      const { gaugeShares } = await subgraphRequest<UserGaugeShares>({
        url: gaugeSubgraphUrl,
        query: subgraphQuery.value,
      });

      return gaugeShares;
    } catch (error) {
      console.error('Failed to fetch pool gauges user', {
        cause: error,
      });
      throw error;
    }
  };

  /**
   * QUERY OPTIONS
   */
  const queryOptions = reactive({
    enabled,
    refetchOnWindowFocus: false,
    ...options,
  });

  return useQuery<GaugeShare[]>(
    queryKey,
    queryFn,
    queryOptions as QueryOptions
  );
}
