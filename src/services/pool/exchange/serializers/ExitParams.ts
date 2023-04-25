import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { AddressZero } from '@ethersproject/constants';
import { parseUnits } from '@ethersproject/units';
import { Ref } from 'vue';

import {
  preMintedBptIndex,
  isComposableStable,
  isStableLike,
  tokensListExclBpt,
} from '@/composables/usePoolHelpers';
import { includesAddress, isSameAddress } from '@/lib/utils';
import { encodeExitStablePool } from '@/lib/utils/balancer/stablePoolEncoding';
import { encodeExitWeightedPool } from '@/lib/utils/balancer/weightedPoolEncoding';
import ConfigService from '@/services/config/config.service';
import { Pool } from '@/services/pool/types';

import PoolExchange from '../exchange.service';
import { encodeExitComposableStablePool } from '@/lib/utils/balancer/composableStablePoolEncoding';
import { BasePoolEncoder } from '@balancer-labs/sdk';

export default class ExitParams {
  private pool: Ref<Pool>;
  private config: ConfigService;
  private isStableLike: boolean;
  private dataEncodeFn: (data: any) => string;
  private toInternalBalance = false;

  constructor(exchange: PoolExchange) {
    this.pool = exchange.pool;
    this.config = exchange.config;
    this.isStableLike = isStableLike(exchange.pool.value.poolType);
    this.dataEncodeFn = this.isStableLike
      ? isComposableStable(exchange.pool.value.poolType)
        ? encodeExitComposableStablePool
        : encodeExitStablePool
      : encodeExitWeightedPool;
  }

  public serialize(
    account: string,
    amountsOut: string[],
    tokensOut: string[],
    bptIn: string,
    exitTokenIndex: number | null,
    exactOut: boolean
  ): any[] {
    const parsedAmountsOut = this.parseAmounts(amountsOut);
    const parsedBptIn = parseUnits(
      bptIn,
      this.pool.value?.onchain?.decimals || 18
    );

    const assets = this.parseTokensOut(tokensOut);
    const txData = this.txData(
      parsedAmountsOut,
      parsedBptIn,
      exitTokenIndex,
      exactOut
    );

    const minAmountsOut = parsedAmountsOut.map(amount =>
      // This is a hack to get around rounding issues for MetaStable pools
      // TODO: do this more elegantly
      amount.gt(0) ? amount.sub(1) : amount
    );
    const poolTokenItselfIndex = preMintedBptIndex(this.pool.value);

    if (
      isComposableStable(this.pool.value.poolType) &&
      poolTokenItselfIndex !== undefined
    ) {
      minAmountsOut.splice(
        poolTokenItselfIndex,
        0,
        parseUnits('0', this.pool.value.onchain?.decimals || 18)
      );
    }

    return [
      this.pool.value.id,
      account,
      account,
      {
        assets,
        minAmountsOut,
        userData: txData,
        toInternalBalance: this.toInternalBalance,
      },
    ];
  }

  private parseAmounts(amounts: string[]): BigNumber[] {
    const tokensList = tokensListExclBpt(this.pool.value);

    try {
      return amounts.map((amount, i) => {
        const token = tokensList[i];
        return parseUnits(
          amount,
          this.pool.value?.onchain?.tokens?.[token]?.decimals
        );
      });
    } catch (error) {
      console.error('Failed to parse amountsOut', error);
      throw new Error('Failed to parse amounts out.');
    }
  }

  private parseTokensOut(tokensOut: string[]): string[] {
    const nativeAsset = this.config.network.nativeAsset;
    const preMintedBptIdx = preMintedBptIndex(this.pool.value);
    const newTokensOut = tokensOut.map(address =>
      isSameAddress(address, nativeAsset.address) ? AddressZero : address
    );

    if (
      isComposableStable(this.pool.value.poolType) &&
      preMintedBptIdx !== undefined &&
      !includesAddress(newTokensOut, this.pool.value.address)
    ) {
      newTokensOut.splice(preMintedBptIdx, 0, this.pool.value.address);
    }

    return newTokensOut;
  }

  private txData(
    amountsOut: BigNumberish[],
    bptIn: BigNumberish,
    exitTokenIndex: number | null,
    exactOut: boolean
  ): string {
    const isSingleAssetOut = exitTokenIndex !== null;

    if (this.pool.value.isInRecoveryMode) {
      return BasePoolEncoder.recoveryModeExit(bptIn);
    }

    if (isSingleAssetOut) {
      return this.dataEncodeFn({
        kind: 'ExactBPTInForOneTokenOut',
        bptAmountIn: bptIn,
        exitTokenIndex,
      });
    } else if (exactOut) {
      return this.dataEncodeFn({
        amountsOut,
        maxBPTAmountIn: bptIn,
      });
    } else {
      // Proportional exit
      if (isComposableStable(this.pool.value.poolType)) {
        return this.dataEncodeFn({
          amountsOut,
          maxBPTAmountIn: bptIn,
        });
      }
      return this.dataEncodeFn({
        kind: 'ExactBPTInForTokensOut',
        bptAmountIn: bptIn,
      });
    }
  }
}
