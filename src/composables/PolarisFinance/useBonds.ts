import { sendTransaction } from '@/lib/utils/balancer/web3';
import { MaxUint256 } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { Contract } from 'ethers';

import { bondABI, tokenABI } from './ABI';
import useTreasury from './useTreasury';

import {
  bondNameToAddress,
  tokenNameToAddress,
  treasuryNameToAddress,
} from './utils';

export default function useBonds(account, provider, tokenName) {
  const bondAddress = bondNameToAddress[tokenName];
  const tokenAddress = tokenNameToAddress[tokenName];

  const tokenContract = new Contract(tokenAddress, tokenABI, provider);
  // const bondContract = new Contract(
  //   treasuryAddress,
  //   treasuryName != 'polar' ? treasuryABI(treasuryName) : polarTreasuryABI,
  //   provider
  // );

  const isApproved = async () => {
    const _owner = account;
    const _spender = bondAddress;
    const approval = await tokenContract.allowance(_owner, _spender);

    return approval != 0 ? true : false;
  };

  const approve = async () => {
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

  const purchase = async amount => {
    const { getCurrentTWAPBigNumber } = useTreasury(
      account.value,
      provider,
      tokenName
    );

    const targetPrice = await getCurrentTWAPBigNumber();

    try {
      const tx = await sendTransaction(
        provider,
        treasuryNameToAddress[tokenName],
        bondABI,
        'buyBonds',
        [amount, BigNumber.from(targetPrice)]
      );
      return tx;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  return { isApproved, approve, purchase };
}
