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
export default {
  name: 'HelloWorld',
  data() {
    return {
      picture: require('./arrowdownswap.svg'),
      hoveredPicture: require('./arrowdownswap.svg'),
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
