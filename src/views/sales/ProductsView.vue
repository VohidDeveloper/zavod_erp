<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Mahsulotlar</h1>
          <p class="text-gray-600 mt-1">Tayyor mahsulotlar katalogi</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="toggleView"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Ko'rinishni o'zgartirish"
          >
            <svg v-if="viewMode === 'grid'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            v-if="can('CREATE_PRODUCT')"
            @click="openCreateModal"
            class="btn-primary flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Yangi mahsulot
          </button>
        </div>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jami mahsulotlar</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Faol</p>
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
              <p class="text-sm text-gray-600">Zaxirada</p>
              <p class="text-2xl font-bold text-primary-600 mt-2">
                {{ formatNumber(stats.in_stock) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">O'rtacha narx</p>
              <p class="text-2xl font-bold text-warning-600 mt-2">
                {{ formatCurrency(stats.avg_price) }}
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
            placeholder="Qidirish..."
            class="input"
            @input="debouncedFetch"
          />
          <select v-model="filters.category" class="input" @change="fetchProducts">
            <option value="">Barcha kategoriyalar</option>
            <option value="pipe">Quvurlar</option>
            <option value="fitting">Fitinglar</option>
            <option value="valve">Valflar</option>
            <option value="other">Boshqa</option>
          </select>
          <select v-model="filters.status" class="input" @change="fetchProducts">
            <option value="">Barcha holatlar</option>
            <option value="active">Faol</option>
            <option value="inactive">Faol emas</option>
          </select>
          <select v-model="filters.sort" class="input" @change="fetchProducts">
            <option value="name">Nomi (A-Z)</option>
            <option value="-name">Nomi (Z-A)</option>
            <option value="-price">Narx (yuqori)</option>
            <option value="price">Narx (past)</option>
            <option value="-stock">Zaxira (ko'p)</option>
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
  
      <!-- Products Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <template v-if="loading">
          <div v-for="i in 8" :key="i" class="bg-white rounded-lg shadow animate-pulse">
            <div class="h-40 bg-gray-200 rounded-t-lg"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </template>
  
        <div
          v-else-if="!products.length"
          class="col-span-full bg-white rounded-lg shadow p-12 text-center"
        >
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p class="text-gray-500">Mahsulotlar topilmadi</p>
        </div>
  
        <div
          v-else
          v-for="product in products"
          :key="product.id"
          class="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
          @click="viewProduct(product)"
        >
          <div class="h-40 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center relative overflow-hidden">
            <svg class="w-20 h-20 text-primary-300 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span
              v-if="product.status === 'inactive'"
              class="absolute top-2 right-2 px-2 py-1 bg-gray-800 bg-opacity-75 text-white text-xs rounded-full"
            >
              Faol emas
            </span>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
              {{ product.name }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">{{ product.code }}</p>
            <div class="mt-4 flex items-center justify-between">
              <div>
                <p class="text-xl font-bold text-primary-600">
                  {{ formatCurrency(product.price) }}
                </p>
                <p class="text-xs text-gray-500 mt-1">{{ product.category }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ formatNumber(product.stock) }}</p>
                <p class="text-xs text-gray-500">zaxirada</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Products Table View -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahsulot</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategoriya</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Narx</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Zaxira</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holat</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">Yuklanmoqda...</td>
            </tr>
            <tr v-else-if="!products.length">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">Mahsulotlar yo'q</td>
            </tr>
            <tr
              v-else
              v-for="product in products"
              :key="product.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ product.code }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ product.category }}</td>
              <td class="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                {{ formatCurrency(product.price) }}
              </td>
              <td class="px-6 py-4 text-right text-sm text-gray-900">
                {{ formatNumber(product.stock) }}
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="product.status === 'active' ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ product.status === 'active' ? 'Faol' : 'Faol emas' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="viewProduct(product)"
                    class="text-primary-600 hover:text-primary-900"
                    title="Ko'rish"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    v-if="can('UPDATE_PRODUCT')"
                    @click="editProduct(product)"
                    class="text-warning-600 hover:text-warning-900"
                    title="Tahrirlash"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    v-if="can('DELETE_PRODUCT')"
                    @click="deleteProduct(product)"
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
  
      <!-- Modals -->
      <ProductModal
        v-if="showModal"
        :product="selectedProduct"
        @close="closeModal"
        @saved="handleSaved"
      />
  
      <ProductDetailsModal
        v-if="showDetailsModal"
        :product="selectedProduct"
        @close="showDetailsModal = false"
        @edit="editProduct"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useCommonStore } from '@/stores/common'
  import { usePermissions } from '@/composables/usePermissions'
  import { useNotifications } from '@/composables/useNotifications'
  import { formatCurrency, formatNumber } from '@/utils/formatters'
  import { createDebounce } from '@/utils/helpers'
  import ProductModal from '@/components/sales/modals/ProductModal.vue'
  import ProductDetailsModal from '@/components/sales/modals/ProductDetailsModal.vue'
  
  const commonStore = useCommonStore()
  const { can } = usePermissions()
  const notifications = useNotifications()
  
  const filters = reactive({
    search: '',
    category: '',
    status: '',
    sort: 'name',
  })
  
  const stats = ref({
    total: 0,
    active: 0,
    in_stock: 0,
    avg_price: 0,
  })
  
  const products = ref([])
  const loading = ref(false)
  const showModal = ref(false)
  const showDetailsModal = ref(false)
  const selectedProduct = ref(null)
  const viewMode = ref('grid') // 'grid' or 'list'
  
  const hasActiveFilters = computed(() => {
    return filters.search || filters.category || filters.status
  })
  
  const debouncedFetch = createDebounce(fetchProducts, 500)
  
  onMounted(() => {
    fetchProducts()
  })
  
  async function fetchProducts() {
    loading.value = true
    try {
      await commonStore.fetchProducts(filters)
      products.value = commonStore.products
      
      // Calculate stats
      stats.value = {
        total: products.value.length,
        active: products.value.filter(p => p.status === 'active').length,
        in_stock: products.value.reduce((sum, p) => sum + (p.stock || 0), 0),
        avg_price: products.value.length > 0 
          ? products.value.reduce((sum, p) => sum + (p.price || 0), 0) / products.value.length 
          : 0,
      }
    } catch (error) {
      notifications.apiError(error)
    } finally {
      loading.value = false
    }
  }
  
  function clearFilters() {
    Object.keys(filters).forEach(key => {
      if (key !== 'sort') filters[key] = ''
    })
    fetchProducts()
  }
  
  function toggleView() {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
  }
  
  function openCreateModal() {
    selectedProduct.value = null
    showModal.value = true
  }
  
  function closeModal() {
    showModal.value = false
    selectedProduct.value = null
  }
  
  function viewProduct(product) {
    selectedProduct.value = product
    showDetailsModal.value = true
  }
  
  function editProduct(product) {
    selectedProduct.value = product
    showDetailsModal.value = false
    showModal.value = true
  }
  
  async function deleteProduct(product) {
    if (!confirm('Mahsulotni o\'chirishga ishonchingiz komilmi?')) return
  
    try {
      await commonStore.deleteProduct(product.id)
      notifications.success('Mahsulot o\'chirildi')
      await fetchProducts()
    } catch (error) {
      notifications.apiError(error)
    }
  }
  
  function handleSaved() {
    closeModal()
    fetchProducts()
  }
  </script>