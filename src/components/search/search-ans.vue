<template>
  <v-list
    v-if="loadingAttr == false && props.searchText.length > 0"
    lines="two"
    class="search-list"
    rounded
    elevation="1"
    style="max-height: 60vh; overflow-y: auto;"
  >
    <v-list-item
      v-for="(item, index) in filteredItems"
      class="search-item"
      :key="index"
      :subtitle="item.subtitle"
      :prepend-avatar="item.avatar"
      @click="clickSearchItem(item)"
    >
      <template #title>
        <div style="display: flex; justify-content: space-between; width: 100%">
          <div>
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
          </div>
          <span>
            <b style="font-size: small;color: gray;">关联词:{{ item.fuzzyWord }} </b>
          </span>
        </div>
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
      localStorage.getItem("historyList") || "[]"
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
      localStorage.getItem("historyList") || "[]"
    );
    if (historyList != null) {
      let it = historyList.indexOf(newItem);
      if (it != -1) historyList.splice(it, 1);
      //  console.log("historyList", historyList);
      localStorage.setItem("historyList", JSON.stringify(historyList));
    }
  } catch (error) {
    console.error("Error updating history list:", error);
  }
}
const router = useRouter();
function clickSearchItem(item: TitleInfo) {
  console.log("点击了搜索结果", item);
  updateHistoryListStorage(props.searchText);
  router.push({ path: `/item/${item.id}` });
  // router.push({path: `/item/${item.id}`});
}

// DEMO 模拟搜索加载时间
let loadingAttr = ref(true);
setTimeout(() => {
  loadingAttr.value = false;
}, 500);

// 搜索关键词并渲染搜索结果
import { debounce } from "lodash"; // 引入防抖函数
const filteredItems = ref<Array<TitleInfo>>([]);

// 将函数逻辑封装为一个防抖处理的函数
const debouncedWatchHandler = debounce(
  async (query: string) => {
    if (props.searchText === "") {
      filteredItems.value = dataStore.historyAlertTitle;
      return;
    }
    // console.log("搜索关键词", val);
    loadingAttr.value = true;
    setTimeout(() => {
      loadingAttr.value = false;
    }, 500);
    // let templist: TitleInfo[] = await getAnsJSON(val); // 阻塞等待后端返回数据

    let templist: FuzzySearchRes[] = await getFuzzySearchAns(query);
    dataStore.title.length = 0;
    for (let word of templist) {
      dataStore.title.push({
        id: word.indexValue,
        title: word.title,
        subtitle: word.description,
        avatar: `http://www.zhongyoo.com/${word.picUrl}`,
        fuzzyWord: word.word,
      });
    }
    dataStore.title.sort((a, b) => (a.fuzzyWord === query ? -1 : 1));
    console.log("加载的标题：", dataStore.title);
    console.log("strong title", dataStore.strongTitle);
    console.log("strong subtitle", dataStore.strongSubTitle);
    filteredItems.value = dataStore.title;

    dataStore.computeStrongRange(query);
  },
  500 // 防抖延时
);

// 监听 searchText 的变化
let historyListVList: string[] | null = JSON.parse(
  localStorage.getItem("historyList") || "[]"
);

let isFirstSearchStore = useComponentsSearchItemStore();
watch(
  () => props.searchText,
  async (val) => {
    // console.log("watching", val);
    if (isFirstSearchStore.isFirstSearch || val === "") {
      //console.log(isFirstSearchStore.isFirstSearch, val);
      isFirstSearchStore.isFirstSearch = false;
      // 渲染历史记录
      filteredItems.value = dataStore.historyAlertTitle;
      //console.log("historyListVList", historyListVList);
      historyListVList = JSON.parse(
        localStorage.getItem("historyList") || "[]"
      );
    } else {
      isFirstSearchStore.isFirstSearch = false;
      // console.log("发起搜索", val);
      await debouncedWatchHandler(val); // 调用防抖函数
    }
  },
  { immediate: true } // 初始立即执行一次，确保初始值能正确显示
);

// 异步加载json的静态test数据
/* async function getAnsJSON(searchWord: string = ""): Promise<TitleInfo[]> {
  let backupUrl: string =
    "http://" +
    import.meta.env.VITE_IP +
    ":" +
    import.meta.env.VITE_BACKEND_PORT;
  //console.log("backupUrl", backupUrl);
  try {
    const response = await fetch(backupUrl + "/json");
    const data = await response.json(); // 假设服务器返回的是一个 TitleInfo 数组
    //console.log("loaded", data);
    return data.title; // 返回解析后的数据
  } catch (error) {
    console.error("Error fetching data:", error);
    return dataStore.emptytitle; // 发生错误时返回空标题数组
  }
} */

interface FuzzySearchRes {
  id: number;
  word: string;
  indexValue: number;
  title: string;
  description: string;
  picUrl: string;
}

// 真实模糊搜索接口调用
async function getFuzzySearchAns(
  searchWord: string,
  url: string = `http://${import.meta.env.VITE_IP}:${
    import.meta.env.VITE_BACKEND_PORT
  }/api/v1/search?wd=`
): Promise<FuzzySearchRes[]> {
  try {
    url = url + searchWord;
    const res = await fetch(url, { method: "GET" });
    const data = await res.json();

    // console.log("loaded 搜索结果！", data);
    // (data as searchResult[]).sort((a, b) => b.similarity - a.similarity); // 降序排序
    // console.log("排序后的搜索结果！", data);

    return data as FuzzySearchRes[];
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // 如果出现错误，可以返回一个空数组
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
.v-list::-webkit-scrollbar {
  width: 0px;  /* 设置滚动条宽度为0 */
  background: transparent;  /* 可选：设置背景透明 */
}

.v-list::-webkit-scrollbar-thumb {
  background: transparent; /* 可选：设置滚动条滑块透明 */
}
</style>
