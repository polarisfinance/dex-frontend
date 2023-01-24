<script setup lang="ts">
import useBreakpoints from '@/composables/useBreakpoints';
import {
  computed,
  ref,
} from 'vue';
import useWeb3 from '@/services/web3/useWeb3';
import HeroConnectWalletButton from '@/components/heros/HeroConnectWalletButton.vue';
const { isDesktop, isMobile } = useBreakpoints();
const { isWalletReady, isWalletConnecting } = useWeb3();

const totalProgress = ref(1);

const endDay:Date = new Date('2023-01-23');
const today:Date = new Date();
const diffTime = Math.abs((endDay as any) - (today as any));
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24) -1 ); 
const progress = (60-diffDays)/60;

</script>

<template>
  <div :class="{ 'pg-bg': isDesktop }"></div>
  <div :class="{ 'relative': isDesktop }">
    <div class="container mx-auto mt-[160px]">
        <div class="text-center">
            <div class="title">Airdrop for Polaris holders</div>
            <div class="subtitle">
            Connect your wallet and claim your airdrop!
            </div>
            <HeroConnectWalletButton class="my-10" v-if="!isWalletReady && !isWalletConnecting"/>
        </div>
        <div class="summary flex mx-auto">
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
                <div class="progress absolute bottom-0 left-0 opacity-80 w-0 transition duration-300 ease-linear h-[1px] bg-green-500 dark:bg-green-500"
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
.summary{
    max-width: 700px;
    background: #292043;
    padding: 24px 64px 24px 32px;
    border-radius: 100px;
    margin-top:32px;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    color: #BDB2DD;
}
.summary h3{
    font-weight: 600;
    font-size: 40px;
    line-height: 52px;
    color: #FDFDFD;

}
.title {
    font-weight: 600;
    font-size: 84px;
    line-height: 104px;
    color: #FDFDFD;
    max-width: 500px;
    margin: auto;
}
.subtitle{
    margin-top:32px;
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    color: #A99BC6;
}

.title-text {
  position: absolute;
  font-weight: 600;
  font-size: 64px;
  line-height: 82px;
  text-align: center;
  color: #fdfdfd;
}
.vesting{
    margin-top: 160px;
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    color: #BDB2DD;
}
h2{
    font-weight: 600;
    font-size: 40px;
    line-height: 52px;
    color: #FFFFFF;
    margin-bottom: 37px;
}
.progress-bar{
    background:#41365E;
    position: relative;
    margin-bottom: 10px;
}
</style>