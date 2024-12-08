// Utilities
import { defineStore } from 'pinia'
import { useDisplay } from 'vuetify';

interface viewportAttr {
  viewport: { width: number; height: number };
}

interface deviceInfo {
  isMobile: boolean | null;
  isTablet: boolean | null;
  isDesktop: boolean | null;
}

interface viewportStore extends viewportAttr, deviceInfo { }

export const useViewPortStore = defineStore('viewportState', {
  state: (): viewportStore => ({
    viewport: {
      width: 0,
      height: 0,
    },
    isMobile: null,
    isTablet: null,
    isDesktop: null,
  }),
  getters: {
    
  },
  actions: {
    setViewport() {
      if(window.innerWidth < 768) {
        this.isMobile = true;
        this.isTablet = false;
        this.isDesktop = false;
      }
      else if(window.innerWidth < 1024) {
        this.isMobile = false;
        this.isTablet = true;
        this.isDesktop = false;
      }
      else {
        this.isMobile = false;
        this.isTablet = false;
        this.isDesktop = true;
      }

    }
  }
})

