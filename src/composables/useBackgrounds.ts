/**
 * useBackgroundColor
 *
 * @description Adds ability to change page background color via route meta.
 * This composable should only be imported once at the app component level
 * because it watches dark mode and toggles the background color. We don't
 * want that happening in multiple places.
 *
 * @dev to use, set route meta.bgColors attribute in router.ts for page.
 */
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

/**
 * CONSTANTS
 */
const defaultBg = 'default';
const sunriseBg = 'sunrise';
const bondBg = 'bond';
const earnBg = 'earn';
const airdropBg = 'airdrop';
const vexpolarBg = 'vexpolar';
const portfolioBg = 'portfolio';
/**
 * STATE
 */
const backgroundImage = ref(defaultBg);

/**
 * COMPOSABLES
 */

/**
 * METHODS
 */
export function setBackgroundImage(bg: string): void {
  backgroundImage.value = bg;
}
const isSunrise = computed(() => {
  return backgroundImage.value == sunriseBg;
});

const isBond = computed(() => {
  return backgroundImage.value == bondBg;
});

const isEarn = computed(() => {
  return backgroundImage.value == earnBg;
});

const isAirdrop = computed(() => {
  return backgroundImage.value == airdropBg;
});
const isVexpolar = computed(() => {
  return backgroundImage.value == vexpolarBg;
});
const isPortfolio = computed(() => {
  return backgroundImage.value == portfolioBg;
});

/**
 * INIT
 */
setBackgroundImage(defaultBg);

export default function useBackgrounds() {
  const route = useRoute();
  watch(route, newRoute => {
    if (route.path === '/') {
      setBackgroundImage(earnBg);
    } else if (route.path.includes('/sunrise')) {
      setBackgroundImage(sunriseBg);
    } else if (route.path.includes('/bond')) {
      setBackgroundImage(bondBg);
    } else if (route.path.includes('/airdrop')) {
      setBackgroundImage(airdropBg);
    } else if (route.path.includes('/vexpolar')) {
      setBackgroundImage(vexpolarBg);
    } else if (route.path.includes('/portfolio')) {
      setBackgroundImage(portfolioBg);
    } else {
      setBackgroundImage(defaultBg);
    }
  });
  return {
    isSunrise,
    isBond,
    isEarn,
    isAirdrop,
    isVexpolar,
    isPortfolio,
  };
}
