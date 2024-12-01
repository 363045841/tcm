<template>
  <v-app>
    <v-main>
      <v-app-bar color="#000000" :elevation="2">
        <template #prepend>
          <v-app-bar-nav-icon />
        </template>

        <v-app-bar-title>我超,中医药</v-app-bar-title>
      </v-app-bar>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import search from "./components/search/search-main.vue";
import { useComponentsShowStore } from "./stores/searchPage/componentsShow";
const showStore = useComponentsShowStore();
setTimeout(() => {
  showStore.searchShow = true;
}, 100);
</script>

<style></style>
