<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ishlab chiqarish liniyalari</h1>
          <p class="text-gray-600 mt-1">Liniyalar boshqaruvi va monitoring</p>
        </div>
        <button
          v-if="can('CREATE_LINE')"
          @click="openModal"
          class="btn-primary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Yangi liniya
        </button>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jami liniyalar</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Faol</p>
              <p class="text-2xl font-bold text-success-600 mt-2">{{ stats.active }}</p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Ta'mirda</p>
              <p class="text-2xl font-bold text-warning-600 mt-2">{{ stats.maintenance }}</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">To'xtagan</p>
              <p class="text-2xl font-bold text-danger-600 mt-2">{{ stats.stopped }}</p>
            </div>
            <div class="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Lines Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="line in lines"
          :key="line.id"
          class="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
          @click="viewLine(line)"
        >
          <div class="h-2" :class="getStatusBgClass(line.status)"></div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900 text-lg">{{ line.name }}</h3>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getStatusClass(line.status)"
              >
                {{ formatStatus(line.status) }}
              </span>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Mahsulot:</span>
                <span class="font-medium text-gray-900">{{ line.product?.name }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Bugungi ishlab chiqarish:</span>
                <span class="font-medium text-gray-900">{{ formatNumber(line.today_output) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Samaradorlik:</span>
                <span class="font-medium text-gray-900">{{ line.efficiency }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  class="h-2 rounded-full transition-all duration-500"
                  :class="getEfficiencyColor(line.efficiency)"
                  :style="{ width: `${line.efficiency}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useProductionStore } from '@/stores/production'
  import { usePermissions } from '@/composables/usePermissions'
  import { useNotifications } from '@/composables/useNotifications'
  import { formatNumber } from '@/utils/formatters'
  
  const productionStore = useProductionStore()
  const { can } = usePermissions()
  const notifications = useNotifications()
  
  const stats = ref({
    total: 10,
    active: 8,
    maintenance: 1,
    stopped: 1,
  })
  
  const lines = ref([])
  
  onMounted(() => {
    fetchLines()
  })
  
  async function fetchLines() {
    try {
      await productionStore.fetchLines()
      lines.value = productionStore.lines
    } catch (error) {
      notifications.apiError(error)
    }
  }
  
  function formatStatus(status) {
    const statuses = {
      active: 'Faol',
      maintenance: 'Ta\'mirda',
      stopped: 'To\'xtagan',
    }
    return statuses[status] || status
  }
  
  function getStatusClass(status) {
    const classes = {
      active: 'bg-success-100 text-success-800',
      maintenance: 'bg-warning-100 text-warning-800',
      stopped: 'bg-danger-100 text-danger-800',
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  
  function getStatusBgClass(status) {
    const classes = {
      active: 'bg-success-500',
      maintenance: 'bg-warning-500',
      stopped: 'bg-danger-500',
    }
    return classes[status] || 'bg-gray-500'
  }
  
  function getEfficiencyColor(efficiency) {
    if (efficiency >= 80) return 'bg-success-500'
    if (efficiency >= 60) return 'bg-warning-500'
    return 'bg-danger-500'
  }
  
  function openModal() {
    console.log('Open line modal')
  }
  
  function viewLine(line) {
    console.log('View line:', line)
  }
  </script>