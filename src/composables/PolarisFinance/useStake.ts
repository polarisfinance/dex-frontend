import { Contract } from 'ethers';
import { BigNumber } from 'ethers';
import { TransactionResponse } from '@ethersproject/providers';

import {
  BigNumberToString,
  sunriseNameToAddress,
  SPOLAR,
  getDisplayBalance,
} from './utils';
import { spolarABI, sunriseABI, xpolarRewardPoolABI, ERC20ABI } from './ABI';

import { sendTransaction } from '@/lib/utils/balancer/web3';
import { MaxUint256 } from '@ethersproject/constants';
import useTokens from './useTokens';
import useTreasury from './useTreasury';
import moment from 'moment';

import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { accountToAddress, Network } from '@balancer-labs/sdk';
import useTransactions from '../useTransactions';
import useWeb3 from '@/services/web3/useWeb3';
import { computed } from 'vue';
import { Web3Provider } from '@ethersproject/providers';

export default function useStake() {
  const w3 = rpcProviderService.getJsonProvider(Network.AURORA);

  const xpolarRewardPoolAddress = '0x140e8a21d08CbB530929b012581a7C7e696145eF';
  const xpolarRewardPool = new Contract(
    xpolarRewardPoolAddress,
    xpolarRewardPoolABI,
    w3
  );

  const PID = {
    '0x0993fa12d3256e85da64866354ec3532f187e178': 0,
    '0xf0b6cf745afe642c4565165922ad62d6a93857c1': 1,
    '0xd88a378abfe6b6e232525dfb03fbe01ecc863c10': 2,
    '0xa83f9fa9b51fc26e9925a07bc3375617b473e051': 3,
    '0xa215a58225b344cbb62fcf762e8e884dbedfbe58': 4,
    '0x293bbbef6087f681a8110f08bbdedadd13599fc3': 5,
    '0xceecce984f498ee00832670e9ca6d372f6ce155a': 6,
    '0x244caf21eaa7029db9d6b42ddf2d95800a2f5eb5': 7,
    '0x9cd44e44e8a61bc7dc34b04c762a3c0137a3707c': 8,
    '0x454adaa07eec2c432c0df4379a709b1fa4c800ed': 9,
    '0xb3a04902b78fbe61185b766866193630db4db8a3': 10,
    '0x4200333dc021ea5fb1050b8e4f8f3ed7cb1d22ed': 11,
    '0xd8e9e1916a4d98fb0dc6db725a8c8c2af08a329b': 12,
    '0x23a8a6e5d468e7acf4cc00bd575dbecf13bc7f78': 13,
    '0xf0f3b9eee32b1f490a4b8720cf6f005d4ae9ea86': 14,
    '0x3ac55ea8d2082fabda674270cd2367da96092889': 15,
    '0xafe0d6ca6aabb43cda024895d203120831ba0370': 16,
    '0xa69d9ba086d41425f35988613c156db9a88a1a96': 17,
    '0x17cbd9c274e90c537790c51b4015a65cd015497e': 18,
    '0x3a4773e600086a753862621a26a2e3274610da43': 19,
    '0x266437e6c7500a947012f19a3de96a3881a0449e': 20,
    '0x192bdcdd7b95a97ec66de5630a85967f6b79e695': 21,
    '0xce32b28c19c61b19823395730a0c7d91c671e54b': 22,
    '0xfa32616447c51f056db97bc1d0e2d4c0c4d059c9': 23,
  };

  const deposit = async (
    address: string,
    amount: BigNumber,
    provider: Web3Provider
  ) => {
    try {
      const pid = PID[address];

      const tx = await sendTransaction(
        provider,
        xpolarRewardPoolAddress,
        xpolarRewardPoolABI,
        'deposit',
        [pid, amount]
      );
      return tx;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const withdraw = async (
    address: string,
    amount: BigNumber,
    provider: Web3Provider
  ) => {
    try {
      const pid = PID[address];
      const tx = await sendTransaction(
        provider,
        xpolarRewardPoolAddress,
        xpolarRewardPoolABI,
        'withdraw',
        [pid, amount]
      );
      return tx;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const balance = async (address: string, account: string) => {
    try {
      const pid = PID[address];
      const balanceFetched = await xpolarRewardPool.userInfo(pid, account);
      return BigNumberToString(balanceFetched[0], 14, 4);
    } catch (error) {
      return '0';
    }
  };

  const pendingShare = async (address: string, account: string) => {
    try {
      const pid = PID[address];
      const pendingShare = await xpolarRewardPool.pendingShare(pid, account);
      return pendingShare;
    } catch (error) {
      return '0';
    }
  };

  const isApproved = async (address: string, account: string) => {
    const token = new Contract(address, ERC20ABI, w3);
    const allowace = await token.allowance(account, xpolarRewardPoolAddress);
    return allowace != 0 ? true : false;
  };

  const approve = async (address: string, provider: Web3Provider) => {
    const amount = MaxUint256.toString();
    try {
      const tx = await sendTransaction(provider, address, ERC20ABI, 'approve', [
        xpolarRewardPoolAddress,
        amount,
      ]);

      return tx;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  return { deposit, withdraw, balance, pendingShare, isApproved, approve };
}
