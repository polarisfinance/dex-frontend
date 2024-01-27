/**
 * Generates voting-gauges.json file.
 *
 * To run, ensure you have your own .env.development file with the following:
 * VITE_RPC_URL_1=YOUR_MAINNET_RPC_URL
 */
import { Network } from '@balancer-labs/sdk';
import { getAddress } from '@ethersproject/address';
import debug from 'debug';
import fs from 'fs';
import fetch from 'isomorphic-fetch';
import path from 'path';

import { VotingGauge } from '@/constants/voting-gauges';
import { getPlatformId } from '@/services/coingecko/coingecko.service';
import VEBalHelpersABI from '@/lib/abi/VEBalHelpers.json';
import vebalGauge from '../../../public/data/vebal-gauge.json';
import hardcodedGauges from '../../../public/data/hardcoded-gauges.json';
import config from '../config';
import { isSameAddress, sleep } from '../utils';
import { formatUnits } from '@ethersproject/units';
import { flatten, mapValues } from 'lodash';
import { configService } from '@/services/config/config.service';
import { Multicaller } from '@/services/multicalls/multicaller';
import { StaticJsonRpcBatchProvider } from '@/services/rpc-provider/static-json-rpc-batch-provider';

require('dotenv').config({
  path: path.resolve(__dirname, '../../../.env.development'),
});

const log = debug('balancer:voting-gauge-generator');

type GaugeInfo = {
  address: string;
  isKilled: boolean;
  network: Network;
  poolId: string;
  addedTimestamp: number;
  relativeWeightCap: string;
  recipient?: string;
};

async function getGaugeRelativeWeight(gaugeAddresses: string[]) {
  const rpcUrl = configService.getNetworkRpc(Network.AURORA);
  // if (rpcUrl.includes('INFURA_KEY'))
  //   throw Error('VITE_INFURA_PROJECT_ID not found!');

  const provider = new StaticJsonRpcBatchProvider(rpcUrl);

  const multicaller = new Multicaller(
    config[Network.AURORA].addresses.multicall,
    config[Network.AURORA].key,
    provider
  );

  for (const gaugeAddress of gaugeAddresses) {
    multicaller.call({
      key: gaugeAddress,
      address: config[Network.AURORA].addresses.veBALHelpers,
      function: 'gauge_relative_weight',
      abi: VEBalHelpersABI,
      params: [getAddress(gaugeAddress)],
    });
  }

  const result = await multicaller.execute();
  const weights = mapValues(result, weight => formatUnits(weight, 18));

  return weights;
}

function getBalancerAssetsURI(tokenAddress: string, network?: Network): string {
  if (network)
    return `https://raw.githubusercontent.com/balancer/tokenlists/main/src/assets/images/tokens/${network.toString()}_${tokenAddress.toLowerCase()}.png`;
  return `https://raw.githubusercontent.com/balancer/tokenlists/main/src/assets/images/tokens/${tokenAddress.toLowerCase()}.png`;
}

function isValidResponse(response: Response) {
  if (response.status === 200) {
    return true;
  } else {
    console.error('Asset URI not found from token list:', response.url);
  }
}

async function getAssetURIFromTokenlists(
  tokenAddress: string,
  network: Network
): Promise<string> {
  log(
    `getAssetURIFromTokenlists network: ${network} tokenAddress: ${tokenAddress}`
  );

  const tokenListURIs = configService.getNetworkConfig(network).tokenlists;
  const allURIs = [
    ...Object.values(tokenListURIs.Balancer),
    ...tokenListURIs.External,
  ].filter(uri => uri.includes('https'));

  log('getAssetURIFromTokenlists fetching Tokens');
  const responses = await Promise.all(allURIs.map(uri => fetch(uri)));
  const validResponses = await Promise.all(responses.filter(isValidResponse));
  const tokenLists = await Promise.all(
    validResponses.map(response => response.json())
  );
  const allTokens = tokenLists
    .map(tokenList => tokenList.tokens)
    .flat()
    .filter(token => token.chainId === network);

  log('getAssetURIFromTokenlists finding token');
  const token = allTokens.find(token =>
    isSameAddress(token.address, tokenAddress)
  );
  return token?.logoURI ? token.logoURI : '';
}

