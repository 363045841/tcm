<template>
  <EtcmList :items="items"></EtcmList>
</template>

<script setup lang="ts" name="">
import { ref } from "vue";
import etcmList from "@/components/item/etcmList.vue";
import { useGetETCMData } from "@/utils/useGetETCMdata";

interface PageParams {
  name: string;
}

const route = useRoute();
import { ETCMData } from "@/utils/useGetETCMdata";
import EtcmList from "@/components/item/etcmList.vue";
let items = ref<ETCMData>();
onMounted(async () => {
  document.body.style.overflow = "auto";
  let pageName = (route.params as PageParams).name;
  // console.log('当前打开的是', pageName)

  items.value = await useGetETCMData(pageName) ?? ([] as unknown as ETCMData);
  // console.log('页面数据',items);
});
</script>
<style scoped></style>
