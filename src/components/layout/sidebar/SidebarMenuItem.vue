<template>
    <div>
      <!-- Main Menu Item -->
      <router-link
        v-if="!item.children"
        :to="item.to"
        v-slot="{ isActive }"
        custom
      >
        <a
          @click="navigateTo(item.to)"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer group',
            isActive
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          ]"
          v-tooltip="collapsed ? item.name : ''"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          
          <transition name="fade">
            <span v-if="!collapsed" class="font-medium text-sm flex-1">
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
      
      <!-- Menu Item with Submenu -->
      <div v-else>
        <button
          @click="toggleSubmenu"
          :class="[
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group',
            isSubmenuOpen || isChildActive
              ? 'bg-gray-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          ]"
          v-tooltip="collapsed ? item.name : ''"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          
          <transition name="fade">
            <span v-if="!collapsed" class="font-medium text-sm flex-1 text-left">
              {{ item.name }}
            </span>
          </transition>
          
          <transition name="fade">
            <ChevronDownIcon
              v-if="!collapsed"
              :class="[
                'w-4 h-4 transition-transform flex-shrink-0',
                isSubmenuOpen ? 'transform rotate-180' : ''
              ]"
            />
          </transition>
        </button>
        
        <!-- Submenu -->
        <SidebarSubmenu
          v-if="!collapsed"
          :items="item.children"
          :show="isSubmenuOpen"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { ChevronDownIcon } from '@heroicons/vue/24/outline'
  import SidebarSubmenu from './SidebarSubmenu.vue'
  
  const props = defineProps({
    item: {
      type: Object,
      required: true
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  })
  
  const router = useRouter()
  const route = useRoute()
  
  const isSubmenuOpen = ref(false)
  
  const isChildActive = computed(() => {
    if (!props.item.children) return false
    return props.item.children.some(child => route.path.startsWith(child.to))
  })
  
  // Auto-open submenu if child is active
  watch(() => route.path, (newPath) => {
    if (isChildActive.value) {
      isSubmenuOpen.value = true
    }
  }, { immediate: true })
  
  // Close submenu when sidebar collapses
  watch(() => props.collapsed, (newVal) => {
    if (newVal) {
      isSubmenuOpen.value = false
    }
  })
  
  const toggleSubmenu = () => {
    if (!props.collapsed) {
      isSubmenuOpen.value = !isSubmenuOpen.value
    } else {
      // Navigate to parent route when collapsed
      navigateTo(props.item.to)
    }
  }
  
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
  </style>
  