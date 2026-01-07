/**
 * Direct Swap Service for Aurora
 *
 * Provides simple single-pool swaps without SOR routing.
 * Used when subgraph is unavailable.
 */
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { parseUnits, formatUnits } from '@ethersproject/units';
import { AddressZero } from '@ethersproject/constants';

import { configService } from '@/services/config/config.service';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';
import { walletService } from '@/services/web3/wallet.service';
import { findPoolForTokenPair, AuroraPool } from '@/lib/config/aurora/pools-static';
import { NATIVE_ASSET_ADDRESS } from '@/constants/tokens';

// Vault ABI for swaps
const VAULT_ABI = [
  'function swap((bytes32 poolId, uint8 kind, address assetIn, address assetOut, uint256 amount, bytes userData), (address sender, bool fromInternalBalance, address recipient, bool toInternalBalance), uint256 limit, uint256 deadline) payable returns (uint256)',
  'function queryBatchSwap(uint8 kind, (bytes32 poolId, uint256 assetInIndex, uint256 assetOutIndex, uint256 amount, bytes userData)[] swaps, address[] assets, (address sender, bool fromInternalBalance, address recipient, bool toInternalBalance) funds) view returns (int256[])',
];

// Pool ABI for getting swap info
const WEIGHTED_POOL_ABI = [
  'function getSwapFeePercentage() view returns (uint256)',
];

export interface DirectSwapQuote {
  poolId: string;
  poolAddress: string;
  tokenIn: string;
  tokenOut: string;
  amountIn: BigNumber;
  expectedAmountOut: BigNumber;
  priceImpact: number;
  swapFee: string;
}

export interface DirectSwapParams {
  tokenIn: string;
  tokenOut: string;
  amount: BigNumber;
  isExactIn: boolean;
  slippageBsp: number; // Slippage in basis points (100 = 1%)
  deadline: number; // Unix timestamp
}

class DirectSwapService {
  private vaultAddress: string;

  constructor() {
    this.vaultAddress = configService.network.addresses.vault;
  }

  /**
   * Check if direct swap is available for token pair
   */
  canSwap(tokenIn: string, tokenOut: string): boolean {
    const pool = this.findPool(tokenIn, tokenOut);
    return pool !== undefined;
  }

  /**
   * Find pool for token pair
   */
  findPool(tokenIn: string, tokenOut: string): AuroraPool | undefined {
    // Handle native asset
    const wrappedNative = configService.network.tokens.Addresses.wNativeAsset;
    const tokenInAddr = tokenIn === NATIVE_ASSET_ADDRESS ? wrappedNative : tokenIn;
    const tokenOutAddr = tokenOut === NATIVE_ASSET_ADDRESS ? wrappedNative : tokenOut;

    return findPoolForTokenPair(tokenInAddr, tokenOutAddr);
  }

