<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Xodim ma'lumotlari</h1>
          <p class="text-gray-600 mt-1">To'liq ma'lumot va tarix</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="editEmployee"
          class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Tahrirlash
        </button>
        <button
          @click="confirmDelete"
          class="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
        >
          O'chirish
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="fetchEmployee" class="mt-2 text-sm text-red-600 hover:text-red-700">
        Qayta urinish
      </button>
    </div>

    <!-- Content -->
    <template v-else-if="employee">
      <!-- Profile Card -->
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
        <div class="flex items-center space-x-6">
          <div class="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span class="text-4xl font-bold">
              {{ employee.first_name.charAt(0) }}{{ employee.last_name.charAt(0) }}
            </span>
          </div>
          <div class="flex-1">
            <h2 class="text-3xl font-bold">{{ employee.first_name }} {{ employee.last_name }}</h2>
            <p class="text-blue-100 mt-1">{{ employee.position }}</p>
            <div class="flex items-center space-x-4 mt-3">
              <span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                {{ employee.department?.name || 'N/A' }}
              </span>
              <span 
                class="px-3 py-1 rounded-full text-sm"
                :class="getStatusBadgeClass(employee.employment_status)"
              >
                {{ getStatusText(employee.employment_status) }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-blue-100 text-sm">Ish haqi</p>
            <p class="text-3xl font-bold">{{ formatCurrency(employee.salary) }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Information -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Shaxsiy ma'lumotlar</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Telefon</p>
                <p class="font-medium text-gray-900">{{ employee.phone }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Email</p>
                <p class="font-medium text-gray-900">{{ employee.email || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Pasport seriyasi</p>
                <p class="font-medium text-gray-900">{{ employee.passport_serial || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">INN</p>
                <p class="font-medium text-gray-900">{{ employee.inn || 'N/A' }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-sm text-gray-600">Manzil</p>
                <p class="font-medium text-gray-900">{{ employee.address || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Employment Information -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Ish ma'lumotlari</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Lavozim</p>
                <p class="font-medium text-gray-900">{{ employee.position }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Bo'lim</p>
                <p class="font-medium text-gray-900">{{ employee.department?.name || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Ishga qabul qilingan</p>
                <p class="font-medium text-gray-900">{{ formatDate(employee.hire_date) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Ish haqi</p>
                <p class="font-medium text-gray-900">{{ formatCurrency(employee.salary) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Holati</p>
                <span 
                  class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(employee.employment_status)"
                >
                  {{ getStatusText(employee.employment_status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Attendance History -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Davomat tarixi</h3>
              <button
                @click="viewFullAttendance"
                class="text-sm text-blue-600 hover:text-blue-700"
              >
                Barchasi
              </button>
            </div>
            <div class="space-y-2">
              <div
                v-for="attendance in recentAttendance"
                :key="attendance.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ formatDate(attendance.attendance_date) }}</p>
                  <p class="text-sm text-gray-600">
                    {{ attendance.check_in_time ? formatTime(attendance.check_in_time) : '-' }} - 
                    {{ attendance.check_out_time ? formatTime(attendance.check_out_time) : '-' }}
                  </p>
                </div>
                <span 
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getAttendanceStatusClass(attendance.status)"
                >
                  {{ getAttendanceStatusText(attendance.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Salary Payment History -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold">Ish haqi to'lovlari tarixi</h3>
              <button
                @click="$router.push({ name: 'hr-salaries', query: { employee: employee.id } })"
                class="text-sm text-blue-600 hover:text-blue-700"
              >
                Barchasi
              </button>
            </div>
            <div class="space-y-2">
              <div
                v-for="payment in recentPayments"
                :key="payment.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ formatDate(payment.payment_date) }}</p>
                  <p class="text-sm text-gray-600">
                    {{ formatDate(payment.period_start) }} - {{ formatDate(payment.period_end) }}
                  </p>
                </div>
                <p class="font-bold text-green-600">{{ formatCurrency(payment.total_amount) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Stats -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Statistika</h3>
            <div class="space-y-4">
              <div class="p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-600">Ish kunlari</p>
                <p class="text-2xl font-bold text-blue-700">
                  {{ calculateWorkDays(employee.hire_date) }}
                </p>
              </div>
              <div class="p-4 bg-green-50 rounded-lg">
                <p class="text-sm text-green-600">Bu oy davomat</p>
                <p class="text-2xl font-bold text-green-700">95%</p>
              </div>
              <div class="p-4 bg-purple-50 rounded-lg">
                <p class="text-sm text-purple-600">Ta'til qoldig'i</p>
                <p class="text-2xl font-bold text-purple-700">12 kun</p>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Tezkor harakatlar</h3>
            <div class="space-y-2">
              <button
                @click="$router.push({ name: 'hr-attendance', query: { employee: employee.id } })"
                class="w-full px-4 py-2 text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Davomat yozish
              </button>
              <button
                @click="$router.push({ name: 'hr-salary-calculate', query: { employee: employee.id } })"
                class="w-full px-4 py-2 text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Ish haqi hisoblash
              </button>
              <button
                @click="$router.push({ name: 'hr-leave', query: { employee: employee.id } })"
                class="w-full px-4 py-2 text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Ta'til so'rovi
              </button>
            </div>
          </div>

          <!-- Information -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Ma'lumot</h3>
            <dl class="space-y-3 text-sm">
              <div>
                <dt class="text-gray-600">Yaratilgan:</dt>
                <dd class="font-medium text-gray-900">{{ formatDate(employee.created_at) }}</dd>
              </div>
              <div v-if="employee.updated_at">
                <dt class="text-gray-600">Yangilangan:</dt>
                <dd class="font-medium text-gray-900">{{ formatDate(employee.updated_at) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHRStore } from '@/stores/hr'
import { formatCurrency, formatDate } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const hrStore = useHRStore()

const recentAttendance = ref([])
const recentPayments = ref([])

const loading = computed(() => hrStore.loading)
const error = computed(() => hrStore.error?.detail || hrStore.error?.message || null)
const employee = computed(() => hrStore.currentEmployee)

async function fetchEmployee() {
  try {
    await hrStore.fetchEmployee(route.params.id)
    await loadRecentData()
  } catch (err) {
    console.error('Failed to fetch employee:', err)
  }
}

async function loadRecentData() {
  try {
    const [attendance, payments] = await Promise.all([
      hrStore.fetchEmployeeAttendance(route.params.id, { limit: 5 }),
      hrStore.fetchEmployeeSalaryPayments(route.params.id, { limit: 5 })
    ])
    recentAttendance.value = attendance.slice(0, 5)
    recentPayments.value = payments.slice(0, 5)
  } catch (err) {
    console.error('Failed to load recent data:', err)
  }
}

function getStatusClass(status) {
  const classes = {
    active: 'bg-green-100 text-green-800',
    on_leave: 'bg-orange-100 text-orange-800',
    terminated: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusBadgeClass(status) {
  const classes = {
    active: 'bg-green-500 text-white',
    on_leave: 'bg-orange-500 text-white',
    terminated: 'bg-red-500 text-white'
  }
  return classes[status] || 'bg-gray-500 text-white'
}

function getStatusText(status) {
  const texts = {
    active: 'Faol',
    on_leave: 'Ta\'tilda',
    terminated: 'Ishdan bo\'shatilgan'
  }
  return texts[status] || status
}

function getAttendanceStatusClass(status) {
  const classes = {
    present: 'bg-green-100 text-green-800',
    absent: 'bg-red-100 text-red-800',
    late: 'bg-orange-100 text-orange-800',
    half_day: 'bg-yellow-100 text-yellow-800',
    on_leave: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getAttendanceStatusText(status) {
  const texts = {
    present: 'Keldi',
    absent: 'Kelmadi',
    late: 'Kech qoldi',
    half_day: 'Yarim kun',
    on_leave: 'Ta\'tilda'
  }
  return texts[status] || status
}

function formatTime(datetime) {
  return new Date(datetime).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
}

function calculateWorkDays(hireDate) {
  const days = Math.floor((new Date() - new Date(hireDate)) / (1000 * 60 * 60 * 24))
  return days
}

function editEmployee() {
  router.push(`/hr/employees/${route.params.id}/edit`)
}

function viewFullAttendance() {
  router.push({ name: 'hr-attendance', query: { employee: route.params.id } })
}

async function confirmDelete() {
  if (!confirm('Xodimni o\'chirishga ishonchingiz komilmi?')) return

  try {
    await hrStore.deleteEmployee(route.params.id)
    router.push({ name: 'hr-employees' })
  } catch (err) {
    console.error('Failed to delete employee:', err)
  }
}

onMounted(() => {
  fetchEmployee()
})
</script>