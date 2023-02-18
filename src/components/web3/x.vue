<template>
  <img :src="pictureHover" @mouseover="hover = true" @mouseleave="hover = false" width="12" height="12" />
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      picture: require('./x.svg'),
      // xHover.svg is bigger x.svg
      hoveredPicture: require('./x.svg'),
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
