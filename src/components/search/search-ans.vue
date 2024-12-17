<template>
  <v-list
    v-if="loadingAttr == false && props.searchText.length > 0"
    lines="two"
    class="search-list"
    rounded
    elevation="1"
  >
    <v-list-item
      v-for="(item, index) in filteredItems"
      class="search-item"
      :key="index"
      :subtitle="item.subtitle"
      :prepend-avatar="item.avatar"
      @click.stop="clickSearchItem(item)"
    >
      <template #title>
        <span>
          {{
            item.title.substring(
              0,
              dataStore.strongTitle.get(item.id)?.[0] ?? 0,
            )
          }}
        </span>
        <span
          ><b>{{
            item.title.substring(
              dataStore.strongTitle.get(item.id)?.[0] ?? 0,
              dataStore.strongTitle.get(item.id)?.[1] ?? 0,
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
              dataStore.strongSubTitle.get(item.id)?.[0] ?? 0,
            )
          }}
        </span>
        <span
          ><b>{{
            item.subtitle.substring(
              dataStore.strongSubTitle.get(item.id)?.[0] ?? 0,
              dataStore.strongSubTitle.get(item.id)?.[1] ?? 0,
            )
          }}</b></span
        >
        <span>{{
          item.subtitle.substring(
            dataStore.strongSubTitle.get(item.id)?.[1] ?? 0,
          )
        }}</span>
      </template>
    </v-list-item>
  </v-list>
  <v-list
    v-if="props.searchText.length == 0"
    class="search-list"
    rounded
    elevation="1"
    lines="two"
  >
    <div style="margin-top: 16px">
      <h5 style="margin-left: 24px; margin-right: 4px; display: inline">
        历史搜索记录
      </h5>
      <v-btn
        density="compact"
        icon="mdi-pencil"
        size="small"
        flat
        @click="historyListClosable = !historyListClosable"
      ></v-btn>
    </div>
    <v-container>
      <v-chip
        v-for="(item, index) in historyListVList"
        :key="index"
        style="margin: 4px"
        @click:close="deleteHistoryListStorage(item)"
        :closable="historyListClosable"
      >
        {{ item }}
      </v-chip>
    </v-container>
  </v-list>
  <!-- 后面也许用插槽实现,在search组件上控制加载进度 -->
  <!-- <loading v-if="loadingAttr"></loading> -->
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useComponentsSearchItemStore } from "@/stores/searchPage/searchItem";
import { type TitleInfo } from "@/stores/searchPage/searchItem";
import loading from "./search-loading.vue";
import { useComponentsShowStore } from "@/stores/searchPage/componentsShow";

const showStore = useComponentsShowStore();

let historyListClosable = ref<boolean>(false);

const dataStore = useComponentsSearchItemStore();
const props = defineProps({
  searchText: {
    // 搜索关键词prop
    type: String,
    default: "",
  },
});

// 历史记录相关功能
if (localStorage.getItem("historyList") == null) {
  localStorage.setItem("historyList", JSON.stringify([]));
}

function updateHistoryListStorage(newItem: string) {
  try {
    let historyList: string[] | null = JSON.parse(
      localStorage.getItem("historyList") || "[]",
    );
    if (historyList != null) {
      if (!historyList.includes(newItem)) {
        historyList.push(newItem);
        localStorage.setItem("historyList", JSON.stringify(historyList));
      }
    }
  } catch (error) {
    console.error("Error updating history list:", error);
  }
}

function deleteHistoryListStorage(newItem: string) {
  try {
    let historyList: string[] | null = JSON.parse(
      localStorage.getItem("historyList") || "[]",
    );
    if (historyList != null) {
      let it = historyList.indexOf(newItem);
      if (it != -1) historyList.splice(it, 1);
      console.log("historyList", historyList);
      localStorage.setItem("historyList", JSON.stringify(historyList));
    }
  } catch (error) {
    console.error("Error updating history list:", error);
  }
}

function clickSearchItem(item: TitleInfo) {
  console.log("clickSearchItem", item.title);
  updateHistoryListStorage(props.searchText);
}

// DEMO 模拟搜索加载时间
let loadingAttr = ref(true);
setTimeout(() => {
  loadingAttr.value = false;
}, 500);

// 搜索关键词并渲染搜索结果
import { debounce } from "lodash"; // 引入防抖函数
const filteredItems = ref<Array<TitleInfo>>([]);
let isFirstSearch: boolean = true;
// 将函数逻辑封装为一个防抖处理的函数
const debouncedWatchHandler = debounce(
  async (val: string) => {
    if (props.searchText === "") {
      filteredItems.value = dataStore.historyAlertTitle;
      return;
    }
    console.log("搜索关键词", val);
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
        return item.title.includes(val) || item.subtitle.includes(val);
      });
    } else {
      filteredItems.value = dataStore.emptytitle;
    }

    if (filteredItems.value.length === 0) {
      // 没有匹配的搜索结果
      filteredItems.value = dataStore.emptytitle;
    }
    /* console.log("filteredItems", filteredItems.value); */
    dataStore.computeStrongRange(val);
  },
  500, // 防抖延时
);

// 监听 searchText 的变化
let historyListVList: string[] | null = JSON.parse(
  localStorage.getItem("historyList") || "[]",
);
watch(
  () => props.searchText,
  async (val) => {
    console.log("watching", val);
    if (isFirstSearch || val === "") {
      isFirstSearch = false;
      // 渲染历史记录
      filteredItems.value = dataStore.historyAlertTitle;
      historyListVList = JSON.parse(
        localStorage.getItem("historyList") || "[]",
      );
    } else {
      await debouncedWatchHandler(val); // 调用防抖函数
    }
  },
  { immediate: true }, // 初始立即执行一次，确保初始值能正确显示
);

// 异步加载json的静态test数据
async function getAnsJSON(searchWord: string = ""): Promise<TitleInfo[]> {
  let backupUrl: string =
    "http://" +
    import.meta.env.VITE_IP +
    ":" +
    import.meta.env.VITE_BACKEND_PORT;
  console.log("backupUrl", backupUrl);
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
