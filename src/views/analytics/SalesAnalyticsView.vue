<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Savdo tahlili</h1>
        <p class="text-gray-600 mt-1">Savdo ko'rsatkichlari va statistika</p>
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
    <template v-else-if="salesData">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-success-500 to-success-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-success-100 text-sm">Jami savdo</p>
              <p class="text-3xl font-bold mt-2">{{ formatCurrency(salesData.total_revenue) }}</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span class="text-success-100 text-xs">
              {{ formatDate(salesData.period_start) }} - {{ formatDate(salesData.period_end) }}
            </span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Buyurtmalar</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ formatNumber(salesData.total_orders) }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ formatCurrency(salesData.average_order_value) }} o'rtacha
            </span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">To'langan</p>
              <p class="text-2xl font-bold text-success-600 mt-2">{{ formatCurrency(salesData.total_paid) }}</p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ formatCurrency(salesData.total_unpaid) }} to'lanmagan
            </span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Eng yaxshi mijozlar</p>
              <p class="text-2xl font-bold text-primary-600 mt-2">{{ salesData.top_customers.length }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Sales by Day Chart -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Kunlik savdo</h3>
          <div v-if="salesData.sales_by_day.length > 0" class="h-80">
            <!-- Chart here -->
            <div class="flex items-center justify-center h-full text-gray-400">
              <p>Chart: {{ salesData.sales_by_day.length }} kun</p>
            </div>
          </div>
          <div v-else class="h-80 flex items-center justify-center text-gray-400">
            Ma'lumot yo'q
          </div>
        </div>

        <!-- Top Customers -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Eng yaxshi mijozlar</h3>
          <div v-if="salesData.top_customers.length > 0" class="space-y-3">
            <div 
              v-for="(customer, index) in salesData.top_customers.slice(0, 5)" 
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-600 font-bold">{{ index + 1 }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ customer.name }}</p>
                  <p class="text-xs text-gray-500">{{ customer.orders || 0 }} buyurtma</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-success-600">
                  {{ formatCurrency(customer.revenue || 0) }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-400 py-8">
            Ma'lumot yo'q
          </div>
        </div>
      </div>

      <!-- Top Products Table -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Eng ko'p sotilgan mahsulotlar</h3>
        </div>
        <div v-if="salesData.top_products.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahsulot</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sotildi</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Daromad</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(product, index) in salesData.top_products" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-6 py-4">
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                    <p class="text-xs text-gray-500">{{ product.code || '-' }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {{ formatNumber(product.quantity || 0) }}
                </td>
                <td class="px-6 py-4 text-right text-sm font-semibold text-success-600">
                  {{ formatCurrency(product.revenue || 0) }}
                </td>
              </tr>
            </tbody>
          </table>
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
import { formatNumber, formatCurrency, formatDate } from '@/utils/formatters'

const analyticsStore = useAnalyticsStore()

const period = ref('month')
const loading = computed(() => analyticsStore.loading)
const error = computed(() => analyticsStore.error?.detail || analyticsStore.error?.message || null)
const salesData = computed(() => analyticsStore.salesAnalytics)

// Calculate date range based on period
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
    await analyticsStore.fetchSalesAnalytics(startDate, endDate)
  } catch (err) {
    console.error('Sales analytics error:', err)
  }
}

function handlePeriodChange() {
  fetchData()
}

function exportReport() {
  console.log('Export sales report for period:', period.value)
  // TODO: Implement export functionality
}

onMounted(() => {
  fetchData()
})
</script>