async function getMainnetTokenAddresss(
  tokenAddress: string,
  network: Network
): Promise<string> {
  log(
    `getMainnetTokenAddress network: ${network} tokenAddress: ${tokenAddress}`
  );
  const coingeckoEndpoint = `https://api.coingecko.com/api/v3/coins/${getPlatformId(
    network.toString()
  )}/contract/${tokenAddress.toLowerCase()}`;

  const response = await fetch(coingeckoEndpoint);

  try {
    const data = await response.json();
    return getAddress(data.platforms.ethereum);
  } catch {
    console.error(
      'Token not found on Mainnet:',
      tokenAddress,
      'chainId:',
      network
    );
    return '';
  }
}

function getTrustWalletAssetsURI(
  tokenAddress: string,
  network: Network
): string {
  log(
    `getTrustWalletAssetsURI network: ${network} tokenAddress: ${tokenAddress}`
  );
  const networksMap = {
    [Network.MAINNET]: 'ethereum',
    [Network.ARBITRUM]: 'arbitrum',
    [Network.POLYGON]: 'polygon',
    [Network.GOERLI]: 'goerli',
    [Network.OPTIMISM]: 'optimism',
    [Network.GNOSIS]: 'xdai',
  };

  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${networksMap[network]}/assets/${tokenAddress}/logo.png`;
}

async function isValidLogo(uri: string | undefined): Promise<boolean> {
  try {
    if (!uri) return false;

    const response = await fetch(uri);
    if (response.status === 200) return true;
    return false;
  } catch (error) {
    console.log('Failed to fetch', uri);
    return false;
  }
}

async function getTokenLogoURI(
  tokenAddress: string,
  network: Network
): Promise<string> {
  log(`getTokenLogoURI network: ${network} tokenAddress: ${tokenAddress}`);
  let logoUri = '';

  // logoUri = getBalancerAssetsURI(tokenAddress);
  // if (await isValidLogo(logoUri)) return logoUri;

  // logoUri = getBalancerAssetsURI(tokenAddress, network);
  // if (await isValidLogo(logoUri)) return logoUri;

  // logoUri = getTrustWalletAssetsURI(tokenAddress, network);
  // if (await isValidLogo(logoUri)) return logoUri;

  logoUri = await getAssetURIFromTokenlists(tokenAddress, network);
  if (await isValidLogo(logoUri)) return logoUri;

  if (
    network === Network.ARBITRUM ||
    network === Network.OPTIMISM ||
    network === Network.POLYGON ||
    network === Network.GNOSIS
  ) {
    const mainnetAddress = await getMainnetTokenAddresss(tokenAddress, network);
    logoUri = getTrustWalletAssetsURI(mainnetAddress, Network.MAINNET);
    if (await isValidLogo(logoUri)) return logoUri;
  }

  return '';
}

async function getPoolInfo(
  poolId: string,
  network: Network,
  retries = 5
): Promise<VotingGauge['pool']> {
  log(`getPoolInfo. poolId: network: ${network} poolId: ${poolId}`);
  const subgraphEndpoint = config[network].subgraph;
  console.log(subgraphEndpoint);
  const query = `
    {
      pool(
        id: "${poolId}"
      ) {
        id
        address
        poolType
        symbol
        tokens {
          address
          weight
          symbol
        }
      }
    }
  `;

  try {
    const response = await fetch(subgraphEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();
    const { id, address, poolType, symbol, tokens } = data.pool;

    const tokensList = tokens
      .filter(token => token.address != address)
      .map(token => {
        return {
          address: getAddress(token.address),
          weight: token.weight || 'null',
          symbol: token.symbol,
        };
      });

    return {
      id,
      address: getAddress(address),
      poolType,
      symbol,
      tokens: tokensList,
    };
  } catch (error) {
    console.log(error);
    console.error(
      'Pool not found:',
      poolId,
      'chainId:',
      network,
      'retries:',
      retries
    );

    return retries > 0
      ? getPoolInfo(poolId, network, retries - 1)
      : ({} as VotingGauge['pool']);
  }
}

async function getLiquidityGaugesInfo(
  poolId: string,
  network: Network,
  retries = 5
): Promise<GaugeInfo[] | null> {
  log(`getLiquidityGaugeInfo. network: ${network} poolId: ${poolId}`);
  const subgraphEndpoint = config[network].subgraphs.gauge;
  const query = `
    {
      liquidityGauges(
        where: {
          poolId: "${poolId}"
          gauge_not: null
        }
      ) {
        id
        isKilled
        relativeWeightCap
        gauge {
          addedTimestamp
        }
      }
    }
  `;

  try {
    const response = await fetch(subgraphEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();

    const gaugesInfo = data.liquidityGauges.map((gauge: any) => {
      return {
        address: getAddress(gauge.id),
        isKilled: Boolean(gauge.isKilled),
        relativeWeightCap: gauge.relativeWeightCap || 'null',
        addedTimestamp: gauge.gauge.addedTimestamp,
        network,
        poolId,
      };
    });

    return gaugesInfo;
  } catch {
    console.error(
      'LiquidityGauge not found for poolId:',
      poolId,
      'chainId:',
      network,
      'retries:',
      retries
    );

    return retries > 0
      ? getLiquidityGaugesInfo(poolId, network, retries - 1)
      : null;
  }
}

async function getStreamerAddress(
  poolId: string,
  network: Network,
  retries = 5
): Promise<string> {
  log(`getStreamerAddress. network: ${network} poolId: ${poolId}`);
  const subgraphEndpoint = config[network].subgraphs.gauge;

  const query = `
    {
      liquidityGauges(
        where: {
          poolId: "${poolId}"
        }
      ) {
        streamer
      }
    }
  `;

  try {
    const response = await fetch(subgraphEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();

    return data.liquidityGauges[0].streamer;
  } catch {
    console.error(
      'Streamer not found for poolId:',
      poolId,
      'chainId:',
      network,
      'retries:',
      retries
    );

    return retries > 0 ? getStreamerAddress(poolId, network, retries - 1) : '';
  }
}

async function getRootGaugeInfo(
  poolId: string,
  network: Network,
  retries = 5
): Promise<GaugeInfo[] | null> {
  const childChainSubgraphEndpoint = config[network].subgraphs.gauge;
  let query = `
  {
    liquidityGauges(
      where: {
        poolId: "${poolId}"
      }
    ) {
      id
    }
  }
  `;

  const response = await fetch(childChainSubgraphEndpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  let gaugeId = data.liquidityGauges[0].id;
  if (
    poolId ==
    '0x1396c11194d7da6f285fcb05886fc15a73f9816500020000000000000000000b'
  ) {
    gaugeId = '0x1189fe3cA912CE73d001EdaAD6B81dbC98feff6B';
  }

  const subgraphEndpoint = config[Network.AURORA].subgraphs.gauge;

  query = `
    {
      rootGauges(
        where: {
          recipient: "${gaugeId}"
          chain: ${config[network].shortName}
          gauge_not: null
        }
      ) {
        id
        isKilled
        relativeWeightCap
        gauge {
          addedTimestamp
        }
      }
    }
  `;

  try {
    const response = await fetch(subgraphEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();

    const gaugesInfo = data.rootGauges.map((gauge: any) => {
      return {
        address: getAddress(gauge.id),
        isKilled: Boolean(gauge.isKilled),
        relativeWeightCap: gauge.relativeWeightCap || 'null',
        addedTimestamp: gauge.gauge.addedTimestamp,
        network,
        poolId,
        recipient: gauge.recipient,
      };
    });

    return gaugesInfo;
  } catch {
    console.error('RootGauge not found for Streamer:', 'chainId:', network);

    return retries > 0 ? getRootGaugeInfo(poolId, network, retries - 1) : null;
  }
}

async function getGaugeInfo(
  poolId: string,
  network: Network
): Promise<GaugeInfo[] | null> {
  log(`getGaugeAddress. network: ${network} poolId: ${poolId}`);
  if ([Network.AURORA].includes(network)) {
    const gauges = await getLiquidityGaugesInfo(poolId, network);
    return gauges;
  } else if (network !== Network.MAINNET) {
    // const streamer = await getStreamerAddress(poolId, network);
    const gauges = await getRootGaugeInfo(poolId, network);
    return gauges;
  }
}

(async () => {
  console.log('Generating voting-gauges.json...');

  console.log('Fetching gauges info...');
  console.time('getGaugeInfo');

  const POOLS = flatten(
    Object.entries(config).map(([network, networkConfig]) => {
      return networkConfig.pools.Stakable.VotingGaugePools.map(id => {
        return {
          id,
          network: Number(network) as Network,
        };
      });
    })
  );

  const gaugesInfo = await Promise.all(
    POOLS.map(async ({ id, network }) => await getGaugeInfo(id, network))
  );
  console.timeEnd('getGaugeInfo');

  const filteredGauges = gaugesInfo
    .flat()
    .filter(gauge => gauge) as GaugeInfo[];

  const killedGaugesList = filteredGauges
    .filter(({ isKilled }) => isKilled)
    .map(({ address }) => address);

  console.log('\nFetching killed gauges relative weight...');
  console.time('getGaugeRelativeWeight');
  const killedGaugesWeight = await getGaugeRelativeWeight(killedGaugesList);
  console.timeEnd('getGaugeRelativeWeight');

  const telosFilter = [
    '0x1396c11194D7da6f285fcb05886fc15A73f98165',
    '0x21cfce445e0eC8444Fd6e9195FEa2a43952cBacd',
    '0x2621C0C2559a0d04a208f85e9720402cA5fDc779',
    '0x6B69bCc57ff6a6De441122bC7Bc932834f104423',
    '0xA5E2525631f9581a2DB43d7008a4e7777F5A6Df3',
    '0xC3A597155e4e33e93341Db43623bF90c2Ae90752',
    '0xcFcd512C217C584f3BD78bea18eAf1A3E3FCa913',
  ];

  console.log(filteredGauges);

  // const validGauges = filteredGauges.filter(
  //   ({ address, isKilled, network }) =>
  //     (!isKilled || killedGaugesWeight[address] !== '0.0') &&
  //     !(network === Network.TELOS && !telosFilter.includes(address))
  // );
  const validGauges = filteredGauges;
  console.log(validGauges);
  console.log('\nFetching voting gauges info...');
  console.time('getVotingGauges');
  let votingGauges = await Promise.all(
    validGauges.map(
      async (
        {
          address,
          poolId,
          network,
          isKilled,
          addedTimestamp,
          relativeWeightCap,
          recipient,
        },
        index
      ) => {
        await new Promise(resolve => setTimeout(resolve, index * 1000));
        const pool = await getPoolInfo(poolId, network);
        console.log(recipient, pool.address);

        const tokenLogoURIs = {};
        for (let i = 0; i < pool.tokens.length; i++) {
          tokenLogoURIs[pool.tokens[i].address] = await getTokenLogoURI(
            pool.tokens[i].address,
            network
          );
        }

        return {
          address,
          network,
          isKilled,
          relativeWeightCap,
          addedTimestamp,
          pool,
          tokenLogoURIs,
        };
      }
    )
  );
  console.timeEnd('getVotingGauges');

  votingGauges = [
    ...(vebalGauge as VotingGauge[]),
    ...(hardcodedGauges as VotingGauge[]),
    ...votingGauges,
  ];

  const jsonFilePath = path.resolve(
    __dirname,
    '../../../src/data/voting-gauges.json'
  );

  fs.writeFile(jsonFilePath, JSON.stringify(votingGauges, null, 2), err => {
    if (err) {
      console.log(err);
    }
  });
})();
