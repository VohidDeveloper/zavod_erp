<template>
    <div class="navbar-search">
      <div class="search-icon">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Qidirish... (Ctrl+K)"
        class="search-input"
        @keydown.ctrl.k.prevent="focusSearch"
      />
      <div v-if="searchQuery" class="search-clear">
        <button @click="clearSearch" class="clear-btn">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const searchQuery = ref('')
  
  const focusSearch = () => {
    // Focus search input
  }
  
  const clearSearch = () => {
    searchQuery.value = ''
  }
  </script>
  
  <style scoped>
  .navbar-search {
    @apply relative w-full;
  }
  
  .search-icon {
    @apply absolute left-3 top-1/2 -translate-y-1/2;
    @apply text-gray-400 dark:text-gray-500 pointer-events-none;
  }
  
  .search-input {
    @apply w-full pl-10 pr-10 py-2 rounded-lg;
    @apply bg-gray-100 dark:bg-gray-700;
    @apply border border-transparent;
    @apply text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400;
    @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
    @apply transition-all;
  }
  
  .search-clear {
    @apply absolute right-3 top-1/2 -translate-y-1/2;
  }
  
  .clear-btn {
    @apply text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300;
    @apply transition-colors;
  }
  </style>