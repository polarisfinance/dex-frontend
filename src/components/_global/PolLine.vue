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
  <div class="pol-line">
  </div>
</template>

<style scoped>
.pol-line{
  height: 1px;
  background-color: rgba(151,71,255,.4);
}
</style>
