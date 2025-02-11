<template>
  <div>
    <div
      v-for="([key, value], index) in Object.entries(propertyMap)"
      :key="index"
    >
      <h2 v-if="index >= 1" style="line-height: 2">{{ value }}</h2>
      <p v-if="index >= 1" style="line-height: 2">
        {{ chineseMedicineData[key as keyof MedicineData] }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const emit = defineEmits(["updatePicUrl"]);

const sendPicUrl = (url: string) => {
  emit("updatePicUrl", url);
};

interface routerParams {
  id: number;
}

onMounted(() => {
  document.body.style.overflow = "auto";

  const router = useRoute();
  const ID = (router.params as routerParams).id;
  fetch(
    `http://${import.meta.env.VITE_IP}:${
      import.meta.env.VITE_BACKEND_PORT
    }/api/v1/medinfo/page/${ID}`
  )
    .then((res) => res.json()) // 解析 JSON 只调用一次
    .then((data) => {
      return data;
    })
    .then((res) => {
      for (const key in chineseMedicineData.value) {
        chineseMedicineData.value[key as keyof MedicineData] = res[key];
      }
      sendPicUrl((res as MedicineData).pic);
    })
    .catch((error) => console.error("Fetch 错误:", error));

  /* .then((res) => {
      for (const key in chineseMedicineData.value) {
        chineseMedicineData.value[key as keyof MedicineData] = res[key];
      }
    }); */
  // mock数据生成:
  /* fetchItemData(1).then((res) => {
      for (const key in chineseMedicineData.value) {
        chineseMedicineData.value[key as keyof MedicineData] = res.data[key];
      }
    }); */
});

const propertyMap = {
  pic: "图片",
  tcmName: "中药名",
  alias: "别名",
  enName: "英文名",
  source: "来源",
  shape: "形态",
  distribution: "分布区域",
  process: "炮制方法",
  description: "性味",
  effect: "功效与作用",
  class: "性味归经",
  application: "临床应用",
  component: "化学成分",
  research: "药理研究",
  note: "使用注意",
  prescription: "配伍与方剂",
};

export interface MedicineData {
  pic: string;
  tcmName: string;
  alias: string;
  enName: string;
  source: string;
  shape: string;
  distribution: string;
  process: string;
  description: string;
  effect: string;
  class: string;
  application: string;
  component: string;
  research: string;
  note: string;
  prescription: string[];
}

const chineseMedicineData = ref<MedicineData>({
  pic: "",
  tcmName: "",
  alias: "",
  enName: "",
  source: "",
  shape: "",
  distribution: "",
  process: "",
  description: "",
  effect: "",
  class: "",
  application: "",
  component: "",
  research: "",
  note: "",
  prescription: [],
});
</script>
