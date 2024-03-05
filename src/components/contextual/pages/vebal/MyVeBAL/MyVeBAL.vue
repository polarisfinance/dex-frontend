<script setup lang="ts">
import { computed } from 'vue';

import { useLock } from '@/composables/useLock';
import useWeb3 from '@/services/web3/useWeb3';

import MyVeBalCards from './components/MyVeBalCards.vue';

import useEthers from '@/composables/useEthers';
import useTransactions from '@/composables/useTransactions';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';

import GaugeControllerAbi from '@/lib/abi/GaugeController.json';
import ConfigService, { configService } from '@/services/config/config.service';

import WalletService, {
  walletService as walletServiceInstance,
} from '@/services/web3/wallet.service';
import useOmniVotingEscrowAdaptor from '@/composables/PolarisFinance/useOmniVotingEscrowAdaptor';

/**
 * COMPOSABLES
 */
const {
  isLoadingLockPool,
  isLoadingLockInfo,
  lockPool,
  lockPoolToken,
  lock,
  totalLockedValue,
} = useLock();
const { isWalletReady } = useWeb3();
const { addTransaction } = useTransactions();
const { txListener, getTxConfirmedAt } = useEthers();
import { TransactionReceipt } from '@ethersproject/abstract-provider';
const { sendUserBalance } = useOmniVotingEscrowAdaptor();

/**
 * COMPUTED
 */

const isLoading = computed(() =>
  isWalletReady.value
    ? isLoadingLockPool.value || isLoadingLockInfo.value
    : false
);

const txHandler = (tx: TransactionResponse): void => {
  addTransaction({
    id: tx.hash,
    type: 'tx',
    action: 'sendUserBalance',
    summary: 'Send veXPOLAR balance to Telos',
  });
};

async function sendUserBalance_() {
  const tx = await sendUserBalance();
  txHandler(tx);
  txListener(tx, {
    onTxConfirmed: () => {
      console.log('tx confirmed');
    },
    onTxFailed: () => {},
  });
}
</script>

<template>
  <div class="flex justify-between items-center mt-10 mb-8">
    <h3 class="font-semibold dark:text-polaris-white">
      {{ $t('veBAL.myVeBAL.title') }}
    </h3>
    <BalBtn
      color="gradient"
      class="leading-4 get-btn"
      @click="sendUserBalance_"
    >
      Sync veXPOLAR balance to Telos
    </BalBtn>
  </div>

  <PolLine />
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-5">
    <template v-if="isLoading">
      <BalLoadingBlock v-for="n in 4" :key="n" class="h-24" />
    </template>
    <MyVeBalCards
      v-else-if="lockPool && lockPoolToken"
      :veBalLockInfo="lock"
      :lockablePool="lockPool"
      :lockablePoolTokenInfo="lockPoolToken"
      :totalLockedValue="totalLockedValue"
    />
  </div>
</template>

<style scoped>
.get-btn {
  background: linear-gradient(93.62deg, #c004fe 2.98%, #7e02f5 97.02%);
  border-radius: 12px;

  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  color: #f5f5f5;

  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 50px;
  padding-right: 50px;
}
</style>