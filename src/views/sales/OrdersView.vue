<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Buyurtmalar</h1>
        <p class="text-gray-600 mt-1">Barcha buyurtmalarni boshqarish</p>
      </div>
      <button
        v-if="can('CREATE_ORDER')"
        @click="openCreateModal"
        class="btn-primary flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Yangi buyurtma
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Jami</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Yangi</p>
            <p class="text-2xl font-bold text-primary-600 mt-2">{{ stats.pending }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Jarayonda</p>
            <p class="text-2xl font-bold text-warning-600 mt-2">{{ stats.processing }}</p>
          </div>
          <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Yetkazilgan</p>
            <p class="text-2xl font-bold text-success-600 mt-2">{{ stats.delivered }}</p>
          </div>
          <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Jami summa</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">
              {{ formatCurrency(stats.total_amount) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Qidirish..."
          class="input"
          @input="debouncedFetch"
        />
        <select v-model="filters.status" class="input" @change="fetchOrders">
          <option value="">Barcha holatlar</option>
          <option value="pending">Yangi</option>
          <option value="processing">Jarayonda</option>
          <option value="delivered">Yetkazilgan</option>
          <option value="cancelled">Bekor qilingan</option>
        </select>
        <select v-model="filters.customer_id" class="input" @change="fetchOrders">
          <option value="">Barcha mijozlar</option>
          <option v-for="customer in customers" :key="customer.id" :value="customer.id">
            {{ customer.company_name || formatCustomerName(customer) }}
          </option>
        </select>
        <input v-model="filters.date_from" type="date" class="input" @change="fetchOrders" />
        <input v-model="filters.date_to" type="date" class="input" @change="fetchOrders" />
        <select v-model="filters.sort" class="input" @change="fetchOrders">
          <option value="-created_at">Eng yangi</option>
          <option value="created_at">Eng eski</option>
          <option value="-total_amount">Narx (yuqori)</option>
          <option value="total_amount">Narx (past)</option>
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
              Buyurtma №
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Mijoz
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Mahsulotlar
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Summa
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Holat
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Sana
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

          <tr v-else-if="!orders.length">
            <td colspan="7" class="px-6 py-12 text-center">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p class="text-gray-500">Buyurtmalar topilmadi</p>
            </td>
          </tr>

          <tr
            v-else
            v-for="order in orders"
            :key="order.id"
            class="hover:bg-gray-50 transition-colors cursor-pointer"
            @click="viewOrder(order)"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-medium text-primary-600">#{{ order.order_number }}</span>
            </td>
            <td class="px-6 py-4">
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ order.customer?.company_name || formatCustomerName(order.customer) }}
                </p>
                <p class="text-xs text-gray-500 mt-1">{{ formatPhone(order.customer?.phone) }}</p>
              </div>
            </td>
            <td class="px-6 py-4">
              <div>
                <p class="text-sm text-gray-900">{{ order.items_count || 0 }} ta mahsulot</p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatNumber(order.total_quantity || 0) }} dona
                </p>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
              {{ formatCurrency(order.total_amount) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getOrderStatusClass(order.status)"
              >
                {{ formatStatus(order.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div>
                <p class="text-sm text-gray-900">{{ formatDate(order.created_at) }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ formatTime(order.created_at) }}</p>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end gap-2">
                <button
                  @click.stop="viewOrder(order)"
                  class="text-primary-600 hover:text-primary-900"
                  title="Ko'rish"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  v-if="can('UPDATE_ORDER') && order.status === 'pending'"
                  @click.stop="editOrder(order)"
                  class="text-warning-600 hover:text-warning-900"
                  title="Tahrirlash"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="can('DELETE_ORDER') && order.status === 'pending'"
                  @click.stop="deleteOrder(order)"
                  class="text-danger-600 hover:text-danger-900"
                  title="Bekor qilish"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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

    <!-- Create/Edit Modal -->
    <OrderModal
      v-if="showModal"
      :order="selectedOrder"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSalesStore } from '@/stores/sales'
import { useCommonStore } from '@/stores/common'
import { usePermissions } from '@/composables/usePermissions'
import { useNotifications } from '@/composables/useNotifications'
import { usePagination } from '@/composables/usePagination'
import {
  formatCurrency,
  formatDate,
  formatTime,
  formatPhone,
  formatCustomerName,
  formatStatus,
  formatNumber,
  getOrderStatusColor,
} from '@/utils/formatters'
import { createDebounce } from '@/utils/helpers'
import { exportToExcel as exportExcel, exportToPDF as exportPdf } from '@/utils/exportUtils'
import OrderModal from '@/components/sales/modals/OrderModal.vue'

const router = useRouter()
const salesStore = useSalesStore()
const commonStore = useCommonStore()
const { can } = usePermissions()
const notifications = useNotifications()

const filters = reactive({
  search: '',
  status: '',
  customer_id: '',
  date_from: '',
  date_to: '',
  sort: '-created_at',
})

const stats = ref({
  total: 0,
  pending: 0,
  processing: 0,
  delivered: 0,
  total_amount: 0,
})

const orders = ref([])
const customers = ref([])
const loading = ref(false)
const showModal = ref(false)
const selectedOrder = ref(null)

const pagination = usePagination(
  (params) => salesStore.fetchOrders({ ...filters, ...params }),
  1,
  20
)

const { currentPage, total, hasNext, hasPrev, from, to } = pagination

const hasActiveFilters = computed(() => {
  return filters.search || filters.status || filters.customer_id || 
         filters.date_from || filters.date_to
})

const debouncedFetch = createDebounce(fetchOrders, 500)

onMounted(async () => {
  await Promise.all([
    fetchOrders(),
    fetchCustomers(),
    fetchStats(),
  ])
})

async function fetchOrders() {
  loading.value = true
  try {
    await pagination.fetch(filters)
    orders.value = salesStore.orders
  } catch (error) {
    notifications.apiError(error)
  } finally {
    loading.value = false
  }
}

async function fetchCustomers() {
  try {
    await commonStore.fetchCustomers()
    customers.value = commonStore.customers
  } catch (error) {
    console.error('Customers error:', error)
  }
}

async function fetchStats() {
  try {
    const data = await salesStore.fetchStats()
    stats.value = {
      total: data.total_orders || 0,
      pending: data.pending_orders || 0,
      processing: data.processing_orders || 0,
      delivered: data.delivered_orders || 0,
      total_amount: data.total_sales || 0,
    }
  } catch (error) {
    console.error('Stats error:', error)
  }
}

function clearFilters() {
  Object.keys(filters).forEach(key => {
    if (key !== 'sort') filters[key] = ''
  })
  fetchOrders()
}

function openCreateModal() {
  selectedOrder.value = null
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedOrder.value = null
}

function viewOrder(order) {
  router.push(`/sales/orders/${order.id}`)
}

function editOrder(order) {
  selectedOrder.value = order
  showModal.value = true
}

async function deleteOrder(order) {
  if (!confirm('Buyurtmani bekor qilishga ishonchingiz komilmi?')) return

  try {
    await salesStore.cancelOrder(order.id)
    notifications.success('Buyurtma bekor qilindi')
    await fetchOrders()
    await fetchStats()
  } catch (error) {
    notifications.apiError(error)
  }
}

function handleSaved() {
  closeModal()
  fetchOrders()
  fetchStats()
}

function getOrderStatusClass(status) {
  const color = getOrderStatusColor(status)
  return `bg-${color}-100 text-${color}-800`
}

function nextPage() {
  pagination.next()
  orders.value = salesStore.orders
}

function prevPage() {
  pagination.prev()
  orders.value = salesStore.orders
}

function exportToExcel() {
  const data = orders.value.map(o => ({
    'Buyurtma №': o.order_number,
    'Mijoz': o.customer?.company_name || formatCustomerName(o.customer),
    'Mahsulotlar': o.items_count,
    'Summa': o.total_amount,
    'Holat': formatStatus(o.status),
    'Sana': formatDate(o.created_at),
  }))
  exportExcel(data, 'buyurtmalar.xlsx')
  notifications.success('Excel faylga eksport qilindi')
}

function exportToPDF() {
  const columns = [
    { header: 'Buyurtma №', key: 'order_number' },
    { header: 'Mijoz', key: 'customer' },
    { header: 'Summa', key: 'total_amount' },
    { header: 'Holat', key: 'status' },
  ]
  const data = orders.value.map(o => ({
    order_number: o.order_number,
    customer: o.customer?.company_name || formatCustomerName(o.customer),
    total_amount: formatCurrency(o.total_amount),
    status: formatStatus(o.status),
  }))
  exportPdf(data, columns, 'buyurtmalar.pdf', 'Buyurtmalar')
  notifications.success('PDF faylga eksport qilindi')
}
</script>