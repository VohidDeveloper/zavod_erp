<template>
    <transition
      name="submenu"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
    >
      <div v-show="show" class="overflow-hidden">
        <div class="py-1 pl-11 space-y-1">
          <router-link
            v-for="child in items"
            :key="child.to"
            :to="child.to"
            v-slot="{ isActive }"
            custom
          >
            <a
              @click="navigateTo(child.to)"
              :class="[
                'block px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer',
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
            >
              {{ child.name }}
            </a>
          </router-link>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  defineProps({
    items: {
      type: Array,
      required: true
    },
    show: {
      type: Boolean,
      default: false
    }
  })
  
  const router = useRouter()
  
  const navigateTo = (path) => {
    router.push(path)
  }
  
  const enter = (el) => {
    el.style.height = '0'
  }
  
  const afterEnter = (el) => {
    el.style.height = 'auto'
  }
  
  const leave = (el) => {
    el.style.height = el.scrollHeight + 'px'
    el.offsetHeight // force reflow
    el.style.height = '0'
  }
  </script>
  
  <style scoped>
  .submenu-enter-active,
  .submenu-leave-active {
    transition: height 0.3s ease;
  }
  
  .submenu-enter-from,
  .submenu-leave-to {
    height: 0;
  }
  </style>