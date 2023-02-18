<template>
  <BalModal show noContentPad @close="$emit('close')">
    <div class="modal">
      <div class="flex w-full items-center justify-between">
        <div class="flex w-full items-center">
          <div class="flex-none">
            <BalBtn
              v-if="selectTokenList"
              color="transparent"
              size="xs"
              class="mr-2 back"
              
              circle
              @click="onListExit"
            >
              <BalIcon name="arrow-left" size="sm" />
            </BalBtn>
          </div>
          <div class="flex w-full justify-between pr-[22px] pl-[18px] pt-[14px] pb-[24px]">
            <h6 v-if="!selectTokenList" class="font-semibold">Select a list</h6>
            <div
              v-if="!selectTokenList"
              class="group flex items-center cursor-pointer"
              @click="toggleSelectTokenList"
            >
              <div class="mr-[25px]">
                <div class="flex items-center ml-2">
                  <span class="mr-1">
                    <img
                      v-for="(tokenlist, i) in activeTokenLists"
                      :key="i"
                      :src="resolve(tokenlist.logoURI)"
                      class="inline-block w-4 h-4 bg-white rounded-full shadow"
                    />
                  </span>
                  <span class="text-[14px] color-[#BDB2DD] text-secondary">{{ $t('tokenLists') }}</span>
                  <BalIcon
                    name="chevron-right"
                    size="sm"
                    class="ml-1 text-white-500 group-hover:text-white-500 group-focus:text-white-500 transition-all duration-200 ease-out"
                    style="margin-top:0px"
                  />
                </div>
              </div>
              <x @click="$emit('close')" />
            </div>
          </div>
        </div>
      </div>
      <template v-if="selectTokenList">
        <Search
          v-if="!selectTokenList"
          v-model="query"
          :placeholder="$t('Search name or paste address')"
          class="flex-auto px-[16px] search-token"
        />
        <div>
          <div
            v-if="Object.keys(tokenLists).length > 0"
            class="h-96 overflow-y-scroll py-[24px]"
          >
            <TokenListsListItem
              v-for="(tokenList, uri) in tokenLists"
              :key="uri"
              :isActive="isActiveList(uri)"
              :tokenlist="tokenList"
              :uri="uri"
              @toggle="onToggleList(uri)"
            />
          </div>
          <div
            v-else
            class="flex h-96 items-center justify-center"
            v-text="$t('errorNoLists')"
          />
        </div>
      </template>
      <template v-else>
        <div class="flex">
          <Search
            v-model="query"
            :placeholder="$t('Search name or paste address')"
            class="flex-auto px-[16px] border-0"
          />
        </div>
        <!--  -->
        <div class="px-[16px] pb-[12px] pt-[24px]">
          <div class="common-bases-title mb-[12px]">Common bases</div>
          <div class="flex gap-[8px]" v-if="tokens[0]">
            <a @click="onSelectToken(tokens[0].address)" class="flex-none">
              <div class="common-asset flex items-center">
                <BalAsset
                  :address="tokens[0].address"
                  :iconURI="tokens[0].logoURI"
                  :size="24"
                  class="mr-[4px]"
                />
                <div class="token-name">{{ tokens[0].symbol }}</div>
              </div>
            </a>
            <a @click="onSelectToken(tokens[1].address)" v-if="tokens[1]" class="flex-none">
              <div class="common-asset flex items-center">
                <BalAsset
                  :address="tokens[1].address"
                  :iconURI="tokens[1].logoURI"
                  :size="24"
                  class="mr-[4px]"
                />
                <div class="token-name">{{ tokens[1].symbol }}</div>
              </div>
            </a>
            <a @click="onSelectToken(tokens[2].address)" v-if="tokens[2]"  class="flex-none">
              <div class="common-asset flex items-center">
                <BalAsset
                  :address="tokens[2].address"
                  :iconURI="tokens[2].logoURI"
                  :size="24"
                  class="mr-[4px]"
                />
                <div class="token-name">{{ tokens[2].symbol }}</div>
              </div>
            </a>
          </div>
        </div>
        <div class="m-[12px] border" />
        <!--  -->
        <div class="overflow-hidden rounded-lg">
          <RecycleScroller
            v-if="tokens.length > 0"
            v-slot="{ item: token }"
            class="h-[530px] overflow-y-scroll py-[24px]"
            :items="tokens"
            :itemSize="64"
            keyField="address"
            :buffer="100"
          >
            <a @click="onSelectToken(token.address)">
              <TokenListItem
                :token="token"
                :balanceLoading="dynamicDataLoading"
              />
            </a>
          </RecycleScroller>
          <div
            v-else-if="loading"
            class="flex h-[530px] items-center justify-center"
          >
            <BalLoadingIcon />
          </div>
          <div
            v-else
            class="text-secondary h-[530px] text-center"
            v-text="$t('errorNoTokens')"
          />
        </div>
      </template>
    </div>
  </BalModal>
