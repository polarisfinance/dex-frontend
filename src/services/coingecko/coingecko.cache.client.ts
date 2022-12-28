import axios from 'axios';

export class CoingeckoCacheClient {
  baseUrl: string;

  constructor() {
    this.baseUrl = 'http://iMacPro.local:8181/';
  }

  async get<T>(endpoint: string): Promise<T> {
    const { data } = await axios.get(this.baseUrl + endpoint);
    return data;
  }
}

export const coingeckoCacheClient = new CoingeckoCacheClient();
