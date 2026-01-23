<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ombor</h1>
          <p class="text-gray-600 mt-1">Mahsulotlar va qoldiqlarni boshqarish</p>
        </div>
        <button
          @click="openCreateModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Yangi mahsulot
        </button>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Jami mahsulotlar"
          :value="stats.totalProducts"
          icon="CubeIcon"
          color="blue"
        />
        <StatCard
          title="Jami qoldiq"
          :value="stats.totalStock"
          icon="ArchiveBoxIcon"
          color="green"
        />
        <StatCard
          title="Kam qolgan"
          :value="stats.lowStock"
          icon="ExclamationTriangleIcon"
          color="amber"
        />
        <StatCard
          title="Umumiy qiymat"
          :value="formatCurrency(stats.totalValue)"
          icon="CurrencyDollarIcon"
          color="purple"
        />
      </div>
  
      <!-- Filters -->
      <BaseCard>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Qidirish</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Mahsulot nomi..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kategoriya</label>
            <select
              v-model="filters.category"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Barchasi</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Holat</label>
            <select
              v-model="filters.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Barchasi</option>
              <option value="in_stock">Mavjud</option>
              <option value="low_stock">Kam qolgan</option>
              <option value="out_of_stock">Tugagan</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="applyFilters"
              class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Qo'llash
            </button>
          </div>
        </div>
      </BaseCard>
  
      <!-- Products Table -->
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Mahsulotlar ro'yxati</h3>
            <button
              @click="exportProducts"
              class="text-sm text-blue-600 hover:text-blue-700 flex items-center"
            >
              <ArrowDownTrayIcon class="w-4 h-4 mr-1" />
              Eksport
            </button>
          </div>
        </template>
  
        <DataTable
          :data="products"
          :columns="columns"
          :loading="loading"
          @edit="editProduct"
          @delete="deleteProduct"
        >
          <template #stock="{ row }">
            <div class="flex items-center">
              <span class="font-medium">{{ row.stock }}</span>
              <Badge
                :color="getStockBadgeColor(row.stock, row.min_stock)"
                class="ml-2"
              >
                {{ getStockStatus(row.stock, row.min_stock) }}
              </Badge>
            </div>
          </template>
          <template #value="{ row }">
            <span class="font-medium">{{ formatCurrency(row.stock * row.price) }}</span>
          </template>
        </DataTable>
  
        <Pagination
          v-model="pagination.page"
          :total="pagination.total"
          :per-page="pagination.perPage"
          @change="loadProducts"
        />
      </BaseCard>
  
      <!-- Create/Edit Modal -->
      <Modal v-model="showModal" :title="editMode ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'" size="lg">
        <form @submit.prevent="saveProduct" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nomi *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">SKU</label>
              <input
                v-model="form.sku"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kategoriya *</label>
              <select
                v-model="form.category_id"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tanlang</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">O'lchov birligi *</label>
              <select
                v-model="form.unit"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="kg">kg</option>
                <option value="dona">dona</option>
                <option value="litr">litr</option>
                <option value="metr">metr</option>
              </select>
            </div>
          </div>
  
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Narx *</label>
              <input
                v-model.number="form.price"
                type="number"
                required
                min="0"
                step="0.01"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Minimal qoldiq *</label>
              <input
                v-model.number="form.min_stock"
                type="number"
                required
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Maksimal qoldiq</label>
              <input
                v-model.number="form.max_stock"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tavsif</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
  
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useWarehouseStore } from '@/stores/warehouse'
  import { PlusIcon, ArrowDownTrayIcon, CubeIcon, ArchiveBoxIcon, ExclamationTriangleIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import DataTable from '@/components/common/tables/DataTable.vue'
  import Pagination from '@/components/common/navigation/Pagination.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const warehouseStore = useWarehouseStore()
  
  const loading = ref(false)
  const saving = ref(false)
  const showModal = ref(false)
  const editMode = ref(false)
  
  const products = ref([])
  const categories = ref([])
  const stats = ref({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0,
    totalValue: 0
  })
  
  const filters = reactive({
    search: '',
    category: '',
    status: ''
  })
  
  const pagination = reactive({
    page: 1,
    perPage: 10,
    total: 0
  })
  
  const form = reactive({
    id: null,
    name: '',
    sku: '',
    category_id: '',
    unit: 'kg',
    price: 0,
    min_stock: 0,
    max_stock: null,
    description: ''
  })
  
  const columns = [
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'name', label: 'Nomi', sortable: true },
    { key: 'category', label: 'Kategoriya' },
    { key: 'stock', label: 'Qoldiq', slot: true },
    { key: 'unit', label: 'Birligi' },
    { key: 'price', label: 'Narx' },
    { key: 'value', label: 'Qiymat', slot: true },
    { key: 'actions', label: '', actions: true }
  ]
  
  const loadProducts = async () => {
    loading.value = true
    try {
      const response = await warehouseStore.fetchProducts({
        page: pagination.page,
        per_page: pagination.perPage,
        ...filters
      })
      products.value = response.data
      pagination.total = response.total
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      loading.value = false
    }
  }
  
  const loadCategories = async () => {
    try {
      const response = await warehouseStore.fetchCategories()
      categories.value = response.data
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }
  
  const loadStats = async () => {
    try {
      const response = await warehouseStore.fetchStats()
      stats.value = response.data
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }
  
  const openCreateModal = () => {
    editMode.value = false
    resetForm()
    showModal.value = true
  }
  
  const editProduct = (product) => {
    editMode.value = true
    Object.assign(form, product)
    showModal.value = true
  }
  
  const saveProduct = async () => {
    saving.value = true
    try {
      if (editMode.value) {
        await warehouseStore.updateProduct(form.id, form)
      } else {
        await warehouseStore.createProduct(form)
      }
      showModal.value = false
      loadProducts()
      loadStats()
    } catch (error) {
      console.error('Failed to save product:', error)
    } finally {
      saving.value = false
    }
  }
  
  const deleteProduct = async (product) => {
    if (confirm(`${product.name} mahsulotini o'chirmoqchimisiz?`)) {
      try {
        await warehouseStore.deleteProduct(product.id)
        loadProducts()
        loadStats()
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  }
  
  const applyFilters = () => {
    pagination.page = 1
    loadProducts()
  }
  
  const exportProducts = async () => {
    try {
      await warehouseStore.exportProducts(filters, 'xlsx')
    } catch (error) {
      console.error('Failed to export products:', error)
    }
  }
  
  const resetForm = () => {
    Object.assign(form, {
      id: null,
      name: '',
      sku: '',
      category_id: '',
      unit: 'kg',
      price: 0,
      min_stock: 0,
      max_stock: null,
      description: ''
    })
  }
  
  const getStockBadgeColor = (stock, minStock) => {
    if (stock === 0) return 'red'
    if (stock <= minStock) return 'amber'
    return 'green'
  }
  
  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return 'Tugagan'
    if (stock <= minStock) return 'Kam'
    return 'Yetarli'
  }
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  onMounted(() => {
    loadProducts()
    loadCategories()
    loadStats()
  })
  </script>