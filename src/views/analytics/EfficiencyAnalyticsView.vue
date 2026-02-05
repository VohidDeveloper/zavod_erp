<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Samaradorlik Tahlili</h1>
        <p class="text-gray-600 mt-1">Umumiy samaradorlik va mahsuldorlik ko'rsatkichlari</p>
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
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm">Samaradorlik</p>
              <p class="text-3xl font-bold mt-2">{{ formatNumber(productionData.average_efficiency) }}%</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-blue-100 text-xs">Maqsad: 90%</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jami ishlab chiqarish</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ formatNumber(productionData.total_output) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
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
              <p class="text-sm text-gray-600">Nuqson darajasi</p>
              <p class="text-2xl font-bold text-danger-600 mt-2">{{ formatNumber(productionData.defect_rate) }}%</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p class="text-sm text-gray-600">Sifat ko'rsatkichi</p>
              <p class="text-2xl font-bold text-success-600 mt-2">{{ formatNumber(100 - parseFloat(productionData.defect_rate)) }}%</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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

      <!-- Production by Line Efficiency -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Liniyalar bo'yicha samaradorlik</h3>
        </div>
        <div v-if="productionData.production_by_line.length > 0" class="p-6">
          <div class="space-y-4">
            <div
              v-for="(line, index) in productionData.production_by_line"
              :key="index"
              class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition"
            >
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">{{ line.name || `Liniya ${index + 1}` }}</p>
                  <p class="text-sm text-gray-600">Ishlab chiqarish: {{ formatNumber(line.output || 0) }} dona</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold" :class="getEfficiencyTextColor(line.efficiency || productionData.average_efficiency)">
                    {{ formatNumber(line.efficiency || productionData.average_efficiency) }}%
                  </p>
                  <span class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="getEfficiencyClass(line.efficiency || productionData.average_efficiency)">
                    {{ getEfficiencyLabel(line.efficiency || productionData.average_efficiency) }}
                  </span>
                </div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  :class="getEfficiencyBarClass(line.efficiency || productionData.average_efficiency)"
                  class="h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${line.efficiency || productionData.average_efficiency}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="p-6 text-center text-gray-400">
          Ma'lumot yo'q
        </div>
      </div>

      <!-- Daily Production Trend -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Kunlik ishlab chiqarish dinamikasi</h3>
        </div>
        <div v-if="productionData.production_by_day.length > 0" class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ishlab chiqarish</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nuqsonlar</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sifat %</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(day, index) in productionData.production_by_day.slice(0, 10)" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ day.date }}</td>
                  <td class="px-6 py-4 text-right text-sm text-gray-900 font-semibold">
                    {{ formatNumber(day.output || 0) }}
                  </td>
                  <td class="px-6 py-4 text-right text-sm text-danger-600">
                    {{ formatNumber(day.defects || 0) }}
                  </td>
                  <td class="px-6 py-4 text-right">
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
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

      <!-- Top Defect Reasons -->
      <div v-if="productionData.top_defect_reasons.length > 0" class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Asosiy nuqson sabablari</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              v-for="(reason, index) in productionData.top_defect_reasons" 
              :key="index"
              class="p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p class="font-medium text-gray-900">{{ reason.name || reason.reason }}</p>
                </div>
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  {{ ((reason.count / productionData.total_defects) * 100).toFixed(1) }}%
                </span>
              </div>
              <p class="text-2xl font-bold text-red-600 mt-2">{{ formatNumber(reason.count || 0) }}</p>
              <p class="text-sm text-gray-600 mt-1">ta nuqson</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Davr xulosasi</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-600">O'rtacha samaradorlik</p>
            <p class="text-2xl font-bold text-blue-600 mt-2">
              {{ formatNumber(productionData.average_efficiency) }}%
            </p>
            <p class="text-xs text-gray-500 mt-1">
              {{ formatDate(productionData.period_start) }} - {{ formatDate(productionData.period_end) }}
            </p>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-600">Jami ishlab chiqarish</p>
            <p class="text-2xl font-bold text-green-600 mt-2">
              {{ formatNumber(productionData.total_output) }}
            </p>
            <p class="text-xs text-gray-500 mt-1">{{ productionData.total_shifts }} ta smena</p>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-600">Sifat darajasi</p>
            <p class="text-2xl font-bold text-purple-600 mt-2">
              {{ formatNumber(100 - parseFloat(productionData.defect_rate)) }}%
            </p>
            <p class="text-xs text-gray-500 mt-1">Nuqson: {{ formatNumber(productionData.defect_rate) }}%</p>
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

function getEfficiencyClass(efficiency) {
  const eff = parseFloat(efficiency)
  if (eff >= 85) return 'bg-green-100 text-green-800'
  if (eff >= 70) return 'bg-blue-100 text-blue-800'
  return 'bg-red-100 text-red-800'
}

function getEfficiencyTextColor(efficiency) {
  const eff = parseFloat(efficiency)
  if (eff >= 85) return 'text-green-600'
  if (eff >= 70) return 'text-blue-600'
  return 'text-red-600'
}

function getEfficiencyLabel(efficiency) {
  const eff = parseFloat(efficiency)
  if (eff >= 85) return 'A\'lo'
  if (eff >= 70) return 'Yaxshi'
  return 'Qoniqarsiz'
}

function getEfficiencyBarClass(efficiency) {
  const eff = parseFloat(efficiency)
  if (eff >= 85) return 'bg-green-600'
  if (eff >= 70) return 'bg-blue-600'
  return 'bg-red-600'
}

function calculateQuality(output, defects) {
  if (!output || output === 0) return '100.0'
  const quality = ((output - (defects || 0)) / output * 100)
  return quality.toFixed(1)
}

async function fetchData() {
  try {
    const { startDate, endDate } = getDateRange(period.value)
    await analyticsStore.fetchProductionAnalytics(startDate, endDate)
  } catch (err) {
    console.error('Efficiency analytics error:', err)
  }
}

function handlePeriodChange() {
  fetchData()
}

function exportReport() {
  console.log('Export efficiency report')
}

onMounted(() => {
  fetchData()
})
</script>