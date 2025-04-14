<template>
  <v-container class="pa-4">
    <v-row>
      <!-- 大屏幕一行6个, 中屏幕一行4个, 小屏幕一行2个 -->
      <v-col
        v-for="(card, index) in showCardArray"
        :key="index"
        cols="6"
        sm="6"
        md="3"
        lg="2"
      >
        <v-card link @click="router.push(`/item/${card.id}`)">
          <!-- 显示图片 -->
          <v-img
            :src="card.pic"
            cover
            alt="Card Image"
            aspect-ratio="16/9"
            height="16vh"
          ></v-img>

          <v-card-text style="height: 9vh">
            <h3>{{ card.tcmName }}</h3>
            <!-- 药材介绍信息 -->
            <!-- <p>{{ card.detail || '' }}</p> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 分页组件 -->
    <v-pagination
      v-model:model-value="page"
      :length="screenInfo.paginLength"
      :total-visible="screenInfo.paginTotalVisible"
      class="fixed-pagination mt-4"
    />
  </v-container>
</template>

<script setup lang="ts">
import router from '@/router';
import { fetchZhongyooDatabaseTotalLength } from '@/utils/useGetZhongyooDatabaseLength';
import { ref, reactive, watch } from 'vue'

onMounted(async () =>{
  // 允许滚动
  document.body.style.overflow = 'auto';
  itemCount.value = await fetchZhongyooDatabaseTotalLength();
})

const itemCount = ref(898);
// 当前页码
const page = ref(1)
const itemsPerPage = 18
const showCardArray = ref<cardInfo[]>([])

const screenInfo = reactive({
  paginLength: Math.ceil(itemCount.value / itemsPerPage),
  paginTotalVisible: 5,
})

interface cardInfo {
  tcmName: string;
  id: number;
  pic: string;
}

// 获取卡片数据
async function fetchCards(newPage: number) {
  const begin = (newPage - 1) * itemsPerPage + 1
  const end = newPage * itemsPerPage

  try {
    const res = await fetch(`${import.meta.env.VITE_IP}/api/v1/show-all?begin=${begin}&end=${end}`)
    const data = await res.json()

    showCardArray.value = data.map((item: cardInfo) => ({
      ...item,
    }))
  } catch (error) {
    console.error('获取卡片失败', error)
    showCardArray.value = []
  }
}

// 监听分页变化并初始化加载第一页
watch(page, fetchCards, { immediate: true })
</script>

<style scoped>
.fixed-pagination {
  display: flex;
  justify-content: center;
}
</style>
