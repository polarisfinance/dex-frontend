import { sendTransaction } from '@/lib/utils/balancer/web3';

import { Contract } from 'ethers';

import { BigNumberToString } from './utils';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { Network } from '@balancer-labs/sdk';
import { Web3Provider } from '@ethersproject/providers';

import { airdropABI } from './ABI';
import { BigNumber } from 'ethers';

export default function useAirdrop() {
  const w3 = rpcProviderService.getJsonProvider(Network.AURORA);
  const airdropAddress = '0xc0C5a2e6C932a9a25d144a1F6E3491aAf23f2B84';

  const airdropContract = new Contract(airdropAddress, airdropABI, w3);

  const getPoolStartTime = async () => {
    const startTime = await airdropContract.poolStartTime();
    console.log(startTime.toNumber());
    return startTime.toNumber();
  };
  const getPendingShare = async (account: string) => {
    const pending = await airdropContract.pendingShare(account);
    return Number(BigNumberToString(pending, 14, 4)).toFixed(2);
  };

  const getVested = async (account: string) => {
    const vested = await airdropContract.vested(account);
    return Number(BigNumberToString(vested, 14, 4)).toFixed(2);
  };
  const totalShares = async (account: string) => {
    const pid = await airdropContract.addressToPid(account);
    const total = await airdropContract.poolInfo(pid);
    return Number(BigNumberToString(total.allocPoint, 14, 4)).toFixed(2);
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
    getPendingShare,
    claim,
    totalShares,
    getVested,
    getPoolStartTime,
  };
}
