<template>
  <v-container>
    <v-row>
      <v-col cols="8" style="margin: auto; padding: 0px">
        <div :class="{ moving: move }" class="movable" style="padding: 0px">
          <transition name="fade" mode="out-in">
            <v-text-field
              v-if="showStore.searchShow"
              variant="outlined"
              label="搜索"
              rounded
              v-model:model-value="searchText"
              :hide-details="true"
              @focus="(move = true), (showStore.searchFocus = true)"
              @blur="(move = false), (showStore.searchFocus = false)"
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
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="8" style="margin: auto; padding: 0px">
        <search-ans
          v-if="showStore.searchFocus"
          :searchText="finalizedSearchText"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useComponentsShowStore } from "@/stores/searchPage/componentsShow";
import searchAns from "./searchAns.vue";

const showStore = useComponentsShowStore();
let searchText = ref<string>(""); // 用户输入的搜索内容
let move = ref<boolean>(false);
let isComposing = ref<boolean>(false); // 用于跟踪输入法状态
let finalizedSearchText = ref<string>(""); // 最终传递给子组件的搜索内容

const onInput = (event: Event) => {
  if (!isComposing.value) {
    searchText.value = (event.target as HTMLInputElement).value;
    console.log("search text", searchText.value);
  }
};
const onCompositionEnd = (event: CompositionEvent) => {
  isComposing.value = false;
  searchText.value = (event.target as HTMLInputElement).value;
  finalizedSearchText.value = searchText.value;
};
</script>

<style scoped>
.icon:hover {
}

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

.moving {
  /* transform: translateY(-5px); */ /* 向上移动50px */
}
</style>
