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
import arrowUp from './arrowup.svg';
export default {
  name: 'HelloWorld',
  data() {
    return {
      picture: arrowUp,
      hoveredPicture: arrowUp,
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
