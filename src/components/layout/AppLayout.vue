<template>
    <div class="app-layout" :class="{ 'dark': isDark }">
      <!-- Sidebar -->
      <Sidebar 
        :is-collapsed="isSidebarCollapsed"
        @toggle="toggleSidebar"
      />
  
      <!-- Main Content Area -->
      <div class="main-wrapper" :class="mainWrapperClasses">
        <!-- Navbar -->
        <Navbar @toggle-sidebar="toggleSidebar" />
  
        <!-- Page Content -->
        <main class="main-content">
          <!-- Breadcrumb -->
          <Breadcrumb class="mb-6" />
  
          <!-- Router View -->
          <router-view v-slot="{ Component, route }">
            <Transition :name="route.meta.transition || 'fade'" mode="out-in">
              <component :is="Component" :key="route.path" />
            </Transition>
          </router-view>
        </main>
  
        <!-- Footer -->
        <Footer />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useDark, useToggle } from '@vueuse/core'
  import Navbar from './header/Navbar.vue'
  import Sidebar from './sidebar/Sidebar.vue'
  import Breadcrumb from './Breadcrumb.vue'
  import Footer from './footer/Footer.vue'
  
  const isDark = useDark()
  const isSidebarCollapsed = ref(false)
  
  const mainWrapperClasses = computed(() => ({
    'ml-64': !isSidebarCollapsed.value,
    'ml-20': isSidebarCollapsed.value,
  }))
  
  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }
  </script>
  
  <style scoped>
  .app-layout {
    @apply min-h-screen bg-gray-50 dark:bg-gray-900;
    @apply transition-colors duration-200;
  }
  
  .main-wrapper {
    @apply transition-all duration-300 ease-in-out;
    @apply min-h-screen flex flex-col;
  }
  
  .main-content {
    @apply flex-1 p-6;
  }
  </style>