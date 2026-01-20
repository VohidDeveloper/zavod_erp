<template>
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="show" class="loading-overlay">
          <div class="loading-content">
            <Spinner size="xl" color="white" />
            <p v-if="message" class="loading-message">{{ message }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  import Spinner from '../feedback/Spinner.vue'
  
  defineProps({
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Yuklanmoqda...'
    }
  })
  </script>
  
  <style scoped>
  .loading-overlay {
    @apply fixed inset-0 z-[9999] flex items-center justify-center;
    @apply bg-black/50 backdrop-blur-sm;
  }
  
  .loading-content {
    @apply flex flex-col items-center gap-4;
  }
  
  .loading-message {
    @apply text-white text-lg font-medium;
  }
  </style>