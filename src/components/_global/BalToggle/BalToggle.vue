<template>
  <div class="bal-toggle group" @click="onClick">
    <input
      type="checkbox"
      :name="name"
      :checked="modelValue"
      v-bind="$attrs"
      :disabled="disabled"
      class="bal-toggle-checkbox"
    />
    <label :for="name" class="bal-toggle-track" />
  </div>
  <label v-if="label" class="ml-2 text-xs dark:text-white">
    {{ label }}
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'BalToggle',
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    color: {
      type: String,
      default: 'green',
      validator: (val: string): boolean => ['green'].includes(val),
    },
  },
  emits: ['update:modelValue', 'toggle'],
  setup(props, { emit }) {
    /**
     * METHODS
     */
    function onClick(event) {
      if (!props.disabled) {
        emit('update:modelValue', event.target.checked);
        emit('toggle', event.target.checked);
      }
    }
    return {
      // methods
      onClick,
    };
  },
});
</script>

<style scoped>
.bal-toggle {
  @apply relative inline-block w-10 select-none align-middle transition duration-200 ease-out;
}

.bal-toggle-checkbox {
  @apply absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 border-gray-200
    bg-white transition-colors group-hover:border-gray-300 dark:border-gray-700 dark:group-hover:border-gray-900;
}

.bal-toggle-track {
  @apply block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-200 bg-none
    transition-colors group-hover:bg-gray-300 dark:bg-gray-700 dark:group-hover:bg-gray-900;
}

.bal-toggle-checkbox:checked {
  @apply right-0 border-green-400 transition-colors group-hover:border-green-500
    dark:border-green-500 dark:group-hover:border-green-400;
}

.bal-toggle-track[for='tradeGasless'] {
  @apply h-8;
}

.bal-toggle-checkbox[name='tradeGasless'] {
  @apply flex h-8 w-8 items-center justify-center;
}

.bal-toggle-checkbox[name='tradeGasless']::before {
  content: '⛽';
}

.bal-toggle-checkbox[name='tradeGasless']:checked::before {
  content: '✍️';
}

.bal-toggle-checkbox:checked + .bal-toggle-track {
  @apply bg-green-400 group-hover:bg-green-500 dark:bg-green-500 dark:group-hover:bg-green-400;
}

.bal-toggle-checkbox[disabled] {
  @apply cursor-not-allowed border-gray-300 dark:border-gray-700;
}

.bal-toggle-checkbox[disabled] + .bal-toggle-track {
  @apply cursor-not-allowed bg-gray-300 dark:bg-gray-700;
}
</style>
