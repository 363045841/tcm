// Utilities
import { defineStore } from 'pinia';


export interface TitleInfo {
  id: number;
  title: string;
  subtitle: string;
  avatar: string;
}

interface Item {
  title: TitleInfo[];
  emptytitle: TitleInfo[];
  strongTitle: Map<number, [number, number]>;
  strongSubTitle: Map<number, [number, number]>;
}

export const useComponentsSearchItemStore = defineStore('searchItem', {
  state: (): Item => ({
    title: [
      {
        id: 0,
        title: "肾虚",
        subtitle: "shenxu",
        avatar: "https://randomuser.me/api/portraits/women/7.jpg",
      },
      {
        id: 1,
        title: "肾虚了吗",
        subtitle: "shenbuxu",
        avatar: "https://randomuser.me/api/portraits/women/8.jpg",
      },
      {
        id: 2,
        title: "枸杞",
        subtitle: "jiushishenxu",
        avatar: "https://randomuser.me/api/portraits/women/6.jpg",
      },
      {
        id: 3,
        title: "枸杞",
        subtitle: "jiushishenxu",
        avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      },
      {
        id: 4,
        title: "枸杞",
        subtitle: "jiushishenxu",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      },
    ],
    emptytitle: [{
      id: 0,
      title: "没有搜索到相关内容",
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
