import { Contract, utils } from 'ethers';

import { BigNumberToString } from './utils';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { Network } from '@balancer-labs/sdk';
import { Web3Provider } from '@ethersproject/providers';

import { omniVotingEscrowAdaptorABI } from './ABI';
import { BigNumber } from 'ethers';

import useWeb3 from '@/services/web3/useWeb3';
import { TransactionBuilder } from '@/services/web3/transactions/transaction.builder';

export default function useOmniVotingEscrowAdaptor() {
  const { account, getSigner } = useWeb3();
  const w3 = rpcProviderService.getJsonProvider(Network.AURORA);
  const omniVotingEscrowAdaptorAddress =
    '0xC00A5EE2B6c33Bf5548F1e5F4855b4a5B3Ae8C98';

  const omniVotingEscrowAdaptor = new Contract(
    omniVotingEscrowAdaptorAddress,
    omniVotingEscrowAdaptorABI,
    w3
  );

  const sendUserBalance = async () => {
    const estimateSendUserBalance =
      await omniVotingEscrowAdaptor.estimateSendUserBalance(199);
    console.log('estimateSendUserBalance', estimateSendUserBalance[0]);
    try {
      const txBuilder = new TransactionBuilder(getSigner());
      return await txBuilder.contract.sendTransaction({
        contractAddress: omniVotingEscrowAdaptorAddress,
        abi: omniVotingEscrowAdaptorABI,
        action: 'sendUserBalance',
        params: [account.value, 199, account.value],
        options: { value: estimateSendUserBalance[0] },
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  return {
    sendUserBalance,
  };
}
