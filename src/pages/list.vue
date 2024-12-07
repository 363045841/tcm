<template>
  <v-container class="pa-4">
    <v-row>
      <v-col
        v-for="(card, index) in list"
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

          <v-card-text>
            <h3>{{ card.name }}</h3>
            <p>{{ card.detail }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <input ref="testDOM" />
  
  <!-- 先这么写，后面再改这个难绷写法 -->
  <v-pagination
    v-if="ViewPort.isDesktop"
    :length="10"
    class="fixed-pagination"
    :total-visible="7"
    rounded
  ></v-pagination>
  <v-pagination
    v-if="ViewPort.isTablet"
    :length="7"
    class="fixed-pagination"
    :total-visible="7"
    rounded
  ></v-pagination>
  <v-pagination
    v-if="ViewPort.isMobile"
    :length="5"
    class="fixed-pagination"
    :total-visible="7"
    rounded
  ></v-pagination>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useViewPortStore } from "@/stores/viewportState";
import { parseCache } from "vue/compiler-sfc";

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

const ViewPort = useViewPortStore();

interface tcm {
  name: string;
  detail: string;
  picurl?: string;
}

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
      "http://www.zhongyoo.com//uploads/allimg/140302/1-1403021110535M.jpg",
  },
  { name: "鹿鞭", detail: "鹿鞭是补气养生的佳品" },
  { name: "鹿胎", detail: "鹿胎是补气养生的佳品" },
  { name: "鹿胎", detail: "鹿胎是补气养生的佳品" },
  { name: "鹿胎", detail: "鹿胎是补气养生的佳品" },
  { name: "鹿胎", detail: "鹿胎是补气养生的佳品" },
]);
</script>

<style scoped>
.fixed-pagination {
  position: fixed;
  bottom: 20px; /* 距离底部 20px */
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

.list-image {
  
}
</style>
