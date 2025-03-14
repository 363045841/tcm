<template>
  <v-container>
    <v-row justify="center" style="margin-bottom: 0px">
      <v-col cols="8" style="margin-top: 20px">
        <v-text-field v-model="herbInput" clearable rounded label="请输入药材名称，按回车或点击搜索按钮发起搜索" variant="outlined"
          :hide-details="true" @keydown.enter="searchHerbs(herbInput)">
          <template #append-inner>
            <v-tooltip text="搜索" location="bottom">
              <template #activator="{ props }">
                <img v-bind="props" class="icon" src="@/assets/icon/search.svg" alt="search"
                  style="height: 24px; margin-right: 8px" @click="searchHerbs(herbInput)" />
              </template>
            </v-tooltip>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-data-table v-if="herbsCount.length > 0" :items="herbsCount" :headers="includeHeaders" class="mt-4">
      </v-data-table>
    </v-row>
    <v-row style="margin-bottom: -24px">
      <v-col cols="6" style="padding: 0px">
        <v-switch v-if="natureItem.length > 0" color="indigo" hide-details v-model="isMergeTinyNatureAttribute">
          <template v-slot:label>
            <b style="font-size: 14px">合并次级属性</b>
          </template>
        </v-switch>
      </v-col>
      <v-col cols="6" style="padding: 0px">
        <v-switch v-if="tasteItem.length > 0" color="indigo" hide-details v-model="isMergeTinyTasteAttribute">
          <template v-slot:label>
            <b style="font-size: 14px">合并次级属性</b>
          </template>
        </v-switch>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="6" class="text-center" v-if=" natureItem.length > 0">
        <radar-chart :item="natureItem" title="配伍药材四气统计"></radar-chart>
        <!-- 是否一定要v-if重载?后续考虑优化 -->
      </v-col>
      <v-col cols="6" v-if=" tasteItem.length > 0">
        <radar-chart :item="tasteItem" title="配伍药材六味统计"></radar-chart>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6" v-if=" functionCountItem.length > 0">
        <pie-chart :item="functionCountItem" :limit="10" title="配伍药材功效统计"></pie-chart>
      </v-col>
      <v-col cols="6" v-if=" functionCountItemProp.length > 0">
        <bar-chart :item="functionCountItemProp" title="配伍药材功效统计" :limit="15"></bar-chart>
      </v-col>
    </v-row>
    <v-row justify="end" v-if=" functionCountItem.length > 0">
      <v-col cols="6">
        <v-range-slider :min="0" :max="functionCountItem.length" :step="1" v-model="range" @end="freshRange"
          @start="setTempRange" label="选择区间"></v-range-slider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader type="table" :loading="isSearching && ruleItem.length <= 0">
          <v-data-table v-if="ruleItem.length > 0" :items="ruleItem" :headers="ruleHeaders" class="mt-4">
          </v-data-table>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar v-model="isSearching">
    数据量较大时，Apriori关联规则计算需要5-10秒，请耐心等待...
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface CountItem {
  name: string;
  count: number;
}

interface ruleRes {
  ruleBefore: string;
  ruleAfter: string;
  confidence: string;
  lift: string;
  count: string;
}
interface searchRes {
  count: CountItem[];
  natureCount: CountItem[];
  tasteCount: CountItem[];
  functionCount: CountItem[];
}

const herbsCount = ref<CountItem[]>([]);
const herbInput = ref<string>("");
let isSearching = ref<boolean>(false);
let isLoadingStandardInfo = ref<boolean>(false);
let isMergeTinyNatureAttribute = ref<boolean>(false);
let oldNatureCountItem = ref<CountItem[]>([]);
let isMergeTinyTasteAttribute = ref<boolean>(false);
let oldTasteCountItem = ref<CountItem[]>([]);
let range = ref([0, 15]);

// PREF 这俩逆天watch考虑合并下？
watch(isMergeTinyNatureAttribute, (newValue, oldValue) => {
  if (newValue && natureItem.value.length > 0) {
    let tempNatureItemMap: Map<string, number> = new Map();
    natureItem.value.forEach((item) => {
      if (item.name[0] !== "微" && item.name[0] !== "大") {
        let temp = tempNatureItemMap.get(item.name[0]);
        if (temp !== undefined) {
          tempNatureItemMap.set(item.name[0], temp + item.count);
        } else {
          tempNatureItemMap.set(item.name[0], item.count);
        }
      } else {
        let temp = tempNatureItemMap.get(item.name[1]);
        if (temp !== undefined) {
          tempNatureItemMap.set(item.name[1], temp + item.count);
        } else {
          tempNatureItemMap.set(item.name[1], item.count);
        }
      }
    });
    oldNatureCountItem.value = natureItem.value;
    natureItem.value = Array.from(tempNatureItemMap.entries()).map(
      ([key, value]) => ({ name: key, count: value })
    );
  } else {
    natureItem.value = oldNatureCountItem.value;
  }
});

