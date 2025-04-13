<template>
  <v-container>
    <!-- 搜索框 -->
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
    <v-row justify="start" v-if="herbsCount.length > 0">
      <h2 class="title">包含该药材的方剂</h2>
      <v-data-table :items="herbsCount" :headers="includeHeaders" class="mt-4" items-per-page-text="每页显示条数："
        :pageText="'{0} - {1} 共 {2} 项'"></v-data-table>
    </v-row>
    <v-row v-if="natureItem.length > 0">
      <h2 class="title">统计图表</h2>
    </v-row>
    <v-row style="margin-bottom: -24px">
      <v-col cols="6" style="padding: 0px">
        <v-switch v-if="natureItem.length > 0" color="indigo" hide-details v-model="isMergeTinyNatureAttribute"
          style="margin-left: 12px">
          <template v-slot:label>
            <b style="font-size: 14px;color: #808080;">合并次级属性</b>
          </template>
        </v-switch>
      </v-col>
      <v-col cols="6" style="padding: 0px">
        <v-switch v-if="tasteItem.length > 0" color="indigo" hide-details v-model="isMergeTinyTasteAttribute"
          style="margin-left: 12px">
          <template v-slot:label>
            <b style="font-size: 14px;color: #808080;">合并次级属性</b>
          </template>
        </v-switch>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="6" class="text-center" v-if="natureItem.length > 0">
        <radar-chart :item="natureItem" title="配伍药材四气统计"></radar-chart>
      </v-col>
      <v-col cols="6" v-if="tasteItem.length > 0">
        <radar-chart :item="tasteItem" title="配伍药材六味统计"></radar-chart>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6" v-if="functionCountItem.length > 0">
        <pie-chart :item="functionCountItem" :limit="10" title="配伍药材功效统计"></pie-chart>
      </v-col>
      <v-col cols="6" v-if="functionCountItemProp.length > 0">
        <bar-chart :item="functionCountItemProp" title="配伍药材功效统计" :limit="15"></bar-chart>
      </v-col>
    </v-row>
    <v-row justify="end" v-if="functionCountItem.length > 0">
      <v-col cols="6">
        <v-range-slider :min="0" :max="functionCountItem.length" :step="1" v-model="range" @end="freshRange"
          @start="setTempRange" label="选择区间"></v-range-slider>
      </v-col>
    </v-row>
    <v-row v-if="ruleItem.length > 0" align="center">
      <h2 class="title">药材关联规则</h2>
    </v-row>
    <v-row v-if="ruleItem.length > 0" align="center" justify="center">
      <v-col cols="3" class="d-flex align-center">
        <span style="margin-right: 10px;">支持度 (support)</span>
        <input-number id="inputNumber" :min="0" :max="1" :step="0.1" v-model:value="ruleSupport" />
      </v-col>
      <v-col cols="4" class="d-flex align-center">
        <span style="margin-right: 10px;">置信度 (confident)</span>
        <input-number id="inputNumber" :min="0" :max="1" :step="0.1" v-model:value="ruleConfidence" />
        <v-tooltip location="bottom">
          <template #activator="{ props }">
            <v-icon v-bind="props" class="ml-2" style="margin-left: 16px !important;" @click="refreshRuleTable">
              mdi-refresh
            </v-icon>
          </template>
          <span>重新计算</span>
        </v-tooltip>
        <v-tooltip location="bottom">
          <template #activator="{ props }">
            <v-icon v-bind="props" class="ml-2" style="margin-left: 16px; cursor: pointer;">
              mdi-information-outline
            </v-icon>
          </template>
          <span>
            <b>support</b> 参数表示某一配伍组合在所有药方中出现的频率，<br />
            它决定了只有当某组合达到预设的出现比例时，才会被视为有效规则，从而反映其普遍性。<br />
            <b>confident</b> 参数衡量在某种药材出现时其他药材同时出现的概率，<br />
            它影响筛选出的规则的可靠性和强度；设定较高值可以确保提取出更核心、稳定的配伍规则，但也可能降低挖掘潜在有价值组合的数量。
          </span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader type="table" :loading="isLoadingRule">
          <v-data-table v-if="ruleItem.length > 0" :items="ruleItem" :headers="ruleHeaders" class="mt-4"
            items-per-page-text="每页显示条数：" :pageText="'{0} - {1} 共 {2} 项'" :key="ruleDataTableKey">
          </v-data-table>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <v-row justify="center">
      <rule-graph v-if="ruleItem.length > 0" :item="ruleItem" :limit="5" :name="herbInput"
        style="width: 100%;"></rule-graph>
    </v-row>
  </v-container>
  <v-snackbar v-model="isSearching">
    数据量较大时，FP_Growth关联规则计算需要5-10秒，请耐心等待...
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { InputNumber } from "ant-design-vue";

