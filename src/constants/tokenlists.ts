export interface TokenListMap {
  Balancer: {
    Default: string;
    Vetted: string;
  };
  External: string[];
}

interface TokenListMapByNetwork {
  [networkKey: string]: TokenListMap;
}

/**
 * Mapping of the TokenLists used on each network
 */
export const TOKEN_LIST_MAP: TokenListMapByNetwork = {
  '1': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/balancer/assets/master/generated/listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/balancer/assets/master/generated/vetted.tokenlist.json',
    },
    External: [
      'ipns://tokens.uniswap.org',
      'https://www.gemini.com/uniswap/manifest.json',
    ],
  },
  '5': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/balancer/assets/refactor-for-multichain/generated/goerli.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/balancer/assets/refactor-for-multichain/generated/goerli.vetted.tokenlist.json',
    },
    External: [],
  },
  '10': {
    Balancer: {
      Default: '',
      Vetted: '',
    },
    External: [],
  },
  '137': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/balancer/assets/refactor-for-multichain/generated/polygon.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/balancer/assets/refactor-for-multichain/generated/polygon.vetted.tokenlist.json',
    },
    External: [
      'https://unpkg.com/quickswap-default-token-list@1.0.67/build/quickswap-default.tokenlist.json',
    ],
  },
  '42161': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/balancer/assets/refactor-for-multichain/generated/arbitrum.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/balancer/assets/refactor-for-multichain/generated/arbitrum.vetted.tokenlist.json',
    },
    External: [],
  },
  '100': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/balancer/assets/refactor-for-multichain/generated/gnosis.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/balancer/assets/refactor-for-multichain/generated/gnosis.vetted.tokenlist.json',
    },
    External: [
      'https://unpkg.com/@1hive/default-token-list@latest/build/honeyswap-default.tokenlist.json',
    ],
  },
  '1313161555': {
    Balancer: {
      Default:
        'https://raw.githubusercontent.com/polarisfinance/dex-assets/testnet/generated/aurora.listed.tokenlist.json',
      Vetted:
        'https://raw.githubusercontent.com/polarisfinance/dex-assets/testnet/generated/aurora.vetted.tokenlist.json',
    },
    External: [
      'https://aurora.dev/tokens.json',
      'https://raw.githubusercontent.com/trisolaris-labs/tokens/master/lists/1313161554/list.json',
    ],
  },
};
