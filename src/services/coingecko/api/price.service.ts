import { fromUnixTime, getUnixTime, startOfHour } from 'date-fns';
import { groupBy, invert, last } from 'lodash';

import { twentyFourHoursInSecs } from '@/composables/useTime';
import { TOKENS } from '@/constants/tokens';
import { returnChecksum } from '@/lib/decorators/return-checksum.decorator';
import { includesAddress } from '@/lib/utils';
import { retryPromiseWithDelay } from '@/lib/utils/promise';
import { configService as _configService } from '@/services/config/config.service';

import { CoingeckoClient } from '../coingecko.client';
import { CoingeckoCacheClient } from '../coingecko.cache.client';
import { CoingeckoService, getNativeAssetId, getPlatformId } from '../coingecko.service';

/**
 * TYPES
 */
export type Price = { [fiat: string]: number };
export type PriceResponse = { [id: string]: Price };
export type TokenPrices = { [address: string]: Price };
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
  nativeAssetId: string;
  nativeAssetAddress: string;
  appAddresses: { [key: string]: string };

  constructor(service: CoingeckoService, private readonly configService = _configService) {
    this.client = service.client;
    this.cacheClient = service.cacheClient;
    this.fiatParam = service.supportedFiat;
    this.appNetwork = this.configService.network.key;
    this.platformId = getPlatformId(this.appNetwork);
    this.nativeAssetId = getNativeAssetId(this.appNetwork);
    this.nativeAssetAddress = this.configService.network.nativeAsset.address;
    this.appAddresses = this.configService.network.addresses;
  }

  async getNativeAssetPrice(): Promise<Price> {
    try {
      const response = await this.cacheClient.get<PriceResponse>(`/getNativeAsset/?id=${this.nativeAssetId}&vs_currency=${this.fiatParam}`);
      return response[this.nativeAssetId];
    } catch (error) {
      console.error('Unable to fetch Ether price', error);
      throw error;
    }
  }

  /**
   *  Rate limit for the CoinGecko API is 10 calls each second per IP address.
   */
  async getTokens(addresses: string[], addressesPerRequest = 100): Promise<TokenPrices> {
    try {
      if (addresses.length / addressesPerRequest > 10) throw new Error('To many requests for rate limit.');

      addresses = addresses.map(address => this.addressMapIn(address));
      const pageCount = Math.ceil(addresses.length / addressesPerRequest);
      const pages = Array.from(Array(pageCount).keys());
      const requests: Promise<PriceResponse>[] = [];

      let replaceNear = false;
      let replaceStnear = false;
      let replaceBnb = false;
      let replaceEth = false;
      pages.forEach(page => {
        const addressString = addresses.slice(addressesPerRequest * page, addressesPerRequest * (page + 1));
        for (let i = 0; i < addressString.length; i++) {
          if (addressString[i] == '0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6') {
            addressString[i] = '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d';
            replaceNear = true;
          }
          if (addressString[i] == '0xFbE0Ec68483c0B0a9D4bCea3CCf33922225B8465') {
            addressString[i] = '0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30';
            replaceStnear = true;
          }
          if (addressString[i] == '0xb14674C7264eC7d948B904Aab2c0E0F906F6e762') {
            addressString[i] = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
            replaceBnb = true;
          }
          if (addressString[i] == '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
            addressString[i] = '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB';
            replaceEth = true;
          }
        }

        const endpoint = `/getTokens/?chain=${this.platformId}&contract_addresses=${addressString}&vs_currencies=${this.fiatParam}`;
        const request = retryPromiseWithDelay(this.cacheClient.get<PriceResponse>(endpoint), 3, 2000);
        requests.push(request);
        const bnbEndpoint = `/getTokens/?chain=binance-smart-chain&contract_addresses=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c&vs_currencies=${this.fiatParam}`;
        const bnbRequest = retryPromiseWithDelay(this.cacheClient.get<PriceResponse>(bnbEndpoint), 3, 2000);
        requests.push(bnbRequest);
      });

      const paginatedResults = await Promise.all(requests);
      const results = this.parsePaginatedTokens(paginatedResults);

      // Inject native asset price if included in requested addresses
      if (includesAddress(addresses, this.nativeAssetAddress)) {
        results[this.nativeAssetAddress] = await this.getNativeAssetPrice();
      }
      if (replaceNear) {
        results['0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6'] = results['0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d'];
      }
      if (replaceStnear) {
        results['0xFbE0Ec68483c0B0a9D4bCea3CCf33922225B8465'] = results['0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30'];
      }
      if (replaceBnb) {
        results['0xb14674C7264eC7d948B904Aab2c0E0F906F6e762'] = results['0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'];
      }
      if (replaceEth) {
        results['0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'] = results['0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB'];
      }
      return results;
    } catch (error) {
      console.error('Unable to fetch token prices', addresses, error);
      throw error;
    }
  }

  async getTokensHistorical(addresses: string[], days: number, addressesPerRequest = 1, aggregateBy: 'hour' | 'day' = 'day'): Promise<HistoricalPrices> {
    try {
      if (addresses.length / addressesPerRequest > 10) throw new Error('To many requests for rate limit.');

      const now = Math.floor(Date.now() / 1000);
      const end = aggregateBy === 'hour' ? now : now - (now % twentyFourHoursInSecs);
      const start = end - days * twentyFourHoursInSecs;

      addresses = addresses.map(address => this.addressMapIn(address));
      const requests: Promise<HistoricalPriceResponse>[] = [];

      addresses.forEach(address => {
        let bnb = false;
        if (address == '0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6') {
          address = '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d';
        }
        if (address == '0xFbE0Ec68483c0B0a9D4bCea3CCf33922225B8465') {
          address = '0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30';
        }
        if (address == '0xb14674C7264eC7d948B904Aab2c0E0F906F6e762') {
          address = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
          bnb = true;
        }
        if (address == '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
          address = '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB';
        }
        const endpoint = `/coins/${bnb ? 'binance-smart-chain' : this.platformId}/contract/${address.toLowerCase()}/market_chart/range?vs_currency=${this.fiatParam}&from=${start}&to=${end}`;
        const request = retryPromiseWithDelay(
          this.client.get<HistoricalPriceResponse>(endpoint),
          2, // retryCount
          2000 // delayTime
        );
        requests.push(request);
      });

      const paginatedResults = await Promise.all(requests);
      const results = this.parseHistoricalPrices(paginatedResults, addresses, start, aggregateBy);

      return results;
    } catch (error) {
      console.error('Unable to fetch token prices', addresses, error);
      throw error;
    }
  }

  private parsePaginatedTokens(paginatedResults: TokenPrices[]): TokenPrices {
    const results = paginatedResults.reduce((result, page) => ({ ...result, ...page }), {});
    const entries = Object.entries(results);
    const parsedEntries = entries.filter(result => Object.keys(result[1]).length > 0).map(result => [this.addressMapOut(result[0]), result[1]]);
    return Object.fromEntries(parsedEntries);
  }

  private parseHistoricalPrices(results: HistoricalPriceResponse[], addresses: string[], start: number, aggregateBy: 'day' | 'hour' = 'day'): HistoricalPrices {
    const assetPrices = Object.fromEntries(
      addresses.map((address, index) => {
        address = this.addressMapOut(address);
        const result = results[index].prices;
        const prices = {};

        if (aggregateBy === 'hour') {
          const pricesByHour = groupBy(result, r => getUnixTime(startOfHour(fromUnixTime(r[0] / 1000))));
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
  @returnChecksum()
  public addressMapIn(address: string): string {
    const addressMap = TOKENS?.PriceChainMap;
    if (!addressMap) return address;
    return addressMap[address.toLowerCase()] || address;
  }

  /**
   * Map mainnet address back to testnet address
   */
  @returnChecksum()
  public addressMapOut(address: string): string {
    const addressMap = TOKENS?.PriceChainMap;
    if (!addressMap) return address;
    return invert(addressMap)[address.toLowerCase()] || address;
  }
}
