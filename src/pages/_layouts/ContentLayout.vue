<script setup lang="ts">
import Footer from '@/components/footer/Footer.vue';
import AppNav from '@/components/navs/AppNav/AppNav.vue';
</script>

<template>
  <AppNav />
  <section class="dark:bg-gray-900 lg:py-8">
    <div class="content-container">
      <router-view />
    </div>
  </section>
  <Footer />
</template>

<style scoped>
.content-container {
  @apply mx-auto w-full max-w-4xl bg-white px-4 py-8 dark:bg-gray-900 md:p-8 lg:p-12;

  min-height: calc(100vh - 140px);
}

.content-container :deep(h1) {
  @apply pb-6;
}

.content-container :deep(h2),
.content-container :deep(h3),
.content-container :deep(p),
.content-container :deep(ul),
.content-container :deep(ol),
.content-container :deep(em) {
  @apply pb-3;
}

.content-container :deep(.subsection) {
  @apply mb-8;
}

.content-container :deep(h1),
.content-container :deep(h2),
.content-container :deep(h3) {
  @apply font-body tracking-tight;

  font-variation-settings: 'wght' 700;
}

.content-container :deep(h3) {
  @apply font-body tracking-tight;

  font-variation-settings: 'wght' 600;
}

.content-container :deep(li) {
  @apply ml-8 list-disc pb-2;
}

.content-container :deep(ol > li) {
  @apply list-decimal;
}

.content-container :deep(em) {
  font-style: italic;
  font-variation-settings: 'ital' 1;
  font-synthesis: none;
}

.content-container :deep(em.font-medium) {
  font-variation-settings: 'ital' 1, 'wght' 500;
}

.content-container :deep(em.font-semibold) {
  font-variation-settings: 'ital' 1, 'wght' 600;
}

.content-container :deep(table),
.content-container :deep(th),
.content-container :deep(td) {
  @apply border border-gray-500 p-4 text-left align-top;
}

.content-container :deep(table) {
  @apply mt-4 mb-8;
}
</style>
