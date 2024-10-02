<template>
  <v-list lines="two" class="search-list" rounded elevation="1">
    <v-list-item
      v-for="(item, index) in filteredItems"
      :key="index"
      :subtitle="item.subtitle"
      :prepend-avatar="item.avatar"
    >
      <template #title>
        {{ console.log("ans", item) }}
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
          {{ item.subtitle.substring(0, dataStore.strongSubTitle.get(item.id)?.[0] ?? 0) }}
        </span>
        <span><b>{{ item.subtitle.substring(dataStore.strongSubTitle.get(item.id)?.[0] ?? 0, dataStore.strongSubTitle.get(item.id)?.[1] ?? 0) }}</b></span>
        <span>{{ item.subtitle.substring(dataStore.strongSubTitle.get(item.id)?.[1] ?? 0) }}</span>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useComponentsSearchItemStore } from "@/stores/searchPage/searchItem";
import { type TitleInfo } from "@/stores/searchPage/searchItem";

const dataStore = useComponentsSearchItemStore();

const props = defineProps({
  searchText: {
    type: String,
    default: "",
  },
});

const filteredItems = ref<Array<TitleInfo>>([]);

// 监听 searchText 的变化
watch(
  () => props.searchText,
  (val) => {
    console.log("watch", val);
    if (val) {
      // 根据输入内容过滤出匹配项
      if (Array.isArray(dataStore.title) && dataStore.title !== null) {
        filteredItems.value = dataStore.title.filter(
          (item) => item.title.includes(val) || item.subtitle.includes(val)
        );
      }
    } else {
      // 如果没有输入内容，则显示所有项
      filteredItems.value = dataStore.title;
    }
    dataStore.computeStrongRange(val);
  },
  { immediate: true } // 初始立即执行一次，确保初始值能正确显示
);
</script>

<style scoped>
.search-list {
  border-radius: 16px;
}
</style>
