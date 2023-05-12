<script setup lang="ts">
import { ref, provide } from 'vue';
import { useReturnRoute } from '@/composables/useReturnRoute';
import useBreakpoints from '@/composables/useBreakpoints';
import AppNav from '@/components/navs/AppNav/AppNav.vue';
import InvestHero from '@/components/heros/InvestHero.vue';

import investSteps from '@/components/contextual/pages/pool/invest/ProcessSteps.json';
import investVeBalSteps from '@/components/contextual/pages/pool/invest/ProcessVeBalSteps.json';
import withdrawSteps from '@/components/contextual/pages/pool/withdraw/ProcessSteps.json';
import { ERC20Multicaller } from '@/services/multicalls/erc20.multicaller';
import { isVeBalPool } from '@/composables/usePoolHelpers';
import PoolUserStats from '@/components/contextual/pages/pool/PoolUserStats.vue';
import usePoolQuery from '@/composables/queries/usePoolQuery';
import {
  usePoolStaking,
  providePoolStaking,
} from '@/providers/local/pool-staking.provider';
const { getReturnRoute } = useReturnRoute();
const { isMobile, isDesktop } = useBreakpoints();
const refComponent = ref(null);

const route = useRoute();
const id = (route.params.id as string).toLowerCase();

const poolQuery = usePoolQuery(id, undefined, undefined);
const pool = computed(() => poolQuery.data.value);

export type Processes = 'invest' | 'withdraw';

var steps = [{}];
if (route.name === 'invest') {
  if (isVeBalPool(id)) steps = investVeBalSteps;
  else steps = investSteps;
}
if (route.name === 'withdraw') steps = withdrawSteps;

const activeStep = ref(1);

function updateStep(step) {
  if (step <= steps.length) {
    activeStep.value = step;
  }
  activeStep.value = step;
}

function progressPerc() {
  if (activeStep.value == steps.length) {
    return 1;
  }
  return (1 / (steps.length - 1)) * (activeStep.value - 1) + 0.05;
}

function clickActiveStep(step) {
  if (step == steps.length) return;

  activeStep.value = step;

  if (
    refComponent.value != undefined &&
    typeof refComponent.value.setActiveStep === 'function'
  )
    refComponent.value.setActiveStep(activeStep.value);
}

function goBack() {
  // if (this.isWalletReady && this.activeStep == 2) return;
  // if (!this.isWalletReady && this.activeStep == 1) return;

  updateStep(activeStep.value - 1);
}
provide('provider.poolStaking', providePoolStaking(pool.value?.id));
// providePoolStaking(pool.value?.id);

onMounted(() => {});
</script>



<template>
  <div class="app-background">
    <div class="app-body">
      <AppNav />
      <div class="pb-16">
        <InvestHero :headline="steps[activeStep - 1].headline" />
        <div class="container mx-auto">
          <div class="items-center self-center w-full mt-[40px]">
            <div class="flex justify-between steps">
              <template v-for="step in steps">
                <button class="self-start" @click="clickActiveStep(step.step)">
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
            <div class="w-full progress-bar mt-[32px] h-[2px] rounded-[24px]">
              <div
                class="absolute bottom-0 left-0 w-0 bg-polaris-green dark:bg-polaris-green opacity-80 transition duration-300 ease-linear progress h-[2px] rounded-[24px]"
                :style="{ width: `${(progressPerc() * 100).toFixed(0)}%` }"
              />
            </div>
          </div>
        </div>
        <div class="pb-16">
          <div v-if="activeStep == steps.length" class="fireworks">
            <div class="before" />
            <div class="after" />
          </div>
          <div class="container mx-auto">
            <div class="flex flex-wrap card mt-[60px]">
              <div v-if="isDesktop" class="flex flex-col">
                <div class="flex-none stats-header">
                  <div>
                    <h3>My pool balance</h3>
                  </div>
                </div>
                <div class="flex-1 stats">
                  <BalLoadingBlock v-if="pool == undefined" class="h-96" />
                  <PoolUserStats v-else :pool="pool" />
                </div>
              </div>
              <div class="flex-1 justify-center">
                <div class="flex header">
                  <div class="flex-1">
                    <button class="back actions" @click="goBack">
                      <template v-if="activeStep < 5">
                        <ArrowLeftIcon class="inline ml-3 mr-[12px]" />Go
                        back</template
                      >
                    </button>
                  </div>
                  <div
                    v-if="route.name == 'invest'"
                    class="flex-1 text-center title"
                  >
                    Invest in pool Step
                  </div>
                  <div
                    v-if="route.name == 'withdraw'"
                    class="flex-1 text-center title"
                  >
                    Withdraw from pool
                  </div>
                  <div class="flex-1 text-right">
                    <router-link
                      class="actions"
                      :to="{ name: 'pool', params: { id: id } }"
                    >
                      Exit <CloseIcon class="inline ml-[12px]" />
                    </router-link>
                  </div>
                </div>
                <div
                  class="mx-auto nested-card m-[24px] mt-[16px] max-w-[480px]"
                >
                  <div class="nested-card mt-[16px]">
                    <router-view v-slot="{ Component }" :key="$route.path">
                      <transition appear name="appear">
                        <component
                          :is="Component"
                          ref="refComponent"
                          :step="activeStep"
                          @active-step-updated="updateStep"
                        />
                      </transition>
                    </router-view>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  

<style scoped>
.stats {
  min-width: 300px;
  @apply bg-gray-300 dark:bg-polaris-4;
  padding: 24px;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #bdb2dd;
}
.stats-header {
  @apply bg-gray-500 dark:bg-polaris-card-default;
}

.stats-header div {
  @apply bg-gray-300 dark:bg-polaris-4;
  border-top-right-radius: 32px;
}

.stats-header h3 {
  @apply bg-gray-200 dark:bg-polaris-button-inactive;
  border-radius: 32px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #bdb2dd;
}

.progress-bar {
  background: #41365e;
  position: relative;
  margin-bottom: 10px;
}

.exit {
  padding: 6px 50px;
  gap: 10px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  background: linear-gradient(rgb(41 32 67 / 100%), rgb(41 32 67 / 100%))
      padding-box,
    linear-gradient(90deg, rgb(192 4 254 / 100%), rgb(126 2 245 / 100%))
      border-box;
  border: 1px solid transparent;
}
.back,
.header {
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
  color: #bdb2dd;
}

.header {
  @apply bg-gray-500 dark:bg-polaris-card-default;
  padding: 10px 24px;
  border-bottom-right-radius: 21px;
}
.header .title {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #fdfdfd;
}
.card {
  @apply bg-gray-200 dark:bg-polaris-card-ultradark;
  border-radius: 21px;
  min-height: 0;
  overflow: hidden;
}
h3 {
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #fdfdfd;
  padding-bottom: 16px;
}
</style>
