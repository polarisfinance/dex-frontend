
import { Contract, utils } from 'ethers';

import { BigNumberToString } from './utils';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { Network } from '@balancer-labs/sdk';
import { Web3Provider } from '@ethersproject/providers';

import { airdropABI } from './ABI';
import { BigNumber } from 'ethers';

import { StandardMerkleTree } from '@openzeppelin/merkle-tree';

import merkleTree from './merkletree.json';
// // (1)
// const tree = StandardMerkleTree.load(JSON.parse(merkleTree.toString()));

// // (2)
// for (const [i, v] of tree.entries()) {
//   if (v[0] === '0x0075e788eb9cd476c2f2c13c0c7ef6e52da8fcbf') {
//     // (3)
//     const proof = tree.getProof(i);
//     console.log('Value:', v);
//     console.log('Proof:', proof);
//     console.log(tree.verify(i, proof))
//     console.log(i)
//     console.log(tree.render())
//   }
// }

export default function useAirdrop() {
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
          pending = v[1];
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
  const totalShares = async (account: string) => {
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

  const claim = async (provider: Web3Provider, account: string) => {
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
      // const tx = await sendTransaction(
      //   provider,
      //   airdropAddress,
      //   airdropABI,
      //   'claim',
      //   [proof, account, amount]
      // );
      return undefined;
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  };

  return {
    getPendingShare,
    claim,
    totalShares,
    getVested,
  };
}
