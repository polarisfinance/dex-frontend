<script lang="ts" setup>
import { computed } from 'vue';

import { getActiveClassName } from '@/components/utils';
import { StepState } from '@/types';

type Props = {
  title: string;
  steps: Step[];
};

type Step = {
  tooltip: string;
  state: StepState;
  label: number;
  isVisible?: boolean;
};

const props = defineProps<Props>();
const emit = defineEmits(['navigate']);

/**
 * COMPUTED
 */
const visibleSteps = computed(() => {
  return props.steps.filter(
    step => step.isVisible === undefined || step.isVisible
  );
});

const stepTextClasses = computed(() => {
  return visibleSteps.value.map(step => {
    return getActiveClassName(step.state, [
      [StepState.Active, 'text-white font-semibold hover:text-white'],
      [StepState.Todo, 'text-pink-third font-semibold'],
      [StepState.Success, 'text-pink-third font-semibold'],
      [StepState.Warning, 'text-red-500 font-semibold'],
      [StepState.Completed, 'text-pink-third font-semibold'],
    ]);
  });
});

const stepCircleClasses = computed(() => {
  return visibleSteps.value.map(step => {
    return getActiveClassName(step.state, [
      [StepState.Active, 'border-2 border-pink-secondary text-white active'],
      [StepState.Todo, 'border-2 border-pink-third text-pink-third'],
      [StepState.Success, 'border-2 border-pink-third text-pink-third'],
      [StepState.Warning, 'border-2 border-none bg-red-500 text-white active'],
      [StepState.Completed, 'border-2 border-pink-third text-pink-third'],
    ]);
  });
});

/**
 * FUNCTIONS
 */
function handleNavigate(state: StepState, stepIndex: number) {
  if (state === StepState.Todo) return;
  emit('navigate', stepIndex);
}
</script>

<template>
  <BalStack horizontal spacing="base" class="p-4" justify="center">
    <div
      v-for="(step, i) in visibleSteps"
      :key="`vertical-step-${step.tooltip}`"
      class="flex items-center"
    >
      <button
        :class="{ 'cursor-default': step.state === StepState.Todo }"
        class="bg-none"
        @click="handleNavigate(step.state, i)"
      >
        <BalStack horizontal align="center" spacing="sm">
          <div
            :class="[
              'relative flex h-7 w-7 items-center justify-center rounded-full text-sm',
              stepCircleClasses[i],
              { 'circle-line': i !== visibleSteps.length - 1 },
            ]"
          >
            <div
              class="absolute top-0 right-0 bottom-0 left-0 mx-auto flex w-4 items-center justify-center"
            >
              <span
                v-if="
                  ![StepState.Warning, StepState.Error].includes(step.state)
                "
                >{{ step.label || i + 1 }}</span
              >
              <span v-else class="font-semibold">!</span>
            </div>
          </div>
          <span :class="['text-sm', stepTextClasses[i]]">
            {{ step.tooltip }}
          </span>
        </BalStack>
      </button>
    </div>
  </BalStack>
</template>

<style scoped>
/* .circle-line::after {
  @apply absolute left-0 right-0 my-0 mx-auto w-px;

  content: '';
  bottom: -1.125rem;
  height: 1rem;
}

.circle-line.active::after {
  bottom: -1rem;
  height: 1rem;
} */
</style>
