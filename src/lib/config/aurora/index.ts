import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '1313161554',
  chainId: 1313161554,
  chainName: 'Aurora',
  name: 'Aurora',
  shortName: 'Aurora',
  slug: 'aurora',
  network: 'aurora',
  unknown: false,
  visibleInUI: true,
  testNetwork: false,
  rpc: `https://aurora-mainnet.infura.io/v3/${keys.infura}`,
  ws: `wss://mainnet.aurora.dev`,
  explorer: 'https://explorer.aurora.dev',
  explorerName: 'Aurora Explorer',
  subgraph:
    'https://api.thegraph.com/subgraphs/name/polarisfinance/polaris-dex-v2',
  // balancerApi: '',
  poolsUrlV2: '',
  subgraphs: {
    main: [
      'https://api.thegraph.com/subgraphs/name/polarisfinance/polaris-dex-v2',
    ],
    aave: '',
    gauge:
      'https://api.thegraph.com/subgraphs/name/polarisfinance/polaris-gauges',
    blocks:
      'https://api.thegraph.com/subgraphs/name/polarisfinance/aurora-blocks',
  },
  bridgeUrl: '',
  supportsEIP1559: true,
  supportsElementPools: true,
  blockTime: 12,
  nativeAsset: {
    name: 'Ether',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    decimals: 18,
    deeplinkId: 'ether',
    logoURI: 'tokens/eth.png',
    minTransactionBuffer: '0.05',
  },
  thirdParty: {
    coingecko: {
      nativeAssetId: 'aurora',
      platformId: 'aurora',
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
