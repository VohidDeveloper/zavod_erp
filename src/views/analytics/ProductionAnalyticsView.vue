<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ishlab chiqarish tahlili</h1>
          <p class="text-gray-600 mt-1">Ishlab chiqarish ko'rsatkichlari va statistika</p>
        </div>
        <div class="flex gap-2">
          <select v-model="period" class="input" @change="fetchData">
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
  
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-primary-100 text-sm">Jami ishlab chiqarish</p>
              <p class="text-3xl font-bold mt-2">{{ formatNumber(metrics.total_production) }}</p>
              <p class="text-primary-100 text-xs mt-2">dona</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span :class="metrics.production_change >= 0 ? 'text-green-300' : 'text-red-300'" class="text-sm font-medium">
              {{ metrics.production_change >= 0 ? '+' : '' }}{{ metrics.production_change }}%
            </span>
            <span class="text-primary-100 text-xs ml-2">o'tgan davr bilan</span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Samaradorlik</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ metrics.efficiency }}%</p>
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
              :style="{ width: `${metrics.efficiency}%` }"
            ></div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Nuqsonli mahsulot</p>
              <p class="text-2xl font-bold text-danger-600 mt-2">{{ formatNumber(metrics.defective) }}</p>
            </div>
            <div class="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ ((metrics.defective / metrics.total_production) * 100).toFixed(2) }}% nuqson darajasi
            </span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">O'rtacha vaqt</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ metrics.avg_time }}</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">bir mahsulot uchun</span>
          </div>
        </div>
      </div>
  
      <!-- Charts Row 1 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Production Trend Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">Ishlab chiqarish dinamikasi</h3>
            <select v-model="chartPeriod" class="text-sm border border-gray-300 rounded px-3 py-1">
              <option value="day">Kunlik</option>
              <option value="week">Haftalik</option>
              <option value="month">Oylik</option>
            </select>
          </div>
          <div class="h-64">
            <canvas id="productionTrendChart"></canvas>
          </div>
        </div>
  
        <!-- Product Distribution Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Mahsulot bo'yicha taqsimot</h3>
          <div class="h-64">
            <canvas id="productDistributionChart"></canvas>
          </div>
        </div>
      </div>
  
      <!-- Charts Row 2 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Efficiency Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Samaradorlik ko'rsatkichlari</h3>
          <div class="h-64">
            <canvas id="efficiencyChart"></canvas>
          </div>
        </div>
  
        <!-- Machine Utilization -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Mashina bandligi</h3>
          <div class="space-y-4">
            <div v-for="machine in machineUtilization" :key="machine.id" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-gray-900">{{ machine.name }}</span>
                <span class="text-gray-600">{{ machine.utilization }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  class="h-3 rounded-full transition-all duration-500"
                  :class="getUtilizationColor(machine.utilization)"
                  :style="{ width: `${machine.utilization}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Top Products Table -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Eng ko'p ishlab chiqarilgan mahsulotlar</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahsulot</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Miqdor</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nuqsonli</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sifat %</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">O'rtacha vaqt</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(product, index) in topProducts" :key="product.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-6 py-4">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                    <p class="text-xs text-gray-500">{{ product.code }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {{ formatNumber(product.quantity) }}
                </td>
                <td class="px-6 py-4 text-right text-sm text-danger-600">
                  {{ formatNumber(product.defective) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <span 
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getQualityClass(product.quality_rate)"
                  >
                    {{ product.quality_rate }}%
                  </span>
                </td>
                <td class="px-6 py-4 text-right text-sm text-gray-900">
                  {{ product.avg_time }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useAnalyticsStore } from '@/stores/analytics'
  import { formatNumber } from '@/utils/formatters'
  
  const analyticsStore = useAnalyticsStore()
  
  const period = ref('month')
  const chartPeriod = ref('day')
  
  const metrics = ref({
    total_production: 0,
    production_change: 0,
    efficiency: 0,
    defective: 0,
    avg_time: '0h',
  })
  
  const machineUtilization = ref([])
  const topProducts = ref([])
  
  onMounted(() => {
    fetchData()
    initCharts()
  })
  
  watch(chartPeriod, () => {
    updateProductionChart()
  })
  
  async function fetchData() {
    try {
      const data = await analyticsStore.fetchProductionAnalytics(period.value)
      metrics.value = data.metrics
      machineUtilization.value = data.machine_utilization
      topProducts.value = data.top_products
      updateCharts(data)
    } catch (error) {
      console.error('Analytics error:', error)
    }
  }
  
  function initCharts() {
    // Initialize Chart.js charts here
    // This is placeholder - actual implementation would use Chart.js library
  }
  
  function updateCharts(data) {
    updateProductionChart()
    updateProductDistributionChart(data)
    updateEfficiencyChart(data)
  }
  
  function updateProductionChart() {
    // Update production trend chart
  }
  
  function updateProductDistributionChart(data) {
    // Update product distribution pie chart
  }
  
  function updateEfficiencyChart(data) {
    // Update efficiency line chart
  }
  
  function getUtilizationColor(utilization) {
    if (utilization >= 80) return 'bg-success-500'
    if (utilization >= 60) return 'bg-warning-500'
    return 'bg-danger-500'
  }
  
  function getQualityClass(quality) {
    if (quality >= 95) return 'bg-success-100 text-success-800'
    if (quality >= 90) return 'bg-warning-100 text-warning-800'
    return 'bg-danger-100 text-danger-800'
  }
  
  function exportReport() {
    console.log('Export production report')
  }
  </script>