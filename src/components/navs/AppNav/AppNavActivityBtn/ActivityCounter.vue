<template>
  <span class="relative text-orange-500">
    <span
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-sm"
    >
      {{ count }}
    </span>
    <SpinnerIcon class="h-6 w-6 animate-spin" />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ActivityCounter',

  props: {
    count: {
      type: Number,
      required: true,
    },
  },
});
</script>
