<script lang="ts">
import { ref, defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import usePoolQuery from '@/composables/queries/usePoolQuery';
import { useReturnRoute } from '@/composables/useReturnRoute';


import {
  PoolContractDetails,
} from '@/components/contextual/pages/pool';

export default defineComponent({
  components: {
    PoolContractDetails,
  },
  props: {},
  watch: {},
  setup(props, { emit }) {
    const { getReturnRoute } = useReturnRoute();
    const route = useRoute()
    const poolId = (route.params.id as string).toLowerCase();

    //#region pool query
    const poolQuery = usePoolQuery(poolId, undefined, undefined);
    const pool = computed(() => poolQuery.data.value);

    return {
        pool,
        getReturnRoute,
    };
  },
  mounted() {},
  onBeforeMount() {},
  updated() {},
  data() {
    return {};
  },
  methods: {},

  emits: [],
});
</script>

<template>
    <div class="mb-12 layout-header">
      <div />
      <BalBtn tag="router-link" :to="getReturnRoute()" color="white" circle>
        <BalIcon name="x" size="lg" />
      </BalBtn>
    </div>
    <div class="container mx-auto">
        <PoolContractDetails :pool="pool" />
    </div>
</template>

