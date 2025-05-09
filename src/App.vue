<template>
  <v-app>
    <!-- 常驻侧边栏 -->
    <v-navigation-drawer v-model="drawer" :rail="isRail" permanent @click="isRail = false" :width="250"
      :rail-width="60">
      <v-list density="compact" nav class="nav-list">
        <!-- 标题 -->
        <v-list-item title="药易寻" subtitle="中药数据查询一站式平台" prepend-icon="mdi-medical-bag">
        </v-list-item>

        <!-- 单独的登录按钮（带过渡动画） -->
        <Transition name="slide">
          <v-list-item v-show="!isRail" class="px-2 mt-2">
            <v-btn v-if="!useUserStore().isAuthenticated" block color="primary" variant="outlined"
              @click="clickLoginButton">
              <v-icon start>
                mdi-login
              </v-icon>
              <span class="text-none">登录</span>
            </v-btn>
            <v-btn v-else block color="primary" variant="outlined" @click="clickLogoutButton">
              <v-icon start>
                mdi-logout
              </v-icon>
              <span class="text-none">注销</span>
            </v-btn>
          </v-list-item>
        </Transition>

        <v-divider></v-divider>

        <!-- 导航项 -->
        <v-list-item v-for="(item, index) in navItems" :key="index" :to="item.route" link
          @click="handleClickVListItem(item.text)">
          <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <template #title>
            <div class="custom-title-container">
              <span class="custom-title-text">{{ item.text }}</span>
              <v-badge class="badge_icon" v-if="item.badge" color="deep-purple" :content="item.badge" inline />
            </div>
          </template>
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
      <LoginView :show-login="showLogin" @update:show-login="handleLoginModalClose"></LoginView>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useComponentsShowStore } from "./stores/searchPage/componentsShow";
import { eventBus } from "./utils/eventBus";
import { useUserStore } from "./stores/profile/profile";

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
  if (itemText === "随机页面") {
    generateRandomNumber();
  }
}

let randomNum = ref<number>(Math.floor(Math.random() * 100));
let RouterViewKey = ref<number>(0);
const generateRandomNumber = async () => {
  const maxPage: number = await fetch(
    `${import.meta.env.VITE_IP}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/medinfo/length`,
    { method: "GET" }
  )
    .then((res) => res.json())
    .then((data) => data.length || 899)
    .catch((error) => console.log(error));

  randomNum.value = Math.floor(Math.random() * maxPage) + 1;
  router.push(`/item/${randomNum.value}`);
  RouterViewKey.value++;
};

// 导航项数据（包含 badge）
const navItems = [
  { text: "首页", route: "/", icon: "mdi-home" },
  { text: "全部", route: "/list", icon: "mdi-format-list-bulleted" },
  { text: "随机页面", route: "", icon: "mdi-dice-multiple" },
  { text: "AI助手", route: "/chat", icon: "mdi-chat", badge: "MCP Server" }, // 添加 badge 字段
  { text: "组方数据挖掘", route: "/datamine", icon: "mdi-chart-bar" },
];

let showLogin = ref<boolean>(false);
function clickLoginButton() {
  console.log("点击了登录按钮");
  showLogin.value = true;
}

function handleLoginModalClose(value: boolean) {
  showLogin.value = value;
}

function clickLogoutButton() {
  localStorage.removeItem("token");
  useUserStore().logout();
}
</script>

<style scoped>
.router-view {
  height: calc(100vh - 64px) !important;
}

/* 登录按钮动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  opacity: 1;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 可选：让整个列表有过渡效果 */
.nav-list {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
</style>