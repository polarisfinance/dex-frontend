import { Contract, utils } from 'ethers';

import { BigNumberToString } from './utils';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { Network } from '@balancer-labs/sdk';
import { Web3Provider } from '@ethersproject/providers';

import { airdropABI } from './ABI';
import { BigNumber } from 'ethers';

import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import merkleTree from './merkletree.json';

import useWeb3 from '@/services/web3/useWeb3';
import { TransactionBuilder } from '@/services/web3/transactions/transaction.builder';

export default function useAirdrop() {
  const { getSigner } = useWeb3();
  const w3 = rpcProviderService.getJsonProvider(Network.AURORA);
  const airdropAddress = '0x3F1F62b6363D11Bd90f2be776A74E0F0C26705D0';

  const airdropContract = new Contract(airdropAddress, airdropABI, w3);
  const startTime = BigNumber.from(1676667600);

  const getPendingShare = async (account: string) => {
    if (startTime.gt(BigNumber.from(Math.floor(Date.now() / 1000)))) {
      return '0';
    }
    const tree = StandardMerkleTree.load(
      JSON.parse(JSON.stringify(merkleTree))
    );

    for (const [i, v] of tree.entries()) {
      if (v[0] === account.toLowerCase()) {
        // (3)
        const vested = await airdropContract.vested(account);
        const runningTime = BigNumber.from(60)
          .mul(BigNumber.from(24))
          .mul(BigNumber.from(60))
          .mul(BigNumber.from(60));
        const xpolarPerSecond = BigNumber.from(v[1]).div(runningTime);
        let pending: BigNumber;
        if (
          BigNumber.from(Math.floor(Date.now() / 1000)).gt(
            startTime.add(runningTime)
          )
        ) {
          pending = BigNumber.from(v[1]);
        } else {
          pending = BigNumber.from(Math.floor(Date.now() / 1000))
            .sub(startTime)
            .mul(xpolarPerSecond);
        }
        return Number(BigNumberToString(pending.sub(vested), 14, 4)).toFixed(2);
      }
    }
    return '0';
  };

  const getVested = async (account: string) => {
    const vested = await airdropContract.vested(account);
    return Number(BigNumberToString(vested, 14, 4)).toFixed(2);
  };
  const getTotalShares = async (account: string) => {
    const tree = StandardMerkleTree.load(
      JSON.parse(JSON.stringify(merkleTree))
    );

    for (const [i, v] of tree.entries()) {
      if (v[0] === account.toLowerCase()) {
        // (3)
        return Number(BigNumberToString(BigNumber.from(v[1]), 14, 4)).toFixed(
          2
        );
      }
    }
    return '0';
  };

  const submitClaim = async (account: string) => {
    const tree = StandardMerkleTree.load(
      JSON.parse(JSON.stringify(merkleTree))
    );
    let amount;
    let proof;
    for (const [i, v] of tree.entries()) {
      if (v[0] === account.toLowerCase()) {
        // (3)
        proof = tree.getProof(i);
        amount = v[1];
      }
    }

    try {
      const txBuilder = new TransactionBuilder(getSigner());
      return await txBuilder.contract.sendTransaction({
        contractAddress: airdropAddress,
        abi: airdropABI,
        action: 'claim',
        params: [proof, account, amount],
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  return {
    getPendingShare,
    submitClaim,
    getTotalShares,
    getVested,
  };
}
