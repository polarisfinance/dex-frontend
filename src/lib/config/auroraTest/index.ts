import { Config } from '../types';
import contracts from './contracts';
import keys from './keys';
import pools from './pools';
import tokenlists from './tokenlists';
import tokens from './tokens';
import rateProviders from './rateProviders';

const config: Config = {
  key: '1313161555',
  chainId: 1313161555,
  chainName: 'Aurora Testnet',
  name: 'Aurora Testnet',
  shortName: 'Aurora Testnet',
  slug: 'aurora-testnet',
  network: 'aurora-testnet',
  unknown: false,
  visibleInUI: true,
  testNetwork: false,
  rpc: 'https://testnet.aurora.dev',
  ws: 'wss://testnet.aurora.dev',
  explorer: 'https://explorer.testnet.aurora.dev',
  explorerName: 'Aurora Explorer',
  subgraph:
    'https://graph.polarisfinance.io/subgraphs/name/polarisfinance/polaris-dex-testnet',
  // balancerApi: '',
  poolsUrlV2: '',
  subgraphs: {
    main: [
      'https://graph.polarisfinance.io/subgraphs/name/polarisfinance/polaris-dex-testnet',
    ],
    aave: '',
    gauge:
      'https://graph.polarisfinance.io/subgraphs/name/polarisfinance/gauges-testnet',
    blocks:
      'https://graph.polarisfinance.io/subgraphs/name/polarisfinance/auroratestnet-blocks',
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
