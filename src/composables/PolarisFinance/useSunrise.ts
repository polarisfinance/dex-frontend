import { Contract } from 'ethers';
import { BigNumber } from 'ethers';

import {
  BigNumberToString,
  sunriseNameToAddress,
  SPOLAR,
  getDisplayBalance,
} from './utils';
import { spolarABI, sunriseABI } from './ABI';

import { sendTransaction } from '@/lib/utils/balancer/web3';
import { MaxUint256 } from '@ethersproject/constants';
import useTokens from './useTokens';

export default function useSunrise(account, provider, sunriseName) {
  const sunriseAddress = sunriseNameToAddress[sunriseName];

  const spolarContract = new Contract(SPOLAR, spolarABI, provider);
  const sunriseContract = new Contract(sunriseAddress, sunriseABI, provider);

  const isApproved = async () => {
    const _owner = account;
    const _spender = sunriseAddress;
    const approval = await spolarContract.allowance(_owner, _spender);

    return approval != 0 ? true : false;
  };

  const getEpoch = async () => {
    const epoch = await sunriseContract.epoch();
    return epoch.toString();
  };

  const getRewardsEarned = async () => {
    const earned = await sunriseContract.earned(account);
    return BigNumberToString(earned, 14, 4);
  };

  const canWithdraw = async () => {
    return await sunriseContract.canWithdraw(account);
  };

  const canClaimReward = async () => {
    return await sunriseContract.canClaimReward(account);
  };

  const getSpolarStaked = async () => {
    const spolarsStaked = await spolarContract.balanceOf(sunriseAddress);
    return BigNumberToString(spolarsStaked, 14, 4);
  };

  const getSpolarStakedBigNumber = async () => {
    return await spolarContract.balanceOf(sunriseAddress);
  };

  const getBalance = async () => {
    const balance = await sunriseContract.balanceOf(account);
    return BigNumberToString(balance, 14, 4);
  };

  const deposit = async amount => {
    try {
      const tx = await sendTransaction(
        provider,
        sunriseAddress,
        sunriseABI,
        'stake',
        [amount]
      );

      return tx;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const approve = async () => {
    const amount = MaxUint256.toString();

    try {
      const tx = await sendTransaction(provider, SPOLAR, spolarABI, 'approve', [
        sunriseAddress,
        amount,
      ]);

      return tx;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const withdraw = async amount => {
    try {
      const tx = await sendTransaction(
        provider,
        sunriseAddress,
        sunriseABI,
        'withdraw',
        [amount]
      );

      return tx;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const claim = async () => {
    try {
      const tx = await sendTransaction(
        provider,
        sunriseAddress,
        sunriseABI,
        'claimReward',
        []
      );
      return tx;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  const getSunriseAPR = async () => {
    const { getSpolarPrice, getTokenPriceInUSD } = useTokens();

    const latestSnapshotIndex = await sunriseContract.latestSnapshotIndex();
    const lastHistory = await sunriseContract.masonryHistory(
      latestSnapshotIndex
    );
    const spolarPrice = await getSpolarPrice();
    const tokenPrice = await getTokenPriceInUSD(sunriseName);

    const lastRewardsReceived = lastHistory[1];
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    const amountOfRewardsPerDay = epochRewardsPerShare * Number(tokenPrice) * 4;
    const masonrytShareBalanceOf = await getSpolarStakedBigNumber();

    const masonryTVL =
      Number(getDisplayBalance(masonrytShareBalanceOf, 18)) *
      Number(spolarPrice);

    return (((amountOfRewardsPerDay * 100) / masonryTVL) * 365)
      .toFixed(2)
      .toString();
  };

  const getUnstakePeriod = async () => {};

  return {
    isApproved,
    getEpoch,
    getRewardsEarned,
    canWithdraw,
    canClaimReward,
    getSpolarStaked,
    getBalance,
    deposit,
    approve,
    claim,
    withdraw,
    getSunriseAPR,
  };
}
