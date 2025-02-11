import { defineStore } from "pinia";

export interface FuzzyItem {
  id: number;
  title: string;
  picurl: string;
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
