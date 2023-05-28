import { MaxUint256 } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { Contract } from 'ethers';

import { bondABI, tokenABI } from './ABI';
import useTreasury from './useTreasury';

import {
  BigNumberToString,
  bondNameToAddress,
  tokenNameToAddress,
  treasuryNameToAddress,
} from './utils';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { Network } from '@balancer-labs/sdk';
import { treasuryABI, polarTreasuryABI } from './ABI';

import useWeb3 from '@/services/web3/useWeb3';
import { TransactionBuilder } from '@/services/web3/transactions/transaction.builder';

export default function useBonds(tokenName: string) {
  const { account, getSigner } = useWeb3();

  const w3 = rpcProviderService.getJsonProvider(Network.AURORA);

  const treasuryAddress = treasuryNameToAddress[tokenName];
  const tokenContract = new Contract(
    tokenNameToAddress[tokenName],
    tokenABI,
    w3
  );
  const bondContract = new Contract(bondNameToAddress[tokenName], bondABI, w3);

  const isApprovedPurchase = async (amount: BigNumber) => {
    const approval = await tokenContract.allowance(
      account.value,
      treasuryAddress
    );
    return approval.gte(amount) ? true : false;
  };

  const isApprovedRedeem = async (amount: BigNumber) => {
    const approval = await bondContract.allowance(
      account.value,
      treasuryAddress
    );
    return approval.gte(amount) ? true : false;
  };

  const getTokenBalance = async () => {
    const balance = await tokenContract.balanceOf(account.value);
    return BigNumberToString(balance, 14, 4);
  };

  const getBondBalance = async () => {
    const balance = await bondContract.balanceOf(account.value);
    return BigNumberToString(balance, 14, 4);
  };

  const approvePurchase = async () => {
    try {
      const txBuilder = new TransactionBuilder(getSigner());
      return await txBuilder.contract.sendTransaction({
        contractAddress: tokenNameToAddress[tokenName],
        abi: tokenABI,
        action: 'approve',
        params: [treasuryNameToAddress[tokenName], MaxUint256.toString()],
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const approveRedeem = async () => {
    try {
      const txBuilder = new TransactionBuilder(getSigner());
      return await txBuilder.contract.sendTransaction({
        contractAddress: bondNameToAddress[tokenName],
        abi: tokenABI,
        action: 'approve',
        params: [treasuryNameToAddress[tokenName], MaxUint256.toString()],
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const purchase = async (amount: BigNumber) => {
    const { getCurrentPrice } = useTreasury(tokenName);
    const targetPrice = await getCurrentPrice();
    const localABI =
      tokenName != 'polar' ? treasuryABI(tokenName) : polarTreasuryABI;
    try {
      const txBuilder = new TransactionBuilder(getSigner());
      return await txBuilder.contract.sendTransaction({
        contractAddress: treasuryNameToAddress[tokenName],
        abi: localABI,
        action: 'buyBonds',
        params: [amount, targetPrice],
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const redeem = async (amount: BigNumber) => {
    const { getCurrentTWAPBigNumber } = useTreasury(tokenName);
    const targetPrice = await getCurrentTWAPBigNumber();
    try {
      const txBuilder = new TransactionBuilder(getSigner());
      return await txBuilder.contract.sendTransaction({
        contractAddress: treasuryNameToAddress[tokenName],
        abi: bondABI,
        action: 'redeemBonds',
        params: [amount, targetPrice],
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  return {
    isApprovedPurchase,
    isApprovedRedeem,
    approvePurchase,
    approveRedeem,
    purchase,
    redeem,
    getTokenBalance,
    getBondBalance,
  };
}
