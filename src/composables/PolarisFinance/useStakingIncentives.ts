import { xpolarPool, BigNumberToString } from './utils';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { Network } from '@balancer-labs/sdk';
import { Contract } from 'ethers';
import { xpolarABI } from './ABI';
import { MaxUint256 } from '@ethersproject/constants';
import { Web3Provider } from '@ethersproject/providers';
import { sendTransaction } from '@/lib/utils/balancer/web3';

export default function useStakingIncentives(
  account: string,
  lpAddress: string
) {
  const w3 = rpcProviderService.getJsonProvider(Network.AURORA);
  const contract = new Contract(xpolarPool, xpolarABI, w3);

  const isApproved = async () => {
    const _owner = account;
    const _spender = lpAddress;
    const approval = await contract.allowance(_owner, _spender);
    return approval != 0 ? true : false;
  };

  const approve = async (provider: Web3Provider) => {
    const amount = MaxUint256.toString();
    const spender = lpAddress;

    try {
      const tx = await sendTransaction(
        provider,
        xpolarPool,
        xpolarABI,
        'approve',
        [spender, amount]
      );

      return tx;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const getTokenBalance = async () => {
    const balance = await contract.balanceOf(account);
    return balance;
  };

  const stake = async (provider: Web3Provider) => {
    const amount = getTokenBalance();

    try {
      const tx = await sendTransaction(
        provider,
        xpolarPool,
        xpolarABI,
        'stake',
        [amount]
      );
      return tx;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };
}
