import { fromUnixTime, getUnixTime, startOfHour } from 'date-fns';
import { groupBy, invert, last } from 'lodash';

import { twentyFourHoursInSecs } from '@/composables/useTime';
import { TOKENS } from '@/constants/tokens';
import { getAddressFromPoolId } from '@/lib/utils';
import { retryPromiseWithDelay } from '@/lib/utils/promise';
import { configService as _configService } from '@/services/config/config.service';
import { includesAddress } from '@/lib/utils';
import { CoingeckoClient } from '../coingecko.client';
import { CoingeckoCacheClient } from '../coingecko.cache.client';
import { CoingeckoService, getPlatformId } from '../coingecko.service';
import { getAddress } from '@ethersproject/address';
import { TokenPrices } from '@/composables/queries/useTokenPricesQuery';
/**
 * TYPES
 */
export type Price = { [fiat: string]: number };
export type PriceResponse = { [id: string]: Price };
export interface HistoricalPriceResponse {
  market_caps: number[][];
  prices: number[][];
  total_volumes: number[][];
}
export type HistoricalPrices = { [timestamp: string]: number[] };

export class PriceService {
  client: CoingeckoClient;
  cacheClient: CoingeckoCacheClient;
  fiatParam: string;
  appNetwork: string;
  platformId: string;

  constructor(
    service: CoingeckoService,
    private readonly configService = _configService
  ) {
    this.client = service.client;
    this.cacheClient = service.cacheClient;
    this.fiatParam = service.supportedFiat;
    this.appNetwork = this.configService.network.key;
    this.platformId = getPlatformId(this.appNetwork);
  }

  async getTokens(
    addresses: string[],
    addressesPerRequest = 100
  ): Promise<TokenPrices> {
    try {
      if (addresses.length / addressesPerRequest > 10)
        throw new Error('To many requests for rate limit.');

      addresses = addresses.map(address => this.addressMapIn(address));
      const pageCount = Math.ceil(addresses.length / addressesPerRequest);
      const pages = Array.from(Array(pageCount).keys());
      const requests: Promise<PriceResponse>[] = [];

      pages.forEach(page => {
        const addressString = addresses.slice(
          addressesPerRequest * page,
          addressesPerRequest * (page + 1)
        );
        for (let i = 0; i < addressString.length; i++) {
          //usdc
          if (
            addressString[i] == '0xa80b2AD8Aaf625F6AA8134f292DcA53fA4df527B'
          ) {
            addressString[i] = '0xB12BFcA5A55806AaF64E99521918A4bf0fC40802';
          }

          //weth
          if (
            addressString[i] == '0x8886E7A8883e9A40b30Bd4E16e0e25C2C3f29Cd8'
          ) {
            addressString[i] = '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB';
          }
          //WBTC
          if (
            addressString[i] == '0x5749c1374cc9DE28B94cf054dEb303D4cA3464bF'
          ) {
            addressString[i] = '0xF4eB217Ba2454613b15dBdea6e5f22276410e89e';
          }

          //SPOLAR
          if (
            addressString[i] == '0x39EE5F95A5e3B86161818f419f959264C22193B8'
          ) {
            addressString[i] = '0x9D6fc90b25976E40adaD5A3EdD08af9ed7a21729';
          }

          //XPOLAR
          if (
            addressString[i] == '0xbADdAab20345a0E6607469949f069e8482f9AFC0'
          ) {
            addressString[i] = '0xeAf7665969f1DaA3726CEADa7c40Ab27B3245993';
          }

          //PNEAR
          if (
            addressString[i] == '0xf4A8b365cD410308d581574e35D412D82726a251'
          ) {
            addressString[i] = '0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6';
          }
        }

        const endpoint = `/getTokens/?chain=${this.platformId}&contract_addresses=${addressString}&vs_currencies=${this.fiatParam}`;
        const request = retryPromiseWithDelay(
          this.cacheClient.get<PriceResponse>(endpoint),
          3,
          2000
        );
        requests.push(request);
      });

      const paginatedResults = await Promise.all(requests);
      // eslint-disable-next-line no-var
      var results = this.parsePaginatedTokens(paginatedResults);

      const res = Object.getOwnPropertyNames(results);
      res.forEach(elem => {
        if ('0xb12bfca5a55806aaf64e99521918a4bf0fc40802' == elem)
          results['0xa80b2AD8Aaf625F6AA8134f292DcA53fA4df527B'] = results[elem];

        if ('0xc9bdeed33cd01541e1eed10f90519d2c06fe3feb' == elem)
          results['0x8886E7A8883e9A40b30Bd4E16e0e25C2C3f29Cd8'] = results[elem];

        if ('0xf4eb217ba2454613b15dbdea6e5f22276410e89e' == elem)
          results['0x5749c1374cc9DE28B94cf054dEb303D4cA3464bF'] = results[elem];

        if ('0x9d6fc90b25976e40adad5a3edd08af9ed7a21729' == elem)
          results['0x39EE5F95A5e3B86161818f419f959264C22193B8'] = results[elem];

        if ('0xeaf7665969f1daA3726ceada7c40Ab27b3245993' == elem) {
          results['0xbADdAab20345a0E6607469949f069e8482f9AFC0'] = results[elem];
        }
        if ('0x990e50e781004ea75e2ba3a67eb69c0b1cd6e3a6' == elem)
          results['0xf4A8b365cD410308d581574e35D412D82726a251'] = results[elem];
      });
      //MOCKS XPOLAR SPOLAR pNEAR
      results['0xbADdAab20345a0E6607469949f069e8482f9AFC0'] = { usd: 0.075 };
      results['0x39EE5F95A5e3B86161818f419f959264C22193B8'] = { usd: 3.59231 };
      results['0xf4A8b365cD410308d581574e35D412D82726a251'] = { usd: 1.35157 };

      return results;
    } catch (error) {
      console.error('Unable to fetch token prices', addresses, error);
      throw error;
    }
  }

