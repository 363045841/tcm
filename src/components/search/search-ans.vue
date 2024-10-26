<template>
  <v-list
    v-if="loadingAttr == false"
    lines="two"
    class="search-list"
    rounded
    elevation="1"
  >
    <v-list-item
      v-for="(item, index) in filteredItems"
      :key="index"
      :subtitle="item.subtitle"
      :prepend-avatar="item.avatar"
    >
      <template #title>
        <span>
          {{
            item.title.substring(
              0,
              dataStore.strongTitle.get(item.id)?.[0] ?? 0
            )
          }}
        </span>
        <span
          ><b>{{
            item.title.substring(
              dataStore.strongTitle.get(item.id)?.[0] ?? 0,
              dataStore.strongTitle.get(item.id)?.[1] ?? 0
            )
          }}</b></span
        >
        <span>{{
          item.title.substring(dataStore.strongTitle.get(item.id)?.[1] ?? 0)
        }}</span>
      </template>
      <template #subtitle>
        <span>
          {{
            item.subtitle.substring(
              0,
              dataStore.strongSubTitle.get(item.id)?.[0] ?? 0
            )
          }}
        </span>
        <span
          ><b>{{
            item.subtitle.substring(
              dataStore.strongSubTitle.get(item.id)?.[0] ?? 0,
              dataStore.strongSubTitle.get(item.id)?.[1] ?? 0
            )
          }}</b></span
        >
        <span>{{
          item.subtitle.substring(
            dataStore.strongSubTitle.get(item.id)?.[1] ?? 0
          )
        }}</span>
      </template>
    </v-list-item>
  </v-list>
  <!-- 后面用插槽实现,在search组件上控制加载进度 -->
  <loading v-if="loadingAttr"></loading>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useComponentsSearchItemStore } from "@/stores/searchPage/searchItem";
import { type TitleInfo } from "@/stores/searchPage/searchItem";
import loading from "./search-loading.vue";

const dataStore = useComponentsSearchItemStore();
const props = defineProps({
  searchText: {
    type: String,
    default: "",
  },
});

// DEMO 模拟搜索加载时间
let loadingAttr = ref(true);
setTimeout(() => {
  loadingAttr.value = false;
}, 500);

const filteredItems = ref<Array<TitleInfo>>([]);

// 监听 searchText 的变化
watch(
  () => props.searchText,
  (val) => {
    loadingAttr.value = true;
    if (val) {
      // 根据输入内容过滤出匹配项
      if (Array.isArray(dataStore.title) && dataStore.title !== null) {
        filteredItems.value = dataStore.title.filter(
          (item) => item.title.includes(val) || item.subtitle.includes(val)
        );
      }
    } else {
      // 如果没有输入内容，则显示所有项
      /* filteredItems.value = dataStore.title; */
      filteredItems.value = dataStore.emptytitle;
    }
    if(filteredItems.value.length === 0){
      filteredItems.value = dataStore.emptytitle;
    }
    dataStore.computeStrongRange(val);
    setTimeout(() => {
      loadingAttr.value = false;
    }, 1000);
  },
  { immediate: true } // 初始立即执行一次，确保初始值能正确显示
);
</script>

<style scoped>
.search-list {
  border-radius: 16px;
}

.loading {
  height: 25vh;
}
</style>
