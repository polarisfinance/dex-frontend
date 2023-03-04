<template>
  <img
    :src="pictureHover"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    width="36"
    height="36"
  />
</template>

<script>
import arrowDownSwap from './arrowdownswap.svg';
export default {
  name: 'HelloWorld',
  data() {
    return {
      picture: arrowDownSwap,
      hoveredPicture: arrowDownSwap,
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
};
</script>
