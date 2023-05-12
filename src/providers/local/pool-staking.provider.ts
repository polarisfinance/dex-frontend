import usePoolGaugesQuery from '@/composables/queries/usePoolGaugesQuery';
import { isQueryLoading } from '@/composables/queries/useQueryHelpers';
import symbolKeys from '@/constants/symbol.keys';
import { bnum, getAddressFromPoolId, isSameAddress } from '@/lib/utils';
import { computed, InjectionKey, provide } from 'vue';
import { LiquidityGauge } from '@/services/balancer/contracts/contracts/liquidity-gauge';
import { getAddress } from '@ethersproject/address';
import { parseUnits } from '@ethersproject/units';
import { useTokens } from '../tokens.provider';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import useWeb3 from '@/services/web3/useWeb3';
import { POOLS } from '@/constants/pools';
import { safeInject } from '../inject';
import { useUserData } from '../user-data.provider';
import { subgraphRequest } from '@/lib/utils/subgraph';
import { configService } from '@/services/config/config.service';

/**
 * PoolStakingProvider
 *
 * Fetches data and provides functionality for a specific pool's gauge.
 */
const provider = (_poolId?: string) => {
  /**
   * STATE
   */
  const poolId = ref(_poolId);
  const poolAddress = computed((): string | undefined =>
    poolId.value ? getAddressFromPoolId(poolId.value) : undefined
  );

  /**
   * COMPOSABLES
   */
  const { balanceFor } = useTokens();
  const { account, isWalletReady } = useWeb3();

  // Fetches all gauges for specified pool (incl. preferential gauge).
  const poolGaugesQuery = usePoolGaugesQuery(poolAddress);
  const { data: poolGauges, refetch: refetchPoolGauges } = poolGaugesQuery;

  // Access user data fetched on wallet connection/change.
  const { userGaugeSharesQuery, userBoostsQuery, stakedSharesQuery } =
    useUserData();
  const { data: userGaugeShares, refetch: refetchUserGaugeShares } =
    userGaugeSharesQuery;
  const { data: boostsMap, refetch: refetchUserBoosts } = userBoostsQuery;
  const {
    data: _stakedShares,
    refetch: refetchStakedShares,
    isRefetching: isRefetchingStakedShares,
  } = stakedSharesQuery;

  /**
   * COMPUTED
   */
  const isLoading = computed(
    (): boolean =>
      isQueryLoading(poolGaugesQuery) ||
      (isWalletReady.value &&
        (isQueryLoading(stakedSharesQuery) ||
          isQueryLoading(userGaugeSharesQuery) ||
          isQueryLoading(userBoostsQuery)))
  );

  // The current preferential gauge for the specified pool.
  const preferentialGaugeAddress = computed(
    (): string | undefined | null =>
      poolGauges.value?.pool?.preferentialGauge?.id
  );

  // Is it possible to stake this pool's BPT?
  const isStakablePool = computed(
    (): boolean =>
      !!poolId.value &&
      poolGauges.value?.liquidityGauges?.[0]?.id !== undefined &&
      POOLS.Stakable.VotingGaugePools.concat(POOLS.Stakable.AllowList).includes(
        poolId.value
      )
  );

  // User's staked shares for pool (onchain data).
  const stakedShares = computed((): string => {
    if (!poolId.value) return '0';

    return _stakedShares?.value?.[poolId.value] || '0';
  });

  // User's boost value for this pool
  const boost = computed((): string => {
    if (!boostsMap.value || !poolId.value) return '1';

    return boostsMap[poolId.value];
  });

  // Addresses of all pool gauges.
  const gaugeAddresses = computed(
    (): string[] => poolGauges.value?.pool.gauges.map(gauge => gauge.id) || []
  );

  // Map of user gauge addresses -> balance.
  const userGaugeSharesMap = computed((): Record<string, string> => {
    if (!userGaugeShares.value) return {};

    return userGaugeShares.value.reduce((acc, share) => {
      acc[share.gauge.id] = share.balance;
      return acc;
    }, {} as Record<string, string>);
  });

  // Does the user have a balance in a non-preferential gauge
  const hasNonPrefGaugeBalance = computed((): boolean => {
    if (
      !poolGauges.value ||
      !userGaugeShares.value ||
      !preferentialGaugeAddress.value
    )
      return false;

    const _preferentialGaugeAddress = preferentialGaugeAddress.value;

    return gaugeAddresses.value.some(
      gaugeAddress =>
        !isSameAddress(gaugeAddress, _preferentialGaugeAddress) &&
        bnum(userGaugeSharesMap.value[gaugeAddress] || '0').gt(0)
    );
  });

  /**
   * METHODS
   */

  /**
   * Set current pool ID for this provider.
   *
   * @param {string} id - The pool ID to get staking data for.
   */
  function setCurrentPool(id: string) {
    poolId.value = id;
  }

  // Triggers refetch of all queries in this provider.
  async function refetchAllPoolStakingData() {
    return Promise.all([
      refetchPoolGauges(),
      refetchStakedShares(),
      refetchUserGaugeShares(),
      refetchUserBoosts(),
    ]);
  }

  /**
   * stake
   *
   * Trigger stake transaction using the current user's full BPT balance for
   * this pool.
   */
  async function stake(): Promise<TransactionResponse> {
    if (!poolAddress.value) throw new Error('No pool to stake.');
    if (!preferentialGaugeAddress.value) {
      throw new Error(`No preferential gauge found for this pool.`);
    }

    console.log('poolAddress.value', poolAddress.value);
    const gauge = new LiquidityGauge(preferentialGaugeAddress.value);
    // User's current full BPT balance for this pool.
    const userBptBalance = parseUnits(
      balanceFor(getAddress(poolAddress.value))
    );
    return await gauge.stake(userBptBalance);
  }
  /**
   * custom stake
   *
   * Trigger stake transaction using the user's amount - kayaba
   */
  async function stakeValue(value: string): Promise<TransactionResponse> {
    if (!poolAddress.value) throw new Error('No pool to stake.');
    if (!preferentialGaugeAddress.value) {
      throw new Error(`No preferential gauge found for this pool.`);
    }

    console.log('poolAddress.value', poolAddress.value);
    const gauge = new LiquidityGauge(preferentialGaugeAddress.value);
    const userBptBalance = parseUnits(value);
    return await gauge.stake(userBptBalance);
  }

  /**
   * unstake
   *
   * Trigger unstake transaction using the first pool gauge that the user has a
   * balance in.
   */
  async function unstake(): Promise<TransactionResponse> {
    if (!poolGauges.value?.pool?.gauges)
      throw new Error('Unable to unstake, no pool gauges');

    const gaugesWithBalance = await Promise.all(
      poolGauges.value.pool.gauges.map(async gauge => {
        const gaugeInstance = new LiquidityGauge(gauge.id);
        const balance = await gaugeInstance.balance(account.value);
        return { ...gauge, balance: balance?.toString() };
      })
    );

    const gaugeWithBalance = gaugesWithBalance.find(
      gauge => gauge.balance !== '0'
    );
    if (!gaugeWithBalance) {
      throw new Error(
        `Attempted to call unstake, user doesn't have any balance for any gauges.`
      );
    }

    const gauge = new LiquidityGauge(gaugeWithBalance.id);
    const balance = await gauge.balance(account.value);
    return await gauge.unstake(balance);
  }
  /**
   * custom unstake
   *
   * Trigger unstake transaction using the user's amount - kayaba
   */
  async function unstakeValue(value: string): Promise<TransactionResponse> {
    if (!poolGauges.value?.pool?.gauges)
      throw new Error('Unable to unstake, no pool gauges');

    const gaugesWithBalance = await Promise.all(
      poolGauges.value.pool.gauges.map(async gauge => {
        const gaugeInstance = new LiquidityGauge(gauge.id);
        const balance = await gaugeInstance.balance(account.value);
        return { ...gauge, balance: balance?.toString() };
      })
    );

    const gaugeWithBalance = gaugesWithBalance.find(
      gauge => gauge.balance !== '0'
    );
    if (!gaugeWithBalance) {
      throw new Error(
        `Attempted to call unstake, user doesn't have any balance for any gauges.`
      );
    }

    const gauge = new LiquidityGauge(gaugeWithBalance.id);
    // const balance = await gauge.balance(account.value);
    // return await gauge.unstake(balance);
    return await gauge.unstake(parseUnits(value));
  }

  /**
   * Fetch preferential gauge address for pool.
   *
   * @param {string} poolAddress - The pool address to get gauge for.
   * @returns {Promise<string>} - The preferential gauge address.
   */
  async function fetchPreferentialGaugeAddress(
    poolAddress: string
  ): Promise<string> {
    try {
      const data = await subgraphRequest<{
        pool: { preferentialGauge: { id: string } };
      }>({
        url: configService.network.subgraphs.gauge,
        query: {
          pool: {
            __args: {
              id: poolAddress.toLowerCase(),
            },
            preferentialGauge: {
              id: true,
            },
          },
        },
      });

      return data.pool.preferentialGauge.id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return {
    isLoading,
    stakedShares,
    isStakablePool,
    boost,
    hasNonPrefGaugeBalance,
    isRefetchingStakedShares,
    refetchStakedShares,
    preferentialGaugeAddress,
    fetchPreferentialGaugeAddress,
    setCurrentPool,
    refetchAllPoolStakingData,
    stake,
    stakeValue,
    unstake,
    unstakeValue,
  };
};

/**
 * Provide setup: response type + symbol.
 */
export type PoolStakingProviderResponse = ReturnType<typeof provider>;
export const PoolStakingProviderSymbol: InjectionKey<PoolStakingProviderResponse> =
  Symbol(symbolKeys.Providers.PoolStaking);

export function providePoolStaking(poolId?: string) {
  provide(PoolStakingProviderSymbol, provider(poolId));
}

export function usePoolStaking(): PoolStakingProviderResponse {
  return safeInject(PoolStakingProviderSymbol);
}
