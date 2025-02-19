<template>
  <b>相关内容</b>
  <span
    v-for="(item, index) in relation"
    :key="index"
    style="margin-left: 10px; color: rgb(16, 104, 191)"
    @click="clickRelation(item.related_tcm_id)"
    class="underline-on-hover"
  >
    {{ item.tcmName }}
  </span>

  <!-- 药材详情页主要内容 -->
  <div
    v-for="([key, value], index) in Object.entries(propertyMap)"
    :key="index"
  >
    <h2 v-if="index >= 1" style="line-height: 2">{{ value }}</h2>
    <span
      v-if="index >= 1 && computedRelationMap.get(key)?.length === 0"
      style="line-height: 2"
      >{{ chineseMedicineData[key as keyof typeof chineseMedicineData] }}</span
    >

    <span
      v-else="index >= 1 && computedRelationMap.get(key)?.length !== 0"
      v-for="[name, posStart, posEnd] in computedRelationMap.get(key)"
      style="line-height: 2"
    >
      <span v-if="index >= 1">{{
        chineseMedicineData[key as keyof typeof chineseMedicineData].substring(
          posStart,
          posEnd
        )
      }}</span>
      <span
        style="color: rgb(16, 104, 191)"
        @click="clickRelationLinkText(name)"
        class="underline-on-hover"
        >{{ name }}</span
      >
    </span>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { eventBus } from "@/utils/eventBus";

function clickRelationLinkText(name: string) {
  for (const item of toRaw(relation.value)) {
    if (item.tcmName === name) {
      clickRelation(item.related_tcm_id);
    }
  }
}

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

// let relationInfo: Map<string, Map<string, number>[]> = new Map(); // <key,name,pos>
let computedRelationMap: Map<
  string,
  Array<[string, number, number]>
> = new Map(); // <key, [name,BeforeTextStartPos,EndTextPos]>
function calcItemRelationInfo(relation: RelatedInfoFinalRes[]): void {
  // 更新 relationInfo
  for (const key in propertyMap) {
    let posMap: Map<string, number> = new Map(); // <name, StartPos>
    const fieldValue = chineseMedicineData.value[key as keyof MedicineData];
    for (const item of relation) {
      let pos = fieldValue.indexOf(item.tcmName);
      if (pos !== -1) {
        posMap.set(item.tcmName, pos);
      }
    }
    // 将超链接按照起始位置排序
    const sortedArray = Array.from(posMap.entries()).sort(
      (a, b) => a[1] - b[1]
    );
    // WARN: 考虑对相同起始位置做去重取长处理
    let currentPos = 0;
    let finalSortedArray: Array<[string, number, number]> = [];
    for (const [name, pos] of sortedArray) {
      finalSortedArray.push([name, currentPos, pos]);
      currentPos = pos + name.length;
    }
    finalSortedArray.push(["", currentPos, fieldValue.length]);
    computedRelationMap.set(key, finalSortedArray);
  }
  console.log(computedRelationMap);
}

// 在组件挂载时获取数据
let relation = ref<RelatedInfoFinalRes[]>([]);
onMounted(async () => {
  document.body.style.overflow = "auto"; // 恢复滚动条
  await getMedicineInfo(ID);
  relation.value = await getMedicineRelation(ID);
  calcItemRelationInfo(toRaw(relation.value));
});

async function getMedicineRelation(id: number): Promise<RelatedInfoFinalRes[]> {
  try {
    const response = await fetch(
      `http://${import.meta.env.VITE_IP}:${
        import.meta.env.VITE_BACKEND_PORT
      }/api/v1/item-page/relation?id=${id}`
    );
    let data = await response.json();
    if (data !== undefined) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("获取相关药材信息失败:", error);
  }
  return [];
}

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
<style>
.underline-on-hover {
  cursor: pointer; /* 鼠标悬停时显示手型 */
}

.underline-on-hover:hover {
  text-decoration: underline; /* 悬停时显示下划线 */
}
</style>
