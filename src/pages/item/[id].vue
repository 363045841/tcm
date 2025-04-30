<template>
  <v-container style="margin-left: 0; margin-right: 0; padding-left: 0; padding-right: 0;" fluid>
    <v-row style="width: 90%" class="d-flex flex-nowrap">
      <v-col cols="7" style="margin-left: 10vh">
        <Info @updatePicUrl="handlePicUrl"></Info>
      </v-col>
      <v-col cols="5" style="height: 80vh">
        <graph style="margin-bottom: 16px; margin-top: 32px; max-height: 60vh;"></graph>
        <v-row justify="center">
          <v-btn variant="outlined" prepend-icon="mdi-database-search" @click="clickDataMine">
            数据挖掘
          </v-btn>
        </v-row>
        <v-row>
          <!-- <img
        :src="`http://www.zhongyoo.com/${picUrl}`"
        alt="中药图片"
        style="max-width: 50vh"
      /> -->
          <etcmList v-if="items.药材名" :items="items"></etcmList>
          <!-- <v-table style="width: 70%; margin: auto; margin-bottom: 40px">
        <thead>
          <tr>
            <th class="text-left" style="width: 30%"><b>项目</b></th>
            <th class="text-left"><b>数据来自&nbsp;ETCM2.0</b></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="([key, value], rowIndex) in Object.entries(items)"
            :key="rowIndex"
          >
            <td>{{ key }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </v-table> -->
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import Info from "@/components/item/info.vue";
import { ref, onMounted } from "vue";
import graph from "@/components/item/graph.vue";
import { useInfoStore } from "@/stores/infoPage/info";
import etcmList from "@/components/item/etcmList.vue";
import { ETCMData, useGetETCMData } from "@/utils/useGetETCMdata";
import router from "@/router";

export interface RelatedInfoFinalRes {
  related_tcm_id: number;
  tcmName: string;
}

const picUrl = ref("");

const items = ref<ETCMData>({
  药材名: "",
  药材拉丁名: "",
  药材英文名: "",
  科: "",
  产地: "",
  采集时间: "",
  药用部位: "",
  "中药材类别(按功效划分)": "",
  性: "",
  味: "",
  归经: "",
  功效: "",
  性状: "",
  规格: "",
  数据库交叉检索: "",
  成分: "",
  上限: "",
  下限: "",
  单位: "",
  相似中药材名: "",
  相似中药材值: "",
  相似基因名: "",
  相似基因值: "",
});

const infoStore = useInfoStore();

function clickDataMine() {
  console.log(infoStore.tcmName)
  router.push({
    path: '/datamine',
    query: { tcmName: infoStore.tcmName }
  });

}

watch(
  () => infoStore.tcmName,
  async (newVal) => {
    console.log("发现了更新！", infoStore.tcmName);
    if (newVal !== "") {
      const temp = await useGetETCMData(newVal);
      if (temp) {
        items.value = temp;
      }
      // infoStore.tcmName = "";
    }
  }
);

/* let etcmData = await  */

// 监听图片 URL 更新
const handlePicUrl = (url: string) => {
  picUrl.value = url;
};

// 在组件挂载后调用 API
onMounted(() => {
  /* const item_id = route.params as Partial<{ id: string }>; // ✅ 解决类型问题
  if (item_id.id) {
    getMedicineRelation(Number(item_id.id));
  } */
});
</script>

<style scoped></style>
