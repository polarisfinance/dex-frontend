<script lang="ts">
import {ref, defineComponent} from 'vue';
import { useReturnRoute } from '@/composables/useReturnRoute';
import { useRoute } from 'vue-router';


export default defineComponent({
  components: {
  },
  props: {
  },
  watch: {
  },
  setup(props, { emit }) {
    const { getReturnRoute } = useReturnRoute();
    const route = useRoute();
    const id = ref<string>(route.params.id as string);
    
    return {
        getReturnRoute,
        id,

    };
  },
  mounted() {

  },
  onBeforeMount(){
    
    
  },
  updated() {
  },
  data() {
    return {
    };
  },
  methods: {
    
  },

  emits: [],
});
</script>

<template>
    <div class="layout-header mb-12">
        <div />
        <router-link :to="getReturnRoute({ name: 'pool', params: { id } })">
        <BalIcon name="x" size="lg" />
        </router-link>
    </div>
    <div class="container mx-auto">
        <div class="card mx-auto grid">
            <div class="header flex">
                <div class="attr-wrapper"><div class="attr">Attribute</div></div>
                <div class="flex val justify-between">
                    <div>Pool Details</div>
                    <div class="items-end">TOKENS</div>
                </div>
            </div>
            <div class="row">
                <div>Pool name</div>
                <div>xxx</div>
            </div>
            <div class="row">
                <div>Pool symbol</div>
                <div>xxx</div>
            </div>
            <div class="row">
                <div>Pool type</div>
                <div>xxx</div>
            </div>
            <div class="row">
                <div>Swap fees</div>
                <div>xxx</div>
            </div>
            <div class="row">
                <div>Pool manager</div>
                <div>xxx</div>
            </div>
            <div class="row">
                <div>Pool owner</div>
                <div>xxx</div>
            </div>
            <div class="row">
                <div>Contract address</div>
                <div>xxx</div>
            </div>
            <div class="row">
                <div>Creation date</div>
                <div>xxx</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.layout-header {
  @apply h-16;
  @apply px-4 lg:px-6;
  @apply flex items-center justify-between;
}
.grid {
  display: grid;
  grid-template-columns: 50% auto;
  width: 100%;
}
.card {
  min-height: 0px;
  max-width: 730px;
}
.header{
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 50px;
}
.attr-wrapper{
    overflow: hidden;
    border-top-left-radius: 32px;
    border-bottom-left-radius: 32px;
    margin-bottom: 40px;
}
.val{
    border-top-right-radius: 32px;
    border-bottom-right-radius: 32px;
    margin-bottom: 40px;
}
.attr{
    background: #41365E!important;
    border-radius: 32px;
    overflow: hidden;
}
.header div{
    background: #292043;
}
.val, .attr{
    padding:12px 24px;
}

.row,.header{
    display: contents;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: rgba(253, 253, 253, 0.8);
}
.row div{
padding: 12px 24px;
}
</style>
