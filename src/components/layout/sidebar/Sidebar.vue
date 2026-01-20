<template>
    <aside class="sidebar" :class="sidebarClasses">
      <!-- Logo Section -->
      <div class="sidebar-header">
        <router-link to="/dashboard" class="sidebar-logo">
          <div class="logo-icon">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" class="text-primary-600" />
              <path d="M8 12h8M12 8v8" stroke="white" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>
          <Transition name="fade">
            <div v-if="!isCollapsed" class="logo-text">
              <span class="logo-title">S PROMAX</span>
              <span class="logo-subtitle">Premium ERP</span>
            </div>
          </Transition>
        </router-link>
  
        <!-- Collapse Toggle -->
        <button
          @click="$emit('toggle')"
          class="collapse-btn"
          :class="{ 'rotate-180': isCollapsed }"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
  
      <!-- Navigation Menu -->
      <SidebarMenu :is-collapsed="isCollapsed" />
  
      <!-- Footer -->
      <SidebarFooter :is-collapsed="isCollapsed" />
    </aside>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import SidebarMenu from './SidebarMenu.vue'
  import SidebarFooter from './SidebarFooter.vue'
  
  const props = defineProps({
    isCollapsed: {
      type: Boolean,
      default: false
    }
  })
  
  defineEmits(['toggle'])
  
  const sidebarClasses = computed(() => ({
    'w-64': !props.isCollapsed,
    'w-20': props.isCollapsed,
  }))
  </script>
  
  <style scoped>
  .sidebar {
    @apply fixed left-0 top-0 h-screen;
    @apply bg-white dark:bg-gray-800;
    @apply border-r border-gray-200 dark:border-gray-700;
    @apply transition-all duration-300 ease-in-out;
    @apply flex flex-col;
    @apply z-50;
  }
  
  .sidebar-header {
    @apply h-16 px-4 flex items-center justify-between;
    @apply border-b border-gray-200 dark:border-gray-700;
    @apply flex-shrink-0;
  }
  
  .sidebar-logo {
    @apply flex items-center gap-3;
    @apply hover:opacity-80 transition-opacity;
  }
  
  .logo-icon {
    @apply flex items-center justify-center flex-shrink-0;
  }
  
  .logo-text {
    @apply flex flex-col overflow-hidden;
  }
  
  .logo-title {
    @apply text-base font-bold text-gray-900 dark:text-white;
    @apply leading-tight whitespace-nowrap;
  }
  
  .logo-subtitle {
    @apply text-xs text-gray-500 dark:text-gray-400;
    @apply leading-tight;
  }
  
  .collapse-btn {
    @apply p-1.5 rounded-lg;
    @apply text-gray-400 hover:text-gray-600 dark:hover:text-gray-300;
    @apply hover:bg-gray-100 dark:hover:bg-gray-700;
    @apply transition-all;
  }
  </style>