<template>
  <div class="notif-container relative w-64 overflow-hidden rounded p-3 text-sm">
    <div class="group justify-between">
      <BalLink v-if="notification.transactionMetadata" :href="notification.transactionMetadata.explorerLink" external noStyle>
        <div class="mb-1 flex items-center font-semibold">
          <span class="title">{{ notification.title }}</span>
          <BalIcon name="arrow-up-right" size="sm" class="ml-1 text-gray-400 transition-colors group-hover:text-pink-500 dark:text-gray-600" />
        </div>
        <div class="message mb-[20px]">
          {{ notification.message }}
        </div>
      </BalLink>
      <div v-else>
        <div class="title mb-1 font-semibold">
          {{ notification.title }}
        </div>
        <div class="message mb-[20px]">
          {{ notification.message }}
        </div>
      </div>
      <BalCloseIcon class="absolute top-3 right-2 flex-shrink-0 cursor-pointer text-black dark:text-white" @click="closeNotification()" />
    </div>
    <div :class="progressClasses" :style="{ width: `${(progress * 100).toFixed(0)}%` }" />
  </div>
</template>

<script lang="ts">
import { TransitionPresets, useTransition } from '@vueuse/core';
import { computed, defineComponent, onMounted, onUnmounted, PropType, ref } from 'vue';

import useNotifications, { Notification } from '@/composables/useNotifications';

export default defineComponent({
  name: 'Notification',

  props: {
    notification: {
      type: Object as PropType<Notification>,
      required: true,
    },
  },

  setup(props) {
    // COMPOSABLES
    const totalProgress = ref(1);

    const progress = useTransition(totalProgress, {
      duration: props.notification.autoCloseAfterMs,
      transition: TransitionPresets.linear,
    });

    let notificationTimeout: ReturnType<typeof setTimeout>;

    const { notifications, removeNotification } = useNotifications();

    // METHODS
    function closeNotification() {
      removeNotification(props.notification.id);
    }

    onMounted(() => {
      totalProgress.value = 0;

      if (props.notification.autoCloseAfterMs) {
        notificationTimeout = setTimeout(() => {
          closeNotification();
        }, props.notification.autoCloseAfterMs);
      }
    });

    onUnmounted(() => {
      if (notificationTimeout != null) {
        clearTimeout(notificationTimeout);
      }
    });

    // COMPUTED
    const progressClasses = computed(() => {
      let bgClasses = 'bg-orange-600 dark:bg-orange-500';

      if (props.notification.type === 'success') {
        bgClasses = 'bg-green-500 dark:bg-green-500';
      } else if (props.notification.type === 'error') {
        bgClasses = 'bg-red-500 dark:bg-red-500';
      }

      return `
          progress-bar absolute bottom-[12px] left-0 opacity-80 w-0 transition duration-300 ease-linear h-1 ${bgClasses}
        `;
    });

    return {
      // methods
      closeNotification,

      // computed
      notifications,
      progressClasses,
      progress,
    };
  },
});
</script>
<style scoped>
.notif-container {
  background: #292043;
  border-radius: 16px;
}
.title {
  @apply lowercase;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #fdfdfd;
}

.title::first-letter {
  @apply uppercase;
}

.message {
  @apply overflow-hidden;
  color: #bdb2dd;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.progress-bar {
  transition: width 0.3s;
}
</style>
