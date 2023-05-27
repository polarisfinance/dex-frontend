import { TransactionResponse } from '@ethersproject/providers';
import { BigNumber } from 'ethers';

import configs from '@/lib/config';
import { configService } from '@/services/config/config.service';

import { convertStEthWrap } from './lido';
import { TransactionBuilder } from '@/services/web3/transactions/transaction.builder';
import { WalletProvider } from '@/dependencies/wallets/Web3Provider';

export enum WrapType {
  NonWrap = 0,
  Wrap,
  Unwrap,
}

export const isNativeAssetWrap = (
  tokenIn: string,
  tokenOut: string
): boolean => {
  const nativeAddress = configService.network.nativeAsset.address;
  const { weth } = configService.network.addresses;
  return tokenIn === nativeAddress && tokenOut === weth;
};

export const getWrapAction = (tokenIn: string, tokenOut: string): WrapType => {
  const nativeAddress = configService.network.nativeAsset.address;
  const { weth, stETH, wstETH, NEAR, pNEAR, STNEAR, pSTNEAR } =
    configService.network.addresses;

  if (tokenIn === nativeAddress && tokenOut === weth) return WrapType.Wrap;
  if (tokenIn === stETH && tokenOut === wstETH) return WrapType.Wrap;

  if (tokenOut === nativeAddress && tokenIn === weth) return WrapType.Unwrap;
  if (tokenOut === stETH && tokenIn === wstETH) return WrapType.Unwrap;

  if (NEAR && pNEAR && STNEAR && pSTNEAR) {
    if (tokenIn === NEAR && tokenOut === pNEAR) return WrapType.Wrap;
    if (tokenIn === STNEAR && tokenOut === pSTNEAR) return WrapType.Wrap;

    if (tokenOut === NEAR && tokenIn === pNEAR) return WrapType.Unwrap;
    if (tokenOut === STNEAR && tokenIn === pSTNEAR) return WrapType.Unwrap;
  }
  return WrapType.NonWrap;
};

export const getWrapOutput = async (
  wrapper: string,
  wrapType: WrapType,
  wrapAmount: BigNumber
): Promise<BigNumber> => {
  if (wrapType === WrapType.NonWrap) throw new Error('Invalid wrap type');
  const { weth, wstETH, pNEAR, pSTNEAR } = configService.network.addresses;

  if (wrapper === weth || wrapper === pNEAR || wrapper === pSTNEAR)
    return BigNumber.from(wrapAmount);
  if (wrapper === wstETH) {
    return convertStEthWrap({
      amount: wrapAmount,
      isWrap: wrapType === WrapType.Wrap,
    });
  }
  throw new Error('Unknown wrapper');
};

export async function wrap(
  network: string,
  web3: WalletProvider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> {
  try {
    if (wrapper === configs[network].addresses.weth) {
      return wrapNative(network, web3, amount);
    } else if (wrapper === configs[network].addresses.wstETH) {
      return wrapLido(network, web3, amount);
    } else if (
      wrapper === configs[network].addresses.pNEAR ||
      wrapper === configs[network].addresses.pSTNEAR
    ) {
      return wrapPolaris(web3, wrapper, amount);
    }
    throw new Error('Unrecognised wrapper contract');
  } catch (e) {
    console.log('[Wrapper] Wrap error:', e);
    return Promise.reject(e);
  }
}

export async function unwrap(
  network: string,
  web3: WalletProvider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> {
  try {
    if (wrapper === configs[network].addresses.weth) {
      return unwrapNative(network, web3, amount);
    } else if (wrapper === configs[network].addresses.wstETH) {
      return unwrapLido(network, web3, amount);
    } else if (
      wrapper === configs[network].addresses.pNEAR ||
      wrapper === configs[network].addresses.pSTNEAR
    ) {
      return unwrapPolaris(web3, wrapper, amount);
    }
    throw new Error('Unrecognised wrapper contract');
  } catch (e) {
    console.log('[Wrapper] Unwrap error:', e);
    return Promise.reject(e);
  }
}

const wrapNative = async (
  network: string,
  web3: WalletProvider,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const txBuilder = new TransactionBuilder(web3.getSigner());
  return await txBuilder.contract.sendTransaction({
    contractAddress: configs[network].addresses.weth,
    abi: ['function deposit() payable'],
    action: 'deposit',
    options: { value: amount },
  });
};

const unwrapNative = async (
  network: string,
  web3: WalletProvider,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const txBuilder = new TransactionBuilder(web3.getSigner());
  return await txBuilder.contract.sendTransaction({
    contractAddress: configs[network].addresses.weth,
    abi: ['function withdraw(uint256 wad)'],
    action: 'withdraw',
    params: [amount],
  });
};

const wrapLido = async (
  network: string,
  web3: WalletProvider,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const txBuilder = new TransactionBuilder(web3.getSigner());
  return await txBuilder.contract.sendTransaction({
    contractAddress: configs[network].addresses.wstETH,
    abi: ['function wrap(uint256 _stETHAmount) returns (uint256)'],
    action: 'wrap',
    params: [amount],
  });
};

const unwrapLido = async (
  network: string,
  web3: WalletProvider,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const txBuilder = new TransactionBuilder(web3.getSigner());
  return await txBuilder.contract.sendTransaction({
    contractAddress: configs[network].addresses.wstETH,
    abi: ['function unwrap(uint256 _wstETHAmount) returns (uint256)'],
    action: 'unwrap',
    params: [amount],
  });
};

const wrapPolaris = async (
  web3: WalletProvider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const txBuilder = new TransactionBuilder(web3.getSigner());
  return await txBuilder.contract.sendTransaction({
    contractAddress: wrapper,
    abi: [
      'function depositFor(address account, uint256 amount) returns (bool)',
    ],
    action: 'depositFor',
    params: [web3.getSigner().getAddress(), amount],
  });
};

const unwrapPolaris = async (
  web3: WalletProvider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> => {
  const txBuilder = new TransactionBuilder(web3.getSigner());
  return await txBuilder.contract.sendTransaction({
    contractAddress: wrapper,
    abi: [
      'function withdrawTo(address account, uint256 amount) returns (bool)',
    ],
    action: 'withdrawTo',
    params: [web3.getSigner().getAddress(), amount],
  });
};
