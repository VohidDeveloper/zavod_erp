<template>
    <aside
      :class="[
        'fixed top-0 left-0 z-40 h-screen transition-all duration-300',
        'bg-white border-r border-gray-200',
        collapsed ? 'w-20' : 'w-64'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-gray-200">
        <router-link to="/dashboard" class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">S</span>
          </div>
          <transition name="fade">
            <span v-if="!collapsed" class="text-xl font-bold text-gray-900">
              PROMAX
            </span>
          </transition>
        </router-link>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <div v-for="group in menuGroups" :key="group.name" class="mb-6">
          <!-- Group Title -->
          <div
            v-if="!collapsed && group.name"
            class="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            {{ group.name }}
          </div>
          
          <!-- Menu Items -->
          <div class="space-y-1 px-2">
            <router-link
              v-for="item in group.items"
              :key="item.to"
              :to="item.to"
              v-slot="{ isActive }"
              custom
            >
              <a
                @click="navigateTo(item.to)"
                :class="[
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                ]"
                v-tooltip="collapsed ? item.name : ''"
              >
                <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
                
                <transition name="fade">
                  <span v-if="!collapsed" class="font-medium text-sm">
                    {{ item.name }}
                  </span>
                </transition>
                
                <span
                  v-if="item.badge && !collapsed"
                  class="ml-auto px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full"
                >
                  {{ item.badge }}
                </span>
              </a>
            </router-link>
          </div>
        </div>
      </nav>
      
      <!-- User Section -->
      <div class="border-t border-gray-200 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <UserCircleIcon class="w-6 h-6 text-gray-600" />
          </div>
          
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
        </div>
      </div>
    </aside>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import {
    HomeIcon,
    CubeIcon,
    ShoppingCartIcon,
    CurrencyDollarIcon,
    UsersIcon,
    ChartBarIcon,
    WrenchScrewdriverIcon,
    Cog6ToothIcon,
    UserCircleIcon
  } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    collapsed: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['toggle'])
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const user = computed(() => authStore.user || {
    name: 'Admin User',
    role: 'Administrator'
  })
  
  const menuGroups = [
    {
      name: 'Asosiy',
      items: [
        { name: 'Dashboard', to: '/dashboard', icon: HomeIcon }
      ]
    },
    {
      name: 'Ishlab chiqarish',
      items: [
        { name: 'Ombor', to: '/warehouse', icon: CubeIcon },
        { name: 'Ishlab chiqarish', to: '/production', icon: WrenchScrewdriverIcon }
      ]
    },
    {
      name: 'Savdo',
      items: [
        { name: 'Savdo', to: '/sales', icon: ShoppingCartIcon },
        { name: 'Moliya', to: '/finance', icon: CurrencyDollarIcon }
      ]
    },
    {
      name: 'Boshqaruv',
      items: [
        { name: 'Xodimlar', to: '/hr', icon: UsersIcon },
        { name: 'Ta\'mirlash', to: '/maintenance', icon: WrenchScrewdriverIcon },
        { name: 'Analitika', to: '/analytics', icon: ChartBarIcon }
      ]
    },
    {
      name: 'Sistema',
      items: [
        { name: 'Sozlamalar', to: '/settings', icon: Cog6ToothIcon }
      ]
    }
  ]
  
  const navigateTo = (path) => {
    router.push(path)
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
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #d1d5db;
  }
  </style>