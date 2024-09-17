import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '167000',
  chainId: 167000,
  chainName: 'Taiko',
  name: 'Taiko',
  shortName: 'Taiko',
  slug: 'taiko',
  network: 'taiko',
  unknown: false,
  visibleInUI: true,
  testNetwork: false,
  rpc: 'https://rpc.mainnet.taiko.xyz',
  ws: 'wss://rpc.mainnet.taiko.xyz',
  explorer: 'https://taikoscan.io',
  explorerName: 'Taiko Scan',
  subgraph:
    'https://api.goldsky.com/api/public/project_clqbhfggr3ii501w02mp62ver/subgraphs/polaris-dex-v2-taiko/1.0.0/gn',
  // balancerApi: '',
  poolsUrlV2: '',
  subgraphs: {
    main: [
      'https://api.goldsky.com/api/public/project_clqbhfggr3ii501w02mp62ver/subgraphs/polaris-dex-v2-taiko/1.0.0/gn',
    ],
    aave: '',
    gauge:
      'https://api.goldsky.com/api/public/project_clqbhfggr3ii501w02mp62ver/subgraphs/gauges-taiko/1.0.0/gn',
    blocks: '',
  },
  bridgeUrl: '',
  supportsEIP1559: true,
  supportsElementPools: true,
  blockTime: 0.5,
  nativeAsset: {
    name: 'ETH',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    decimals: 18,
    deeplinkId: 'ether',
    logoURI: 'tokens/eth.png',
    minTransactionBuffer: '0.05',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'eth',
      platformId: 'taiko',
    },
    apyVision: {
      networkName: 'eth',
    },
  },
  addresses: {
    ...contracts,
  },
  pools,
  tokens,
  keys,
  gauges: {
    type: 2,
    weight: 100,
  },
  tokenlists,
  rateProviders,
};

export default config;
