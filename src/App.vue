<template>
  <v-app>
    <v-main>
      <v-app-bar color="#000000" :elevation="2">
        <template #prepend>
          <v-app-bar-nav-icon />
          <v-app-bar-title style="font-size: large"
            >我超,中医药</v-app-bar-title
          >
          <router-link
            class="nav-link"
            to="/"
            style="margin-left: 5vh; font-size: large"
          >
            首页
          </router-link>
          <router-link class="nav-link" to="/list" style="font-size: large">
            全部
          </router-link>
          <router-link
            class="nav-link"
            :to="`/item/${randomNum}`"
            style="font-size: large"
            @click="generateRandomNumber();"
          >
            随机页面
          </router-link>
        </template>
      </v-app-bar>
      <router-view class="router-view" :key="RouterViewKey"></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useComponentsShowStore } from "./stores/searchPage/componentsShow";
import { eventBus } from "./utils/eventBus";
const showStore = useComponentsShowStore();

// 监听事件
onMounted(() => {
  eventBus.on('updateUUID', updateRouterViewKey);
});

// 组件销毁时移除监听
onUnmounted(() => {
  eventBus.off('updateUUID', updateRouterViewKey);
});

function updateRouterViewKey() {
  RouterViewKey.value++;
  console.log('更新了RouterKey！',RouterViewKey.value);
}

setTimeout(() => {
  showStore.searchShow = true;
}, 100);

// 随机页面功能
let randomNum = ref<number>(Math.floor(Math.random() * 100));
let RouterViewKey = ref<number>(0);
const generateRandomNumber = () => {
  let maxPage: number = 899;
  fetch("http://localhost:3001/api/v1/medinfo/length", { method: "GET" })
    .then((res) => res.json())
    .then((data) => {
      maxPage = data.length || 899;
    })
    .catch((error) => console.log(error));

  randomNum.value = Math.floor(Math.random() * maxPage) + 1;
  RouterViewKey.value++;
};

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
