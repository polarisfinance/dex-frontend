import { TokenConstants } from '../types';

const tokens: TokenConstants = {
  Popular: {
    Symbols: ['WBTC', 'DAI', 'USDC', 'BAL', 'AAVE', 'WETH'],
  },
  InitialSwapTokens: {
    input: '0xA51894664A773981C6C112C43ce576f315d5b1B6',
    output: '0x5fc798A5072CD551b8bB5C51416078bc95499d2B',
  },
  Addresses: {
    nativeAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    wNativeAsset: '0xA51894664A773981C6C112C43ce576f315d5b1B6',
    WETH: '0xA51894664A773981C6C112C43ce576f315d5b1B6',
    BAL: '0x5fc798A5072CD551b8bB5C51416078bc95499d2B',
  },
};

export default tokens;
