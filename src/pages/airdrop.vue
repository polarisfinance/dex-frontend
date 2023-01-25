<script setup lang="ts">
import useBreakpoints from '@/composables/useBreakpoints';
import { computed, ref } from 'vue';
import useWeb3 from '@/services/web3/useWeb3';
import HeroConnectWalletButton from '@/components/heros/HeroConnectWalletButton.vue';

import useAirdrop from '@/composables/PolarisFinance/useAirdrop';
import useEthers from '@/composables/useEthers';
import useTransactions from '@/composables/useTransactions';
import { TransactionResponse } from '@ethersproject/providers';

const { isDesktop, isMobile } = useBreakpoints();
const { isWalletReady, isWalletConnecting } = useWeb3();

const totalProgress = ref(1);

const endDay: Date = new Date('2023-01-23');
const today: Date = new Date();
const diffTime = Math.abs((endDay as any) - (today as any));
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24) - 1);
const progress = (60 - diffDays) / 60;

const { account, getProvider } = useWeb3();

const { pendingShare, claim } = useAirdrop(account.value);

const { addTransaction } = useTransactions();
const { txListener } = useEthers();
const txHandler = (tx: TransactionResponse): void => {
  addTransaction({
    id: tx.hash,
    type: 'tx',
    action: 'claim',
    summary: 'Claim airdrop',
  });
};
const claimAirdrop = async () => {
  const provider = getProvider();
  const tx = await claim(provider);
  txHandler(tx);
  txListener(tx, {
    onTxConfirmed: () => {
      // TODO: add some function to update pendingShare after claim
    },
    onTxFailed: () => {},
  });
};
</script>

<template>
  <div :class="{ 'pg-bg': isDesktop }"></div>
  <div :class="{ relative: isDesktop }">
    <div class="container mx-auto mt-[160px]">
      <div class="text-center">
        <div class="title">Airdrop for Polaris holders</div>
        <div class="subtitle">Connect your wallet and claim your airdrop!</div>
        <HeroConnectWalletButton
          class="my-10"
          v-if="!isWalletReady && !isWalletConnecting"
        />
      </div>
      <div class="summary mx-auto flex">
        <div class="info-token flex-none pr-[55px]">
          <img class="w-[124px]" src="./xpolar.svg" />
        </div>
        <div class="total w-full pt-[24px]">
          Total xPolars
          <h3>200,000</h3>
        </div>
        <div class="share w-full pt-[24px]">
          Your share
          <h3>?</h3>
        </div>
      </div>
      <div class="vesting">
        <h2>60 Days vesting</h2>
        <div class="progress-bar h-[1px]">
          <div
            class="progress absolute bottom-0 left-0 h-[1px] w-0 bg-green-500 opacity-80 transition duration-300 ease-linear dark:bg-green-500"
            :style="{ width: `${(progress * 100).toFixed(0)}%` }"
          />
        </div>
        <div class="flex">
          <div class="w-full text-left">Day 1</div>
          <div class="w-full text-right">Day 60</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary {
  max-width: 700px;
  background: #292043;
  padding: 24px 64px 24px 32px;
  border-radius: 100px;
  margin-top: 32px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #bdb2dd;
}
.summary h3 {
  font-weight: 600;
  font-size: 40px;
  line-height: 52px;
  color: #fdfdfd;
}
.title {
  font-weight: 600;
  font-size: 84px;
  line-height: 104px;
  color: #fdfdfd;
  max-width: 500px;
  margin: auto;
}
.subtitle {
  margin-top: 32px;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  color: #a99bc6;
}

.title-text {
  position: absolute;
  font-weight: 600;
  font-size: 64px;
  line-height: 82px;
  text-align: center;
  color: #fdfdfd;
}
.vesting {
  margin-top: 160px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #bdb2dd;
}
h2 {
  font-weight: 600;
  font-size: 40px;
  line-height: 52px;
  color: #ffffff;
  margin-bottom: 37px;
}
.progress-bar {
  background: #41365e;
  position: relative;
  margin-bottom: 10px;
}
</style>
