<template>
  <v-overlay v-model="props.showLogin" class="d-flex align-center justify-center">
    <!-- 登录弹窗 -->
    <v-card width="400" class="pa-6" elevation="12" position="relative">
      <!-- 关闭按钮 -->
      <v-btn icon="mdi-close" variant="text" color="grey" class="close-btn" @click="closeDialog"
        style="position: absolute; top: 10px; right: 10px;"></v-btn>

      <v-card-title class="text-h5 text-center mb-4">用户登录</v-card-title>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field v-model="loginData.username" :rules="usernameRules" label="用户名" required variant="outlined"
          density="compact" class="mb-3"></v-text-field>

        <v-text-field v-model="loginData.password" :rules="passwordRules" label="密码" type="password" required
          variant="outlined" density="compact" class="mb-1"></v-text-field>

        <div class="d-flex justify-space-between align-center mb-4">
          <v-checkbox label="记住我" v-model="loginData.rememberMe" hide-details></v-checkbox>
          <a href="#" class="text-caption">忘记密码？</a>
        </div>

        <v-btn color="primary" block @click="submitLogin">登录</v-btn>

        <v-divider class="my-4"></v-divider>

        <div class="text-center">
          <span class="mr-2">还没有账号？</span>
          <a href="#" @click.prevent="openRegisterDialog">注册</a>
        </div>
      </v-form>
    </v-card>

    <!-- 注册弹窗（不包含邮箱） -->
    <v-dialog v-model="showRegister" max-width="500">
      <v-card class="pa-6">
        <v-btn icon="mdi-close" variant="text" color="grey" class="close-btn" @click="showRegister = false"
          style="position: absolute; top: 10px; right: 10px;"></v-btn>

        <v-card-title class="text-h5 text-center mb-4">注册新账号</v-card-title>

        <v-form ref="registerForm" v-model="registerValid" lazy-validation>
          <v-text-field v-model="registerData.username" :rules="registerUsernameRules" label="用户名" required
            variant="outlined" density="compact" class="mb-3"></v-text-field>

          <v-text-field v-model="registerData.password" :rules="registerPasswordRules" label="密码" type="password"
            required variant="outlined" density="compact" class="mb-3"></v-text-field>

          <v-text-field v-model="registerData.confirmPassword" :rules="confirmPasswordRules" label="确认密码"
            type="password" required variant="outlined" density="compact" class="mb-4"></v-text-field>

          <v-btn color="success" block @click="submitRegister">注册</v-btn>
        </v-form>
      </v-card>
    </v-dialog>
  </v-overlay>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/profile/profile';
import { ref } from 'vue'

// ========== 父组件传参 ==========
const props = withDefaults(defineProps<{
  showLogin: boolean
}>(), {
  showLogin: false,
})

// ========== emit ==========
const emit = defineEmits<{
  (e: 'update:show-login', value: boolean): void
}>()

// ========== 登录相关数据 ==========
const form = ref()
const valid = ref(true)
const loginData = ref({
  username: '',
  password: '',
  rememberMe: false,
})
const usernameRules = [
  (v: string) => !!v || '请输入用户名',
  (v: string) => (v && v.length >= 3) || '用户名至少3个字符',
]
const passwordRules = [
  (v: string) => !!v || '请输入密码',
  (v: string) => (v && v.length >= 4) || '密码至少4位',
]

// ========== 提交登录 ==========
const submitLogin = async () => {
  const isValid = await form.value.validate()
  if (isValid.valid) {
    try {
      const response = await fetch('http://www.zyysjk.xyz/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginData.value.username,
          password: loginData.value.password,
        }),
      })

      if (!response.ok) {
        throw new Error('登录失败，请检查用户名或密码')
      }

      const result = await response.json()
      const token = result.access_token

      console.log('登录成功，Token:', token)

      localStorage.setItem('access_token', token)
      useUserStore().login({
        isLogin: true,

      })
      emit('update:show-login', false)

    } catch (error) {
      console.error('登录出错:', error)
    }
  }
}

// ========== 关闭弹窗 ==========
const closeDialog = () => {
  emit('update:show-login', false)
}

// ========== 注册相关数据 ==========
const showRegister = ref(false)
const registerForm = ref()
const registerValid = ref(true)

const registerData = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// 注册验证规则
const registerUsernameRules = [
  (v: string) => !!v || '请输入用户名',
  (v: string) => (v && v.length >= 3) || '用户名至少3个字符',
]
const registerPasswordRules = [
  (v: string) => !!v || '请输入密码',
  (v: string) => (v && v.length >= 4) || '密码至少6位',
]
const confirmPasswordRules = [
  (v: string) => !!v || '请确认密码',
  (v: string) => v === registerData.value.password || '两次输入密码不一致',
]

// 打开注册弹窗
const openRegisterDialog = () => {
  showRegister.value = true
}

// 提交注册
const submitRegister = async () => {
  const isValid = await registerForm.value.validate()
  if (isValid.valid) {
    try {
      const response = await fetch('http://www.zyysjk.xyz/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerData.value.username,
          password: registerData.value.password,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || '注册失败')
      }

      const result = await response.json()
      console.log('注册成功：', result)

      showRegister.value = false

    } catch (error) {
      console.error('注册出错:', error)
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: #1976d2;
}

.close-btn:hover {
  color: #ff5252 !important;
}
</style>