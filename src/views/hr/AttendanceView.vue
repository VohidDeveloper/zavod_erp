<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Davomat</h1>
        <p class="text-gray-600 mt-1">Xodimlar davomati va ish vaqti</p>
      </div>
      <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Davomat qo'shish
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-600">Bugun kelgan</p>
        <p class="text-2xl font-bold text-green-600 mt-2">
          {{ statistics?.present_today || 0 }}
        </p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-600">Kelmagan</p>
        <p class="text-2xl font-bold text-red-600 mt-2">
          {{ statistics?.absent_today || 0 }}
        </p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-600">Ta'tilda</p>
        <p class="text-2xl font-bold text-blue-600 mt-2">
          {{ statistics?.on_leave_today || 0 }}
        </p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm text-gray-600">Jami xodimlar</p>
        <p class="text-2xl font-bold text-gray-900 mt-2">
          {{ statistics?.total_employees || 0 }}
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sana</label>
          <input
            v-model="filters.attendance_date"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="handleFilterChange"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Xodim</label>
          <select
            v-model="filters.employee_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="handleFilterChange"
          >
            <option value="">Barcha xodimlar</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.first_name }} {{ emp.last_name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Holat</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="handleFilterChange"
          >
            <option value="">Barcha holatlar</option>
            <option value="present">Kelgan</option>
            <option value="absent">Kelmagan</option>
            <option value="late">Kech qolgan</option>
            <option value="half_day">Yarim kun</option>
            <option value="on_leave">Ta'tilda</option>
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

    <!-- Attendance Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xodim</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kirish</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chiqish</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amallar</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="filteredAttendances.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-gray-500">
              Ma'lumot topilmadi
            </td>
          </tr>
          <tr
            v-else
            v-for="attendance in filteredAttendances"
            :key="attendance.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <p class="font-medium text-gray-900">
                  {{ attendance.employee?.first_name }} {{ attendance.employee?.last_name }}
                </p>
                <p class="text-sm text-gray-600">{{ attendance.employee?.position }}</p>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(attendance.attendance_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ attendance.check_in_time ? formatTime(attendance.check_in_time) : '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ attendance.check_out_time ? formatTime(attendance.check_out_time) : '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getStatusClass(attendance.status)"
              >
                {{ getStatusText(attendance.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex space-x-2">
                <button
                  @click="editAttendance(attendance)"
                  class="text-blue-600 hover:text-blue-700"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(attendance)"
                  class="text-red-600 hover:text-red-700"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">
            {{ editingAttendance ? 'Davomatni tahrirlash' : 'Davomat qo\'shish' }}
          </h3>

          <form @submit.prevent="saveAttendance" class="space-y-4">
            <div v-if="!editingAttendance">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Xodim <span class="text-red-600">*</span>
              </label>
              <select
                v-model="attendanceForm.employee_id"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Tanlang</option>
                <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                  {{ emp.first_name }} {{ emp.last_name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Sana <span class="text-red-600">*</span>
              </label>
              <input
                v-model="attendanceForm.attendance_date"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Kirish vaqti
                </label>
                <input
                  v-model="attendanceForm.check_in_time"
                  type="time"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Chiqish vaqti
                </label>
                <input
                  v-model="attendanceForm.check_out_time"
                  type="time"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Holat <span class="text-red-600">*</span>
              </label>
              <select
                v-model="attendanceForm.status"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="present">Kelgan</option>
                <option value="absent">Kelmagan</option>
                <option value="late">Kech qolgan</option>
                <option value="half_day">Yarim kun</option>
                <option value="on_leave">Ta'tilda</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Izoh
              </label>
              <textarea
                v-model="attendanceForm.notes"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useHRStore } from '@/stores/hr'
import { formatDate } from '@/utils/formatters'

const hrStore = useHRStore()

const showAddModal = ref(false)
const editingAttendance = ref(null)
const saving = ref(false)

const filters = reactive({
  attendance_date: new Date().toISOString().split('T')[0],
  employee_id: '',
  status: ''
})

const attendanceForm = reactive({
  employee_id: '',
  attendance_date: new Date().toISOString().split('T')[0],
  check_in_time: '',
  check_out_time: '',
  status: 'present',
  notes: ''
})

const loading = computed(() => hrStore.loading)
const error = computed(() => hrStore.error?.detail || hrStore.error?.message || null)
const attendances = computed(() => hrStore.todayAttendance)
const employees = computed(() => hrStore.employees)
const statistics = computed(() => hrStore.statistics)

const filteredAttendances = computed(() => {
  let filtered = attendances.value

  if (filters.employee_id) {
    filtered = filtered.filter(a => a.employee_id === filters.employee_id)
  }

  if (filters.status) {
    filtered = filtered.filter(a => a.status === filters.status)
  }

  return filtered
})

async function fetchData() {
  try {
    await Promise.all([
      hrStore.fetchTodayAttendance(filters.attendance_date),
      hrStore.fetchEmployees(),
      hrStore.fetchStatistics()
    ])
  } catch (err) {
    console.error('Failed to fetch data:', err)
  }
}

function handleFilterChange() {
  fetchData()
}

function formatTime(datetime) {
  if (!datetime) return '-'
  const date = new Date(datetime)
  return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
}

function getStatusClass(status) {
  const classes = {
    present: 'bg-green-100 text-green-800',
    absent: 'bg-red-100 text-red-800',
    late: 'bg-orange-100 text-orange-800',
    half_day: 'bg-yellow-100 text-yellow-800',
    on_leave: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusText(status) {
  const texts = {
    present: 'Kelgan',
    absent: 'Kelmagan',
    late: 'Kech qolgan',
    half_day: 'Yarim kun',
    on_leave: 'Ta\'tilda'
  }
  return texts[status] || status
}

function editAttendance(attendance) {
  editingAttendance.value = attendance
  Object.assign(attendanceForm, {
    employee_id: attendance.employee_id,
    attendance_date: attendance.attendance_date,
    check_in_time: attendance.check_in_time ? new Date(attendance.check_in_time).toTimeString().slice(0, 5) : '',
    check_out_time: attendance.check_out_time ? new Date(attendance.check_out_time).toTimeString().slice(0, 5) : '',
    status: attendance.status,
    notes: attendance.notes || ''
  })
  showAddModal.value = true
}

function closeModal() {
  showAddModal.value = false
  editingAttendance.value = null
  Object.assign(attendanceForm, {
    employee_id: '',
    attendance_date: new Date().toISOString().split('T')[0],
    check_in_time: '',
    check_out_time: '',
    status: 'present',
    notes: ''
  })
}

async function saveAttendance() {
  saving.value = true
  try {
    const data = {
      ...attendanceForm,
      check_in_time: attendanceForm.check_in_time ? 
        `${attendanceForm.attendance_date}T${attendanceForm.check_in_time}:00` : null,
      check_out_time: attendanceForm.check_out_time ? 
        `${attendanceForm.attendance_date}T${attendanceForm.check_out_time}:00` : null
    }

    if (editingAttendance.value) {
      await hrStore.updateAttendance(editingAttendance.value.id, data)
    } else {
      await hrStore.createAttendance(data)
    }
    
    closeModal()
    await fetchData()
  } catch (err) {
    console.error('Failed to save attendance:', err)
  } finally {
    saving.value = false
  }
}

async function confirmDelete(attendance) {
  if (!confirm('Davomatni o\'chirishga ishonchingiz komilmi?')) return

  try {
    await hrStore.deleteAttendance(attendance.id)
    await fetchData()
  } catch (err) {
    console.error('Failed to delete attendance:', err)
  }
}

onMounted(() => {
  fetchData()
})
</script>