<template>
  <v-list lines="two" class="search-list" rounded elevation="1">
    <v-list-item
      v-for="(n, key) in filteredItems"
      :key="key"
      :title="n.title"
      :subtitle="n.subtitle"
      :prepend-avatar="n.avatar"
    >
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
const props = defineProps({
  searchText: {
    type: String,
    default: "",
  },
});

interface Item {
  title: string;
  subtitle: string;
  avatar: string;
}

const items: Array<Item> = [
  {
    title: "肾虚",
    subtitle: "shenxu",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    title: "肾虚了吗",
    subtitle: "shenbuxu",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },
  {
    title: "枸杞",
    subtitle: "jiushishenxu",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },
];

const filteredItems = ref<Array<Item>>([]);

// 监听 searchText 的变化
watch(
  () => props.searchText,
  (val) => {
    if (val) {
      // 根据输入内容过滤出匹配项
      filteredItems.value = items.filter(
        (item) => item.title.includes(val) || item.subtitle.includes(val)
      );
    } else {
      // 如果没有输入内容，则显示所有项
      filteredItems.value = items;
    }
  },
  { immediate: true } // 初始立即执行一次，确保初始值能正确显示
);
</script>

<style scoped>
.search-list {
  border-radius: 16px;
}
</style>
