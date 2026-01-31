<template>
    <div class="space-y-6">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="$router.back()"
            class="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeftIcon class="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ machine.name }}</h1>
            <p class="text-gray-600 mt-1">{{ machine.code }} • {{ machine.manufacturer }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <Badge :color="getStatusColor(machine.status)">
            {{ getStatusText(machine.status) }}
          </Badge>
          <button
            @click="openMaintenanceModal"
            class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <WrenchScrewdriverIcon class="w-5 h-5 mr-2" />
            Texnik ko'rik
          </button>
          <button
            @click="openMenu"
            class="p-2 hover:bg-gray-100 rounded-lg"
          >
            <EllipsisVerticalIcon class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
  
      <!-- Status Alert -->
      <div
        v-if="machine.status === 'maintenance' || machine.status === 'stopped'"
        :class="[
          'p-4 rounded-lg border-2',
          machine.status === 'maintenance' ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'
        ]"
      >
        <div class="flex items-start space-x-3">
          <component
            :is="machine.status === 'maintenance' ? ExclamationTriangleIcon : XCircleIcon"
            :class="[
              'w-6 h-6 flex-shrink-0 mt-0.5',
              machine.status === 'maintenance' ? 'text-orange-600' : 'text-red-600'
            ]"
          />
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900 mb-1">
              {{ machine.status === 'maintenance' ? 'Texnik ko\'rikda' : 'To\'xtatilgan' }}
            </h3>
            <p class="text-sm text-gray-700">
              {{ machine.statusReason }}
            </p>
            <p class="text-xs text-gray-600 mt-1">
              Boshlanish: {{ machine.statusStartDate }} • Mas'ul: {{ machine.technician }}
            </p>
          </div>
        </div>
      </div>
  
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ish vaqti"
          :value="machine.metrics.uptime + '%'"
          :change="machine.metrics.uptimeChange"
          icon="ClockIcon"
          color="green"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Bu oy: {{ machine.metrics.uptimeHours }} soat
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Ishlab chiqarish"
          :value="machine.metrics.production"
          :change="machine.metrics.productionChange"
          icon="CubeIcon"
          color="blue"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Kun: {{ machine.metrics.dailyProduction }}
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Samaradorlik"
          :value="machine.metrics.efficiency + '%'"
          icon="ChartBarIcon"
          color="purple"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Maqsad: {{ machine.metrics.efficiencyTarget }}%
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Oxirgi texnik ko'rik"
          :value="machine.metrics.daysSinceMaintenance + ' kun'"
          icon="WrenchScrewdriverIcon"
          color="orange"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Keyingi: {{ machine.metrics.nextMaintenanceDate }}
            </p>
          </template>
        </StatCard>
      </div>
  
      <!-- Machine Info & Technical Specs -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Machine Image & Basic Info -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Asosiy ma'lumotlar</h3>
          </template>
          <div class="space-y-4">
            <div class="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <CogIcon class="w-24 h-24 text-gray-400" />
            </div>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Kod:</span>
                <span class="font-medium text-gray-900">{{ machine.code }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Ishlab chiqaruvchi:</span>
                <span class="font-medium text-gray-900">{{ machine.manufacturer }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Model:</span>
                <span class="font-medium text-gray-900">{{ machine.model }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Yil:</span>
                <span class="font-medium text-gray-900">{{ machine.year }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Seriya raqami:</span>
                <span class="font-medium text-gray-900">{{ machine.serialNumber }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Lokatsiya:</span>
                <span class="font-medium text-gray-900">{{ machine.location }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Bo'lim:</span>
                <span class="font-medium text-gray-900">{{ machine.department }}</span>
              </div>
            </div>
          </div>
        </BaseCard>
  
        <!-- Technical Specifications -->
        <BaseCard class="lg:col-span-2">
          <template #header>
            <h3 class="text-lg font-semibold">Texnik xususiyatlar</h3>
          </template>
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-3">
              <h4 class="font-semibold text-gray-900 text-sm">Umumiy</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Quvvat:</span>
                  <span class="font-medium">{{ machine.specs.power }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Kuchlanish:</span>
                  <span class="font-medium">{{ machine.specs.voltage }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">O'lcham:</span>
                  <span class="font-medium">{{ machine.specs.dimensions }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Og'irlik:</span>
                  <span class="font-medium">{{ machine.specs.weight }}</span>
                </div>
              </div>
            </div>
  
            <div class="space-y-3">
              <h4 class="font-semibold text-gray-900 text-sm">Ish parametrlari</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Tezlik:</span>
                  <span class="font-medium">{{ machine.specs.speed }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Harorat:</span>
                  <span class="font-medium">{{ machine.specs.temperature }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Bosim:</span>
                  <span class="font-medium">{{ machine.specs.pressure }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Quvvat:</span>
                  <span class="font-medium">{{ machine.specs.capacity }}</span>
                </div>
              </div>
            </div>
  
            <div class="col-span-2 space-y-3 pt-4 border-t">
              <h4 class="font-semibold text-gray-900 text-sm">Texnik ko'rik rejalari</h4>
              <div class="space-y-2">
                <div
                  v-for="schedule in machine.maintenanceSchedule"
                  :key="schedule.type"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ schedule.type }}</p>
                    <p class="text-xs text-gray-600">Har {{ schedule.interval }}</p>
                  </div>
                  <Badge :color="schedule.overdue ? 'red' : 'blue'">
                    {{ schedule.nextDate }}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Performance Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Uptime Trend -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Ish vaqti dinamikasi</h3>
              <select
                v-model="performancePeriod"
                class="text-sm px-3 py-1 border border-gray-300 rounded-lg"
              >
                <option value="7d">7 kun</option>
                <option value="30d">30 kun</option>
                <option value="90d">90 kun</option>
              </select>
            </div>
          </template>
          <div class="h-80">
            <LineChart :data="uptimeChartData" :options="chartOptions" />
          </div>
        </BaseCard>
  
        <!-- Production Output -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Ishlab chiqarish hajmi</h3>
          </template>
          <div class="h-80">
            <BarChart :data="productionChartData" :options="barChartOptions" />
          </div>
        </BaseCard>
      </div>
  
      <!-- Maintenance History & Issues -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Maintenance History -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Texnik ko'rik tarixi</h3>
              <button
                @click="viewAllMaintenance"
                class="text-sm text-blue-600 hover:text-blue-700"
              >
                Barchasini ko'rish
              </button>
            </div>
          </template>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="record in maintenanceHistory"
              :key="record.id"
              class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition cursor-pointer"
              @click="viewMaintenanceDetails(record)"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <component
                    :is="getMaintenanceIcon(record.type)"
                    :class="['w-5 h-5', getMaintenanceColor(record.type)]"
                  />
                  <div>
                    <p class="font-medium text-gray-900">{{ record.type }}</p>
                    <p class="text-xs text-gray-600">{{ record.date }}</p>
                  </div>
                </div>
                <Badge :color="record.status === 'completed' ? 'green' : 'orange'">
                  {{ record.status === 'completed' ? 'Bajarilgan' : 'Jarayonda' }}
                </Badge>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ record.description }}</p>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>Texnik: {{ record.technician }}</span>
                <span>Davomiyligi: {{ record.duration }}</span>
              </div>
            </div>
          </div>
        </BaseCard>
  
        <!-- Issues & Alerts -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Muammolar va ogohlantirishlar</h3>
              <Badge color="red">{{ issues.length }}</Badge>
            </div>
          </template>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="issue in issues"
              :key="issue.id"
              :class="[
                'p-4 rounded-lg border-2',
                issue.severity === 'critical' ? 'bg-red-50 border-red-200' :
                issue.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                'bg-yellow-50 border-yellow-200'
              ]"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <component
                    :is="getSeverityIcon(issue.severity)"
                    :class="['w-5 h-5', getSeverityColor(issue.severity)]"
                  />
                  <div>
                    <p class="font-medium text-gray-900">{{ issue.title }}</p>
                    <p class="text-xs text-gray-600">{{ issue.detectedDate }}</p>
                  </div>
                </div>
                <Badge :color="getSeverityBadgeColor(issue.severity)">
                  {{ issue.severity }}
                </Badge>
              </div>
              <p class="text-sm text-gray-700 mb-2">{{ issue.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-600">{{ issue.component }}</span>
                <button
                  @click="resolveIssue(issue)"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  Hal qilish
                </button>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Parts Inventory -->
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Ehtiyot qismlar</h3>
            <button
              @click="manageParts"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              Boshqarish
            </button>
          </div>
        </template>
        <DataTable :data="parts" :columns="partsColumns" :loading="false">
          <template #stock="{ row }">
            <Badge :color="row.stock <= row.minStock ? 'red' : 'green'">
              {{ row.stock }} dona
            </Badge>
          </template>
          <template #actions="{ row }">
            <button
              @click="orderPart(row)"
              class="text-blue-600 hover:text-blue-700 text-sm"
            >
              Buyurtma berish
            </button>
          </template>
        </DataTable>
      </BaseCard>
  
      <!-- Documents & Manuals -->
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Hujjatlar va qo'llanmalar</h3>
            <button
              @click="uploadDocument"
              class="flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              <ArrowUpTrayIcon class="w-4 h-4 mr-1" />
              Yuklash
            </button>
          </div>
        </template>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="doc in documents"
            :key="doc.id"
            class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition cursor-pointer"
            @click="openDocument(doc)"
          >
            <component :is="getDocumentIcon(doc.type)" class="w-8 h-8 text-blue-600 mb-2" />
            <p class="text-sm font-medium text-gray-900 truncate">{{ doc.name }}</p>
            <p class="text-xs text-gray-600">{{ doc.size }}</p>
          </div>
        </div>
      </BaseCard>
  
      <!-- Maintenance Modal -->
      <Modal v-model="showMaintenanceModal" title="Texnik ko'rik" size="lg">
        <form @submit.prevent="submitMaintenance" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Turi</label>
            <select v-model="maintenanceForm.type" class="w-full px-4 py-2 border rounded-lg" required>
              <option value="">Tanlang</option>
              <option value="Rejalashtirilgan">Rejalashtirilgan</option>
              <option value="Tezkor">Tezkor</option>
              <option value="Ta'mirlash">Ta'mirlash</option>
              <option value="Diagnostika">Diagnostika</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tavsif</label>
            <textarea
              v-model="maintenanceForm.description"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg"
              required
            ></textarea>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Texnik</label>
              <select v-model="maintenanceForm.technician" class="w-full px-4 py-2 border rounded-lg" required>
                <option value="">Tanlang</option>
                <option v-for="tech in technicians" :key="tech.id" :value="tech.id">
                  {{ tech.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rejalashtirilgan sana</label>
              <input
                v-model="maintenanceForm.scheduledDate"
                type="date"
                class="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
          </div>
  
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showMaintenanceModal = false"
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
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useMaintenanceStore } from '@/stores/maintenance'
  import {
    ArrowLeftIcon,
    EllipsisVerticalIcon,
    WrenchScrewdriverIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    ClockIcon,
    CubeIcon,
    ChartBarIcon,
    CogIcon,
    ArrowUpTrayIcon,
    CheckCircleIcon,
    ShieldExclamationIcon,
    DocumentTextIcon,
    DocumentIcon
  } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import LineChart from '@/components/common/charts/LineChart.vue'
  import BarChart from '@/components/common/charts/BarChart.vue'
  import DataTable from '@/components/common/tables/DataTable.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const route = useRoute()
  const router = useRouter()
  const maintenanceStore = useMaintenanceStore()
  
  const loading = ref(false)
  const saving = ref(false)
  const showMaintenanceModal = ref(false)
  const performancePeriod = ref('30d')
  
  const machine = ref({
    id: route.params.id,
    name: 'Ekstruziya mashinasi #1',
    code: 'EXT-001',
    manufacturer: 'German Tech GmbH',
    model: 'EXT-5000',
    year: 2020,
    serialNumber: 'SN-2020-EXT-5000-001',
    location: 'Ishlab chiqarish binosi A',
    department: 'Ekstruziya bo\'limi',
    status: 'active', // active, maintenance, stopped
    statusReason: 'Motor harorati yuqori',
    statusStartDate: '2024-01-25 10:30',
    technician: 'Sardor Toshmatov',
    metrics: {
      uptime: 96.5,
      uptimeChange: 2.1,
      uptimeHours: 696,
      production: '12,543',
      productionChange: 8.5,
      dailyProduction: '425',
      efficiency: 94.2,
      efficiencyTarget: 95,
      daysSinceMaintenance: 12,
      nextMaintenanceDate: '2024-02-05'
    },
    specs: {
      power: '150 kW',
      voltage: '380V 3-faza',
      dimensions: '8m x 2.5m x 3m',
      weight: '5,500 kg',
      speed: '0-100 m/min',
      temperature: '150-300°C',
      pressure: '0-250 bar',
      capacity: '500 kg/soat'
    },
    maintenanceSchedule: [
      { type: 'Kunlik tekshiruv', interval: '1 kun', nextDate: 'Bugun', overdue: false },
      { type: 'Haftalik texnik ko\'rik', interval: '7 kun', nextDate: '2024-02-01', overdue: false },
      { type: 'Oylik to\'liq tekshiruv', interval: '30 kun', nextDate: '2024-02-15', overdue: false },
      { type: 'Yillik kapital ta\'mir', interval: '365 kun', nextDate: '2024-12-20', overdue: false }
    ]
  })
  
  const maintenanceHistory = ref([
    {
      id: 1,
      type: 'Rejalashtirilgan texnik ko\'rik',
      date: '2024-01-15',
      description: 'Oylik to\'liq tekshiruv va yog\'lash',
      technician: 'Sardor Toshmatov',
      duration: '3 soat',
      status: 'completed'
    },
    {
      id: 2,
      type: 'Tezkor ta\'mirlash',
      date: '2024-01-10',
      description: 'Motor podshipnikini almashtirish',
      technician: 'Jahongir Aliyev',
      duration: '2 soat',
      status: 'completed'
    },
    {
      id: 3,
      type: 'Diagnostika',
      date: '2024-01-05',
      description: 'Elektr tizimini tekshirish',
      technician: 'Bekzod Nazarov',
      duration: '1.5 soat',
      status: 'completed'
    }
  ])
  
  const issues = ref([
    {
      id: 1,
      title: 'Motor harorati yuqori',
      description: 'Motor harorati standart ko\'rsatkichdan 15°C yuqori',
      severity: 'high',
      component: 'Asosiy motor',
      detectedDate: '2024-01-27 09:15'
    },
    {
      id: 2,
      title: 'Shovqin darajasi oshgan',
      description: 'Reduktor qismida g\'ayritabiiy shovqin',
      severity: 'medium',
      component: 'Reduktor',
      detectedDate: '2024-01-26 14:30'
    }
  ])
  
  const parts = ref([
    { id: 1, name: 'Motor podshipnigi', partNumber: 'BRG-001', stock: 3, minStock: 2, price: 150000 },
    { id: 2, name: 'Qizitish elementi', partNumber: 'HTR-002', stock: 1, minStock: 2, price: 250000 },
    { id: 3, name: 'Hidravlik shlang', partNumber: 'HSE-003', stock: 5, minStock: 3, price: 50000 }
  ])
  
  const documents = ref([
    { id: 1, name: 'Foydalanuvchi qo\'llanmasi', type: 'manual', size: '15.2 MB' },
    { id: 2, name: 'Texnik passport', type: 'document', size: '2.8 MB' },
    { id: 3, name: 'Elektr sxema', type: 'diagram', size: '5.4 MB' },
    { id: 4, name: 'Texnik ko\'rik jadvali', type: 'document', size: '1.1 MB' }
  ])
  
  const technicians = ref([
    { id: 1, name: 'Sardor Toshmatov' },
    { id: 2, name: 'Jahongir Aliyev' },
    { id: 3, name: 'Bekzod Nazarov' }
  ])
  
  const maintenanceForm = reactive({
    type: '',
    description: '',
    technician: '',
    scheduledDate: ''
  })
  
  const partsColumns = [
    { key: 'name', label: 'Nomi' },
    { key: 'partNumber', label: 'Qism raqami' },
    { key: 'stock', label: 'Qoldiq', slot: true },
    { key: 'price', label: 'Narx' },
    { key: 'actions', label: '', slot: true }
  ]
  
  const uptimeChartData = computed(() => ({
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    datasets: [{
      label: 'Ish vaqti (%)',
      data: Array.from({ length: 30 }, () => 93 + Math.random() * 5),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }))
  
  const productionChartData = computed(() => ({
    labels: ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'],
    datasets: [{
      label: 'Ishlab chiqarish',
      data: [420, 435, 425, 410, 430, 415, 0],
      backgroundColor: '#3B82F6'
    }]
  }))
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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
  
  const getStatusColor = (status) => {
    if (status === 'active') return 'green'
    if (status === 'maintenance') return 'orange'
    return 'red'
  }
  
  const getStatusText = (status) => {
    if (status === 'active') return 'Faol'
    if (status === 'maintenance') return 'Texnik ko\'rikda'
    return 'To\'xtatilgan'
  }
  
  const getMaintenanceIcon = (type) => {
    if (type.includes('Rejalashtirilgan')) return ClockIcon
    if (type.includes('Tezkor')) return ExclamationTriangleIcon
    if (type.includes('Ta\'mirlash')) return WrenchScrewdriverIcon
    return CheckCircleIcon
  }
  
  const getMaintenanceColor = (type) => {
    if (type.includes('Rejalashtirilgan')) return 'text-blue-600'
    if (type.includes('Tezkor')) return 'text-orange-600'
    if (type.includes('Ta\'mirlash')) return 'text-red-600'
    return 'text-green-600'
  }
  
  const getSeverityIcon = (severity) => {
    if (severity === 'critical') return XCircleIcon
    if (severity === 'high') return ExclamationTriangleIcon
    return ShieldExclamationIcon
  }
  
  const getSeverityColor = (severity) => {
    if (severity === 'critical') return 'text-red-600'
    if (severity === 'high') return 'text-orange-600'
    return 'text-yellow-600'
  }
  
  const getSeverityBadgeColor = (severity) => {
    if (severity === 'critical') return 'red'
    if (severity === 'high') return 'orange'
    return 'yellow'
  }
  
  const getDocumentIcon = (type) => {
    if (type === 'manual') return DocumentTextIcon
    return DocumentIcon
  }
  
  const openMaintenanceModal = () => {
    showMaintenanceModal.value = true
  }
  
  const submitMaintenance = async () => {
    saving.value = true
    try {
      await maintenanceStore.createMaintenance({
        machineId: machine.value.id,
        ...maintenanceForm
      })
      showMaintenanceModal.value = false
      // Reload maintenance history
    } finally {
      saving.value = false
    }
  }
  
  const viewMaintenanceDetails = (record) => {
    router.push(`/maintenance/records/${record.id}`)
  }
  
  const viewAllMaintenance = () => {
    router.push({
      name: 'maintenance-history',
      query: { machineId: machine.value.id }
    })
  }
  
  const resolveIssue = (issue) => {
    router.push({
      name: 'maintenance-requests-create',
      query: { issueId: issue.id, machineId: machine.value.id }
    })
  }
  
  const manageParts = () => {
    router.push(`/maintenance/machines/${machine.value.id}/parts`)
  }
  
  const orderPart = (part) => {
    router.push({
      name: 'warehouse-requests',
      query: { partId: part.id }
    })
  }
  
  const uploadDocument = () => {
    // Implement document upload
  }
  
  const openDocument = (doc) => {
    // Implement document viewer
  }
  
  const openMenu = () => {
    // Implement context menu
  }
  
  onMounted(async () => {
    loading.value = true
    try {
      // Load machine details
    } finally {
      loading.value = false
    }
  })
  </script>