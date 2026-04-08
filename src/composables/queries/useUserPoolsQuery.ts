import { flatten, keyBy } from 'lodash';
import { computed, reactive } from 'vue';
import { useQuery, UseQueryOptions } from '@tanstack/vue-query';

import { POOLS } from '@/constants/pools';
import QUERY_KEYS from '@/constants/queryKeys';
import { bnum } from '@/lib/utils';
import { balancerSubgraphService } from '@/services/balancer/subgraph/balancer-subgraph.service';
import { PoolDecorator } from '@/services/pool/decorators/pool.decorator';
import { PoolWithShares } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';

import useNetwork from '../useNetwork';
import { tokensListExclBpt } from '../usePoolHelpers';
import { tokenTreeLeafs } from '../usePoolHelpers';
import { useTokens } from '@/providers/tokens.provider';
import useGaugesQuery from './useGaugesQuery';
import { configService } from '@/services/config/config.service';
import { AURORA_POOLS } from '@/lib/config/aurora/pools-static';
import { buildPoolFromStaticData } from '@/services/pool/pool-onchain.helper';
import useUserPoolSharesQuery from './useUserPoolSharesQuery';

type UserPoolsQueryResponse = {
  pools: PoolWithShares[];
  totalInvestedAmount: string;
  tokens: string[];
};

type QueryOptions = UseQueryOptions<UserPoolsQueryResponse>;

export default function useUserPoolsQuery(options: QueryOptions = {}) {
  /**
   * COMPOSABLES
   */
  const { injectTokens, tokens: tokenMeta } = useTokens();
  const { account, isWalletReady } = useWeb3();
  const { networkId } = useNetwork();
  const { data: subgraphGauges } = useGaugesQuery();

  const gaugeAddresses = computed(() =>
    (subgraphGauges.value || []).map(gauge => gauge.id)
  );
  /**
   * COMPUTED
   */
  const enabled = computed(() => isWalletReady.value && account.value != null);

  /**
   * QUERY PROPERTIES
   */
  const queryKey = reactive(
    QUERY_KEYS.Pools.User(networkId, account, gaugeAddresses)
  );

  const userPoolSharesQuery = useUserPoolSharesQuery();

  /**
   * Fetch user pools on-chain for networks without subgraph (e.g., Aurora).
   */
  async function queryFnOnChain(): Promise<UserPoolsQueryResponse> {
    const poolSharesMap = userPoolSharesQuery.data.value || {};
    const poolSharesIds = Object.keys(poolSharesMap).filter(id =>
      bnum(poolSharesMap[id]).gt(0)
    );

    if (poolSharesIds.length === 0) {
      return { pools: [], tokens: [], totalInvestedAmount: '0' };
    }

    // Build pools from static data for pools with user shares
    const staticPools = AURORA_POOLS.filter(
      p =>
        poolSharesIds.includes(p.id) &&
        POOLS.IncludedPoolTypes.includes(p.poolType)
    );

    const pools = staticPools.map(buildPoolFromStaticData);
    const poolDecorator = new PoolDecorator(pools);
    const decoratedPools = await poolDecorator.decorate(tokenMeta.value, false);

    const tokens = flatten(
      pools.map(pool => [...pool.tokensList, pool.address])
    );
    await injectTokens(tokens);

    const poolsWithShares = decoratedPools.map(pool => ({
      ...pool,
      shares: bnum(pool.totalLiquidity)
        .div(pool.totalShares || '1')
        .times(poolSharesMap[pool.id] || '0')
        .toString(),
      bpt: poolSharesMap[pool.id] || '0',
    }));

    const totalInvestedAmount = poolsWithShares
      .map(pool => pool.shares)
      .reduce((totalShares, shares) => totalShares.plus(shares), bnum(0))
      .toString();

    return { pools: poolsWithShares, tokens, totalInvestedAmount };
  }

  async function queryFnSubgraph(): Promise<UserPoolsQueryResponse> {
    const poolShares = await balancerSubgraphService.poolShares.get({
      where: {
        userAddress: account.value.toLowerCase(),
      },
    });

    const poolSharesIds = poolShares.map(poolShare => poolShare.poolId.id);
    const poolSharesMap = keyBy(poolShares, poolShare => poolShare.poolId.id);

    const pools = await balancerSubgraphService.pools.get({
      where: {
        id: { in: poolSharesIds },
        poolType: { in: POOLS.IncludedPoolTypes },
      },
    });

    const poolDecorator = new PoolDecorator(pools);
    const decoratedPools = await poolDecorator.decorate(tokenMeta.value);

    const tokens = flatten(
      pools.map(pool => {
        return [
          ...tokensListExclBpt(pool),
          ...tokenTreeLeafs(pool.tokens),
          pool.address,
        ];
      })
    );
    await injectTokens(tokens);

    const poolsWithShares = decoratedPools.map(pool => ({
      ...pool,
      shares: bnum(pool.totalLiquidity)
        .div(pool.totalShares)
        .times(poolSharesMap[pool.id].balance)
        .toString(),
      bpt: poolSharesMap[pool.id].balance,
    }));

    const totalInvestedAmount = poolsWithShares
      .map(pool => pool.shares)
      .reduce((totalShares, shares) => totalShares.plus(shares), bnum(0))
      .toString();

    return {
      pools: poolsWithShares,
      tokens,
      totalInvestedAmount,
    };
  }

  async function queryFn(): Promise<UserPoolsQueryResponse> {
    const mainSubgraphUrls = configService.network.subgraphs.main;
    const hasSubgraph =
      mainSubgraphUrls &&
      mainSubgraphUrls.length > 0 &&
      mainSubgraphUrls[0] !== '';

    if (!hasSubgraph) {
      return queryFnOnChain();
    }
    return queryFnSubgraph();
  }

  const queryOptions = reactive({
    enabled,
    ...options,
  });

  return useQuery<UserPoolsQueryResponse>(
    queryKey,
    queryFn,
    queryOptions as QueryOptions
  );
}
