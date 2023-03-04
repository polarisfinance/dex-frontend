<template>
  <div class="toggle-btn cursor-pointer" @click="toggle">
    <img
      :src="pictureHover"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      width="32"
      height="32"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import swap from './Swap.svg';
import hoveredSwap from './HoveredSwap.svg';

export default defineComponent({
  emits: ['toggle'],
  setup(_props, { emit }) {
    function toggle(): void {
      emit('toggle');
    }

    return {
      toggle,
    };
  },
  data() {
    return {
      picture: swap,
      hoveredPicture: hoveredSwap,
      hover: false,
    };
  },
  computed: {
    pictureHover() {
      if (this.hover == false) {
        return this.picture;
      } else {
        return this.hoveredPicture;
      }
    },
  },
});
</script>
<style scoped>
.icon-trade-toggle {
  @apply transition-transform duration-200 ease-out;
}

.toggle-btn:hover .icon-trade-toggle {
  transform: scale(1.2);
}
</style>
