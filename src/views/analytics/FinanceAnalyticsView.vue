<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Moliyaviy tahlil</h1>
          <p class="text-gray-600 mt-1">Daromad, xarajat va foyda tahlili</p>
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
              <p class="text-success-100 text-sm">Daromad</p>
              <p class="text-3xl font-bold mt-2">{{ formatCurrency(metrics.revenue) }}</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span :class="metrics.revenue_change >= 0 ? 'text-green-300' : 'text-red-300'" class="text-sm font-medium">
              {{ metrics.revenue_change >= 0 ? '+' : '' }}{{ metrics.revenue_change }}%
            </span>
            <span class="text-success-100 text-xs ml-2">o'tgan davr bilan</span>
          </div>
        </div>
  
        <div class="bg-gradient-to-br from-danger-500 to-danger-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-danger-100 text-sm">Xarajat</p>
              <p class="text-3xl font-bold mt-2">{{ formatCurrency(metrics.expenses) }}</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span class="text-danger-100 text-xs">
              {{ ((metrics.expenses / metrics.revenue) * 100).toFixed(1) }}% daromaddan
            </span>
          </div>
        </div>
  
        <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-primary-100 text-sm">Sof foyda</p>
              <p class="text-3xl font-bold mt-2">{{ formatCurrency(metrics.profit) }}</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span class="text-primary-100 text-xs">
              {{ metrics.profit_margin }}% foyda margin
            </span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Pul oqimi</p>
              <p class="text-2xl font-bold mt-2" :class="metrics.cash_flow >= 0 ? 'text-success-600' : 'text-danger-600'">
                {{ formatCurrency(metrics.cash_flow) }}
              </p>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                 :class="metrics.cash_flow >= 0 ? 'bg-success-100' : 'bg-danger-100'">
              <svg class="w-6 h-6" :class="metrics.cash_flow >= 0 ? 'text-success-600' : 'text-danger-600'" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ metrics.cash_flow >= 0 ? 'Ijobiy' : 'Salbiy' }} oqim
            </span>
          </div>
        </div>
      </div>
  
      <!-- Expense Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Xarajat taqsimoti</h3>
          <div class="space-y-4">
            <div v-for="expense in expenseBreakdown" :key="expense.category" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-gray-900">{{ expense.category }}</span>
                <span class="text-gray-600">{{ formatCurrency(expense.amount) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  class="h-3 rounded-full transition-all duration-500"
                  :class="getExpenseColor(expense.category)"
                  :style="{ width: `${expense.percentage}%` }"
                ></div>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ expense.percentage }}%</span>
                <span :class="expense.change >= 0 ? 'text-danger-600' : 'text-success-600'">
                  {{ expense.change >= 0 ? '+' : '' }}{{ expense.change }}% o'tgan oy
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Daromad manbalari</h3>
          <div class="space-y-4">
            <div v-for="source in revenueSources" :key="source.name" class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                     :class="source.color">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ source.name }}</p>
                  <p class="text-xs text-gray-500">{{ source.count }} ta tranzaksiya</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">{{ formatCurrency(source.amount) }}</p>
                <p class="text-xs text-gray-500">{{ source.percentage }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Financial Summary Table -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Moliyaviy ko'rsatkichlar</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ko'rsatkich</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bu oy</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">O'tgan oy</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">O'zgarish</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Yillik</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="metric in financialMetrics" :key="metric.name" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ metric.name }}</td>
                <td class="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {{ formatCurrency(metric.current) }}
                </td>
                <td class="px-6 py-4 text-right text-sm text-gray-600">
                  {{ formatCurrency(metric.previous) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <span 
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="metric.change >= 0 ? 'bg-success-100 text-success-800' : 'bg-danger-100 text-danger-800'"
                  >
                    {{ metric.change >= 0 ? '+' : '' }}{{ metric.change }}%
                  </span>
                </td>
                <td class="px-6 py-4 text-right text-sm text-gray-900">
                  {{ formatCurrency(metric.yearly) }}
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
  import { formatCurrency } from '@/utils/formatters'
  
  const analyticsStore = useAnalyticsStore()
  
  const period = ref('month')
  
  const metrics = ref({
    revenue: 85000000,
    revenue_change: 12.5,
    expenses: 58500000,
    profit: 26500000,
    profit_margin: 31.2,
    cash_flow: 15200000,
  })
  
  const expenseBreakdown = ref([
    { category: 'Xom-ashyo', amount: 28500000, percentage: 48.7, change: 5.2 },
    { category: 'Ish haqi', amount: 18200000, percentage: 31.1, change: 2.1 },
    { category: 'Kommunal xizmatlar', amount: 6800000, percentage: 11.6, change: -1.5 },
    { category: 'Transport', amount: 3200000, percentage: 5.5, change: 8.3 },
    { category: 'Boshqa', amount: 1800000, percentage: 3.1, change: -2.8 },
  ])
  
  const revenueSources = ref([
    { name: 'Mahsulot sotish', amount: 65000000, percentage: 76.5, count: 245, color: 'bg-success-500' },
    { name: 'Xizmat ko\'rsatish', amount: 12000000, percentage: 14.1, count: 89, color: 'bg-primary-500' },
    { name: 'Boshqa daromad', amount: 8000000, percentage: 9.4, count: 34, color: 'bg-warning-500' },
  ])
  
  const financialMetrics = ref([
    { name: 'Daromad', current: 85000000, previous: 75600000, change: 12.5, yearly: 965000000 },
    { name: 'Xarajat', current: 58500000, previous: 54200000, change: 7.9, yearly: 685000000 },
    { name: 'Sof foyda', current: 26500000, previous: 21400000, change: 23.8, yearly: 280000000 },
    { name: 'Pul oqimi', current: 15200000, previous: 18900000, change: -19.6, yearly: 198000000 },
  ])
  
  onMounted(() => {
    fetchData()
  })
  
  async function fetchData() {
    try {
      // const data = await analyticsStore.fetchFinanceAnalytics(period.value)
    } catch (error) {
      console.error('Analytics error:', error)
    }
  }
  
  function getExpenseColor(category) {
    const colors = {
      'Xom-ashyo': 'bg-danger-500',
      'Ish haqi': 'bg-primary-500',
      'Kommunal xizmatlar': 'bg-warning-500',
      'Transport': 'bg-success-500',
      'Boshqa': 'bg-gray-500',
    }
    return colors[category] || 'bg-gray-500'
  }
  
  function exportReport() {
    console.log('Export finance report')
  }
  </script>