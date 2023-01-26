<template>
  <div class="flex items-center relative">
    <span class="absolute inset-y-0 right-[30px] flex items-center pl-2">
        <span class="p-1 focus:outline-none focus:shadow-outline">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.66634 14C11.1641 14 13.9997 11.1645 13.9997 7.66668C13.9997 4.16887 11.1641 1.33334 7.66634 1.33334C4.16854 1.33334 1.33301 4.16887 1.33301 7.66668C1.33301 11.1645 4.16854 14 7.66634 14Z" stroke="#A99BC6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14.6663 14.6667L13.333 13.3333" stroke="#A99BC6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </span>
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
  line-height: 16px;
  padding-left: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
}

.search::placeholder {
  color: #A99BC6;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
}
</style>
