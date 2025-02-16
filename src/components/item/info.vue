<template>
  <div>
    <span>相关内容</span>
    <span
      v-for="(item, index) in relation"
      :key="index"
      style="margin-left: 10px; color: rgb(16, 104, 191)"
      @click="clickRelation(item.related_tcm_id)"
    >
      {{ item.tcmName }}
    </span>
  </div>
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
import { useRouter, useRoute } from "vue-router";
import { eventBus } from "@/utils/eventBus";

// 路由参数接口
interface routerParams {
  id: number;
}

// 响应式数据
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
  prescription: "",
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

// 接收父组件传递的属性
const props = defineProps(["relation"]);
const emit = defineEmits(["updatePicUrl"]);
const router = useRouter();
const route = useRoute();

// 发送图片 URL 到父组件
const sendPicUrl = (url: string) => {
  emit("updatePicUrl", url);
};

const ID = (route.params as routerParams).id;

// 获取中药信息
async function getMedicineInfo(id: number) {
  try {
    const response = await fetch(
      `http://${import.meta.env.VITE_IP}:${
        import.meta.env.VITE_BACKEND_PORT
      }/api/v1/medinfo/page/${id}`
    );
    const data = await response.json();

    // 更新响应式数据
    for (const key in chineseMedicineData.value) {
      chineseMedicineData.value[key as keyof MedicineData] = data[key];
    }
    sendPicUrl(data.pic);
  } catch (error) {
    console.error("Fetch 错误:", error);
  }
}

// 点击相关内容，导航到相应页面
async function clickRelation(id: number) {
  // 获取相关药材信息
  await getMedicineInfo(id);

  // 数据更新完成后跳转
  await router.push({ path: `/item/${id}` });
  eventBus.emit("updateUUID");
}

// 获取相关信息
let relationInfo: Map<string, number[]> = new Map();
function calcItemRelationInfo(relation: RelatedInfoFinalRes[]): void {
  for (let item in relation) {
    for (let key in propertyMap) {
      if (key === "pic") continue;
      let pos =
        chineseMedicineData.value[key as keyof MedicineData].indexOf(item);
      if (pos !== -1) {
        let temp = relationInfo.get(key);
        if (temp === undefined) temp = [];
        temp.push(pos);
        relationInfo.set(key, temp);
      }
    }
  }
}

// 在组件挂载时获取数据
onMounted(() => {
  document.body.style.overflow = "auto"; // 恢复滚动条
  getMedicineInfo(ID);
  calcItemRelationInfo(props.relation);
});

// 模拟的数据类型
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
  prescription: string;
}

import { RelatedInfoFinalRes } from "@/pages/item/[id].vue";
</script>
