<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ishlab chiqarish</h1>
          <p class="text-gray-600 mt-1">Ishlab chiqarish jarayonlari nazorati</p>
        </div>
        <div class="flex gap-2">
          <input v-model="selectedDate" type="date" class="input" @change="fetchProduction" />
          <button
            v-if="can('CREATE_PRODUCTION')"
            @click="openCreateModal"
            class="btn-primary flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Yangi ishlab chiqarish
          </button>
        </div>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div class="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-primary-100 text-sm">Jami ishlab chiqarish</p>
              <p class="text-3xl font-bold mt-2">{{ formatNumber(stats.total_production) }}</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span :class="stats.production_change >= 0 ? 'text-green-300' : 'text-red-300'" class="text-sm font-medium">
              {{ stats.production_change >= 0 ? '+' : '' }}{{ stats.production_change }}%
            </span>
            <span class="text-primary-100 text-xs ml-2">o'tgan kun bilan</span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Sifatli</p>
              <p class="text-2xl font-bold text-success-600 mt-2">{{ formatNumber(stats.quality_products) }}</p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ ((stats.quality_products / stats.total_production) * 100).toFixed(1) }}% sifat
            </span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Nuqsonli</p>
              <p class="text-2xl font-bold text-danger-600 mt-2">{{ formatNumber(stats.defective) }}</p>
            </div>
            <div class="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ ((stats.defective / stats.total_production) * 100).toFixed(1) }}% nuqson
            </span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Faol liniyalar</p>
              <p class="text-2xl font-bold text-primary-600 mt-2">{{ stats.active_lines }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ stats.total_lines }} liniyadan
            </span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Samaradorlik</p>
              <p class="text-2xl font-bold text-warning-600 mt-2">{{ stats.efficiency }}%</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div class="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-warning-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${stats.efficiency}%` }"
            ></div>
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
          <select v-model="filters.product_id" class="input" @change="fetchProduction">
            <option value="">Barcha mahsulotlar</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
          <select v-model="filters.line_id" class="input" @change="fetchProduction">
            <option value="">Barcha liniyalar</option>
            <option v-for="line in lines" :key="line.id" :value="line.id">
              {{ line.name }}
            </option>
          </select>
          <select v-model="filters.shift" class="input" @change="fetchProduction">
            <option value="">Barcha smenalar</option>
            <option value="morning">Ertalabki</option>
            <option value="afternoon">Kunduzi</option>
            <option value="night">Kechki</option>
          </select>
          <select v-model="filters.sort" class="input" @change="fetchProduction">
            <option value="-created_at">Eng yangi</option>
            <option value="-total_quantity">Miqdor (ko'p)</option>
            <option value="total_quantity">Miqdor (oz)</option>
          </select>
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Tozalash
          </button>
        </div>
        <div class="flex items-center justify-end gap-2 mt-4">
          <button @click="exportToExcel" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Excel
          </button>
          <button @click="exportToPDF" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            PDF
          </button>
        </div>
      </div>
  
      <!-- Production Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahsulot</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liniya</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Smena</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ishlab chiqarildi</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sifatli</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nuqsonli</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana/Vaqt</th>
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
  
            <tr v-else-if="!productions.length">
              <td colspan="8" class="px-6 py-12 text-center">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-gray-500">Ishlab chiqarish ma'lumotlari topilmadi</p>
              </td>
            </tr>
  
            <tr
              v-else
              v-for="production in productions"
              :key="production.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ production.product?.name }}</p>
                  <p class="text-xs text-gray-500">{{ production.product?.code }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ production.line?.name }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getShiftClass(production.shift)"
                >
                  {{ formatShift(production.shift) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right text-sm font-bold text-gray-900">
                {{ formatNumber(production.total_quantity) }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-semibold text-success-600">
                {{ formatNumber(production.quality_quantity) }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-semibold text-danger-600">
                {{ formatNumber(production.defective_quantity) }}
              </td>
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm text-gray-900">{{ formatDate(production.production_date) }}</p>
                  <p class="text-xs text-gray-500">{{ formatTime(production.created_at) }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="viewDetails(production)"
                    class="text-primary-600 hover:text-primary-900"
                    title="Ko'rish"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    v-if="can('UPDATE_PRODUCTION')"
                    @click="editProduction(production)"
                    class="text-warning-600 hover:text-warning-900"
                    title="Tahrirlash"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    v-if="can('DELETE_PRODUCTION')"
                    @click="deleteProduction(production)"
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
      <ProductionModal
        v-if="showModal"
        :production="selectedProduction"
        @close="closeModal"
        @saved="handleSaved"
      />
  
      <ProductionDetailsModal
        v-if="showDetailsModal"
        :production="selectedProduction"
        @close="showDetailsModal = false"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useProductionStore } from '@/stores/production'
  import { useCommonStore } from '@/stores/common'
  import { usePermissions } from '@/composables/usePermissions'
  import { useNotifications } from '@/composables/useNotifications'
  import { usePagination } from '@/composables/usePagination'
  import { formatNumber, formatDate, formatTime } from '@/utils/formatters'
  import { createDebounce } from '@/utils/helpers'
  import { exportToExcel as exportExcel, exportToPDF as exportPdf } from '@/utils/exportUtils'
  import ProductionModal from '@/components/production/modals/ProductionModal.vue'
  import ProductionDetailsModal from '@/components/production/modals/ProductionDetailsModal.vue'
  
  const productionStore = useProductionStore()
  const commonStore = useCommonStore()
  const { can } = usePermissions()
  const notifications = useNotifications()
  
  const selectedDate = ref(new Date().toISOString().split('T')[0])
  
  const filters = reactive({
    search: '',
    product_id: '',
    line_id: '',
    shift: '',
    sort: '-created_at',
  })
  
  const stats = ref({
    total_production: 0,
    production_change: 0,
    quality_products: 0,
    defective: 0,
    active_lines: 0,
    total_lines: 0,
    efficiency: 0,
  })
  
  const productions = ref([])
  const products = ref([])
  const lines = ref([])
  const loading = ref(false)
  const showModal = ref(false)
  const showDetailsModal = ref(false)
  const selectedProduction = ref(null)
  
  const pagination = usePagination(
    (params) => productionStore.fetchProduction({
      date: selectedDate.value,
      ...filters,
      ...params,
    }),
    1,
    20
  )
  
  const { currentPage, total, hasNext, hasPrev, from, to } = pagination
  
  const hasActiveFilters = computed(() => {
    return filters.search || filters.product_id || filters.line_id || filters.shift
  })
  
  const debouncedFetch = createDebounce(fetchProduction, 500)
  
  onMounted(async () => {
    await Promise.all([
      fetchProduction(),
      fetchProducts(),
      fetchLines(),
      fetchStats(),
    ])
  })
  
  async function fetchProduction() {
    loading.value = true
    try {
      await pagination.fetch({
        date: selectedDate.value,
        ...filters,
      })
      productions.value = productionStore.productions
    } catch (error) {
      notifications.apiError(error)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchProducts() {
    try {
      await commonStore.fetchProducts()
      products.value = commonStore.products
    } catch (error) {
      console.error('Products error:', error)
    }
  }
  
  async function fetchLines() {
    try {
      await productionStore.fetchLines()
      lines.value = productionStore.lines
    } catch (error) {
      console.error('Lines error:', error)
    }
  }
  
  async function fetchStats() {
    try {
      const data = await productionStore.fetchStats(selectedDate.value)
      stats.value = data
    } catch (error) {
      console.error('Stats error:', error)
    }
  }
  
  function clearFilters() {
    Object.keys(filters).forEach(key => {
      if (key !== 'sort') filters[key] = ''
    })
    fetchProduction()
  }
  
  function openCreateModal() {
    selectedProduction.value = null
    showModal.value = true
  }
  
  function closeModal() {
    showModal.value = false
    selectedProduction.value = null
  }
  
  function viewDetails(production) {
    selectedProduction.value = production
    showDetailsModal.value = true
  }
  
  function editProduction(production) {
    selectedProduction.value = production
    showModal.value = true
  }
  
  async function deleteProduction(production) {
    if (!confirm('Ishlab chiqarish ma\'lumotini o\'chirishga ishonchingiz komilmi?')) return
  
    try {
      await productionStore.deleteProduction(production.id)
      notifications.success('Ishlab chiqarish ma\'lumoti o\'chirildi')
      await fetchProduction()
      await fetchStats()
    } catch (error) {
      notifications.apiError(error)
    }
  }
  
  function handleSaved() {
    closeModal()
    fetchProduction()
    fetchStats()
  }
  
  function formatShift(shift) {
    const shifts = {
      morning: 'Ertalabki',
      afternoon: 'Kunduzi',
      night: 'Kechki',
    }
    return shifts[shift] || shift
  }
  
  function getShiftClass(shift) {
    const classes = {
      morning: 'bg-warning-100 text-warning-800',
      afternoon: 'bg-primary-100 text-primary-800',
      night: 'bg-gray-700 text-white',
    }
    return classes[shift] || 'bg-gray-100 text-gray-800'
  }
  
  function nextPage() {
    pagination.next()
    productions.value = productionStore.productions
  }
  
  function prevPage() {
    pagination.prev()
    productions.value = productionStore.productions
  }
  
  function exportToExcel() {
    const data = productions.value.map(p => ({
      'Mahsulot': p.product?.name,
      'Liniya': p.line?.name,
      'Smena': formatShift(p.shift),
      'Ishlab chiqarildi': p.total_quantity,
      'Sifatli': p.quality_quantity,
      'Nuqsonli': p.defective_quantity,
      'Sana': formatDate(p.production_date),
    }))
    exportExcel(data, `ishlab-chiqarish-${selectedDate.value}.xlsx`)
    notifications.success('Excel faylga eksport qilindi')
  }
  
  function exportToPDF() {
    const columns = [
      { header: 'Mahsulot', key: 'product' },
      { header: 'Liniya', key: 'line' },
      { header: 'Jami', key: 'total' },
      { header: 'Sifatli', key: 'quality' },
    ]
    const data = productions.value.map(p => ({
      product: p.product?.name,
      line: p.line?.name,
      total: formatNumber(p.total_quantity),
      quality: formatNumber(p.quality_quantity),
    }))
    exportPdf(data, columns, `ishlab-chiqarish-${selectedDate.value}.pdf`, 'Ishlab chiqarish hisoboti')
    notifications.success('PDF faylga eksport qilindi')
  }
  </script>