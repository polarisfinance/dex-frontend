import { BalancerSDK, Network } from '@balancer-labs/sdk';

import { configService } from '@/services/config/config.service';

const network = ((): Network => {
  switch (configService.network.key) {
    case '1':
      return Network.MAINNET;
    case '5':
      return Network.GOERLI;
    case '42':
      return Network.KOVAN;
    case '137':
      return Network.POLYGON;
    case '42161':
      return Network.ARBITRUM;
    case '1313161554':
      return Network.AURORA;
    case '131316155':
        return Network.AURORATEST;

    default:
      return Network.MAINNET;
  }
})();

export const balancer = new BalancerSDK({
  network,
  rpcUrl: configService.rpc,
});
