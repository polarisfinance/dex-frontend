<template>
  <img
    :src="pictureHover"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    width="6"
    height="6"
  />
</template>

<script>
import arrowDown from './arrowdown.svg';
export default {
  name: 'HelloWorld',
  data() {
    return {
      picture: arrowDown,
      hoveredPicture: arrowDown,
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
