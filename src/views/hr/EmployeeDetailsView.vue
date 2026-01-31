<template>
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <svg class="animate-spin h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  
    <div v-else-if="!employee" class="text-center py-12">
      <p class="text-gray-500">Xodim topilmadi</p>
      <button @click="$router.back()" class="mt-4 btn-primary">Orqaga</button>
    </div>
  
    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button
            @click="$router.back()"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span class="text-primary-600 font-bold text-2xl">
              {{ getInitials(employee) }}
            </span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ employee.first_name }} {{ employee.last_name }}
            </h1>
            <p class="text-gray-600 mt-1">{{ employee.position }} - {{ formatDepartment(employee.department) }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            v-if="can('UPDATE_EMPLOYEE')"
            @click="editEmployee"
            class="btn-primary flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Tahrirlash
          </button>
        </div>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Information -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Shaxsiy ma'lumotlar</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <p class="text-sm text-gray-500">Ism</p>
                  <p class="mt-1 text-base font-medium text-gray-900">{{ employee.first_name }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Familiya</p>
                  <p class="mt-1 text-base font-medium text-gray-900">{{ employee.last_name }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tug'ilgan sana</p>
                  <p class="mt-1 text-base font-medium text-gray-900">
                    {{ formatDate(employee.birth_date) }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jinsi</p>
                  <p class="mt-1 text-base font-medium text-gray-900">
                    {{ employee.gender === 'male' ? 'Erkak' : 'Ayol' }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Passport</p>
                  <p class="mt-1 text-base font-medium text-gray-900">{{ employee.passport_number }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Manzil</p>
                  <p class="mt-1 text-base font-medium text-gray-900">{{ employee.address }}</p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Employment Information -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Ish ma'lumotlari</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <p class="text-sm text-gray-500">Xodim ID</p>
                  <p class="mt-1 text-base font-medium text-gray-900">{{ employee.employee_id }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Bo'lim</p>
                  <p class="mt-1 text-base font-medium text-gray-900">
                    {{ formatDepartment(employee.department) }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Lavozim</p>
                  <p class="mt-1 text-base font-medium text-gray-900">{{ employee.position }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Ish boshlagan sana</p>
                  <p class="mt-1 text-base font-medium text-gray-900">
                    {{ formatDate(employee.hire_date) }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Ish staji</p>
                  <p class="mt-1 text-base font-medium text-gray-900">
                    {{ calculateWorkExperience(employee.hire_date) }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Holat</p>
                  <span
                    class="mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(employee.status)"
                  >
                    {{ formatStatus(employee.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Salary History -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Maosh tarixi</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Summa</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Izoh</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="history in salaryHistory" :key="history.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(history.date) }}</td>
                    <td class="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {{ formatCurrency(history.amount) }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ history.note }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
        <!-- Right Column - Sidebar -->
        <div class="space-y-6">
          <!-- Contact Card -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Aloqa</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span class="text-sm text-gray-900">{{ formatPhone(employee.phone) }}</span>
              </div>
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-sm text-gray-900">{{ employee.email }}</span>
              </div>
            </div>
          </div>
  
          <!-- Salary Card -->
          <div class="bg-gradient-to-br from-success-500 to-success-600 rounded-lg shadow-lg p-6 text-white">
            <p class="text-success-100 text-sm">Joriy maosh</p>
            <p class="text-3xl font-bold mt-2">{{ formatCurrency(employee.salary) }}</p>
            <p class="text-success-100 text-sm mt-4">Oylik to'lov</p>
          </div>
  
          <!-- Quick Stats -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Statistika</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Bu oy ish kunlari</span>
                <span class="text-base font-semibold text-gray-900">22</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Qatnashgan</span>
                <span class="text-base font-semibold text-success-600">20</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Kechikish</span>
                <span class="text-base font-semibold text-warning-600">2</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Yo'qlamalar</span>
                <span class="text-base font-semibold text-danger-600">0</span>
              </div>
            </div>
          </div>
  
          <!-- Emergency Contact -->
          <div v-if="employee.emergency_contact" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Favqulodda aloqa</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm text-gray-500">Ism</p>
                <p class="mt-1 text-base font-medium text-gray-900">
                  {{ employee.emergency_contact.name }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Telefon</p>
                <p class="mt-1 text-base font-medium text-gray-900">
                  {{ formatPhone(employee.emergency_contact.phone) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Qarindoshlik</p>
                <p class="mt-1 text-base font-medium text-gray-900">
                  {{ employee.emergency_contact.relationship }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useHRStore } from '@/stores/hr'
  import { usePermissions } from '@/composables/usePermissions'
  import { useNotifications } from '@/composables/useNotifications'
  import {
    formatCurrency,
    formatDate,
    formatPhone,
    formatStatus,
  } from '@/utils/formatters'
  
  const route = useRoute()
  const router = useRouter()
  const hrStore = useHRStore()
  const { can } = usePermissions()
  const notifications = useNotifications()
  
  const employee = ref(null)
  const salaryHistory = ref([])
  const loading = ref(true)
  
  onMounted(async () => {
    await fetchEmployee()
  })
  
  async function fetchEmployee() {
    loading.value = true
    try {
      const id = route.params.id
      employee.value = await hrStore.getEmployee(id)
      salaryHistory.value = employee.value.salary_history || []
    } catch (error) {
      notifications.apiError(error)
    } finally {
      loading.value = false
    }
  }
  
  function getInitials(emp) {
    const first = emp.first_name?.charAt(0) || ''
    const last = emp.last_name?.charAt(0) || ''
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
  
  function getStatusClass(status) {
    const classes = {
      active: 'bg-success-100 text-success-800',
      inactive: 'bg-gray-100 text-gray-800',
      on_leave: 'bg-warning-100 text-warning-800',
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  
  function calculateWorkExperience(hireDate) {
    const now = new Date()
    const hire = new Date(hireDate)
    const diffTime = Math.abs(now - hire)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    
    if (years > 0) {
      return `${years} yil ${months} oy`
    }
    return `${months} oy`
  }
  
  function editEmployee() {
    router.push(`/hr/employees/${employee.value.id}/edit`)
  }
  </script>