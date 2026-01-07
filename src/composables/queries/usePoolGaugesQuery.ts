import { computed, reactive, Ref } from 'vue';
import { useQuery, UseQueryOptions } from '@tanstack/vue-query';

import QUERY_KEYS from '@/constants/queryKeys';
import { subgraphRequest } from '@/lib/utils/subgraph';
import { configService } from '@/services/config/config.service';
import { AURORA_POOL_GAUGES } from '@/lib/config/aurora/gauges';

/**
 * TYPES
 */
export type PoolGauges = {
  pool: {
    preferentialGauge: {
      id: string | null;
    };
    gauges: {
      id: string;
      relativeWeightCap: string;
    }[];
  };
  liquidityGauges: { id: string }[];
};

type QueryOptions = UseQueryOptions<PoolGauges>;

/**
 * Fetches all gauges for a given pool and specifies which gauge is the
 * preferential gauge.
 */
export default function usePoolGaugesQuery(
  poolAddress: Ref<string | undefined>,
  options: UseQueryOptions<PoolGauges> = {}
) {
  /**
   * QUERY KEY
   */
  const queryKey = reactive(QUERY_KEYS.Pool.Gauges(poolAddress));

  /**
   * COMPUTED
   */
  const enabled = computed((): boolean => !!poolAddress?.value);

  const subgraphQuery = computed(() => ({
    pool: {
      __args: {
        id: poolAddress.value?.toLowerCase(),
      },
      preferentialGauge: {
        id: true,
      },
      gauges: {
        id: true,
        relativeWeightCap: true,
      },
    },
    liquidityGauges: {
      __args: {
        where: {
          poolAddress: poolAddress.value?.toLowerCase(),
        },
      },
      id: true,
    },
  }));

  /**
   * Helper function to get static gauge data for Aurora
   */
  const getStaticGaugeData = (address: string): PoolGauges | null => {
    // Find the pool ID that matches this address
    const poolId = Object.keys(AURORA_POOL_GAUGES).find(
      id => id.toLowerCase().startsWith(address.toLowerCase())
    );

    if (!poolId) return null;

    const gaugeAddress = AURORA_POOL_GAUGES[poolId];
    if (!gaugeAddress) return null;

    return {
      pool: {
        preferentialGauge: { id: gaugeAddress },
        gauges: [{ id: gaugeAddress, relativeWeightCap: '0.1' }],
      },
      liquidityGauges: [{ id: gaugeAddress }],
    };
  };

  /**
   * QUERY FUNCTION
   */
  const queryFn = async () => {
    try {
      // Check if subgraph URL is empty (Aurora case)
      const gaugeSubgraphUrl = configService.network.subgraphs.gauge;
      if (!gaugeSubgraphUrl && poolAddress.value) {
        const staticData = getStaticGaugeData(poolAddress.value);
        if (staticData) {
          return staticData;
        }
        // Return empty structure if no static data found
        return {
          pool: {
            preferentialGauge: { id: null },
            gauges: [],
          },
          liquidityGauges: [],
        };
      }

      return await subgraphRequest<PoolGauges>({
        url: gaugeSubgraphUrl,
        query: subgraphQuery.value,
      });
    } catch (error) {
      console.error(
        `Failed to fetch pool gauge for pool: ${poolAddress.value}`,
        {
          cause: error,
        }
      );
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

  return useQuery<PoolGauges>(queryKey, queryFn, queryOptions as QueryOptions);
}
