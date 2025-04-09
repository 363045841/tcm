import { defineConfig } from 'vitest/config';
import Vue from '@vitejs/plugin-vue';  // Vue 插件
import vueJsx from '@vitejs/plugin-vue-jsx';  // Vue JSX 插件
import Vuetify from 'vite-plugin-vuetify';  // Vuetify 插件
import { fileURLToPath } from 'url';

export default defineConfig({
  test: {
    globals: false,  // 使用全局测试函数
    environment: 'jsdom',  // 使用 jsdom 测试环境
    setupFiles: './test/setup.ts',  // 配置测试的 setup 文件
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.spec.ts'],  // 包含的测试文件
  },
  plugins: [
    Vue(),  // Vue 插件
    vueJsx(),  // Vue JSX 插件
    Vuetify({
      autoImport: true,  // 自动导入 Vuetify 组件
      styles: {
        configFile: 'src/styles/settings.scss',  // Vuetify 样式配置文件
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
});
