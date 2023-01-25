import { sendTransaction } from '@/lib/utils/balancer/web3';

import { Contract } from 'ethers';

import { BigNumberToString } from './utils';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { Network } from '@balancer-labs/sdk';
import { Web3Provider } from '@ethersproject/providers';

import { airdropABI } from './ABI';

export default function useAirdrop(account: string) {
  const w3 = rpcProviderService.getJsonProvider(Network.AURORA);
  const airdropAddress = '0x0000000000';

  const airdropContract = new Contract(airdropAddress, airdropABI, w3);

  const pendingShare = async () => {
    const pending = await airdropContract.pendingShare(account);
    return BigNumberToString(pending, 18, 4);
  };

  const claim = async (provider: Web3Provider) => {
    try {
      const tx = await sendTransaction(
        provider,
        airdropAddress,
        airdropABI,
        'withdraw',
        []
      );
      return tx;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  return {
    pendingShare,
    claim,
  };
}
