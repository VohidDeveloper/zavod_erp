<template>
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="navbar-icon-btn relative"
        :class="{ 'bg-gray-100 dark:bg-gray-700': isOpen }"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        <!-- Badge -->
        <span
          v-if="unreadCount > 0"
          class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-danger-500 rounded-full"
        >
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>
  
      <!-- Dropdown -->
      <Transition name="dropdown">
        <div v-if="isOpen" v-click-outside="closeDropdown" class="notifications-dropdown">
          <div class="dropdown-header">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Bildirishnomalar
            </h3>
            <button
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Barchasini o'qilgan deb belgilash
            </button>
          </div>
  
          <div class="dropdown-body">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="notification-item"
              :class="{ 'unread': !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <div class="notification-icon" :class="`bg-${notification.type}-100 text-${notification.type}-600 dark:bg-${notification.type}-900/30 dark:text-${notification.type}-400`">
                <component :is="getNotificationIcon(notification.type)" class="w-5 h-5" />
              </div>
              <div class="notification-content">
                <p class="notification-title">{{ notification.title }}</p>
                <p class="notification-message">{{ notification.message }}</p>
                <p class="notification-time">{{ formatTime(notification.created_at) }}</p>
              </div>
              <div v-if="!notification.read" class="notification-badge" />
            </div>
  
            <div v-if="notifications.length === 0" class="empty-state">
              <svg class="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Bildirishnomalar yo'q
              </p>
            </div>
          </div>
  
          <div class="dropdown-footer">
            <router-link to="/notifications" class="view-all-btn">
              Barchasini ko'rish
            </router-link>
          </div>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { formatDistanceToNow } from 'date-fns'
  import { uz } from 'date-fns/locale'
  
  const isOpen = ref(false)
  const notifications = ref([
    {
      id: 1,
      type: 'warning',
      title: 'Kam qoldiq',
      message: 'PVX granula qoldig\'i kritik darajada',
      created_at: new Date(Date.now() - 1000 * 60 * 5),
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Buyurtma yaratildi',
      message: 'Yangi buyurtma #ORD-2026-00236',
      created_at: new Date(Date.now() - 1000 * 60 * 30),
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Smena boshlandi',
      message: 'Decor Plast liniyasida yangi smena',
      created_at: new Date(Date.now() - 1000 * 60 * 60),
      read: true
    }
  ])
  
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.read).length
  })
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }
  
  const closeDropdown = () => {
    isOpen.value = false
  }
  
  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
  }
  
  const handleNotificationClick = (notification) => {
    notification.read = true
    // Navigate to notification link
  }
  
  const getNotificationIcon = (type) => {
    // Return appropriate icon component based on type
    return 'svg' // Placeholder
  }
  
  const formatTime = (date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: uz })
  }
  </script>
  
  <style scoped>
  .notifications-dropdown {
    @apply absolute right-0 mt-2 w-96;
    @apply bg-white dark:bg-gray-800 rounded-xl shadow-xl;
    @apply border border-gray-200 dark:border-gray-700;
    @apply overflow-hidden;
  }
  
  .dropdown-header {
    @apply px-4 py-3 border-b border-gray-200 dark:border-gray-700;
    @apply flex items-center justify-between;
  }
  
  .dropdown-body {
    @apply max-h-96 overflow-y-auto;
  }
  
  .notification-item {
    @apply px-4 py-3 flex items-start gap-3;
    @apply hover:bg-gray-50 dark:hover:bg-gray-700/50;
    @apply cursor-pointer transition-colors;
    @apply border-b border-gray-100 dark:border-gray-700;
  }
  
  .notification-item.unread {
    @apply bg-primary-50/50 dark:bg-primary-900/10;
  }
  
  .notification-icon {
    @apply w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0;
  }
  
  .notification-content {
    @apply flex-1 min-w-0;
  }
  
  .notification-title {
    @apply text-sm font-semibold text-gray-900 dark:text-white;
  }
  
  .notification-message {
    @apply text-sm text-gray-600 dark:text-gray-400 truncate;
  }
  
  .notification-time {
    @apply text-xs text-gray-500 dark:text-gray-500 mt-1;
  }
  
  .notification-badge {
    @apply w-2 h-2 rounded-full bg-primary-600 flex-shrink-0 mt-1.5;
  }
  
  .empty-state {
    @apply flex flex-col items-center justify-center py-12;
  }
  
  .dropdown-footer {
    @apply px-4 py-3 border-t border-gray-200 dark:border-gray-700;
    @apply bg-gray-50 dark:bg-gray-800/50;
  }
  
  .view-all-btn {
    @apply block w-full text-center text-sm font-medium;
    @apply text-primary-600 hover:text-primary-700 dark:text-primary-400;
    @apply transition-colors;
  }
  
  /* Dropdown transition */
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.2s ease;
  }
  
  .dropdown-enter-from {
    opacity: 0;
    transform: translateY(-10px);
  }
  
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  </style>