<template>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
  />
  <v-container>
    <v-row>
      <v-col cols="8" style="margin: auto">
        <div :class="{ moving: move }" class="movable">
          <transition name="fade" mode="out-in">
            <v-text-field
              v-if="showStore.searchShow"
              variant="outlined"
              append-icon="md:search"
              label="搜索"
              rounded
              v-model:model-value="searchText"
              @focus="move = true"
              @blur="move = false"
            >
              <template #append-inner>
                <span class="material-symbols-outlined" style="padding: 16px">
                  image
                </span>
                <span
                  class="material-symbols-outlined"
                  @click="console.log(123)"
                >
                  search
                </span>
              </template>
            </v-text-field>
          </transition>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useComponentsShowStore } from "@/stores/searchPage/componentsShow";
const showStore = useComponentsShowStore();
let searchText = ref<string | null>(null);
let move = ref<boolean>(false);
</script>

<style scoped>
.material-symbols-outlined:hover {
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.movable {
  padding: 20px;
  margin: 10px 0;
  border-radius: 5px;
  transition: transform 0.5s ease; /* 设置过渡效果 */
}

.moving {
  transform: translateY(-25vh); /* 向上移动50px */
}
</style>
