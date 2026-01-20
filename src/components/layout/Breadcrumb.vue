<template>
    <nav v-if="breadcrumbs.length > 0" class="breadcrumb">
      <ol class="breadcrumb-list">
        <li
          v-for="(crumb, index) in breadcrumbs"
          :key="index"
          class="breadcrumb-item"
        >
          <router-link
            v-if="index < breadcrumbs.length - 1"
            :to="crumb.path"
            class="breadcrumb-link"
          >
            {{ crumb.name }}
          </router-link>
          <span v-else class="breadcrumb-current">
            {{ crumb.name }}
          </span>
  
          <svg
            v-if="index < breadcrumbs.length - 1"
            class="breadcrumb-separator"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </li>
      </ol>
    </nav>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  
  const breadcrumbs = computed(() => {
    const matched = route.matched.filter(r => r.meta && r.meta.title)
    
    return matched.map(r => ({
      name: r.meta.title,
      path: r.path
    }))
  })
  </script>
  
  <style scoped>
  .breadcrumb {
    @apply mb-4;
  }
  
  .breadcrumb-list {
    @apply flex items-center space-x-2 text-sm;
  }
  
  .breadcrumb-item {
    @apply flex items-center;
  }
  
  .breadcrumb-link {
    @apply text-gray-500 dark:text-gray-400;
    @apply hover:text-gray-700 dark:hover:text-gray-200;
    @apply transition-colors;
  }
  
  .breadcrumb-current {
    @apply text-gray-900 dark:text-white font-medium;
  }
  
  .breadcrumb-separator {
    @apply w-4 h-4 text-gray-400 dark:text-gray-500 mx-2;
  }
  </style>