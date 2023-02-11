<template>
  <img
    :src="pictureHover"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    width="24"
    height="24"
    class=""
  />
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      picture: import('./SettingsIcon.svg'),
      hoveredPicture: import('./HoveredSettingsIcon.svg'),
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