watch(isMergeTinyTasteAttribute, (newValue, oldValue) => {
  if (newValue && tasteItem.value.length > 0) {
    let tempTasteItemMap: Map<string, number> = new Map();
    tasteItem.value.forEach((item) => {
      if (item.name[0] !== "微") {
        let temp = tempTasteItemMap.get(item.name[0]);
        if (temp !== undefined) {
          tempTasteItemMap.set(item.name[0], temp + item.count);
        } else {
          tempTasteItemMap.set(item.name[0], item.count);
        }
      } else {
        let temp = tempTasteItemMap.get(item.name[1]);
        if (temp !== undefined) {
          tempTasteItemMap.set(item.name[1], temp + item.count);
        } else {
          tempTasteItemMap.set(item.name[1], item.count);
        }
      }
    });
    oldTasteCountItem.value = tasteItem.value;
    tasteItem.value = Array.from(tempTasteItemMap.entries()).map(
      ([key, value]) => ({ name: key, count: value })
    );
  } else {
    tasteItem.value = oldTasteCountItem.value;
  }
});

let barChartLimit = ref<number>(15);
let tempRange = [0, 15];
function setTempRange(value: number[]) {
  tempRange = value;
  console.log("tempRange", tempRange);
}

function freshRange(value: number[]) {
  if (value[1] > tempRange[1] && value[1] - value[0] > barChartLimit.value) {
    range.value[0] = value[1] - barChartLimit.value;
  } else if (
    value[0] < tempRange[0] &&
    value[1] - value[0] > barChartLimit.value
  ) {
    range.value[1] = value[0] + barChartLimit.value;
  }
  functionCountItemProp.value = functionCountItem.value.slice(
    range.value[0],
    range.value[1]
  );
  console.log("functionCountItemProp", functionCountItemProp.value);
}


const includeHeaders = [
  { title: "药方名称", key: "recipe_name" },
  { title: "药材成分", key: "prescription_ingredients" },
];

const ruleHeaders = [
  { title: "关联项A", key: "ruleBefore" },
  { title: "关联项B", key: "ruleAfter" },
  { title: "置信度", key: "confidence" },
  { title: "提升度", key: "lift" },
  { title: "匹配数量", key: "count" },
];

// radarProps
let natureItem = ref<CountItem[]>([]);
let tasteItem = ref<CountItem[]>([]);
let functionCountItem = ref<CountItem[]>([]);
let functionCountItemProp = ref<CountItem[]>([]);
let ruleItem = ref<ruleRes[]>([]);


async function searchHerbs(query: string) {
  if (!query) return;
  isSearching.value = true;
  isLoadingStandardInfo.value = true;
  try {
    const response: searchRes = await fetch(
      `${import.meta.env.VITE_IP}:${import.meta.env.VITE_BACKEND_PORT
      }/api/v1/etcm/mineCount/${query}`
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        herbsCount.value = data;
        return data;
      });

    herbsCount.value = response.count;
    natureItem.value = response.natureCount;
    oldNatureCountItem.value = response.natureCount;
    tasteItem.value = response.tasteCount;
    oldTasteCountItem.value = response.tasteCount;
    functionCountItem.value = response.functionCount;
    functionCountItemProp.value = functionCountItem.value;
    console.log("response.value", functionCountItem.value);
    isLoadingStandardInfo.value = false;

    const ruleRes: ruleRes[] = await fetch(
      `${import.meta.env.VITE_IP}:${import.meta.env.VITE_BACKEND_PORT
      }/api/v1/etcm/mineRule/${query}`
    ).then((res) => res.json());
    console.log(ruleRes);
    console.log("herbsCount.value", response.count);

    ruleItem.value = ruleRes;
  } catch (error) {
    console.error("请求失败", error);
  } finally {
    isSearching.value = false;
    isLoadingStandardInfo.value = false;
  }
}
</script>

<style scoped></style>
