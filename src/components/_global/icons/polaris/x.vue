<script lang="ts">
import { ref } from 'vue'

export default defineComponent({
  emits: [ ],
  setup(props, { emit }) {

    const hover = ref(false);

    const pictureHover = computed(
      () => {
        if (hover.value == false) {
            return new URL(`./x.svg`, import.meta.url).href;
          } else {
            return new URL(`./xHover.svg`, import.meta.url).href;;
          }
      }
    );

    return {
      pictureHover,
      hover,
    };
  },
});
</script>




<template>
  <img
    :src="pictureHover"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    width="12"
    height="12"
  />
</template>