  async getTokensHistorical(
    addresses: string[],
    days: number,
    addressesPerRequest = 1,
    aggregateBy: 'hour' | 'day' = 'day'
  ): Promise<HistoricalPrices> {
    try {
      if (addresses.length / addressesPerRequest > 10)
        throw new Error('To many requests for rate limit.');

      const now = Math.floor(Date.now() / 1000);
      const end =
        aggregateBy === 'hour' ? now : now - (now % twentyFourHoursInSecs);
      const start = end - days * twentyFourHoursInSecs;

      addresses = addresses
        .map(getAddressFromPoolId)
        .map(address => this.addressMapIn(address));
      const requests: Promise<HistoricalPriceResponse>[] = [];

      addresses.forEach(address => {
        const endpoint = `/coins/${
          this.platformId
        }/contract/${address.toLowerCase()}/market_chart/range?vs_currency=${
          this.fiatParam
        }&from=${start}&to=${end}`;
        const request = retryPromiseWithDelay(
          // this.client.get<HistoricalPriceResponse>(endpoint),
          this.cacheClient.get<HistoricalPriceResponse>(endpoint),
          2, // retryCount
          2000 // delayTime
        );
        requests.push(request);
      });

      const paginatedResults = await Promise.all(requests);
      const results = this.parseHistoricalPrices(
        paginatedResults,
        addresses,
        start,
        aggregateBy
      );
      return results;
    } catch (error) {
      console.error('Unable to fetch token prices', addresses, error);
      throw error;
    }
  }

  private parseHistoricalPrices(
    results: HistoricalPriceResponse[],
    addresses: string[],
    start: number,
    aggregateBy: 'day' | 'hour' = 'day'
  ): HistoricalPrices {
    const assetPrices = Object.fromEntries(
      addresses.map((address, index) => {
        address = this.addressMapOut(address);
        const result = results[index].prices;
        const prices = {};

        if (aggregateBy === 'hour') {
          const pricesByHour = groupBy(result, r =>
            getUnixTime(startOfHour(fromUnixTime(r[0] / 1000)))
          );
          for (const key of Object.keys(pricesByHour)) {
            const price = (last(pricesByHour[key]) || [])[1] || 0;
            prices[Number(key) * 1000] = price;
          }
        } else if (aggregateBy === 'day') {
          for (const key in result) {
            const [timestamp, price] = result[key];
            prices[timestamp] = price;
          }
        }

        return [address, prices];
      })
    );

    const prices = {};
    for (const asset in assetPrices) {
      const assetPrice = assetPrices[asset];
      for (const timestamp in assetPrice) {
        const price = assetPrice[timestamp];
        if (!(timestamp in prices)) {
          prices[timestamp] = [];
        }
        prices[timestamp].push(price);
      }
    }
    return prices;
  }

  /**
   * Map address to mainnet address if app network is a testnet
   */
  public addressMapIn(address: string): string {
    const addressMap = TOKENS?.PriceChainMap;
    if (!addressMap) return address;
    return getAddress(addressMap[address.toLowerCase()] || address);
  }

  /**
   * Map mainnet address back to testnet address
   */
  public addressMapOut(address: string): string {
    const addressMap = TOKENS?.PriceChainMap;
    if (!addressMap) return address;
    return getAddress(invert(addressMap)[address.toLowerCase()] || address);
  }
  private parsePaginatedTokens(paginatedResults: TokenPrices[]): TokenPrices {
    const results = paginatedResults.reduce(
      (result, page) => ({ ...result, ...page }),
      {}
    );
    const entries = Object.entries(results);
    const parsedEntries = entries
      .filter(result => Object.keys(result[1]).length > 0)
      .map(result => [this.addressMapOut(result[0]), result[1]]);
    return Object.fromEntries(parsedEntries);
  }
}
