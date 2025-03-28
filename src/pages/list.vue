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
    detail: "补气养生",
    picurl: "http://www.zhongyoo.com/uploads/allimg/131118/1-13111Q51I3F2.jpg",
  },
  {
    name: "鹿茸",
    detail: "补气养生",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/140302/1-1403021110535M.jpg",
  },
  {
    name: "铁苋",
    detail: "清热利湿",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/2110/1-2110302020391D.jpg",
  },
  {
    name: "鱼胆草",
    detail: "清热泻火",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/2112/1-2112111GS6206.jpg",
  },
  {
    name: "防风草",
    detail: "清热泻火",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/2110/1-2110302020391D.jpg",
  },
  {
    name: "八角莲",
    detail: "化痰散结",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/1805/1-1Q1211S523462.jpg",
  },
  {
    name: "豆蔻",
    detail: "化湿消痞",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/131101/1-13110111221EJ.jpg",
  },
  {
    name: "沉香",
    detail: "行气止痛",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/130324/1-130324194102209.jpg",
  },
  {
    name: "紫苏叶",
    detail: "解表散寒",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/160623/1-160H2212025957.jpg",
  },
  {
    name: "雷公藤",
    detail: "祛风除湿",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/130323/1-130323123003428.jpg",
  },
  {
    name: "岗梅根",
    detail: "生津止渴",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/2108/1-210P51G4595b.jpg",
  },
  {
    name: "岩黄连",
    detail: "清热泻火",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/2011/1-20110G60020P5.jpg",
  },
  {
    name: "甘松",
    detail: "理气止痛",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/140228/1-14022Q00622617.jpg",
  },
  {
    name: "竹节参",
    detail: "滋补强壮",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/140215/1-140215104036414.jpg",
  },
  {
    name: "无根藤",
    detail: "凉血解毒",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/1908/1-1ZP51632501S.jpg",
  },
  {
    name: "白兰花",
    detail: "止咳、化浊",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/1908/1-1ZQ60R23QF.jpg",
  },
  {
    name: "马蹄金",
    detail: "清热利湿",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/1908/1-1ZP5153100233.jpg",
  },
  {
    name: "土贝母",
    detail: "散结、消肿",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/131118/1-13111Q145203L.jpg",
  },
  {
    name: "金铁锁",
    detail: "祛风除湿",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/140911/1-140911105441933.jpg",
  },
  {
    name: "金银花",
    detail: "清热解毒",
    picurl:
      "http://www.zhongyoo.com/uploads/allimg/140219/1-1402191009409B.jpg",
  },
  { name: "鹿鞭1", detail: "鹿鞭是补气养生" },
  { name: "鹿胎2", detail: "鹿胎是补气养生" },
  { name: "鹿胎3", detail: "鹿胎是补气养生" },
  { name: "鹿胎4", detail: "鹿胎是补气养生" },
  { name: "鹿胎5", detail: "鹿胎是补气养生" },
  { name: "鹿鞭6", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭7", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭8", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭9", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭10", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭11", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭12", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭13", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭14", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭15", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭16", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭17", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭18", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭19", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭20", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭21", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭22", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭23", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭24", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭25", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭26", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭27", detail: "鹿鞭是补气养生" },
  { name: "鹿鞭28", detail: "鹿鞭是补气养生" },
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
