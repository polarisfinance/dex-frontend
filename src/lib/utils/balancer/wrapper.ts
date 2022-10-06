import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { BigNumber, BigNumberish } from 'ethers';

import configs from '@/lib/config';
import { sendTransaction } from '@/lib/utils/balancer/web3';
import { configService } from '@/services/config/config.service';

import { getStETHByWstETH, getWstETHByStETH } from './lido';

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
  const { weth, stETH, wstETH } = configService.network.addresses;

  if (tokenIn === nativeAddress && tokenOut === weth) return WrapType.Wrap;
  // if (tokenIn === stETH && tokenOut === wstETH) return WrapType.Wrap;
  const NEAR = '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d';
  const STNEAR = '0x07F9F7f963C5cD2BBFFd30CcfB964Be114332E30';
  const pNEAR = '0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6';
  const pSTNEAR = '0xFbE0Ec68483c0B0a9D4bCea3CCf33922225B8465';

  if (
    (tokenIn == NEAR && tokenOut == pNEAR) ||
    (tokenIn == STNEAR && tokenOut == pSTNEAR)
  )
    return WrapType.Wrap;

  if (
    (tokenIn == pNEAR && tokenOut == NEAR) ||
    (tokenIn == pSTNEAR && tokenOut == STNEAR)
  )
    return WrapType.Unwrap;
  if (tokenOut === nativeAddress && tokenIn === weth) return WrapType.Unwrap;
  // if (tokenOut === stETH && tokenIn === wstETH) return WrapType.Unwrap;

  return WrapType.NonWrap;
};

export const getWrapOutput = (
  wrapper: string,
  wrapType: WrapType,
  wrapAmount: BigNumberish
): BigNumber => {
  if (wrapType === WrapType.NonWrap) throw new Error('Invalid wrap type');
  const { weth, wstETH } = configService.network.addresses;

  if (wrapper === weth) return BigNumber.from(wrapAmount);
  if (wrapper === wstETH) {
    return wrapType === WrapType.Wrap
      ? getWstETHByStETH(wrapAmount)
      : getStETHByWstETH(wrapAmount);
  }
  if (
    wrapper === '0x990e50E781004EA75e2bA3A67eB69c0B1cD6e3A6' ||
    wrapper === '0xFbE0Ec68483c0B0a9D4bCea3CCf33922225B8465'
  ) {
    return BigNumber.from(wrapAmount);
  }
  throw new Error('Unknown wrapper');
};

export async function pWrap(
  tokenInAddress: string,
  web3: Web3Provider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> {
  try {
    const address = await web3.getSigner().getAddress();
    console.log(address);
    return pWrapNative(web3, amount, address, wrapper);
  } catch (e) {
    console.log('[Wrapper] Wrap error:', e);
    return Promise.reject(e);
  }
}

export async function pUnwrap(
  tokenInAddress: string,
  web3: Web3Provider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> {
  try {
    const address = await web3.getSigner().getAddress();
    console.log('this', wrapper);
    return pUnwrapNative(web3, amount, address, wrapper);
  } catch (e) {
    console.log('[Wrapper] Unwrap error:', e);
    return Promise.reject(e);
  }
}

export async function wrap(
  network: string,
  web3: Web3Provider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> {
  try {
    if (wrapper === configs[network].addresses.weth) {
      return wrapNative(network, web3, amount);
    } else if (wrapper === configs[network].addresses.wstETH) {
      return wrapLido(network, web3, amount);
    }
    throw new Error('Unrecognised wrapper contract');
  } catch (e) {
    console.log('[Wrapper] Wrap error:', e);
    return Promise.reject(e);
  }
}

export async function unwrap(
  network: string,
  web3: Web3Provider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> {
  try {
    if (wrapper === configs[network].addresses.weth) {
      return unwrapNative(network, web3, amount);
    } else if (wrapper === configs[network].addresses.wstETH) {
      return unwrapLido(network, web3, amount);
    }
    throw new Error('Unrecognised wrapper contract');
  } catch (e) {
    console.log('[Wrapper] Unwrap error:', e);
    return Promise.reject(e);
  }
}

const wrapNative = async (
  network: string,
  web3: Web3Provider,
  amount: BigNumber
): Promise<TransactionResponse> =>
  sendTransaction(
    web3,
    configs[network].addresses.weth,
    ['function deposit() payable'],
    'deposit',
    [],
    { value: amount }
  );

const pWrapNative = async (
  web3: Web3Provider,
  amount: BigNumber,
  address: string,
  wrapper: string
): Promise<TransactionResponse> =>
  sendTransaction(
    web3,
    wrapper,
    ['function depositFor(address account, uint256 amount) returns (bool)'],
    'depositFor',
    [address, amount]
  );

const pUnwrapNative = (
  web3: Web3Provider,
  amount: BigNumber,
  address: string,
  wrapper: string
): Promise<TransactionResponse> =>
  sendTransaction(
    web3,
    wrapper,
    ['function withdrawTo(address account, uint256 amount) returns (bool)'],
    'withdrawTo',
    [address, amount]
  );

const unwrapNative = (
  network: string,
  web3: Web3Provider,
  amount: BigNumber
): Promise<TransactionResponse> =>
  sendTransaction(
    web3,
    configs[network].addresses.weth,
    ['function withdraw(uint256 wad)'],
    'withdraw',
    [amount]
  );

const wrapLido = async (
  network: string,
  web3: Web3Provider,
  amount: BigNumber
): Promise<TransactionResponse> =>
  sendTransaction(
    web3,
    configs[network].addresses.wstETH,
    ['function wrap(uint256 _stETHAmount) returns (uint256)'],
    'wrap',
    [amount]
  );

const unwrapLido = async (
  network: string,
  web3: Web3Provider,
  amount: BigNumber
): Promise<TransactionResponse> =>
  sendTransaction(
    web3,
    configs[network].addresses.wstETH,
    ['function unwrap(uint256 _wstETHAmount) returns (uint256)'],
    'unwrap',
    [amount]
  );
