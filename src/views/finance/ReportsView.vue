<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Moliyaviy hisobotlar</h1>
        <p class="text-gray-600 mt-1">Daromad, xarajat va foyda hisobotlari</p>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Dan</label>
          <input 
            v-model="filters.start_date" 
            type="date" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Gacha</label>
          <input 
            v-model="filters.end_date" 
            type="date" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex items-end">
          <button 
            @click="fetchReports" 
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Qo'llash
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="fetchReports" class="mt-2 text-sm text-red-600 hover:text-red-700">
        Qayta urinish
      </button>
    </div>

    <!-- Reports Content -->
    <template v-else>
      <!-- Summary Cards (P&L) -->
      <div v-if="profitAndLoss" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-green-50 rounded-lg shadow p-6">
          <p class="text-green-600 text-sm font-medium">Jami kirim</p>
          <p class="text-3xl font-bold text-green-700 mt-2">
            {{ formatCurrency(profitAndLoss.total_income) }}
          </p>
        </div>
        <div class="bg-red-50 rounded-lg shadow p-6">
          <p class="text-red-600 text-sm font-medium">Jami chiqim</p>
          <p class="text-3xl font-bold text-red-700 mt-2">
            {{ formatCurrency(profitAndLoss.total_expense) }}
          </p>
        </div>
        <div class="bg-blue-50 rounded-lg shadow p-6">
          <p class="text-blue-600 text-sm font-medium">Sof foyda</p>
          <p class="text-3xl font-bold text-blue-700 mt-2">
            {{ formatCurrency(profitAndLoss.net_profit) }}
          </p>
        </div>
      </div>

      <!-- Income by Category -->
      <div v-if="profitAndLoss?.income_by_category?.length > 0" class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Kirim bo'yicha taqsimot</h3>
        </div>
        <div class="p-6">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategoriya</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Miqdor</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Summa</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ulush</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(item, index) in profitAndLoss.income_by_category" :key="index">
                <td class="px-6 py-4 text-sm text-gray-900">{{ item.name || item.category }}</td>
                <td class="px-6 py-4 text-sm text-right text-gray-900">{{ item.count || 0 }}</td>
                <td class="px-6 py-4 text-sm text-right text-green-600 font-semibold">
                  {{ formatCurrency(item.amount || item.total) }}
                </td>
                <td class="px-6 py-4 text-sm text-right text-gray-600">
                  {{ ((item.amount || item.total) / profitAndLoss.total_income * 100).toFixed(1) }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Expense by Category -->
      <div v-if="profitAndLoss?.expense_by_category?.length > 0" class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Xarajat bo'yicha taqsimot</h3>
        </div>
        <div class="p-6">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategoriya</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Summa</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ulush</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="(item, index) in profitAndLoss.expense_by_category" :key="index">
                <td class="px-6 py-4 text-sm text-gray-900">{{ item.name || item.category }}</td>
                <td class="px-6 py-4 text-sm text-right text-red-600 font-semibold">
                  {{ formatCurrency(item.amount || item.total) }}
                </td>
                <td class="px-6 py-4 text-sm text-right text-gray-600">
                  {{ ((item.amount || item.total) / profitAndLoss.total_expense * 100).toFixed(1) }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Cash Flow Report -->
      <div v-if="cashFlow" class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Pul oqimi hisoboti</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">Boshlang'ich balans</p>
              <p class="text-xl font-bold text-gray-900 mt-2">
                {{ formatCurrency(cashFlow.opening_balance) }}
              </p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-green-600">Kirim</p>
              <p class="text-xl font-bold text-green-700 mt-2">
                +{{ formatCurrency(cashFlow.total_inflow) }}
              </p>
            </div>
            <div class="p-4 bg-red-50 rounded-lg">
              <p class="text-sm text-red-600">Chiqim</p>
              <p class="text-xl font-bold text-red-700 mt-2">
                -{{ formatCurrency(cashFlow.total_outflow) }}
              </p>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-600">Yakuniy balans</p>
              <p class="text-xl font-bold text-blue-700 mt-2">
                {{ formatCurrency(cashFlow.closing_balance) }}
              </p>
            </div>
          </div>

          <!-- Monthly Trend -->
          <div v-if="cashFlow.cash_flow_by_month?.length > 0">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Oylik dinamika</h4>
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Oy</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Kirim</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Chiqim</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Sof</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="(month, index) in cashFlow.cash_flow_by_month" :key="index">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ month.month || month.period }}</td>
                  <td class="px-4 py-3 text-sm text-right text-green-600">
                    {{ formatCurrency(month.inflow || 0) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right text-red-600">
                    {{ formatCurrency(month.outflow || 0) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right font-semibold"
                      :class="(month.inflow - month.outflow) >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ formatCurrency((month.inflow || 0) - (month.outflow || 0)) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Balance Sheet -->
      <div v-if="balanceSheet" class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Balans hisoboti</h3>
          <p class="text-sm text-gray-600 mt-1">Holatga: {{ formatDate(balanceSheet.report_date) }}</p>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-600">Aktivlar</p>
              <p class="text-2xl font-bold text-blue-700 mt-2">
                {{ formatCurrency(balanceSheet.total_assets) }}
              </p>
            </div>
            <div class="p-4 bg-red-50 rounded-lg">
              <p class="text-sm text-red-600">Passivlar</p>
              <p class="text-2xl font-bold text-red-700 mt-2">
                {{ formatCurrency(balanceSheet.total_liabilities) }}
              </p>
            </div>
            <div class="p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-green-600">Kapital</p>
              <p class="text-2xl font-bold text-green-700 mt-2">
                {{ formatCurrency(balanceSheet.total_equity) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { formatCurrency, formatDate } from '@/utils/formatters'

const financeStore = useFinanceStore()

const filters = reactive({
  start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
  end_date: new Date().toISOString().split('T')[0]
})

const loading = computed(() => financeStore.loading)
const error = computed(() => financeStore.error?.detail || financeStore.error?.message || null)
const profitAndLoss = computed(() => financeStore.profitAndLoss)
const cashFlow = computed(() => financeStore.cashFlow)
const balanceSheet = computed(() => financeStore.balanceSheet)

async function fetchReports() {
  try {
    await Promise.all([
      financeStore.fetchProfitAndLoss(filters.start_date, filters.end_date),
      financeStore.fetchCashFlow(filters.start_date, filters.end_date),
      financeStore.fetchBalanceSheet(filters.end_date)
    ])
  } catch (err) {
    console.error('Failed to fetch reports:', err)
  }
}

onMounted(() => {
  fetchReports()
})
</script>