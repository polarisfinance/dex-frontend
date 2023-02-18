<template>
  <div>
    <div :class="['bal-tab-container', containerClasses]">
      <div v-for="(tab, i) in tabs" :key="i" :class="['bal-tab', stateClasses(tab)]" @click="onClick(tab)">
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

<style scoped>
.bal-tab {
  @apply -mb-px mr-6 cursor-pointer py-3;
}

.tab-selected {
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;

  color: #fdfdfd;

  border-bottom: 1px solid #fdfdfd;
}

.tab-unselected {
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;

  color: #bdb2dd;
}

.bal-tab:last-child {
  @apply mr-0;
}

.bal-tab-container {
  @apply flex;
}
</style>
