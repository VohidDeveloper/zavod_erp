<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ishlab chiqarish tahlili</h1>
        <p class="text-gray-600 mt-1">Ishlab chiqarish ko'rsatkichlari va statistika</p>
      </div>
      <div class="flex gap-2">
        <select v-model="period" class="input" @change="handlePeriodChange">
          <option value="today">Bugun</option>
          <option value="week">Bu hafta</option>
          <option value="month">Bu oy</option>
          <option value="quarter">Bu chorak</option>
          <option value="year">Bu yil</option>
        </select>
        <button @click="exportReport" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Hisobot
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
    <template v-else-if="productionData">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-primary-100 text-sm">Jami ishlab chiqarish</p>
              <p class="text-3xl font-bold mt-2">{{ formatNumber(productionData.total_output) }}</p>
              <p class="text-primary-100 text-xs mt-2">dona</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span class="text-primary-100 text-xs">
              {{ formatDate(productionData.period_start) }} - {{ formatDate(productionData.period_end) }}
            </span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Samaradorlik</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ formatNumber(productionData.average_efficiency) }}%</p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div class="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-success-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${productionData.average_efficiency}%` }"
            ></div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Nuqsonli mahsulot</p>
              <p class="text-2xl font-bold text-danger-600 mt-2">{{ formatNumber(productionData.total_defects) }}</p>
            </div>
            <div class="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ formatNumber(productionData.defect_rate) }}% nuqson darajasi
            </span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Smenalar</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ formatNumber(productionData.total_shifts) }}</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">tanlanilgan davr uchun</span>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Production by Day -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Kunlik ishlab chiqarish</h3>
          <div v-if="productionData.production_by_day.length > 0" class="h-80">
            <div class="space-y-2">
              <div 
                v-for="(day, index) in productionData.production_by_day.slice(0, 10)" 
                :key="index"
                class="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span class="text-sm text-gray-600">{{ day.date }}</span>
                <span class="text-sm font-semibold text-gray-900">{{ formatNumber(day.output || 0) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="h-80 flex items-center justify-center text-gray-400">
            Ma'lumot yo'q
          </div>
        </div>

        <!-- Production by Line -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Liniya bo'yicha ishlab chiqarish</h3>
          <div v-if="productionData.production_by_line.length > 0" class="space-y-3">
            <div 
              v-for="(line, index) in productionData.production_by_line" 
              :key="index"
              class="space-y-2"
            >
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-gray-900">{{ line.name || `Liniya ${index + 1}` }}</span>
                <span class="text-gray-600">{{ formatNumber(line.output || 0) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  class="h-3 rounded-full bg-primary-500 transition-all duration-500"
                  :style="{ width: `${(line.output / productionData.total_output * 100).toFixed(0)}%` }"
                ></div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-400 py-8">
            Ma'lumot yo'q
          </div>
        </div>
      </div>

      <!-- Top Defect Reasons -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Asosiy nuqson sabablari</h3>
        </div>
        <div v-if="productionData.top_defect_reasons.length > 0" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              v-for="(reason, index) in productionData.top_defect_reasons" 
              :key="index"
              class="p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ reason.name || reason.reason }}</p>
                  <p class="text-2xl font-bold text-red-600 mt-2">{{ formatNumber(reason.count || 0) }}</p>
                </div>
                <span class="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                  {{ ((reason.count / productionData.total_defects) * 100).toFixed(1) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="p-6 text-center text-gray-400">
          Ma'lumot yo'q
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import { formatNumber, formatDate } from '@/utils/formatters'

const analyticsStore = useAnalyticsStore()

const period = ref('month')
const loading = computed(() => analyticsStore.loading)
const error = computed(() => analyticsStore.error?.detail || analyticsStore.error?.message || null)
const productionData = computed(() => analyticsStore.productionAnalytics)

function getDateRange(periodValue) {
  const endDate = new Date()
  let startDate = new Date()

  switch (periodValue) {
    case 'today':
      startDate = new Date()
      break
    case 'week':
      startDate.setDate(endDate.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(endDate.getMonth() - 1)
      break
    case 'quarter':
      startDate.setMonth(endDate.getMonth() - 3)
      break
    case 'year':
      startDate.setFullYear(endDate.getFullYear() - 1)
      break
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  }
}

async function fetchData() {
  try {
    const { startDate, endDate } = getDateRange(period.value)
    await analyticsStore.fetchProductionAnalytics(startDate, endDate)
  } catch (err) {
    console.error('Production analytics error:', err)
  }
}

function handlePeriodChange() {
  fetchData()
}

function exportReport() {
  console.log('Export production report')
}

onMounted(() => {
  fetchData()
})
</script>