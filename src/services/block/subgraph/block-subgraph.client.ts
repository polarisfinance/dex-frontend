import axios from 'axios';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

import { configService as _configService } from '@/services/config/config.service';

export default class BlockSubgraphClient {
  url: string;

  constructor(private readonly configService = _configService) {
    this.url = configService.network.subgraphs.blocks;
  }

  public async get(query) {
    try {
      const payload = this.toPayload(query);
      const {
        data: { data },
      } = await axios({
        url: this.url,
        method: 'post',
        data: payload,
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  public toPayload(query) {
    return { query: jsonToGraphQLQuery({ query }) };
  }
}

export const blockSubgraphClient = new BlockSubgraphClient();
