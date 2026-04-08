import { ComputedRef } from 'vue';
import { balancerSubgraphService } from '@/services/balancer/subgraph/balancer-subgraph.service';
import { PoolDecorator } from '@/services/pool/decorators/pool.decorator';
import {
  GraphQLArgs,
  PoolRepository as SDKPoolRepository,
} from '@balancer-labs/sdk';
import { balancerAPIService } from '@/services/balancer/api/balancer-api.service';
import { Pool } from '@/services/pool/types';
import { TokenInfoMap } from '@/types/TokenList';
import { isBalancerApiDefined } from '@/lib/utils/balancer/api';
import {
  getPoolsFallbackRepository,
  PoolsFallBackFactoryConstructor,
} from '@/dependencies/PoolsFallbackRepository';
import { configService } from '@/services/config/config.service';
import { AURORA_POOLS } from '@/lib/config/aurora/pools-static';
import { buildPoolFromStaticData } from '@/services/pool/pool-onchain.helper';

export default class PoolRepository {
  repository: PoolsFallBackFactoryConstructor;
  queryArgs: GraphQLArgs;

  constructor(private tokens: ComputedRef<TokenInfoMap>) {
    const PoolsFallbackRepository = getPoolsFallbackRepository();
    this.repository = new PoolsFallbackRepository(this.buildRepositories(), {
      timeout: 30 * 1000,
    });
    this.queryArgs = {};
  }

  public async fetch(queryArgs: GraphQLArgs): Promise<Pool> {
    this.queryArgs = queryArgs;
    const [pool] = await this.repository.fetch();
    return pool as Pool;
  }

  private initializeDecoratedAPIRepository() {
    return {
      fetch: async (): Promise<Pool[]> => {
        const pool = await balancerAPIService.pool.get(this.queryArgs);
        if (!pool) throw new Error('Cannot find pool via Balancer API');

        return [pool];
      },
      get skip(): number {
        return 0;
      },
    };
  }

  private initializeDecoratedSubgraphRepository() {
    return {
      fetch: async (): Promise<Pool[]> => {
        const pools = await balancerSubgraphService.pools.get(this.queryArgs);

        const poolDecorator = new PoolDecorator(pools);
        const decoratedPools = await poolDecorator.decorate(
          this.tokens.value,
          true
        );

        return decoratedPools;
      },
      get skip(): number {
        return 0;
      },
    };
  }

  /**
   * On-chain pool repository for networks without subgraph (e.g., Aurora).
   * Builds pool objects from static data and decorates with on-chain data.
   */
  private initializeOnchainRepository() {
    return {
      fetch: async (): Promise<Pool[]> => {
        const poolId = this.queryArgs.where?.id?.eq;
        if (!poolId) throw new Error('Pool ID required for on-chain fetch');

        const staticPool = AURORA_POOLS.find(
          p => p.id.toLowerCase() === poolId.toLowerCase()
        );
        if (!staticPool)
          throw new Error(`Pool ${poolId} not found in static data`);

        const pool = buildPoolFromStaticData(staticPool);

        const poolDecorator = new PoolDecorator([pool]);
        const decoratedPools = await poolDecorator.decorate(
          this.tokens.value,
          false
        );

        return decoratedPools;
      },
      get skip(): number {
        return 0;
      },
    };
  }

  private buildRepositories() {
    const repositories: SDKPoolRepository[] = [];
    if (isBalancerApiDefined) {
      const balancerApiRepository = this.initializeDecoratedAPIRepository();
      repositories.push(balancerApiRepository);
    }

    const mainSubgraphUrls = configService.network.subgraphs.main;
    const hasSubgraph =
      mainSubgraphUrls &&
      mainSubgraphUrls.length > 0 &&
      mainSubgraphUrls[0] !== '';

    if (hasSubgraph) {
      const subgraphRepository = this.initializeDecoratedSubgraphRepository();
      repositories.push(subgraphRepository);
    } else {
      // No subgraph available, use on-chain data from static pool config
      const onchainRepository = this.initializeOnchainRepository();
      repositories.push(onchainRepository);
    }

    return repositories;
  }
}
