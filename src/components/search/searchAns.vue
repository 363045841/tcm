<template>
  <v-list lines="two" class="search-list" rounded elevation="1">
    <v-list-item
      v-if="loadrate === 100"
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
    <!-- 后面用插槽实现,在search组件上控制加载进度 -->
    <v-progress-linear
      v-if="loadrate > 0 && loadrate < 100"
      :model-value="loadrate"
      rounded
      style="width: 95%; margin: auto"
    ></v-progress-linear>
  </v-list>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useComponentsSearchItemStore } from "@/stores/searchPage/searchItem";
import { type TitleInfo } from "@/stores/searchPage/searchItem";

const dataStore = useComponentsSearchItemStore();
let increment = 20;
// DEMO 模拟搜索加载时间
let loadrate = ref<number>(0);
const loadInterval = setInterval(() => {
  if (loadrate.value < 100) {
    // 随着loadrate.value的增加，increment逐渐减小
    increment = Math.max(1, increment - 0.2 * increment); // 调整衰减速度
    loadrate.value += increment;

    // 确保loadrate.value不会超过100
    if (loadrate.value > 100) {
      loadrate.value = 100;
      clearInterval(loadInterval);
    }
  } else {
    clearInterval(loadInterval);
  }
}, 100);

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
