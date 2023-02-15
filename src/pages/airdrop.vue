<script lang="ts">
import { ref } from 'vue';
import useBreakpoints from '@/composables/useBreakpoints';
import HeroConnectWalletButton from '@/components/heros/HeroConnectWalletButton.vue';

import { defineComponent } from 'vue';
import airdropbg from './airdrop_bg.svg';
import claimArrow from './claimArrow.svg';
import useAirdrop from '@/composables/PolarisFinance/useAirdrop';
import useEthers from '@/composables/useEthers';
import useTransactions from '@/composables/useTransactions';
import { TransactionResponse } from '@ethersproject/providers';
import useWeb3 from '@/services/web3/useWeb3';

// const { pendingShare, claim } = airdrop(account.value);

export default defineComponent({
  data() {
    return {
      pendingShare: '--',
      totalShares: '--',
      vested: '--',
      claimDisable: true,
    };
  },

  setup(props) {
    const { isDesktop, isMobile } = useBreakpoints();
    const { isWalletReady, isWalletConnecting } = useWeb3();

    const totalProgress = ref(1);

    const startDay: Date = new Date(1676581200 * 1000);
    const today: Date = new Date();
    const diffTime = Math.abs((startDay as any) - (today as any));
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24) - 1);
    diffDays = diffDays > 60 ? 60 : diffDays;
    const progress = diffDays / 60 > 1 ? 1 : diffDays / 60;
    const diffDaysReverse = 60 - diffDays;
    const vestedAll = (
      ((startDay > today ? 0 : diffTime) / 1000) *
      0.0385802469
    ).toFixed(0);

    const { account, getProvider } = useWeb3();

    const { addTransaction } = useTransactions();
    const { txListener } = useEthers();
    const txHandler = (tx: TransactionResponse): void => {
      addTransaction({
        id: tx.hash,
        type: 'tx',
        action: 'claim',
        summary: 'Claim airdrop',
      });
    };

    return {
      account,
      airdropbg,
      claimArrow,
      isDesktop,
      isMobile,
      isWalletReady,
      isWalletConnecting,
      totalProgress,
      progress,
      diffDays,
      diffDaysReverse,
      getProvider,
      txListener,
      vestedAll,
    };
  },
  methods: {
    async render() {
      const { getPendingShare, totalShares, getVested } = useAirdrop();
      this.vested = await getVested(this.account);
      this.pendingShare = await getPendingShare(this.account);
      this.totalShares = await totalShares(this.account);
      if (Number(this.pendingShare) > 0) {
        this.claimDisable = false;
      }
    },
    async claim() {
      const { claim } = useAirdrop();
      const tx = await claim(this.getProvider(), this.account);
      this.txListener(tx, {
        onTxConfirmed: () => {
          this.render();
        },
        onTxFailed: () => {},
      });
    },
  },
  async created() {
    await this.render();
  },
  watch: {
    async account(newAccount, oldAccount) {
      await this.render();
    },
  },
});
</script>

