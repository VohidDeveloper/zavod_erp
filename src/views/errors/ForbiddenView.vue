<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="max-w-md w-full text-center">
        <!-- 403 -->
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-red-600">403</h1>
          <div class="mt-4">
            <ShieldExclamationIcon class="mx-auto h-32 w-32 text-red-400" />
          </div>
        </div>
  
        <!-- Message -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Kirish taqiqlangan
          </h2>
          <p class="text-gray-600">
            Kechirasiz, sizda bu sahifaga kirish huquqi yo'q. Agar bu xato deb hisoblasangiz, administrator bilan bog'laning.
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
  import { ShieldExclamationIcon } from '@heroicons/vue/24/outline'
  
  const router = useRouter()
  
  const goBack = () => {
    router.go(-1)
  }
  </script>