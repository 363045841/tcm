// Utilities
import { defineStore } from 'pinia';

export interface TitleInfo {
  id: number;
  title: string;
  subtitle: string;
  avatar: string;
}

export interface Item {
  title: TitleInfo[];
  emptytitle: TitleInfo[];
  historyAlertTitle: TitleInfo[];
  strongTitle: Map<number, [number, number]>;
  strongSubTitle: Map<number, [number, number]>;
}

export const useComponentsSearchItemStore = defineStore('searchItem', {
  state: (): Item => ({
    title: [{
      id: 0,
      title: "没有搜索到相关内容",
      subtitle: "",
      avatar: ""
    }],
    emptytitle: [{
      id: 0,
      title: "没有搜索到相关内容",
      subtitle: "",
      avatar: ""
    }],
    historyAlertTitle: [{
      id: 0,
      title: "这是历史记录，但我并没有做这个功能，略略略",
      subtitle: "",
      avatar: ""
    }],
    strongTitle: new Map<number, [number, number]>(),
    strongSubTitle: new Map<number, [number, number]>(),
  }),
  getters: {},
  actions: {
    computeStrongRange(query: string) {
      this.strongTitle.clear(); // 清空 Map
      this.strongSubTitle.clear(); // 清空 Map

      if (Array.isArray(this.title)) {
        for (let i = 0; i < this.title.length; i++) {
          const item = this.title[i];
          let index = item.title.indexOf(query);
          if (index === -1) {
            this.strongSubTitle.set(item.id, [0, 0]);
          } else {
            this.strongTitle.set(item.id, [index, index + query.length]);
          }

          index = item.subtitle.indexOf(query);
          if (index === -1) {
            this.strongSubTitle.set(item.id, [0, 0]);
          } else {
            this.strongSubTitle.set(item.id, [index, index + query.length]);
          }
        }
      }
      //console.log(1, toRaw(Array.from(this.strongTitle.entries())));
    }
  }
});