</template>

<script lang="ts">
import { orderBy } from 'lodash';
import {
  computed,
  defineComponent,
  PropType,
  reactive,
  toRef,
  toRefs,
  watch,
} from 'vue';
import { useI18n } from 'vue-i18n';

import TokenListItem from '@/components/lists/TokenListItem.vue';
import TokenListsListItem from '@/components/lists/TokenListsListItem.vue';
import useTokenLists from '@/composables/useTokenLists';
import useTokens from '@/composables/useTokens';
import useUrls from '@/composables/useUrls';
import { TokenInfoMap } from '@/types/TokenList';

import Search from './Search.vue';

import x from './x.vue';

interface ComponentState {
  loading: boolean;
  selectTokenList: boolean;
  query: string;
  results: TokenInfoMap;
}

export default defineComponent({
  components: {
    TokenListItem,
    TokenListsListItem,
    Search,
    x,
  },

  props: {
    open: { type: Boolean, default: false },
    excludedTokens: { type: Array as PropType<string[]>, default: () => [] },
    includeEther: { type: Boolean, default: false },
    disableInjection: { type: Boolean, default: false },
  },

  emits: ['close', 'selectTokenlist', 'select'],

  setup(props, { emit }) {
    /**
     * STATE
     */
    const state: ComponentState = reactive({
      loading: false,
      selectTokenList: false,
      query: '',
      results: {},
    });

    /**
     * COMPOSABLES
     */
    const {
      activeTokenLists,
      approvedTokenLists,
      toggleTokenList,
      isActiveList,
    } = useTokenLists();
    const {
      getToken,
      searchTokens,
      priceFor,
      balanceFor,
      dynamicDataLoading,
      nativeAsset,
      injectTokens,
    } = useTokens();
    const { t } = useI18n();
    const { resolve } = useUrls();

    /**
     * COMPUTED
     */
    const title = computed(() => {
      if (state.selectTokenList) return t('manageLists');
      return t('tokenSearch');
    });

    const tokenLists = computed(() => {
      const query = state.query.toLowerCase();
      const tokenListArray = Object.entries(approvedTokenLists.value);
      const results = tokenListArray.filter(([, tokenList]) =>
        tokenList.name.toLowerCase().includes(query)
      );
      return Object.fromEntries(results);
    });

    const tokens = computed(() => {
      const tokensWithValues = Object.values(state.results).map(token => {
        const balance = balanceFor(token.address);
        const price = priceFor(token.address);
        const value = Number(balance) * price;
        return {
          ...token,
          price,
          balance,
          value,
        };
      });

      return orderBy(tokensWithValues, ['value', 'balance'], ['desc', 'desc']);
    });

    const excludedTokens = computed(() => [
      ...props.excludedTokens,
      ...(props.includeEther ? [] : [nativeAsset.address]),
    ]);

    /**
     * METHODS
     */
    async function onSelectToken(token: string): Promise<void> {
      if (!getToken(token)) {
        await injectTokens([token]);
      }

      emit('select', token);
      emit('close');
    }

    async function onToggleList(uri: string): Promise<void> {
      toggleTokenList(uri);
      state.results = await searchTokens(
        state.query,
        excludedTokens.value,
        props.disableInjection
      );
    }

    function onListExit(): void {
      state.selectTokenList = false;
      state.query = '';
    }

    function toggleSelectTokenList(): void {
      state.selectTokenList = !state.selectTokenList;
      state.query = '';
    }

    /**
     * WATCHERS
     */
    watch(
      toRef(state, 'query'),
      async newQuery => {
        state.results = await searchTokens(
          newQuery,
          excludedTokens.value,
          props.disableInjection
        );
      },
      { immediate: true }
    );

    return {
      // data
      ...toRefs(state),
      // computed
      title,
      tokens,
      tokenLists,
      activeTokenLists,
      dynamicDataLoading,
      // methods
      onSelectToken,
      onToggleList,
      onListExit,
      toggleSelectTokenList,
      isActiveList,
      resolve,
    };
  },
});
</script>

<style scoped>
.modal {
  border-radius: 22px;
  background: #292043;
}

.common-bases-title {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: #BDB2DD;
}

.common-asset {
  border-radius: 16px;
  padding: 4px 12px 4px 4px;
}
.common-asset:hover{
  background: #50456E;
  border-radius: 16px;
}

.token-name {
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;

  color: #ffffff;
}

.border {
  border: 0.5px solid rgba(151, 71, 255, 0.4)
  
}
.back{
  min-width: min-content;
  margin-left: 16px;
  margin-top: 12px;
}
</style>
