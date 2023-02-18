<script setup lang="ts">
import { computed, toRef } from 'vue';

import useWithdrawMath from '@/components/forms/pool_actions/WithdrawForm/composables/useWithdrawMath';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import { lpTokensFor } from '@/composables/usePool';
import useTokens from '@/composables/useTokens';
import { bnum, isSameAddress } from '@/lib/utils';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
  missingPrices: boolean;
};

/**
 * PROPS
 */
const props = defineProps<Props>();

/**
 * COMPOSABLES
 */
const { hasBpt } = useWithdrawMath(toRef(props, 'pool'));
const { balanceFor, nativeAsset, wrappedNativeAsset } = useTokens();
const { fNum2, toFiat } = useNumbers();
const { isWalletReady, startConnectWithInjectedProvider } = useWeb3();

/**
 * COMPUTED
 */
const fiatTotal = computed(() => {
  const fiatValue = lpTokensFor(props.pool)
    .map(address => {
      let tokenBalance = '0';

      if (isSameAddress(address, wrappedNativeAsset.value.address)) {
        const wrappedBalance = balanceFor(address);
        const nativeBalance = balanceFor(nativeAsset.address);
        tokenBalance = bnum(nativeBalance).gt(wrappedBalance) ? nativeBalance : wrappedBalance;
      } else {
        tokenBalance = balanceFor(address);
      }

      return toFiat(tokenBalance, address);
    })
    .reduce((total, value) => bnum(total).plus(value).toString());

  return fNum2(fiatValue, FNumFormats.fiat);
});
</script>

<template>
  <div class="w-full border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-900 dark:bg-gray-800">
    <div class="text-secondary text-sm">
      {{ $t('basedOnTokensInWallet') }}
    </div>
    <div class="mb-4 flex items-center justify-between">
      <h5>
        {{ $t('youCanInvest') }}
      </h5>
      <h5>
        {{ isWalletReady ? fiatTotal : '-' }}
      </h5>
    </div>

    <BalBtn v-if="!isWalletReady" :label="$t('connectWallet')" color="gradient" block @click="startConnectWithInjectedProvider" />
    <div v-else class="grid grid-cols-2 gap-2">
      <BalBtn tag="router-link" :to="{ name: 'invest' }" :label="$t('invest')" color="gradient" block />
      <BalBtn :tag="hasBpt ? 'router-link' : 'div'" :to="{ name: 'withdraw' }" :label="$t('withdraw.label')" :disabled="!hasBpt" color="blue" outline block />
    </div>
  </div>
</template>
