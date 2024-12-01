<template>
    <v-container class="pa-4">
      <v-row>
        <v-col
          v-for="(card, index) in list"
          :key="index"
          cols="12"
          sm="6"
          md="3"
          lg="2"
        >
          <v-card>
            <v-img
              style="margin: auto;"
              :src="card.picurl"
              alt="Card Image"
              aspect-ratio="16/9"
              height="18vh"
              width="32vh"
            ></v-img>
            <v-card-text>
              <h3>{{ card.name }}</h3>
              <p>{{ card.detail }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" class="mr-4" style="margin: auto;">
                <v-icon right>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>    
  
    <v-pagination :length="10" class="fixed-pagination" :total-visible="7" rounded></v-pagination>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from "vue";
  
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
  </style>
  