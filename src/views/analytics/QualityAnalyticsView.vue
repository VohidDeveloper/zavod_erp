<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Sifat Nazorati Tahlili</h1>
          <p class="text-gray-600 mt-1">Mahsulot sifati va defektlar statistikasi</p>
        </div>
        <div class="flex items-center space-x-3">
          <select
            v-model="dateRange"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Bugun</option>
            <option value="week">Bu hafta</option>
            <option value="month">Bu oy</option>
            <option value="quarter">Chorak</option>
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
          title="Sifat ko'rsatkichi"
          :value="stats.qualityRate + '%'"
          :change="stats.qualityChange"
          icon="ShieldCheckIcon"
          color="green"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Maqsad: {{ stats.qualityTarget }}%
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Defekt darajasi"
          :value="stats.defectRate + '%'"
          :change="stats.defectChange"
          icon="ExclamationTriangleIcon"
          color="red"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              {{ stats.totalDefects }} ta nuqson
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Qayta ishlash"
          :value="stats.reworkRate + '%'"
          :change="stats.reworkChange"
          icon="ArrowPathIcon"
          color="orange"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              {{ stats.reworkItems }} mahsulot
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Mijoz shikoyatlari"
          :value="stats.complaints"
          :change="stats.complaintsChange"
          icon="ChatBubbleBottomCenterTextIcon"
          color="blue"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Hal qilindi: {{ stats.resolvedComplaints }}
            </p>
          </template>
        </StatCard>
      </div>
  
      <!-- Quality Trend & Defect Distribution -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Quality Rate Trend -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Sifat ko'rsatkichi dinamikasi</h3>
              <div class="flex space-x-2">
                <button
                  v-for="period in ['7d', '30d', '90d']"
                  :key="period"
                  @click="qualityPeriod = period"
                  :class="[
                    'px-3 py-1 text-sm rounded-lg',
                    qualityPeriod === period
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
            <LineChart :data="qualityTrendData" :options="trendChartOptions" />
          </div>
        </BaseCard>
  
        <!-- Defect Type Distribution -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Defekt turlari bo'yicha</h3>
          </template>
          <div class="h-80">
            <DoughnutChart :data="defectDistributionData" :options="pieChartOptions" />
          </div>
        </BaseCard>
      </div>
  
      <!-- Defect by Category & Product Line -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Defects by Category -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Kategoriya bo'yicha defektlar</h3>
          </template>
          <div class="h-80">
            <BarChart :data="defectCategoryData" :options="barChartOptions" />
          </div>
        </BaseCard>
  
        <!-- Quality by Production Line -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Liniyalar bo'yicha sifat</h3>
          </template>
          <div class="space-y-3">
            <div
              v-for="line in productionLines"
              :key="line.id"
              class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              @click="viewLineDetails(line)"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <div
                    :class="[
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      getQualityBgColor(line.qualityRate)
                    ]"
                  >
                    <component :is="line.icon" :class="['w-5 h-5', getQualityIconColor(line.qualityRate)]" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ line.name }}</p>
                    <p class="text-sm text-gray-600">{{ line.product }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-gray-900">{{ line.qualityRate }}%</p>
                  <Badge :color="getQualityBadgeColor(line.qualityRate)">
                    {{ getQualityStatus(line.qualityRate) }}
                  </Badge>
                </div>
              </div>
              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <span>Ishlab chiqarildi: {{ line.produced }}</span>
                <span>Defektlar: {{ line.defects }}</span>
                <span>Qayta ishlash: {{ line.rework }}</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Top Defects & Inspection Results -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Most Common Defects -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Eng ko'p uchraydigan defektlar</h3>
              <Badge color="red">Bu oy</Badge>
            </div>
          </template>
          <div class="space-y-3">
            <div
              v-for="(defect, index) in topDefects"
              :key="defect.id"
              class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
            >
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-semibold text-sm">
                  {{ index + 1 }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ defect.name }}</p>
                  <p class="text-sm text-gray-600">{{ defect.category }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-gray-900">{{ defect.count }}</p>
                <div class="flex items-center space-x-1 text-xs text-gray-600">
                  <span>{{ defect.percentage }}%</span>
                  <span :class="defect.trend >= 0 ? 'text-red-600' : 'text-green-600'">
                    {{ defect.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(defect.trend) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
  
        <!-- Inspection Results -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Tekshiruv natijalari</h3>
          </template>
          <div class="space-y-3">
            <div
              v-for="inspection in inspectionResults"
              :key="inspection.id"
              :class="[
                'p-4 rounded-lg border-2',
                inspection.status === 'passed' ? 'bg-green-50 border-green-200' :
                inspection.status === 'failed' ? 'bg-red-50 border-red-200' :
                'bg-yellow-50 border-yellow-200'
              ]"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <component
                    :is="getInspectionIcon(inspection.status)"
                    :class="[
                      'w-5 h-5',
                      inspection.status === 'passed' ? 'text-green-600' :
                      inspection.status === 'failed' ? 'text-red-600' :
                      'text-yellow-600'
                    ]"
                  />
                  <p class="font-medium text-gray-900">{{ inspection.product }}</p>
                </div>
                <Badge :color="getInspectionBadgeColor(inspection.status)">
                  {{ getInspectionStatusText(inspection.status) }}
                </Badge>
              </div>
              <div class="flex items-center justify-between text-sm text-gray-600">
                <span>Tekshirildi: {{ inspection.inspected }}</span>
                <span>Tekshiruvchi: {{ inspection.inspector }}</span>
                <span>{{ inspection.time }}</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Root Cause Analysis & Corrective Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Root Cause Analysis -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Asosiy sabablar tahlili</h3>
          </template>
          <div class="h-80">
            <BarChart :data="rootCauseData" :options="horizontalBarOptions" />
          </div>
        </BaseCard>
  
        <!-- Corrective Actions -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Tuzatish choralari</h3>
              <button
                @click="createAction"
                class="text-sm text-blue-600 hover:text-blue-700"
              >
                + Yangi chora
              </button>
            </div>
          </template>
          <div class="space-y-3 max-h-80 overflow-y-auto">
            <div
              v-for="action in correctiveActions"
              :key="action.id"
              class="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition"
            >
              <div class="flex items-center justify-between mb-2">
                <p class="font-medium text-gray-900">{{ action.title }}</p>
                <Badge :color="getActionStatusColor(action.status)">
                  {{ action.status }}
                </Badge>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ action.description }}</p>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>Mas'ul: {{ action.responsible }}</span>
                <span>Muddat: {{ action.deadline }}</span>
              </div>
              <div class="mt-2">
                <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{{ action.progress }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    :class="[
                      'h-2 rounded-full',
                      action.progress >= 80 ? 'bg-green-600' :
                      action.progress >= 50 ? 'bg-blue-600' :
                      'bg-orange-600'
                    ]"
                    :style="{ width: `${action.progress}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Customer Complaints & Quality Score -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Customer Complaints -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Mijoz shikoyatlari</h3>
          </template>
          <div class="space-y-3">
            <div
              v-for="complaint in complaints"
              :key="complaint.id"
              class="p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <p class="font-medium text-gray-900">{{ complaint.customer }}</p>
                    <Badge :color="getSeverityColor(complaint.severity)">
                      {{ complaint.severity }}
                    </Badge>
                  </div>
                  <p class="text-sm text-gray-600">{{ complaint.issue }}</p>
                </div>
                <Badge :color="complaint.status === 'resolved' ? 'green' : 'orange'">
                  {{ complaint.status === 'resolved' ? 'Hal qilindi' : 'Jarayonda' }}
                </Badge>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ complaint.date }}</span>
                <span>Mahsulot: {{ complaint.product }}</span>
              </div>
            </div>
          </div>
        </BaseCard>
  
        <!-- Quality Score Card -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Sifat kartasi</h3>
          </template>
          <div class="space-y-4">
            <div
              v-for="metric in qualityMetrics"
              :key="metric.id"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <component :is="metric.icon" class="w-5 h-5 text-gray-600" />
                  <span class="font-medium text-gray-900">{{ metric.name }}</span>
                </div>
                <span class="text-2xl font-bold text-gray-900">{{ metric.score }}</span>
              </div>
              <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Maqsad: {{ metric.target }}</span>
                <span :class="metric.score >= metric.target ? 'text-green-600' : 'text-red-600'">
                  {{ metric.score >= metric.target ? '✓' : '✗' }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  :class="[
                    'h-2 rounded-full',
                    metric.score >= metric.target ? 'bg-green-600' : 'bg-red-600'
                  ]"
                  :style="{ width: `${(metric.score / 100) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Detailed Inspection Table -->
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Batafsil tekshiruv hisoboti</h3>
            <div class="flex items-center space-x-3">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Qidirish..."
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <select
                v-model="statusFilter"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Barcha holatlar</option>
                <option value="passed">O'tdi</option>
                <option value="failed">Muvaffaqiyatsiz</option>
                <option value="rework">Qayta ishlash</option>
              </select>
            </div>
          </div>
        </template>
  
        <DataTable
          :data="filteredInspections"
          :columns="tableColumns"
          :loading="loading"
          @sort="handleSort"
        >
          <template #status="{ row }">
            <Badge :color="getInspectionBadgeColor(row.status)">
              {{ getInspectionStatusText(row.status) }}
            </Badge>
          </template>
  
          <template #defects="{ row }">
            <span :class="row.defects > 0 ? 'text-red-600 font-semibold' : 'text-green-600'">
              {{ row.defects }}
            </span>
          </template>
  
          <template #actions="{ row }">
            <div class="flex items-center space-x-2">
              <button
                @click="viewInspectionDetails(row)"
                class="text-blue-600 hover:text-blue-700"
              >
                Ko'rish
              </button>
              <button
                v-if="row.status === 'failed'"
                @click="createCorrectiveAction(row)"
                class="text-orange-600 hover:text-orange-700"
              >
                Chora ko'rish
              </button>
            </div>
          </template>
        </DataTable>
  
        <Pagination
          v-model="pagination.page"
          :total="pagination.total"
          :per-page="pagination.perPage"
          @change="loadInspections"
        />
      </BaseCard>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useQualityStore } from '@/stores/quality'
  import { useRouter } from 'vue-router'
  import {
    ArrowDownTrayIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    ChatBubbleBottomCenterTextIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    CogIcon
  } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import LineChart from '@/components/common/charts/LineChart.vue'
  import DoughnutChart from '@/components/common/charts/DoughnutChart.vue'
  import BarChart from '@/components/common/charts/BarChart.vue'
  import DataTable from '@/components/common/tables/DataTable.vue'
  import Pagination from '@/components/common/navigation/Pagination.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const qualityStore = useQualityStore()
  const router = useRouter()
  
  const loading = ref(false)
  const dateRange = ref('month')
  const qualityPeriod = ref('30d')
  const searchQuery = ref('')
  const statusFilter = ref('')
  
  const stats = ref({
    qualityRate: 96.5,
    qualityChange: 2.3,
    qualityTarget: 98,
    defectRate: 3.5,
    defectChange: -1.2,
    totalDefects: 127,
    reworkRate: 2.1,
    reworkChange: -0.5,
    reworkItems: 76,
    complaints: 8,
    complaintsChange: -25,
    resolvedComplaints: 6
  })
  
  const productionLines = ref([
    { id: 1, name: 'Liniya #1', product: 'Plastik idish', qualityRate: 97.5, produced: 5000, defects: 125, rework: 50, icon: CogIcon },
    { id: 2, name: 'Liniya #2', product: 'Qadoqlash', qualityRate: 96.8, produced: 8000, defects: 256, rework: 128, icon: CogIcon },
    { id: 3, name: 'Liniya #3', product: 'Konteyner', qualityRate: 95.2, produced: 3500, defects: 168, rework: 95, icon: CogIcon }
  ])
  
  const topDefects = ref([
    { id: 1, name: 'O\'lcham noto\'g\'riligi', category: 'Dizayn', count: 45, percentage: 35.4, trend: -5.2 },
    { id: 2, name: 'Sirt nuqsonlari', category: 'Estetik', count: 32, percentage: 25.2, trend: 2.1 },
    { id: 3, name: 'Rang nomuvofiqligi', category: 'Material', count: 23, percentage: 18.1, trend: -3.5 },
    { id: 4, name: 'Qadoqlash muammolari', category: 'Qadoqlash', count: 18, percentage: 14.2, trend: 1.8 },
    { id: 5, name: 'Boshqa', category: 'Turli', count: 9, percentage: 7.1, trend: -0.5 }
  ])
  
  const inspectionResults = ref([
    { id: 1, product: 'Plastik idish 500ml', status: 'passed', inspected: 250, inspector: 'Ali Valiyev', time: '10:30' },
    { id: 2, product: 'Qadoqlash quti', status: 'rework', inspected: 180, inspector: 'Nodira Karimova', time: '11:15' },
    { id: 3, product: 'Konteyner 1L', status: 'failed', inspected: 95, inspector: 'Sardor Toshmatov', time: '12:00' }
  ])
  
  const correctiveActions = ref([
    {
      id: 1,
      title: 'Ekstruziya harorati sozlash',
      description: 'O\'lcham muammolarini hal qilish uchun',
      responsible: 'Jahongir Aliyev',
      deadline: '2024-02-05',
      status: 'Jarayonda',
      progress: 65
    },
    {
      id: 2,
      title: 'Xodimlarni qayta o\'qitish',
      description: 'Sifat standartlari bo\'yicha',
      responsible: 'Dilnoza Ahmedova',
      deadline: '2024-02-10',
      status: 'Rejalashtirilgan',
      progress: 30
    },
    {
      id: 3,
      title: 'Uskunalarni texnik ko\'rik',
      description: 'Sirt sifatini yaxshilash',
      responsible: 'Bekzod Nazarov',
      deadline: '2024-02-01',
      status: 'Bajarildi',
      progress: 100
    }
  ])
  
  const complaints = ref([
    {
      id: 1,
      customer: 'ABC Company',
      issue: 'Rang nomuvofiqgligi',
      product: 'Plastik idish',
      severity: 'Yuqori',
      status: 'pending',
      date: '2024-01-25'
    },
    {
      id: 2,
      customer: 'XYZ Ltd',
      issue: 'O\'lcham xatosi',
      product: 'Qadoqlash',
      severity: 'O\'rtacha',
      status: 'resolved',
      date: '2024-01-20'
    }
  ])
  
  const qualityMetrics = ref([
    { id: 1, name: 'Birinchi marta to\'g\'ri', score: 96.5, target: 98, icon: CheckCircleIcon },
    { id: 2, name: 'Defekt darajasi', score: 96.5, target: 97, icon: ExclamationTriangleIcon },
    { id: 3, name: 'Mijoz qoniqishi', score: 94.2, target: 95, icon: ChatBubbleBottomCenterTextIcon },
    { id: 4, name: 'Jarayon samaradorligi', score: 92.8, target: 93, icon: ArrowPathIcon }
  ])
  
  const inspections = ref([])
  const pagination = reactive({
    page: 1,
    perPage: 10,
    total: 0
  })
  
  const qualityTrendData = computed(() => ({
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}-kun`),
    datasets: [
      {
        label: 'Sifat ko\'rsatkichi (%)',
        data: Array.from({ length: 30 }, () => 94 + Math.random() * 4),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Maqsad',
        data: Array(30).fill(98),
        borderColor: '#EF4444',
        borderDash: [5, 5],
        pointRadius: 0
      }
    ]
  }))
  
  const defectDistributionData = computed(() => ({
    labels: ['Dizayn', 'Estetik', 'Material', 'Qadoqlash', 'Boshqa'],
    datasets: [{
      data: [35.4, 25.2, 18.1, 14.2, 7.1],
      backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#6B7280']
    }]
  }))
  
  const defectCategoryData = computed(() => ({
    labels: ['O\'lcham', 'Sirt', 'Rang', 'Qadoqlash', 'Boshqa'],
    datasets: [{
      label: 'Defektlar soni',
      data: [45, 32, 23, 18, 9],
      backgroundColor: '#EF4444'
    }]
  }))
  
  const rootCauseData = computed(() => ({
    labels: ['Inson omili', 'Uskuna', 'Material', 'Jarayon', 'Atrof-muhit'],
    datasets: [{
      label: 'Hodisalar soni',
      data: [35, 28, 22, 18, 12],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280']
    }]
  }))
  
  const trendChartOptions = {
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
        beginAtZero: false,
        min: 90,
        max: 100
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
  
  const horizontalBarOptions = {
    ...barChartOptions,
    indexAxis: 'y'
  }
  
  const tableColumns = [
    { key: 'date', label: 'Sana', sortable: true },
    { key: 'product', label: 'Mahsulot' },
    { key: 'batch', label: 'Partiya' },
    { key: 'inspected', label: 'Tekshirildi', sortable: true },
    { key: 'defects', label: 'Defektlar', slot: true, sortable: true },
    { key: 'inspector', label: 'Tekshiruvchi' },
    { key: 'status', label: 'Holat', slot: true },
    { key: 'actions', label: '', slot: true }
  ]
  
  const filteredInspections = computed(() => {
    let filtered = inspections.value
  
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(i =>
        i.product.toLowerCase().includes(query) ||
        i.batch.toLowerCase().includes(query)
      )
    }
  
    if (statusFilter.value) {
      filtered = filtered.filter(i => i.status === statusFilter.value)
    }
  
    return filtered
  })
  
  const getQualityBgColor = (rate) => {
    if (rate >= 97) return 'bg-green-100'
    if (rate >= 95) return 'bg-blue-100'
    if (rate >= 90) return 'bg-yellow-100'
    return 'bg-red-100'
  }
  
  const getQualityIconColor = (rate) => {
    if (rate >= 97) return 'text-green-600'
    if (rate >= 95) return 'text-blue-600'
    if (rate >= 90) return 'text-yellow-600'
    return 'text-red-600'
  }
  
  const getQualityBadgeColor = (rate) => {
    if (rate >= 97) return 'green'
    if (rate >= 95) return 'blue'
    if (rate >= 90) return 'yellow'
    return 'red'
  }
  
  const getQualityStatus = (rate) => {
    if (rate >= 97) return 'A\'lo'
    if (rate >= 95) return 'Yaxshi'
    if (rate >= 90) return 'Qoniqarli'
    return 'Yomon'
  }
  
  const getInspectionIcon = (status) => {
    if (status === 'passed') return CheckCircleIcon
    if (status === 'failed') return XCircleIcon
    return ClockIcon
  }
  
  const getInspectionBadgeColor = (status) => {
    if (status === 'passed') return 'green'
    if (status === 'failed') return 'red'
    return 'yellow'
  }
  
  const getInspectionStatusText = (status) => {
    if (status === 'passed') return 'O\'tdi'
    if (status === 'failed') return 'Muvaffaqiyatsiz'
    return 'Qayta ishlash'
  }
  
  const getActionStatusColor = (status) => {
    if (status === 'Bajarildi') return 'green'
    if (status === 'Jarayonda') return 'blue'
    return 'gray'
  }
  
  const getSeverityColor = (severity) => {
    if (severity === 'Yuqori') return 'red'
    if (severity === 'O\'rtacha') return 'orange'
    return 'blue'
  }
  
  const loadInspections = async () => {
    loading.value = true
    try {
      const response = await qualityStore.fetchInspections({
        page: pagination.page,
        per_page: pagination.perPage,
        status: statusFilter.value,
        search: searchQuery.value
      })
      inspections.value = response.data
      pagination.total = response.total
    } catch (error) {
      console.error('Failed to load inspections:', error)
    } finally {
      loading.value = false
    }
  }
  
  const handleSort = (column) => {
    console.log('Sort by:', column)
  }
  
  const viewLineDetails = (line) => {
    router.push(`/production/lines/${line.id}`)
  }
  
  const viewInspectionDetails = (inspection) => {
    router.push(`/quality/inspections/${inspection.id}`)
  }
  
  const createCorrectiveAction = (inspection) => {
    router.push({
      name: 'quality-actions-create',
      query: { inspectionId: inspection.id }
    })
  }
  
  const createAction = () => {
    router.push({ name: 'quality-actions-create' })
  }
  
  const exportReport = async () => {
    try {
      await qualityStore.exportAnalytics({
        dateRange: dateRange.value,
        format: 'xlsx'
      })
    } catch (error) {
      console.error('Failed to export report:', error)
    }
  }
  
  onMounted(() => {
    loadInspections()
  })
  </script>