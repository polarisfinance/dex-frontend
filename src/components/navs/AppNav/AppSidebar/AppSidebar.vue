<script lang="ts" setup>
import { ref } from 'vue';

import { useSidebar } from '@/composables/useSidebar';

import SidebarContent from './SidebarContent.vue';

/**
 * STATE
 */
const showSidebar = ref(false);
const emit = defineEmits(['close', 'ToggleMobileWallet']);

/**
 * COMPOSABLES
 */
const { setSidebarOpen } = useSidebar();

const toggleMobileWallet = () => {
  emit('ToggleMobileWallet');
};
</script>

<template>
  <Transition name="overlay" appear @after-enter="showSidebar = true">
    <div class="sidebar-overlay" @click="showSidebar = false">
      <Transition name="sidebar" @after-leave="setSidebarOpen(false)">
        <div v-if="showSidebar" class="app-sidebar pt-[60px]">
          <SidebarContent
            @close="showSidebar = false"
            @ToggleMobileWallet="toggleMobileWallet"
          />
        </div>
      </Transition>
      <!-- <div class="app-sidebar_empty" @click="showSidebar = false">
        <BalIcon
          name="x"
          size="lg"
          class="flex fixed top-4 right-2 justify-center items-center text-white cursor-pointer close-icon"
        />
      </div> -->
    </div>
  </Transition>
</template>

<style scoped>
.sidebar-overlay {
  z-index: 999999999;
  padding-top: 47px;
  padding-bottom: 47px;

  @apply fixed top-0 left-0 flex h-full w-full cursor-pointer;
  justify-content: flex-end;
  background: rgba(0, 0, 0, 0.7);
}

.app-sidebar {
  @apply h-full w-3/4 max-w-sm cursor-default overflow-y-auto text-white shadow-xl;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
  background-color: #231928;

  will-change: transform;
}

.app-sidebar_empty {
  @apply flex-grow;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.1s ease-in-out;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.25s ease-in-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.close-icon {
  @apply h-9 w-9 overflow-hidden rounded-full;

  animation: spin-quarter 0.3s ease-out both;
}

.close-icon::before {
  @apply absolute flex h-9 w-9 items-center justify-center rounded-full;

  content: '';
  z-index: -1;
  background: rgb(150 150 150 / 20%);
  backdrop-filter: blur(4px);
}
</style>
