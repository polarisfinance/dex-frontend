import { Pools } from '@/types/pools';

const pools: Pools = {
  IdsMap: {
    staBAL:
      '0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000063',
    bbAaveUSD: {
      v1: '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb20000000000000000000000fe',
      v2: '0xa13a9247ea42d743238089903570127dda72fe4400000000000000000000035d',
    },
    veBAL: '',
  },
  Pagination: {
    PerPage: 100,
    PerPool: 10,
    PerPoolInitial: 5,
  },
  BoostsEnabled: false,
  DelegateOwner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
  ZeroAddress: '0x0000000000000000000000000000000000000000',
  DynamicFees: {
    Gauntlet: [],
  },
  BlockList: [''],
  IncludedPoolTypes: [
    'Weighted',
    'Stable',
    'MetaStable',
    'LiquidityBootstrapping',
    'Investment',
    'StablePhantom',
    'ComposableStable',
    'FX',
  ],
  Stable: {
    AllowList: [],
  },
  Investment: {
    AllowList: [],
  },
  Weighted: {
    // Only effective after given timestamp here: usePool.ts#createdAfterTimestamp
    // see useDisabledJoinPool.ts#nonAllowedWeightedPoolAfterTimestamp for logic.
    AllowList: [],
  },
  Factories: {
    '0x981071aa1a430fc1b54c3e171608f88975497cf3': 'weightedPool', // weighted pool v4
    '0xbe9cdf92aa7723271408725b9ecf8f7d28596bab': 'composableStablePool',
  },
  Stakable: {
    VotingGaugePools: [],
    AllowList: [],
  },
  Metadata: {},
  Deep: [],
  BoostedApr: [],
  DisabledJoins: [],
  Deprecated: {},
  BrandedRedirect: {},
};

export default pools;
