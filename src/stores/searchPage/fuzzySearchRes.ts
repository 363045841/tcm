import { defineStore } from "pinia";

export interface FuzzyItem {
  title: string;
}

interface State {
  searchShow: FuzzyItem[];
}

export const useComponentsFuzzyShowStore = defineStore("fuzzySearchRes", {
  state: (): State => ({
    searchShow: [],
  }),
  getters: {},
  actions: {},
});
