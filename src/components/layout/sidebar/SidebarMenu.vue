<template>
    <nav class="sidebar-nav">
      <div class="nav-section">
        <p v-if="!isCollapsed" class="nav-section-title">Asosiy</p>
        
        <SidebarMenuItem
          to="/dashboard"
          :icon="HomeIcon"
          label="Dashboard"
          :is-collapsed="isCollapsed"
        />
      </div>
  
      <div class="nav-section">
        <p v-if="!isCollapsed" class="nav-section-title">Modullar</p>
  
        <!-- Warehouse -->
        <SidebarMenuItem
          v-if="hasPermission('read:warehouse')"
          to="/warehouse"
          :icon="CubeIcon"
          label="Ombor"
          :is-collapsed="isCollapsed"
          :badge="lowStockCount"
        >
          <SidebarSubmenu v-if="!isCollapsed">
            <SidebarMenuItem to="/warehouse/receipts" label="Qabul qilish" sub />
            <SidebarMenuItem to="/warehouse/stock" label="Qoldiqlar" sub />
            <SidebarMenuItem to="/warehouse/requests" label="So'rovlar" sub />
          </SidebarSubmenu>
        </SidebarMenuItem>
  
        <!-- Production -->
        <SidebarMenuItem
          v-if="hasPermission('read:production')"
          to="/production"
          :icon="CogIcon"
          label="Ishlab chiqarish"
          :is-collapsed="isCollapsed"
        >
          <SidebarSubmenu v-if="!isCollapsed">
            <SidebarMenuItem to="/production/shifts" label="Smenalar" sub />
            <SidebarMenuItem to="/production/lines" label="Liniyalar" sub />
            <SidebarMenuItem to="/production/output" label="Mahsulot" sub />
          </SidebarSubmenu>
        </SidebarMenuItem>
  
        <!-- Sales -->
        <SidebarMenuItem
          v-if="hasPermission('read:sales')"
          to="/sales"
          :icon="ShoppingCartIcon"
          label="Sotuv"
          :is-collapsed="isCollapsed"
        >
          <SidebarSubmenu v-if="!isCollapsed">
            <SidebarMenuItem to="/sales/customers" label="Mijozlar" sub />
            <SidebarMenuItem to="/sales/orders" label="Buyurtmalar" sub />
            <SidebarMenuItem to="/sales/products" label="Mahsulotlar" sub />
          </SidebarSubmenu>
        </SidebarMenuItem>
  
        <!-- Finance -->
        <SidebarMenuItem
          v-if="hasPermission('read:finance')"
          to="/finance"
          :icon="CurrencyDollarIcon"
          label="Moliya"
          :is-collapsed="isCollapsed"
        >
          <SidebarSubmenu v-if="!isCollapsed">
            <SidebarMenuItem to="/finance/transactions" label="Operatsiyalar" sub />
            <SidebarMenuItem to="/finance/reports" label="Hisobotlar" sub />
          </SidebarSubmenu>
        </SidebarMenuItem>
  
        <!-- HR -->
        <SidebarMenuItem
          v-if="hasPermission('read:hr')"
          to="/hr"
          :icon="UsersIcon"
          label="HR"
          :is-collapsed="isCollapsed"
        >
          <SidebarSubmenu v-if="!isCollapsed">
            <SidebarMenuItem to="/hr/employees" label="Xodimlar" sub />
            <SidebarMenuItem to="/hr/attendance" label="Davomat" sub />
            <SidebarMenuItem to="/hr/salaries" label="Ish haqi" sub />
          </SidebarSubmenu>
        </SidebarMenuItem>
  
        <!-- Maintenance -->
        <SidebarMenuItem
          v-if="hasPermission('read:maintenance')"
          to="/maintenance"
          :icon="WrenchIcon"
          label="Texnik xizmat"
          :is-collapsed="isCollapsed"
        >
          <SidebarSubmenu v-if="!isCollapsed">
            <SidebarMenuItem to="/maintenance/machines" label="Uskunalar" sub />
            <SidebarMenuItem to="/maintenance/requests" label="So'rovlar" sub />
          </SidebarSubmenu>
        </SidebarMenuItem>
  
        <!-- Analytics -->
        <SidebarMenuItem
          v-if="hasPermission('read:analytics')"
          to="/analytics"
          :icon="ChartBarIcon"
          label="Analitika"
          :is-collapsed="isCollapsed"
        >
          <SidebarSubmenu v-if="!isCollapsed">
            <SidebarMenuItem to="/analytics/production" label="Ishlab chiqarish" sub />
            <SidebarMenuItem to="/analytics/sales" label="Sotuv" sub />
            <SidebarMenuItem to="/analytics/finance" label="Moliya" sub />
          </SidebarSubmenu>
        </SidebarMenuItem>
      </div>
  
      <!-- Settings -->
      <div v-if="hasPermission('manage:users')" class="nav-section">
        <p v-if="!isCollapsed" class="nav-section-title">Tizim</p>
        
        <SidebarMenuItem
          to="/settings"
          :icon="CogIcon"
          label="Sozlamalar"
          :is-collapsed="isCollapsed"
        />
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useAuth } from '@/composables/useAuth'
  import {
    HomeIcon,
    CubeIcon,
    CogIcon,
    ShoppingCartIcon,
    CurrencyDollarIcon,
    UsersIcon,
    WrenchIcon,
    ChartBarIcon,
  } from '@heroicons/vue/24/outline'
  import SidebarMenuItem from './SidebarMenuItem.vue'
  import SidebarSubmenu from './SidebarSubmenu.vue'
  
  defineProps({
    isCollapsed: {
      type: Boolean,
      default: false
    }
  })
  
  const { hasPermission } = useAuth()
  const lowStockCount = ref(5) // This should come from store
  </script>
  
  <style scoped>
  .sidebar-nav {
    @apply flex-1 overflow-y-auto overflow-x-hidden;
    @apply py-4 px-3;
    @apply space-y-6;
  }
  
  .nav-section {
    @apply space-y-1;
  }
  
  .nav-section-title {
    @apply px-3 text-xs font-semibold text-gray-500 dark:text-gray-400;
    @apply uppercase tracking-wider mb-2;
  }
  
  /* Custom Scrollbar */
  .sidebar-nav::-webkit-scrollbar {
    @apply w-2;
  }
  
  .sidebar-nav::-webkit-scrollbar-track {
    @apply bg-transparent;
  }
  
  .sidebar-nav::-webkit-scrollbar-thumb {
    @apply bg-gray-300 dark:bg-gray-600 rounded-full;
  }
  
  .sidebar-nav::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-400 dark:bg-gray-500;
  }
  </style>