import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '40',
  chainId: 40,
  chainName: 'Telos',
  name: 'Telos',
  shortName: 'Telos',
  slug: 'telos',
  network: 'telos',
  unknown: false,
  visibleInUI: true,
  testNetwork: false,
  rpc: 'https://mainnet.telos.net/evm	',
  ws: 'wss://mainnet.telos.net/evm',
  explorer: 'https://teloscan.io',
  explorerName: 'Aurora Explorer',
  subgraph:
    'https://api.goldsky.com/api/public/project_clqbhfggr3ii501w02mp62ver/subgraphs/polaris-dex-v2-telos/1.0.1/gn',
  // balancerApi: '',
  poolsUrlV2: '',
  subgraphs: {
    main: [
      'https://api.goldsky.com/api/public/project_clqbhfggr3ii501w02mp62ver/subgraphs/polaris-dex-v2-telos/1.0.1/gn',
    ],
    aave: '',
    gauge:
      'https://api.goldsky.com/api/public/project_clqbhfggr3ii501w02mp62ver/subgraphs/gauges-telos/1.0.0/gn',
    blocks:
      'https://api.goldsky.com/api/public/project_clqbhfggr3ii501w02mp62ver/subgraphs/blocks-telos/1.0.0/gn',
  },
  bridgeUrl: '',
  supportsEIP1559: true,
  supportsElementPools: true,
  blockTime: 12,
  nativeAsset: {
    name: 'Telos',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'TLOS',
    decimals: 18,
    deeplinkId: 'telos',
    logoURI: 'tokens/tlos.png',
    minTransactionBuffer: '0.05',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'telos',
      platformId: 'telos',
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
