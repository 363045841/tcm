<template>
  <v-container>
    <v-row justify="center" style="margin-bottom: 0px">
      <v-col cols="8" style="margin-top: 20px">
        <v-text-field
          v-model="herbInput"
          clearable
          rounded
          label="请输入药材名称"
          variant="outlined"
          :hide-details="true"
        >
          <template #append-inner>
            <v-tooltip text="搜索" location="bottom">
              <template #activator="{ props }">
                <img
                  v-bind="props"
                  class="icon"
                  src="@/assets/icon/search.svg"
                  alt="search"
                  style="height: 24px; margin-right: 8px"
                  @click="searchHerbs(herbInput)"
                />
              </template>
            </v-tooltip>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-data-table
        v-if="herbsCount.length > 0"
        :items="herbsCount"
        :headers="headers"
        class="mt-4"
      >
      </v-data-table>
    </v-row>
    <v-row justify="center">
      <v-col cols="6" class="text-center" v-if="natureItem.length > 0"
        ><radar-chart :item="natureItem" title="配伍药材四气统计"></radar-chart>
      </v-col>
      <v-col cols="6" v-if="tasteItem.length > 0">
        <radar-chart :item="tasteItem" title="配伍药材六味统计"></radar-chart>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="6" v-if="functionCountItem.length > 0">
        <pie-chart :item="functionCountItem" :limit="10" title="配伍药材功效统计"></pie-chart>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface HerbsCount {
  name: string;
  count: number;
}

const herbsCount = ref<HerbsCount[]>([]);
const herbInput = ref<string>("");

const headers = [
  { title: "药方名称", key: "recipe_name" },
  { title: "药材成分", key: "prescription_ingredients" },
];

interface CountItem {
  name: string;
  count: number;
}

interface natureCount {
  name: string;
  count: number;
}
interface tasteCount {
  name: string;
  count: number;
}
interface functionCount {
  name: string;
  count: number;
}

interface searchRes {
  count: CountItem[];
  natureCount: natureCount[];
  tasteCount: tasteCount[];
  functionCount: functionCount[];
}

// radarProps
let natureItem = ref<natureCount[]>([]);
let tasteItem = ref<tasteCount[]>([]);
let functionCountItem = ref<functionCount[]>([]);

async function searchHerbs(query: string) {
  if (!query) return;

  try {
    const response: searchRes = await fetch(
      `http://${import.meta.env.VITE_IP}:${
        import.meta.env.VITE_BACKEND_PORT
      }/api/v1/etcm/mineCount/${query}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        herbsCount.value = data;
        return data;
      });

    herbsCount.value = response.count;
    natureItem.value = response.natureCount;
    tasteItem.value = response.tasteCount;
    functionCountItem.value = response.functionCount;
    console.log(functionCountItem.value);
  } catch (error) {
    console.error("请求失败", error);
  }
}
</script>

<style scoped></style>
