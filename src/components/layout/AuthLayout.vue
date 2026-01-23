<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <span class="text-white font-bold text-2xl">S</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">S PROMAX PLAST</h1>
          <p class="text-gray-600 mt-2">Ishlab chiqarish boshqaruv tizimi</p>
        </div>
        
        <!-- Content -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <router-view />
        </div>
        
        <!-- Footer -->
        <div class="text-center mt-8 text-sm text-gray-600">
          © {{ currentYear }} S PROMAX PLAST. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const currentYear = computed(() => new Date().getFullYear())
  </script>