<template>
  <div>
    <div class="items-center" :class="['bal-tab-container', containerClasses]">
      <div v-for="(tab, i) in tabs" :key="i" :class="['bal-tab', stateClasses(tab)]" class="flex-1 text-center" @click="onClick(tab)">
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
  name: 'BalTabsSwitch',

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
.bal-tab-container {
  background: #292043;
  border-radius: 22px;
  overflow: hidden;
}
.bal-tab {
  @apply -mb-px mr-6 cursor-pointer py-3 px-3;
}

.tab-selected {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #fdfdfd;
  background: #41365e;
  border-radius: 22px;
  overflow: hidden;
}

.tab-unselected {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #bdb2dd;
}

.bal-tab:last-child {
  @apply mr-0;
}

.bal-tab-container {
  @apply flex;
}
</style>
