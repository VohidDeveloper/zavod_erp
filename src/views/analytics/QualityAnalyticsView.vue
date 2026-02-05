<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Sifat Nazorati Tahlili</h1>
        <p class="text-gray-600 mt-1">Mahsulot sifati va defektlar statistikasi</p>
      </div>
      <div class="flex items-center space-x-3">
        <select
          v-model="period"
          @change="handlePeriodChange"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="today">Bugun</option>
          <option value="week">Bu hafta</option>
          <option value="month">Bu oy</option>
          <option value="quarter">Chorak</option>
          <option value="year">Bu yil</option>
        </select>
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
    <template v-else-if="productionData">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm">Sifat ko'rsatkichi</p>
              <p class="text-3xl font-bold mt-2">{{ formatNumber(100 - parseFloat(productionData.defect_rate)) }}%</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-green-100 text-xs">Maqsad: 98%</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Defekt darajasi</p>
              <p class="text-2xl font-bold text-danger-600 mt-2">{{ formatNumber(productionData.defect_rate) }}%</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">{{ formatNumber(productionData.total_defects) }} ta nuqson</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jami ishlab chiqarish</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ formatNumber(productionData.total_output) }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">{{ productionData.total_shifts }} ta smena</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Yaxshi mahsulotlar</p>
              <p class="text-2xl font-bold text-success-600 mt-2">{{ formatNumber(productionData.total_output - productionData.total_defects) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-green-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${100 - parseFloat(productionData.defect_rate)}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Top Defect Reasons -->
      <div v-if="productionData.top_defect_reasons.length > 0" class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Eng ko'p uchraydigan defektlar</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="(defect, index) in productionData.top_defect_reasons"
              :key="index"
              class="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
            >
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 font-semibold">
                  {{ index + 1 }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ defect.name || defect.reason }}</p>
                  <p class="text-sm text-gray-600">Nuqson turi</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xl font-bold text-red-600">{{ formatNumber(defect.count || 0) }}</p>
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  {{ ((defect.count / productionData.total_defects) * 100).toFixed(1) }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quality by Production Line -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Liniyalar bo'yicha sifat</h3>
        </div>
        <div v-if="productionData.production_by_line.length > 0" class="p-6">
          <div class="space-y-4">
            <div
              v-for="(line, index) in productionData.production_by_line"
              :key="index"
              class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div
                    :class="['w-10 h-10 rounded-lg flex items-center justify-center', getQualityBgColor(line.quality || 100)]"
                  >
                    <svg :class="['w-5 h-5', getQualityIconColor(line.quality || 100)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ line.name || `Liniya ${index + 1}` }}</p>
                    <p class="text-sm text-gray-600">Ishlab chiqarish: {{ formatNumber(line.output || 0) }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-gray-900">{{ formatNumber(line.quality || 100) }}%</p>
                  <span class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="getQualityBadgeClass(line.quality || 100)">
                    {{ getQualityStatus(line.quality || 100) }}
                  </span>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-3 text-sm text-gray-600">
                <div>
                  <span class="text-xs">Ishlab chiqarildi:</span>
                  <p class="font-semibold text-gray-900">{{ formatNumber(line.output || 0) }}</p>
                </div>
                <div>
                  <span class="text-xs">Defektlar:</span>
                  <p class="font-semibold text-red-600">{{ formatNumber(line.defects || 0) }}</p>
                </div>
                <div>
                  <span class="text-xs">Yaxshi:</span>
                  <p class="font-semibold text-green-600">{{ formatNumber((line.output || 0) - (line.defects || 0)) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="p-6 text-center text-gray-400">
          Ma'lumot yo'q
        </div>
      </div>

      <!-- Daily Quality Trend -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Kunlik sifat dinamikasi</h3>
        </div>
        <div v-if="productionData.production_by_day.length > 0" class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jami</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Defektlar</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Yaxshi</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sifat %</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(day, index) in productionData.production_by_day.slice(0, 10)" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ day.date }}</td>
                  <td class="px-6 py-4 text-right text-sm text-gray-900">{{ formatNumber(day.output || 0) }}</td>
                  <td class="px-6 py-4 text-right text-sm text-red-600 font-semibold">{{ formatNumber(day.defects || 0) }}</td>
                  <td class="px-6 py-4 text-right text-sm text-green-600 font-semibold">
                    {{ formatNumber((day.output || 0) - (day.defects || 0)) }}
                  </td>
                  <td class="px-6 py-4 text-right">
                    <span class="px-2 py-1 text-xs font-medium rounded-full"
                          :class="getQualityBadgeClass(calculateQuality(day.output, day.defects))">
                      {{ calculateQuality(day.output, day.defects) }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="p-6 text-center text-gray-400">
          Ma'lumot yo'q
        </div>
      </div>

      <!-- Summary -->
      <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Sifat xulosasi</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-600">Umumiy sifat</p>
            <p class="text-2xl font-bold text-green-600 mt-2">
              {{ formatNumber(100 - parseFloat(productionData.defect_rate)) }}%
            </p>
            <p class="text-xs text-gray-500 mt-1">
              {{ formatDate(productionData.period_start) }} - {{ formatDate(productionData.period_end) }}
            </p>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-600">Jami defektlar</p>
            <p class="text-2xl font-bold text-red-600 mt-2">
              {{ formatNumber(productionData.total_defects) }}
            </p>
            <p class="text-xs text-gray-500 mt-1">{{ formatNumber(productionData.defect_rate) }}% nuqson</p>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-600">Yaxshi mahsulotlar</p>
            <p class="text-2xl font-bold text-blue-600 mt-2">
              {{ formatNumber(productionData.total_output - productionData.total_defects) }}
            </p>
            <p class="text-xs text-gray-500 mt-1">Jami ishlab chiqarishdan</p>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-600">Defekt turlari</p>
            <p class="text-2xl font-bold text-purple-600 mt-2">
              {{ productionData.top_defect_reasons.length }}
            </p>
            <p class="text-xs text-gray-500 mt-1">Turli sabab</p>
          </div>
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

function getQualityBgColor(quality) {
  const q = parseFloat(quality)
  if (q >= 97) return 'bg-green-100'
  if (q >= 95) return 'bg-blue-100'
  if (q >= 90) return 'bg-yellow-100'
  return 'bg-red-100'
}

function getQualityIconColor(quality) {
  const q = parseFloat(quality)
  if (q >= 97) return 'text-green-600'
  if (q >= 95) return 'text-blue-600'
  if (q >= 90) return 'text-yellow-600'
  return 'text-red-600'
}

function getQualityBadgeClass(quality) {
  const q = parseFloat(quality)
  if (q >= 97) return 'bg-green-100 text-green-800'
  if (q >= 95) return 'bg-blue-100 text-blue-800'
  if (q >= 90) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

function getQualityStatus(quality) {
  const q = parseFloat(quality)
  if (q >= 97) return 'A\'lo'
  if (q >= 95) return 'Yaxshi'
  if (q >= 90) return 'Qoniqarli'
  return 'Yomon'
}

function calculateQuality(output, defects) {
  if (!output || output === 0) return 100.0
  const quality = ((output - (defects || 0)) / output * 100)
  return quality.toFixed(1)
}

async function fetchData() {
  try {
    const { startDate, endDate } = getDateRange(period.value)
    await analyticsStore.fetchProductionAnalytics(startDate, endDate)
  } catch (err) {
    console.error('Quality analytics error:', err)
  }
}

function handlePeriodChange() {
  fetchData()
}

function exportReport() {
  console.log('Export quality report')
}

onMounted(() => {
  fetchData()
})
</script>