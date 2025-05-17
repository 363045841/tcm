<template>
  <div style="padding: 20px;">
    <!-- 编辑/保存按钮 -->
    <div v-if="props.isEditMode" style="margin-bottom: 20px;">
      <button class="edit-mode-button" @click="submitEdit" style="margin-left: 10px;">保存</button>
    </div>

    <!-- 中药图片 -->
    <div style="display: flex; justify-content: center;">
      <img :src="`https://www.zyysjk.xyz/api/v1/oss/get-image?filePath=zyysjk/downloaded_images/${ID}.jpg`" alt="中药图片"
        style="max-width: 50vh; margin-top: 20px; margin-bottom: 20px;" />
    </div>

    <!-- 相关内容 -->
    <b>相关内容</b>
    <span v-for="(item, index) in relation" :key="index"
      style="margin-left: 10px; color: rgb(16, 104, 191); cursor: pointer;" @click="clickRelation(item.related_tcm_id)"
      class="underline-on-hover">
      {{ item.tcmName }}
    </span>

    <!-- 动态渲染字段 -->
    <div v-for="([key, value], index) in Object.entries(propertyMap)" :key="index">
      <h2 v-if="index >= 1" style="line-height: 2">{{ value }}</h2>

      <!-- 展示模式 -->
      <template v-if="!props.isEditMode">
        <span v-if="
          index >= 1 &&
          computedRelationMap.get(key)?.length === 0 &&
          chineseMedicineData[key as keyof typeof chineseMedicineData] !== null
        " style="line-height: 2">
          {{ chineseMedicineData[key as keyof typeof chineseMedicineData] }}
        </span>

        <span v-else-if="index >= 1" v-for="[name, posStart, posEnd] in computedRelationMap.get(key)" :key="posStart"
          style="line-height: 2">
          <span>{{
            chineseMedicineData[key as keyof typeof chineseMedicineData].substring(posStart, posEnd)
          }}</span>
          <span style="color: rgb(16, 104, 191)" @click="clickRelationLinkText(name)" class="underline-on-hover">{{
            name }}</span>
        </span>
      </template>

      <!-- 编辑模式 -->
      <template v-else>
        <textarea v-if="[
          'description',
          'effect',
          'class',
          'application',
          'component',
          'research',
          'note',
          'prescription'
        ].includes(key)" v-model="editingData[key]" style="width: 100%; height: 100px; margin-top: 10px;"></textarea>
        <input v-else type="text" v-model="editingData[key]" style="width: 100%; margin-top: 10px;" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { eventBus } from "@/utils/eventBus";
import { useInfoStore } from "@/stores/infoPage/info";

// 接口定义
interface routerParams {
  id: number;
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

export interface RelatedInfoFinalRes {
  related_tcm_id: number;
  tcmName: string;
}

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

// 接收父组件传入的 isEditMode
const props = defineProps<{
  isEditMode: boolean;
}>();

// 定义 emits
const emit = defineEmits<{
  (e: "update:is-edit-mode", value: boolean): void;
  (e: "update-pic-url", url: string): void;
}>();

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

const editingData = ref<MedicineData>({
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

const router = useRouter();
const route = useRoute();
const infoStore = useInfoStore();

const ID = (route.params as routerParams).id;

// 发送图片 URL 到父组件
const sendPicUrl = (url: string) => {
  emit("update-pic-url", url);
};

// 获取中药信息
async function getMedicineInfo(id: number) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_IP}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/medinfo/page/${id}`
    );
    const data = await response.json();
    infoStore.tcmName = data.tcmName;
    console.log("更新了名字！", infoStore.tcmName);

    // 更新响应式数据
    for (const key in chineseMedicineData.value) {
      chineseMedicineData.value[key as keyof MedicineData] = data[key];
    }

    sendPicUrl(data.pic);
  } catch (error) {
    console.error("Fetch 错误:", error);
  }
}

// 点击相关内容跳转
async function clickRelation(id: number) {
  await getMedicineInfo(id);
  await router.push({ path: `/item/${id}` });
  eventBus.emit("updateRouterViewKey");
}

// 处理点击关联文本
function clickRelationLinkText(name: string) {
  for (const item of toRaw(relation.value)) {
    if (item.tcmName === name) {
      clickRelation(item.related_tcm_id);
    }
  }
}

// 计算关系映射（用于高亮和超链接）
let computedRelationMap: Map<string, Array<[string, number, number]>> = new Map();
function calcItemRelationInfo(relation: RelatedInfoFinalRes[]): void {
  computedRelationMap.clear();
  for (const key in propertyMap) {
    let posMap: Map<string, number> = new Map();
    const fieldValue = chineseMedicineData.value[key as keyof MedicineData];
    for (const item of relation) {
      const pos = fieldValue.indexOf(item.tcmName);
      if (pos !== -1) {
        posMap.set(item.tcmName, pos);
      }
    }

    const sortedArray = Array.from(posMap.entries()).sort((a, b) => a[1] - b[1]);
    let currentPos = 0;
    let finalSortedArray: Array<[string, number, number]> = [];
    for (const [name, pos] of sortedArray) {
      finalSortedArray.push([name, currentPos, pos]);
      currentPos = pos + name.length;
    }
    finalSortedArray.push(["", currentPos, fieldValue.length]);
    computedRelationMap.set(key, finalSortedArray);
  }
}

// 提交编辑后的数据
async function submitEdit() {
  try {
    const url = `${import.meta.env.VITE_IP}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/medinfo/update/zhongyoo/${ID}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editingData.value),
    });

    const data = await response.json();
    console.log('data', data);


    if (response.ok) {
      alert("保存成功！");
      chineseMedicineData.value = { ...editingData.value };
      emit("update:is-edit-mode", false);
    } else {
      alert(`保存失败：${data.message || '未知错误'}`);
    }
  } catch (error) {
    console.error("提交错误:", error);
    alert("网络错误，请检查连接");
  }
}

// 获取相关药材
let relation = ref<RelatedInfoFinalRes[]>([]);
onMounted(async () => {
  document.body.style.overflow = "auto";
  await getMedicineInfo(ID);
  relation.value = await getMedicineRelation(ID);
  calcItemRelationInfo(toRaw(relation.value));
  eventBus.emit("sendRelation", toRaw(relation.value));
  eventBus.emit("sendMedName", chineseMedicineData.value.tcmName);
  eventBus.on("clickMedNameGraph", (id: number) => {
    console.log("收到了图点击!", id);
    clickRelation(id);
  });
});

onUnmounted(() => {
  eventBus.off("clickMedNameGraph");
});

async function getMedicineRelation(id: number): Promise<RelatedInfoFinalRes[]> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_IP}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/item-page/relation?id=${id}`
    );
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("获取相关药材信息失败:", error);
    return [];
  }
}

// 当进入编辑模式时，复制当前数据到 editingData
watch(
  () => props.isEditMode,
  (newVal) => {
    if (newVal) {
      editingData.value = { ...chineseMedicineData.value };
    }
  }
);
</script>

<style>
.underline-on-hover:hover {
  text-decoration: underline;
  color: #1068bf;
  cursor: pointer;
}

.edit-mode-button {
  padding: 6px 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-mode-button:hover {
  background-color: #369d6b;
}
</style>