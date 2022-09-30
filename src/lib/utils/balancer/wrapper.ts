import { TransactionResponse, Web3Provider } from '@ethersproject/providers';
import { BigNumber, BigNumberish } from 'ethers';

import configs from '@/lib/config';
import { sendTransaction } from '@/lib/utils/balancer/web3';
import { configService } from '@/services/config/config.service';

import { getStETHByWstETH, getWstETHByStETH } from './lido';

const pABI = [
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'wrappedToken',
        type: 'address',
      },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'symbol', type: 'string' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'depositFor',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'underlying',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'withdrawTo',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

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

  // if (tokenIn === nativeAddress && tokenOut === weth) return WrapType.Wrap;
  // if (tokenIn === stETH && tokenOut === wstETH) return WrapType.Wrap;
  const NEAR = '0xC42C30aC6Cc15faC9bD938618BcaA1a1FaE8501d';
  const STNEAR = '0x07f9f7f963c5cd2bbffd30ccfb964be114332e30';
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
  //   if (tokenOut === nativeAddress && tokenIn === weth) return WrapType.Unwrap;
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
  throw new Error('Unknown wrapper');
};

export async function pWrap(
  tokenInAddress: string,
  web3: Web3Provider,
  wrapper: string,
  amount: BigNumber
): Promise<TransactionResponse> {
  try {
    return pWrapNative(tokenInAddress, web3, amount);
  } catch (e) {
    console.log('[Wrapper] Wrap error:', e);
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
  tokenInAddress: string,
  web3: Web3Provider,
  amount: BigNumber
): Promise<TransactionResponse> =>
  sendTransaction(web3, tokenInAddress, pABI, 'depositFor', [], {
    value: amount,
  });

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
