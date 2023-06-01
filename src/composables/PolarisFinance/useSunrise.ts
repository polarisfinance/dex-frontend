import { Contract } from 'ethers';
import { BigNumber } from 'ethers';
import { TransactionResponse } from '@ethersproject/providers';

import {
  BigNumberToString,
  sunriseNameToAddress,
  SPOLAR,
  getDisplayBalance,
} from './utils';
import { spolarABI, sunriseABI } from './ABI';

// import { sendTransaction } from '@/lib/utils/balancer/web3';
import { MaxUint256 } from '@ethersproject/constants';
import useTokens from './useTokens';
import useTreasury from './useTreasury';

import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { Network } from '@balancer-labs/sdk';
import useTransactions from '../useTransactions';
import useWeb3 from '@/services/web3/useWeb3';
import { computed } from 'vue';
import { Web3Provider } from '@ethersproject/providers';
import { TransactionBuilder } from '@/services/web3/transactions/transaction.builder';

export default function useSunrise(sunriseName) {
  const { account, getSigner } = useWeb3();
  const w3 = rpcProviderService.getJsonProvider(Network.AURORA);

  const sunriseAddress = sunriseNameToAddress[sunriseName];
  const spolarContract = new Contract(SPOLAR, spolarABI, w3);
  const sunriseContract = new Contract(sunriseAddress, sunriseABI, w3);

  const getApproval = async (amount: BigNumber) => {
    const _owner = account.value;
    const _spender = sunriseAddress;
    const approval = await spolarContract.allowance(_owner, _spender);

    return approval.gte(amount) ? true : false;
  };

  const getEpoch = async () => {
    const epoch = await sunriseContract.epoch();
    return epoch.toString();
  };

  const getRewardsEarned = async (account: string) => {
    const earned = await sunriseContract.earned(account);
    return BigNumberToString(earned, 14, 4);
  };

  const canWithdraw = async (account: string) => {
    return await sunriseContract.canWithdraw(account);
  };

  const canClaimReward = async (account: string) => {
    return await sunriseContract.canClaimReward(account);
  };

  const getSpolarStaked = async () => {
    const spolarsStaked = await spolarContract.balanceOf(sunriseAddress);
    return BigNumberToString(spolarsStaked, 14, 4);
  };

  // const getSpolarStakedBigNumber = async () => {
  //   return await spolarContract.balanceOf(sunriseAddress);
  // };

  const getBalance = async (account: string) => {
    const balance = await sunriseContract.balanceOf(account);
    return BigNumberToString(balance, 14, 4);
  };

  const submitDeposit = async (amount: BigNumber) => {
    try {
      const txBuilder = new TransactionBuilder(getSigner());
      return await txBuilder.contract.sendTransaction({
        contractAddress: sunriseAddress,
        abi: sunriseABI,
        action: 'stake',
        params: [amount],
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const submitApprove = async () => {
    const amount = MaxUint256.toString();
    try {
      const txBuilder = new TransactionBuilder(getSigner());
      return await txBuilder.contract.sendTransaction({
        contractAddress: SPOLAR,
        abi: spolarABI,
        action: 'approve',
        params: [sunriseAddress, amount],
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const submitWithdraw = async (amount: BigNumber) => {
    try {
      const txBuilder = new TransactionBuilder(getSigner());
      return await txBuilder.contract.sendTransaction({
        contractAddress: sunriseAddress,
        abi: sunriseABI,
        action: 'withdraw',
        params: [amount],
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const submitClaim = async () => {
    try {
      const txBuilder = new TransactionBuilder(getSigner());
      return await txBuilder.contract.sendTransaction({
        contractAddress: sunriseAddress,
        abi: sunriseABI,
        action: 'claimReward',
        params: [],
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const getSunriseAPR = async () => {
    const { getSpolarPrice, getTokenPriceInUSD } = useTokens();

    const latestSnapshotIndex = await sunriseContract.latestSnapshotIndex();
    // const lastHistory = await sunriseContract.masonryHistory(
    //   latestSnapshotIndex
    // );
    // const spolarPrice = await getSpolarPrice();
    // const tokenPrice = await getTokenPriceInUSD(sunriseName);
    // const masonrytShareBalanceOf = await getSpolarStakedBigNumber();

    const [lastHistory, spolarPrice, tokenPrice, masonrytShareBalanceOf] =
      await Promise.all([
        sunriseContract.masonryHistory(latestSnapshotIndex),
        getSpolarPrice(),
        getTokenPriceInUSD(sunriseName),
        spolarContract.balanceOf(sunriseAddress),
      ]);
    const lastRewardsReceived = lastHistory[1];
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    const amountOfRewardsPerDay = epochRewardsPerShare * Number(tokenPrice) * 4;

    const masonryTVL =
      Number(getDisplayBalance(masonrytShareBalanceOf, 18)) *
      Number(spolarPrice);

    return (((amountOfRewardsPerDay * 100) / masonryTVL) * 365)
      .toFixed(2)
      .toString();
  };

  const getUnstakePeriod = async (account: string) => {
    const { getPeriod, getNextEpochPoint } = useTreasury(
      // account,
      // provider,
      sunriseName
    );

    const nextEpochTimestamp = await getNextEpochPoint();
    const withdrawLockupEpochs = await sunriseContract.withdrawLockupEpochs();
    const period = await getPeriod();
    const currentEpoch = await getEpoch();
    const mason = await sunriseContract.masons(account);
    const startTimeEpoch = mason.epochTimerStart;
    const PeriodInHours = period / 60 / 60;

    const targetEpochForClaimUnlock =
      Number(startTimeEpoch) + Number(withdrawLockupEpochs);
    const delta = targetEpochForClaimUnlock - Number(currentEpoch) - 1;
    const toDate = new Date(nextEpochTimestamp * 1000);

    // const endDate = moment(toDate)
    //   .add(delta * PeriodInHours, 'hours')
    //   .toDate();

    return new Date();
  };

  const getClaimPeriod = async (account: string) => {
    const { getPeriod, getNextEpochPoint } = useTreasury(
      // account,
      // provider,
      sunriseName
    );

    const nextEpochTimestamp = await getNextEpochPoint();
    const rewardLockupEpochs = await sunriseContract.rewardLockupEpochs();
    const period = await getPeriod();
    const currentEpoch = await getEpoch();
    const mason = await sunriseContract.masons(account);
    const startTimeEpoch = mason.epochTimerStart;
    const periodInHours = period / 60 / 60;

    const targetEpochForClaimUnlock =
      Number(startTimeEpoch) + Number(rewardLockupEpochs);
    const toDate = new Date(nextEpochTimestamp * 1000);
    const delta = targetEpochForClaimUnlock - currentEpoch - 1;

    return new Date();
    // return moment(toDate)
    //   .add(delta * periodInHours, 'hours')
    //   .toDate();
  };

  return {
    getApproval,
    getEpoch,
    getRewardsEarned,
    canWithdraw,
    canClaimReward,
    getSpolarStaked,
    getBalance,
    submitDeposit,
    submitApprove,
    submitClaim,
    submitWithdraw,
    getSunriseAPR,
    getUnstakePeriod,
    getClaimPeriod,
  };
}
