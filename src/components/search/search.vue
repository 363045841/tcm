<template>
  <v-container>
    <v-row>
      <v-col cols="8" style="margin: auto; padding: 0px">
        <div :class="{ moving: move }" class="movable" style="padding: 0px">
          <transition name="fade" mode="out-in">
            <v-text-field
              v-if="showStore.searchShow"
              variant="outlined"
              label="搜索"
              rounded
              v-model:model-value="searchText"
              :hide-details="true"
              @focus="(move = true), (showStore.searchFocus = true)"
              @blur="(move = false), (showStore.searchFocus = false)"
            >
              <template #append-inner>
                <v-tooltip text="搜图" location="bottom">
                  <template #activator="{ props }">
                    <img
                      v-bind="props"
                      class="icon"
                      src="../../assets/icon/carmera.svg"
                      alt="search photo"
                      style="height: 24px !important; margin: 16px"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip text="搜索" location="bottom">
                  <template #activator="{ props }">
                    <img
                      v-bind="props"
                      class="icon"
                      src="../../assets/icon/search.svg"
                      alt="search"
                      style="height: 24px; margin-right: 8px"
                    />
                  </template>
                </v-tooltip>
              </template>
            </v-text-field>
          </transition>
        </div>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="8" style="margin: auto; padding: 0px">
        <search-ans v-if="showStore.searchFocus" :searchText="searchText" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useComponentsShowStore } from "@/stores/searchPage/componentsShow";
import searchAns from "./searchAns.vue";
const showStore = useComponentsShowStore();
let searchText = ref<string>("");
let move = ref<boolean>(false);

const items = [
  {
    prependIcon: "mdi-clock-outline",
    title: "recipe with chicken",
  },
  {
    prependIcon: "mdi-clock-outline",
    title: "best hiking trails near me",
  },
  {
    prependIcon: "mdi-clock-outline",
    title: "how to learn a new language",
  },
  {
    prependIcon: "mdi-clock-outline",
    title: "DIY home organization ideas",
  },
  {
    prependIcon: "mdi-clock-outline",
    title: "latest fashion trends",
  },
];
const shortcuts = [
  {
    icon: "mdi-github",
    title: "Master ",
    href: "https://github.com/vuetifyjs/vuetify",
  },
  {
    icon: "mdi-github",
    title: "Dev",
    href: "https://github.com/vuetifyjs/vuetify/tree/dev",
  },
  {
    icon: "mdi-github",
    title: "Stable",
    href: "https://github.com/vuetifyjs/vuetify/tree/v2-stable",
  },
  {
    icon: "mdi-github",
    title: "My Pull Requests",
    href: "https://github.com/vuetifyjs/vuetify/pulls/johnleider",
  },
];

const dialog = ref(false);
</script>

<style scoped>
.icon:hover {
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
  /* transform: translateY(-5px); */ /* 向上移动50px */
}
</style>
