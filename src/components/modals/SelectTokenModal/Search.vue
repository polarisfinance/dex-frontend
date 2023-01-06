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
  background: #41365E;
  box-shadow: inset 0px 0px 1px #6f4773;
  border-radius: 24px;

  padding-left: 16px;
  padding-top: 12px;
  padding-bottom: 14px;
}

.search::placeholder {
  color: #A99BC6;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
}
</style>
