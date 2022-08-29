<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

import { EXTERNAL_LINKS } from '@/constants/links';

export default defineComponent({
  setup() {
    const { t } = useI18n();
    return {
      EXTERNAL_LINKS,
      t,
    };
  },
});
</script>

<template>
  <div class="featured-protocols">
    <div class="mb-[20px]">
      <h3 class="medium-title">
        {{ $t('What are we working on...') }}
      </h3>
      <h3 class="medium-subtitle">Medium articles</h3>
    </div>
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12 xs:col-span-6 lg:col-span-3 card">
        <div class="hover:shadow-xl transition-shadow">
          <img src="/images/banners/element.jpg" />
        </div>
        <div class="mx-[16px] mb-[16px]">
          <div class="mt-[16px]">Element Finance</div>
          <p class="my-[12px]">
            {{ $t('featuredProtocols.Element') }}
          </p>
          <a target="_blank" :href="EXTERNAL_LINKS.Element.Home"
            ><div class="flex items-center">
              <div class="mr-[12px] learn-more-text">Learn more</div>
              <img src="./learn-more.svg" /></div
          ></a>
        </div>
      </div>
      <!-- <div class="col-span-12 xs:col-span-6 lg:col-span-3">
        <BalCard
          title="Element Finance"
          imgSrc="/images/banners/element.jpg"
          class="hover:shadow-xl transition-shadow"
          hFull
          growContent
        >
          <p>
            {{ $t('featuredProtocols.Element') }}
          </p>
          <template #footer>
            <BalLink :href="EXTERNAL_LINKS.Element.Home" external>
              <span>{{ $t('learnMore') }}</span>
              <BalIcon
                name="arrow-up-right"
                size="sm"
                class="relative top-0.5 ml-0.5"
              />
            </BalLink>
          </template>
        </BalCard>
      </div>
      <div class="col-span-12 xs:col-span-6 lg:col-span-3">
        <BalCard
          title="Copper Launch"
          imgSrc="/images/banners/copper.png"
          class="hover:shadow-xl transition-shadow"
          hFull
          growContent
        >
          <p>{{ $t('featuredProtocols.Copper') }}</p>
          <template #footer>
            <BalLink :href="EXTERNAL_LINKS.Copper.Home" external>
              <span>{{ $t('learnMore') }}</span>
              <BalIcon
                name="arrow-up-right"
                size="sm"
                class="relative top-0.5 ml-0.5"
              />
            </BalLink>
          </template>
        </BalCard>
      </div>
      <div class="col-span-12 xs:col-span-6 lg:col-span-3">
        <BalCard
          title="Tracer DAO"
          imgSrc="/images/banners/tracer.jpg"
          class="hover:shadow-xl transition-shadow"
          hFull
          growContent
        >
          <div>
            <p>{{ $t('featuredProtocols.Tracer') }}</p>
          </div>
          <template #footer>
            <BalLink :href="EXTERNAL_LINKS.Tracer.Home" external>
              <span>{{ $t('learnMore') }}</span>
              <BalIcon
                name="arrow-up-right"
                size="sm"
                class="relative top-0.5 ml-0.5"
              />
            </BalLink>
          </template>
        </BalCard>
      </div>
      <div class="col-span-12 xs:col-span-6 lg:col-span-3">
        <BalCard
          title="Sense Finance"
          imgSrc="/images/banners/sense.png"
          class="hover:shadow-xl transition-shadow"
          hFull
          growContent
        >
          <div>
            <p>{{ $t('featuredProtocols.Sense') }}</p>
          </div>
          <template #footer>
            <BalLink :href="EXTERNAL_LINKS.Sense.Home" external>
              <span>{{ $t('learnMore') }}</span>
              <BalIcon
                name="arrow-up-right"
                size="sm"
                class="relative top-0.5 ml-0.5"
              />
            </BalLink>
          </template>
        </BalCard> -->
    </div>
  </div>
</template>
<style scoped>
:deep(.card-container) {
  justify-content: space-between;
  height: 100%;
}

.featured-protocols :deep(.feature) {
  height: 8rem;
}

.medium-title {
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;

  color: #fdfdfd;
}

.medium-subtitle {
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;

  color: rgba(245, 225, 255, 0.7);
}

.card {
  background: #231928;
  border-radius: 24px;
}

img {
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

.learn-more-text {
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;

  color: #be95c0;
}
</style>
