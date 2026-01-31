<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="$router.back()"
            class="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeftIcon class="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div class="flex items-center space-x-3">
              <h1 class="text-2xl font-bold text-gray-900">{{ shift.shiftName }}</h1>
              <Badge :color="getStatusColor(shift.status)">
                {{ getStatusText(shift.status) }}
              </Badge>
            </div>
            <p class="text-gray-600 mt-1">
              {{ shift.date }} • {{ shift.startTime }} - {{ shift.endTime }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="downloadReport"
            class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            <ArrowDownTrayIcon class="w-5 h-5 inline mr-2" />
            Hisobot
          </button>
          <button
            v-if="canEdit"
            @click="editShift"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <PencilIcon class="w-5 h-5 inline mr-2" />
            Tahrirlash
          </button>
          <button
            @click="showMoreMenu = !showMoreMenu"
            class="p-2 hover:bg-gray-100 rounded-lg"
          >
            <EllipsisVerticalIcon class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
  
      <!-- Performance Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ishlab chiqarish"
          :value="shift.totalProduction"
          :change="shift.productionChange"
          icon="CubeIcon"
          color="blue"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Reja: {{ shift.plannedProduction }}
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Samaradorlik"
          :value="shift.efficiency + '%'"
          :change="shift.efficiencyChange"
          icon="ChartBarIcon"
          :color="shift.efficiency >= 80 ? 'green' : shift.efficiency >= 60 ? 'orange' : 'red'"
        />
  
        <StatCard
          title="Sifat"
          :value="shift.qualityRate + '%'"
          icon="ShieldCheckIcon"
          :color="shift.qualityRate >= 95 ? 'green' : 'orange'"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Nosoz: {{ shift.defectCount }} ta
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="To'xtash vaqti"
          :value="shift.downtimeMinutes + ' min'"
          icon="ClockIcon"
          :color="shift.downtimeMinutes > 60 ? 'red' : shift.downtimeMinutes > 30 ? 'orange' : 'green'"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              {{ shift.downtimeCount }} ta to'xtash
            </p>
          </template>
        </StatCard>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Shift Information -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Smena ma'lumotlari</h3>
            </template>
  
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Sana</p>
                  <p class="font-medium text-gray-900">{{ shift.date }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Vaqt oralig'i</p>
                  <p class="font-medium text-gray-900">{{ shift.startTime }} - {{ shift.endTime }}</p>
                </div>
              </div>
  
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Smena mudiri</p>
                  <p class="font-medium text-gray-900">{{ shift.supervisor }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Ishchilar soni</p>
                  <p class="font-medium text-gray-900">{{ shift.workerCount }} kishi</p>
                </div>
              </div>
  
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Ishlaydigan mashinalar</p>
                  <p class="font-medium text-gray-900">{{ shift.machineCount }} ta</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Ish soatlari</p>
                  <p class="font-medium text-gray-900">{{ shift.workHours }} soat</p>
                </div>
              </div>
            </div>
          </BaseCard>
  
          <!-- Production Details -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Ishlab chiqarish tafsilotlari</h3>
            </template>
  
            <div class="space-y-3">
              <div
                v-for="product in shift.productionDetails"
                :key="product.id"
                class="p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p class="font-medium text-gray-900">{{ product.name }}</p>
                    <p class="text-sm text-gray-600">SKU: {{ product.sku }}</p>
                  </div>
                  <Badge :color="product.completed >= product.planned ? 'green' : 'orange'">
                    {{ Math.round((product.completed / product.planned) * 100) }}%
                  </Badge>
                </div>
  
                <div class="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p class="text-gray-600">Reja:</p>
                    <p class="font-bold text-gray-900">{{ product.planned }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Bajarildi:</p>
                    <p class="font-bold text-green-600">{{ product.completed }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Nosoz:</p>
                    <p class="font-bold text-red-600">{{ product.defective }}</p>
                  </div>
                </div>
  
                <div class="mt-3">
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      :class="[
                        'h-2 rounded-full transition-all',
                        product.completed >= product.planned ? 'bg-green-600' : 'bg-blue-600'
                      ]"
                      :style="{ width: `${Math.min((product.completed / product.planned) * 100, 100)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
  
          <!-- Machine Performance -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Mashina ishlashi</h3>
            </template>
  
            <div class="space-y-3">
              <div
                v-for="machine in shift.machinePerformance"
                :key="machine.id"
                class="p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <p class="font-medium text-gray-900">{{ machine.name }}</p>
                    <p class="text-sm text-gray-600">{{ machine.code }}</p>
                  </div>
                  <Badge :color="machine.status === 'running' ? 'green' : machine.status === 'idle' ? 'orange' : 'red'">
                    {{ getMachineStatusText(machine.status) }}
                  </Badge>
                </div>
  
                <div class="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p class="text-gray-600">Ish vaqti:</p>
                    <p class="font-medium text-gray-900">{{ machine.runtime }}h</p>
                  </div>
                  <div>
                    <p class="text-gray-600">To'xtash:</p>
                    <p class="font-medium text-orange-600">{{ machine.downtime }}m</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Ishlab chiqarish:</p>
                    <p class="font-medium text-gray-900">{{ machine.output }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">OEE:</p>
                    <p :class="[
                      'font-medium',
                      machine.oee >= 80 ? 'text-green-600' : machine.oee >= 60 ? 'text-orange-600' : 'text-red-600'
                    ]">
                      {{ machine.oee }}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
  
          <!-- Downtime Events -->
          <BaseCard v-if="shift.downtimeEvents && shift.downtimeEvents.length > 0">
            <template #header>
              <h3 class="text-lg font-semibold">To'xtashlar</h3>
            </template>
  
            <div class="space-y-2">
              <div
                v-for="event in shift.downtimeEvents"
                :key="event.id"
                class="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center space-x-2">
                    <ExclamationTriangleIcon class="w-5 h-5 text-red-600" />
                    <p class="font-medium text-gray-900">{{ event.reason }}</p>
                  </div>
                  <span class="text-sm text-red-600 font-medium">{{ event.duration }}m</span>
                </div>
                <p class="text-sm text-gray-600">{{ event.machine }} • {{ event.time }}</p>
                <p v-if="event.notes" class="text-sm text-gray-700 mt-1">{{ event.notes }}</p>
              </div>
            </div>
          </BaseCard>
  
          <!-- Quality Issues -->
          <BaseCard v-if="shift.qualityIssues && shift.qualityIssues.length > 0">
            <template #header>
              <h3 class="text-lg font-semibold">Sifat muammolari</h3>
            </template>
  
            <div class="space-y-2">
              <div
                v-for="issue in shift.qualityIssues"
                :key="issue.id"
                class="p-3 bg-orange-50 border border-orange-200 rounded-lg"
              >
                <div class="flex items-start justify-between mb-2">
                  <p class="font-medium text-gray-900">{{ issue.defectType }}</p>
                  <span class="text-sm text-orange-600 font-medium">{{ issue.count }} ta</span>
                </div>
                <p class="text-sm text-gray-600">{{ issue.product }} • {{ issue.time }}</p>
                <p v-if="issue.action" class="text-sm text-gray-700 mt-1">Chora: {{ issue.action }}</p>
              </div>
            </div>
          </BaseCard>
  
          <!-- Notes -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Izohlar</h3>
            </template>
  
            <div v-if="shift.notes" class="text-gray-700 whitespace-pre-line">
              {{ shift.notes }}
            </div>
            <div v-else class="text-center py-4 text-gray-500 text-sm">
              Izoh yo'q
            </div>
          </BaseCard>
        </div>
  
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Harakatlar</h3>
            </template>
  
            <div class="space-y-2">
              <button
                @click="viewFullReport"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                To'liq hisobot
              </button>
              <button
                @click="compareShifts"
                class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Smenalarni solishtirish
              </button>
              <button
                v-if="shift.status === 'completed'"
                @click="exportData"
                class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Ma'lumotlarni eksport
              </button>
            </div>
          </BaseCard>
  
          <!-- Performance Metrics -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Ko'rsatkichlar</h3>
            </template>
  
            <dl class="space-y-3 text-sm">
              <div>
                <dt class="text-gray-600">OEE (Overall Equipment Effectiveness):</dt>
                <dd :class="[
                  'font-bold text-lg mt-1',
                  shift.oee >= 80 ? 'text-green-600' : shift.oee >= 60 ? 'text-orange-600' : 'text-red-600'
                ]">
                  {{ shift.oee }}%
                </dd>
              </div>
              <div>
                <dt class="text-gray-600">Availability:</dt>
                <dd class="font-medium text-gray-900 mt-1">{{ shift.availability }}%</dd>
              </div>
              <div>
                <dt class="text-gray-600">Performance:</dt>
                <dd class="font-medium text-gray-900 mt-1">{{ shift.performance }}%</dd>
              </div>
              <div>
                <dt class="text-gray-600">Quality:</dt>
                <dd class="font-medium text-gray-900 mt-1">{{ shift.qualityRate }}%</dd>
              </div>
            </dl>
          </BaseCard>
  
          <!-- Team Members -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Jamoa a'zolari</h3>
            </template>
  
            <div class="space-y-3">
              <div
                v-for="member in shift.teamMembers"
                :key="member.id"
                class="flex items-center space-x-3"
              >
                <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span class="text-sm font-semibold text-gray-600">
                    {{ member.name.split(' ').map(n => n[0]).join('') }}
                  </span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900 text-sm">{{ member.name }}</p>
                  <p class="text-xs text-gray-600">{{ member.role }}</p>
                </div>
              </div>
            </div>
          </BaseCard>
  
          <!-- Shift Timeline -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Smena jadvali</h3>
            </template>
  
            <div class="space-y-3">
              <div
                v-for="event in shift.timeline"
                :key="event.id"
                class="flex items-start space-x-3"
              >
                <div :class="[
                  'w-2 h-2 rounded-full mt-1.5',
                  event.type === 'start' ? 'bg-green-600' :
                  event.type === 'break' ? 'bg-orange-600' :
                  event.type === 'issue' ? 'bg-red-600' :
                  'bg-blue-600'
                ]"></div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ event.title }}</p>
                  <p class="text-xs text-gray-600">{{ event.time }}</p>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useProductionStore } from '@/stores/production'
  import {
    ArrowLeftIcon,
    ArrowDownTrayIcon,
    PencilIcon,
    EllipsisVerticalIcon,
    CubeIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    ClockIcon,
    ExclamationTriangleIcon
  } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const route = useRoute()
  const router = useRouter()
  const productionStore = useProductionStore()
  
  const showMoreMenu = ref(false)
  
  const shift = ref({
    id: route.params.id,
    shiftName: '1-smena',
    date: '2024-01-28',
    startTime: '08:00',
    endTime: '16:00',
    status: 'completed',
    supervisor: 'Aziz Karimov',
    workerCount: 24,
    machineCount: 6,
    workHours: 8,
    totalProduction: 12450,
    plannedProduction: 12000,
    productionChange: 3.75,
    efficiency: 85,
    efficiencyChange: 2.1,
    qualityRate: 96.5,
    defectCount: 435,
    downtimeMinutes: 42,
    downtimeCount: 3,
    oee: 82,
    availability: 91,
    performance: 92,
    productionDetails: [],
    machinePerformance: [],
    downtimeEvents: [],
    qualityIssues: [],
    teamMembers: [],
    timeline: [],
    notes: ''
  })
  
  const canEdit = computed(() => shift.value.status !== 'completed')
  
  const getStatusColor = (status) => {
    return { active: 'blue', completed: 'green', cancelled: 'red' }[status] || 'gray'
  }
  
  const getStatusText = (status) => {
    return { active: 'Faol', completed: 'Tugatilgan', cancelled: 'Bekor qilingan' }[status] || status
  }
  
  const getMachineStatusText = (status) => {
    return { running: 'Ishlayapti', idle: 'Kutmoqda', stopped: 'To\'xtagan' }[status] || status
  }
  
  const editShift = () => {
    router.push(`/production/shifts/${shift.value.id}/edit`)
  }
  
  const downloadReport = async () => {
    try {
      await productionStore.downloadShiftReport(shift.value.id)
    } catch (error) {
      console.error('Failed to download report:', error)
    }
  }
  
  const viewFullReport = () => {
    router.push(`/production/shifts/${shift.value.id}/report`)
  }
  
  const compareShifts = () => {
    router.push({ name: 'production-shifts-compare', query: { shiftId: shift.value.id } })
  }
  
  const exportData = async () => {
    try {
      await productionStore.exportShiftData(shift.value.id)
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }
  
  onMounted(async () => {
    try {
      const data = await productionStore.fetchShift(route.params.id)
      shift.value = data
    } catch (error) {
      console.error('Failed to load shift:', error)
    }
  })
  </script>