<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Xodimlar</h1>
        <p class="text-gray-600 mt-1">Xodimlar ro'yxati va boshqaruvi</p>
      </div>
      <button
        @click="$router.push({ name: 'hr-employees-create' })"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Yangi xodim
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Jami xodimlar</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">
              {{ statistics?.total_employees || 0 }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Faol</p>
            <p class="text-2xl font-bold text-green-600 mt-2">
              {{ statistics?.active_employees || 0 }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Ta'tilda</p>
            <p class="text-2xl font-bold text-orange-600 mt-2">
              {{ statistics?.on_leave_today || 0 }}
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Bo'limlar</p>
            <p class="text-2xl font-bold text-purple-600 mt-2">
              {{ statistics?.total_departments || 0 }}
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Qidirish..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            v-model="filters.department_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="handleFilterChange"
          >
            <option value="">Barcha bo'limlar</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <div>
          <select
            v-model="filters.employment_status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="handleFilterChange"
          >
            <option value="">Barcha holatlar</option>
            <option value="active">Faol</option>
            <option value="on_leave">Ta'tilda</option>
            <option value="terminated">Ishdan bo'shatilgan</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="fetchData" class="mt-2 text-sm text-red-600 hover:text-red-700">
        Qayta urinish
      </button>
    </div>

    <!-- Employees Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="employee in filteredEmployees"
        :key="employee.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
        @click="viewEmployee(employee)"
      >
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center space-x-4 mb-4">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-blue-600">
                {{ employee.first_name.charAt(0) }}{{ employee.last_name.charAt(0) }}
              </span>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">
                {{ employee.first_name }} {{ employee.last_name }}
              </h3>
              <p class="text-sm text-gray-600">{{ employee.position }}</p>
            </div>
            <span 
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(employee.employment_status)"
            >
              {{ getStatusText(employee.employment_status) }}
            </span>
          </div>

          <!-- Details -->
          <div class="space-y-2 text-sm">
            <div class="flex items-center text-gray-600">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {{ employee.department?.name || 'N/A' }}
            </div>
            <div class="flex items-center text-gray-600">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {{ employee.phone }}
            </div>
            <div v-if="employee.email" class="flex items-center text-gray-600">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ employee.email }}
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-4 pt-4 border-t flex items-center justify-between">
            <div class="text-sm">
              <p class="text-gray-600">Ish haqi</p>
              <p class="font-bold text-gray-900">{{ formatCurrency(employee.salary) }}</p>
            </div>
            <button
              @click.stop="editEmployee(employee)"
              class="text-blue-600 hover:text-blue-700"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredEmployees.length === 0 && !loading" class="text-center py-12">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Xodim topilmadi</h3>
      <p class="text-gray-600 mb-4">Yangi xodim qo'shing</p>
      <button
        @click="$router.push({ name: 'hr-employees-create' })"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Yangi xodim
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHRStore } from '@/stores/hr'
import { formatCurrency } from '@/utils/formatters'

const router = useRouter()
const hrStore = useHRStore()

const filters = reactive({
  search: '',
  department_id: '',
  employment_status: ''
})

const loading = computed(() => hrStore.loading)
const error = computed(() => hrStore.error?.detail || hrStore.error?.message || null)
const employees = computed(() => hrStore.employees)
const departments = computed(() => hrStore.departments)
const statistics = computed(() => hrStore.statistics)

const filteredEmployees = computed(() => {
  let filtered = employees.value

  if (filters.search) {
    const query = filters.search.toLowerCase()
    filtered = filtered.filter(e =>
      e.first_name.toLowerCase().includes(query) ||
      e.last_name.toLowerCase().includes(query) ||
      e.position.toLowerCase().includes(query) ||
      e.phone.includes(query)
    )
  }

  return filtered
})

async function fetchData() {
  try {
    await Promise.all([
      hrStore.fetchEmployees(filters),
      hrStore.fetchDepartments(),
      hrStore.fetchStatistics()
    ])
  } catch (err) {
    console.error('Failed to fetch data:', err)
  }
}

function handleFilterChange() {
  fetchData()
}

function getStatusClass(status) {
  const classes = {
    active: 'bg-green-100 text-green-800',
    on_leave: 'bg-orange-100 text-orange-800',
    terminated: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusText(status) {
  const texts = {
    active: 'Faol',
    on_leave: 'Ta\'tilda',
    terminated: 'Ishdan bo\'shatilgan'
  }
  return texts[status] || status
}

function viewEmployee(employee) {
  router.push(`/hr/employees/${employee.id}`)
}

function editEmployee(employee) {
  router.push(`/hr/employees/${employee.id}/edit`)
}

onMounted(() => {
  fetchData()
})
</script>