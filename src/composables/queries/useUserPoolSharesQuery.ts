import { useQuery, UseQueryOptions } from '@tanstack/vue-query';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from '@ethersproject/bignumber';

import QUERY_KEYS from '@/constants/queryKeys';
import useWeb3 from '@/services/web3/useWeb3';
import { balancerSubgraphService } from '@/services/balancer/subgraph/balancer-subgraph.service';
import { configService } from '@/services/config/config.service';
import { getMulticaller } from '@/dependencies/Multicaller';
import { AURORA_POOLS } from '@/lib/config/aurora/pools-static';

/**
 * TYPES
 */
type PoolShareMap = {
  [poolId: string]: string;
};
type QueryOptions = UseQueryOptions<PoolShareMap>;

/**
 * useUserPoolSharesQuery
 *
 * Fetches all poolShares for the current user.
 *
 * @param {UseQueryOptions} options - useQuery options.
 * @returns {PoolShareMap} A map of poolID -> bpt balance.
 */
export default function useUserPoolSharesQuery(options: QueryOptions = {}) {
  /**
   * COMPOSABLES
   */
  const { account, isWalletReady } = useWeb3();

  /**
   * QUERY KEY
   */
  const queryKey = reactive(QUERY_KEYS.User.Pools(account));

  /**
   * COMPUTED
   */
  const enabled = computed((): boolean => isWalletReady.value);

  /**
   * Fetch pool shares on-chain for Aurora (no subgraph)
   * Queries BPT balances for all known Aurora pools
   */
  const fetchPoolSharesOnChain = async (): Promise<PoolShareMap> => {
    const poolShares: PoolShareMap = {};
    const Multicaller = getMulticaller();
    const multicaller = new Multicaller();

    // Setup multicalls for BPT balance checks on all pools
    AURORA_POOLS.forEach(pool => {
      multicaller.call({
        key: pool.id,
        address: pool.address,
        function: 'balanceOf',
        abi: ['function balanceOf(address) view returns (uint256)'],
        params: [account.value],
      });
    });

    const result = await multicaller.execute() as Record<string, BigNumber>;

    // Transform results into PoolShareMap format
    for (const pool of AURORA_POOLS) {
      const balance = result[pool.id];
      if (balance && !balance.isZero()) {
        poolShares[pool.id] = formatUnits(balance, 18);
      }
    }

    return poolShares;
  };

  /**
   * QUERY FUNCTION
   */
  const queryFn = async () => {
    try {
      // Check if subgraph URL is empty (Aurora case)
      const mainSubgraphUrls = configService.network.subgraphs.main;
      if (!mainSubgraphUrls || mainSubgraphUrls.length === 0 || !mainSubgraphUrls[0]) {
        // Fetch pool shares on-chain when subgraph is unavailable
        return await fetchPoolSharesOnChain();
      }

      const poolShares = await balancerSubgraphService.poolShares.get({
        where: {
          userAddress: account.value.toLowerCase(),
        },
      });

      // Create a map from poolShares using poolId as key and balance as value.
      return poolShares.reduce(
        (acc, poolShare) => ({
          ...acc,
          [poolShare.poolId.id]: poolShare.balance,
        }),
        {}
      );
    } catch (error) {
      console.error('Failed users pool shares', {
        cause: error,
      });
      // Return empty instead of throwing to prevent cascading failures
      return {};
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

  return useQuery<PoolShareMap>(
    queryKey,
    queryFn,
    queryOptions as QueryOptions
  );
}