  /**
   * Get quote for direct swap
   */
  async getQuote(
    tokenIn: string,
    tokenOut: string,
    amount: BigNumber,
    isExactIn: boolean,
    tokenInDecimals: number,
    tokenOutDecimals: number
  ): Promise<DirectSwapQuote | null> {
    const pool = this.findPool(tokenIn, tokenOut);
    if (!pool) {
      return null;
    }

    // Handle native asset
    const wrappedNative = configService.network.tokens.Addresses.wNativeAsset;
    const tokenInAddr = tokenIn === NATIVE_ASSET_ADDRESS ? wrappedNative : tokenIn;
    const tokenOutAddr = tokenOut === NATIVE_ASSET_ADDRESS ? wrappedNative : tokenOut;

    const provider = rpcProviderService.jsonProvider;
    const vault = new Contract(this.vaultAddress, VAULT_ABI, provider);

    try {
      // Query the expected output using queryBatchSwap
      const swapKind = isExactIn ? 0 : 1; // 0 = GIVEN_IN, 1 = GIVEN_OUT

      const swaps = [{
        poolId: pool.id,
        assetInIndex: 0,
        assetOutIndex: 1,
        amount: amount.toString(),
        userData: '0x',
      }];

      const assets = isExactIn
        ? [tokenInAddr, tokenOutAddr]
        : [tokenOutAddr, tokenInAddr];

      const funds = {
        sender: AddressZero,
        fromInternalBalance: false,
        recipient: AddressZero,
        toInternalBalance: false,
      };

      const deltas = await vault.queryBatchSwap(swapKind, swaps, assets, funds);

      // deltas[0] is the amount of first asset, deltas[1] is the amount of second asset
      // Positive means tokens going out of the vault (to user), negative means tokens going in
      const expectedAmountOut = isExactIn
        ? BigNumber.from(deltas[1]).abs()
        : BigNumber.from(deltas[0]).abs();

      // Get swap fee from pool
      let swapFee = '0.003'; // Default 0.3%
      try {
        const poolContract = new Contract(pool.address, WEIGHTED_POOL_ABI, provider);
        const feeRaw = await poolContract.getSwapFeePercentage();
        swapFee = formatUnits(feeRaw, 18);
      } catch {
        // Use default
      }

      // Calculate simple price impact
      const amountInNormalized = parseFloat(formatUnits(amount, tokenInDecimals));
      const amountOutNormalized = parseFloat(formatUnits(expectedAmountOut, tokenOutDecimals));

      // This is a simplified price impact calculation
      // Real price impact would need pool reserves
      const priceImpact = 0.001; // Placeholder - would need pool state for accurate calculation

      return {
        poolId: pool.id,
        poolAddress: pool.address,
        tokenIn: tokenInAddr,
        tokenOut: tokenOutAddr,
        amountIn: isExactIn ? amount : expectedAmountOut,
        expectedAmountOut: isExactIn ? expectedAmountOut : amount,
        priceImpact,
        swapFee,
      };
    } catch (error) {
      console.error('[DirectSwapService] Failed to get quote:', error);
      return null;
    }
  }

  /**
   * Execute direct swap
   */
  async swap(params: DirectSwapParams): Promise<TransactionResponse> {
    const { tokenIn, tokenOut, amount, isExactIn, slippageBsp, deadline } = params;

    const pool = this.findPool(tokenIn, tokenOut);
    if (!pool) {
      throw new Error('No pool found for token pair');
    }

    // Get signer from txBuilder
    const signer = walletService.txBuilder?.signer;
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    const userAddress = await signer.getAddress();

    // Handle native asset
    const wrappedNative = configService.network.tokens.Addresses.wNativeAsset;
    const isNativeIn = tokenIn === NATIVE_ASSET_ADDRESS;
    const isNativeOut = tokenOut === NATIVE_ASSET_ADDRESS;
    const tokenInAddr = isNativeIn ? wrappedNative : tokenIn;
    const tokenOutAddr = isNativeOut ? wrappedNative : tokenOut;

    // Get quote for limit calculation
    const quote = await this.getQuote(
      tokenIn,
      tokenOut,
      amount,
      isExactIn,
      18, // Will be overridden by actual decimals
      18
    );

    if (!quote) {
      throw new Error('Failed to get swap quote');
    }

    // Calculate limit with slippage
    // For exact in: minimum amount out
    // For exact out: maximum amount in
    const slippageMultiplier = isExactIn
      ? (10000 - slippageBsp) / 10000  // e.g., 0.99 for 1% slippage
      : (10000 + slippageBsp) / 10000; // e.g., 1.01 for 1% slippage

    const limit = isExactIn
      ? quote.expectedAmountOut.mul(Math.floor(slippageMultiplier * 10000)).div(10000)
      : quote.amountIn.mul(Math.ceil(slippageMultiplier * 10000)).div(10000);

    // Build swap struct
    const singleSwap = {
      poolId: pool.id,
      kind: isExactIn ? 0 : 1, // 0 = GIVEN_IN, 1 = GIVEN_OUT
      assetIn: isNativeIn ? AddressZero : tokenInAddr,
      assetOut: isNativeOut ? AddressZero : tokenOutAddr,
      amount: amount.toString(),
      userData: '0x',
    };

    const funds = {
      sender: userAddress,
      fromInternalBalance: false,
      recipient: userAddress,
      toInternalBalance: false,
    };

    const vault = new Contract(this.vaultAddress, VAULT_ABI, signer);

    // Execute swap
    const txOptions: any = {};
    if (isNativeIn) {
      txOptions.value = amount;
    }

    return vault.swap(singleSwap, funds, limit.toString(), deadline, txOptions);
  }
}

export const directSwapService = new DirectSwapService();
