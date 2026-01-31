<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Samaradorlik Tahlili</h1>
          <p class="text-gray-600 mt-1">Umumiy samaradorlik va mahsuldorlik ko'rsatkichlari</p>
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
          title="OEE (Overall Equipment Effectiveness)"
          :value="stats.oee + '%'"
          :change="stats.oeeChange"
          icon="ChartBarIcon"
          color="blue"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Maqsad: {{ stats.oeeTarget }}%
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Mavjudlik"
          :value="stats.availability + '%'"
          :change="stats.availabilityChange"
          icon="ClockIcon"
          color="green"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Ish vaqti: {{ stats.operatingHours }}h
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Unumdorlik"
          :value="stats.performance + '%'"
          :change="stats.performanceChange"
          icon="BoltIcon"
          color="purple"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Tezlik: {{ stats.speed }}%
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Sifat"
          :value="stats.quality + '%'"
          :change="stats.qualityChange"
          icon="ShieldCheckIcon"
          color="orange"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Defekt: {{ stats.defectRate }}%
            </p>
          </template>
        </StatCard>
      </div>
  
      <!-- OEE Breakdown & Trend -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- OEE Components Breakdown -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">OEE Tarkibi</h3>
          </template>
          <div class="space-y-4">
            <div
              v-for="component in oeeComponents"
              :key="component.name"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <div
                    :class="[
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      component.bgColor
                    ]"
                  >
                    <component :is="component.icon" :class="['w-5 h-5', component.iconColor]" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ component.name }}</p>
                    <p class="text-xs text-gray-600">{{ component.description }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-gray-900">{{ component.value }}%</p>
                  <Badge :color="getPerformanceBadgeColor(component.value, component.target)">
                    {{ component.value >= component.target ? '✓' : '⚠' }}
                  </Badge>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span>Maqsad: {{ component.target }}%</span>
                <span :class="component.change >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ component.change >= 0 ? '↑' : '↓' }} {{ Math.abs(component.change) }}%
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  :class="[
                    'h-2 rounded-full transition-all',
                    component.value >= component.target ? 'bg-green-600' : 'bg-orange-600'
                  ]"
                  :style="{ width: `${component.value}%` }"
                ></div>
              </div>
            </div>
          </div>
        </BaseCard>
  
        <!-- OEE Trend -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">OEE Dinamikasi</h3>
              <div class="flex space-x-2">
                <button
                  v-for="period in ['7d', '30d', '90d']"
                  :key="period"
                  @click="oeePeriod = period"
                  :class="[
                    'px-3 py-1 text-sm rounded-lg',
                    oeePeriod === period
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
            <LineChart :data="oeeTrendData" :options="oeeChartOptions" />
          </div>
        </BaseCard>
      </div>
  
      <!-- Downtime Analysis & Production Losses -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Downtime by Category -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">To'xtash sabablari</h3>
          </template>
          <div class="h-80">
            <DoughnutChart :data="downtimeData" :options="pieChartOptions" />
          </div>
        </BaseCard>
  
        <!-- Production Losses -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Ishlab chiqarish yo'qotishlari</h3>
          </template>
          <div class="space-y-3">
            <div
              v-for="loss in productionLosses"
              :key="loss.id"
              class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <div
                    :class="[
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      loss.bgColor
                    ]"
                  >
                    <component :is="loss.icon" :class="['w-5 h-5', loss.iconColor]" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ loss.category }}</p>
                    <p class="text-xs text-gray-600">{{ loss.description }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-red-600">{{ loss.hours }}h</p>
                  <p class="text-xs text-gray-600">{{ loss.percentage }}%</p>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-600">
                <span>{{ loss.occurrences }} hodisa</span>
                <span>Qiymat: {{ formatCurrency(loss.cost) }}</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Department & Line Efficiency -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Department Efficiency -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Bo'limlar bo'yicha samaradorlik</h3>
          </template>
          <div class="h-80">
            <BarChart :data="departmentEfficiencyData" :options="barChartOptions" />
          </div>
        </BaseCard>
  
        <!-- Production Line Efficiency -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Liniyalar bo'yicha samaradorlik</h3>
          </template>
          <div class="space-y-3 max-h-80 overflow-y-auto">
            <div
              v-for="line in productionLines"
              :key="line.id"
              class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition cursor-pointer"
              @click="viewLineDetails(line)"
            >
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">{{ line.name }}</p>
                  <p class="text-sm text-gray-600">{{ line.product }}</p>
                </div>
                <Badge :color="getEfficiencyColor(line.oee)">
                  OEE: {{ line.oee }}%
                </Badge>
              </div>
              <div class="grid grid-cols-3 gap-3 text-sm mb-2">
                <div>
                  <p class="text-gray-600 text-xs">Mavjudlik</p>
                  <p class="font-semibold text-gray-900">{{ line.availability }}%</p>
                </div>
                <div>
                  <p class="text-gray-600 text-xs">Unumdorlik</p>
                  <p class="font-semibold text-gray-900">{{ line.performance }}%</p>
                </div>
                <div>
                  <p class="text-gray-600 text-xs">Sifat</p>
                  <p class="font-semibold text-gray-900">{{ line.quality }}%</p>
                </div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  :class="[
                    'h-2 rounded-full',
                    getEfficiencyBarColor(line.oee)
                  ]"
                  :style="{ width: `${line.oee}%` }"
                ></div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Shift Performance & Worker Productivity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Shift Performance -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Smenalar bo'yicha</h3>
          </template>
          <div class="space-y-4">
            <div
              v-for="shift in shifts"
              :key="shift.id"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="font-medium text-gray-900">{{ shift.name }}</p>
                  <p class="text-sm text-gray-600">{{ shift.time }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xl font-bold text-gray-900">{{ shift.efficiency }}%</p>
                  <p class="text-xs text-gray-600">{{ shift.workers }} ishchi</p>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-3 text-xs mb-2">
                <div>
                  <p class="text-gray-600">Ishlab chiqarish</p>
                  <p class="font-semibold text-gray-900">{{ shift.output }}</p>
                </div>
                <div>
                  <p class="text-gray-600">To'xtashlar</p>
                  <p class="font-semibold text-red-600">{{ shift.downtime }}h</p>
                </div>
                <div>
                  <p class="text-gray-600">Defektlar</p>
                  <p class="font-semibold text-orange-600">{{ shift.defects }}</p>
                </div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full"
                  :style="{ width: `${shift.efficiency}%` }"
                ></div>
              </div>
            </div>
          </div>
        </BaseCard>
  
        <!-- Top Performers -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Eng samarali ishchilar</h3>
              <Badge color="blue">Bu oy</Badge>
            </div>
          </template>
          <div class="space-y-3">
            <div
              v-for="(worker, index) in topWorkers"
              :key="worker.id"
              class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
            >
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  {{ index + 1 }}
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {{ worker.name.split(' ').map(n => n[0]).join('') }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ worker.name }}</p>
                    <p class="text-sm text-gray-600">{{ worker.position }}</p>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-gray-900">{{ worker.efficiency }}%</p>
                <p class="text-xs text-gray-600">{{ worker.output }} dona</p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Bottleneck Analysis & Improvement Opportunities -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Bottlenecks -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Tor bo'g'inlar</h3>
          </template>
          <div class="space-y-3">
            <div
              v-for="bottleneck in bottlenecks"
              :key="bottleneck.id"
              class="p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <ExclamationTriangleIcon class="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p class="font-medium text-gray-900">{{ bottleneck.title }}</p>
                    <p class="text-sm text-gray-600">{{ bottleneck.location }}</p>
                  </div>
                </div>
                <Badge color="red">{{ bottleneck.impact }}%</Badge>
              </div>
              <p class="text-sm text-gray-700 mb-2">{{ bottleneck.description }}</p>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600">Yo'qotish: {{ bottleneck.loss }}h/kun</span>
                <button
                  @click="viewBottleneckDetails(bottleneck)"
                  class="text-blue-600 hover:text-blue-700"
                >
                  Batafsil →
                </button>
              </div>
            </div>
          </div>
        </BaseCard>
  
        <!-- Improvement Opportunities -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Yaxshilash imkoniyatlari</h3>
              <button
                @click="createImprovementPlan"
                class="text-sm text-blue-600 hover:text-blue-700"
              >
                + Yangi reja
              </button>
            </div>
          </template>
          <div class="space-y-3">
            <div
              v-for="opportunity in improvements"
              :key="opportunity.id"
              class="p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <LightBulbIcon class="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p class="font-medium text-gray-900">{{ opportunity.title }}</p>
                    <p class="text-sm text-gray-600">{{ opportunity.area }}</p>
                  </div>
                </div>
                <Badge color="green">+{{ opportunity.potentialGain }}%</Badge>
              </div>
              <p class="text-sm text-gray-700 mb-2">{{ opportunity.description }}</p>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600">ROI: {{ opportunity.roi }} oy</span>
                <span class="text-green-600 font-medium">Tejamkorlik: {{ formatCurrency(opportunity.savings) }}/oy</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Detailed Metrics Table -->
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Batafsil ko'rsatkichlar</h3>
            <div class="flex items-center space-x-3">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Qidirish..."
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <select
                v-model="metricFilter"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Barcha ko'rsatkichlar</option>
                <option value="high">Yuqori samaradorlik</option>
                <option value="medium">O'rtacha</option>
                <option value="low">Past</option>
              </select>
            </div>
          </div>
        </template>
  
        <DataTable
          :data="filteredMetrics"
          :columns="tableColumns"
          :loading="loading"
          @sort="handleSort"
        >
          <template #oee="{ row }">
            <div class="flex items-center space-x-2">
              <span class="font-medium">{{ row.oee }}%</span>
              <Badge :color="getEfficiencyColor(row.oee)">
                {{ getEfficiencyLabel(row.oee) }}
              </Badge>
            </div>
          </template>
  
          <template #trend="{ row }">
            <div class="flex items-center space-x-1">
              <component
                :is="row.trend >= 0 ? ArrowUpIcon : ArrowDownIcon"
                :class="[
                  'w-4 h-4',
                  row.trend >= 0 ? 'text-green-600' : 'text-red-600'
                ]"
              />
              <span :class="row.trend >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ Math.abs(row.trend) }}%
              </span>
            </div>
          </template>
  
          <template #actions="{ row }">
            <button
              @click="viewDetails(row)"
              class="text-blue-600 hover:text-blue-700"
            >
              Ko'rish
            </button>
          </template>
        </DataTable>
  
        <Pagination
          v-model="pagination.page"
          :total="pagination.total"
          :per-page="pagination.perPage"
          @change="loadMetrics"
        />
      </BaseCard>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useEfficiencyStore } from '@/stores/efficiency'
  import { useRouter } from 'vue-router'
  import {
    ArrowDownTrayIcon,
    ChartBarIcon,
    ClockIcon,
    BoltIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    LightBulbIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    CogIcon,
    WrenchScrewdriverIcon,
    UserGroupIcon
  } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import LineChart from '@/components/common/charts/LineChart.vue'
  import DoughnutChart from '@/components/common/charts/DoughnutChart.vue'
  import BarChart from '@/components/common/charts/BarChart.vue'
  import DataTable from '@/components/common/tables/DataTable.vue'
  import Pagination from '@/components/common/navigation/Pagination.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const efficiencyStore = useEfficiencyStore()
  const router = useRouter()
  
  const loading = ref(false)
  const dateRange = ref('month')
  const oeePeriod = ref('30d')
  const searchQuery = ref('')
  const metricFilter = ref('')
  
  const stats = ref({
    oee: 85.4,
    oeeChange: 3.2,
    oeeTarget: 90,
    availability: 92.5,
    availabilityChange: 1.8,
    operatingHours: 668,
    performance: 94.2,
    performanceChange: 2.5,
    speed: 96.8,
    quality: 97.8,
    qualityChange: 0.5,
    defectRate: 2.2
  })
  
  const oeeComponents = ref([
    {
      name: 'Mavjudlik',
      description: 'Ish vaqti / Rejalashtirilgan vaqt',
      value: 92.5,
      target: 95,
      change: 1.8,
      icon: ClockIcon,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      name: 'Unumdorlik',
      description: 'Haqiqiy tezlik / Nominal tezlik',
      value: 94.2,
      target: 95,
      change: 2.5,
      icon: BoltIcon,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      name: 'Sifat',
      description: 'Yaxshi mahsulotlar / Jami mahsulotlar',
      value: 97.8,
      target: 98,
      change: 0.5,
      icon: ShieldCheckIcon,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ])
  
  const productionLosses = ref([
    {
      id: 1,
      category: 'Rejalashtirilgan to\'xtashlar',
      description: 'Texnik ko\'rik va smena almashinuvi',
      hours: 48,
      percentage: 35,
      occurrences: 156,
      cost: 12000000,
      icon: WrenchScrewdriverIcon,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 2,
      category: 'Rejalashtirilmagan to\'xtashlar',
      description: 'Nosozliklar va tuzatishlar',
      hours: 32,
      percentage: 23,
      occurrences: 87,
      cost: 15000000,
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      id: 3,
      category: 'Tezlik yo\'qotishlari',
      description: 'Sekinlashtirish va kichik to\'xtashlar',
      hours: 28,
      percentage: 20,
      occurrences: 245,
      cost: 8000000,
      icon: BoltIcon,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      id: 4,
      category: 'Sifat yo\'qotishlari',
      description: 'Defektlar va qayta ishlash',
      hours: 30,
      percentage: 22,
      occurrences: 198,
      cost: 10000000,
      icon: ShieldCheckIcon,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ])
  
  const productionLines = ref([
    {
      id: 1,
      name: 'Liniya #1',
      product: 'Plastik idish',
      oee: 88.5,
      availability: 94.2,
      performance: 95.8,
      quality: 98.1
    },
    {
      id: 2,
      name: 'Liniya #2',
      product: 'Qadoqlash',
      oee: 85.3,
      availability: 91.5,
      performance: 94.2,
      quality: 98.8
    },
    {
      id: 3,
      name: 'Liniya #3',
      product: 'Konteyner',
      oee: 82.7,
      availability: 89.8,
      performance: 92.5,
      quality: 99.5
    }
  ])
  
  const shifts = ref([
    {
      id: 1,
      name: '1-smena',
      time: '08:00 - 16:00',
      workers: 32,
      efficiency: 87.5,
      output: '4,250',
      downtime: 2.5,
      defects: 45
    },
    {
      id: 2,
      name: '2-smena',
      time: '16:00 - 00:00',
      workers: 28,
      efficiency: 84.2,
      output: '3,850',
      downtime: 3.2,
      defects: 52
    },
    {
      id: 3,
      name: 'Tungi smena',
      time: '00:00 - 08:00',
      workers: 15,
      efficiency: 81.8,
      output: '2,100',
      downtime: 2.8,
      defects: 38
    }
  ])
  
  const topWorkers = ref([
    { id: 1, name: 'Ali Valiyev', position: 'Ustachi', efficiency: 96.5, output: 1250 },
    { id: 2, name: 'Nodira Karimova', position: 'Operator', efficiency: 95.2, output: 1180 },
    { id: 3, name: 'Sardor Toshmatov', position: 'Texnik', efficiency: 94.8, output: 1150 },
    { id: 4, name: 'Jahongir Aliyev', position: 'Nazoratchi', efficiency: 93.5, output: 1100 },
    { id: 5, name: 'Dilnoza Ahmedova', position: 'Operator', efficiency: 92.8, output: 1080 }
  ])
  
  const bottlenecks = ref([
    {
      id: 1,
      title: 'Qadoqlash liniyasi',
      location: 'Liniya #2',
      description: 'Qadoqlash tezligi ishlab chiqarish tezligidan sekinroq',
      impact: 15,
      loss: 2.5
    },
    {
      id: 2,
      title: 'Material kutish vaqti',
      location: 'Ombor',
      description: 'Xom ashyo yetkazib berishda kechikishlar',
      impact: 12,
      loss: 1.8
    }
  ])
  
  const improvements = ref([
    {
      id: 1,
      title: 'Avtomatlashtirish',
      area: 'Qadoqlash',
      description: 'Qadoqlash jarayonini avtomatlashtirish',
      potentialGain: 15,
      roi: 18,
      savings: 8500000
    },
    {
      id: 2,
      title: 'Texnik ko\'rik optimizatsiyasi',
      area: 'Texnik xizmat',
      description: 'Oldindan ko\'rish tizimini joriy etish',
      potentialGain: 8,
      roi: 12,
      savings: 5200000
    }
  ])
  
  const metrics = ref([])
  const pagination = reactive({
    page: 1,
    perPage: 10,
    total: 0
  })
  
  const oeeTrendData = computed(() => ({
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    datasets: [
      {
        label: 'OEE',
        data: Array.from({ length: 30 }, () => 82 + Math.random() * 8),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Maqsad',
        data: Array(30).fill(90),
        borderColor: '#10B981',
        borderDash: [5, 5],
        pointRadius: 0
      }
    ]
  }))
  
  const downtimeData = computed(() => ({
    labels: ['Rejalashtirilgan', 'Nosozliklar', 'Tezlik yo\'qotish', 'Sifat yo\'qotish'],
    datasets: [{
      data: [35, 23, 20, 22],
      backgroundColor: ['#3B82F6', '#EF4444', '#F59E0B', '#FBBF24']
    }]
  }))
  
  const departmentEfficiencyData = computed(() => ({
    labels: ['Ekstruziya', 'Qadoqlash', 'Sifat nazorat', 'Ombor'],
    datasets: [{
      label: 'Samaradorlik (%)',
      data: [88.5, 82.3, 95.2, 91.7],
      backgroundColor: '#3B82F6'
    }]
  }))
  
  const oeeChartOptions = {
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
        min: 70,
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
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
  
  const tableColumns = [
    { key: 'name', label: 'Nomi', sortable: true },
    { key: 'department', label: 'Bo\'lim' },
    { key: 'oee', label: 'OEE', slot: true, sortable: true },
    { key: 'availability', label: 'Mavjudlik', sortable: true },
    { key: 'performance', label: 'Unumdorlik', sortable: true },
    { key: 'quality', label: 'Sifat', sortable: true },
    { key: 'trend', label: 'Trend', slot: true },
    { key: 'actions', label: '', slot: true }
  ]
  
  const filteredMetrics = computed(() => {
    let filtered = metrics.value
  
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.department.toLowerCase().includes(query)
      )
    }
  
    if (metricFilter.value) {
      if (metricFilter.value === 'high') {
        filtered = filtered.filter(m => m.oee >= 85)
      } else if (metricFilter.value === 'medium') {
        filtered = filtered.filter(m => m.oee >= 70 && m.oee < 85)
      } else if (metricFilter.value === 'low') {
        filtered = filtered.filter(m => m.oee < 70)
      }
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
  
  const getPerformanceBadgeColor = (value, target) => {
    if (value >= target) return 'green'
    if (value >= target - 5) return 'blue'
    return 'orange'
  }
  
  const getEfficiencyColor = (value) => {
    if (value >= 85) return 'green'
    if (value >= 70) return 'blue'
    return 'red'
  }
  
  const getEfficiencyLabel = (value) => {
    if (value >= 85) return 'A\'lo'
    if (value >= 70) return 'Yaxshi'
    return 'Qoniqarsiz'
  }
  
  const getEfficiencyBarColor = (value) => {
    if (value >= 85) return 'bg-green-600'
    if (value >= 70) return 'bg-blue-600'
    return 'bg-red-600'
  }
  
  const loadMetrics = async () => {
    loading.value = true
    try {
      const response = await efficiencyStore.fetchMetrics({
        page: pagination.page,
        per_page: pagination.perPage,
        filter: metricFilter.value,
        search: searchQuery.value
      })
      metrics.value = response.data
      pagination.total = response.total
    } catch (error) {
      console.error('Failed to load metrics:', error)
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
  
  const viewBottleneckDetails = (bottleneck) => {
    router.push(`/analytics/efficiency/bottlenecks/${bottleneck.id}`)
  }
  
  const createImprovementPlan = () => {
    router.push({ name: 'efficiency-improvement-create' })
  }
  
  const viewDetails = (metric) => {
    router.push(`/analytics/efficiency/${metric.id}`)
  }
  
  const exportReport = async () => {
    try {
      await efficiencyStore.exportAnalytics({
        dateRange: dateRange.value,
        format: 'xlsx'
      })
    } catch (error) {
      console.error('Failed to export report:', error)
    }
  }
  
  onMounted(() => {
    loadMetrics()
  })
  </script>