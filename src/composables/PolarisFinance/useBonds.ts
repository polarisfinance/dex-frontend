import { sendTransaction } from '@/lib/utils/balancer/web3';
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
import { Web3Provider } from '@ethersproject/providers';
import { treasuryABI, polarTreasuryABI } from './ABI';
import { TokenAmount } from '@trisolaris/sdk';

export default function useBonds(account: string, tokenName: string) {
  const w3 = rpcProviderService.getJsonProvider(Network.AURORATEST);
  const bondAddress = bondNameToAddress[tokenName];
  const tokenAddress = tokenNameToAddress[tokenName];
  const treasuryAddress = treasuryNameToAddress[tokenName];
  const tokenContract = new Contract(tokenAddress, tokenABI, w3);
  const bondContract = new Contract(bondAddress, bondABI, w3);
  const isApprovedPurchase = async () => {
    const _owner = account;
    const _spender = treasuryAddress;
    const approval = await tokenContract.allowance(_owner, _spender);
    return approval != 0 ? true : false;
  };

  const isApprovedRedeem = async () => {
    const _owner = account;
    const _spender = treasuryAddress;
    const approval = await bondContract.allowance(_owner, _spender);
    return approval != 0 ? true : false;
  };

  const approvePurchase = async (provider: Web3Provider) => {
    const amount = MaxUint256.toString();
    const spender = treasuryNameToAddress[tokenName];

    try {
      const tx = await sendTransaction(
        provider,
        tokenNameToAddress[tokenName],
        tokenABI,
        'approve',
        [spender, amount]
      );

      return tx;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const approveRedeem = async (provider: Web3Provider) => {
    const amount = MaxUint256.toString();
    const spender = treasuryNameToAddress[tokenName];

    try {
      const tx = await sendTransaction(
        provider,
        tokenNameToAddress[tokenName],
        tokenABI,
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
    const balance = await tokenContract.balanceOf(account);
    return BigNumberToString(balance, 14, 4);
  };

  const getBondBalance = async () => {
    const balance = await bondContract.balanceOf(account);
    return BigNumberToString(balance, 14, 4);
  };

  const purchase = async (amount: BigNumber, provider: Web3Provider) => {
    const { getCurrentPrice } = useTreasury(tokenName);
    const targetPrice = await getCurrentPrice();
    const localABI =
      tokenName != 'polar' ? treasuryABI(tokenName) : polarTreasuryABI;
    try {
      const tx = await sendTransaction(
        provider,
        treasuryNameToAddress[tokenName],
        localABI,
        'buyBonds',
        [amount, targetPrice]
      );
      return tx;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const redeem = async (amount: BigNumber, provider: Web3Provider) => {
    const { getCurrentTWAPBigNumber } = useTreasury(tokenName);

    const targetPrice = await getCurrentTWAPBigNumber();

    try {
      const tx = await sendTransaction(
        provider,
        treasuryNameToAddress[tokenName],
        bondABI,
        'redeemBonds',
        [amount, BigNumber.from(targetPrice)]
      );
      return tx;
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
