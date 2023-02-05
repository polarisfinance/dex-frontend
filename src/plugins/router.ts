import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import { isGoerli } from '@/composables/useNetwork';

const ClaimPage = () =>
  import(/* webpackChunkName: "ClaimPage" */ '@/pages/claim.vue');
const CookiesPolicyPage = () =>
  import(
    /* webpackChunkName: "CookiesPolicyPage" */ '@/pages/cookies-policy.vue'
  );
const GetVeBalPage = () =>
  import(/* webpackChunkName: "GetVeBalPage" */ '@/pages/get-vebal.vue');
const HomePage = () =>
  import(/* webpackChunkName: "HomePage" */ '@/pages/index.vue');
const PoolPage = () =>
  import(/* webpackChunkName: "PoolPage" */ '@/pages/pool/_id.vue');
const CreatePoolPage = () =>
  import(/* webpackChunkName: "CreatePoolPage" */ '@/pages/pool/create.vue');
const PoolInvestPage = () =>
  import(/* webpackChunkName: "PoolInvestPage" */ '@/pages/pool/invest.vue');
const MigratePoolPage = () =>
  import(/* webpackChunkName: "MigratePoolPage" */ '@/pages/pool/migrate.vue');
const PoolWithdrawPage = () =>
  import(
    /* webpackChunkName: "PoolWithdrawPage" */ '@/pages/pool/withdraw.vue'
  );
const PrivacyPolicyPage = () =>
  import(
    /* webpackChunkName: "PrivacyPolicyPage" */ '@/pages/privacy-policy.vue'
  );
const TermsOfUsePage = () =>
  import(/* webpackChunkName: "TermsOfUsePage" */ '@/pages/terms-of-use.vue');
const TradePage = () =>
  import(/* webpackChunkName: "TradePage" */ '@/pages/trade.vue');
const UnlockVeBalPage = () =>
  import(/* webpackChunkName: "UnlockVeBalPage" */ '@/pages/unlock-vebal.vue');
const VeBalPage = () =>
  import(/* webpackChunkName: "VeBalPage" */ '@/pages/vebal.vue');
const FaucetPage = () =>
  import(/* webpackChunkName: "FaucetPage" */ '@/pages/faucet.vue');

const PortfolioPage = () =>
  import(/* webpackChunkName: "PortfolioPage" */ '@/pages/portfolio.vue');
const SingleStakePage = () =>
  import(/* webpackChunkName: "SingleStakePage" */ '@/pages/singlestake.vue');
const SunrisesPage = () =>
  import(/* webpackChunkName: "SunrisesPage" */ '@/pages/sunrise/sunrise.vue');
const SunrisePage = () =>
  import(/* webpackChunkName: "SunrisePage" */ '@/pages/sunrise/_id.vue');
const BondsPage = () =>
  import(/* webpackChunkName: "BondPage" */ '@/pages/bond/bond.vue');
const BondPage = () =>
  import(/* webpackChunkName: "BondPageID" */ '@/pages/bond/_id.vue');
const VexPolarPage = () =>
  import(/* webpackChunkName: "VexPolarPage" */ '@/pages/VexPolar.vue');
const AirdropPage = () =>
  import(/* webpackChunkName: "VexPolarPage" */ '@/pages/airdrop.vue');
const PoolAboutPage = () =>
  import(/* webpackChunkName: "VexPolarPage" */ '@/pages/pool/about.vue');

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string;
    bgColors?: {
      dark: string;
      light: string;
    };
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/singlestake/:id',
    name: 'singlestake',
    component: SingleStakePage,
  },
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/trade/:assetIn?/:assetOut?',
    name: 'trade',
    component: TradePage,
  },
  {
    path: '/swap/:assetIn?/:assetOut?',
    redirect: to => {
      return `/trade${to.path.split('/swap')[1]}`;
    },
  },
  {
    path: '/pool/create/:tx?',
    name: 'create-pool',
    component: CreatePoolPage,
    meta: { layout: 'FocusedLayout' },
  },
  {
    path: '/pool/:id',
    name: 'pool',
    component: PoolPage,
  },
  {
    path: '/pool/:id/invest',
    name: 'invest',
    component: PoolInvestPage,
    // meta: { layout: 'SingleCardLayout' },
  },
  {
    path: '/pool/:id/about',
    name: 'about',
    component: PoolAboutPage,
    // meta: { layout: 'SingleCardLayout' },
  },
  {
    path: '/sunrise',
    name: 'sunrises',
    component: SunrisesPage,
  },
  {
    path: '/bond',
    name: 'bonds',
    component: BondsPage,
  },
  {
    path: '/bond/:id',
    name: 'bond',
    component: BondPage,
  },
  {
    path: '/sunrise/:id',
    name: 'sunrise',
    component: SunrisePage,
  },
  {
    path: '/pool/:id/withdraw',
    name: 'withdraw',
    component: PoolWithdrawPage,
    meta: { layout: 'PoolTransferLayout' },
  },
  {
    path: '/pool/migrate/:from/:to',
    name: 'migrate-pool',
    component: MigratePoolPage,
    meta: { layout: 'FocusedLayout' },
  },
  {
    path: '/terms-of-use',
    name: 'terms-of-use',
    component: TermsOfUsePage,
    meta: { layout: 'ContentLayout' },
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: PrivacyPolicyPage,
    meta: { layout: 'ContentLayout' },
  },
  {
    path: '/cookies-policy',
    name: 'cookies-policy',
    component: CookiesPolicyPage,
    meta: { layout: 'ContentLayout' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
  {
    path: '/vebal',
    name: 'vebal',
    component: VeBalPage,
  },
  {
    path: '/get-vebal',
    name: 'get-vebal',
    component: GetVeBalPage,
    meta: { layout: 'FocusedLayout' },
  },
  {
    path: '/unlock',
    name: 'unlock',
    component: UnlockVeBalPage,
    meta: { layout: 'FocusedLayout' },
  },
  {
    path: '/claim',
    name: 'claim',
    component: ClaimPage,
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: PortfolioPage,
  },
  {
    path: '/vexpolar',
    name: 'vexpolar',
    component: VexPolarPage,
  },
  {
    path: '/airdrop',
    name: 'airdrop',
    component: AirdropPage,
  },
];

/**
 * TESTNET ONLY ROUTES
 */
if (isGoerli.value) {
  routes.push({
    path: '/faucet',
    name: 'faucet',
    component: FaucetPage,
  });
}

/**
 * DEV/STAGING ONLY ROUTES
 */
// if (
//   ['development', 'staging'].includes(process.env.VUE_APP_ENV || 'development')
// ) {
//   routes.push();
// }

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      console.log(to.name);
      if (to.name === 'home') {
        if (from.hash) {
          return { el: to.hash, behavior: 'smooth', top: 160 };
        }
        return { el: to.hash, behavior: 'smooth', top: 200 };
      } else {
        return { el: to.hash, behavior: 'smooth', top: 90 };
      }
    }
    return { top: 0 };
  },
});

export default router;
