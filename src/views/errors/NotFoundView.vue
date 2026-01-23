<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="max-w-md w-full text-center">
        <!-- 404 -->
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-blue-600">404</h1>
          <div class="mt-4">
            <svg
              class="mx-auto h-32 w-32 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
  
        <!-- Message -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Sahifa topilmadi
          </h2>
          <p class="text-gray-600">
            Kechirasiz, siz qidirgan sahifa mavjud emas yoki o'chirilgan.
          </p>
        </div>
  
        <!-- Actions -->
        <div class="space-y-3">
          <button
            @click="goBack"
            class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Orqaga qaytish
          </button>
          <router-link
            to="/"
            class="block w-full bg-white text-gray-700 py-3 px-6 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition"
          >
            Bosh sahifaga o'tish
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const goBack = () => {
    router.go(-1)
  }
  </script>