<template>
  <v-container class="all-container" height="100%">
    <v-row align="center" justify="center" style="height: 90%">
      <v-col>
        <searchMain
          :style="{ width: $vuetify.display.xs ? '90%' : '65%' }"
        ></searchMain>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import searchMain from "@/components/search/search-main.vue";
onMounted(() => {
  console.log("mounted");
  document.body.style.overflow = "hidden";
});
</script>

<style scoped>

</style>