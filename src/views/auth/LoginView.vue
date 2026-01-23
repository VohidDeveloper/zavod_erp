<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div class="max-w-md w-full">
        <!-- Logo and Title -->
        <div class="text-center mb-8">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span class="text-3xl font-bold text-white">SP</span>
            </div>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">S PROMAX PLAST</h1>
          <p class="text-gray-600 mt-2">Tizimga kirish</p>
        </div>
  
        <!-- Login Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <form @submit.prevent="handleLogin">
            <!-- Email -->
            <div class="mb-6">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email yoki Login
              </label>
              <input
                id="email"
                v-model="form.email"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="email@example.com"
              >
              <span v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</span>
            </div>
  
            <!-- Password -->
            <div class="mb-6">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Parol
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                >
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
              <span v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</span>
            </div>
  
            <!-- Remember me & Forgot password -->
            <div class="flex items-center justify-between mb-6">
              <label class="flex items-center">
                <input
                  v-model="form.remember"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                >
                <span class="ml-2 text-sm text-gray-600">Eslab qolish</span>
              </label>
              <router-link
                to="/forgot-password"
                class="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Parolni unutdingizmi?
              </router-link>
            </div>
  
            <!-- Error message -->
            <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ errorMessage }}</p>
            </div>
  
            <!-- Submit button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Yuklanmoqda...
              </span>
              <span v-else>Kirish</span>
            </button>
          </form>
  
          <!-- Register link -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Akkauntingiz yo'qmi?
              <router-link to="/register" class="text-blue-600 hover:text-blue-700 font-medium">
                Ro'yxatdan o'tish
              </router-link>
            </p>
          </div>
        </div>
  
        <!-- Footer -->
        <div class="mt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 S PROMAX PLAST. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const form = ref({
    email: '',
    password: '',
    remember: false
  })
  
  const showPassword = ref(false)
  const loading = ref(false)
  const errorMessage = ref('')
  const errors = ref({})
  
  const handleLogin = async () => {
    loading.value = true
    errorMessage.value = ''
    errors.value = {}
  
    try {
      await authStore.login(form.value)
      router.push('/')
    } catch (error) {
      if (error.errors) {
        errors.value = error.errors
      } else {
        errorMessage.value = error.message || 'Login yoki parol noto\'g\'ri'
      }
    } finally {
      loading.value = false
    }
  }
  </script>