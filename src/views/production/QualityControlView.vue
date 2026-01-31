<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Sifat nazorati</h1>
          <p class="text-gray-600 mt-1">Mahsulot sifatini tekshirish va nazorat qilish</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="exportReport"
            class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            <ArrowDownTrayIcon class="w-5 h-5 inline mr-2" />
            Eksport
          </button>
          <button
            @click="showInspectionModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Yangi tekshiruv
          </button>
        </div>
      </div>
  
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Tekshiruvlar"
          :value="stats.totalInspections"
          icon="ClipboardDocumentCheckIcon"
          color="blue"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">Bu oy: {{ stats.thisMonth }}</p>
          </template>
        </StatCard>
  
        <StatCard
          title="O'tkazilgan"
          :value="stats.passedCount"
          icon="CheckCircleIcon"
          color="green"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">{{ stats.passRate }}%</p>
          </template>
        </StatCard>
  
        <StatCard
          title="Rad etilgan"
          :value="stats.rejectedCount"
          icon="XCircleIcon"
          color="red"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">{{ stats.rejectRate }}%</p>
          </template>
        </StatCard>
  
        <StatCard
          title="Nosoz mahsulotlar"
          :value="stats.defectCount"
          icon="ExclamationTriangleIcon"
          color="orange"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">{{ stats.defectRate }}%</p>
          </template>
        </StatCard>
  
        <StatCard
          title="Qo'shimcha tekshiruv"
          :value="stats.reworkCount"
          icon="ArrowPathIcon"
          color="purple"
        />
      </div>
  
      <!-- Filters -->
      <BaseCard>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Mahsulot, partiya raqami..."
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
              <option value="passed">O'tkazilgan</option>
              <option value="failed">Rad etilgan</option>
              <option value="pending">Kutilmoqda</option>
              <option value="rework">Qayta ishlash</option>
            </select>
          </div>
  
          <!-- Product Filter -->
          <div>
            <select
              v-model="filters.productId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Barcha mahsulotlar</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
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
              v-if="filters.status"
              color="blue"
              @click="filters.status = ''"
              class="cursor-pointer"
            >
              {{ getStatusText(filters.status) }} ×
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
  
      <!-- Quality Checks List -->
      <div class="space-y-4">
        <div
          v-for="check in paginatedChecks"
          :key="check.id"
          class="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg cursor-pointer transition"
          @click="viewCheckDetails(check)"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div :class="[
                'w-12 h-12 rounded-full flex items-center justify-center',
                getStatusBgColor(check.status)
              ]">
                <component :is="getStatusIcon(check.status)" :class="[
                  'w-6 h-6',
                  getStatusIconColor(check.status)
                ]" />
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="font-semibold text-gray-900">{{ check.productName }}</h3>
                  <Badge :color="getStatusColor(check.status)">
                    {{ getStatusText(check.status) }}
                  </Badge>
                </div>
                <p class="text-sm text-gray-600 mt-1">
                  Partiya: {{ check.batchNumber }} • SKU: {{ check.sku }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Tekshirilgan</p>
              <p class="font-medium text-gray-900">{{ check.inspectionDate }}</p>
            </div>
          </div>
  
          <!-- Inspection Details -->
          <div class="grid grid-cols-4 gap-4 mb-4">
            <div>
              <p class="text-xs text-gray-600 mb-1">Tekshiruvchi</p>
              <p class="font-medium text-gray-900 text-sm">{{ check.inspector }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 mb-1">Miqdor</p>
              <p class="font-medium text-gray-900 text-sm">{{ check.sampleSize }} ta</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 mb-1">Nosozlik</p>
              <p :class="[
                'font-medium text-sm',
                check.defectCount > 0 ? 'text-red-600' : 'text-green-600'
              ]">
                {{ check.defectCount }} ta
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-600 mb-1">Sifat darajasi</p>
              <p :class="[
                'font-bold text-lg',
                check.qualityScore >= 95 ? 'text-green-600' :
                check.qualityScore >= 80 ? 'text-orange-600' :
                'text-red-600'
              ]">
                {{ check.qualityScore }}%
              </p>
            </div>
          </div>
  
          <!-- Quality Metrics -->
          <div class="mb-4">
            <div class="flex items-center justify-between text-sm mb-2">
              <span class="text-gray-600">Sifat ko'rsatkichi</span>
              <span class="font-medium text-gray-900">{{ check.qualityScore }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                :class="[
                  'h-2 rounded-full transition-all',
                  check.qualityScore >= 95 ? 'bg-green-600' :
                  check.qualityScore >= 80 ? 'bg-orange-600' :
                  'bg-red-600'
                ]"
                :style="{ width: `${check.qualityScore}%` }"
              ></div>
            </div>
          </div>
  
          <!-- Defects -->
          <div v-if="check.defects && check.defects.length > 0" class="mb-4">
            <p class="text-sm font-medium text-gray-700 mb-2">Aniqlangan nosozliklar:</p>
            <div class="flex flex-wrap gap-2">
              <Badge
                v-for="defect in check.defects"
                :key="defect.type"
                color="red"
                size="sm"
              >
                {{ defect.type }} ({{ defect.count }})
              </Badge>
            </div>
          </div>
  
          <!-- Footer -->
          <div class="flex items-center justify-between pt-4 border-t">
            <div class="text-sm text-gray-600">
              Tekshiruv turi: {{ getInspectionTypeText(check.inspectionType) }}
            </div>
            <div class="flex items-center space-x-2">
              <button
                v-if="check.status === 'failed'"
                @click.stop="rework(check)"
                class="text-purple-600 hover:text-purple-700 text-sm"
              >
                Qayta ishlash
              </button>
              <button
                @click.stop="viewReport(check)"
                class="text-blue-600 hover:text-blue-700 text-sm"
              >
                Hisobotni ko'rish
              </button>
              <button
                @click.stop="showMoreActions(check)"
                class="text-gray-600 hover:text-gray-700"
              >
                <EllipsisVerticalIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Empty State -->
      <div v-if="filteredChecks.length === 0" class="text-center py-12">
        <ClipboardDocumentCheckIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Tekshiruv topilmadi</h3>
        <p class="text-gray-600 mb-4">Yangi tekshiruv qo'shing</p>
        <button
          @click="showInspectionModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Yangi tekshiruv
        </button>
      </div>
  
      <!-- Pagination -->
      <div v-if="filteredChecks.length > 0">
        <Pagination
          v-model="pagination.page"
          :total="pagination.total"
          :per-page="pagination.perPage"
          @change="loadChecks"
        />
      </div>
  
      <!-- New Inspection Modal -->
      <Modal v-model="showInspectionModal" title="Yangi tekshiruv" size="lg">
        <form @submit.prevent="saveInspection" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mahsulot <span class="text-red-600">*</span>
              </label>
              <select
                v-model="inspectionForm.productId"
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
                v-model="inspectionForm.batchNumber"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tekshiruv turi
              </label>
              <select
                v-model="inspectionForm.inspectionType"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="incoming">Kiruvchi</option>
                <option value="in_process">Jarayonda</option>
                <option value="final">Yakuniy</option>
                <option value="random">Tasodifiy</option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Namuna hajmi
              </label>
              <input
                v-model.number="inspectionForm.sampleSize"
                type="number"
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Izoh
            </label>
            <textarea
              v-model="inspectionForm.notes"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            ></textarea>
          </div>
  
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showInspectionModal = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Boshlash
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
    ClipboardDocumentCheckIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    EllipsisVerticalIcon
  } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  import Pagination from '@/components/common/navigation/Pagination.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  
  const router = useRouter()
  const productionStore = useProductionStore()
  
  const showInspectionModal = ref(false)
  
  const stats = ref({
    totalInspections: 856,
    thisMonth: 142,
    passedCount: 812,
    passRate: 94.9,
    rejectedCount: 44,
    rejectRate: 5.1,
    defectCount: 238,
    defectRate: 2.8,
    reworkCount: 28
  })
  
  const products = ref([])
  const checks = ref([])
  
  const filters = reactive({
    search: '',
    status: '',
    productId: '',
    dateRange: 'week'
  })
  
  const pagination = reactive({
    page: 1,
    perPage: 10,
    total: 0
  })
  
  const inspectionForm = reactive({
    productId: '',
    batchNumber: '',
    inspectionType: 'in_process',
    sampleSize: 50,
    notes: ''
  })
  
  const activeFiltersCount = computed(() => {
    let count = 0
    if (filters.status) count++
    if (filters.productId) count++
    if (filters.search) count++
    return count
  })
  
  const filteredChecks = computed(() => {
    let filtered = checks.value
  
    if (filters.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(c =>
        c.productName.toLowerCase().includes(query) ||
        c.batchNumber.toLowerCase().includes(query)
      )
    }
  
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status)
    }
  
    if (filters.productId) {
      filtered = filtered.filter(c => c.productId === filters.productId)
    }
  
    return filtered
  })
  
  const paginatedChecks = computed(() => {
    const start = (pagination.page - 1) * pagination.perPage
    const end = start + pagination.perPage
    return filteredChecks.value.slice(start, end)
  })
  
  const getStatusColor = (status) => {
    const colors = { passed: 'green', failed: 'red', pending: 'orange', rework: 'purple' }
    return colors[status] || 'gray'
  }
  
  const getStatusText = (status) => {
    const texts = { passed: 'O\'tkazilgan', failed: 'Rad etilgan', pending: 'Kutilmoqda', rework: 'Qayta ishlash' }
    return texts[status] || status
  }
  
  const getStatusBgColor = (status) => {
    const colors = { passed: 'bg-green-100', failed: 'bg-red-100', pending: 'bg-orange-100', rework: 'bg-purple-100' }
    return colors[status] || 'bg-gray-100'
  }
  
  const getStatusIconColor = (status) => {
    const colors = { passed: 'text-green-600', failed: 'text-red-600', pending: 'text-orange-600', rework: 'text-purple-600' }
    return colors[status] || 'text-gray-600'
  }
  
  const getStatusIcon = (status) => {
    const icons = { passed: CheckCircleIcon, failed: XCircleIcon, pending: ClipboardDocumentCheckIcon, rework: ArrowPathIcon }
    return icons[status] || ClipboardDocumentCheckIcon
  }
  
  const getInspectionTypeText = (type) => {
    const texts = { incoming: 'Kiruvchi', in_process: 'Jarayonda', final: 'Yakuniy', random: 'Tasodifiy' }
    return texts[type] || type
  }
  
  const clearFilters = () => {
    filters.search = ''
    filters.status = ''
    filters.productId = ''
    filters.dateRange = 'week'
  }
  
  const viewCheckDetails = (check) => {
    router.push(`/production/quality-control/${check.id}`)
  }
  
  const viewReport = (check) => {
    router.push(`/production/quality-control/${check.id}/report`)
  }
  
  const rework = (check) => {
    console.log('Rework:', check)
  }
  
  const showMoreActions = (check) => {
    console.log('More actions:', check)
  }
  
  const saveInspection = async () => {
    try {
      await productionStore.createInspection(inspectionForm)
      showInspectionModal.value = false
      loadChecks()
    } catch (error) {
      console.error('Failed to create inspection:', error)
    }
  }
  
  const exportReport = async () => {
    try {
      await productionStore.exportQualityReport({ ...filters, format: 'xlsx' })
    } catch (error) {
      console.error('Failed to export report:', error)
    }
  }
  
  const loadChecks = async () => {
    try {
      const response = await productionStore.fetchQualityChecks({
        page: pagination.page,
        per_page: pagination.perPage,
        ...filters
      })
      checks.value = response.data
      pagination.total = response.total
    } catch (error) {
      console.error('Failed to load checks:', error)
    }
  }
  
  onMounted(async () => {
    products.value = (await productionStore.fetchProducts()).data
    loadChecks()
  })
  </script>