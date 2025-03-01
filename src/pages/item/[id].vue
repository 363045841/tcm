<template>
  <v-row style="width: 90%" class="d-flex flex-nowrap">
    <v-col cols="6" style="margin-left: 10vh">
      <Info @updatePicUrl="handlePicUrl"></Info>
    </v-col>
    <v-col cols="6" style="height: 80vh">
      <graph style="margin-top: 20px; margin-right: 20px"></graph>
      <!-- <img
        :src="`http://www.zhongyoo.com/${picUrl}`"
        alt="中药图片"
        style="max-width: 50vh"
      /> -->
       <v-table style="width: 70%; margin: auto; margin-bottom: 40px;">
        <thead>
          <tr>
            <th class="text-left" style="width: 30%;"><b>项目</b></th>
            <th class="text-left"><b>数据来自ETCM2.0</b></th>
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
      </v-table>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import Info from "@/components/item/info.vue";
import { ref, onMounted } from "vue";
import graph from "@/components/item/graph.vue";
import { eventBus } from "@/utils/eventBus";
import { useInfoStore } from "@/stores/infoPage/info";
import { ItemStyleMixin } from "echarts/types/src/model/mixin/itemStyle.js";
import { configConsumerProps } from "ant-design-vue/es/config-provider";

export interface RelatedInfoFinalRes {
  related_tcm_id: number;
  tcmName: string;
}

const picUrl = ref("");

const items = ref({
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

interface HerbFetchInfo {
  herbId: string;
  herbName: string;
  latinName: string;
  englishName: string;
  family: string;
  origin: string;
  collectionTime: string;
  usedPart: string;
  category: string;
  nature: string;
  taste: string;
  meridian: string;
  efficacy: string;
  appearance: string;
  specification: string;
  dbCrossRef: string;
  component: string;
  upperLimit: string;
  lowerLimit: string;
  unit: string;
  similarHerb: string;
  similarHerbNumber: string;
  similarGene: string;
  similarGeneNumber: string;
}

const chineseToEnglishMap = new Map([
  ["药材名", "herbName"],
  ["药材拉丁名", "latinName"],
  ["药材英文名", "englishName"],
  ["科", "family"],
  ["产地", "origin"],
  ["采集时间", "collectionTime"],
  ["药用部位", "usedPart"],
  ["中药材类别(按功效划分)", "category"],
  ["性", "nature"],
  ["味", "taste"],
  ["归经", "meridian"],
  ["功效", "efficacy"],
  ["性状", "appearance"],
  ["规格", "specification"],
  ["数据库交叉检索", "dbCrossRef"],
  ["成分", "component"],
  ["上限", "upperLimit"],
  ["下限", "lowerLimit"],
  ["单位", "unit"],
  ["相似中药材名", "similarHerb"],
  ["相似中药材值", "similarHerbNumber"],
  ["相似基因名", "similarGene"],
  ["相似基因值", "similarGeneNumber"]
]);

watch(
  () => infoStore.tcmName,
  async (newVal) => {
    console.log("发现了更新！",newVal);
    if (newVal !== "") {
      const etcmData: HerbFetchInfo = await geEtcmData(newVal);
      let etcmDataArray = Object.values(etcmData);
      etcmDataArray.shift();
      console.log(etcmDataArray);
      let i = 0;
      for (const key of chineseToEnglishMap.keys()) {
        items.value[key as keyof typeof items.value] = etcmDataArray[i++];
      }
      infoStore.tcmName = "";
    }
  }
);

async function geEtcmData(name: string) {
  let temp = await fetch(
    `http://${import.meta.env.VITE_IP}:${
      import.meta.env.VITE_BACKEND_PORT
    }/api/v1/etcm/${name}`
  ).then((res) => res.json());
  return temp;
}

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
