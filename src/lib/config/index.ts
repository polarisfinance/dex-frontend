import { Network } from '@balancer-labs/sdk';
import { Config } from './types';

import arbitrum from './arbitrum';
import docker from './docker';
import goerli from './goerli';
import mainnet from './mainnet';
import optimism from './optimism';
import polygon from './polygon';
import gnosisChain from './gnosis-chain';
import test from './test';
import auroraTest from './auroraTest';
import aurora from './aurora';
import telos from './telos';
import taiko from './taiko';

const config: Record<Network | number, Config> = {
  [Network.MAINNET]: mainnet,
  // [Network.GOERLI]: goerli,
  // [Network.POLYGON]: polygon,
  // [Network.ARBITRUM]: arbitrum,
  // [Network.OPTIMISM]: optimism,
  // [Network.GNOSIS]: gnosisChain,
  // [Network.AURORATEST]: auroraTest,
  [Network.AURORA]: aurora,
  [Network.TELOS]: telos,
  [Network.TAIKO]: taiko,

  // // @ts-ignore
  // 12345: test,
  // // @ts-ignore
  // 17: docker,
};

export default config;
