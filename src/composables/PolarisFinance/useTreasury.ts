import { BigNumber } from 'ethers';
import { Contract } from 'ethers';

import { treasuryABI, polarTreasuryABI } from './ABI';

import { BigNumberToString, treasuryNameToAddress } from './utils';

export default function useTreasury(account, provider, treasuryName) {
  const treasuryAddress = treasuryNameToAddress[treasuryName];

  const treasuryContract = new Contract(
    treasuryAddress,
    treasuryName != 'polar' ? treasuryABI(treasuryName) : polarTreasuryABI,
    provider
  );

  const getLastEpochTWAP = async () => {
    let getTwap;
    if (treasuryName == 'polar') {
      getTwap = 'previousEpochpolarPrice';
    } else {
      getTwap =
        'previousEpoch' +
        treasuryName.charAt(0).toUpperCase() +
        treasuryName.slice(1) +
        'Price';
    }
    const twap = await treasuryContract[getTwap]();
    return BigNumberToString(twap, 14, 4);
  };

  const getPrintTWAP = async () => {
    const twap = await treasuryContract[treasuryName + 'PriceCeiling']();
    return BigNumberToString(twap, 14, 4);
  };

  const getCurrentTWAP = async () => {
    let getTwap;
    if (treasuryName == 'polar') {
      getTwap = 'getpolarUpdatedPrice';
    } else {
      getTwap =
        'get' +
        treasuryName.charAt(0).toUpperCase() +
        treasuryName.slice(1) +
        'UpdatedPrice';
    }
    const twap = await treasuryContract[getTwap]();
    return BigNumberToString(twap, 14, 4);
  };

  const getCurrentTWAPBigNumber = async () => {
    let getTwap;
    if (treasuryName == 'polar') {
      getTwap = 'getpolarUpdatedPrice';
    } else {
      getTwap =
        'get' +
        treasuryName.charAt(0).toUpperCase() +
        treasuryName.slice(1) +
        'UpdatedPrice';
    }
    return await treasuryContract[getTwap]();
  };

  const getNextEpochPoint = async () => {
    return await treasuryContract.nextEpochPoint();
  };

  const getNextEpochTime = async () => {
    const time = await treasuryContract.nextEpochPoint();

    const nextEpoch = new Date(time.mul(1000).toNumber());

    return nextEpoch;
  };

  const getPeriod = async () => {
    return await treasuryContract.PERIOD();
  };

  return {
    getLastEpochTWAP,
    getPrintTWAP,
    getCurrentTWAP,
    getCurrentTWAPBigNumber,
    getNextEpochTime,
    getPeriod,
    getNextEpochPoint,
  };
}
