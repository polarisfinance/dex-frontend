<template>
  <div :class="['app-nav-alert', classes]" @click="handleClick">
    <div class="fade-in-slow flex flex-1 md:justify-center">
      <BalIcon v-if="iconName" :name="iconName" class="mr-3" />
      <div>
        <p class="alert-label">
          {{ alert.label }}
        </p>
        <BalBtn v-if="alert.action && alert.actionLabel" class="cursor-pointer" color="white" size="xs" :label="alert.actionLabel" @click="alert.action" />
      </div>
    </div>

    <div v-if="!alert.persistent" class="flex items-start">
      <BalIcon name="x" class="fade-in-slow mt-0.5 cursor-pointer" @click.stop="handleClose" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import useAlerts, { Alert, AlertType } from '@/composables/useAlerts';

export default defineComponent({
  name: 'NavAlert',

  props: {
    alert: { type: Object as PropType<Alert>, required: true },
  },

  setup(props) {
    const { removeAlert } = useAlerts();

    const colorClass = computed(() => {
      switch (props.alert.type) {
        case AlertType.ERROR:
          return 'bg-red-500 text-white';
        case AlertType.FEATURE:
          return 'bg-orange-300 text-black';
        default:
          return 'bg-black text-white';
      }
    });

    const iconName = computed(() => {
      switch (props.alert.type) {
        case AlertType.ERROR:
          return 'alert-triangle';
        default:
          return null;
      }
    });

    const classes = computed(() => {
      return {
        [colorClass.value]: true,
        'cursor-pointer': props.alert.actionOnClick,
      };
    });

    function handleClose() {
      removeAlert(props.alert.id);
    }

    function handleClick() {
      if (props.alert.actionOnClick && props.alert.action) {
        props.alert.action();
      }
    }

    return { classes, iconName, handleClose, handleClick };
  },
});
</script>

<style scoped>
.app-nav-alert {
  @apply flex content-start justify-between py-2 px-4 xs:py-4;
  background: linear-gradient(92.92deg, #c004fe 4.85%, #7e02f5 95.15%);
  min-height: 54px;
}

.alert-label {
  @apply inline pb-1 pr-4 font-medium md:inline;
}
</style>
