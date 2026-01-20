<template>
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="profile-button"
        :class="{ 'ring-2 ring-primary-500': isOpen }"
      >
        <img
          :src="userAvatar"
          :alt="user?.first_name"
          class="profile-avatar"
        />
        <div class="profile-info hidden lg:block">
          <p class="profile-name">{{ userFullName }}</p>
          <p class="profile-role">{{ userRole }}</p>
        </div>
        <svg class="w-4 h-4 text-gray-400 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
  
      <!-- Dropdown Menu -->
      <Transition name="dropdown">
        <div v-if="isOpen" v-click-outside="closeDropdown" class="profile-dropdown">
          <div class="dropdown-header">
            <div class="flex items-center gap-3">
              <img :src="userAvatar" :alt="user?.first_name" class="w-12 h-12 rounded-full" />
              <div>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ userFullName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ user?.email }}
                </p>
              </div>
            </div>
          </div>
  
          <div class="dropdown-body">
            <router-link to="/profile" class="dropdown-item">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profil</span>
            </router-link>
  
            <router-link to="/settings" class="dropdown-item">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Sozlamalar</span>
            </router-link>
  
            <router-link to="/change-password" class="dropdown-item">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span>Parolni o'zgartirish</span>
            </router-link>
          </div>
  
          <div class="dropdown-footer">
            <button @click="handleLogout" class="logout-btn">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useAuth } from '@/composables/useAuth'
  
  const { user, logout } = useAuth()
  const isOpen = ref(false)
  
  const userFullName = computed(() => {
    if (!user.value) return 'Foydalanuvchi'
    return `${user.value.first_name} ${user.value.last_name}`
  })
  
  const userRole = computed(() => {
    return user.value?.role?.display_name || 'Operator'
  })
  
  const userAvatar = computed(() => {
    return user.value?.avatar || `https://ui-avatars.com/api/?name=${userFullName.value}&background=3b82f6&color=fff`
  })
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }
  
  const closeDropdown = () => {
    isOpen.value = false
  }
  
  const handleLogout = async () => {
    await logout()
    closeDropdown()
  }
  </script>
  
  <style scoped>
  .profile-button {
    @apply flex items-center gap-3 px-3 py-2 rounded-lg;
    @apply hover:bg-gray-100 dark:hover:bg-gray-700;
    @apply transition-all;
  }
  
  .profile-avatar {
    @apply w-8 h-8 rounded-full object-cover;
  }
  
  .profile-info {
    @apply text-left;
  }
  
  .profile-name {
    @apply text-sm font-medium text-gray-900 dark:text-white;
    @apply leading-tight;
  }
  
  .profile-role {
    @apply text-xs text-gray-500 dark:text-gray-400;
    @apply leading-tight;
  }
  
  .profile-dropdown {
    @apply absolute right-0 mt-2 w-64;
    @apply bg-white dark:bg-gray-800 rounded-xl shadow-xl;
    @apply border border-gray-200 dark:border-gray-700;
    @apply overflow-hidden;
  }
  
  .dropdown-header {
    @apply px-4 py-3 border-b border-gray-200 dark:border-gray-700;
  }
  
  .dropdown-body {
    @apply py-2;
  }
  
  .dropdown-item {
    @apply flex items-center gap-3 px-4 py-2.5;
    @apply text-sm text-gray-700 dark:text-gray-300;
    @apply hover:bg-gray-50 dark:hover:bg-gray-700/50;
    @apply transition-colors;
  }
  
  .dropdown-footer {
    @apply px-2 py-2 border-t border-gray-200 dark:border-gray-700;
    @apply bg-gray-50 dark:bg-gray-800/50;
  }
  
  .logout-btn {
    @apply flex items-center gap-3 w-full px-3 py-2 rounded-lg;
    @apply text-sm font-medium text-danger-600 dark:text-danger-400;
    @apply hover:bg-danger-50 dark:hover:bg-danger-900/20;
    @apply transition-colors;
  }
  </style>