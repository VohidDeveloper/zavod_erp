<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Smenalar</h1>
          <p class="text-gray-600 mt-1">Ish smenalari boshqaruvi</p>
        </div>
        <button
          v-if="can('CREATE_SHIFT')"
          @click="openModal"
          class="btn-primary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Yangi smena
        </button>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Ertalabki smena</p>
              <p class="text-2xl font-bold text-warning-600 mt-2">{{ stats.morning }}</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-3">08:00 - 16:00</p>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Kunduzi smena</p>
              <p class="text-2xl font-bold text-primary-600 mt-2">{{ stats.afternoon }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-3">16:00 - 24:00</p>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Kechki smena</p>
              <p class="text-2xl font-bold text-gray-700 mt-2">{{ stats.night }}</p>
            </div>
            <div class="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-3">00:00 - 08:00</p>
        </div>
      </div>
  
      <!-- Shifts Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Smena</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vaqt</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xodimlar</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liniyalar</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">Yuklanmoqda...</td>
            </tr>
            <tr v-else-if="!shifts.length">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">Smenalar topilmadi</td>
            </tr>
            <tr v-else v-for="shift in shifts" :key="shift.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getShiftClass(shift.type)"
                >
                  {{ formatShift(shift.type) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ shift.start_time }} - {{ shift.end_time }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ shift.workers_count }} ta
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ shift.active_lines }} / {{ shift.total_lines }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="shift.is_active ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ shift.is_active ? 'Faol' : 'Tugallangan' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="viewShift(shift)"
                  class="text-primary-600 hover:text-primary-900"
                >
                  Ko'rish
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useProductionStore } from '@/stores/production'
  import { usePermissions } from '@/composables/usePermissions'
  import { useNotifications } from '@/composables/useNotifications'
  
  const productionStore = useProductionStore()
  const { can } = usePermissions()
  const notifications = useNotifications()
  
  const stats = ref({
    morning: 150,
    afternoon: 180,
    night: 120,
  })
  
  const shifts = ref([])
  const loading = ref(false)
  
  onMounted(() => {
    fetchShifts()
  })
  
  async function fetchShifts() {
    loading.value = true
    try {
      await productionStore.fetchShifts()
      shifts.value = productionStore.shifts
    } catch (error) {
      notifications.apiError(error)
    } finally {
      loading.value = false
    }
  }
  
  function formatShift(type) {
    const shifts = {
      morning: 'Ertalabki',
      afternoon: 'Kunduzi',
      night: 'Kechki',
    }
    return shifts[type] || type
  }
  
  function getShiftClass(type) {
    const classes = {
      morning: 'bg-warning-100 text-warning-800',
      afternoon: 'bg-primary-100 text-primary-800',
      night: 'bg-gray-700 text-white',
    }
    return classes[type] || 'bg-gray-100 text-gray-800'
  }
  
  function openModal() {
    console.log('Open shift modal')
  }
  
  function viewShift(shift) {
    console.log('View shift:', shift)
  }
  </script>