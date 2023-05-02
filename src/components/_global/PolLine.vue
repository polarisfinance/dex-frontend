<script setup lang="ts">
type Props = {
  color?: string;
};

const props = withDefaults(defineProps<Props>(), {
});

const classes = computed(() => ({
}));
</script>

<template>
  <div class="pol-line"></div>
</template>

<style scoped>
.pol-line{
  height: 0px;
  @apply border-polaris-line;
  border-width: 0.5px;
}
</style>
