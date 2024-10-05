// Utilities
import { defineStore } from 'pinia'

interface viewportAttr {
  viewport: { width: number; height: number };
}

interface deviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

interface viewportStore extends viewportAttr, deviceInfo { }

export const useViewPortStore = defineStore('viewportState', {
  state: (): viewportStore => ({
    viewport: {
      width: 0,
      height: 0,
    },
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  }),
  getters: {
    getViewportState(): deviceInfo {
      return {
        isMobile: this.isMobile,
        isTablet: this.isTablet,
        isDesktop: this.isDesktop,
      };
    }    
  },
  actions: {
    setViewportState() {
      const width = window.innerWidth;
      this.isDesktop = width > 1024 ? true : false;
      this.isTablet = width > 768 && width <= 1024 ? true : false;
      this.isMobile = width <= 768 ? true : false;
    },
    setViewport(width: number, height: number) {
      this.viewport = { width, height };
    },
    updateAttr(){
      this.setViewportState();
      this.setViewport(window.innerWidth, window.innerHeight);
    }
  }
})

