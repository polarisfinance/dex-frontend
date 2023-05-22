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
          //pNEAR
          if (
            addressString[i] == '0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6'
          ) {
            addressString[i] = '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d';
          }
          //pSTNEAR
          if (
            addressString[i] == '0xFbE0Ec68483c0B0a9D4bCea3CCf33922225B8465'
          ) {
            addressString[i] = '0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30';
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
        if ('0xc42c30ac6cc15fac9bd938618bcaa1a1fae8501d' == elem) {
          results['0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6'] = results[elem];
        }
        if ('0x07f9f7f963c5cd2bbffd30ccfb964be114332e30' == elem)
          results['0xFbE0Ec68483c0B0a9D4bCea3CCf33922225B8465'] = results[elem];
      });

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
