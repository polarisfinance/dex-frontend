<template>
  <div class="flex items-center">
    <input
      ref="searchInput"
      :value="modelValue"
      :placeholder="placeholder"
      type="text"
      autocorrect="off"
      autocapitalize="none"
      class="search w-full flex-auto"
      @input="handleInput"
    />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
  },

  emits: ['update:modelValue'],

  mounted() {
    this.$refs.searchInput.focus();
  },

  methods: {
    handleInput(e) {
      const input = e.target.value;
      this.$emit('update:modelValue', input);
    },
  },
};
</script>

<style scoped>
.search {
  background: rgba(46, 36, 51, 0.5);
  box-shadow: inset 0px 0px 1px #6f4773;
  border-radius: 12px;

  padding-left: 8px;
  padding-top: 12px;
  padding-bottom: 11px;
}

.search::placeholder {
  color: #be95c0;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
}
</style>
