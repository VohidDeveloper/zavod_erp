<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Kadrlar Tahlili</h1>
        <p class="text-gray-600 mt-1">Xodimlar va ish haqi statistikasi</p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="fetchData"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button
          @click="exportReport"
          class="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Eksport
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="fetchData" class="mt-2 text-sm text-red-600 hover:text-red-700">
        Qayta urinish
      </button>
    </div>

    <!-- Content -->
    <template v-else-if="hrData">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm">Jami xodimlar</p>
              <p class="text-3xl font-bold mt-2">{{ formatNumber(hrData.total_employees) }}</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-blue-100 text-xs">
              Faol: {{ formatNumber(hrData.active_employees) }}
            </span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Ish haqi fondi</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ formatCurrency(hrData.total_salary_paid_this_month) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              O'rtacha: {{ formatCurrency(hrData.average_salary) }}
            </span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Davomat</p>
              <p class="text-2xl font-bold text-purple-600 mt-2">{{ formatNumber(hrData.attendance_rate) }}%</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-purple-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${hrData.attendance_rate}%` }"
            ></div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Ta'tilda</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ formatNumber(hrData.on_leave) }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              Xodimlar
            </span>
          </div>
        </div>
      </div>

      <!-- Department Stats -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Bo'limlar statistikasi</h3>
        </div>
        <div v-if="hrData.departments.length > 0" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="(dept, index) in hrData.departments"
              :key="index"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ dept.name || dept.department }}</p>
                  <p class="text-sm text-gray-600">{{ dept.employees || dept.count }} xodim</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-gray-900">{{ dept.employees || dept.count }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="p-6 text-center text-gray-400">
          Ma'lumot yo'q
        </div>
      </div>

      <!-- Leave Requests by Type -->
      <div v-if="hrData.leave_requests_by_type.length > 0" class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Ta'til statistikasi</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="(leave, index) in hrData.leave_requests_by_type"
              :key="index"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                     :class="getLeaveColor(leave.type || leave.leave_type).bg">
                  <svg class="w-5 h-5" :class="getLeaveColor(leave.type || leave.leave_type).text" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ leave.type || leave.leave_type }}</p>
                  <p class="text-sm text-gray-600">Ta'til turlari</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-900">{{ leave.count }}</p>
                <p class="text-sm text-gray-600">{{ leave.days || 0 }} kun</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Salary Summary -->
        <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ish haqi xulosasi</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-white rounded-lg">
              <span class="text-sm text-gray-600">Jami to'langan (bu oy)</span>
              <span class="text-lg font-bold text-green-600">{{ formatCurrency(hrData.total_salary_paid_this_month) }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-white rounded-lg">
              <span class="text-sm text-gray-600">O'rtacha ish haqi</span>
              <span class="text-lg font-bold text-blue-600">{{ formatCurrency(hrData.average_salary) }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-white rounded-lg">
              <span class="text-sm text-gray-600">Davomat darajasi</span>
              <span class="text-lg font-bold text-purple-600">{{ formatNumber(hrData.attendance_rate) }}%</span>
            </div>
          </div>
        </div>

        <!-- Employee Status -->
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Xodimlar holati</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-white rounded-lg">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-sm text-gray-600">Faol xodimlar</span>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ formatNumber(hrData.active_employees) }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-white rounded-lg">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span class="text-sm text-gray-600">Ta'tilda</span>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ formatNumber(hrData.on_leave) }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-white rounded-lg">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span class="text-sm text-gray-600">Jami xodimlar</span>
              </div>
              <span class="text-lg font-bold text-gray-900">{{ formatNumber(hrData.total_employees) }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import { formatNumber, formatCurrency } from '@/utils/formatters'

const analyticsStore = useAnalyticsStore()

const loading = computed(() => analyticsStore.loading)
const error = computed(() => analyticsStore.error?.detail || analyticsStore.error?.message || null)
const hrData = computed(() => analyticsStore.hrAnalytics)

function getLeaveColor(leaveType) {
  const type = (leaveType || '').toLowerCase()
  
  if (type.includes('yillik') || type.includes('annual')) {
    return { bg: 'bg-blue-100', text: 'text-blue-600' }
  } else if (type.includes('kasallik') || type.includes('sick')) {
    return { bg: 'bg-red-100', text: 'text-red-600' }
  } else if (type.includes('oilaviy') || type.includes('family')) {
    return { bg: 'bg-purple-100', text: 'text-purple-600' }
  }
  
  return { bg: 'bg-gray-100', text: 'text-gray-600' }
}

async function fetchData() {
  try {
    await analyticsStore.fetchHRAnalytics()
  } catch (err) {
    console.error('HR analytics error:', err)
  }
}

function exportReport() {
  console.log('Export HR report')
}

onMounted(() => {
  fetchData()
})
</script>