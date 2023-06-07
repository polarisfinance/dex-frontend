export interface TokenInfo {
  Address: string;
  Symbol: string;
  Info: string;
  Links: Array<string>;
}

const tokensInfo: Array<TokenInfo> = [
  {
    Address: '0xf4eb217ba2454613b15dbdea6e5f22276410e89e',
    Symbol: 'WBTC',
    Info: 'Wrapped Bitcoin is an ERC-20 token on the Ethereum blockchain that represents Bitcoin. Each WBTC is backed 1:1 with Bitcoin. Wrapped Bitcoin allows for Bitcoin transfers to be conducted quicker on the Ethereum blockchain and opens up the possibility for BTC to be used in the Ethereum ecosystem. Bitcoin is held in custody by the centralized custodian, BitGo. Bitcoin can be converted to Wrapped Bitcoin and vice versa easily.',
    Links: [
      'https://www.coingecko.com/en/coins/wrapped-bitcoin',
      'https://www.wbtc.network/',
      'https://twitter.com/WrappedBTC',
    ],
  },
  {
    Address: '0xc9bdeed33cd01541e1eed10f90519d2c06fe3feb',
    Symbol: 'wETH',
    Info: 'WETH is the tokenized/packaged form of ETH that you use to pay for items when you interact with Ethereum dApps. WETH follows the ERC-20 token standards, enabling it to achieve interoperability with other ERC-20 tokens. This offers more utility to holders as they can use it across networks and dApps. You can stake, yield farm, lend, and provide liquidity to various liquidity pools with WETH. Also, unlike ETH, which doesn’t conform to its own ERC-20 standard and thus has lower interoperability as it can’t be used on other chains besides Ethereum, WETH can be used on cheaper and high throughput alternatives like Binance, Polygon, Solana, and Cardano. The price of WETH will always be the same as ETH because it maintains a 1:1 wrapping ratio. ',
    Links: ['https://www.coingecko.com/en/coins/weth', 'https://weth.io/'],
  },
  {
    Address: '0xb12bfca5a55806aaf64e99521918a4bf0fc40802',
    Symbol: 'USDC',
    Info: 'USDC is a fully collateralized US dollar stablecoin. USDC is the bridge between dollars and trading on cryptocurrency exchanges. The technology behind CENTRE makes it possible to exchange value between people, businesses and financial institutions just like email between mail services and texts between SMS providers. We believe by removing artificial economic borders, we can create a more inclusive global economy. ',
    Links: [
      'https://www.coingecko.com/en/coins/usd-coin',
      'https://www.circle.com/en/usdc',
      'https://twitter.com/circlepay',
    ],
  },
  {
    Address: 'XXXXXX',
    Symbol: 'USDT',
    Info: 'Tether is a stablecoin pegged to the US Dollar. A stablecoin is a type of cryptocurrency whose value is pegged to another fiat currency like the US Dollar or to a commodity like Gold. Tether is the first stablecoin to be created and it is the most popular stablecoin used in the ecosystem. It has the largest stablecoins by circulation and market capitalization. ',
    Links: [
      'https://www.coingecko.com/en/coins/tether',
      'https://tether.to/',
      'https://twitter.com/Tether_to',
      'https://www.facebook.com/1006796576013301',
    ],
  },
  {
    Address: 'XXXXXX',
    Symbol: 'NEAR',
    Info: "NEAR Protocol is a sharded, developer-friendly, proof-of-stake public blockchain, built by a world-class team that has built some of the world's only sharded databases at scale.",
    Links: [
      'https://www.coingecko.com/en/coins/near',
      'https://near.org/',
      'https://twitter.com/nearprotocol',
      'https://www.facebook.com/289178428335862',
    ],
  },
];
export const tokenInfo = (address: string): TokenInfo | undefined => {
  console.log(address);
  let returnValue: TokenInfo | undefined = undefined;
  tokensInfo.forEach((element, i) => {
    if (address === element.Address) {
      returnValue = element;
    }
  });
  return returnValue;
};
