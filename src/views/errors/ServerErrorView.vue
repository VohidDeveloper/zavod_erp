<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div class="max-w-md w-full text-center">
        <!-- 500 -->
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-orange-600">500</h1>
          <div class="mt-4">
            <ExclamationTriangleIcon class="mx-auto h-32 w-32 text-orange-400" />
          </div>
        </div>
  
        <!-- Message -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Server xatosi
          </h2>
          <p class="text-gray-600 mb-4">
            Kechirasiz, serverda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.
          </p>
          <p class="text-sm text-gray-500">
            Agar muammo davom etsa, texnik qo'llab-quvvatlash xizmatiga murojaat qiling.
          </p>
        </div>
  
        <!-- Actions -->
        <div class="space-y-3">
          <button
            @click="refreshPage"
            class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
          >
            <ArrowPathIcon class="w-5 h-5 mr-2" />
            Sahifani yangilash
          </button>
          <router-link
            to="/"
            class="block w-full bg-white text-gray-700 py-3 px-6 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition"
          >
            Bosh sahifaga o'tish
          </router-link>
        </div>
  
        <!-- Support info -->
        <div class="mt-8 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>Qo'llab-quvvatlash:</strong><br>
            Email: support@sproplast.uz<br>
            Tel: +998 XX XXX-XX-XX
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
  
  const refreshPage = () => {
    window.location.reload()
  }
  </script>