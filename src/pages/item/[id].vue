<template>
  <v-row style="width: 60%; margin: 5vh" class="d-flex flex-nowrap">
    <v-col cols="10" style="margin-left: 10vh">
      <Info @updatePicUrl="handlePicUrl"></Info>
    </v-col>
    <v-col cols="2">
      <img
        :src="`http://www.zhongyoo.com/${picUrl}`"
        alt="中药图片"
        style="margin-top: 10vh"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts" name="">
import Info from "@/components/item/info.vue";
import { ref, reactive } from "vue";

const picUrl = ref("");

const handlePicUrl = (url: string) => {
  picUrl.value = url;
};
</script>
<style scoped></style>
