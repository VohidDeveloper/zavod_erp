<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Qabul qilish</h1>
        <p class="text-gray-600 mt-1">Xom-ashyo qabul qilish va ro'yxatga olish</p>
      </div>
      <button
        v-if="can('CREATE_RECEIPT')"
        @click="openCreateModal"
        class="btn-primary flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Yangi qabul
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Bugun</p>
            <p class="text-2xl font-bold text-primary-600 mt-2">
              {{ stats.today_count }}
            </p>
          </div>
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-xs text-gray-500">
          Bugungi qabullar soni
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Bu hafta</p>
            <p class="text-2xl font-bold text-success-600 mt-2">
              {{ stats.week_count }}
            </p>
          </div>
          <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-xs text-gray-500">
          Bu haftalik qabullar
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Bu oy</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">
              {{ stats.month_count }}
            </p>
          </div>
          <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-xs text-gray-500">
          Oylik qabullar soni
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Jami summa (oy)</p>
            <p class="text-2xl font-bold text-warning-600 mt-2">
              {{ formatCurrency(stats.month_total) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-xs text-gray-500">
          Bu oylik umumiy xarajat
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Qidirish..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @input="debouncedFetch"
          />
        </div>

        <div>
          <select
            v-model="filters.supplier_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="fetchReceipts"
          >
            <option value="">Barcha yetkazib beruvchilar</option>
            <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
              {{ supplier.name }}
            </option>
          </select>
        </div>

        <div>
          <select
            v-model="filters.raw_material_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="fetchReceipts"
          >
            <option value="">Barcha xom-ashyolar</option>
            <option v-for="material in rawMaterials" :key="material.id" :value="material.id">
              {{ material.name }}
            </option>
          </select>
        </div>

        <div>
          <input
            v-model="filters.date_from"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="fetchReceipts"
          />
        </div>

        <div>
          <input
            v-model="filters.date_to"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="fetchReceipts"
          />
        </div>

        <div>
          <select
            v-model="filters.sort"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="fetchReceipts"
          >
            <option value="-created_at">Eng yangi</option>
            <option value="created_at">Eng eski</option>
            <option value="-total_price">Narx (Yuqori)</option>
            <option value="total_price">Narx (Past)</option>
          </select>
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
          <button
            @click="exportToExcel"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </button>
          <button
            @click="exportToPDF"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            PDF
          </button>
          <button
            @click="printReceipts"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Chop etish
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
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yetkazib beruvchi
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Xom-ashyo
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Miqdor
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Narx
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jami
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partiya
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sana
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amallar
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="9" class="px-6 py-8 text-center">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="text-gray-600">Yuklanmoqda...</span>
                </div>
              </td>
            </tr>

            <tr v-else-if="!receipts.length">
              <td colspan="9" class="px-6 py-8 text-center">
                <div class="flex flex-col items-center">
                  <svg class="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-gray-500">Ma'lumot topilmadi</p>
                </div>
              </td>
            </tr>

            <tr
              v-else
              v-for="receipt in receipts"
              :key="receipt.id"
              class="hover:bg-gray-50 transition-colors cursor-pointer"
              @click="viewReceipt(receipt)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-primary-600">#{{ receipt.id }}</span>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ receipt.supplier?.name }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatPhone(receipt.supplier?.phone) }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ receipt.raw_material?.name }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ receipt.raw_material?.code }}</p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <span class="text-sm font-medium text-gray-900">
                  {{ formatNumber(receipt.quantity) }} {{ receipt.unit }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                {{ formatCurrency(receipt.unit_price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <span class="text-sm font-semibold text-gray-900">
                  {{ formatCurrency(receipt.total_price) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {{ receipt.batch_number }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <p class="text-sm text-gray-900">{{ formatDate(receipt.created_at) }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatTime(receipt.created_at) }}</p>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click.stop="viewReceipt(receipt)"
                    class="text-primary-600 hover:text-primary-900 transition-colors"
                    title="Ko'rish"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    v-if="can('UPDATE_RECEIPT')"
                    @click.stop="editReceipt(receipt)"
                    class="text-warning-600 hover:text-warning-900 transition-colors"
                    title="Tahrirlash"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click.stop="printReceipt(receipt)"
                    class="text-gray-600 hover:text-gray-900 transition-colors"
                    title="Chop etish"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </button>
                  <button
                    v-if="can('DELETE_RECEIPT')"
                    @click.stop="deleteReceipt(receipt)"
                    class="text-danger-600 hover:text-danger-900 transition-colors"
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
          <div class="flex items-center gap-2">
            <button
              @click="prevPage"
              :disabled="!hasPrev"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span class="px-4 py-2 text-sm text-gray-700">
              Sahifa {{ currentPage }} / {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="!hasNext"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ReceiptModal
      v-if="showModal"
      :receipt="selectedReceipt"
      @close="closeModal"
      @saved="handleSaved"
    />

    <!-- View Details Modal -->
    <ReceiptDetailsModal
      v-if="showDetailsModal"
      :receipt="selectedReceipt"
      @close="showDetailsModal = false"
      @edit="editReceipt"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useWarehouseStore } from '@/stores/warehouse'
import { useCommonStore } from '@/stores/common'
import { useNotifications } from '@/composables/useNotifications'
import { usePermissions } from '@/composables/usePermissions'
import { usePagination } from '@/composables/usePagination'
import { formatNumber, formatCurrency, formatDate, formatTime, formatPhone } from '@/utils/formatters'
import { createDebounce } from '@/utils/helpers'
import { exportToExcel as exportExcel, exportToPDF as exportPdf, printElement } from '@/utils/exportUtils'
import ReceiptModal from '@/components/warehouse/modals/ReceiptModal.vue'
import ReceiptDetailsModal from '@/components/warehouse/modals/ReceiptDetailsModal.vue'

const warehouseStore = useWarehouseStore()
const commonStore = useCommonStore()
const notifications = useNotifications()
const { can } = usePermissions()

const filters = reactive({
  search: '',
  supplier_id: '',
  raw_material_id: '',
  date_from: '',
  date_to: '',
  sort: '-created_at',
})

const stats = ref({
  today_count: 0,
  week_count: 0,
  month_count: 0,
  month_total: 0,
})

const receipts = ref([])
const suppliers = ref([])
const rawMaterials = ref([])
const loading = ref(false)
const showModal = ref(false)
const showDetailsModal = ref(false)
const selectedReceipt = ref(null)

const pagination = usePagination(
  (params) => warehouseStore.fetchReceipts({ ...filters, ...params }),
  1,
  20
)

const { currentPage, total, totalPages, hasNext, hasPrev, from, to } = pagination

const hasActiveFilters = computed(() => {
  return filters.search || filters.supplier_id || filters.raw_material_id || 
         filters.date_from || filters.date_to
})

const debouncedFetch = createDebounce(fetchReceipts, 500)

onMounted(async () => {
  await Promise.all([
    fetchReceipts(),
    fetchSuppliers(),
    fetchRawMaterials(),
    fetchStats(),
  ])
})

async function fetchReceipts() {
  loading.value = true
  try {
    await pagination.fetch(filters)
    receipts.value = warehouseStore.receipts
  } catch (error) {
    notifications.apiError(error)
  } finally {
    loading.value = false
  }
}

async function fetchSuppliers() {
  try {
    await commonStore.fetchSuppliers()
    suppliers.value = commonStore.suppliers
  } catch (error) {
    console.error('Suppliers error:', error)
  }
}

async function fetchRawMaterials() {
  try {
    await commonStore.fetchRawMaterials()
    rawMaterials.value = commonStore.rawMaterials
  } catch (error) {
    console.error('Raw materials error:', error)
  }
}

async function fetchStats() {
  try {
    const data = await warehouseStore.fetchStats()
    stats.value = {
      today_count: data.today_receipts || 0,
      week_count: data.week_receipts || 0,
      month_count: data.month_receipts || 0,
      month_total: data.month_receipts_total || 0,
    }
  } catch (error) {
    console.error('Stats error:', error)
  }
}

function clearFilters() {
  Object.keys(filters).forEach(key => {
    if (key !== 'sort') filters[key] = ''
  })
  fetchReceipts()
}

function openCreateModal() {
  selectedReceipt.value = null
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedReceipt.value = null
}

function viewReceipt(receipt) {
  selectedReceipt.value = receipt
  showDetailsModal.value = true
}

function editReceipt(receipt) {
  if (!can('UPDATE_RECEIPT')) {
    notifications.error('Ruxsat yo\'q')
    return
  }
  selectedReceipt.value = receipt
  showDetailsModal.value = false
  showModal.value = true
}

async function deleteReceipt(receipt) {
  if (!can('DELETE_RECEIPT')) {
    notifications.error('Ruxsat yo\'q')
    return
  }

  if (!confirm('Qabulni o\'chirishga ishonchingiz komilmi?')) return

  try {
    await warehouseStore.deleteReceipt(receipt.id)
    notifications.success('Qabul o\'chirildi')
    await fetchReceipts()
    await fetchStats()
  } catch (error) {
    notifications.apiError(error)
  }
}

function printReceipt(receipt) {
  console.log('Print receipt:', receipt)
  // TODO: Implement print functionality
}

function handleSaved() {
  closeModal()
  fetchReceipts()
  fetchStats()
}

function nextPage() {
  pagination.next()
  receipts.value = warehouseStore.receipts
}

function prevPage() {
  pagination.prev()
  receipts.value = warehouseStore.receipts
}

function exportToExcel() {
  const data = receipts.value.map(r => ({
    'ID': r.id,
    'Yetkazib beruvchi': r.supplier?.name,
    'Xom-ashyo': r.raw_material?.name,
    'Miqdor': r.quantity,
    'O\'lchov': r.unit,
    'Narx': r.unit_price,
    'Jami': r.total_price,
    'Partiya': r.batch_number,
    'Sana': formatDate(r.created_at),
  }))
  exportExcel(data, 'qabullar.xlsx')
  notifications.success('Excel faylga eksport qilindi')
}

function exportToPDF() {
  const columns = [
    { header: 'ID', key: 'id' },
    { header: 'Yetkazib beruvchi', key: 'supplier' },
    { header: 'Xom-ashyo', key: 'raw_material' },
    { header: 'Miqdor', key: 'quantity' },
    { header: 'Jami', key: 'total_price' },
  ]
  const data = receipts.value.map(r => ({
    id: r.id,
    supplier: r.supplier?.name,
    raw_material: r.raw_material?.name,
    quantity: `${r.quantity} ${r.unit}`,
    total_price: formatCurrency(r.total_price),
  }))
  exportPdf(data, columns, 'qabullar.pdf', 'Qabullar ro\'yxati')
  notifications.success('PDF faylga eksport qilindi')
}

function printReceipts() {
  printElement('receipts-table')
}
</script>