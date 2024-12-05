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

import { debounce } from 'lodash';

let isFirstSearch: boolean = true;
// 将函数逻辑封装为一个防抖处理的函数
const debouncedWatchHandler = debounce(
  async (val: string) => {
    
    loadingAttr.value = true;
    setTimeout(() => {
      loadingAttr.value = false;
    }, 500);
    let templist: TitleInfo[] = await getAnsJSON(val); // 阻塞等待后端返回数据
    dataStore.title = templist; // 模拟，后续带参数调用
    console.log("val", val);
    console.log("update dataStore.title", dataStore.title);

    // 根据输入内容过滤出匹配项
    if (Array.isArray(templist) && templist.length > 0) {
      filteredItems.value = templist.filter((item) => {
        return (
          item.title.includes(val) || item.subtitle.includes(val)
        );
      });
    } else {
      filteredItems.value = dataStore.emptytitle;
    }

    if (filteredItems.value.length === 0) {
      filteredItems.value = dataStore.emptytitle;
    }

    console.log("filteredItems", filteredItems.value);
    dataStore.computeStrongRange(val);
  },
  500 // 防抖延时
);

watch(
  () => props.searchText,
  (val) => {
    if(isFirstSearch) {
      isFirstSearch = false;
      //展示初始值(like 历史记录)
      filteredItems.value = dataStore.historyAlertTitle;
    }else{
      debouncedWatchHandler(val); // 调用防抖函数
    }
  },
  { immediate: true } // 初始立即执行一次，确保初始值能正确显示
);


async function getAnsJSON(searchWord: string = ""): Promise<TitleInfo[]> {
  let backupUrl: string = "http://" + import.meta.env.VITE_IP + ":" + import.meta.env.VITE_BACKEND_PORT;
  try {
    const response = await fetch(backupUrl + "/json");
    const data = await response.json(); // 假设服务器返回的是一个 TitleInfo 数组
    console.log("loaded", data);
    return data.title; // 返回解析后的数据
  } catch (error) {
    console.error("Error fetching data:", error);
    return dataStore.emptytitle; // 发生错误时返回空标题数组
  }
}

</script>

<style scoped>
.search-list {
  border-radius: 16px;
}

.loading {
  height: 25vh;
}
</style>
