<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ehtiyot qismlar</h1>
          <p class="text-gray-600 mt-1">Ehtiyot qismlar ombori va boshqaruvi</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="showImportModal = true"
            class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            Import
          </button>
          <button
            @click="exportParts"
            class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            <ArrowDownTrayIcon class="w-5 h-5 inline mr-2" />
            Eksport
          </button>
          <button
            @click="showAddModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Yangi qism
          </button>
        </div>
      </div>
  
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Jami qismlar"
          :value="stats.totalParts"
          icon="CubeIcon"
          color="blue"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              {{ stats.totalCategories }} kategoriya
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Jami qiymat"
          :value="formatCurrency(stats.totalValue)"
          icon="CurrencyDollarIcon"
          color="green"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              O'rtacha: {{ formatCurrency(stats.avgValue) }}
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Kam qolgan"
          :value="stats.lowStock"
          icon="ExclamationTriangleIcon"
          color="orange"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Minimal darajadan past
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Bu oy foydalanilgan"
          :value="stats.usedThisMonth"
          icon="ArrowTrendingUpIcon"
          color="purple"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Qiymat: {{ formatCurrency(stats.usedValue) }}
            </p>
          </template>
        </StatCard>
      </div>
  
      <!-- Filters and Search -->
      <BaseCard>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Qism nomi, kodi yoki ishlab chiqaruvchi..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
  
          <!-- Category Filter -->
          <div>
            <select
              v-model="filters.category"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Barcha kategoriyalar</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
  
          <!-- Stock Status Filter -->
          <div>
            <select
              v-model="filters.stockStatus"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Barcha holatlar</option>
              <option value="in_stock">Omborda</option>
              <option value="low_stock">Kam qolgan</option>
              <option value="out_of_stock">Tugagan</option>
            </select>
          </div>
  
          <!-- Compatibility Filter -->
          <div>
            <select
              v-model="filters.machineId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Barcha uskunalar</option>
              <option v-for="machine in machines" :key="machine.id" :value="machine.id">
                {{ machine.code }}
              </option>
            </select>
          </div>
        </div>
  
        <!-- Active Filters -->
        <div v-if="activeFiltersCount > 0" class="flex items-center space-x-2 mt-4">
          <span class="text-sm text-gray-600">Filtrlar:</span>
          <div class="flex flex-wrap gap-2">
            <Badge
              v-if="filters.category"
              color="blue"
              @click="filters.category = ''"
              class="cursor-pointer"
            >
              {{ getCategoryName(filters.category) }} ×
            </Badge>
            <Badge
              v-if="filters.stockStatus"
              color="orange"
              @click="filters.stockStatus = ''"
              class="cursor-pointer"
            >
              {{ getStatusName(filters.stockStatus) }} ×
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
  
      <!-- Quick Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BaseCard @click="filters.stockStatus = 'low_stock'" class="cursor-pointer hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Kam qolgan qismlar</p>
              <p class="text-3xl font-bold text-orange-600 mt-2">{{ stats.lowStock }}</p>
              <p class="text-xs text-gray-600 mt-1">Buyurtma berilishi kerak</p>
            </div>
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon class="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </BaseCard>
  
        <BaseCard @click="filters.stockStatus = 'out_of_stock'" class="cursor-pointer hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Tugagan qismlar</p>
              <p class="text-3xl font-bold text-red-600 mt-2">{{ stats.outOfStock }}</p>
              <p class="text-xs text-gray-600 mt-1">Zudlik bilan buyurtma</p>
            </div>
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircleIcon class="w-8 h-8 text-red-600" />
            </div>
          </div>
        </BaseCard>
  
        <BaseCard class="cursor-pointer hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Pending buyurtmalar</p>
              <p class="text-3xl font-bold text-blue-600 mt-2">{{ stats.pendingOrders }}</p>
              <p class="text-xs text-gray-600 mt-1">Yo'lda kelayotgan</p>
            </div>
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <TruckIcon class="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Main Table -->
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Qismlar ro'yxati</h3>
            <div class="flex items-center space-x-2">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'p-2 rounded',
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                ]"
              >
                <Squares2X2Icon class="w-5 h-5" />
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'p-2 rounded',
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                ]"
              >
                <ListBulletIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </template>
  
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="part in paginatedParts"
            :key="part.id"
            @click="viewPartDetails(part)"
            class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md cursor-pointer transition"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 mb-1">{{ part.name }}</h4>
                <p class="text-sm text-gray-600">{{ part.partNumber }}</p>
              </div>
              <Badge :color="getStockBadgeColor(part.stock, part.minStock)">
                {{ part.stock }}
              </Badge>
            </div>
  
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Kategoriya:</span>
                <span class="font-medium text-gray-900">{{ part.category }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Narx:</span>
                <span class="font-medium text-gray-900">{{ formatCurrency(part.price) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Minimal:</span>
                <span class="font-medium text-gray-900">{{ part.minStock }}</span>
              </div>
            </div>
  
            <div class="mt-3 pt-3 border-t">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  :class="[
                    'h-2 rounded-full transition-all',
                    getStockBarColor(part.stock, part.minStock)
                  ]"
                  :style="{ width: `${Math.min((part.stock / part.maxStock) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
  
            <div class="flex items-center justify-between mt-3">
              <button
                @click.stop="quickOrder(part)"
                :class="[
                  'text-sm px-3 py-1 rounded',
                  part.stock <= part.minStock
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                Buyurtma
              </button>
              <button
                @click.stop="adjustStock(part)"
                class="text-sm text-blue-600 hover:text-blue-700"
              >
                Sozlash
              </button>
            </div>
          </div>
        </div>
  
        <!-- List View -->
        <DataTable
          v-if="viewMode === 'list'"
          :data="paginatedParts"
          :columns="tableColumns"
          :loading="loading"
          @sort="handleSort"
        >
          <template #partNumber="{ row }">
            <div>
              <p class="font-medium text-gray-900">{{ row.partNumber }}</p>
              <p class="text-sm text-gray-600">{{ row.manufacturer }}</p>
            </div>
          </template>
  
          <template #stock="{ row }">
            <div class="flex items-center space-x-2">
              <span :class="[
                'font-medium',
                row.stock === 0 ? 'text-red-600' :
                row.stock <= row.minStock ? 'text-orange-600' :
                'text-green-600'
              ]">
                {{ row.stock }}
              </span>
              <Badge :color="getStockBadgeColor(row.stock, row.minStock)" size="sm">
                {{ getStockStatus(row.stock, row.minStock) }}
              </Badge>
            </div>
          </template>
  
          <template #price="{ row }">
            <div>
              <p class="font-medium text-gray-900">{{ formatCurrency(row.price) }}</p>
              <p class="text-xs text-gray-600">Jami: {{ formatCurrency(row.stock * row.price) }}</p>
            </div>
          </template>
  
          <template #compatibility="{ row }">
            <div class="flex flex-wrap gap-1">
              <Badge
                v-for="machine in row.compatibleMachines.slice(0, 2)"
                :key="machine"
                color="blue"
                size="sm"
              >
                {{ machine }}
              </Badge>
              <Badge
                v-if="row.compatibleMachines.length > 2"
                color="gray"
                size="sm"
              >
                +{{ row.compatibleMachines.length - 2 }}
              </Badge>
            </div>
          </template>
  
          <template #actions="{ row }">
            <div class="flex items-center space-x-2">
              <button
                @click="viewPartDetails(row)"
                class="text-blue-600 hover:text-blue-700"
              >
                Ko'rish
              </button>
              <button
                @click="adjustStock(row)"
                class="text-gray-600 hover:text-gray-700"
              >
                Sozlash
              </button>
              <button
                v-if="row.stock <= row.minStock"
                @click="quickOrder(row)"
                class="text-orange-600 hover:text-orange-700"
              >
                Buyurtma
              </button>
            </div>
          </template>
        </DataTable>
  
        <Pagination
          v-model="pagination.page"
          :total="pagination.total"
          :per-page="pagination.perPage"
          @change="loadParts"
        />
      </BaseCard>
  
      <!-- Add/Edit Modal -->
      <Modal v-model="showAddModal" title="Yangi ehtiyot qism" size="lg">
        <form @submit.prevent="savePart" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nomi <span class="text-red-600">*</span>
              </label>
              <input
                v-model="partForm.name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Qism raqami <span class="text-red-600">*</span>
              </label>
              <input
                v-model="partForm.partNumber"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Kategoriya
              </label>
              <select
                v-model="partForm.category"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Tanlang</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ishlab chiqaruvchi
              </label>
              <input
                v-model="partForm.manufacturer"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
  
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Narx
              </label>
              <input
                v-model.number="partForm.price"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Minimal qoldiq
              </label>
              <input
                v-model.number="partForm.minStock"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Maksimal qoldiq
              </label>
              <input
                v-model.number="partForm.maxStock"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tavsif
            </label>
            <textarea
              v-model="partForm.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            ></textarea>
          </div>
  
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Saqlash
            </button>
          </div>
        </form>
      </Modal>
  
      <!-- Adjust Stock Modal -->
      <Modal v-model="showAdjustModal" title="Qoldiqni sozlash">
        <form @submit.prevent="saveStockAdjustment" class="space-y-4">
          <div v-if="selectedPart">
            <p class="text-sm text-gray-600 mb-2">{{ selectedPart.name }}</p>
            <p class="text-lg font-semibold text-gray-900">
              Hozirgi qoldiq: {{ selectedPart.stock }}
            </p>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Harakat turi
            </label>
            <select
              v-model="adjustForm.type"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="add">Qo'shish</option>
              <option value="remove">Olib tashlash</option>
              <option value="set">O'rnatish</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Miqdor
            </label>
            <input
              v-model.number="adjustForm.quantity"
              type="number"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sabab
            </label>
            <textarea
              v-model="adjustForm.reason"
              rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            ></textarea>
          </div>
  
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showAdjustModal = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Saqlash
            </button>
          </div>
        </form>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useMaintenanceStore } from '@/stores/maintenance'
  import {
    ArrowDownTrayIcon,
    CubeIcon,
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    ArrowTrendingUpIcon,
    XCircleIcon,
    TruckIcon,
    Squares2X2Icon,
    ListBulletIcon
  } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import DataTable from '@/components/common/tables/DataTable.vue'
  import Pagination from '@/components/common/navigation/Pagination.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  
  const router = useRouter()
  const maintenanceStore = useMaintenanceStore()
  
  const loading = ref(false)
  const viewMode = ref('grid')
  const showAddModal = ref(false)
  const showAdjustModal = ref(false)
  const showImportModal = ref(false)
  const selectedPart = ref(null)
  
  const stats = ref({
    totalParts: 342,
    totalCategories: 12,
    totalValue: 85000000,
    avgValue: 248538,
    lowStock: 23,
    outOfStock: 8,
    usedThisMonth: 156,
    usedValue: 12500000,
    pendingOrders: 15
  })
  
  const categories = ref([])
  const machines = ref([])
  const parts = ref([])
  
  const filters = reactive({
    search: '',
    category: '',
    stockStatus: '',
    machineId: ''
  })
  
  const pagination = reactive({
    page: 1,
    perPage: 12,
    total: 0
  })
  
  const partForm = reactive({
    name: '',
    partNumber: '',
    category: '',
    manufacturer: '',
    price: 0,
    minStock: 0,
    maxStock: 0,
    description: ''
  })
  
  const adjustForm = reactive({
    type: 'add',
    quantity: 0,
    reason: ''
  })
  
  const tableColumns = [
    { key: 'name', label: 'Nomi', sortable: true },
    { key: 'partNumber', label: 'Qism raqami', slot: true },
    { key: 'category', label: 'Kategoriya' },
    { key: 'stock', label: 'Qoldiq', slot: true, sortable: true },
    { key: 'minStock', label: 'Minimal' },
    { key: 'price', label: 'Narx', slot: true },
    { key: 'compatibility', label: 'Mos uskunalar', slot: true },
    { key: 'actions', label: '', slot: true }
  ]
  
  const activeFiltersCount = computed(() => {
    let count = 0
    if (filters.category) count++
    if (filters.stockStatus) count++
    if (filters.machineId) count++
    if (filters.search) count++
    return count
  })
  
  const filteredParts = computed(() => {
    let filtered = parts.value
  
    if (filters.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.partNumber.toLowerCase().includes(query) ||
        p.manufacturer.toLowerCase().includes(query)
      )
    }
  
    if (filters.category) {
      filtered = filtered.filter(p => p.categoryId === filters.category)
    }
  
    if (filters.stockStatus) {
      filtered = filtered.filter(p => {
        if (filters.stockStatus === 'out_of_stock') return p.stock === 0
        if (filters.stockStatus === 'low_stock') return p.stock > 0 && p.stock <= p.minStock
        if (filters.stockStatus === 'in_stock') return p.stock > p.minStock
        return true
      })
    }
  
    if (filters.machineId) {
      filtered = filtered.filter(p =>
        p.compatibleMachines.includes(filters.machineId)
      )
    }
  
    return filtered
  })
  
  const paginatedParts = computed(() => {
    const start = (pagination.page - 1) * pagination.perPage
    const end = start + pagination.perPage
    return filteredParts.value.slice(start, end)
  })
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  const getStockBadgeColor = (stock, minStock) => {
    if (stock === 0) return 'red'
    if (stock <= minStock) return 'orange'
    return 'green'
  }
  
  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return 'Tugagan'
    if (stock <= minStock) return 'Kam'
    return 'Yetarli'
  }
  
  const getStockBarColor = (stock, minStock) => {
    if (stock === 0) return 'bg-red-600'
    if (stock <= minStock) return 'bg-orange-600'
    return 'bg-green-600'
  }
  
  const getCategoryName = (id) => {
    return categories.value.find(c => c.id === id)?.name || ''
  }
  
  const getStatusName = (status) => {
    const names = {
      in_stock: 'Omborda',
      low_stock: 'Kam qolgan',
      out_of_stock: 'Tugagan'
    }
    return names[status] || ''
  }
  
  const clearFilters = () => {
    filters.search = ''
    filters.category = ''
    filters.stockStatus = ''
    filters.machineId = ''
  }
  
  const viewPartDetails = (part) => {
    router.push(`/maintenance/spare-parts/${part.id}`)
  }
  
  const adjustStock = (part) => {
    selectedPart.value = part
    adjustForm.type = 'add'
    adjustForm.quantity = 0
    adjustForm.reason = ''
    showAdjustModal.value = true
  }
  
  const quickOrder = (part) => {
    router.push({
      name: 'warehouse-requests',
      query: { partId: part.id }
    })
  }
  
  const savePart = async () => {
    try {
      await maintenanceStore.createSparePart(partForm)
      showAddModal.value = false
      loadParts()
    } catch (error) {
      console.error('Failed to save part:', error)
    }
  }
  
  const saveStockAdjustment = async () => {
    try {
      await maintenanceStore.adjustStock(selectedPart.value.id, adjustForm)
      showAdjustModal.value = false
      loadParts()
    } catch (error) {
      console.error('Failed to adjust stock:', error)
    }
  }
  
  const exportParts = async () => {
    try {
      await maintenanceStore.exportSpareParts({
        ...filters,
        format: 'xlsx'
      })
    } catch (error) {
      console.error('Failed to export parts:', error)
    }
  }
  
  const handleSort = (column) => {
    console.log('Sort by:', column)
  }
  
  const loadParts = async () => {
    loading.value = true
    try {
      const response = await maintenanceStore.fetchSpareParts({
        page: pagination.page,
        per_page: pagination.perPage,
        ...filters
      })
      parts.value = response.data
      pagination.total = response.total
    } catch (error) {
      console.error('Failed to load parts:', error)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(async () => {
    categories.value = (await maintenanceStore.fetchCategories()).data
    machines.value = (await maintenanceStore.fetchMachines()).data
    loadParts()
  })
  </script>