<template>
  <div class="pg-bg" v-if="isDesktop">
    <img :src="airdropbg" class="m-auto" />
  </div>
  <div :class="{ relative: isDesktop }">
    <div class="container mx-auto mt-[160px]">
      <div class="text-center">
        <div class="title">Airdrop for Polaris holders</div>
        <div v-if="!isWalletReady && !isWalletConnecting">
          <div class="subtitle">
            Connect your wallet and claim your airdrop!
          </div>
          <HeroConnectWalletButton class="my-10" />
        </div>
        <div v-else>
          <!-- <div class="subtitle">Claim your airdrop!</div> -->
          <div class="subtitle">Claim will soon be available!</div>

          <div :style="{ paddingBottom: '40px', paddingTop: '40px' }">
            <!-- <div class="claim-button">
              <a href="#/airdrop/#claim_airdrop"> Claim </a>
              <img :src="claimArrow" />
            </div> -->
          </div>
        </div>
      </div>
      <div class="summary mx-auto flex">
        <div class="info-token flex-none" v-if="isDesktop">
          <img class="w-[124px]" src="./xpolar.svg" />
        </div>
        <div class="total w-full pt-[24px] pl-[55px]">
          Total xPolars
          <h3>200,000</h3>
        </div>
        <div class="share w-full pt-[24px] pl-5">
          Your share
          <h3>{{ totalShares }}</h3>
        </div>
      </div>
      <div class="vesting mx-10">
        <div class="flex">
          <div class="mr-10 w-full">
            <span class="inp-label">In progress</span>
            <h2 :style="{ marginBottom: 0 }">60 Days vesting</h2>
          </div>
          <div class="w-fit flex items-end" :class="{ 'flex-wrap': isMobile }">
            <div class="basic-label w-[300px]">
              Full information about airdrop can <br />be found on our medium
            </div>
            <a
              href="https://medium.com/@PolarisFinance/polaris-dex-917e45c4869c"
              target="_blank"
              class="read-btn flex-none"
              >Read our medium</a
            >
          </div>
        </div>
        <div class="progress-bar mt-[100px] h-[2px] rounded-[24px]">
          <div
            class="progress absolute bottom-0 left-0 h-[2px] w-0 rounded-[24px] bg-styling-teal opacity-80 transition duration-300 ease-linear dark:bg-styling-teal"
            :style="{ width: `${(progress * 100).toFixed(0)}%` }"
          />
          <div
            class="progress-tracker"
            :style="{ left: `${(progress * 100).toFixed(0)}%` }"
          >
            <span>Day {{ diffDays }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-full text-left">Day 1</div>
          <div class="w-full text-right">Day 60</div>
        </div>
        <div class="w-full text-center">
          {{ vestedAll }} xPolars / 200 000 xPolars
        </div>
      </div>
      <div id="claim_airdrop" class="graphic mt-[180px] mb-[120px]">
        <svg
          width="920"
          height="257"
          viewBox="0 0 920 257"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="m-auto w-full"
        >
          <g opacity="0.3" filter="url(#filter0_iiii_542_3490)">
            <path
              d="M33.0957 256.613H5.35371C0 256.613 -1.33843 254.545 1.33843 250.408L43.5191 173.341C47.4819 166.101 47.4462 157.332 43.4247 150.124L2.43351 76.6554C-0.24335 72.5185 0.851727 70.45 5.71874 70.45H33.8257C38.4494 70.45 41.6129 72.5185 43.3164 76.6554L72.5766 138.788C72.7639 139.186 73.1641 139.44 73.6039 139.44C74.0535 139.44 74.4608 139.175 74.6425 138.763L102.086 76.6554C103.789 72.5185 106.831 70.45 111.211 70.45H138.953C144.064 70.45 145.28 72.5185 142.603 76.6554L102.912 149.737C98.9883 156.963 99.0362 165.694 103.039 172.876L146.254 250.408C148.687 254.545 147.592 256.613 142.968 256.613H114.131C109.994 256.613 107.074 254.545 105.371 250.408L74.6588 186.455C74.4661 186.053 74.0605 185.798 73.6154 185.798C73.1684 185.798 72.7613 186.056 72.5697 186.459L42.2213 250.408C40.5179 254.545 37.476 256.613 33.0957 256.613Z"
              fill="#010013"
            />
            <path
              d="M210.264 256.613H187.268C183.131 256.613 181.062 254.545 181.062 250.408V28.107C181.062 23.97 183.131 21.9016 187.268 21.9016H274.144C291.908 21.9016 305.779 26.8902 315.757 36.8676C325.734 46.6016 330.723 60.4726 330.723 78.4806V116.443C330.723 134.208 325.734 148.079 315.757 158.056C305.779 168.034 291.908 173.022 274.144 173.022H220.85C217.93 173.022 216.47 174.239 216.47 176.673V250.408C216.47 254.545 214.401 256.613 210.264 256.613ZM220.485 141.63H269.034C286.311 141.63 294.95 132.626 294.95 114.618V79.9407C294.95 61.9327 286.311 52.9288 269.034 52.9288H220.485C217.808 52.9288 216.47 54.1455 216.47 56.579V137.98C216.47 140.413 217.808 141.63 220.485 141.63Z"
              fill="#010013"
            />
            <path
              d="M455.314 256.613H423.191C405.183 256.613 391.191 251.625 381.213 241.647C371.479 231.67 366.612 217.799 366.612 200.034V127.029C366.612 109.021 371.479 95.1501 381.213 85.4161C391.191 75.4387 405.183 70.45 423.191 70.45H455.314C473.078 70.45 486.949 75.4387 496.927 85.4161C507.147 95.1501 512.258 109.021 512.258 127.029V200.034C512.258 217.799 507.147 231.67 496.927 241.647C486.949 251.625 473.078 256.613 455.314 256.613ZM428.302 225.586H450.568C468.09 225.586 476.85 216.704 476.85 198.939V128.124C476.85 110.36 468.09 101.477 450.568 101.477H428.302C419.054 101.477 412.362 103.667 408.225 108.048C404.088 112.185 402.02 118.877 402.02 128.124V198.939C402.02 208.186 404.088 215 408.225 219.381C412.362 223.518 419.054 225.586 428.302 225.586Z"
              fill="#010013"
            />
            <path
              d="M585.229 256.613H562.232C558.095 256.613 556.027 254.545 556.027 250.408V6.20543C556.027 2.06848 558.095 0 562.232 0H585.229C589.366 0 591.434 2.06848 591.434 6.20543V250.408C591.434 254.545 589.366 256.613 585.229 256.613Z"
              fill="#010013"
            />
            <path
              d="M706.563 256.613H692.327C674.319 256.613 660.326 251.625 650.349 241.647C640.615 231.67 635.748 217.799 635.748 200.034V127.029C635.748 109.021 640.615 95.1501 650.349 85.4161C660.326 75.4387 674.319 70.45 692.327 70.45H774.092C778.473 70.45 780.663 72.5185 780.663 76.6554V250.408C780.663 254.545 778.473 256.613 774.092 256.613H751.096C746.959 256.613 744.89 254.545 744.89 250.408V238.155C744.89 237.664 744.493 237.267 744.003 237.267C743.654 237.267 743.338 237.473 743.189 237.788C737.255 250.338 725.046 256.613 706.563 256.613ZM744.89 194.559V105.127C744.89 102.694 743.552 101.477 740.875 101.477H697.437C679.916 101.477 671.155 110.481 671.155 128.489V198.574C671.155 216.582 679.916 225.586 697.437 225.586H714.958C734.913 225.586 744.89 215.244 744.89 194.559Z"
              fill="#010013"
            />
            <path
              d="M855.39 256.613H832.394C828.257 256.613 826.188 254.545 826.188 250.408V76.6554C826.188 72.5185 828.257 70.45 832.394 70.45H855.39C859.527 70.45 861.596 72.5185 861.596 76.6554V89.6558C861.596 90.1366 861.986 90.5264 862.467 90.5264C862.823 90.5264 863.141 90.3091 863.281 89.9817C865.769 84.1515 870.318 79.466 876.927 75.9254C883.984 72.2751 891.771 70.45 900.289 70.45H913.795C917.932 70.45 920 72.5185 920 76.6554V95.6368C920 99.4011 918.629 101.391 915.887 101.607C914.493 101.717 913.091 101.477 911.693 101.477H891.893C871.695 101.477 861.596 112.55 861.596 134.695V250.408C861.596 254.545 859.527 256.613 855.39 256.613Z"
              fill="#010013"
            />
          </g>
          <path
            d="M295.167 117.005H285.423C281.279 117.005 278.059 115.857 275.763 113.561C273.523 111.265 272.403 108.073 272.403 103.985V76.0134C272.403 71.8694 273.523 68.6774 275.763 66.4374C278.059 64.1414 281.279 62.9934 285.423 62.9934H295.167C299.255 62.9934 302.447 64.1414 304.743 66.4374C307.039 68.6774 308.187 71.8694 308.187 76.0134V80.0454C308.187 81.0534 307.683 81.5574 306.675 81.5574H301.383C300.431 81.5574 299.955 81.0534 299.955 80.0454V76.3494C299.955 72.2054 297.939 70.1334 293.907 70.1334H286.599C282.567 70.1334 280.551 72.2054 280.551 76.3494V103.649C280.551 107.793 282.567 109.865 286.599 109.865H293.907C297.939 109.865 299.955 107.793 299.955 103.649V99.9534C299.955 98.9454 300.431 98.4414 301.383 98.4414H306.675C307.683 98.4414 308.187 98.9454 308.187 99.9534V103.985C308.187 108.073 307.039 111.265 304.743 113.561C302.447 115.857 299.255 117.005 295.167 117.005ZM324.907 117.005H319.615C318.663 117.005 318.187 116.529 318.187 115.577V59.3814C318.187 58.4294 318.663 57.9534 319.615 57.9534H324.907C325.859 57.9534 326.335 58.4294 326.335 59.3814V115.577C326.335 116.529 325.859 117.005 324.907 117.005ZM352.828 117.005H349.552C345.408 117.005 342.188 115.857 339.892 113.561C337.652 111.265 336.532 108.073 336.532 103.985V87.1854C336.532 83.0414 337.652 79.8494 339.892 77.6094C342.188 75.3134 345.408 74.1654 349.552 74.1654H368.368C369.376 74.1654 369.88 74.6414 369.88 75.5934V115.577C369.88 116.529 369.376 117.005 368.368 117.005H363.076C362.124 117.005 361.648 116.529 361.648 115.577V112.553H361.312C359.968 115.521 357.14 117.005 352.828 117.005ZM361.648 102.725V82.1454C361.648 81.5854 361.34 81.3054 360.724 81.3054H350.728C346.696 81.3054 344.68 83.3774 344.68 87.5214V103.649C344.68 107.793 346.696 109.865 350.728 109.865H354.76C359.352 109.865 361.648 107.485 361.648 102.725ZM380.776 67.0254V59.3814C380.776 58.4854 381.224 58.0374 382.12 58.0374H387.58C388.476 58.0374 388.924 58.4854 388.924 59.3814V67.0254C388.924 67.9774 388.476 68.4534 387.58 68.4534H382.12C381.224 68.4534 380.776 67.9774 380.776 67.0254ZM380.776 115.577V75.5934C380.776 74.6414 381.224 74.1654 382.12 74.1654H387.496C388.448 74.1654 388.924 74.6414 388.924 75.5934V115.577C388.924 116.137 388.812 116.529 388.588 116.753C388.42 116.921 388.084 117.005 387.58 117.005H382.204C381.252 117.005 380.776 116.529 380.776 115.577ZM406.682 117.005H401.39C400.438 117.005 399.962 116.529 399.962 115.577V75.5934C399.962 74.6414 400.438 74.1654 401.39 74.1654H406.682C407.634 74.1654 408.11 74.6414 408.11 75.5934V78.6174H408.446C410.07 75.6494 413.038 74.1654 417.35 74.1654H420.122C424.994 74.1654 428.466 76.0134 430.538 79.7094C431.434 77.9174 432.806 76.5454 434.654 75.5934C436.502 74.6414 438.49 74.1654 440.618 74.1654H443.306C447.394 74.1654 450.502 75.3134 452.63 77.6094C454.814 79.8494 455.906 83.0414 455.906 87.1854V115.577C455.906 116.529 455.43 117.005 454.478 117.005H449.102C448.15 117.005 447.674 116.529 447.674 115.577V87.5214C447.674 83.3774 445.658 81.3054 441.626 81.3054H439.19C434.542 81.3054 432.218 83.7414 432.218 88.6134V115.577C432.218 116.529 431.714 117.005 430.706 117.005H425.414C424.462 117.005 423.986 116.529 423.986 115.577V87.5214C423.986 83.3774 421.97 81.3054 417.938 81.3054H414.998C410.406 81.3054 408.11 83.6854 408.11 88.4454V115.577C408.11 116.529 407.634 117.005 406.682 117.005ZM491.135 130.613H486.683C485.731 130.613 485.255 130.137 485.255 129.185V124.901C485.255 123.893 485.731 123.389 486.683 123.389H488.615C492.031 123.389 494.383 122.717 495.671 121.373C497.015 120.029 498.135 117.817 499.031 114.737H495.671C494.831 114.737 494.243 114.261 493.907 113.309L482.735 75.5934C482.511 74.6414 482.875 74.1654 483.827 74.1654H489.455C490.351 74.1654 490.911 74.6414 491.135 75.5934L500.291 108.521H500.627L509.783 75.5934C509.951 74.6414 510.511 74.1654 511.463 74.1654H516.839C517.903 74.1654 518.351 74.6694 518.183 75.6774L506.675 116.081C505.387 120.785 503.567 124.369 501.215 126.833C498.863 129.353 495.503 130.613 491.135 130.613ZM544.878 117.005H537.486C533.342 117.005 530.122 115.857 527.826 113.561C525.586 111.265 524.466 108.073 524.466 103.985V87.1854C524.466 83.0414 525.586 79.8494 527.826 77.6094C530.122 75.3134 533.342 74.1654 537.486 74.1654H544.878C548.966 74.1654 552.158 75.3134 554.454 77.6094C556.806 79.8494 557.982 83.0414 557.982 87.1854V103.985C557.982 108.073 556.806 111.265 554.454 113.561C552.158 115.857 548.966 117.005 544.878 117.005ZM538.662 109.865H543.786C547.818 109.865 549.834 107.821 549.834 103.733V87.4374C549.834 83.3494 547.818 81.3054 543.786 81.3054H538.662C536.534 81.3054 534.994 81.8094 534.042 82.8174C533.09 83.7694 532.614 85.3094 532.614 87.4374V103.733C532.614 105.861 533.09 107.429 534.042 108.437C534.994 109.389 536.534 109.865 538.662 109.865ZM583.51 117.005H579.73C575.698 117.005 572.59 115.885 570.406 113.645C568.278 111.349 567.214 108.129 567.214 103.985V75.5934C567.214 74.6414 567.69 74.1654 568.642 74.1654H573.934C574.886 74.1654 575.362 74.6414 575.362 75.5934V103.649C575.362 107.793 577.378 109.865 581.41 109.865H585.442C590.034 109.865 592.33 107.485 592.33 102.725V75.5934C592.33 74.6414 592.806 74.1654 593.758 74.1654H599.05C600.058 74.1654 600.562 74.6414 600.562 75.5934V115.577C600.562 116.529 600.058 117.005 599.05 117.005H593.758C592.806 117.005 592.33 116.529 592.33 115.577V112.553H591.994C590.65 115.521 587.822 117.005 583.51 117.005ZM617.748 117.005H612.456C611.504 117.005 611.028 116.529 611.028 115.577V75.5934C611.028 74.6414 611.504 74.1654 612.456 74.1654H617.748C618.7 74.1654 619.176 74.6414 619.176 75.5934V78.7854H619.512C620.072 77.3854 621.136 76.2654 622.704 75.4254C624.328 74.5854 626.12 74.1654 628.08 74.1654H631.188C632.14 74.1654 632.616 74.6414 632.616 75.5934V79.9614C632.616 81.0254 632.14 81.4734 631.188 81.3054H626.148C621.5 81.3054 619.176 83.8534 619.176 88.9494V115.577C619.176 116.529 618.7 117.005 617.748 117.005Z"
            fill="#FDFDFD"
          />
          <path
            d="M344.234 221.005H337.85C336.618 221.005 336.31 220.529 336.926 219.577L348.098 199.165L337.178 179.593C336.562 178.641 336.814 178.165 337.934 178.165H344.402C345.466 178.165 346.194 178.641 346.586 179.593L353.39 194.041H353.726L360.11 179.593C360.502 178.641 361.202 178.165 362.21 178.165H368.594C369.77 178.165 370.05 178.641 369.434 179.593L358.85 199.081L370.274 219.577C370.834 220.529 370.582 221.005 369.518 221.005H362.882C361.93 221.005 361.258 220.529 360.866 219.577L353.726 204.709H353.39L346.334 219.577C345.942 220.529 345.242 221.005 344.234 221.005ZM385.004 221.005H379.712C378.76 221.005 378.284 220.529 378.284 219.577V168.421C378.284 167.469 378.76 166.993 379.712 166.993H399.704C403.792 166.993 406.984 168.141 409.28 170.437C411.576 172.677 412.724 175.869 412.724 180.013V188.749C412.724 192.837 411.576 196.029 409.28 198.325C406.984 200.621 403.792 201.769 399.704 201.769H387.44C386.768 201.769 386.432 202.049 386.432 202.609V219.577C386.432 220.529 385.956 221.005 385.004 221.005ZM387.356 194.545H398.528C402.504 194.545 404.492 192.473 404.492 188.329V180.349C404.492 176.205 402.504 174.133 398.528 174.133H387.356C386.74 174.133 386.432 174.413 386.432 174.973V193.705C386.432 194.265 386.74 194.545 387.356 194.545ZM441.395 221.005H434.003C429.859 221.005 426.639 219.857 424.343 217.561C422.103 215.265 420.983 212.073 420.983 207.985V191.185C420.983 187.041 422.103 183.849 424.343 181.609C426.639 179.313 429.859 178.165 434.003 178.165H441.395C445.483 178.165 448.675 179.313 450.971 181.609C453.323 183.849 454.499 187.041 454.499 191.185V207.985C454.499 212.073 453.323 215.265 450.971 217.561C448.675 219.857 445.483 221.005 441.395 221.005ZM435.179 213.865H440.303C444.335 213.865 446.351 211.821 446.351 207.733V191.437C446.351 187.349 444.335 185.305 440.303 185.305H435.179C433.051 185.305 431.511 185.809 430.559 186.817C429.607 187.769 429.131 189.309 429.131 191.437V207.733C429.131 209.861 429.607 211.429 430.559 212.437C431.511 213.389 433.051 213.865 435.179 213.865ZM471.291 221.005H465.999C465.047 221.005 464.571 220.529 464.571 219.577V163.381C464.571 162.429 465.047 161.953 465.999 161.953H471.291C472.243 161.953 472.719 162.429 472.719 163.381V219.577C472.719 220.529 472.243 221.005 471.291 221.005ZM499.213 221.005H495.937C491.793 221.005 488.573 219.857 486.277 217.561C484.037 215.265 482.917 212.073 482.917 207.985V191.185C482.917 187.041 484.037 183.849 486.277 181.609C488.573 179.313 491.793 178.165 495.937 178.165H514.753C515.761 178.165 516.265 178.641 516.265 179.593V219.577C516.265 220.529 515.761 221.005 514.753 221.005H509.461C508.509 221.005 508.033 220.529 508.033 219.577V216.553H507.697C506.353 219.521 503.525 221.005 499.213 221.005ZM508.033 206.725V186.145C508.033 185.585 507.725 185.305 507.109 185.305H497.113C493.081 185.305 491.065 187.377 491.065 191.521V207.649C491.065 211.793 493.081 213.865 497.113 213.865H501.145C505.737 213.865 508.033 211.485 508.033 206.725ZM533.461 221.005H528.169C527.217 221.005 526.741 220.529 526.741 219.577V179.593C526.741 178.641 527.217 178.165 528.169 178.165H533.461C534.413 178.165 534.889 178.641 534.889 179.593V182.785H535.225C535.785 181.385 536.849 180.265 538.417 179.425C540.041 178.585 541.833 178.165 543.793 178.165H546.901C547.853 178.165 548.329 178.641 548.329 179.593V183.961C548.329 185.025 547.853 185.473 546.901 185.305H541.861C537.213 185.305 534.889 187.853 534.889 192.949V219.577C534.889 220.529 534.413 221.005 533.461 221.005ZM570.166 221.005H554.71C553.758 221.005 553.282 220.529 553.282 219.577V215.461C553.282 214.565 553.758 214.117 554.71 214.117H568.822C572.462 214.117 574.282 212.857 574.282 210.337V209.329C574.282 207.089 572.966 205.381 570.334 204.205L561.178 199.837C558.322 198.493 556.25 197.009 554.962 195.385C553.674 193.761 553.03 191.633 553.03 189.001C553.03 181.777 557.034 178.165 565.042 178.165H578.986C579.882 178.165 580.33 178.641 580.33 179.593V183.709C580.33 184.661 579.882 185.137 578.986 185.137H566.722C565.042 185.137 563.754 185.445 562.858 186.061C561.962 186.621 561.514 187.377 561.514 188.329V189.253C561.514 191.045 562.942 192.613 565.798 193.957L575.038 198.661C577.95 199.949 579.938 201.489 581.002 203.281C582.122 205.017 582.682 207.285 582.682 210.085C582.682 217.365 578.51 221.005 570.166 221.005Z"
            fill="url(#paint0_linear_542_3490)"
          />
          <defs>
            <filter
              id="filter0_iiii_542_3490"
              x="-11.2"
              y="-8.91429"
              width="931.2"
              height="274.213"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="11.6571" />
              <feGaussianBlur stdDeviation="4.34286" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.494118 0 0 0 0 0.00784314 0 0 0 0 0.960784 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_542_3490"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.14286" />
              <feGaussianBlur stdDeviation="2.85714" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 0.976471 0 0 0 0 0.976471 0 0 0 0.88 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_innerShadow_542_3490"
                result="effect2_innerShadow_542_3490"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.14286" />
              <feGaussianBlur stdDeviation="0.457143" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.08 0"
              />
              <feBlend
                mode="normal"
                in2="effect2_innerShadow_542_3490"
                result="effect3_innerShadow_542_3490"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="-11.2" dy="-8.91429" />
              <feGaussianBlur stdDeviation="11.6571" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.752941 0 0 0 0 0.0156863 0 0 0 0 0.996078 0 0 0 0.6 0"
              />
              <feBlend
                mode="normal"
                in2="effect3_innerShadow_542_3490"
                result="effect4_innerShadow_542_3490"
              />
            </filter>
            <linearGradient
              id="paint0_linear_542_3490"
              x1="322"
              y1="221.005"
              x2="564.394"
              y2="279"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#C004FE" />
              <stop offset="1" stop-color="#7E02F5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div
        class="claim-container mx-5"
        :class="{ 'flex flex-wrap': isDesktop }"
      >
        <div class="stats grid flex-none" :class="{ 'stats-mobile': isMobile }">
          <div class="flex items-center justify-center" v-if="false">
            <div class="flex py-5">
              <div class="mr-4 mt-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  data-v-1e6caed2=""
                >
                  <path
                    d="M18.6668 6.66659V2.66659C18.6668 2.31296 18.5264 1.97383 18.2763 1.72378C18.0263 1.47373 17.6871 1.33325 17.3335 1.33325H4.00016C3.29292 1.33325 2.61464 1.6142 2.11454 2.1143C1.61445 2.6144 1.3335 3.29267 1.3335 3.99992M1.3335 3.99992C1.3335 4.70716 1.61445 5.38544 2.11454 5.88554C2.61464 6.38563 3.29292 6.66659 4.00016 6.66659H20.0002C20.3538 6.66659 20.6929 6.80706 20.943 7.05711C21.193 7.30716 21.3335 7.6463 21.3335 7.99992V11.9999M1.3335 3.99992V19.9999C1.3335 20.7072 1.61445 21.3854 2.11454 21.8855C2.61464 22.3856 3.29292 22.6666 4.00016 22.6666H20.0002C20.3538 22.6666 20.6929 22.5261 20.943 22.2761C21.193 22.026 21.3335 21.6869 21.3335 21.3333V17.3333"
                    stroke="#BDB2DD"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-v-1e6caed2=""
                  ></path>
                  <path
                    d="M22.6665 12V17.3333H17.3332C16.6259 17.3333 15.9477 17.0524 15.4476 16.5523C14.9475 16.0522 14.6665 15.3739 14.6665 14.6667C14.6665 13.9594 14.9475 13.2811 15.4476 12.781C15.9477 12.281 16.6259 12 17.3332 12H22.6665Z"
                    stroke="#BDB2DD"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-v-1e6caed2=""
                  ></path>
                </svg>
              </div>
              <div>
                <div class="card-title">$125,458.23</div>
                <div>Total xPolars after vesting</div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center">
            <div class="flex py-5">
              <div class="mr-4 mt-3">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  data-v-1e6caed2=""
                >
                  <path
                    d="M18.3332 9.00024C22.0151 9.00024 24.9998 7.20938 24.9998 5.00024C24.9998 2.79111 22.0151 1.00024 18.3332 1.00024C14.6513 1.00024 11.6665 2.79111 11.6665 5.00024C11.6665 7.20938 14.6513 9.00024 18.3332 9.00024Z"
                    stroke="#BDB2DD"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-v-1e6caed2=""
                  ></path>
                  <path
                    d="M11.6665 5.00024V10.3336C11.6665 12.5429 14.6518 14.3336 18.3332 14.3336C22.0145 14.3336 24.9998 12.5429 24.9998 10.3336V5.00024"
                    stroke="#BDB2DD"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-v-1e6caed2=""
                  ></path>
                  <path
                    d="M11.6665 10.3337V15.6671C11.6665 17.8764 14.6518 19.6671 18.3332 19.6671C22.0145 19.6671 24.9998 17.8764 24.9998 15.6671V10.3337"
                    stroke="#BDB2DD"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-v-1e6caed2=""
                  ></path>
                  <path
                    d="M11.6665 15.667V21.0003C11.6665 23.2097 14.6518 25.0003 18.3332 25.0003C22.0145 25.0003 24.9998 23.2097 24.9998 21.0003V15.667"
                    stroke="#BDB2DD"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-v-1e6caed2=""
                  ></path>
                  <path
                    d="M6.33333 9.00024H3C2.46957 9.00024 1.96086 9.21096 1.58579 9.58603C1.21071 9.9611 1 10.4698 1 11.0002C1 11.5307 1.21071 12.0394 1.58579 12.4145C1.96086 12.7895 2.46957 13.0002 3 13.0002H4.33333C4.86377 13.0002 5.37247 13.211 5.74755 13.586C6.12262 13.9611 6.33333 14.4698 6.33333 15.0002C6.33333 15.5307 6.12262 16.0394 5.74755 16.4145C5.37247 16.7895 4.86377 17.0002 4.33333 17.0002H1"
                    stroke="#BDB2DD"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-v-1e6caed2=""
                  ></path>
                  <path
                    d="M3.6665 17.0003V18.3337M3.6665 7.66699V9.00033"
                    stroke="#BDB2DD"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    data-v-1e6caed2=""
                  ></path>
                </svg>
              </div>
              <div>
                <div class="card-title claim-amount">{{ pendingShare }}</div>
                <div>Claimable xPolars</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-claim flex-1">
          <h3 class="h-my-airdrop w-full">My Airdrop</h3>
          <div class="w-full text-center">
            <h2>
              <span class="claim-amount">{{ vested }}</span> / {{ totalShares }}
            </h2>
            In the next {{ diffDaysReverse }} days
          </div>
          <div>
            <div class="progress-bar mx-10 mt-[32px] h-[2px] rounded-[24px]">
              <div
                class="progress absolute bottom-0 left-0 h-[2px] w-0 rounded-[24px] bg-styling-teal opacity-80 transition duration-300 ease-linear dark:bg-styling-teal"
                :style="{ width: `${(progress * 100).toFixed(0)}%` }"
              />
              <div
                class="progress-tracker"
                :style="{ left: `${(progress * 100).toFixed(0)}%` }"
              >
                <span>{{ vested }} xPolars</span>
              </div>
            </div>
            <div class="mx-10 flex">
              <div class="w-full text-left">Already vested xPolars</div>
              <div class="w-full text-right">{{ totalShares }} xPolars</div>
            </div>
          </div>
          <div class="text-center">
            <button class="claim-btn" @click="claim" :disabled="claimDisable">
              Claim xPolars
              <svg
                style="display: inline; margin-left: 28px"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="ml-3"
                data-v-1e6caed2=""
              >
                <path
                  d="M9.5 4.99993C9.5 5.13939 9.44668 5.26771 9.34975 5.37375L6.13166 9.07841C6.02989 9.18445 5.92811 9.22907 5.81664 9.22907C5.57431 9.22907 5.39014 9.02825 5.39014 8.74927C5.39014 8.62095 5.43376 8.48703 5.51133 8.39773L6.59208 7.12567L8.23021 5.41277L7.0525 5.50207H0.926507C0.674494 5.50207 0.5 5.29005 0.5 4.99993C0.5 4.70981 0.674494 4.50333 0.926507 4.50333H7.0525L8.22536 4.58703L6.59208 2.87418L5.51133 1.60766C5.4289 1.51281 5.39014 1.38448 5.39014 1.25058C5.39014 0.97719 5.57431 0.770752 5.81664 0.770752C5.92811 0.770752 6.03473 0.820966 6.14136 0.938134L9.34975 4.62611C9.44668 4.73769 9.5 4.86601 9.5 4.99993Z"
                  fill="#FDFDFD"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.claim-button {
  @apply cursor-pointer;
  display: flex;
  align-items: flex-start;
  padding: 8px 12px 8px 16px;
  gap: 10px;

  width: 89px;
  height: 36px;

  margin: auto;

  background: linear-gradient(92.92deg, #c004fe 4.85%, #7e02f5 95.15%);
  border-radius: 24px;

  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #fdfdfd;
}

.claim-button:hover {
  background: linear-gradient(
    92.92deg,
    rgba(192, 4, 254, 0.7) 4.85%,
    rgba(126, 2, 245, 0.7) 95.15%
  );
}

.claim-button:active {
  background: linear-gradient(
    92.92deg,
    rgba(192, 4, 254, 0.7) 4.85%,
    rgba(126, 2, 245, 0.7) 95.15%
  );
}
.summary {
  max-width: 700px;
  background: #292043;
  padding: 24px 64px 24px 32px;
  border-radius: 100px;
  margin-top: 32px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #bdb2dd;
}
.summary h3 {
  font-weight: 600;
  font-size: 40px;
  line-height: 52px;
  color: #fdfdfd;
}
.title {
  font-weight: 600;
  font-size: 84px;
  line-height: 104px;
  color: #fdfdfd;
  max-width: 600px;
  margin: auto;
}
.subtitle {
  margin-top: 32px;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  color: #a99bc6;
}

.title-text {
  position: absolute;
  font-weight: 600;
  font-size: 64px;
  line-height: 82px;
  text-align: center;
  color: #fdfdfd;
}
.vesting {
  margin-top: 160px;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: #bdb2dd;
}
h2 {
  font-weight: 600;
  font-size: 40px;
  line-height: 52px;
  color: #ffffff;
  margin-bottom: 37px;
}
.progress-bar {
  background: #41365e;
  position: relative;
  margin-bottom: 10px;
}
.inp-label {
  background: linear-gradient(95.72deg, #43cea2 -16.04%, #185a9d 100.53%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
}
.read-btn {
  padding: 8px 20px;
  width: fit-content;
  height: fit-content;
  border-radius: 16px;
  color: #fdfdfd;
  background: linear-gradient(#241234, #241234) padding-box,
    linear-gradient(90deg, rgba(67, 206, 162, 1), rgba(24, 90, 157, 1))
      border-box;
  border: 1px solid transparent;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
}
.basic-label {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #fdfdfd;
}
.stats {
  min-width: 300px;
  color: #bdb2dd;
}
.stats > div:first-child {
  background-color: #41365e;
}
.stats > div:last-child {
  background-color: #50456e;
}
.claim-container {
  background-color: #292043;
  border-radius: 32px;
  min-height: 0;
  overflow: hidden;
}

.card-claim {
  padding: 24px 24px 32px 24px;
}
.container {
  max-width: 920px;
}
.card-title {
  font-weight: 600;
  font-size: 32px;
  color: #fdfdfd;
}
.claim-amount {
  color: #0ce6b5;
}
.h-my-airdrop {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  color: #fdfdfd;
  border-bottom: 1px solid rgba(65, 54, 94, 0.4);
  height: fit-content;
  padding-bottom: 16px;
  margin-bottom: 24px;
}
.claim-btn {
  background: linear-gradient(92.92deg, #c004fe 4.85%, #7e02f5 95.15%);
  border-radius: 24px;
  padding: 8px 16px 8px 44px;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #fdfdfd;
  margin-top: 40px;
}

.claim-btn:hover {
  background: linear-gradient(
    92.92deg,
    rgba(192, 4, 254, 0.7) 4.85%,
    rgba(126, 2, 245, 0.7) 95.15%
  );
}

.claim-btn:active {
  background: linear-gradient(
    92.92deg,
    rgba(192, 4, 254, 0.7) 4.85%,
    rgba(126, 2, 245, 0.7) 95.15%
  );
}
.claim-btn:disabled,
claim-btn[disabled] {
  background: rgba(65, 54, 94, 1);
  color: #a99bc6;
  cursor: not-allowed;
}
.progress-tracker {
  @apply bg-styling-teal;
  width: 12px;
  height: 12px;
  border-radius: 6px;
  position: relative;
  top: -5px;
}
.progress-tracker span {
  position: relative;
  top: -35px;
  width: 200px;
  display: inline-block;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  color: #fdfdfd;
  margin-left: -90px;
}
.pg-bg img {
  position: absolute;
  left: 50%;
  top: 0px;
  margin-left: -463px;
}
</style>

<style>
#app {
  background: #150128;
}
</style>
