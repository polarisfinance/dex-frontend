import { Pools } from '@/types/pools';

const pools: Pools = {
  IdsMap: {
    staBAL:
      '0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000063',
    bbAaveUSD: {
      v1: '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb20000000000000000000000fe',
      v2: '0xa13a9247ea42d743238089903570127dda72fe4400000000000000000000035d',
    },
    veBAL: '0xbd708c4dd937207393e2e25e047f749c1f29755f000100000000000000000002',
  },
  Pagination: {
    PerPage: 10,
    PerPool: 10,
    PerPoolInitial: 5,
  },
  BoostsEnabled: true,
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
    AllowList: [
      '0x402347ee5a1f71d6ab0f9f744ed627d4023a2da9000200000000000000000003',
      '0x51e89c4322edef278e2f121f956629a3609a5b02000200000000000000000009',
      '0x540f10d7518724903565e786d086a2cec2b457fa000200000000000000000004',
      '0x945a701568ee7ae5cd8b42a7fe7fb18cc00dec50000200000000000000000007',
      '0xc11b6fc0b9acc2f923f4883a4e6ac3b11140d58900020000000000000000000a',
      '0xd8d31bd2e037d0047e7f6a4a3a846a93f5ce36c200020000000000000000000b',
      '0xf472db88a05b778248233e7bb79f1a97d6c61f2a000200000000000000000008',
      '0xf4e8d878c92aafbe2a1662e2a37eb1335944f1d1000200000000000000000006',
    ],
  },
  Factories: {
    '0x517803476a7434ea83316384d7Af408DE90DB083': 'weightedPool', // weighted pool v4
  },
  Stakable: {
    VotingGaugePools: [
      '0x402347ee5a1f71d6ab0f9f744ed627d4023a2da9000200000000000000000003',
      '0x51e89c4322edef278e2f121f956629a3609a5b02000200000000000000000009',
      '0x540f10d7518724903565e786d086a2cec2b457fa000200000000000000000004',
      '0x945a701568ee7ae5cd8b42a7fe7fb18cc00dec50000200000000000000000007',
      '0xc11b6fc0b9acc2f923f4883a4e6ac3b11140d58900020000000000000000000a',
      '0xd8d31bd2e037d0047e7f6a4a3a846a93f5ce36c200020000000000000000000b',
      '0xf472db88a05b778248233e7bb79f1a97d6c61f2a000200000000000000000008',
      '0xf4e8d878c92aafbe2a1662e2a37eb1335944f1d1000200000000000000000006',
    ],
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
