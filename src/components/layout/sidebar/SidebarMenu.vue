<template>
    <nav class="flex-1 overflow-y-auto py-4 custom-scrollbar">
      <div v-for="group in menuGroups" :key="group.name" class="mb-6">
        <!-- Group Title -->
        <div
          v-if="!collapsed && group.name"
          class="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
        >
          {{ group.name }}
        </div>
        
        <!-- Divider for collapsed mode -->
        <div v-else-if="collapsed && group.name" class="mx-4 mb-4 border-t border-gray-200"></div>
        
        <!-- Menu Items -->
        <div class="space-y-1 px-2">
          <SidebarMenuItem
            v-for="item in group.items"
            :key="item.to"
            :item="item"
            :collapsed="collapsed"
          />
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import SidebarMenuItem from './SidebarMenuItem.vue'
  import {
    HomeIcon,
    CubeIcon,
    ShoppingCartIcon,
    CurrencyDollarIcon,
    UsersIcon,
    ChartBarIcon,
    WrenchScrewdriverIcon,
    Cog6ToothIcon
  } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    collapsed: {
      type: Boolean,
      default: false
    }
  })
  
  const menuGroups = computed(() => [
    {
      name: 'Asosiy',
      items: [
        {
          name: 'Dashboard',
          to: '/dashboard',
          icon: HomeIcon
        }
      ]
    },
    {
      name: 'Ishlab chiqarish',
      items: [
        {
          name: 'Ombor',
          to: '/warehouse',
          icon: CubeIcon,
          badge: null,
          children: [
            { name: 'Mahsulotlar', to: '/warehouse/products' },
            { name: 'Qabul qilish', to: '/warehouse/receipts' },
            { name: 'Chiqim', to: '/warehouse/issues' },
            { name: 'Qoldiqlar', to: '/warehouse/inventory' }
          ]
        },
        {
          name: 'Ishlab chiqarish',
          to: '/production',
          icon: WrenchScrewdriverIcon,
          children: [
            { name: 'Buyurtmalar', to: '/production/orders' },
            { name: 'Smenalar', to: '/production/shifts' },
            { name: 'Nazorat', to: '/production/quality' }
          ]
        }
      ]
    },
    {
      name: 'Savdo',
      items: [
        {
          name: 'Savdo',
          to: '/sales',
          icon: ShoppingCartIcon,
          children: [
            { name: 'Buyurtmalar', to: '/sales/orders' },
            { name: 'Mijozlar', to: '/sales/customers' },
            { name: 'Yetkazish', to: '/sales/deliveries' }
          ]
        },
        {
          name: 'Moliya',
          to: '/finance',
          icon: CurrencyDollarIcon,
          children: [
            { name: 'To\'lovlar', to: '/finance/payments' },
            { name: 'Hisobotlar', to: '/finance/reports' }
          ]
        }
      ]
    },
    {
      name: 'Boshqaruv',
      items: [
        {
          name: 'Xodimlar',
          to: '/hr',
          icon: UsersIcon,
          children: [
            { name: 'Xodimlar ro\'yxati', to: '/hr/employees' },
            { name: 'Ish haqi', to: '/hr/payroll' },
            { name: 'Davomat', to: '/hr/attendance' }
          ]
        },
        {
          name: 'Ta\'mirlash',
          to: '/maintenance',
          icon: WrenchScrewdriverIcon,
          children: [
            { name: 'Uskunalar', to: '/maintenance/equipment' },
            { name: 'Ta\'mirlar', to: '/maintenance/repairs' }
          ]
        },
        {
          name: 'Analitika',
          to: '/analytics',
          icon: ChartBarIcon
        }
      ]
    },
    {
      name: 'Sistema',
      items: [
        {
          name: 'Sozlamalar',
          to: '/settings',
          icon: Cog6ToothIcon
        }
      ]
    }
  ])
  </script>
  
  <style scoped>
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