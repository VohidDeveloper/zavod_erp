<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">To'lovlar</h1>
          <p class="text-gray-600 mt-1">Mijozlardan to'lovlar tarixi</p>
        </div>
        <button
          v-if="can('CREATE_PAYMENT')"
          @click="openCreateModal"
          class="btn-primary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Yangi to'lov
        </button>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jami to'lovlar</p>
              <p class="text-2xl font-bold text-success-600 mt-2">
                {{ formatCurrency(stats.total) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 text-xs text-gray-500">
            {{ stats.total_count }} ta to'lov
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Bu oy</p>
              <p class="text-2xl font-bold text-primary-600 mt-2">
                {{ formatCurrency(stats.this_month) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 text-xs text-gray-500">
            {{ stats.month_count }} ta to'lov
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Naqd</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">
                {{ formatCurrency(stats.cash) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 text-xs text-gray-500">
            {{ Math.round((stats.cash / stats.total) * 100) }}% jami to'lovdan
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Plastik/O'tkazma</p>
              <p class="text-2xl font-bold text-warning-600 mt-2">
                {{ formatCurrency(stats.card) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 text-xs text-gray-500">
            {{ Math.round((stats.card / stats.total) * 100) }}% jami to'lovdan
          </div>
        </div>
      </div>
  
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Qidirish..."
            class="input"
            @input="debouncedFetch"
          />
          <select v-model="filters.payment_method" class="input" @change="fetchPayments">
            <option value="">Barcha usullar</option>
            <option value="cash">Naqd</option>
            <option value="card">Plastik karta</option>
            <option value="transfer">Bank o'tkazmasi</option>
          </select>
          <input v-model="filters.date_from" type="date" class="input" @change="fetchPayments" />
          <input v-model="filters.date_to" type="date" class="input" @change="fetchPayments" />
          <select v-model="filters.sort" class="input" @change="fetchPayments">
            <option value="-created_at">Eng yangi</option>
            <option value="created_at">Eng eski</option>
            <option value="-amount">Summa (yuqori)</option>
            <option value="amount">Summa (past)</option>
          </select>
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
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sana va vaqt
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mijoz
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Buyurtma
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Summa
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                To'lov usuli
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Izoh
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="7" class="px-6 py-8 text-center">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="text-gray-600">Yuklanmoqda...</span>
                </div>
              </td>
            </tr>
  
            <tr v-else-if="!payments.length">
              <td colspan="7" class="px-6 py-12 text-center">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p class="text-gray-500">To'lovlar topilmadi</p>
              </td>
            </tr>
  
            <tr
              v-else
              v-for="payment in payments"
              :key="payment.id"
              class="hover:bg-gray-50 transition-colors cursor-pointer"
              @click="viewPayment(payment)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ formatDate(payment.created_at) }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatTime(payment.created_at) }}
                  </p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ payment.customer?.company_name || formatCustomerName(payment.customer) }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatPhone(payment.customer?.phone) }}
                  </p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-primary-600 font-medium">
                  #{{ payment.order?.order_number }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <span class="text-sm font-bold text-success-600">
                  {{ formatCurrency(payment.amount) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getPaymentMethodClass(payment.payment_method)"
                >
                  {{ formatPaymentMethod(payment.payment_method) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-600 truncate max-w-xs">
                  {{ payment.notes || '-' }}
                </p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click.stop="viewPayment(payment)"
                    class="text-primary-600 hover:text-primary-900"
                    title="Ko'rish"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click.stop="printReceipt(payment)"
                    class="text-gray-600 hover:text-gray-900"
                    title="Chek chiqarish"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
  
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
  
      <!-- Modals -->
      <PaymentModal
        v-if="showModal"
        :payment="selectedPayment"
        @close="closeModal"
        @saved="handleSaved"
      />
  
      <PaymentDetailsModal
        v-if="showDetailsModal"
        :payment="selectedPayment"
        @close="showDetailsModal = false"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useSalesStore } from '@/stores/sales'
  import { usePermissions } from '@/composables/usePermissions'
  import { useNotifications } from '@/composables/useNotifications'
  import { usePagination } from '@/composables/usePagination'
  import {
    formatCurrency,
    formatDate,
    formatTime,
    formatPhone,
    formatCustomerName,
  } from '@/utils/formatters'
  import { createDebounce } from '@/utils/helpers'
  import { exportToExcel as exportExcel, exportToPDF as exportPdf } from '@/utils/exportUtils'
  import PaymentModal from '@/components/sales/modals/PaymentModal.vue'
  import PaymentDetailsModal from '@/components/sales/modals/PaymentDetailsModal.vue'
  
  const salesStore = useSalesStore()
  const { can } = usePermissions()
  const notifications = useNotifications()
  
  const filters = reactive({
    search: '',
    payment_method: '',
    date_from: '',
    date_to: '',
    sort: '-created_at',
  })
  
  const stats = ref({
    total: 0,
    total_count: 0,
    this_month: 0,
    month_count: 0,
    cash: 0,
    card: 0,
  })
  
  const payments = ref([])
  const loading = ref(false)
  const showModal = ref(false)
  const showDetailsModal = ref(false)
  const selectedPayment = ref(null)
  
  const pagination = usePagination(
    (params) => salesStore.fetchPayments({ ...filters, ...params }),
    1,
    20
  )
  
  const { currentPage, total, hasNext, hasPrev, from, to } = pagination
  
  const hasActiveFilters = computed(() => {
    return filters.search || filters.payment_method || filters.date_from || filters.date_to
  })
  
  const debouncedFetch = createDebounce(fetchPayments, 500)
  
  onMounted(async () => {
    await fetchPayments()
    await fetchStats()
  })
  
  async function fetchPayments() {
    loading.value = true
    try {
      await pagination.fetch(filters)
      payments.value = salesStore.payments
    } catch (error) {
      notifications.apiError(error)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchStats() {
    try {
      const data = await salesStore.fetchPaymentStats()
      stats.value = {
        total: data.total_amount || 0,
        total_count: data.total_count || 0,
        this_month: data.month_amount || 0,
        month_count: data.month_count || 0,
        cash: data.cash_amount || 0,
        card: data.card_amount || 0,
      }
    } catch (error) {
      console.error('Stats error:', error)
    }
  }
  
  function clearFilters() {
    Object.keys(filters).forEach(key => {
      if (key !== 'sort') filters[key] = ''
    })
    fetchPayments()
  }
  
  function openCreateModal() {
    selectedPayment.value = null
    showModal.value = true
  }
  
  function closeModal() {
    showModal.value = false
    selectedPayment.value = null
  }
  
  function viewPayment(payment) {
    selectedPayment.value = payment
    showDetailsModal.value = true
  }
  
  function printReceipt(payment) {
    console.log('Print receipt for payment:', payment)
    // TODO: Implement receipt printing
  }
  
  function handleSaved() {
    closeModal()
    fetchPayments()
    fetchStats()
  }
  
  function formatPaymentMethod(method) {
    const methods = {
      cash: 'Naqd',
      card: 'Plastik karta',
      transfer: 'O\'tkazma',
    }
    return methods[method] || method
  }
  
  function getPaymentMethodClass(method) {
    const classes = {
      cash: 'bg-success-100 text-success-800',
      card: 'bg-primary-100 text-primary-800',
      transfer: 'bg-warning-100 text-warning-800',
    }
    return classes[method] || 'bg-gray-100 text-gray-800'
  }
  
  function nextPage() {
    pagination.next()
    payments.value = salesStore.payments
  }
  
  function prevPage() {
    pagination.prev()
    payments.value = salesStore.payments
  }
  
  function exportToExcel() {
    const data = payments.value.map(p => ({
      'Sana': formatDate(p.created_at),
      'Vaqt': formatTime(p.created_at),
      'Mijoz': p.customer?.company_name || formatCustomerName(p.customer),
      'Buyurtma': p.order?.order_number,
      'Summa': p.amount,
      'Usul': formatPaymentMethod(p.payment_method),
      'Izoh': p.notes || '',
    }))
    exportExcel(data, 'tolovlar.xlsx')
    notifications.success('Excel faylga eksport qilindi')
  }
  
  function exportToPDF() {
    const columns = [
      { header: 'Sana', key: 'date' },
      { header: 'Mijoz', key: 'customer' },
      { header: 'Summa', key: 'amount' },
      { header: 'Usul', key: 'method' },
    ]
    const data = payments.value.map(p => ({
      date: formatDate(p.created_at),
      customer: p.customer?.company_name || formatCustomerName(p.customer),
      amount: formatCurrency(p.amount),
      method: formatPaymentMethod(p.payment_method),
    }))
    exportPdf(data, columns, 'tolovlar.pdf', 'To\'lovlar tarixi')
    notifications.success('PDF faylga eksport qilindi')
  }
  </script>