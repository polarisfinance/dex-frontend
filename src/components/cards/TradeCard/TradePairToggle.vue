<template>
  <div class="toggle-btn" @click="toggle">
    <img
      :src="pictureHover"
      @mouseover="hover = true"
      @mouseleave="hover = false"
      width="45"
      height="45"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
      picture: require('./Swap.svg'),
      hoveredPicture: require('./HoveredSwap.svg'),
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
