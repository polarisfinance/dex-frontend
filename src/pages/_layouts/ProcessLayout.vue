<script setup lang="ts">
import { useReturnRoute } from '@/composables/useReturnRoute';
import useBreakpoints from '@/composables/useBreakpoints';
import AppNav from '@/components/navs/AppNav/AppNav.vue';
import InvestHero from '@/components/heros/InvestHero.vue';

const { getReturnRoute } = useReturnRoute();
const { isMobile, isDesktop } = useBreakpoints();

const steps = [
  {
    step: 1,
    headline: 'Connect your wallet to start earning',
    button: 'Connect wallet',
  },
  {
    step: 2,
    headline: 'Choose your token amounts to invest',
    button: 'Create LP',
  },
  {
    step: 3,
    headline: 'Preview your investment',
    button: 'Preview & confirmation',
  },
  {
    step: 4,
    headline: 'Approve staking of your invested LP tokens',
    button: 'Approve staking',
  },
  {
    step: 5,
    headline: 'Stake your liquidity pool tokens',
    button: 'Stake LP',
  },
  {
    step: 6,
    headline: 'Everything is set and done!',
    button: 'Done',
  },
];

var activeStep= 1;
function updateStep(step) {
    const poolApproved = false;
    if (poolApproved == true && step == 4) {
        activeStep = step + 1;
    } else if (step <= steps.length) {
        activeStep = step;
    }

    activeStep = step;
}

function progressPerc() {
    if (activeStep == steps.length) {
    return 1;
    }
    return (1 / (steps.length - 1)) * (activeStep - 1) + 0.05;
}

function clickActiveStep(step) {
    if (step != steps.length) updateStep(step);
}

</script>



<template>
    <div class="app-background">
        <div class="app-body">
            <AppNav />
            <div class="pb-16">
                <InvestHero
                    :step="activeStep"
                    :headline="steps[activeStep - 1].headline"
                />
                <div class="container mx-auto">
                    <div class="mt-[40px] w-full items-center self-center">
                    <div class="steps flex justify-between">
                        <template v-for="step in steps">
                            <button @click="clickActiveStep(step.step)" class="self-start">
                                <TickIcon
                                v-if="step.step < activeStep || activeStep == steps.length"
                                class=""
                                :class="{
                                    'mx-auto block': isMobile,
                                    'mr-1 inline': isDesktop,
                                }"
                                />
                                <QuestionIcon
                                v-else
                                class=""
                                :class="{
                                    'mx-auto block': isMobile,
                                    'mr-1 inline': isDesktop,
                                }"
                                />

                                {{ step.button }}
                            </button>
                        </template>
                    </div>
                    <div class="progress-bar mt-[32px] h-[2px] w-full rounded-[24px]">
                        <div
                        class="progress absolute bottom-0 left-0 h-[2px] w-0 rounded-[24px] bg-styling-teal opacity-80 transition duration-300 ease-linear dark:bg-styling-teal"
                        :style="{ width: `${(progressPerc() * 100).toFixed(0)}%` }"
                        />
                    </div>
                    </div>
                </div>
                <router-view v-slot="{ Component }" :key="$route.path">
                <transition appear name="appear">
                    <component :is="Component" :activeStep="activeStep" @activeStepUpdated="updateStep" />
                </transition>
                </router-view>
            </div>
        </div>
    </div>
  </template>
  

<style scoped>
</style>
