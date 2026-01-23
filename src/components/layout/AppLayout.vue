<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Sidebar -->
      <Sidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
      
      <!-- Main Content Area -->
      <div
        :class="[
          'transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        ]"
      >
        <!-- Navbar -->
        <Navbar @toggle-sidebar="toggleSidebar" />
        
        <!-- Page Content -->
        <main class="p-6">
          <!-- Breadcrumb -->
          <Breadcrumb class="mb-6" />
          
          <!-- Page Content -->
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
        
        <!-- Footer -->
        <Footer />
      </div>
      
      <!-- Notification Container -->
      <NotificationContainer />
      
      <!-- Toast Container -->
      <ToastContainer />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import Sidebar from './Sidebar.vue'
  import Navbar from './Navbar.vue'
  import Breadcrumb from './Breadcrumb.vue'
  import Footer from './Footer.vue'
  import { NotificationContainer, ToastContainer } from '@/components/common'
  
  const sidebarCollapsed = ref(false)
  
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value)
  }
  
  onMounted(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved !== null) {
      sidebarCollapsed.value = saved === 'true'
    }
  })
  </script>
  
  <style scoped>
  .page-enter-active,
  .page-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  
  .page-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  
  .page-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  </style>