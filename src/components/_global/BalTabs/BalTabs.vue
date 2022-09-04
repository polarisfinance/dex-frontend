<template>
  <div>
    <div :class="['bal-tab-container', containerClasses]">
      <div
        v-for="(tab, i) in tabs"
        :key="i"
        :class="['bal-tab', stateClasses(tab)]"
        @click="onClick(tab)"
      >
        {{ tab.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';

interface Tab {
  value: string;
  label: string;
}

export default defineComponent({
  name: 'BalTabs',

  props: {
    tabs: { type: Array as PropType<Tab[]>, required: true },
    modelValue: { type: String, default: '' },
    noPad: { type: Boolean, default: false },
  },

  emits: ['selected', 'update:modelValue'],

  setup(props, { emit }) {
    const activeTab = ref(props.modelValue);

    function isActiveTab(tab: Tab): boolean {
      return activeTab.value === tab.value;
    }

    function onClick(tab: Tab) {
      activeTab.value = tab.value;
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
        'tab-selected': isActiveTab(tab),
        'tab-unselected': !isActiveTab(tab),
      };
    }

    return {
      activeTab,
      onClick,
      containerClasses,
      stateClasses,
    };
  },
});
</script>

<style>
.bal-tab {
  @apply -mb-px mr-6 py-3 cursor-pointer;
}

.tab-selected {
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #fbaaff;

  border-bottom: 1px solid #fbaaff;
}

.tab-unselected {
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: rgba(245, 225, 255, 0.7);
}

.bal-tab:last-child {
  @apply mr-0;
}

.bal-tab-container {
  @apply flex;
}
</style>
