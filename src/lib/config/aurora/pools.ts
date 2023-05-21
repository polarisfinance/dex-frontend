import { Pools } from '@/types/pools';

const pools: Pools = {
  IdsMap: {
    staBAL:
      '0x06df3b2bbb68adc8b0e302443692037ed9f91b42000000000000000000000063',
    bbAaveUSD: {
      v1: '0x7b50775383d3d6f0215a8f290f2c9e2eebbeceb20000000000000000000000fe',
      v2: '0xa13a9247ea42d743238089903570127dda72fe4400000000000000000000035d',
    },
    veBAL: '0x23a8a6e5d468e7acf4cc00bd575dbecf13bc7f78000100000000000000000015',
  },
  Pagination: {
    PerPage: 100,
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
    '0x98b5584A0c40F2c50CBa0Adb40E51A8caD79b9AC': 'weightedPool', // weighted pool v4
  },
  Stakable: {
    VotingGaugePools: [
      '0x293bbbef6087f681a8110f08bbdedadd13599fc3000200000000000000000007',
      '0xe370d4d0727d4e9b70db1a2f7d2efd1010ff1d6d000200000000000000000021',
      '0xa83f9fa9b51fc26e9925a07bc3375617b473e051000200000000000000000005',
      '0xd8e9e1916a4d98fb0dc6db725a8c8c2af08a329b00020000000000000000000f',
      '0x9cd44e44e8a61bc7dc34b04c762a3c0137a3707c000200000000000000000002',
      '0x89cc63050ade84bffafd7ec84d24fc0feb5f96c9000200000000000000000020',
      '0x454adaa07eec2c432c0df4379a709b1fa4c800ed000200000000000000000016',
      '0xa215a58225b344cbb62fcf762e8e884dbedfbe58000200000000000000000006',
      '0x0993fa12d3256e85da64866354ec3532f187e178000200000000000000000008',
      '0x244caf21eaa7029db9d6b42ddf2d95800a2f5eb500020000000000000000000a',
      '0x4200333dc021ea5fb1050b8e4f8f3ed7cb1d22ed00020000000000000000000c',
      '0xd88a378abfe6b6e232525dfb03fbe01ecc863c10000200000000000000000004',
      '0xf0b6cf745afe642c4565165922ad62d6a93857c100020000000000000000000e',
      '0xb3a04902b78fbe61185b766866193630db4db8a300020000000000000000000d',
      '0xceecce984f498ee00832670e9ca6d372f6ce155a000200000000000000000014',
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
