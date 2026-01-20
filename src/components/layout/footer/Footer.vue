<template>
    <footer class="app-footer">
      <div class="footer-content">
        <p class="footer-text">
          &copy; {{ currentYear }} <strong>S PROMAX PLAST</strong>. Barcha huquqlar himoyalangan.
        </p>
        <div class="footer-links">
          <a href="#" class="footer-link">Yordam</a>
          <span class="footer-divider">•</span>
          <a href="#" class="footer-link">Aloqa</a>
          <span class="footer-divider">•</span>
          <span class="footer-version">v{{ version }}</span>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { APP_VERSION } from '@/utils/constants'
  
  const currentYear = computed(() => new Date().getFullYear())
  const version = APP_VERSION
  </script>
  
  <style scoped>
  .app-footer {
    @apply mt-auto py-4 px-6;
    @apply border-t border-gray-200 dark:border-gray-700;
    @apply bg-white dark:bg-gray-800;
  }
  
  .footer-content {
    @apply flex flex-col sm:flex-row items-center justify-between gap-2;
  }
  
  .footer-text {
    @apply text-sm text-gray-600 dark:text-gray-400;
  }
  
  .footer-links {
    @apply flex items-center gap-2 text-sm;
  }
  
  .footer-link {
    @apply text-gray-600 dark:text-gray-400;
    @apply hover:text-primary-600 dark:hover:text-primary-400;
    @apply transition-colors;
  }
  
  .footer-divider {
    @apply text-gray-400 dark:text-gray-600;
  }
  
  .footer-version {
    @apply text-gray-500 dark:text-gray-500 font-mono text-xs;
  }
  </style>