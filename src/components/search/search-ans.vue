<template>
  <v-list
    v-if="loadingAttr == false && props.searchText.length > 0"
    lines="two"
    class="search-list"
    rounded
    elevation="1"
    style="max-height: 60vh; overflow-y: auto; padding-bottom: 0px"
  >
    <v-list-item
      v-for="(item, index) in filteredItems"
      class="search-item"
      :key="index"
      :subtitle="item.subtitle"
      :prepend-avatar="item.avatar"
      @click="
        clickSearchItem({
          id: item.id,
          item: item.title,
        })
      "
    >
      <template #title>
        <div style="display: flex; justify-content: space-between; width: 100%">
          <div v-if="item.title.indexOf(searchText) !== -1">
            <span>{{
              item.title.substring(0, item.title.indexOf(searchText))
            }}</span>
            <b>{{
              item.title.substring(
                item.title.indexOf(searchText),
                item.title.indexOf(searchText) + searchText.length
              )
            }}</b>
            <span>{{
              item.title.substring(
                item.title.indexOf(searchText) + searchText.length
              )
            }}</span>
          </div>
          <div v-else>{{ item.title }}</div>
          <span v-if="item.isFuzzy">
            <b style="font-size: small; color: gray"
              >关联词:{{ item.fuzzyWord }}
            </b>
          </span>
        </div>
      </template>

      <template #subtitle>
        <div v-if="item.subtitle.indexOf(searchText) !== -1">
          <span>{{
            item.subtitle.substring(0, item.subtitle.indexOf(searchText))
          }}</span>
          <b>{{
            item.subtitle.substring(
              item.subtitle.indexOf(searchText),
              item.subtitle.indexOf(searchText) + searchText.length
            )
          }}</b>
          <span>{{
            item.subtitle.substring(
              item.subtitle.indexOf(searchText) + searchText.length
            )
          }}</span>
        </div>
        <div v-else>{{ item.subtitle }}</div>
      </template>
    </v-list-item>

    <div
      class="sticky-footer"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap; /* 内容换行 */
        min-height: 45px; /* 最小高度 */
        padding-bottom: 5px;
      "
    >
      <span style="margin: 10px; white-space: nowrap">猜你想搜</span>
      <span
        v-for="(item, index) in FuzzySearchResStore.searchShow"
        :key="index"
        style="
          margin-left: 10px;
          margin-right: 10px;
          color: rgb(16, 104, 191);
          white-space: nowrap;
        "
        @click="emit('changeFatherSearchText', item.title)"
      >
        {{ item.title }}
      </span>
    </div>
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
        @click="
          emit('changeFatherSearchText', item);
          debouncedWatchHandler(item);
        "
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
import { FuzzyItem } from "@/stores/searchPage/fuzzySearchRes";

const showStore = useComponentsShowStore();
const emit = defineEmits(["changeFatherSearchText"]);

let historyListClosable = ref<boolean>(false);

const dataStore = useComponentsSearchItemStore();
const FuzzySearchResStore = useComponentsFuzzyShowStore();
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

interface clickPara {
  item: string;
  id: number;
}

function clickSearchItem(config: clickPara) {
  console.log("点击了搜索结果", config.item);
  updateHistoryListStorage(props.searchText);
  router.push({ path: `/item/${config.id}` });
  // router.push({path: `/item/${item.id}`});
}

// DEMO 模拟搜索加载时间
let loadingAttr = ref(true);
setTimeout(() => {
  loadingAttr.value = false;
}, 500);

// 搜索关键词并渲染搜索结果
import { debounce } from "lodash"; // 引入防抖函数
import { useComponentsFuzzyShowStore } from "@/stores/searchPage/fuzzySearchRes";
import { interpreterDirective } from "@babel/types";
import { fa } from "vuetify/locale";

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

    let templist: SearchRes = await getFuzzySearchAns(query);
    dataStore.title.length = 0;
    FuzzySearchResStore.searchShow.length = 0;
    for (let word of templist.accurate) {
      dataStore.title.push({
        id: word.id,
        title: word.title,
        subtitle: word.description,
        avatar: `http://www.zhongyoo.com/${word.picUrl}`,
        fuzzyWord: word.word,
        isFuzzy: false,
      });
    }
    for (let word of templist.fuzzy) {
      FuzzySearchResStore.searchShow.push({
        title: word,
      });
    }
    for (let word of templist.ETCM){
      dataStore.title.push({
        id: word.id,
        title: word.recipeName,
        subtitle: word.prescriptionIngredients,
        avatar: '',
        fuzzyWord: '',
        isFuzzy: false,
      })
    }
    for(let word of templist.ETCMHerbs) {
      dataStore.title.push({
        id: word.id,
        title: word.name,
        subtitle: word.nature,
        avatar: '',
        fuzzyWord: '',
        isFuzzy: false,
      })
    }
    dataStore.title.sort((a, b) => {
      if (a.title === query) {
        return -1;
      } else if (a.title.indexOf(query) !== -1) {
        return -1;
      } else {
        return 1;
      }
    });
    for (let i = 0; i < dataStore.title.length; i++) {
      if (dataStore.title[i].title === query) {
        dataStore.title.unshift(dataStore.title[i]);
        dataStore.title.splice(i + 1, 1);
        break;
      }
    }


    // dataStore.title.sort((a, b) => (a.fuzzyWord === query ? -1 : 1));
    // console.log("加载的标题：", dataStore.title);
    // console.log("fuzzy搜索结果：", FuzzySearchResStore.searchShow);
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

interface ETCMRes {
  id: number;
  recipeName: string;
  prescriptionIngredients: string;
}

interface ETCMHerbsRes {
  id: number;
  name: string;
  nature: string;
}

// 搜索结果返回类型
interface SearchRes {
  accurate: AccurateSearchRes[];
  fuzzy: string[];
  ETCM: ETCMRes[]; // 古籍方剂匹配结果
  ETCMHerbs: ETCMHerbsRes[];
}

interface AccurateSearchRes {
  id: number;
  word: string;
  indexValue: number;
  title: string;
  description: string;
  picUrl: string;
  isFuzzy: boolean;
}

// 真实模糊搜索接口调用
async function getFuzzySearchAns(
  searchWord: string,
  url: string = `${import.meta.env.VITE_IP}:${
    import.meta.env.VITE_BACKEND_PORT
  }/api/v1/search?wd=`
): Promise<SearchRes> {
  console.log("发起搜索：", url + searchWord);
  try {
    url = url + searchWord;
    const res = await fetch(url, { method: "GET" });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      accurate: [],
      fuzzy: [],
      ETCM: [],
      ETCMHerbs: []
    }; // 如果出现错误，可以返回一个空数组
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
  width: 0px; /* 设置滚动条宽度为0 */
  background: transparent; /* 可选：设置背景透明 */
}

.v-list::-webkit-scrollbar-thumb {
  background: transparent; /* 可选：设置滚动条滑块透明 */
}

.sticky-footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  background-color: white;
  z-index: 1;
  border-radius: 10px;
  overflow: hidden;
}
</style>
