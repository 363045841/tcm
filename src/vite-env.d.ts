/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OUT_PATH: string;
  readonly VITE_BACKEND_PORT: number;
  readonly VITE_BACKEND_IP: string;
  // 在这里添加更多的环境变量
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}


