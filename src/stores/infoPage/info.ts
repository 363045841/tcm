// Utilities
import { defineStore } from "pinia";

export const useInfoStore = defineStore("InfoStore", {
  state: () => ({
    tcmName: ref(""),
  }),
  getters: {},
  actions: {},
});
