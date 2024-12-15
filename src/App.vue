<template>
  <v-app>
    <v-main>
      <v-app-bar color="#000000" :elevation="2">
        <template #prepend>
          <v-app-bar-nav-icon />
          <v-app-bar-title style="font-size: large;">我超,中医药</v-app-bar-title>
          <router-link class="nav-link" to="/" style="margin-left: 5vh;font-size: large;">
            首页
          </router-link>
          <router-link class="nav-link" to="/list" style="font-size: large;">
            全部
          </router-link>
        </template>

        
        
      </v-app-bar>
      <router-view class="router-view"></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useComponentsShowStore } from "./stores/searchPage/componentsShow";
const showStore = useComponentsShowStore();
setTimeout(() => {
  showStore.searchShow = true;
}, 100);
</script>

<style scoped>
.router-view {
  
  height: calc(100vh - 64px) !important;
}
.nav-link {
  font-size: large;
  color: #ffffff; /* 文字颜色 */
  text-decoration: none; /* 去掉默认的下划线 */
  padding: 8px 16px; /* 增加内部填充 */
  border-radius: 4px; /* 圆角 */
  transition: background-color 0.3s; /* 过渡动画 */
}

.nav-link:hover {
  background-color: #333333; /* 鼠标悬浮时的背景色 */
}
</style>
