import axios from 'axios';

export class CoingeckoCacheClient {
  baseUrl: string;

  constructor() {
    this.baseUrl = 'https://coingecko.polarisfinance.io';
  }

  async get<T>(endpoint: string): Promise<T> {
    const { data } = await axios.get(this.baseUrl + endpoint);
    return data;
  }
}

export const coingeckoCacheClient = new CoingeckoCacheClient();
