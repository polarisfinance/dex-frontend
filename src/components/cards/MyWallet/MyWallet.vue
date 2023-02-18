<script setup lang="ts">
import { take } from 'lodash';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useTradeState } from '@/composables/trade/useTradeState';
import useBreakpoints from '@/composables/useBreakpoints';
import { isMainnet } from '@/composables/useNetwork';
import useTokens from '@/composables/useTokens';
import { configService } from '@/services/config/config.service';
import useWeb3 from '@/services/web3/useWeb3';

const { appNetworkConfig, isWalletReady, startConnectWithInjectedProvider } = useWeb3();
const { upToLargeBreakpoint } = useBreakpoints();
const { setTokenInAddress } = useTradeState();
const { hasBalance, nativeAsset, balanceFor, balances, dynamicDataLoading: isLoadingBalances } = useTokens();
const nativeCurrency = configService.network.nativeAsset.symbol;
const networkName = configService.network.name;
const { t } = useI18n();

const etherBalance = computed(() => {
  if (!isWalletReady.value) return '-';
  return Number(balanceFor(appNetworkConfig.nativeAsset.address)).toFixed(4);
});

const noNativeCurrencyMessage = computed(() => {
  return t('noNativeCurrency', [nativeCurrency, networkName]);
});

const noNativeCurrencyMessageEthereum = computed(() => {
  return t('noNativeCurrencyEthereum', [nativeCurrency, networkName]);
});

const noTokensMessage = computed(() => {
  return t('noTokensInWallet', [networkName]);
});

const tokensWithBalance = computed(() => {
  return take(
    Object.keys(balances.value).filter(
      tokenAddress => Number(balances.value[tokenAddress]) > 0 && tokenAddress !== appNetworkConfig.nativeAsset.address && tokenAddress !== appNetworkConfig.addresses.veBAL
    ),
    21
  );
});
</script>

<template>
  <div noPad growContent shadow="none">
    <div class="container flex h-full w-full flex-col">
      <div class="flex p-3 pb-0 lg:justify-between lg:pb-3">
        <h6 v-if="!upToLargeBreakpoint" class="title">
          {{ $t('myWallet2') }}
        </h6>
        <div v-if="!isLoadingBalances" class="ml-1 font-semibold lg:ml-0 lg:font-normal">
          <div v-if="!hasBalance(nativeAsset.address)" class="mr-0.5">
            {{ nativeCurrency }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  color: #be95c0;
}

.container {
  background: #231928;
  backdrop-filter: blur(4px);

  border-radius: 12px;
}
</style>
