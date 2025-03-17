<template>
  <v-app>
    <!-- 常驻侧边栏 -->
    <v-navigation-drawer v-model="drawer" :rail="isRail" permanent @click="isRail = false" :width="250"
      :rail-width="60">
      <v-list density="compact" nav>
        <!-- 标题 -->
        <v-list-item title="我超,中医药" subtitle="中药数据查询一站式平台" prepend-icon="mdi-medical-bag">
        </v-list-item>
        <v-divider></v-divider>

        <!-- 导航项 -->
        <v-list-item v-for="(item, index) in navItems" :key="index" :to="item.route" link :prepend-icon="item.icon"
          :title="item.text" @click="handleClickVListItem(item.text)">
        </v-list-item>

      </v-list>

      <!-- 切换按钮（展开/收窄） -->
      <template #append>
        <v-list-item @click.stop="isRail = !isRail" link>
          <template #prepend>
            <v-icon :icon="isRail ? 'mdi-chevron-right' : 'mdi-chevron-left'"></v-icon>
          </template>
          <v-list-item-title v-show="!isRail">切换侧边栏</v-list-item-title>
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <!-- 主内容区域 -->
    <v-main>
      <router-view class="router-view" :key="RouterViewKey"></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useComponentsShowStore } from "./stores/searchPage/componentsShow";
import { eventBus } from "./utils/eventBus";

const router = useRouter();
const showStore = useComponentsShowStore();

// 抽屉状态
const drawer = ref<boolean>(true);
const isRail = ref<boolean>(false); // 是否为收窄模式

// 监听事件
onMounted(() => {
  eventBus.on("updateRouterViewKey", updateRouterViewKey);
});

// 组件销毁时移除监听
onUnmounted(() => {
  eventBus.off("updateRouterViewKey", updateRouterViewKey);
});

function updateRouterViewKey() {
  RouterViewKey.value++;
  console.log("更新了RouterKey!", RouterViewKey.value);
}

setTimeout(() => {
  showStore.searchShow = true;
}, 100);

// 随机页面功能
function handleClickVListItem(itemText: string) {
  if(itemText === "随机页面") {
    generateRandomNumber();
  }
}



let randomNum = ref<number>(Math.floor(Math.random() * 100));
let RouterViewKey = ref<number>(0);
const generateRandomNumber = async () => {
  /* fetch("http://localhost:3001/api/v1/medinfo/length", { method: "GET" })
    .then((res) => res.json())
    .then((data) => {
      maxPage = data.length || 899;
    })
    .catch((error) => console.log(error)); */
  const maxPage: number = await fetch(`${import.meta.env.VITE_IP}:${import.meta.env.VITE_BACKEND_PORT
    }/api/v1/medinfo/length`, { method: "GET" }).then((res) => res.json()).then((data) => data.length || 899).catch((error) => console.log(error));

  randomNum.value = Math.floor(Math.random() * maxPage) + 1;
  router.push(`/item/${randomNum.value}`);
  RouterViewKey.value++;
};

// 导航项数据
const navItems = [
  { text: "首页", route: "/", icon: "mdi-home" },
  { text: "全部", route: "/list", icon: "mdi-format-list-bulleted" },
  { text: "随机页面", route: "", icon: "mdi-dice-multiple" },
  { text: "证型判断AI助手", route: "/chat", icon: "mdi-chat" },
  { text: "组方数据挖掘", route: "/datamine", icon: "mdi-chart-bar" },
];
</script>

<style scoped>
.router-view {
  height: calc(100vh - 64px) !important;
}
</style>
