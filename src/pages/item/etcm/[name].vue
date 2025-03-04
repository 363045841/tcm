<template>
  <list :items="items"></list>
</template>

<script setup lang="ts" name="">
import { ref, reactive } from "vue";
import list from "@/components/item/list.vue";
import { useGetETCMData } from "@/utils/useGetETCMdata";

interface PageParams {
  name: string;
}

const route = useRoute();
import { ETCMData } from "@/utils/useGetETCMdata";
let items = ref<ETCMData>();
onMounted(async () => {
  let pageName = (route.params as PageParams).name;

  items.value = await useGetETCMData(pageName);
});
</script>
<style scoped></style>
