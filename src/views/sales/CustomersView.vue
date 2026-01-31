<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mijozlar</h1>
        <p class="text-gray-600 mt-1">Mijozlar ro'yxati va boshqaruv</p>
      </div>
      <button
        v-if="can('CREATE_CUSTOMER')"
        @click="openCreateModal"
        class="btn-primary flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Yangi mijoz
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Jami mijozlar</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Faol mijozlar</p>
            <p class="text-2xl font-bold text-success-600 mt-2">{{ stats.active }}</p>
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
            <p class="text-sm text-gray-600">Bu oy yangi</p>
            <p class="text-2xl font-bold text-primary-600 mt-2">{{ stats.new_this_month }}</p>
          </div>
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Jami savdo</p>
            <p class="text-2xl font-bold text-warning-600 mt-2">
              {{ formatCurrency(stats.total_sales) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Qidirish (ism, telefon, kompaniya)..."
          class="input"
          @input="debouncedFetch"
        />
        <select v-model="filters.status" class="input" @change="fetchCustomers">
          <option value="">Barcha holatlar</option>
          <option value="active">Faol</option>
          <option value="inactive">Faol emas</option>
        </select>
        <select v-model="filters.type" class="input" @change="fetchCustomers">
          <option value="">Barcha turlar</option>
          <option value="individual">Jismoniy shaxs</option>
          <option value="company">Yuridik shaxs</option>
        </select>
        <select v-model="filters.sort" class="input" @change="fetchCustomers">
          <option value="-created_at">Eng yangi</option>
          <option value="company_name">Nomi (A-Z)</option>
          <option value="-total_orders">Ko'p buyurtma</option>
          <option value="-total_amount">Ko'p xarid</option>
        </select>
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Tozalash
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mijoz</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aloqa</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turi</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Buyurtmalar</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jami savdo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ro'yxatdan o'tgan</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="8" class="px-6 py-8 text-center">
              <div class="flex items-center justify-center">
                <svg class="animate-spin h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-gray-600">Yuklanmoqda...</span>
              </div>
            </td>
          </tr>

          <tr v-else-if="!customers.length">
            <td colspan="8" class="px-6 py-12 text-center">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p class="text-gray-500">Mijozlar topilmadi</p>
            </td>
          </tr>

          <tr
            v-else
            v-for="customer in customers"
            :key="customer.id"
            class="hover:bg-gray-50 transition-colors cursor-pointer"
            @click="viewCustomer(customer)"
          >
            <td class="px-6 py-4">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-primary-600 font-semibold text-sm">
                    {{ getInitials(customer) }}
                  </span>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">
                    {{ customer.company_name || formatCustomerName(customer) }}
                  </p>
                  <p v-if="customer.company_name" class="text-xs text-gray-500 mt-1">
                    {{ formatCustomerName(customer) }}
                  </p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm">
                <p class="text-gray-900">{{ formatPhone(customer.phone) }}</p>
                <p v-if="customer.email" class="text-gray-500 mt-1">{{ customer.email }}</p>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-medium rounded-full" 
                    :class="customer.type === 'company' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'">
                {{ customer.type === 'company' ? 'Yuridik' : 'Jismoniy' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
              {{ customer.total_orders || 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
              {{ formatCurrency(customer.total_amount || 0) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="customer.status === 'active' ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'">
                {{ customer.status === 'active' ? 'Faol' : 'Faol emas' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ formatDate(customer.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end gap-2">
                <button
                  @click.stop="viewCustomer(customer)"
                  class="text-primary-600 hover:text-primary-900"
                  title="Ko'rish"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  v-if="can('UPDATE_CUSTOMER')"
                  @click.stop="editCustomer(customer)"
                  class="text-warning-600 hover:text-warning-900"
                  title="Tahrirlash"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="can('DELETE_CUSTOMER')"
                  @click.stop="deleteCustomer(customer)"
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
    <CustomerModal
      v-if="showModal"
      :customer="selectedCustomer"
      @close="closeModal"
      @saved="handleSaved"
    />

    <CustomerDetailsModal
      v-if="showDetailsModal"
      :customer="selectedCustomer"
      @close="showDetailsModal = false"
      @edit="editCustomer"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useSalesStore } from '@/stores/sales'
import { useNotifications } from '@/composables/useNotifications'
import { usePermissions } from '@/composables/usePermissions'
import { usePagination } from '@/composables/usePagination'
import { formatCurrency, formatPhone, formatDate, formatCustomerName } from '@/utils/formatters'
import { createDebounce } from '@/utils/helpers'
import CustomerModal from '@/components/sales/modals/CustomerModal.vue'
import CustomerDetailsModal from '@/components/sales/modals/CustomerDetailsModal.vue'

const salesStore = useSalesStore()
const notifications = useNotifications()
const { can } = usePermissions()

const filters = reactive({
  search: '',
  status: '',
  type: '',
  sort: '-created_at',
})

const stats = ref({
  total: 0,
  active: 0,
  new_this_month: 0,
  total_sales: 0,
})

const customers = ref([])
const loading = ref(false)
const showModal = ref(false)
const showDetailsModal = ref(false)
const selectedCustomer = ref(null)

const pagination = usePagination(
  (params) => salesStore.fetchCustomers({ ...filters, ...params }),
  1,
  20
)

const { currentPage, total, hasNext, hasPrev, from, to } = pagination

const hasActiveFilters = computed(() => {
  return filters.search || filters.status || filters.type
})

const debouncedFetch = createDebounce(fetchCustomers, 500)

onMounted(async () => {
  await fetchCustomers()
  await fetchStats()
})

async function fetchCustomers() {
  loading.value = true
  try {
    await pagination.fetch(filters)
    customers.value = salesStore.customers
  } catch (error) {
    notifications.apiError(error)
  } finally {
    loading.value = false
  }
}

async function fetchStats() {
  try {
    const data = await salesStore.fetchStats()
    stats.value = {
      total: data.total_customers || 0,
      active: data.active_customers || 0,
      new_this_month: data.new_customers_month || 0,
      total_sales: data.total_sales || 0,
    }
  } catch (error) {
    console.error('Stats error:', error)
  }
}

function clearFilters() {
  Object.keys(filters).forEach(key => {
    if (key !== 'sort') filters[key] = ''
  })
  fetchCustomers()
}

function openCreateModal() {
  selectedCustomer.value = null
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedCustomer.value = null
}

function viewCustomer(customer) {
  selectedCustomer.value = customer
  showDetailsModal.value = true
}

function editCustomer(customer) {
  selectedCustomer.value = customer
  showDetailsModal.value = false
  showModal.value = true
}

async function deleteCustomer(customer) {
  if (!confirm('Mijozni o\'chirishga ishonchingiz komilmi?')) return

  try {
    await salesStore.deleteCustomer(customer.id)
    notifications.success('Mijoz o\'chirildi')
    await fetchCustomers()
    await fetchStats()
  } catch (error) {
    notifications.apiError(error)
  }
}

function handleSaved() {
  closeModal()
  fetchCustomers()
  fetchStats()
}

function getInitials(customer) {
  if (customer.company_name) {
    return customer.company_name.substring(0, 2).toUpperCase()
  }
  const first = customer.first_name?.charAt(0) || ''
  const last = customer.last_name?.charAt(0) || ''
  return (first + last).toUpperCase() || 'M'
}

function nextPage() {
  pagination.next()
  customers.value = salesStore.customers
}

function prevPage() {
  pagination.prev()
  customers.value = salesStore.customers
}
</script>