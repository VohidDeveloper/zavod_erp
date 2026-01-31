<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ombor Tahlili</h1>
          <p class="text-gray-600 mt-1">Ombor ko'rsatkichlari va statistika</p>
        </div>
        <div class="flex items-center space-x-3">
          <select
            v-model="dateRange"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Bugun</option>
            <option value="week">Bu hafta</option>
            <option value="month">Bu oy</option>
            <option value="year">Bu yil</option>
          </select>
          <button
            @click="exportReport"
            class="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            <ArrowDownTrayIcon class="w-5 h-5 mr-2" />
            Eksport
          </button>
        </div>
      </div>
  
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Jami qoldiq"
          :value="stats.totalStock"
          :change="stats.stockChange"
          icon="CubeIcon"
          color="blue"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              {{ stats.stockItems }} xil mahsulot
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Ombor qiymati"
          :value="formatCurrency(stats.totalValue)"
          :change="stats.valueChange"
          icon="CurrencyDollarIcon"
          color="green"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              O'rtacha narx: {{ formatCurrency(stats.avgPrice) }}
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Kam qolgan"
          :value="stats.lowStock"
          icon="ExclamationTriangleIcon"
          color="amber"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Minimal qoldiqdan past
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Aylanma tezligi"
          :value="stats.turnoverRate + ' kun'"
          :change="stats.turnoverChange"
          icon="ArrowPathIcon"
          color="purple"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              O'rtacha aylanma davri
            </p>
          </template>
        </StatCard>
      </div>
  
      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Stock Movement Chart -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Qoldiq harakati</h3>
              <div class="flex space-x-2">
                <button
                  v-for="period in ['7d', '30d', '90d']"
                  :key="period"
                  @click="movementPeriod = period"
                  :class="[
                    'px-3 py-1 text-sm rounded-lg',
                    movementPeriod === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  ]"
                >
                  {{ period }}
                </button>
              </div>
            </div>
          </template>
          <div class="h-80">
            <LineChart :data="stockMovementData" :options="chartOptions" />
          </div>
        </BaseCard>
  
        <!-- Category Distribution -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Kategoriya bo'yicha taqsimot</h3>
          </template>
          <div class="h-80">
            <DoughnutChart :data="categoryDistributionData" :options="pieChartOptions" />
          </div>
        </BaseCard>
      </div>
  
      <!-- Stock Status & Turnover -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Stock Status -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Qoldiq holati</h3>
          </template>
          <div class="space-y-4">
            <div
              v-for="status in stockStatus"
              :key="status.label"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div
                  :class="[
                    'w-12 h-12 rounded-lg flex items-center justify-center',
                    status.bgColor
                  ]"
                >
                  <component :is="status.icon" :class="['w-6 h-6', status.iconColor]" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ status.label }}</p>
                  <p class="text-sm text-gray-600">{{ status.description }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-900">{{ status.count }}</p>
                <p class="text-sm text-gray-600">{{ status.percentage }}%</p>
              </div>
            </div>
          </div>
        </BaseCard>
  
        <!-- Top Products by Turnover -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Eng ko'p sotilgan mahsulotlar</h3>
          </template>
          <div class="space-y-3">
            <div
              v-for="(product, index) in topProducts"
              :key="product.id"
              class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
            >
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  {{ index + 1 }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-sm text-gray-600">SKU: {{ product.sku }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-gray-900">{{ product.turnover }}</p>
                <p class="text-sm text-gray-600">{{ product.quantity }} dona</p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Inventory Aging & Low Stock Alerts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Inventory Aging -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Omborda turish muddati</h3>
          </template>
          <div class="h-80">
            <BarChart :data="agingData" :options="barChartOptions" />
          </div>
        </BaseCard>
  
        <!-- Low Stock Alerts -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Kam qolgan mahsulotlar</h3>
              <Badge color="amber">{{ lowStockItems.length }} ta ogohlantirish</Badge>
            </div>
          </template>
          <div class="space-y-3 max-h-80 overflow-y-auto">
            <div
              v-for="item in lowStockItems"
              :key="item.id"
              class="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
            >
              <div class="flex-1">
                <div class="flex items-center space-x-2">
                  <ExclamationTriangleIcon class="w-5 h-5 text-amber-600" />
                  <p class="font-medium text-gray-900">{{ item.name }}</p>
                </div>
                <div class="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <span>Qoldiq: <strong>{{ item.currentStock }}</strong></span>
                  <span>Minimal: <strong>{{ item.minStock }}</strong></span>
                  <span>Yetishmaydi: <strong class="text-amber-600">{{ item.shortage }}</strong></span>
                </div>
              </div>
              <button
                @click="createPurchaseRequest(item)"
                class="ml-4 px-3 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700"
              >
                Buyurtma berish
              </button>
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Detailed Table -->
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Batafsil hisobot</h3>
            <div class="flex items-center space-x-3">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Qidirish..."
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <select
                v-model="categoryFilter"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Barcha kategoriyalar</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>
        </template>
  
        <DataTable
          :data="filteredProducts"
          :columns="tableColumns"
          :loading="loading"
          @sort="handleSort"
        >
          <template #stock="{ row }">
            <div class="flex items-center space-x-2">
              <span class="font-medium">{{ row.stock }}</span>
              <Badge :color="getStockBadgeColor(row.stock, row.minStock)">
                {{ getStockStatus(row.stock, row.minStock) }}
              </Badge>
            </div>
          </template>
  
          <template #value="{ row }">
            <span class="font-medium">{{ formatCurrency(row.stock * row.price) }}</span>
          </template>
  
          <template #turnover="{ row }">
            <div class="text-center">
              <p class="font-medium">{{ row.turnoverDays }} kun</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: `${Math.min((30 / row.turnoverDays) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
          </template>
  
          <template #actions="{ row }">
            <div class="flex items-center space-x-2">
              <button
                @click="viewDetails(row)"
                class="text-blue-600 hover:text-blue-700"
              >
                Ko'rish
              </button>
              <button
                v-if="row.stock <= row.minStock"
                @click="createPurchaseRequest(row)"
                class="text-amber-600 hover:text-amber-700"
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
          @change="loadProducts"
        />
      </BaseCard>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useWarehouseStore } from '@/stores/warehouse'
  import { useRouter } from 'vue-router'
  import {
    ArrowDownTrayIcon,
    ExclamationTriangleIcon,
    CubeIcon,
    CurrencyDollarIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    XCircleIcon
  } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import LineChart from '@/components/common/charts/LineChart.vue'
  import DoughnutChart from '@/components/common/charts/DoughnutChart.vue'
  import BarChart from '@/components/common/charts/BarChart.vue'
  import DataTable from '@/components/common/tables/DataTable.vue'
  import Pagination from '@/components/common/navigation/Pagination.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const warehouseStore = useWarehouseStore()
  const router = useRouter()
  
  const loading = ref(false)
  const dateRange = ref('month')
  const movementPeriod = ref('30d')
  const searchQuery = ref('')
  const categoryFilter = ref('')
  
  const stats = ref({
    totalStock: '8,234',
    stockChange: -2.1,
    stockItems: 342,
    totalValue: 125000000,
    valueChange: 8.5,
    avgPrice: 15200,
    lowStock: 23,
    turnoverRate: 18,
    turnoverChange: -5.2
  })
  
  const stockStatus = ref([
    {
      label: 'Yetarli',
      description: 'Optimal qoldiq',
      count: 245,
      percentage: 71.6,
      icon: CheckCircleIcon,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      label: 'Kam',
      description: 'Minimal qoldiqdan past',
      count: 74,
      percentage: 21.6,
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      label: 'Tugagan',
      description: 'Qoldiq yo\'q',
      count: 23,
      percentage: 6.8,
      icon: XCircleIcon,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  ])
  
  const topProducts = ref([
    { id: 1, name: 'Plastik idish 500ml', sku: 'PRD-001', turnover: '15 kun', quantity: 1250 },
    { id: 2, name: 'Qadoqlash quti', sku: 'PRD-002', turnover: '18 kun', quantity: 980 },
    { id: 3, name: 'Konteyner 1L', sku: 'PRD-003', turnover: '22 kun', quantity: 750 },
    { id: 4, name: 'Plastik stakanchalar', sku: 'PRD-004', turnover: '25 kun', quantity: 620 },
    { id: 5, name: 'Qopqoqlar to\'plami', sku: 'PRD-005', turnover: '28 kun', quantity: 450 }
  ])
  
  const lowStockItems = ref([
    { id: 1, name: 'Xom ashyo A', currentStock: 50, minStock: 100, shortage: 50 },
    { id: 2, name: 'Xom ashyo B', currentStock: 30, minStock: 80, shortage: 50 },
    { id: 3, name: 'Qadoqlash materiali', currentStock: 25, minStock: 60, shortage: 35 },
    { id: 4, name: 'Etiketka', currentStock: 120, minStock: 200, shortage: 80 }
  ])
  
  const categories = ref([
    { id: 1, name: 'Xom ashyo' },
    { id: 2, name: 'Tayyor mahsulot' },
    { id: 3, name: 'Qadoqlash' },
    { id: 4, name: 'Yordamchi materiallar' }
  ])
  
  const products = ref([])
  const pagination = reactive({
    page: 1,
    perPage: 10,
    total: 0
  })
  
  const stockMovementData = computed(() => ({
    labels: ['1-kun', '5-kun', '10-kun', '15-kun', '20-kun', '25-kun', '30-kun'],
    datasets: [
      {
        label: 'Qabul',
        data: [450, 520, 380, 670, 590, 720, 650],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      },
      {
        label: 'Chiqim',
        data: [380, 450, 420, 580, 530, 650, 590],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      }
    ]
  }))
  
  const categoryDistributionData = computed(() => ({
    labels: ['Xom ashyo', 'Tayyor mahsulot', 'Qadoqlash', 'Yordamchi'],
    datasets: [{
      data: [35, 45, 15, 5],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#8B5CF6'
      ]
    }]
  }))
  
  const agingData = computed(() => ({
    labels: ['0-30 kun', '31-60 kun', '61-90 kun', '90+ kun'],
    datasets: [{
      label: 'Mahsulotlar soni',
      data: [180, 95, 45, 22],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']
    }]
  }))
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
  
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      }
    }
  }
  
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  }
  
  const tableColumns = [
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'name', label: 'Nomi', sortable: true },
    { key: 'category', label: 'Kategoriya' },
    { key: 'stock', label: 'Qoldiq', slot: true, sortable: true },
    { key: 'minStock', label: 'Minimal' },
    { key: 'value', label: 'Qiymat', slot: true },
    { key: 'turnover', label: 'Aylanma', slot: true },
    { key: 'actions', label: '', slot: true }
  ]
  
  const filteredProducts = computed(() => {
    let filtered = products.value
  
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      )
    }
  
    if (categoryFilter.value) {
      filtered = filtered.filter(p => p.categoryId === categoryFilter.value)
    }
  
    return filtered
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
    if (stock <= minStock) return 'amber'
    return 'green'
  }
  
  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return 'Tugagan'
    if (stock <= minStock) return 'Kam'
    return 'Yetarli'
  }
  
  const loadProducts = async () => {
    loading.value = true
    try {
      const response = await warehouseStore.fetchProducts({
        page: pagination.page,
        per_page: pagination.perPage,
        category: categoryFilter.value,
        search: searchQuery.value
      })
      products.value = response.data
      pagination.total = response.total
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      loading.value = false
    }
  }
  
  const handleSort = (column) => {
    console.log('Sort by:', column)
    // Implement sorting logic
  }
  
  const viewDetails = (product) => {
    router.push(`/warehouse/products/${product.id}`)
  }
  
  const createPurchaseRequest = (item) => {
    router.push({
      name: 'warehouse-requests',
      query: { productId: item.id }
    })
  }
  
  const exportReport = async () => {
    try {
      await warehouseStore.exportAnalytics({
        dateRange: dateRange.value,
        format: 'xlsx'
      })
    } catch (error) {
      console.error('Failed to export report:', error)
    }
  }
  
  onMounted(() => {
    loadProducts()
  })
  </script>