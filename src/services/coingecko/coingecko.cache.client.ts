import axios from 'axios';

export class CoingeckoCacheClient {
  cacheUrl: string;
  fallbackUrl: string;

  constructor() {
    this.cacheUrl = 'https://coingecko.polarisfinance.io';
    this.fallbackUrl = 'https://api.coingecko.com/api/v3';
  }

  async get<T>(endpoint: string): Promise<T> {
    // Try cache first, fall back to direct coingecko API
    try {
      const { data } = await axios.get(this.cacheUrl + endpoint, {
        timeout: 5000,
      });
      return data;
    } catch {
      // Cache is down, rewrite endpoint for direct coingecko API
      const directEndpoint = this.rewriteEndpoint(endpoint);
      const { data } = await axios.get(this.fallbackUrl + directEndpoint);
      return data;
    }
  }

  /**
   * Rewrite cache endpoint format to standard coingecko API format.
   * Cache: /getTokens/?chain=aurora&contract_addresses=0x...&vs_currencies=usd
   * Coingecko: /simple/token_price/aurora?contract_addresses=0x...&vs_currencies=usd
   */
  private rewriteEndpoint(endpoint: string): string {
    if (endpoint.startsWith('/getTokens/')) {
      const params = new URLSearchParams(endpoint.split('?')[1] || '');
      const chain = params.get('chain') || 'aurora';
      const addresses = params.get('contract_addresses') || '';
      const currencies = params.get('vs_currencies') || 'usd';
      return `/simple/token_price/${chain}?contract_addresses=${addresses}&vs_currencies=${currencies}`;
    }
    // For other endpoints (e.g. market_chart), pass through as-is
    return endpoint;
  }
}

export const coingeckoCacheClient = new CoingeckoCacheClient();
