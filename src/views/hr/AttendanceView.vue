<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Davomat</h1>
          <p class="text-gray-600 mt-1">Xodimlar davomat nazorati</p>
        </div>
        <div class="flex gap-2">
          <input v-model="selectedDate" type="date" class="input" @change="fetchAttendance" />
          <button @click="exportReport" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Hisobot
          </button>
        </div>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jami xodimlar</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Kelganlar</p>
              <p class="text-2xl font-bold text-success-600 mt-2">{{ stats.present }}</p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ ((stats.present / stats.total) * 100).toFixed(1) }}%
            </span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Yo'qlamalar</p>
              <p class="text-2xl font-bold text-danger-600 mt-2">{{ stats.absent }}</p>
            </div>
            <div class="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ ((stats.absent / stats.total) * 100).toFixed(1) }}%
            </span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Kechikganlar</p>
              <p class="text-2xl font-bold text-warning-600 mt-2">{{ stats.late }}</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ ((stats.late / stats.total) * 100).toFixed(1) }}%
            </span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Ta'tilda</p>
              <p class="text-2xl font-bold text-primary-600 mt-2">{{ stats.on_leave }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Xodim qidirish..."
            class="input"
            @input="debouncedFetch"
          />
          <select v-model="filters.department" class="input" @change="fetchAttendance">
            <option value="">Barcha bo'limlar</option>
            <option value="production">Ishlab chiqarish</option>
            <option value="sales">Savdo</option>
            <option value="warehouse">Ombor</option>
            <option value="finance">Moliya</option>
            <option value="hr">HR</option>
          </select>
          <select v-model="filters.status" class="input" @change="fetchAttendance">
            <option value="">Barcha holatlar</option>
            <option value="present">Kelgan</option>
            <option value="absent">Yo'q</option>
            <option value="late">Kechikkan</option>
            <option value="on_leave">Ta'tilda</option>
          </select>
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Tozalash
          </button>
        </div>
      </div>
  
      <!-- Attendance Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xodim</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bo'lim</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelgan vaqt</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ketgan vaqt</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ish soati</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Izoh</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-8 text-center">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="text-gray-600">Yuklanmoqda...</span>
                </div>
              </td>
            </tr>
  
            <tr v-else-if="!attendance.length">
              <td colspan="7" class="px-6 py-12 text-center">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p class="text-gray-500">Davomat ma'lumotlari topilmadi</p>
              </td>
            </tr>
  
            <tr
              v-else
              v-for="record in attendance"
              :key="record.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-primary-600 font-semibold text-sm">
                      {{ getInitials(record.employee) }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ record.employee.first_name }} {{ record.employee.last_name }}
                    </p>
                    <p class="text-xs text-gray-500">{{ record.employee.position }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ formatDepartment(record.employee.department) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ record.check_in ? formatTime(record.check_in) : '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ record.check_out ? formatTime(record.check_out) : '-' }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                {{ record.work_hours || '-' }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getAttendanceStatusClass(record.status)"
                >
                  {{ formatAttendanceStatus(record.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ record.note || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useHRStore } from '@/stores/hr'
  import { useNotifications } from '@/composables/useNotifications'
  import { formatTime } from '@/utils/formatters'
  import { createDebounce } from '@/utils/helpers'
  
  const hrStore = useHRStore()
  const notifications = useNotifications()
  
  const selectedDate = ref(new Date().toISOString().split('T')[0])
  
  const filters = reactive({
    search: '',
    department: '',
    status: '',
  })
  
  const stats = ref({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    on_leave: 0,
  })
  
  const attendance = ref([])
  const loading = ref(false)
  
  const hasActiveFilters = computed(() => {
    return filters.search || filters.department || filters.status
  })
  
  const debouncedFetch = createDebounce(fetchAttendance, 500)
  
  onMounted(() => {
    fetchAttendance()
  })
  
  async function fetchAttendance() {
    loading.value = true
    try {
      const data = await hrStore.fetchAttendance({
        date: selectedDate.value,
        ...filters,
      })
      attendance.value = data.records || []
      stats.value = data.stats || {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        on_leave: 0,
      }
    } catch (error) {
      notifications.apiError(error)
    } finally {
      loading.value = false
    }
  }
  
  function clearFilters() {
    Object.keys(filters).forEach(key => {
      filters[key] = ''
    })
    fetchAttendance()
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
  
  function formatAttendanceStatus(status) {
    const statuses = {
      present: 'Kelgan',
      absent: 'Yo\'q',
      late: 'Kechikkan',
      on_leave: 'Ta\'tilda',
    }
    return statuses[status] || status
  }
  
  function getAttendanceStatusClass(status) {
    const classes = {
      present: 'bg-success-100 text-success-800',
      absent: 'bg-danger-100 text-danger-800',
      late: 'bg-warning-100 text-warning-800',
      on_leave: 'bg-primary-100 text-primary-800',
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  
  function exportReport() {
    console.log('Export attendance report')
  }
  </script>