<template>
    <div class="relative">
      <button
        @click="toggle"
        v-tooltip="'Bildirishnomalar'"
        class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative"
      >
        <BellIcon class="w-6 h-6" />
        <span
          v-if="unreadCount > 0"
          class="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
        >
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>
      
      <!-- Notifications Dropdown -->
      <transition name="dropdown">
        <div
          v-if="isOpen"
          v-click-outside="close"
          class="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
        >
          <!-- Header -->
          <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900">Bildirishnomalar</h3>
            <button
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              class="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Barchasini o'qilgan qilish
            </button>
          </div>
          
          <!-- Notifications List -->
          <div class="max-h-96 overflow-y-auto">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              @click="handleNotificationClick(notification)"
              :class="[
                'px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors',
                !notification.read ? 'bg-blue-50' : ''
              ]"
            >
              <div class="flex items-start gap-3">
                <!-- Icon -->
                <div
                  :class="[
                    'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                    getNotificationColor(notification.type)
                  ]"
                >
                  <component :is="notification.icon" class="w-5 h-5" />
                </div>
                
                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">
                    {{ notification.title }}
                  </p>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ notification.time }}
                  </p>
                </div>
                
                <!-- Unread indicator -->
                <div v-if="!notification.read" class="flex-shrink-0">
                  <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div v-if="notifications.length === 0" class="px-4 py-12 text-center">
              <BellIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500 text-sm">Bildirishnomalar yo'q</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="px-4 py-3 border-t border-gray-200 text-center">
            <router-link
              to="/notifications"
              class="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Barchasini ko'rish
            </router-link>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import {
    BellIcon,
    ShoppingCartIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    InformationCircleIcon
  } from '@heroicons/vue/24/outline'
  
  const router = useRouter()
  
  const isOpen = ref(false)
  
  // Sample notifications - Bu backend dan keladi
  const notifications = ref([
    {
      id: 1,
      title: 'Yangi buyurtma',
      message: 'Buyurtma #1234 qabul qilindi',
      time: '5 daqiqa oldin',
      icon: ShoppingCartIcon,
      type: 'info',
      read: false,
      url: '/sales/orders/1234'
    },
    {
      id: 2,
      title: 'Sklad ogohlantirishi',
      message: 'A-sifat qoldig\'i kamayib bormoqda (50 dona)',
      time: '1 soat oldin',
      icon: ExclamationTriangleIcon,
      type: 'warning',
      read: false,
      url: '/warehouse/products'
    },
    {
      id: 3,
      title: 'Ishlab chiqarish tugadi',
      message: 'Buyurtma #1230 ishlab chiqarish yakunlandi',
      time: '3 soat oldin',
      icon: CheckCircleIcon,
      type: 'success',
      read: true,
      url: '/production/orders/1230'
    },
    {
      id: 4,
      title: 'To\'lov qabul qilindi',
      message: 'Buyurtma #1228 uchun to\'lov qabul qilindi (15,000,000 UZS)',
      time: '5 soat oldin',
      icon: CheckCircleIcon,
      type: 'success',
      read: true,
      url: '/finance/payments'
    }
  ])
  
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  
  const toggle = () => {
    isOpen.value = !isOpen.value
  }
  
  const close = () => {
    isOpen.value = false
  }
  
  const getNotificationColor = (type) => {
    const colors = {
      info: 'bg-blue-100 text-blue-600',
      success: 'bg-green-100 text-green-600',
      warning: 'bg-yellow-100 text-yellow-600',
      error: 'bg-red-100 text-red-600'
    }
    return colors[type] || colors.info
  }
  
  const handleNotificationClick = (notification) => {
    // Mark as read
    notification.read = true
    
    // Navigate to URL if exists
    if (notification.url) {
      router.push(notification.url)
    }
    
    close()
  }
  
  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
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