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
    AllowList: [
      '0xcfcd512c217c584f3bd78bea18eaf1a3e3fca913000200000000000000000003',
      '0xa5e2525631f9581a2db43d7008a4e7777f5a6df3000200000000000000000004',
      '0xc3a597155e4e33e93341db43623bf90c2ae90752000200000000000000000005',
      '0x21cfce445e0ec8444fd6e9195fea2a43952cbacd000200000000000000000007',
      '0x2621c0c2559a0d04a208f85e9720402ca5fdc779000200000000000000000008',
      '0x6b69bcc57ff6a6de441122bc7bc932834f10442300020000000000000000000a',
      '0x1396c11194d7da6f285fcb05886fc15a73f9816500020000000000000000000b',
    ],
  },
  Factories: {
    '0x517803476a7434ea83316384d7Af408DE90DB083': 'weightedPool', // weighted pool v4
  },
  Stakable: {
    VotingGaugePools: [
      '0xcfcd512c217c584f3bd78bea18eaf1a3e3fca913000200000000000000000003',
      '0xa5e2525631f9581a2db43d7008a4e7777f5a6df3000200000000000000000004',
      '0xc3a597155e4e33e93341db43623bf90c2ae90752000200000000000000000005',
      '0x21cfce445e0ec8444fd6e9195fea2a43952cbacd000200000000000000000007',
      '0x2621c0c2559a0d04a208f85e9720402ca5fdc779000200000000000000000008',
      '0x6b69bcc57ff6a6de441122bc7bc932834f10442300020000000000000000000a',
      '0x1396c11194d7da6f285fcb05886fc15a73f9816500020000000000000000000b',
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