onMounted(() => {
  document.body.style.overflow = "auto";
});

interface CountItem {
  name: string;
  count: number;
}

export interface ruleRes {
  ruleBefore: string;
  ruleAfter: string;
  support: string;
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
const isSearching = ref<boolean>(false);
const isLoadingStandardInfo = ref<boolean>(false);
const isMergeTinyNatureAttribute = ref<boolean>(false);
const oldNatureCountItem = ref<CountItem[]>([]);
const isMergeTinyTasteAttribute = ref<boolean>(false);
const oldTasteCountItem = ref<CountItem[]>([]);
const range = ref([0, 15]);

// 监控合并次级属性的开关
watch(isMergeTinyNatureAttribute, (newValue) => {
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

watch(isMergeTinyTasteAttribute, (newValue) => {
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
  { title: "支持度", key: "support" },
  { title: "置信度", key: "confidence" },
  { title: "提升度", key: "lift" },
  { title: "匹配数量", key: "count" },
];

// radarChart 相关数据
let natureItem = ref<CountItem[]>([]);
let tasteItem = ref<CountItem[]>([]);
let functionCountItem = ref<CountItem[]>([]);
let functionCountItemProp = ref<CountItem[]>([]);
let ruleItem = ref<ruleRes[]>([]);
let isLoadingRule = ref<boolean>(false);
let ruleDataTableKey = ref<number>(0);
let ruleSupport = ref<number>(0.3);
let ruleConfidence = ref<number>(0.1);

async function searchHerbs(query: string) {
  if (!query) return;
  isSearching.value = true;
  isLoadingStandardInfo.value = true;
  isLoadingRule.value = true;
  try {
    const response: searchRes = await fetch(
      `${import.meta.env.VITE_IP}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/etcm/mineCount/${query}`
    )
      .then((res) => res.json())
      .then((data) => {
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
      `${import.meta.env.VITE_IP}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/etcm/mineRule/${query}?confident=${ruleConfidence.value}&support=${ruleSupport.value}`
    ).then((res) => res.json());
    console.log(ruleRes);
    console.log("herbsCount.value", response.count);
    ruleItem.value = ruleRes;
    ruleDataTableKey.value += 1;
  } catch (error) {
    console.error("请求失败", error);
  } finally {
    isSearching.value = false;
    isLoadingStandardInfo.value = false;
    isLoadingRule.value = false;
  }
}

async function refreshRuleTable() {
  // 若当前输入为空则直接返回
  if (!herbInput.value) return;
  ruleItem.value.length = 0;
  isLoadingRule.value = true;

  try {
    const response: ruleRes[] = await fetch(
      `${import.meta.env.VITE_IP}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/etcm/mineRule/${herbInput.value}?confident=${ruleConfidence.value}&support=${ruleSupport.value}`
    ).then((res) => res.json());
    ruleItem.value = response;
    ruleDataTableKey.value += 1;
  } catch (error) {
    console.error("规则数据请求失败", error);
  } finally {
    isLoadingRule.value = false;
  }
}
</script>

<style scoped>
.title {
  margin-left: 12px;
}
</style>
