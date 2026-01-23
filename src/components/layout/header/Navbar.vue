<template>
    <header class="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between px-6 py-3">
        <!-- Left Section -->
        <div class="flex items-center gap-4">
          <!-- Sidebar Toggle -->
          <button
            @click="$emit('toggle-sidebar')"
            class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
          >
            <Bars3Icon class="w-6 h-6" />
          </button>
          
          <!-- Search -->
          <div class="relative hidden md:block">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Qidirish..."
              class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @focus="showSearchResults = true"
              @blur="hideSearchResults"
            />
            <MagnifyingGlassIcon class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            
            <!-- Search Results Dropdown -->
            <transition name="dropdown">
              <div
                v-if="showSearchResults && searchQuery"
                class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto"
              >
                <div v-if="searchResults.length === 0" class="px-4 py-3 text-sm text-gray-500">
                  Natija topilmadi
                </div>
                
                <a
                  v-for="result in searchResults"
                  :key="result.id"
                  :href="result.url"
                  class="block px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <p class="text-sm font-medium text-gray-900">{{ result.title }}</p>
                  <p class="text-xs text-gray-500">{{ result.description }}</p>
                </a>
              </div>
            </transition>
          </div>
        </div>
        
        <!-- Right Section -->
        <div class="flex items-center gap-2">
          <!-- Quick Actions -->
          <button
            v-tooltip="'Yangi buyurtma'"
            class="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <PlusCircleIcon class="w-6 h-6" />
          </button>
          
          <!-- Notifications -->
          <div class="relative">
            <button
              @click="toggleNotifications"
              v-tooltip="'Bildirishnomalar'"
              class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative"
            >
              <BellIcon class="w-6 h-6" />
              <span
                v-if="unreadCount > 0"
                class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
              ></span>
            </button>
            
            <!-- Notifications Dropdown -->
            <transition name="dropdown">
              <div
                v-if="showNotifications"
                v-click-outside="closeNotifications"
                class="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200"
              >
                <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 class="font-semibold text-gray-900">Bildirishnomalar</h3>
                  <button class="text-xs text-blue-600 hover:text-blue-700">
                    Barchasini o'qilgan qilish
                  </button>
                </div>
                
                <div class="max-h-96 overflow-y-auto">
                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    :class="[
                      'px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer',
                      !notification.read ? 'bg-blue-50' : ''
                    ]"
                  >
                    <div class="flex items-start gap-3">
                      <component :is="notification.icon" class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                        <p class="text-xs text-gray-500 mt-1">{{ notification.message }}</p>
                        <p class="text-xs text-gray-400 mt-1">{{ notification.time }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="notifications.length === 0" class="px-4 py-8 text-center text-gray-500 text-sm">
                    Bildirishnomalar yo'q
                  </div>
                </div>
                
                <div class="px-4 py-3 border-t border-gray-200 text-center">
                  <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Barchasini ko'rish
                  </button>
                </div>
              </div>
            </transition>
          </div>
          
          <!-- User Menu -->
          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
            >
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <UserCircleIcon class="w-5 h-5 text-gray-600" />
              </div>
              <ChevronDownIcon class="w-4 h-4 text-gray-600" />
            </button>
            
            <!-- User Dropdown -->
            <transition name="dropdown">
              <div
                v-if="showUserMenu"
                v-click-outside="closeUserMenu"
                class="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
              >
                <div class="px-4 py-3 border-b border-gray-200">
                  <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                  <p class="text-xs text-gray-500">{{ user.email }}</p>
                </div>
                
                <router-link
                  to="/profile"
                  class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserCircleIcon class="w-4 h-4" />
                  Profil
                </router-link>
                
                <router-link
                  to="/settings"
                  class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Cog6ToothIcon class="w-4 h-4" />
                  Sozlamalar
                </router-link>
                
                <div class="border-t border-gray-200 my-1"></div>
                
                <button
                  @click="handleLogout"
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <ArrowRightOnRectangleIcon class="w-4 h-4" />
                  Chiqish
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import {
    Bars3Icon,
    MagnifyingGlassIcon,
    BellIcon,
    UserCircleIcon,
    ChevronDownIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    PlusCircleIcon,
    ShoppingCartIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
  } from '@heroicons/vue/24/outline'
  
  defineEmits(['toggle-sidebar'])
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const searchQuery = ref('')
  const showSearchResults = ref(false)
  const showNotifications = ref(false)
  const showUserMenu = ref(false)
  
  const user = computed(() => authStore.user || {
    name: 'Admin User',
    email: 'admin@promax.uz'
  })
  
  const notifications = ref([
    {
      id: 1,
      title: 'Yangi buyurtma',
      message: 'Buyurtma #1234 qabul qilindi',
      time: '5 daqiqa oldin',
      icon: ShoppingCartIcon,
      read: false
    },
    {
      id: 2,
      title: 'Sklad ogohlantirishi',
      message: 'A-sifat qoldig\'i kamayib bormoqda',
      time: '1 soat oldin',
      icon: ExclamationTriangleIcon,
      read: false
    },
    {
      id: 3,
      title: 'Ishlab chiqarish tugadi',
      message: 'Buyurtma #1230 tayyor',
      time: '3 soat oldin',
      icon: CheckCircleIcon,
      read: true
    }
  ])
  
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  
  const searchResults = computed(() => {
    if (!searchQuery.value) return []
    // Implement search logic here
    return []
  })
  
  const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value
    showUserMenu.value = false
  }
  
  const closeNotifications = () => {
    showNotifications.value = false
  }
  
  const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value
    showNotifications.value = false
  }
  
  const closeUserMenu = () => {
    showUserMenu.value = false
  }
  
  const hideSearchResults = () => {
    setTimeout(() => {
      showSearchResults.value = false
    }, 200)
  }
  
  const handleLogout = async () => {
    await authStore.logout()
    router.push('/login')
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