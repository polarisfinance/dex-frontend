<template>
  <div :class="`app-nav-toggle bg-gray-50 dark:bg-gray-${darkModeBg}`">
    <router-link :to="{ name: 'home' }" :class="['toggle-link rounded-l-lg px-6', { [activeClasses]: !isTradePage }]" @click="trackGoal(Goals.ClickNavInvest)">
      {{ $t('invest') }}
    </router-link>
    <router-link :to="{ name: 'trade' }" :class="['toggle-link rounded-r-lg px-6', { [activeClasses]: isTradePage }]" @click="trackGoal(Goals.ClickNavTrade)">
      {{ $t('trade') }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

import useFathom from '@/composables/useFathom';

export default defineComponent({
  name: 'AppNavToggle',

  props: {
    darkModeBg: { type: String, default: '800' },
  },

  setup() {
    const route = useRoute();
    const activeClasses = 'gradient-blue-l-to-r text-white rounded-lg';
    const isTradePage = computed(() => route.name === 'trade');
    const { trackGoal, Goals } = useFathom();

    return {
      isTradePage,
      activeClasses,
      trackGoal,
      Goals,
    };
  },
});
</script>

<style scoped>
.app-nav-toggle {
  @apply flex h-10 items-center rounded-lg shadow;

  font-variation-settings: 'wght' 600;
}

.toggle-link {
  @apply flex h-full items-center;
}
</style>
