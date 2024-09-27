// Utilities
import { defineStore } from 'pinia';

export const useComponentsShowStore = defineStore('componentsShow', {
  state: () => ({
    searchShow: false,
    searchFocus: false,
  }),
  getters: {},
  actions: {
    toggleSearchShow(): void {
      this.searchShow = !this.searchShow;
    },
    toggleSearchFocus(): void {
      this.searchFocus = !this.searchFocus;
    },
  }
});