<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Nosozliklar</h1>
          <p class="text-gray-600 mt-1">Mahsulot nosozliklarini kuzatish va tahlil qilish</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="exportData"
            class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            <ArrowDownTrayIcon class="w-5 h-5 inline mr-2" />
            Eksport
          </button>
          <button
            @click="showReportModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Nosozlik qo'shish
          </button>
        </div>
      </div>
  
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Jami nosozliklar"
          :value="stats.totalDefects"
          :change="stats.defectChange"
          icon="ExclamationTriangleIcon"
          color="red"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">Bu oy: {{ stats.thisMonth }}</p>
          </template>
        </StatCard>
  
        <StatCard
          title="Nosozlik darajasi"
          :value="stats.defectRate + '%'"
          icon="ChartBarIcon"
          :color="stats.defectRate > 5 ? 'red' : stats.defectRate > 2 ? 'orange' : 'green'"
        />
  
        <StatCard
          title="Hal qilingan"
          :value="stats.resolvedCount"
          icon="CheckCircleIcon"
          color="green"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">{{ stats.resolvedRate }}%</p>
          </template>
        </StatCard>
  
        <StatCard
          title="Qayta ishlash"
          :value="stats.reworkCount"
          icon="ArrowPathIcon"
          color="orange"
        />
  
        <StatCard
          title="Zarar"
          :value="formatCurrency(stats.totalCost)"
          icon="CurrencyDollarIcon"
          color="purple"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">O'rtacha: {{ formatCurrency(stats.avgCost) }}</p>
          </template>
        </StatCard>
      </div>
  
      <!-- Filters -->
      <BaseCard>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Mahsulot, partiya qidirish..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
          </div>
  
          <!-- Defect Type -->
          <div>
            <select
              v-model="filters.defectType"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Barcha turlar</option>
              <option v-for="type in defectTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
  
          <!-- Severity -->
          <div>
            <select
              v-model="filters.severity"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Barcha darajalar</option>
              <option value="critical">Jiddiy</option>
              <option value="major">Muhim</option>
              <option value="minor">Kichik</option>
            </select>
          </div>
  
          <!-- Status -->
          <div>
            <select
              v-model="filters.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Barcha holatlar</option>
              <option value="open">Ochiq</option>
              <option value="in_progress">Jarayonda</option>
              <option value="resolved">Hal qilindi</option>
            </select>
          </div>
  
          <!-- Date Range -->
          <div>
            <select
              v-model="filters.dateRange"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="today">Bugun</option>
              <option value="week">Bu hafta</option>
              <option value="month">Bu oy</option>
              <option value="all">Barchasi</option>
            </select>
          </div>
        </div>
  
        <!-- Active Filters -->
        <div v-if="activeFiltersCount > 0" class="flex items-center space-x-2 mt-4">
          <span class="text-sm text-gray-600">Filtrlar:</span>
          <div class="flex flex-wrap gap-2">
            <Badge
              v-if="filters.defectType"
              color="blue"
              @click="filters.defectType = ''"
              class="cursor-pointer"
            >
              {{ filters.defectType }} ×
            </Badge>
            <Badge
              v-if="filters.severity"
              color="orange"
              @click="filters.severity = ''"
              class="cursor-pointer"
            >
              {{ getSeverityText(filters.severity) }} ×
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
  
      <!-- Defect Categories Chart -->
      <BaseCard>
        <template #header>
          <h3 class="text-lg font-semibold">Nosozliklar bo'yicha tahlil</h3>
        </template>
  
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="category in defectCategories"
            :key="category.type"
            class="p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-medium text-gray-700">{{ category.type }}</p>
              <Badge :color="getCategoryColor(category.percentage)" size="sm">
                {{ category.percentage }}%
              </Badge>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ category.count }}</p>
            <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                :class="[
                  'h-2 rounded-full',
                  getCategoryColor(category.percentage) === 'red' ? 'bg-red-600' :
                  getCategoryColor(category.percentage) === 'orange' ? 'bg-orange-600' :
                  'bg-blue-600'
                ]"
                :style="{ width: `${category.percentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </BaseCard>
  
      <!-- Defects List -->
      <div class="space-y-4">
        <div
          v-for="defect in paginatedDefects"
          :key="defect.id"
          class="p-6 bg-white border-2 rounded-lg hover:shadow-lg cursor-pointer transition"
          :class="getBorderColor(defect.severity)"
          @click="viewDefectDetails(defect)"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div :class="[
                'w-12 h-12 rounded-full flex items-center justify-center',
                getSeverityBgColor(defect.severity)
              ]">
                <ExclamationTriangleIcon :class="[
                  'w-6 h-6',
                  getSeverityIconColor(defect.severity)
                ]" />
              </div>
              <div>
                <div class="flex items-center space-x-2 mb-1">
                  <h3 class="font-semibold text-gray-900">{{ defect.defectType }}</h3>
                  <Badge :color="getSeverityColor(defect.severity)">
                    {{ getSeverityText(defect.severity) }}
                  </Badge>
                  <Badge :color="getStatusColor(defect.status)">
                    {{ getStatusText(defect.status) }}
                  </Badge>
                </div>
                <p class="text-sm text-gray-600">
                  {{ defect.productName }} • Partiya: {{ defect.batchNumber }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Aniqlangan</p>
              <p class="font-medium text-gray-900">{{ defect.reportedDate }}</p>
            </div>
          </div>
  
          <!-- Details Grid -->
          <div class="grid grid-cols-5 gap-4 mb-4">
            <div>
              <p class="text-xs text-gray-600 mb-1">Miqdor</p>
              <p class="font-bold text-red-600 text-lg">{{ defect.quantity }} ta</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 mb-1">Joylashuv</p>
              <p class="font-medium text-gray-900 text-sm">{{ defect.location }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 mb-1">Xodim</p>
              <p class="font-medium text-gray-900 text-sm">{{ defect.reportedBy }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 mb-1">Zarar</p>
              <p class="font-bold text-purple-600 text-sm">{{ formatCurrency(defect.cost) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 mb-1">Holat</p>
              <Badge :color="getStatusColor(defect.status)">
                {{ getStatusText(defect.status) }}
              </Badge>
            </div>
          </div>
  
          <!-- Description -->
          <div v-if="defect.description" class="mb-4 p-3 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-700">{{ defect.description }}</p>
          </div>
  
          <!-- Root Cause & Action -->
          <div v-if="defect.rootCause || defect.correctiveAction" class="grid grid-cols-2 gap-4 mb-4">
            <div v-if="defect.rootCause">
              <p class="text-xs text-gray-600 mb-1">Sabab:</p>
              <p class="text-sm text-gray-900">{{ defect.rootCause }}</p>
            </div>
            <div v-if="defect.correctiveAction">
              <p class="text-xs text-gray-600 mb-1">Ko'rilgan chora:</p>
              <p class="text-sm text-gray-900">{{ defect.correctiveAction }}</p>
            </div>
          </div>
  
          <!-- Footer -->
          <div class="flex items-center justify-between pt-4 border-t">
            <div class="flex items-center space-x-2">
              <Badge
                v-if="defect.isRecurring"
                color="red"
                size="sm"
              >
                Takroriy
              </Badge>
              <span class="text-sm text-gray-600">
                ID: {{ defect.id }}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <button
                v-if="defect.status === 'open'"
                @click.stop="assignInvestigation(defect)"
                class="text-blue-600 hover:text-blue-700 text-sm"
              >
                Tekshirish tayinlash
              </button>
              <button
                v-if="defect.status === 'in_progress'"
                @click.stop="resolveDefect(defect)"
                class="text-green-600 hover:text-green-700 text-sm"
              >
                Hal qilish
              </button>
              <button
                @click.stop="viewHistory(defect)"
                class="text-gray-600 hover:text-gray-700 text-sm"
              >
                Tarix
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Empty State -->
      <div v-if="filteredDefects.length === 0" class="text-center py-12">
        <CheckCircleIcon class="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nosozlik topilmadi</h3>
        <p class="text-gray-600">Bu yaxshi yangilik!</p>
      </div>
  
      <!-- Pagination -->
      <div v-if="filteredDefects.length > 0">
        <Pagination
          v-model="pagination.page"
          :total="pagination.total"
          :per-page="pagination.perPage"
          @change="loadDefects"
        />
      </div>
  
      <!-- Report Defect Modal -->
      <Modal v-model="showReportModal" title="Nosozlik haqida xabar berish" size="lg">
        <form @submit.prevent="reportDefect" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mahsulot <span class="text-red-600">*</span>
              </label>
              <select
                v-model="defectForm.productId"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Tanlang</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.name }}
                </option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Partiya raqami <span class="text-red-600">*</span>
              </label>
              <input
                v-model="defectForm.batchNumber"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nosozlik turi <span class="text-red-600">*</span>
              </label>
              <select
                v-model="defectForm.defectType"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Tanlang</option>
                <option v-for="type in defectTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Jiddiylik darajasi <span class="text-red-600">*</span>
              </label>
              <select
                v-model="defectForm.severity"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Tanlang</option>
                <option value="critical">Jiddiy</option>
                <option value="major">Muhim</option>
                <option value="minor">Kichik</option>
              </select>
            </div>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Miqdor <span class="text-red-600">*</span>
              </label>
              <input
                v-model.number="defectForm.quantity"
                type="number"
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Joylashuv
              </label>
              <input
                v-model="defectForm.location"
                type="text"
                placeholder="Masalan: Linia 2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tavsif <span class="text-red-600">*</span>
            </label>
            <textarea
              v-model="defectForm.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            ></textarea>
          </div>
  
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showReportModal = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Yuborish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useProductionStore } from '@/stores/production'
  import {
    ArrowDownTrayIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ArrowPathIcon,
    CurrencyDollarIcon
  } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  import Pagination from '@/components/common/navigation/Pagination.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  
  const router = useRouter()
  const productionStore = useProductionStore()
  
  const showReportModal = ref(false)
  
  const stats = ref({
    totalDefects: 238,
    defectChange: -12.5,
    thisMonth: 45,
    defectRate: 2.8,
    resolvedCount: 198,
    resolvedRate: 83.2,
    reworkCount: 40,
    totalCost: 18500000,
    avgCost: 77731
  })
  
  const defectTypes = [
    'Rang nomutanosibligi',
    'O\'lchov xatosi',
    'Sirt shikastlanishi',
    'Chok',
    'Yoriqlash',
    'Deformatsiya',
    'Noto\'g\'ri yig\'ilish',
    'Boshqa'
  ]
  
  const defectCategories = ref([
    { type: 'Rang', count: 65, percentage: 27.3 },
    { type: 'O\'lchov', count: 52, percentage: 21.8 },
    { type: 'Sirt', count: 48, percentage: 20.2 },
    { type: 'Boshqa', count: 73, percentage: 30.7 }
  ])
  
  const products = ref([])
  const defects = ref([])
  
  const filters = reactive({
    search: '',
    defectType: '',
    severity: '',
    status: '',
    dateRange: 'month'
  })
  
  const pagination = reactive({
    page: 1,
    perPage: 10,
    total: 0
  })
  
  const defectForm = reactive({
    productId: '',
    batchNumber: '',
    defectType: '',
    severity: '',
    quantity: 1,
    location: '',
    description: ''
  })
  
  const activeFiltersCount = computed(() => {
    let count = 0
    if (filters.defectType) count++
    if (filters.severity) count++
    if (filters.status) count++
    if (filters.search) count++
    return count
  })
  
  const filteredDefects = computed(() => {
    let filtered = defects.value
  
    if (filters.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(d =>
        d.productName.toLowerCase().includes(query) ||
        d.batchNumber.toLowerCase().includes(query)
      )
    }
  
    if (filters.defectType) {
      filtered = filtered.filter(d => d.defectType === filters.defectType)
    }
  
    if (filters.severity) {
      filtered = filtered.filter(d => d.severity === filters.severity)
    }
  
    if (filters.status) {
      filtered = filtered.filter(d => d.status === filters.status)
    }
  
    return filtered
  })
  
  const paginatedDefects = computed(() => {
    const start = (pagination.page - 1) * pagination.perPage
    const end = start + pagination.perPage
    return filteredDefects.value.slice(start, end)
  })
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', minimumFractionDigits: 0 }).format(value)
  }
  
  const getSeverityColor = (severity) => {
    return { critical: 'red', major: 'orange', minor: 'yellow' }[severity] || 'gray'
  }
  
  const getSeverityText = (severity) => {
    return { critical: 'Jiddiy', major: 'Muhim', minor: 'Kichik' }[severity] || severity
  }
  
  const getSeverityBgColor = (severity) => {
    return { critical: 'bg-red-100', major: 'bg-orange-100', minor: 'bg-yellow-100' }[severity] || 'bg-gray-100'
  }
  
  const getSeverityIconColor = (severity) => {
    return { critical: 'text-red-600', major: 'text-orange-600', minor: 'text-yellow-600' }[severity] || 'text-gray-600'
  }
  
  const getBorderColor = (severity) => {
    return { critical: 'border-red-300', major: 'border-orange-300', minor: 'border-yellow-300' }[severity] || 'border-gray-200'
  }
  
  const getStatusColor = (status) => {
    return { open: 'red', in_progress: 'blue', resolved: 'green' }[status] || 'gray'
  }
  
  const getStatusText = (status) => {
    return { open: 'Ochiq', in_progress: 'Jarayonda', resolved: 'Hal qilindi' }[status] || status
  }
  
  const getCategoryColor = (percentage) => {
    if (percentage > 25) return 'red'
    if (percentage > 15) return 'orange'
    return 'blue'
  }
  
  const clearFilters = () => {
    filters.search = ''
    filters.defectType = ''
    filters.severity = ''
    filters.status = ''
    filters.dateRange = 'month'
  }
  
  const viewDefectDetails = (defect) => {
    router.push(`/production/defects/${defect.id}`)
  }
  
  const assignInvestigation = (defect) => {
    console.log('Assign investigation:', defect)
  }
  
  const resolveDefect = (defect) => {
    console.log('Resolve defect:', defect)
  }
  
  const viewHistory = (defect) => {
    router.push(`/production/defects/${defect.id}/history`)
  }
  
  const reportDefect = async () => {
    try {
      await productionStore.reportDefect(defectForm)
      showReportModal.value = false
      loadDefects()
    } catch (error) {
      console.error('Failed to report defect:', error)
    }
  }
  
  const exportData = async () => {
    try {
      await productionStore.exportDefects({ ...filters, format: 'xlsx' })
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }
  
  const loadDefects = async () => {
    try {
      const response = await productionStore.fetchDefects({
        page: pagination.page,
        per_page: pagination.perPage,
        ...filters
      })
      defects.value = response.data
      pagination.total = response.total
    } catch (error) {
      console.error('Failed to load defects:', error)
    }
  }
  
  onMounted(async () => {
    products.value = (await productionStore.fetchProducts()).data
    loadDefects()
  })
  </script>