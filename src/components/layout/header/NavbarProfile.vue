<template>
    <div class="relative">
      <button
        @click="toggle"
        class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <span class="text-white font-semibold text-sm">
            {{ initials }}
          </span>
        </div>
        <div class="hidden md:block text-left">
          <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
          <p class="text-xs text-gray-500">{{ user.role }}</p>
        </div>
        <ChevronDownIcon class="w-4 h-4 text-gray-600" />
      </button>
      
      <!-- User Dropdown -->
      <transition name="dropdown">
        <div
          v-if="isOpen"
          v-click-outside="close"
          class="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
        >
          <!-- User Info -->
          <div class="px-4 py-3 border-b border-gray-200">
            <p class="text-sm font-semibold text-gray-900">{{ user.name }}</p>
            <p class="text-xs text-gray-500">{{ user.email }}</p>
            <div v-if="user.role" class="mt-2">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ user.role }}
              </span>
            </div>
          </div>
          
          <!-- Menu Items -->
          <div class="py-1">
            <router-link
              to="/profile"
              class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <UserCircleIcon class="w-5 h-5 text-gray-400" />
              Profil
            </router-link>
            
            <router-link
              to="/settings"
              class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Cog6ToothIcon class="w-5 h-5 text-gray-400" />
              Sozlamalar
            </router-link>
            
            <router-link
              to="/change-password"
              class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <KeyIcon class="w-5 h-5 text-gray-400" />
              Parolni o'zgartirish
            </router-link>
          </div>
          
          <!-- Theme Toggle -->
          <div class="px-4 py-2 border-t border-gray-200">
            <button
              @click="toggleTheme"
              class="flex items-center justify-between w-full text-sm text-gray-700 hover:bg-gray-50 px-0 py-2 rounded transition-colors"
            >
              <div class="flex items-center gap-3">
                <component :is="themeIcon" class="w-5 h-5 text-gray-400" />
                <span>{{ themeText }}</span>
              </div>
              <div class="w-10 h-5 bg-gray-300 rounded-full relative">
                <div
                  :class="[
                    'absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform',
                    isDarkMode ? 'transform translate-x-5' : ''
                  ]"
                ></div>
              </div>
            </button>
          </div>
          
          <!-- Logout -->
          <div class="border-t border-gray-200 py-1">
            <button
              @click="handleLogout"
              class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
              Chiqish
            </button>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import {
    UserCircleIcon,
    Cog6ToothIcon,
    KeyIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
    SunIcon,
    MoonIcon
  } from '@heroicons/vue/24/outline'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const isOpen = ref(false)
  const isDarkMode = ref(false)
  
  const user = computed(() => authStore.user || {
    name: 'Admin User',
    email: 'admin@promax.uz',
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
  
  const themeIcon = computed(() => isDarkMode.value ? MoonIcon : SunIcon)
  const themeText = computed(() => isDarkMode.value ? 'Qorong\'i rejim' : 'Yorug\' rejim')
  
  const toggle = () => {
    isOpen.value = !isOpen.value
  }
  
  const close = () => {
    isOpen.value = false
  }
  
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    // Implement theme switching logic
    // document.documentElement.classList.toggle('dark')
  }
  
  const handleLogout = async () => {
    try {
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  </script>
  
  <style scoped>
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.2s ease;
  }
  
  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  </style>