import { Pool, PoolType } from '@/services/pool/types';
import { AuroraPool, AURORA_POOLS } from '@/lib/config/aurora/pools-static';
import { configService } from '@/services/config/config.service';

/**
 * Build a minimal Pool object from static Aurora pool data.
 * This pool will be decorated with on-chain data by PoolDecorator.
 */
export function buildPoolFromStaticData(staticPool: AuroraPool): Pool {
  const tokens = staticPool.tokens.map(t => ({
    address: t.address,
    symbol: t.symbol,
    weight: t.weight || null,
    balance: '0',
    decimals: 18,
    priceRate: '1',
    token: {
      pool: null,
      latestUSDPrice: '',
    },
  }));

  return {
    id: staticPool.id,
    name: staticPool.symbol,
    address: staticPool.address,
    chainId: configService.network.chainId,
    poolType: staticPool.poolType as PoolType,
    poolTypeVersion: 1,
    swapFee: '0',
    protocolYieldFeeCache: '0',
    protocolSwapFeeCache: '0',
    owner: '',
    tokens: tokens as any,
    tokensList: staticPool.tokens.map(t => t.address),
    totalLiquidity: '0',
    totalShares: '0',
    totalWeight: '1',
    lowerTarget: '0',
    upperTarget: '0',
    swapEnabled: true,
    symbol: staticPool.symbol,
  } as Pool;
}

/**
 * Build Pool objects from all matching static Aurora pools.
 */
export function buildPoolsFromStaticData(
  filterFn?: (pool: AuroraPool) => boolean
): Pool[] {
  const pools = filterFn ? AURORA_POOLS.filter(filterFn) : AURORA_POOLS;
  return pools.map(buildPoolFromStaticData);
}
