<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Tranzaksiyalar</h1>
        <p class="text-gray-600 mt-1">Moliyaviy operatsiyalar va tranzaksiyalar</p>
      </div>
      <button 
        @click="$router.push({ name: 'finance-transactions-create' })" 
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Yangi tranzaksiya
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Jami kirim</p>
            <p class="text-2xl font-bold text-green-600 mt-2">
              {{ formatCurrency(statistics?.total_income || 0) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Jami chiqim</p>
            <p class="text-2xl font-bold text-red-600 mt-2">
              {{ formatCurrency(statistics?.total_expense || 0) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Sof foyda</p>
            <p class="text-2xl font-bold text-blue-600 mt-2">
              {{ formatCurrency(statistics?.net_profit || 0) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Bugun</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">
              {{ statistics?.total_transactions || 0 }}
            </p>
          </div>
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Qidirish..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            v-model="filters.transaction_type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="handleFilterChange"
          >
            <option value="">Barcha turlar</option>
            <option value="income">Kirim</option>
            <option value="expense">Chiqim</option>
          </select>
        </div>

        <div>
          <select
            v-model="filters.category_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="handleFilterChange"
          >
            <option value="">Barcha kategoriyalar</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div>
          <input
            v-model="filters.start_date"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="handleFilterChange"
          />
        </div>

        <div>
          <input
            v-model="filters.end_date"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="handleFilterChange"
          />
        </div>
      </div>

      <div class="flex items-center justify-between mt-4">
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="text-sm text-gray-600 hover:text-gray-900"
        >
          Filtrlarni tozalash
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="fetchData" class="mt-2 text-sm text-red-600 hover:text-red-700">
        Qayta urinish
      </button>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sana
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Turi
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategoriya
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tavsif
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Summa
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="transactions.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                Ma'lumot topilmadi
              </td>
            </tr>

            <tr
              v-else
              v-for="transaction in transactions"
              :key="transaction.id"
              class="hover:bg-gray-50 transition-colors cursor-pointer"
              @click="viewTransaction(transaction)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(transaction.transaction_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getTypeClass(transaction.transaction_type)"
                >
                  {{ getTypeLabel(transaction.transaction_type) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transaction.category?.name || 'N/A' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ transaction.description || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  :class="transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'"
              >
                {{ transaction.transaction_type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click.stop="viewTransaction(transaction)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Ko'rish"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click.stop="editTransaction(transaction)"
                    class="text-orange-600 hover:text-orange-900"
                    title="Tahrirlash"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click.stop="confirmDelete(transaction)"
                    class="text-red-600 hover:text-red-900"
                    title="O'chirish"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Jami <span class="font-medium">{{ transactions.length }}</span> ta tranzaksiya
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '@/stores/finance'
import { formatCurrency, formatDate } from '@/utils/formatters'

const router = useRouter()
const financeStore = useFinanceStore()

const filters = reactive({
  search: '',
  transaction_type: '',
  category_id: '',
  start_date: '',
  end_date: ''
})

const loading = computed(() => financeStore.loading)
const error = computed(() => financeStore.error?.detail || financeStore.error?.message || null)
const transactions = computed(() => financeStore.transactions)
const categories = computed(() => financeStore.categories)
const statistics = computed(() => financeStore.statistics)

const hasActiveFilters = computed(() => {
  return filters.search || filters.transaction_type || filters.category_id || 
         filters.start_date || filters.end_date
})

async function fetchData() {
  try {
    await Promise.all([
      financeStore.fetchTransactions(filters),
      financeStore.fetchCategories(),
      financeStore.fetchStatistics()
    ])
  } catch (err) {
    console.error('Failed to fetch data:', err)
  }
}

function handleFilterChange() {
  fetchData()
}

function clearFilters() {
  filters.search = ''
  filters.transaction_type = ''
  filters.category_id = ''
  filters.start_date = ''
  filters.end_date = ''
  fetchData()
}

function getTypeClass(type) {
  return type === 'income' 
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
}

function getTypeLabel(type) {
  return type === 'income' ? 'Kirim' : 'Chiqim'
}

function viewTransaction(transaction) {
  router.push(`/finance/transactions/${transaction.id}`)
}

function editTransaction(transaction) {
  router.push(`/finance/transactions/${transaction.id}/edit`)
}

async function confirmDelete(transaction) {
  if (!confirm('Tranzaksiyani o\'chirishga ishonchingiz komilmi?')) return

  try {
    await financeStore.deleteTransaction(transaction.id)
    await fetchData()
  } catch (err) {
    console.error('Failed to delete transaction:', err)
  }
}

onMounted(() => {
  fetchData()
})
</script>