<template>
  <EtcmList :items="items"></EtcmList>
</template>

<script setup lang="ts" name="">
import { ref } from "vue";
import { GujifangjiData } from "@/utils/useGetETCMGujifangji";

interface PageParams {
  name: string;
}

const route = useRoute();
import EtcmList from "@/components/item/etcmList.vue";
import { useGetETCMGujifangjiData } from "@/utils/useGetETCMGujifangji";
let items = ref();
onMounted(async () => {
  document.body.style.overflow = "auto";
  try {
    let pageName = (route.params as PageParams).name;
    const temp = await useGetETCMGujifangjiData(pageName);
    if (temp) items.value = temp;
  } catch (error) {
    console.error("获取数据时发生错误:", error);
    items.value = [] as unknown as GujifangjiData; // 确保 items 有一个默认值
  }
});
</script>
<style scoped></style>
