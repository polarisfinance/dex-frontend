import { merge } from 'lodash';

import { POOLS } from '@/constants/pools';

const defaultArgs = {
  first: 1000,
  orderBy: 'totalLiquidity',
  orderDirection: 'desc',
  where: {
    totalShares_gt: 0.001,
    id_not_in: POOLS.BlockList,
  },
};

const defaultAttrs = {
  id: true,
  address: true,
  poolType: true,
  swapFee: true,
  tokensList: true,
  totalLiquidity: true,
  totalSwapVolume: true,
  totalSwapFee: true,
  totalShares: true,
  owner: true,
  factory: true,
  amp: true,
  createTime: true,
  swapEnabled: true,
  tokens: {
    address: true,
    balance: true,
    weight: true,
    priceRate: true,
    symbol: true,
  },
};

export default (args = {}, attrs = {}) => ({
  pools: {
    __args: merge({}, defaultArgs, args),
    ...merge({}, defaultAttrs, attrs),
  },
});
