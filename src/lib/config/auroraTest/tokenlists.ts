import { TokenListURLMap } from '@/types/TokenList';

const tokenlists: TokenListURLMap = {
  Balancer: {
    Default:
      'https://raw.githubusercontent.com/polarisfinance/dex-assets/testnet/generated/aurora.listed.tokenlist.json',
    Vetted:
      'https://raw.githubusercontent.com/polarisfinance/dex-assets/testnet/generated/aurora.listed.tokenlist.json',
  },
  External: [],
};

export default tokenlists;
