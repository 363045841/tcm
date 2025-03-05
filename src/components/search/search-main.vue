<template>
  <v-container
    @mouseleave="showStore.mouseOnSearchContainer = false"
    @mouseover="showStore.mouseOnSearchContainer = true"
  >
    <v-row style="padding-bottom: 0px">
      <!-- search box -->
      <v-col style="padding-left: 0px">
        <transition name="fade" mode="out-in">
          <v-text-field
            clearable
            v-show="showStore.searchShow"
            variant="outlined"
            label="搜索"
            rounded
            v-model:model-value="searchText"
            :hide-details="true"
            @focus="(move = true), (showStore.searchFocus = true)"
            @blur="textFieldLoseFocus"
            @input="onInput"
            @compositionstart="isComposing = true"
            @compositionend="onCompositionEnd"
          >
            <template #append-inner>
              <v-tooltip text="搜图" location="bottom">
                <template #activator="{ props }">
                  <img
                    v-bind="props"
                    class="icon"
                    src="../../assets/icon/carmera.svg"
                    alt="search photo"
                    style="height: 24px !important; margin: 16px"
                  />
                </template>
              </v-tooltip>
              <v-tooltip text="搜索" location="bottom">
                <template #activator="{ props }">
                  <img
                    v-bind="props"
                    class="icon"
                    src="../../assets/icon/search.svg"
                    alt="search"
                    style="height: 24px; margin-right: 8px"
                  />
                </template>
              </v-tooltip>
            </template>
          </v-text-field>
        </transition>
      </v-col>
      <!-- search preferce -->
      <v-col
        xs="3"
        sm="3"
        md="3"
        lg="3"
        xl="3"
        class="d-flex align-center justify-end"
        style="padding-right: 0px; padding-left: 0px; max-width: 100px"
      >
        <v-select
          v-model:model-value="searchPrefer"
          rounded
          :items="['全部', '功效', '成分']"
          variant="outlined"
          :hide-details="true"
        ></v-select>
      </v-col>
    </v-row>
    <!-- search answer -->
    <v-row>
      <v-col style="padding: 0px">
        <searchAns
          :searchText="finalizedSearchText"
          @changeFatherSearchText="receiveChildSearchText"
        />
        <!-- <searchAns
          v-if="showStore.searchFocus"
          :searchText="finalizedSearchText"
        /> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useComponentsShowStore } from "@/stores/searchPage/componentsShow";
import searchAns from "./search-ans.vue";
import { useViewPortStore } from "@/stores/viewportState";

function receiveChildSearchText(childSearchText: string) {
  searchText.value = childSearchText;
  finalizedSearchText.value = childSearchText;
}

const showStore = useComponentsShowStore();

function textFieldLoseFocus() {
  if (showStore.mouseOnSearchContainer) showStore.searchFocus = true;
  else showStore.searchFocus = false;
}

// 响应式状态处理
const viewportStore = useViewPortStore();
viewportStore.setViewport();
onMounted(() => {
  viewportStore.setViewport();
});

let searchPrefer = ref<string>("全部"); // 搜索偏好选项
let searchText = ref<string>(""); // 用户输入的搜索内容
let move = ref<boolean>(false); // 用于控制搜索框的移动

// 监视输入法状态控制输入props
let isComposing = ref<boolean>(false); // 用于跟踪输入法状态
let finalizedSearchText = ref<string>(""); // 最终传递给子组件的搜索内容
const onInput = (event: Event) => {
  if (!isComposing.value) {
    searchText.value = (event.target as HTMLInputElement).value;
    finalizedSearchText.value = searchText.value;
    console.log("search text", finalizedSearchText.value);
  }
};

const onCompositionEnd = (event: CompositionEvent) => {
  isComposing.value = false;
  searchText.value = (event.target as HTMLInputElement).value;
  finalizedSearchText.value = searchText.value;
  console.log("search text", finalizedSearchText.value);
};

/* watch(searchPrefer, () => {
  console.log("search prefer", searchPrefer.value);
}); */
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.movable {
  padding: 20px;
  margin: 10px 0;
  border-radius: 5px;
  transition: transform 0.5s ease; /* 设置过渡效果 */
}
</style>
