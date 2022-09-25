<template>
  <div :class="['bal-select-input', containerClasses]">
    <div class="flex h-full items-center">
      <div class="flex h-full flex-1 flex-col justify-center">
        <div v-if="label || $slots.label" :class="['label', labelClasses]">
          <slot name="label">
            {{ label }}
          </slot>
        </div>
        <select
          ref="balSelectInput"
          :value="modelValue"
          :name="name"
          :class="[inputClasses]"
          v-bind="$attrs"
          @change="onChange"
        >
          <option v-if="defaultText" value="" hidden>
            {{ defaultText }}
          </option>
          <option
            v-for="(option, i) in options"
            :key="i"
            :value="valFor(option)"
            class=""
          >
            {{ textFor(option) }}
          </option>
        </select>
      </div>
      <BalIcon name="chevron-down" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';

import { RuleFunction, Rules } from '@/types';

import BalIcon from '../BalIcon/BalIcon.vue';

export default defineComponent({
  name: 'BalSelectInput',

  components: {
    BalIcon,
  },

  props: {
    modelValue: { type: String, default: '' },
    options: { type: Array, required: true },
    name: { type: String, required: true },
    label: { type: String, default: '' },
    validateOn: { type: String, default: 'change' },
    defaultText: { type: String, default: '' },
    noMargin: { type: Boolean, default: false },
    size: {
      type: String,
      default: 'md',
      validator: (val: string): boolean => ['sm', 'md', 'lg'].includes(val),
    },
    rules: {
      type: Array as PropType<Rules>,
      default: () => [],
    },
  },

  emits: ['change', 'update:modelValue'],

  setup(props, { emit }) {
    const balSelectInput = ref({} as HTMLSelectElement);
    const errors = ref([] as string[]);

    const hasError = computed(() => errors.value.length > 0);

    const textSizeClasses = computed(() => {
      switch (props.size) {
        case 'sm':
          return 'text-sm';
        case 'lg':
          return 'text-lg';
        default:
          return 'text-base';
      }
    });

    const labelSizeClasses = computed(() => {
      switch (props.size) {
        case 'sm':
          return 'text-xs -mt-4';
        case 'lg':
          return 'text-base -mt-8';
        default:
          return 'text-sm -mt-6';
      }
    });

    const inputHeightClasses = computed(() => {
      switch (props.size) {
        case 'sm':
          return 'h-10';
        case 'lg':
          return 'h-16';
        default:
          return 'h-10';
      }
    });

    const containerClasses = computed(() => {
      return {
        [textSizeClasses.value]: true,
        [inputHeightClasses.value]: true,
        'mb-5': !props.noMargin,
      };
    });

    const inputClasses = computed(() => {
      return {};
    });

    const labelClasses = computed(() => {
      return {
        [labelSizeClasses.value]: true,
      };
    });

    function valFor(option) {
      if (typeof option === 'string' || option instanceof String) return option;
      return option.value;
    }

    function textFor(option) {
      if (typeof option === 'string' || option instanceof String) return option;
      return option.text;
    }

    function onChange(event): void {
      emit('change', event.target.value);
      emit('update:modelValue', event.target.value);
    }

    function validate(val: string): void {
      errors.value = [];
      props.rules.forEach((rule: RuleFunction) => {
        const result = rule(val);
        if (typeof result === 'string') errors.value.push(result);
      });
    }

    return {
      balSelectInput,
      hasError,
      containerClasses,
      inputClasses,
      valFor,
      textFor,
      validate,
      labelClasses,
      onChange,
    };
  },
});
</script>

<style scoped>
.bal-select-input {
  @apply relative w-full overflow-hidden rounded-lg bg-gray-50 px-2 shadow transition-all
    hover:shadow-none focus:shadow-none dark:bg-gray-800;
}

.label {
  @apply text-gray-400;
}

select {
  @apply absolute -ml-px h-full w-full bg-transparent text-xs leading-loose leading-none;

  appearance: none;
  text-indent: 1px;
  text-overflow: '';
}

.bal-select-input .bal-icon :deep(svg) {
  @apply transition-all;

  /* blue-500 */
  stroke: #384aff;
}

.bal-select-input:hover .bal-icon :deep(svg),
.bal-select-input:focus .bal-icon :deep(svg) {
  /* pink-500 */
  stroke: #f21bf6;
}
</style>
