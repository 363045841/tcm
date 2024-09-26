// Utilities
import { defineStore } from 'pinia';

export const useComponentsShowStore = defineStore('componentsShow', {
  state: () => ({
    searchShow: false,
  }),
  getters: {},
  actions: {
    toggleSearchShow(): void {
      this.searchShow = !this.searchShow;
    }
  }
});