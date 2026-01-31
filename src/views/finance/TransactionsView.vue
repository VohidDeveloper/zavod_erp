<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Tranzaksiyalar</h1>
          <p class="text-gray-600 mt-1">Moliyaviy operatsiyalar va tranzaksiyalar</p>
        </div>
        <button @click="openCreateModal" class="btn-primary flex items-center gap-2">
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
              <p class="text-2xl font-bold text-success-600 mt-2">
                {{ formatCurrency(stats.total_income) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jami chiqim</p>
              <p class="text-2xl font-bold text-danger-600 mt-2">
                {{ formatCurrency(stats.total_expense) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Sof foyda</p>
              <p class="text-2xl font-bold text-primary-600 mt-2">
                {{ formatCurrency(stats.net_profit) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                {{ stats.today_count }}
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
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              @input="debouncedFetch"
            />
          </div>
  
          <div>
            <select
              v-model="filters.type"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              @change="fetchTransactions"
            >
              <option value="">Barcha turlar</option>
              <option value="income">Kirim</option>
              <option value="expense">Chiqim</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>
  
          <div>
            <select
              v-model="filters.category"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              @change="fetchTransactions"
            >
              <option value="">Barcha kategoriyalar</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>
  
          <div>
            <input
              v-model="filters.date_from"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              @change="fetchTransactions"
            />
          </div>
  
          <div>
            <input
              v-model="filters.date_to"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              @change="fetchTransactions"
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
          <div class="flex gap-2 ml-auto">
            <button @click="exportToExcel" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Excel
            </button>
            <button @click="exportToPDF" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              PDF
            </button>
          </div>
        </div>
      </div>
  
      <!-- Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To'lov usuli
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
              <tr v-if="loading">
                <td colspan="7" class="px-6 py-8 text-center">
                  <div class="flex items-center justify-center">
                    <svg class="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="ml-2 text-gray-600">Yuklanmoqda...</span>
                  </div>
                </td>
              </tr>
  
              <tr v-else-if="!transactions.length">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                  Ma'lumot topilmadi
                </td>
              </tr>
  
              <tr
                v-else
                v-for="transaction in transactions"
                :key="transaction.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(transaction.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getTypeClass(transaction.type)"
                  >
                    {{ getTypeLabel(transaction.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ transaction.category }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ truncate(transaction.description, 50) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ transaction.payment_method }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                    :class="transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'"
                >
                  {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="viewTransaction(transaction)"
                      class="text-primary-600 hover:text-primary-900"
                      title="Ko'rish"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      v-if="canEdit(transaction)"
                      @click="editTransaction(transaction)"
                      class="text-warning-600 hover:text-warning-900"
                      title="Tahrirlash"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      v-if="canDelete(transaction)"
                      @click="deleteTransaction(transaction)"
                      class="text-danger-600 hover:text-danger-900"
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
              Ko'rsatilmoqda <span class="font-medium">{{ from }}</span> dan
              <span class="font-medium">{{ to }}</span> gacha,
              jami <span class="font-medium">{{ total }}</span> ta
            </div>
            <div class="flex gap-2">
              <button
                @click="prevPage"
                :disabled="!hasPrev"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Oldingi
              </button>
              <button
                @click="nextPage"
                :disabled="!hasNext"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keyingi
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Create/Edit Modal -->
      <TransactionModal
        v-if="showModal"
        :transaction="selectedTransaction"
        @close="closeModal"
        @saved="handleSaved"
      />
  
      <!-- View Modal -->
      <TransactionDetailsModal
        v-if="showDetailsModal"
        :transaction="selectedTransaction"
        @close="showDetailsModal = false"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useFinanceStore } from '@/stores/finance'
  import { useNotifications } from '@/composables/useNotifications'
  import { usePermissions } from '@/composables/usePermissions'
  import { usePagination } from '@/composables/usePagination'
  import { formatCurrency, formatDate, truncate } from '@/utils/formatters'
  import { createDebounce } from '@/utils/helpers'
  import { exportToExcel as exportExcel, exportToPDF as exportPdf } from '@/utils/exportUtils'
  import TransactionModal from '@/components/finance/modals/TransactionModal.vue'
  import TransactionDetailsModal from '@/components/finance/modals/TransactionDetailsModal.vue'
  
  const financeStore = useFinanceStore()
  const notifications = useNotifications()
  const { can } = usePermissions()
  
  const filters = reactive({
    search: '',
    type: '',
    category: '',
    date_from: '',
    date_to: '',
  })
  
  const stats = ref({
    total_income: 0,
    total_expense: 0,
    net_profit: 0,
    today_count: 0,
  })
  
  const categories = ref([
    'Sotuvdan tushum',
    'Xom-ashyo xarajatlari',
    'Ish haqi',
    'Kommunal to\'lovlar',
    'Transport',
    'Boshqa',
  ])
  
  const transactions = ref([])
  const loading = ref(false)
  const showModal = ref(false)
  const showDetailsModal = ref(false)
  const selectedTransaction = ref(null)
  
  const pagination = usePagination(
    (params) => financeStore.fetchTransactions({ ...filters, ...params }),
    1,
    20
  )
  
  const { currentPage, total, hasNext, hasPrev, from, to } = pagination
  
  const hasActiveFilters = computed(() => {
    return filters.search || filters.type || filters.category || filters.date_from || filters.date_to
  })
  
  const debouncedFetch = createDebounce(fetchTransactions, 500)
  
  onMounted(async () => {
    await fetchTransactions()
    await fetchStats()
  })
  
  async function fetchTransactions() {
    loading.value = true
    try {
      await pagination.fetch(filters)
      transactions.value = financeStore.transactions
    } catch (error) {
      notifications.apiError(error)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchStats() {
    try {
      const data = await financeStore.fetchStats(filters)
      stats.value = data
    } catch (error) {
      console.error('Stats error:', error)
    }
  }
  
  function clearFilters() {
    Object.keys(filters).forEach(key => filters[key] = '')
    fetchTransactions()
  }
  
  function openCreateModal() {
    selectedTransaction.value = null
    showModal.value = true
  }
  
  function closeModal() {
    showModal.value = false
    selectedTransaction.value = null
  }
  
  function viewTransaction(transaction) {
    selectedTransaction.value = transaction
    showDetailsModal.value = true
  }
  
  function editTransaction(transaction) {
    if (!can('UPDATE_TRANSACTION')) {
      notifications.error('Ruxsat yo\'q')
      return
    }
    selectedTransaction.value = transaction
    showModal.value = true
  }
  
  async function deleteTransaction(transaction) {
    if (!can('DELETE_TRANSACTION')) {
      notifications.error('Ruxsat yo\'q')
      return
    }
  
    if (!confirm('Tranzaksiyani o\'chirishga ishonchingiz komilmi?')) return
  
    try {
      await financeStore.deleteTransaction(transaction.id)
      notifications.success('Tranzaksiya o\'chirildi')
      await fetchTransactions()
      await fetchStats()
    } catch (error) {
      notifications.apiError(error)
    }
  }
  
  function handleSaved() {
    closeModal()
    fetchTransactions()
    fetchStats()
  }
  
  function getTypeClass(type) {
    const classes = {
      income: 'bg-success-100 text-success-800',
      expense: 'bg-danger-100 text-danger-800',
      transfer: 'bg-primary-100 text-primary-800',
    }
    return classes[type] || 'bg-gray-100 text-gray-800'
  }
  
  function getTypeLabel(type) {
    const labels = {
      income: 'Kirim',
      expense: 'Chiqim',
      transfer: 'Transfer',
    }
    return labels[type] || type
  }
  
  function canEdit(transaction) {
    return can('UPDATE_TRANSACTION') && transaction.status !== 'approved'
  }
  
  function canDelete(transaction) {
    return can('DELETE_TRANSACTION') && transaction.status !== 'approved'
  }
  
  function nextPage() {
    pagination.next()
    transactions.value = financeStore.transactions
  }
  
  function prevPage() {
    pagination.prev()
    transactions.value = financeStore.transactions
  }
  
  function exportToExcel() {
    const data = transactions.value.map(t => ({
      'Sana': formatDate(t.date),
      'Turi': getTypeLabel(t.type),
      'Kategoriya': t.category,
      'Tavsif': t.description,
      'To\'lov usuli': t.payment_method,
      'Summa': t.amount,
    }))
    exportExcel(data, 'tranzaksiyalar.xlsx')
    notifications.success('Excel faylga eksport qilindi')
  }
  
  function exportToPDF() {
    const columns = [
      { header: 'Sana', key: 'date' },
      { header: 'Turi', key: 'type' },
      { header: 'Kategoriya', key: 'category' },
      { header: 'Summa', key: 'amount' },
    ]
    exportPdf(transactions.value, columns, 'tranzaksiyalar.pdf', 'Tranzaksiyalar')
    notifications.success('PDF faylga eksport qilindi')
  }
  </script>