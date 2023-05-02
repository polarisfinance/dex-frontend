<script setup lang="ts">
interface Tab {
  value: string | number;
  label: string;
}

type Props = {
  tabs: Tab[];
  modelValue: string | number;
  noPad: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  noPad: false,
});

const emit = defineEmits(['selected', 'update:modelValue']);

function isActiveTab(tab: Tab): boolean {
  return props.modelValue === tab.value;
}

function onClick(tab: Tab) {
  emit('selected', tab.value);
  emit('update:modelValue', tab.value);
}

const containerClasses = computed(() => {
  return {
    'px-4': !props.noPad,
  };
});

function stateClasses(tab: Tab): Record<string, boolean> {
  return {
    'border-b-2  dark:text-polaris-white dark:border-polaris-white':
      isActiveTab(tab),
    'dark:hover:text-polaris-white  transition-colors':
      !isActiveTab(tab),
  };
}

const lastTab = computed(() => props.tabs[props.tabs.length - 1]);
</script>

<template>
  <div>
    <div :class="['bal-tab-container', containerClasses]">
      <div
        v-for="(tab, i) in props.tabs"
        :key="i"
        :class="['bal-tab', stateClasses(tab)]"
        @click="onClick(tab)"
      >
        {{ tab.label }}
      </div>
      <div :class="['bal-tab -ml-6 pl-2', stateClasses(lastTab)]">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style>
.bal-tab {
  @apply -mb-px mr-6 py-3 cursor-pointer;
}

.bal-tab:last-child {
  @apply mr-0;
}

.bal-tab-container {
  @apply flex border-b dark:border-transparent;
}
</style>
