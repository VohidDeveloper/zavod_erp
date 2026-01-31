<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Hisob-fakturalar</h1>
          <p class="text-gray-600 mt-1">Hisob-fakturalarni boshqarish va kuzatuv</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="exportInvoices"
            class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            <ArrowDownTrayIcon class="w-5 h-5 inline mr-2" />
            Eksport
          </button>
          <button
            @click="$router.push({ name: 'finance-invoices-create' })"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Yangi hisob-faktura
          </button>
        </div>
      </div>
  
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Jami"
          :value="stats.total"
          icon="DocumentTextIcon"
          color="blue"
        />
        <StatCard
          title="To'lanmagan"
          :value="formatCurrency(stats.unpaidAmount)"
          icon="ExclamationTriangleIcon"
          color="orange"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">{{ stats.unpaidCount }} ta</p>
          </template>
        </StatCard>
        <StatCard
          title="To'langan"
          :value="formatCurrency(stats.paidAmount)"
          icon="CheckCircleIcon"
          color="green"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">{{ stats.paidCount }} ta</p>
          </template>
        </StatCard>
        <StatCard
          title="Qisman to'langan"
          :value="stats.partialCount"
          icon="ClockIcon"
          color="purple"
        />
        <StatCard
          title="Muddati o'tgan"
          :value="stats.overdueCount"
          icon="XCircleIcon"
          color="red"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              {{ formatCurrency(stats.overdueAmount) }}
            </p>
          </template>
        </StatCard>
      </div>
  
      <!-- Filters -->
      <BaseCard>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Raqam, mijoz qidirish..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
          </div>
  
          <!-- Status Filter -->
          <div>
            <select
              v-model="filters.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Barcha holatlar</option>
              <option value="draft">Qoralama</option>
              <option value="sent">Yuborilgan</option>
              <option value="paid">To'langan</option>
              <option value="partial">Qisman</option>
              <option value="overdue">Muddati o'tgan</option>
              <option value="cancelled">Bekor qilingan</option>
            </select>
          </div>
  
          <!-- Date Range -->
          <div>
            <select
              v-model="filters.dateRange"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">Barcha davr</option>
              <option value="today">Bugun</option>
              <option value="week">Bu hafta</option>
              <option value="month">Bu oy</option>
              <option value="quarter">Chorak</option>
            </select>
          </div>
  
          <!-- Customer Filter -->
          <div>
            <select
              v-model="filters.customerId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Barcha mijozlar</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.name }}
              </option>
            </select>
          </div>
        </div>
  
        <!-- Active Filters -->
        <div v-if="activeFiltersCount > 0" class="flex items-center space-x-2 mt-4">
          <span class="text-sm text-gray-600">Filtrlar:</span>
          <div class="flex flex-wrap gap-2">
            <Badge
              v-if="filters.status"
              color="blue"
              @click="filters.status = ''"
              class="cursor-pointer"
            >
              {{ getStatusText(filters.status) }} ×
            </Badge>
            <Badge
              v-if="filters.customerId"
              color="purple"
              @click="filters.customerId = ''"
              class="cursor-pointer"
            >
              {{ getCustomerName(filters.customerId) }} ×
            </Badge>
            <button
              @click="clearFilters"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              Tozalash
            </button>
          </div>
        </div>
      </BaseCard>
  
      <!-- Invoices Table -->
      <BaseCard>
        <DataTable
          :data="paginatedInvoices"
          :columns="tableColumns"
          :loading="loading"
          @sort="handleSort"
        >
          <template #invoiceNumber="{ row }">
            <div>
              <p class="font-medium text-blue-600 hover:text-blue-700 cursor-pointer" @click="viewInvoice(row)">
                #{{ row.invoiceNumber }}
              </p>
              <p class="text-xs text-gray-600">{{ row.date }}</p>
            </div>
          </template>
  
          <template #customer="{ row }">
            <div>
              <p class="font-medium text-gray-900">{{ row.customer.name }}</p>
              <p class="text-xs text-gray-600">{{ row.customer.phone }}</p>
            </div>
          </template>
  
          <template #amount="{ row }">
            <div class="text-right">
              <p class="font-semibold text-gray-900">{{ formatCurrency(row.amount) }}</p>
              <p v-if="row.status === 'partial'" class="text-xs text-orange-600">
                {{ formatCurrency(row.paidAmount) }} to'langan
              </p>
            </div>
          </template>
  
          <template #status="{ row }">
            <Badge :color="getStatusColor(row.status)">
              {{ getStatusText(row.status) }}
            </Badge>
          </template>
  
          <template #dueDate="{ row }">
            <div :class="[
              'text-sm',
              row.isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'
            ]">
              {{ row.dueDate }}
              <p v-if="row.isOverdue" class="text-xs text-red-600">
                {{ row.overdueDays }} kun kechikkan
              </p>
            </div>
          </template>
  
          <template #actions="{ row }">
            <div class="flex items-center space-x-2">
              <button
                @click="viewInvoice(row)"
                class="text-blue-600 hover:text-blue-700"
                title="Ko'rish"
              >
                <EyeIcon class="w-5 h-5" />
              </button>
              <button
                v-if="row.status !== 'paid' && row.status !== 'cancelled'"
                @click="showPaymentModal(row)"
                class="text-green-600 hover:text-green-700"
                title="To'lov qabul qilish"
              >
                <CreditCardIcon class="w-5 h-5" />
              </button>
              <button
                @click="downloadInvoice(row)"
                class="text-gray-600 hover:text-gray-700"
                title="Yuklab olish"
              >
                <ArrowDownTrayIcon class="w-5 h-5" />
              </button>
              <button
                v-if="row.status === 'draft'"
                @click="sendInvoice(row)"
                class="text-purple-600 hover:text-purple-700"
                title="Yuborish"
              >
                <PaperAirplaneIcon class="w-5 h-5" />
              </button>
              <button
                @click="showMoreActions(row)"
                class="text-gray-600 hover:text-gray-700"
              >
                <EllipsisVerticalIcon class="w-5 h-5" />
              </button>
            </div>
          </template>
        </DataTable>
  
        <Pagination
          v-model="pagination.page"
          :total="pagination.total"
          :per-page="pagination.perPage"
          @change="loadInvoices"
        />
      </BaseCard>
  
      <!-- Payment Modal -->
      <Modal v-model="showPaymentModalOpen" title="To'lov qabul qilish">
        <form @submit.prevent="recordPayment" class="space-y-4">
          <div v-if="selectedInvoice">
            <div class="p-4 bg-gray-50 rounded-lg mb-4">
              <p class="text-sm text-gray-600">Hisob-faktura</p>
              <p class="text-lg font-bold text-gray-900">#{{ selectedInvoice.invoiceNumber }}</p>
              <p class="text-sm text-gray-600 mt-2">Qolgan summa</p>
              <p class="text-2xl font-bold text-orange-600">
                {{ formatCurrency(selectedInvoice.amount - selectedInvoice.paidAmount) }}
              </p>
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              To'lov summasi <span class="text-red-600">*</span>
            </label>
            <input
              v-model.number="paymentForm.amount"
              type="number"
              min="0"
              :max="selectedInvoice ? selectedInvoice.amount - selectedInvoice.paidAmount : 0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              To'lov usuli <span class="text-red-600">*</span>
            </label>
            <select
              v-model="paymentForm.method"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Tanlang</option>
              <option value="cash">Naqd</option>
              <option value="bank_transfer">Bank o'tkazmasi</option>
              <option value="card">Karta</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              To'lov sanasi
            </label>
            <input
              v-model="paymentForm.date"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Izoh
            </label>
            <textarea
              v-model="paymentForm.notes"
              rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            ></textarea>
          </div>
  
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showPaymentModalOpen = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              To'lovni qabul qilish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useFinanceStore } from '@/stores/finance'
  import {
    ArrowDownTrayIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    EyeIcon,
    CreditCardIcon,
    PaperAirplaneIcon,
    EllipsisVerticalIcon
  } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import DataTable from '@/components/common/tables/DataTable.vue'
  import Pagination from '@/components/common/navigation/Pagination.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  
  const router = useRouter()
  const financeStore = useFinanceStore()
  
  const loading = ref(false)
  const showPaymentModalOpen = ref(false)
  const selectedInvoice = ref(null)
  
  const stats = ref({
    total: 342,
    unpaidAmount: 85000000,
    unpaidCount: 45,
    paidAmount: 245000000,
    paidCount: 287,
    partialCount: 10,
    overdueCount: 8,
    overdueAmount: 12500000
  })
  
  const customers = ref([])
  const invoices = ref([])
  
  const filters = reactive({
    search: '',
    status: '',
    dateRange: 'all',
    customerId: ''
  })
  
  const pagination = reactive({
    page: 1,
    perPage: 10,
    total: 0
  })
  
  const paymentForm = reactive({
    amount: 0,
    method: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })
  
  const tableColumns = [
    { key: 'invoiceNumber', label: 'Raqam', slot: true, sortable: true },
    { key: 'customer', label: 'Mijoz', slot: true },
    { key: 'amount', label: 'Summa', slot: true, sortable: true },
    { key: 'status', label: 'Holat', slot: true },
    { key: 'dueDate', label: 'Muddat', slot: true, sortable: true },
    { key: 'actions', label: '', slot: true }
  ]
  
  const activeFiltersCount = computed(() => {
    let count = 0
    if (filters.status) count++
    if (filters.customerId) count++
    if (filters.search) count++
    return count
  })
  
  const filteredInvoices = computed(() => {
    let filtered = invoices.value
  
    if (filters.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(query) ||
        inv.customer.name.toLowerCase().includes(query)
      )
    }
  
    if (filters.status) {
      filtered = filtered.filter(inv => inv.status === filters.status)
    }
  
    if (filters.customerId) {
      filtered = filtered.filter(inv => inv.customer.id === filters.customerId)
    }
  
    return filtered
  })
  
  const paginatedInvoices = computed(() => {
    const start = (pagination.page - 1) * pagination.perPage
    const end = start + pagination.perPage
    return filteredInvoices.value.slice(start, end)
  })
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  const getStatusColor = (status) => {
    const colors = {
      draft: 'gray',
      sent: 'blue',
      paid: 'green',
      partial: 'orange',
      overdue: 'red',
      cancelled: 'red'
    }
    return colors[status] || 'gray'
  }
  
  const getStatusText = (status) => {
    const texts = {
      draft: 'Qoralama',
      sent: 'Yuborilgan',
      paid: 'To\'langan',
      partial: 'Qisman',
      overdue: 'Muddati o\'tgan',
      cancelled: 'Bekor qilingan'
    }
    return texts[status] || status
  }
  
  const getCustomerName = (id) => {
    return customers.value.find(c => c.id === id)?.name || ''
  }
  
  const clearFilters = () => {
    filters.search = ''
    filters.status = ''
    filters.dateRange = 'all'
    filters.customerId = ''
  }
  
  const viewInvoice = (invoice) => {
    router.push(`/finance/invoices/${invoice.id}`)
  }
  
  const showPaymentModal = (invoice) => {
    selectedInvoice.value = invoice
    paymentForm.amount = invoice.amount - invoice.paidAmount
    paymentForm.method = ''
    paymentForm.notes = ''
    showPaymentModalOpen.value = true
  }
  
  const recordPayment = async () => {
    try {
      await financeStore.recordPayment(selectedInvoice.value.id, paymentForm)
      showPaymentModalOpen.value = false
      loadInvoices()
    } catch (error) {
      console.error('Failed to record payment:', error)
    }
  }
  
  const downloadInvoice = async (invoice) => {
    try {
      await financeStore.downloadInvoice(invoice.id)
    } catch (error) {
      console.error('Failed to download invoice:', error)
    }
  }
  
  const sendInvoice = async (invoice) => {
    try {
      await financeStore.sendInvoice(invoice.id)
      loadInvoices()
    } catch (error) {
      console.error('Failed to send invoice:', error)
    }
  }
  
  const showMoreActions = (invoice) => {
    console.log('Show more actions for:', invoice)
  }
  
  const exportInvoices = async () => {
    try {
      await financeStore.exportInvoices({ ...filters, format: 'xlsx' })
    } catch (error) {
      console.error('Failed to export invoices:', error)
    }
  }
  
  const handleSort = (column) => {
    console.log('Sort by:', column)
  }
  
  const loadInvoices = async () => {
    loading.value = true
    try {
      const response = await financeStore.fetchInvoices({
        page: pagination.page,
        per_page: pagination.perPage,
        ...filters
      })
      invoices.value = response.data
      pagination.total = response.total
    } catch (error) {
      console.error('Failed to load invoices:', error)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(async () => {
    customers.value = (await financeStore.fetchCustomers()).data
    loadInvoices()
  })
  </script>