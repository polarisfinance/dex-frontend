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
export default {
  name: 'HelloWorld',
  data() {
    return {
      picture: require('./arrowup.svg'),
      hoveredPicture: require('./arrowup.svg'),
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
