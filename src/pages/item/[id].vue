<template>
  <v-row style="width: 60%; margin: 5vh" class="d-flex flex-nowrap">
    <v-col cols="10" style="margin-left: 10vh">
      <Info @updatePicUrl="handlePicUrl"></Info>
    </v-col>
    <v-col cols="2">
      <img
        :src="`http://www.zhongyoo.com/${picUrl}`"
        alt="中药图片"
        style="max-width: 50vh"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import Info from "@/components/item/info.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export interface RelatedInfoFinalRes {
  related_tcm_id: number;
  tcmName: string;
}

const route = useRoute();
let relation: RelatedInfoFinalRes[] = [];
const picUrl = ref("");

// 获取相关药材信息


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
