<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ish haqi</h1>
          <p class="text-gray-600 mt-1">Oylik ish haqi to'lovlari</p>
        </div>
        <div class="flex gap-2">
          <select v-model="selectedMonth" class="input" @change="fetchSalaries">
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
          <button
            v-if="can('CREATE_SALARY')"
            @click="openPayrollModal"
            class="btn-primary flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Maosh to'lash
          </button>
        </div>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-success-500 to-success-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-success-100 text-sm">Jami to'langan</p>
              <p class="text-3xl font-bold mt-2">{{ formatCurrency(stats.total_paid) }}</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-success-100 text-xs">
              {{ stats.paid_count }} xodimga to'langan
            </span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Kutilmoqda</p>
              <p class="text-2xl font-bold text-warning-600 mt-2">
                {{ formatCurrency(stats.pending) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ stats.pending_count }} xodim
            </span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">O'rtacha maosh</p>
              <p class="text-2xl font-bold text-primary-600 mt-2">
                {{ formatCurrency(stats.avg_salary) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jami xodimlar</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">
                {{ stats.total_employees }}
              </p>
            </div>
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Salaries Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xodim</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bo'lim</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Asosiy</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bonus</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Chegirma</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jami</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="8" class="px-6 py-8 text-center text-gray-500">Yuklanmoqda...</td>
            </tr>
            <tr v-else-if="!salaries.length">
              <td colspan="8" class="px-6 py-8 text-center text-gray-500">Ma'lumotlar yo'q</td>
            </tr>
            <tr v-else v-for="salary in salaries" :key="salary.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-primary-600 font-semibold text-sm">
                      {{ getInitials(salary.employee) }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ salary.employee.first_name }} {{ salary.employee.last_name }}
                    </p>
                    <p class="text-xs text-gray-500">{{ salary.employee.position }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ formatDepartment(salary.employee.department) }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium text-gray-900">
                {{ formatCurrency(salary.base_salary) }}
              </td>
              <td class="px-6 py-4 text-right text-sm text-success-600">
                {{ formatCurrency(salary.bonuses || 0) }}
              </td>
              <td class="px-6 py-4 text-right text-sm text-danger-600">
                {{ formatCurrency(salary.deductions || 0) }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-bold text-gray-900">
                {{ formatCurrency(salary.total) }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getPaymentStatusClass(salary.payment_status)"
                >
                  {{ formatPaymentStatus(salary.payment_status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  v-if="salary.payment_status === 'pending' && can('UPDATE_SALARY')"
                  @click="paySalary(salary)"
                  class="text-success-600 hover:text-success-900"
                >
                  To'lash
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
  import { useHRStore } from '@/stores/hr'
  import { usePermissions } from '@/composables/usePermissions'
  import { useNotifications } from '@/composables/useNotifications'
  import { formatCurrency } from '@/utils/formatters'
  
  const hrStore = useHRStore()
  const { can } = usePermissions()
  const notifications = useNotifications()
  
  const selectedMonth = ref('2026-01')
  
  const months = ref([
    { value: '2026-01', label: '2026 Yanvar' },
    { value: '2025-12', label: '2025 Dekabr' },
  ])
  
  const stats = ref({
    total_paid: 85000000,
    paid_count: 45,
    pending: 25000000,
    pending_count: 12,
    avg_salary: 1850000,
    total_employees: 57,
  })
  
  const salaries = ref([])
  const loading = ref(false)
  
  onMounted(() => {
    fetchSalaries()
  })
  
  async function fetchSalaries() {
    loading.value = true
    try {
      // const data = await hrStore.fetchSalaries({ month: selectedMonth.value })
      await new Promise(r => setTimeout(r, 500))
      salaries.value = []
    } finally {
      loading.value = false
    }
  }
  
  function openPayrollModal() {
    console.log('Open payroll modal')
  }
  
  async function paySalary(salary) {
    if (!confirm('Maosh to\'lashni tasdiqlaysizmi?')) return
    try {
      // await hrStore.paySalary(salary.id)
      notifications.success('Maosh to\'landi')
      fetchSalaries()
    } catch (error) {
      notifications.apiError(error)
    }
  }
  
  function getInitials(employee) {
    const first = employee.first_name?.charAt(0) || ''
    const last = employee.last_name?.charAt(0) || ''
    return (first + last).toUpperCase() || 'X'
  }
  
  function formatDepartment(dept) {
    const departments = {
      production: 'Ishlab chiqarish',
      sales: 'Savdo',
      warehouse: 'Ombor',
      finance: 'Moliya',
      hr: 'HR',
    }
    return departments[dept] || dept
  }
  
  function formatPaymentStatus(status) {
    return status === 'paid' ? 'To\'langan' : 'Kutilmoqda'
  }
  
  function getPaymentStatusClass(status) {
    return status === 'paid' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
  }
  </script>