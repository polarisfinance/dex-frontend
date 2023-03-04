<template>
  <img
    :src="pictureHover"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    width="12"
    height="12"
  />
</template>

<script>
import x from './x.svg';
import xHover from './xHover.svg';
export default {
  name: 'HelloWorld',
  data() {
    return {
      picture: x,
      // xHover.svg is bigger x.svg
      hoveredPicture: xHover,
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
