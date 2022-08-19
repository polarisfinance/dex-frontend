<template>
  <div
    class="group flex justify-center items-center rounded-full shadow cursor-pointer toggle-btn"
    @click="toggle"
  >
    <div
      class="duration-300 ease-in-out"
      :class="{ 'transform rotate-180': isRotated }"
    >
      <svg
        width="46"
        height="46"
        viewBox="0 0 46 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_95_1196)">
          <path
            d="M19.364 28.4074C19.2201 28.4074 19.0877 28.3449 18.9783 28.2312L15.1555 24.4568C15.0461 24.3374 15 24.218 15 24.0873C15 23.8031 15.2073 23.5871 15.4951 23.5871C15.6275 23.5871 15.7657 23.6382 15.8579 23.7292L17.1705 24.9968L18.938 26.9181L18.8459 25.5368V18.3518C18.8459 18.0562 19.0646 17.8516 19.364 17.8516C19.6634 17.8516 19.8764 18.0562 19.8764 18.3518V25.5368L19.7901 26.9124L21.5575 24.9968L22.8644 23.7292C22.9623 23.6325 23.0947 23.5871 23.2329 23.5871C23.515 23.5871 23.728 23.8031 23.728 24.0873C23.728 24.218 23.6762 24.3431 23.5553 24.4682L19.7497 28.2312C19.6346 28.3449 19.5022 28.4074 19.364 28.4074Z"
            fill="#F5F5F5"
          />
          <path
            d="M26.636 13C26.4921 13 26.3597 13.0625 26.2502 13.1762L22.4275 16.9506C22.318 17.07 22.272 17.1894 22.272 17.3201C22.272 17.6043 22.4792 17.8203 22.7671 17.8203C22.8995 17.8203 23.0377 17.7692 23.1298 17.6782L24.4425 16.4106L26.21 14.4893L26.1178 15.8706V23.0556C26.1178 23.3512 26.3366 23.5558 26.636 23.5558C26.9353 23.5558 27.1484 23.3512 27.1484 23.0556V15.8706L27.062 14.495L28.8295 16.4106L30.1364 17.6782C30.2343 17.7749 30.3667 17.8203 30.5049 17.8203C30.787 17.8203 31 17.6043 31 17.3201C31 17.1894 30.9482 17.0643 30.8273 16.9392L27.0217 13.1762C26.9066 13.0625 26.7742 13 26.636 13Z"
            fill="#F5F5F5"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_95_1196"
            x="0"
            y="0"
            width="46"
            height="45.4074"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="7.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.317647 0 0 0 0 0.188235 0 0 0 0 0.498039 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_95_1196"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_95_1196"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  emits: ['toggle'],
  setup(_props, { emit }) {
    const isRotated = ref(false);

    function toggle(): void {
      isRotated.value = !isRotated.value;
      emit('toggle');
    }

    return {
      isRotated,
      toggle,
    };
  },
});
</script>
<style scoped>
.icon-trade-toggle {
  @apply transition-transform ease-out duration-200;
}

.toggle-btn {
  background-color: #130719;
  border: 2px solid #231928;
  width: 32px;
  height: 32px;
}

.toggle-btn:hover .icon-trade-toggle {
  transform: scale(1.2);
}
</style>
