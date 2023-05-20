import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['WBTC', 'DAI', 'USDC', 'BAL', 'AAVE', 'WETH'],
  },
  InitialSwapTokens: {
    input: '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB',
    output: '0xeAf7665969f1DaA3726CEADa7c40Ab27B3245993',
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB',
    WETH: '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB',
    BAL: '0xeAf7665969f1DaA3726CEADa7c40Ab27B3245993',
    bbaUSD: '0x7B50775383d3D6f0215A8F290f2C9e2eEBBEceb2',
    bbaUSDv2: '0xA13a9247ea42D743238089903570127DdA72fE44',
  },
};

export default tokens;
