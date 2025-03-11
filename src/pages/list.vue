<template>
  <v-container class="pa-4">
    <v-row>
      <!-- 大屏幕一行6个,中屏幕一行4个,小屏幕一行2个,行数由视口高度决定 -->
      <v-col
        v-for="(card, index) in showCardArray"
        :key="index"
        cols="6"
        sm="6"
        md="3"
        lg="2"
      >
        <v-card link>
          <!-- 图片存在时渲染图片 -->
          <v-img
            v-if="card.picurl"
            cover
            :src="card.picurl"
            alt="Card Image"
            aspect-ratio="16/9"
            ref="listImage"
            height="16vh"
          ></v-img>
          <!-- 图片不存在时渲染占位 div -->
          <v-img
            v-else
            class="replace-img list-image"
            :src="card.picurl"
            alt="Card Image"
            aspect-ratio="16/9"
            cover
            width="100%"
            height="16vh"
          ></v-img>

          <v-card-text style="height: 9vh">
            <h3>{{ card.name }}</h3>
            <p>{{ card.detail }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <input ref="testDOM" />

  <v-pagination
    :length="screenInfo.paginLength"
    class="fixed-pagination"
    :total-visible="screenInfo.paginTotalVisible"
    v-model:model-value="page"
    ref="pagination"
  ></v-pagination>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useViewPortStore } from "@/stores/viewportState";

let viewPortStore = useViewPortStore();
let page = ref(1);
let screenInfo = reactive({
  width: 0,
  height: 0,
  showBegin: 0,
  showEnd: 0,
  paginLength: 0,
  paginTotalVisible: 0,
});
import { VContainer } from "vuetify/components";
import { useDisplay } from "vuetify";
const pagination = ref<InstanceType<typeof VContainer> | null>(null);

let list = reactive<tcm[]>([
  {
    name: "人参",
    detail: "人参是补气养生的佳品",
    picurl: "http://www.zhongyoo.com/uploads/allimg/131118/1-13111Q51I3F2.jpg",
  },
  {
    name: "鹿茸",
    detail: "鹿茸是补气养生的佳品",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/140302/1-1403021110535M.jpg",
  },
  { name: "鹿鞭1", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿胎2", detail: "鹿胎是补气养生的佳品" },
  { name: "鹿胎3", detail: "鹿胎是补气养生的佳品" },
  { name: "鹿胎4", detail: "鹿胎是补气养生的佳品" },
  { name: "鹿胎5", detail: "鹿胎是补气养生的佳品" },
  { name: "鹿鞭6", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭7", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭8", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭9", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭10", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭11", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭12", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭13", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭14", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭15", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭16", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭17", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭18", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭19", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭20", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭21", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭22", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭23", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭24", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭25", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭26", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭27", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿鞭28", detail: "鹿鞭是补气养生的佳品" },
]);
watch(page, (val) => {
  updateScreenInfo();
});

function updateScreenInfo() {
  console.log(
    "update",
    viewPortStore.isDesktop,
    viewPortStore.isTablet,
    viewPortStore.isMobile
  );
  if (viewPortStore.isDesktop) {
    screenInfo.width = 6;
  } else if (viewPortStore.isTablet) {
    screenInfo.width = 4;
  } else {
    screenInfo.width = 2;
  }
  screenInfo.width = viewPortStore.isDesktop
    ? 6
    : viewPortStore.isTablet
    ? 4
    : 2;
  const viewportHeight = window.innerHeight - 65 - 64 - 12;
  console.log("viewportHeight", viewportHeight);
  //const containerHeight = container.value?.$el.clientHeight;
  console.log("each height", 25 * 0.01 * window.innerHeight + 24 + "px");
  screenInfo.height =
    Math.floor(viewportHeight / (16 * 0.01 * window.innerHeight + 24)) - 1;
  screenInfo.showBegin =
    (page.value - 1) * (screenInfo.width * screenInfo.height);
  screenInfo.showEnd =
    screenInfo.showBegin + screenInfo.width * screenInfo.height;
  if (screenInfo.showEnd > list.length) screenInfo.showEnd = list.length;
  screenInfo.paginLength = Math.ceil(
    list.length / (screenInfo.width * screenInfo.height)
  );
  console.log(screenInfo);
}

onMounted(() => {
  document.body.style.overflow = "hidden";
  viewPortStore.setViewport();
  console.log("state", viewPortStore.$state);
  updateScreenInfo();
  screenInfo.paginTotalVisible = useDisplay().xs.value
    ? 3
    : useDisplay().sm.value
    ? 5
    : 7;
});

let showCardArray = computed(() => {
  return list.slice(screenInfo.showBegin, screenInfo.showEnd);
});

const ViewPort = useViewPortStore();

interface tcm {
  name: string;
  detail: string;
  picurl?: string;
}

// 拿DOM测试，如果图片大小不一致再考虑
/* let picSize = {
  picWidth: 0,
  picHeight: 0,
}
const testDOM = useTemplateRef("testDOM");
const listImage = useTemplateRef("listImage");
onMounted(() => {
  console.log(testDOM.value);
  console.log(listImage.value[0]);
}); */
</script>

<style scoped>
.fixed-pagination {
  position: fixed;
  bottom: 8px; /* 距离底部 20px */
  left: 50%;
  transform: translateX(-50%); /* 居中分页组件 */
  z-index: 1000; /* 确保分页在上层 */
}

.image-container {
  margin: auto;
  object-fit: cover;
  height: auto;
}

.replace-img {
  aspect-ratio: 16 / 9; /* 确保占位 div 和 v-img 高宽比一致 */
  background-color: #f0f0f0; /* 可自定义背景色 */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
