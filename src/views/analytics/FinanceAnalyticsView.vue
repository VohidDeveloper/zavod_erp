<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Moliyaviy tahlil</h1>
        <p class="text-gray-600 mt-1">Daromad, xarajat va foyda tahlili</p>
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
    <template v-else-if="financeData">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-success-500 to-success-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-success-100 text-sm">Daromad</p>
              <p class="text-3xl font-bold mt-2">{{ formatCurrency(financeData.total_income) }}</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-success-100 text-xs">
              {{ formatDate(financeData.period_start) }} - {{ formatDate(financeData.period_end) }}
            </span>
          </div>
        </div>

        <div class="bg-gradient-to-br from-danger-500 to-danger-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-danger-100 text-sm">Xarajat</p>
              <p class="text-3xl font-bold mt-2">{{ formatCurrency(financeData.total_expense) }}</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-danger-100 text-xs">
              {{ ((financeData.total_expense / financeData.total_income) * 100).toFixed(1) }}% daromaddan
            </span>
          </div>
        </div>

        <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-primary-100 text-sm">Sof foyda</p>
              <p class="text-3xl font-bold mt-2">{{ formatCurrency(financeData.net_profit) }}</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-primary-100 text-xs">
              {{ formatNumber(financeData.profit_margin) }}% foyda margin
            </span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Foyda/Xarajat nisbati</p>
              <p class="text-2xl font-bold mt-2" :class="financeData.net_profit >= 0 ? 'text-success-600' : 'text-danger-600'">
                {{ ((financeData.net_profit / financeData.total_expense) * 100).toFixed(1) }}%
              </p>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                 :class="financeData.net_profit >= 0 ? 'bg-success-100' : 'bg-danger-100'">
              <svg class="w-6 h-6" :class="financeData.net_profit >= 0 ? 'text-success-600' : 'text-danger-600'" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              Samaradorlik ko'rsatkichi
            </span>
          </div>
        </div>
      </div>

      <!-- Expense & Income Breakdown -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Expense by Category -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Xarajat taqsimoti</h3>
          <div v-if="financeData.expense_by_category.length > 0" class="space-y-4">
            <div v-for="(expense, index) in financeData.expense_by_category" :key="index" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-gray-900">{{ expense.name || expense.category }}</span>
                <span class="text-gray-600">{{ formatCurrency(expense.amount || expense.total) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  class="h-3 rounded-full bg-red-500 transition-all duration-500"
                  :style="{ width: `${((expense.amount || expense.total) / financeData.total_expense * 100).toFixed(0)}%` }"
                ></div>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ ((expense.amount || expense.total) / financeData.total_expense * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-400 py-8">
            Ma'lumot yo'q
          </div>
        </div>

        <!-- Income by Category -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Daromad manbalari</h3>
          <div v-if="financeData.income_by_category.length > 0" class="space-y-4">
            <div v-for="(income, index) in financeData.income_by_category" :key="index" 
                 class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ income.name || income.category }}</p>
                  <p class="text-xs text-gray-500">{{ income.count || 0 }} ta tranzaksiya</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">{{ formatCurrency(income.amount || income.total) }}</p>
                <p class="text-xs text-gray-500">{{ ((income.amount || income.total) / financeData.total_income * 100).toFixed(1) }}%</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-400 py-8">
            Ma'lumot yo'q
          </div>
        </div>
      </div>

      <!-- Monthly Trend -->
      <div v-if="financeData.monthly_trend.length > 0" class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Oylik tendensiya</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oy</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Daromad</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Xarajat</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Foyda</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Margin</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(month, index) in financeData.monthly_trend" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ month.month || month.period }}</td>
                <td class="px-6 py-4 text-right text-sm text-success-600 font-semibold">
                  {{ formatCurrency(month.income || month.revenue) }}
                </td>
                <td class="px-6 py-4 text-right text-sm text-danger-600 font-semibold">
                  {{ formatCurrency(month.expense || month.expenses) }}
                </td>
                <td class="px-6 py-4 text-right text-sm font-semibold" 
                    :class="(month.profit || (month.income - month.expense)) >= 0 ? 'text-primary-600' : 'text-danger-600'">
                  {{ formatCurrency(month.profit || (month.income - month.expense)) }}
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                    {{ month.margin ? formatNumber(month.margin) : ((month.profit / month.income) * 100).toFixed(1) }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Financial Summary -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Moliyaviy xulosa</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-600">Jami daromad</p>
            <p class="text-2xl font-bold text-green-600 mt-2">
              {{ formatCurrency(financeData.total_income) }}
            </p>
            <p class="text-xs text-gray-500 mt-1">{{ formatDate(financeData.period_start) }} dan {{ formatDate(financeData.period_end) }} gacha</p>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-600">Jami xarajat</p>
            <p class="text-2xl font-bold text-red-600 mt-2">
              {{ formatCurrency(financeData.total_expense) }}
            </p>
            <p class="text-xs text-gray-500 mt-1">Daromadning {{ ((financeData.total_expense / financeData.total_income) * 100).toFixed(1) }}%</p>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-600">Sof foyda</p>
            <p class="text-2xl font-bold text-blue-600 mt-2">
              {{ formatCurrency(financeData.net_profit) }}
            </p>
            <p class="text-xs text-gray-500 mt-1">{{ formatNumber(financeData.profit_margin) }}% foyda margini</p>
          </div>
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
const financeData = computed(() => analyticsStore.financeAnalytics)

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
    await analyticsStore.fetchFinanceAnalytics(startDate, endDate)
  } catch (err) {
    console.error('Finance analytics error:', err)
  }
}

function handlePeriodChange() {
  fetchData()
}

function exportReport() {
  console.log('Export finance report')
}

onMounted(() => {
  fetchData()
})
</script>