<template>
  <div style="margin-left: 45vh; margin-right: 45vh">
    <img :src="'http://www.zhongyoo.com/uploads/allimg/131207/1-13120F9504V92.jpg'" alt="" />
    <div
      v-for="([key, value], index) in Object.entries(propertyMap)"
    >
      <h2 style="line-height: 2;">{{ value }}</h2>
      <p style="line-height: 2;">
        {{ chineseMedicineData[key as keyof MedicineData] }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { fetchItemData } from "@/mocks/item";
import { keyBy } from "lodash";

onMounted(() => {
  console.log(
    fetchItemData(1).then((res) => {
      console.log("mock data", res);
      // 使用 .value 来访问 ref 内部的值
      for (const key in chineseMedicineData.value) {
        chineseMedicineData.value[key as keyof MedicineData] = res.data[key];
      }
      console.log("update local chineseMedicineData", chineseMedicineData.value);
    })
  );
});

// 定义一个响应式变量存储 Markdown 文本
const markdown = ref<string>("# Hello Markdown\nThis is **markdown** content.");

const propertyMap = {
  pic: "图片",
  chinese_medicine_name: "中药名",
  alias: "别名",
  english_name: "英文名",
  source: "来源",
  form: "形态",
  distribution: "分布区域",
  processing: "炮制方法",
  properties: "性味",
  efficacy_and_function: "功效与作用",
  properties_and_meridian_tropism: "性味归经",
  clinical_application: "临床应用",
  chemical_composition: "化学成分",
  pharmacological_study: "药理研究",
  usage_precautions: "使用注意",
  compatibility_and_prescription: "配伍与方剂",
};

export interface MedicineData {
  pic: string;
  chinese_medicine_name: string;
  alias: string;
  english_name: string;
  source: string;
  form: string;
  distribution: string;
  processing: string;
  properties: string;
  efficacy_and_function: string;
  properties_and_meridian_tropism: string;
  clinical_application: string;
  chemical_composition: string;
  pharmacological_study: string;
  usage_precautions: string;
  compatibility_and_prescription: string[];
}

const chineseMedicineData = ref<MedicineData>(
  {
    pic: "",
    chinese_medicine_name: "",
    alias: "",
    english_name: "",
    source: "",
    form: "",
    distribution: "",
    processing: "",
    properties: "",
    efficacy_and_function: "",
    properties_and_meridian_tropism: "",
    clinical_application: "",
    chemical_composition: "",
    pharmacological_study: "",
    usage_precautions: "",
    compatibility_and_prescription: [],
  }
);
</script>
