<template>
  <v-container>
    <v-text-field
      v-model="herbInput"
      clearable
      label="请输入药材名称"
      variant="outlined"
      style="width: 40%; margin-top: 40px; margin-left: 40px"
    ></v-text-field>
    <v-btn @click="searchHerbs(herbInput)" class="ml-4">搜索</v-btn>

    <v-data-table
      v-if="herbsCount.length > 0"
      :items="herbsCount"
      :headers="headers"
      class="mt-4"
    ></v-data-table>
    <p v-else class="mt-4 text-center">暂无数据</p>
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
  { title: "药材名称", key: "name" },
  { title: "数量", key: "count" },
];

interface Item {
  name: string;
  count: number;
}

async function searchHerbs(query: string) {
  if (!query) return;

  try {
    let items: Item[] = [];
    const response = await fetch(
      `http://${import.meta.env.VITE_IP}:${
        import.meta.env.VITE_BACKEND_PORT
      }/api/v1/etcm/mineCount/${query}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        herbsCount.value = data;

      });

    console.log(herbsCount.value);
  } catch (error) {
    console.error("请求失败", error);
  }
}
</script>

<style scoped></style>
