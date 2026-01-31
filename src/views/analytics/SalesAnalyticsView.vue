<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Savdo tahlili</h1>
          <p class="text-gray-600 mt-1">Savdo ko'rsatkichlari va statistika</p>
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
        <div class="bg-gradient-to-br from-success-500 to-success-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-success-100 text-sm">Jami savdo</p>
              <p class="text-3xl font-bold mt-2">{{ formatCurrency(metrics.total_sales) }}</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span :class="metrics.sales_change >= 0 ? 'text-green-300' : 'text-red-300'" class="text-sm font-medium">
              {{ metrics.sales_change >= 0 ? '+' : '' }}{{ metrics.sales_change }}%
            </span>
            <span class="text-success-100 text-xs ml-2">o'tgan davr bilan</span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Buyurtmalar</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ formatNumber(metrics.total_orders) }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ formatCurrency(metrics.avg_order_value) }} o'rtacha
            </span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Yangi mijozlar</p>
              <p class="text-2xl font-bold text-primary-600 mt-2">{{ formatNumber(metrics.new_customers) }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              Jami {{ formatNumber(metrics.total_customers) }} mijoz
            </span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Konversiya</p>
              <p class="text-2xl font-bold text-warning-600 mt-2">{{ metrics.conversion_rate }}%</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div class="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-warning-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${metrics.conversion_rate}%` }"
            ></div>
          </div>
        </div>
      </div>
  
      <!-- Top Products Table -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Eng ko'p sotilgan mahsulotlar</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahsulot</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sotildi</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Daromad</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">O'sish</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ulush</th>
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
                <td class="px-6 py-4 text-right text-sm font-semibold text-success-600">
                  {{ formatCurrency(product.revenue) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <span 
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="product.growth >= 0 ? 'bg-success-100 text-success-800' : 'bg-danger-100 text-danger-800'"
                  >
                    {{ product.growth >= 0 ? '+' : '' }}{{ product.growth }}%
                  </span>
                </td>
                <td class="px-6 py-4 text-right text-sm text-gray-900">
                  {{ product.share }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useAnalyticsStore } from '@/stores/analytics'
  import { formatNumber, formatCurrency } from '@/utils/formatters'
  
  const analyticsStore = useAnalyticsStore()
  
  const period = ref('month')
  
  const metrics = ref({
    total_sales: 85000000,
    sales_change: 12.5,
    total_orders: 245,
    avg_order_value: 346938,
    new_customers: 32,
    total_customers: 156,
    conversion_rate: 68,
  })
  
  const topProducts = ref([
    { id: 1, name: 'Quvur 110mm', code: 'P-110', quantity: 1250, revenue: 25000000, growth: 15.3, share: 29.4 },
    { id: 2, name: 'Quvur 160mm', code: 'P-160', quantity: 890, revenue: 21500000, growth: 8.7, share: 25.3 },
    { id: 3, name: 'Fitting 110mm', code: 'F-110', quantity: 2340, revenue: 15600000, growth: -3.2, share: 18.4 },
  ])
  
  onMounted(() => {
    fetchData()
  })
  
  async function fetchData() {
    try {
      // const data = await analyticsStore.fetchSalesAnalytics(period.value)
    } catch (error) {
      console.error('Analytics error:', error)
    }
  }
  
  function exportReport() {
    console.log('Export sales report')
  }
  </script>