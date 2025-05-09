// stores/userStore.ts
import { defineStore } from "pinia";

interface User {
  id: number;
  username: string;
  isLogin: boolean;
  created_at: string | null;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    // 用户信息字段（来自 User 接口）
    id: 0 as number,
    username: "" as string,
    isLogin: false as boolean,
    created_at: null as string | null,
  }),
  getters: {
    // 获取当前用户（组合成 User 对象）
    currentUser(): User | null {
      return this.isLogin
        ? {
            id: this.id,
            username: this.username,
            isLogin: this.isLogin,
            created_at: this.created_at,
          }
        : null;
    },

    // 是否已登录（直接返回布尔值）
    isAuthenticated(): boolean {
      return this.isLogin;
    },
  },
  actions: {
    // 登录：设置用户信息
    login(userData: Partial<User>): void {
      this.id = userData.id ?? 0;
      this.username = userData.username ?? "";
      this.isLogin = true;
      this.created_at = userData.created_at ?? null;
    },

    // 登出：清空用户信息
    logout(): void {
      this.id = 0;
      this.username = "";
      this.isLogin = false;
      this.created_at = null;
    },

    // 更新部分用户信息
    updateUserInfo(updatedData: Partial<User>): void {
      if (updatedData.id !== undefined) this.id = updatedData.id;
      if (updatedData.username !== undefined) this.username = updatedData.username;
      if (updatedData.isLogin !== undefined) this.isLogin = updatedData.isLogin;
      if (updatedData.created_at !== undefined) this.created_at = updatedData.created_at;
    },
  },
});