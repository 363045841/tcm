<template>
  <v-list
    lines="two"
    class="search-list"
    rounded
    elevation="1"
    height="250px"
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 16px;
    "
  >
    <v-progress-linear
      :model-value="loadrate"
      rounded
      indeterminate
      :style="loadWidth"
    ></v-progress-linear>
  </v-list>
</template>

<script setup lang="ts" name="">
import { ref } from "vue";
import { useViewPortStore } from "@/stores/viewportState";

const viewportState = useViewPortStore();
let loadWidth = viewportState.isMobile ? { width: "50%" } : { width: "10%" };
watch(
  () => viewportState.isMobile,
  () => {
    loadWidth = viewportState.isMobile ? { width: "50%" } : { width: "10%" };
  }
);

let loadrate = ref<number>(20);
</script>

<style scoped></style>
