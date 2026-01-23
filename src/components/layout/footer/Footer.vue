<template>
    <footer class="bg-white border-t border-gray-200 mt-12">
      <div class="px-6 py-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Copyright -->
          <div class="text-sm text-gray-600">
            © {{ currentYear }} <span class="font-semibold">S PROMAX PLAST</span>. Barcha huquqlar himoyalangan.
          </div>
          
          <!-- Links -->
          <div class="flex items-center gap-6 text-sm">
            <a href="#" class="text-gray-600 hover:text-gray-900">
              Yordam
            </a>
            <a href="#" class="text-gray-600 hover:text-gray-900">
              Maxfiylik
            </a>
            <a href="#" class="text-gray-600 hover:text-gray-900">
              Shartlar
            </a>
          </div>
          
          <!-- Version -->
          <div class="text-sm text-gray-500">
            v{{ version }}
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const currentYear = computed(() => new Date().getFullYear())
  const version = import.meta.env.VITE_APP_VERSION || '1.0.0'
  </script>