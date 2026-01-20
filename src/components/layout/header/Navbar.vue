<template>
    <header class="navbar">
      <div class="navbar-content">
        <!-- Left: Hamburger & Logo -->
        <div class="navbar-left">
          <button
            @click="$emit('toggle-sidebar')"
            class="navbar-hamburger"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
  
          <NavbarLogo />
        </div>
  
        <!-- Center: Search -->
        <div class="navbar-center hidden lg:block">
          <NavbarSearch />
        </div>
  
        <!-- Right: Actions -->
        <div class="navbar-right">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDark()"
            class="navbar-icon-btn"
            title="Tungi rejim"
          >
            <svg v-if="!isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
  
          <!-- Notifications -->
          <NavbarNotifications />
  
          <!-- Profile -->
          <NavbarProfile />
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { useDark, useToggle } from '@vueuse/core'
  import NavbarLogo from './NavbarLogo.vue'
  import NavbarSearch from './NavbarSearch.vue'
  import NavbarNotifications from './NavbarNotifications.vue'
  import NavbarProfile from './NavbarProfile.vue'
  
  defineEmits(['toggle-sidebar'])
  
  const isDark = useDark()
  const toggleDark = useToggle(isDark)
  </script>
  
  <style scoped>
  .navbar {
    @apply sticky top-0 z-40;
    @apply bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700;
    @apply shadow-sm;
  }
  
  .navbar-content {
    @apply h-16 px-4 flex items-center justify-between gap-4;
  }
  
  .navbar-left {
    @apply flex items-center gap-4;
  }
  
  .navbar-hamburger {
    @apply lg:hidden p-2 rounded-lg;
    @apply text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200;
    @apply hover:bg-gray-100 dark:hover:bg-gray-700;
    @apply transition-colors;
  }
  
  .navbar-center {
    @apply flex-1 max-w-2xl;
  }
  
  .navbar-right {
    @apply flex items-center gap-2;
  }
  
  .navbar-icon-btn {
    @apply p-2 rounded-lg;
    @apply text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200;
    @apply hover:bg-gray-100 dark:hover:bg-gray-700;
    @apply transition-colors;
  }
  </style>