<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">TA so'rovlari</h1>
          <p class="text-gray-600 mt-1">Texnik xizmat so'rovlari</p>
        </div>
        <button
          v-if="can('CREATE_REQUEST')"
          @click="openCreateModal"
          class="btn-primary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Yangi so'rov
        </button>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jami so'rovlar</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Yangi</p>
              <p class="text-2xl font-bold text-primary-600 mt-2">{{ stats.pending }}</p>
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
              <p class="text-sm text-gray-600">Qabul qilingan</p>
              <p class="text-2xl font-bold text-warning-600 mt-2">{{ stats.approved }}</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Bajarilgan</p>
              <p class="text-2xl font-bold text-success-600 mt-2">{{ stats.completed }}</p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Requests Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uskuna</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Muammo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">So'ragan</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioritet</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">Yuklanmoqda...</td>
            </tr>
            <tr v-else-if="!requests.length">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">So'rovlar topilmadi</td>
            </tr>
            <tr v-else v-for="request in requests" :key="request.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ request.machine?.name }}</p>
                  <p class="text-xs text-gray-500">{{ request.machine?.code }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">
                {{ request.description }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ request.requested_by?.name }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getPriorityClass(request.priority)"
                >
                  {{ formatPriority(request.priority) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ formatDate(request.created_at) }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(request.status)"
                >
                  {{ formatRequestStatus(request.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  v-if="request.status === 'pending' && can('APPROVE_REQUEST')"
                  @click="approveRequest(request)"
                  class="text-success-600 hover:text-success-900"
                >
                  Qabul
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
  
  const stats = ref({
    total: 24,
    pending: 12,
    approved: 8,
    completed: 4,
  })
  
  const requests = ref([])
  const loading = ref(false)
  
  onMounted(() => {
    fetchRequests()
  })
  
  async function fetchRequests() {
    loading.value = true
    try {
      // await maintenanceStore.fetchRequests()
      await new Promise(r => setTimeout(r, 500))
      requests.value = []
    } finally {
      loading.value = false
    }
  }
  
  function openCreateModal() {
    console.log('Open create modal')
  }
  
  async function approveRequest(request) {
    if (!confirm('So\'rovni qabul qilasizmi?')) return
    try {
      // await maintenanceStore.updateRequestStatus(request.id, 'approved')
      notifications.success('So\'rov qabul qilindi')
      fetchRequests()
    } catch (error) {
      notifications.apiError(error)
    }
  }
  
  function formatPriority(priority) {
    const priorities = {
      urgent: 'Favqulodda',
      high: 'Yuqori',
      medium: 'O\'rta',
      low: 'Past',
    }
    return priorities[priority] || priority
  }
  
  function formatRequestStatus(status) {
    const statuses = {
      pending: 'Yangi',
      approved: 'Qabul qilingan',
      rejected: 'Rad etilgan',
      completed: 'Bajarilgan',
    }
    return statuses[status] || status
  }
  
  function getStatusClass(status) {
    const classes = {
      pending: 'bg-primary-100 text-primary-800',
      approved: 'bg-warning-100 text-warning-800',
      rejected: 'bg-danger-100 text-danger-800',
      completed: 'bg-success-100 text-success-800',
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  
  function getPriorityClass(priority) {
    const classes = {
      urgent: 'bg-danger-600 text-white',
      high: 'bg-danger-100 text-danger-800',
      medium: 'bg-warning-100 text-warning-800',
      low: 'bg-gray-100 text-gray-800',
    }
    return classes[priority] || 'bg-gray-100 text-gray-800'
  }
  </script>