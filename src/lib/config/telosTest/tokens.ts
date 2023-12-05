import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['WBTC', 'DAI', 'USDC', 'BAL', 'AAVE', 'WETH'],
  },
  InitialSwapTokens: {
    input: '0x8886E7A8883e9A40b30Bd4E16e0e25C2C3f29Cd8',
    output: '0x5749c1374cc9DE28B94cf054dEb303D4cA3464bF',
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0x8886E7A8883e9A40b30Bd4E16e0e25C2C3f29Cd8',
    WETH: '0x8886E7A8883e9A40b30Bd4E16e0e25C2C3f29Cd8',
    BAL: '0xbADdAab20345a0E6607469949f069e8482f9AFC0',
    bbaUSD: '0x7B50775383d3D6f0215A8F290f2C9e2eEBBEceb2',
    bbaUSDv2: '0xA13a9247ea42D743238089903570127DdA72fE44',
  },
};

export default tokens;
