<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">TA jadvali</h1>
          <p class="text-gray-600 mt-1">Texnik xizmat ko'rsatish jadvali</p>
        </div>
        <div class="flex gap-2">
          <select v-model="selectedMonth" class="input" @change="fetchSchedule">
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
          <button
            v-if="can('CREATE_SCHEDULE')"
            @click="openCreateModal"
            class="btn-primary flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Yangi jadval
          </button>
        </div>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jami TA lari</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Rejalashtirilgan</p>
              <p class="text-2xl font-bold text-primary-600 mt-2">{{ stats.scheduled }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jarayonda</p>
              <p class="text-2xl font-bold text-warning-600 mt-2">{{ stats.in_progress }}</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Tugallangan</p>
              <p class="text-2xl font-bold text-success-600 mt-2">{{ stats.completed }}</p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Schedule Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uskuna</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TA turi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mas'ul</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioritet</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">Yuklanmoqda...</td>
            </tr>
            <tr v-else-if="!schedules.length">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">Jadval topilmadi</td>
            </tr>
            <tr v-else v-for="schedule in schedules" :key="schedule.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ schedule.machine?.name }}</p>
                  <p class="text-xs text-gray-500">{{ schedule.machine?.code }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ formatMaintenanceType(schedule.maintenance_type) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ formatDate(schedule.scheduled_date) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ schedule.assigned_to?.name || 'Belgilanmagan' }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getPriorityClass(schedule.priority)"
                >
                  {{ formatPriority(schedule.priority) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(schedule.status)"
                >
                  {{ formatScheduleStatus(schedule.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  v-if="schedule.status === 'scheduled' && can('UPDATE_SCHEDULE')"
                  @click="startMaintenance(schedule)"
                  class="text-warning-600 hover:text-warning-900"
                >
                  Boshlash
                </button>
                <button
                  v-if="schedule.status === 'in_progress' && can('UPDATE_SCHEDULE')"
                  @click="completeMaintenance(schedule)"
                  class="text-success-600 hover:text-success-900"
                >
                  Tugallash
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
  import { useMaintenanceStore } from '@/stores/maintenance'
  import { usePermissions } from '@/composables/usePermissions'
  import { useNotifications } from '@/composables/useNotifications'
  import { formatDate } from '@/utils/formatters'
  
  const maintenanceStore = useMaintenanceStore()
  const { can } = usePermissions()
  const notifications = useNotifications()
  
  const selectedMonth = ref('2026-01')
  
  const months = ref([
    { value: '2026-01', label: '2026 Yanvar' },
    { value: '2026-02', label: '2026 Fevral' },
  ])
  
  const stats = ref({
    total: 15,
    scheduled: 8,
    in_progress: 4,
    completed: 3,
  })
  
  const schedules = ref([])
  const loading = ref(false)
  
  onMounted(() => {
    fetchSchedule()
  })
  
  async function fetchSchedule() {
    loading.value = true
    try {
      // await maintenanceStore.fetchSchedule({ month: selectedMonth.value })
      await new Promise(r => setTimeout(r, 500))
      schedules.value = []
    } finally {
      loading.value = false
    }
  }
  
  function openCreateModal() {
    console.log('Open create modal')
  }
  
  async function startMaintenance(schedule) {
    if (!confirm('TA ni boshlashni tasdiqlaysizmi?')) return
    try {
      // await maintenanceStore.updateScheduleStatus(schedule.id, 'in_progress')
      notifications.success('TA boshlandi')
      fetchSchedule()
    } catch (error) {
      notifications.apiError(error)
    }
  }
  
  async function completeMaintenance(schedule) {
    if (!confirm('TA ni tugallashni tasdiqlaysizmi?')) return
    try {
      // await maintenanceStore.updateScheduleStatus(schedule.id, 'completed')
      notifications.success('TA tugallandi')
      fetchSchedule()
    } catch (error) {
      notifications.apiError(error)
    }
  }
  
  function formatMaintenanceType(type) {
    const types = {
      preventive: 'Profilaktik',
      corrective: 'Tuzatish',
      inspection: 'Tekshirish',
    }
    return types[type] || type
  }
  
  function formatScheduleStatus(status) {
    const statuses = {
      scheduled: 'Rejalashtirilgan',
      in_progress: 'Jarayonda',
      completed: 'Tugallangan',
      overdue: 'Kechikkan',
    }
    return statuses[status] || status
  }
  
  function formatPriority(priority) {
    const priorities = {
      high: 'Yuqori',
      medium: 'O\'rta',
      low: 'Past',
    }
    return priorities[priority] || priority
  }
  
  function getStatusClass(status) {
    const classes = {
      scheduled: 'bg-primary-100 text-primary-800',
      in_progress: 'bg-warning-100 text-warning-800',
      completed: 'bg-success-100 text-success-800',
      overdue: 'bg-danger-100 text-danger-800',
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  
  function getPriorityClass(priority) {
    const classes = {
      high: 'bg-danger-100 text-danger-800',
      medium: 'bg-warning-100 text-warning-800',
      low: 'bg-gray-100 text-gray-800',
    }
    return classes[priority] || 'bg-gray-100 text-gray-800'
  }
  </script>