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
          <p class="text-gray-600 mt-2">Parolni tiklash</p>
        </div>
  
        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div v-if="!sent">
            <!-- Instructions -->
            <div class="mb-6 text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyIcon class="w-8 h-8 text-blue-600" />
              </div>
              <p class="text-sm text-gray-600">
                Email manzilingizni kiriting. Sizga parolni tiklash uchun havola yuboramiz.
              </p>
            </div>
  
            <!-- Form -->
            <form @submit.prevent="handleForgotPassword">
              <!-- Email -->
              <div class="mb-6">
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="email@example.com"
                >
                <span v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</span>
              </div>
  
              <!-- Error message -->
              <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-sm text-red-600">{{ errorMessage }}</p>
              </div>
  
              <!-- Submit button -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Yuborilmoqda...
                </span>
                <span v-else>Havola yuborish</span>
              </button>
  
              <!-- Back to login -->
              <router-link
                to="/login"
                class="w-full block text-center py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition"
              >
                Orqaga qaytish
              </router-link>
            </form>
          </div>
  
          <!-- Success message -->
          <div v-else class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Havola yuborildi!
            </h3>
            <p class="text-sm text-gray-600 mb-6">
              {{ email }} manziliga parolni tiklash havolasi yuborildi. Iltimos, emailingizni tekshiring.
            </p>
            <router-link
              to="/login"
              class="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Kirish sahifasiga o'tish
            </router-link>
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
  import { useAuthStore } from '@/stores/auth'
  import { KeyIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
  
  const authStore = useAuthStore()
  
  const email = ref('')
  const sent = ref(false)
  const loading = ref(false)
  const errorMessage = ref('')
  const errors = ref({})
  
  const handleForgotPassword = async () => {
    loading.value = true
    errorMessage.value = ''
    errors.value = {}
  
    try {
      await authStore.forgotPassword(email.value)
      sent.value = true
    } catch (error) {
      if (error.errors) {
        errors.value = error.errors
      } else {
        errorMessage.value = error.message || 'Havola yuborishda xatolik yuz berdi'
      }
    } finally {
      loading.value = false
    }
  }
  </script>