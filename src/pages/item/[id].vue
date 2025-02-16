<template>
  <v-row style="width: 60%; margin: 5vh" class="d-flex flex-nowrap">
    <v-col cols="10" style="margin-left: 10vh">
      
      <Info @updatePicUrl="handlePicUrl" :relation="relation"></Info>
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

<script setup lang="ts" name="">
import Info from "@/components/item/info.vue";
import { ref } from "vue";

export interface RelatedInfoFinalRes {
  related_tcm_id: number;
  tcmName: string;
}

let relation = ref<RelatedInfoFinalRes[]>([]);
const route = useRoute();

const item_id = route.params as { id?: string };
getMedicineRelattion(Number(item_id.id));

function getMedicineRelattion(id: number) {
  fetch(
    `http://${import.meta.env.VITE_IP}:${
      import.meta.env.VITE_BACKEND_PORT
    }/api/v1/item-page/relation?id=${id}`
  )
    .then((res) => res.json())
    .then((data: RelatedInfoFinalRes[]) => {
      console.log("data", data);
      relation.value = data;
      console.log("relation", relation);
    });
}



const picUrl = ref("");

const handlePicUrl = (url: string) => {
  picUrl.value = url;
};
</script>
<style scoped></style>
