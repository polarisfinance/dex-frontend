<template>
  <img :src="pictureHover" @mouseover="hover = true" @mouseleave="hover = false" class="mr-2" />
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      picture: require('./DiscordIcon.svg'),
      hoveredPicture: require('./HoveredDiscordIcon.svg'),
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
