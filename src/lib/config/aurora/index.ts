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
  rpc: `https://mainnet.aurora.dev`,
  ws: `wss://mainnet.aurora.dev`,
  explorer: 'https://explorer.aurora.dev',
  explorerName: 'Aurora Explorer',
  subgraph:
    'https://gateway-arbitrum.network.thegraph.com/api/45dee7017080a9544513ec90a5814526/subgraphs/id/2CpCYZ6NNrr5wpFY3KFQb2nDwkZaLcQajMaHcQsDp4yd',
  // balancerApi: '',
  poolsUrlV2: '',
  subgraphs: {
    main: [
      'https://gateway-arbitrum.network.thegraph.com/api/45dee7017080a9544513ec90a5814526/subgraphs/id/2CpCYZ6NNrr5wpFY3KFQb2nDwkZaLcQajMaHcQsDp4yd',
    ],
    aave: '',
    gauge:
      'https://gateway-arbitrum.network.thegraph.com/api/45dee7017080a9544513ec90a5814526/subgraphs/id/A5rwUeaVVQW6VtJ9AJwbainWXxXfwBh6bgcT6gZZPJeL',
    blocks:
      'https://gateway-arbitrum.network.thegraph.com/api/45dee7017080a9544513ec90a5814526/subgraphs/id/9FTPTBoKPxCeVr3ozrd6jcYZbo3beGPJnpiJnsDnVXA2',
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
