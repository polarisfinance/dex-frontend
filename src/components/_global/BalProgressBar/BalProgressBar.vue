<script setup lang="ts">
import { computed } from 'vue';

/**
 * TYPES
 */
type Props = {
  width: string | number;
  bufferWidth: string | number;
  size?: string;
  color?: string;
};

/**
 * PROPS
 */
const props = withDefaults(defineProps<Props>(), {
  size: '1',
  color: '#fbaaff',
});

/**
 * COMPUTED
 */
const barClasses = computed(() => ({
  [`h-[2px]`]: true,
  [`bg-[#fbaaff]`]: true,
}));

const bufferBarClasses = computed(() => ({
  [`h-${props.size}`]: true,
  [`bg-orange-500`]: true,
}));

const barStyles = computed(() => ({
  width: `${props.width}%`,
}));

const bufferBarStyles = computed(() => ({
  width: `${props.bufferWidth}%`,
}));
</script>

<template>
  <div class="progress-track">
    <div :class="['progress-bar', barClasses]" :style="barStyles" />
    <div
      v-if="props.bufferWidth != null && props.bufferWidth > 0"
      :class="['progress-bar', bufferBarClasses]"
      :style="bufferBarStyles"
    />
  </div>
</template>

<style scoped>
.progress-track {
  @apply rounded-full bg-[#1b1021] dark:bg-[#1b1021] overflow-hidden flex mx-[10px];
}

.progress-bar {
  transition: all 0.3s ease;
}
</style>
