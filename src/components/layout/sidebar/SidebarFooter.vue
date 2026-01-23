<template>
    <div class="border-t border-gray-200 p-4">
      <div class="flex items-center gap-3">
        <!-- User Avatar -->
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span class="text-white font-semibold text-sm">
            {{ initials }}
          </span>
        </div>
        
        <!-- User Info -->
        <transition name="fade">
          <div v-if="!collapsed" class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ user.name }}
            </p>
            <p class="text-xs text-gray-500 truncate">
              {{ user.role }}
            </p>
          </div>
        </transition>
        
        <!-- Settings Button -->
        <transition name="fade">
          <button
            v-if="!collapsed"
            @click="openSettings"
            v-tooltip="'Sozlamalar'"
            class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <Cog6ToothIcon class="w-5 h-5" />
          </button>
        </transition>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    collapsed: {
      type: Boolean,
      default: false
    }
  })
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const user = computed(() => authStore.user || {
    name: 'Admin User',
    role: 'Administrator'
  })
  
  const initials = computed(() => {
    if (!user.value.name) return 'U'
    return user.value.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })
  
  const openSettings = () => {
    router.push('/settings')
  }
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>