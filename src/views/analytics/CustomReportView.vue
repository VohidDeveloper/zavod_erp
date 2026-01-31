<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Maxsus Hisobotlar</h1>
          <p class="text-gray-600 mt-1">O'zingizga kerakli hisobotlarni yarating</p>
        </div>
        <button
          @click="openReportBuilder"
          class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Yangi hisobot
        </button>
      </div>
  
      <!-- Saved Reports -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="report in savedReports"
          :key="report.id"
          class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
          @click="viewReport(report)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div
                :class="[
                  'w-12 h-12 rounded-lg flex items-center justify-center',
                  report.color
                ]"
              >
                <component :is="report.icon" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ report.name }}</h3>
                <p class="text-sm text-gray-600">{{ report.description }}</p>
              </div>
            </div>
            <button
              @click.stop="openMenu(report)"
              class="p-1 hover:bg-gray-100 rounded"
            >
              <EllipsisVerticalIcon class="w-5 h-5 text-gray-600" />
            </button>
          </div>
  
          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Turi:</span>
              <Badge :color="getReportTypeBadgeColor(report.type)">
                {{ report.typeLabel }}
              </Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Oxirgi yangilangan:</span>
              <span class="font-medium text-gray-900">{{ report.lastUpdated }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Ko'rishlar:</span>
              <span class="font-medium text-gray-900">{{ report.views }}</span>
            </div>
          </div>
  
          <div class="mt-4 pt-4 border-t flex items-center justify-between">
            <button
              @click.stop="generateReport(report)"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              Generatsiya qilish
            </button>
            <button
              @click.stop="scheduleReport(report)"
              class="text-sm text-gray-600 hover:text-gray-700"
            >
              Rejalashtirish
            </button>
          </div>
        </div>
      </div>
  
      <!-- Report Templates -->
      <BaseCard>
        <template #header>
          <h3 class="text-lg font-semibold">Tayyor shablonlar</h3>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="template in templates"
            :key="template.id"
            class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
            @click="useTemplate(template)"
          >
            <component :is="template.icon" class="w-8 h-8 text-blue-600 mb-2" />
            <h4 class="font-medium text-gray-900 mb-1">{{ template.name }}</h4>
            <p class="text-xs text-gray-600">{{ template.description }}</p>
          </div>
        </div>
      </BaseCard>
  
      <!-- Report Builder Modal -->
      <Modal v-model="showBuilderModal" title="Hisobot yaratish" size="2xl">
        <div class="space-y-6">
          <!-- Step Indicator -->
          <div class="flex items-center justify-center space-x-4">
            <div
              v-for="(step, index) in builderSteps"
              :key="index"
              class="flex items-center"
            >
              <div
                :class="[
                  'flex items-center justify-center w-10 h-10 rounded-full font-semibold',
                  currentStep >= index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                ]"
              >
                {{ index + 1 }}
              </div>
              <span
                :class="[
                  'ml-2 text-sm font-medium',
                  currentStep >= index + 1 ? 'text-gray-900' : 'text-gray-500'
                ]"
              >
                {{ step }}
              </span>
              <div
                v-if="index < builderSteps.length - 1"
                :class="[
                  'w-16 h-0.5 ml-4',
                  currentStep > index + 1 ? 'bg-blue-600' : 'bg-gray-200'
                ]"
              ></div>
            </div>
          </div>
  
          <!-- Step 1: Basic Info -->
          <div v-show="currentStep === 1" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Hisobot nomi *
              </label>
              <input
                v-model="reportForm.name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Misol: Oylik sotuvlar hisoboti"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tavsif
              </label>
              <textarea
                v-model="reportForm.description"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Hisobot haqida qisqacha ma'lumot..."
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Turi *
              </label>
              <select
                v-model="reportForm.type"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Tanlang</option>
                <option value="production">Ishlab chiqarish</option>
                <option value="sales">Sotuvlar</option>
                <option value="finance">Moliya</option>
                <option value="warehouse">Ombor</option>
                <option value="hr">Kadrlar</option>
                <option value="quality">Sifat</option>
              </select>
            </div>
          </div>
  
          <!-- Step 2: Data Sources -->
          <div v-show="currentStep === 2" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ma'lumot manbalari *
              </label>
              <div class="grid grid-cols-2 gap-3">
                <label
                  v-for="source in dataSources"
                  :key="source.id"
                  class="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
                  :class="{ 'border-blue-500 bg-blue-50': reportForm.dataSources.includes(source.id) }"
                >
                  <input
                    type="checkbox"
                    :value="source.id"
                    v-model="reportForm.dataSources"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div class="ml-3">
                    <p class="font-medium text-gray-900">{{ source.name }}</p>
                    <p class="text-xs text-gray-600">{{ source.description }}</p>
                  </div>
                </label>
              </div>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Vaqt oralig'i *
              </label>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Boshlanish</label>
                  <input
                    v-model="reportForm.dateFrom"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">Tugash</label>
                  <input
                    v-model="reportForm.dateTo"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
  
          <!-- Step 3: Metrics & Filters -->
          <div v-show="currentStep === 3" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ko'rsatkichlar *
              </label>
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <label
                  v-for="metric in availableMetrics"
                  :key="metric.id"
                  class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="metric.id"
                    v-model="reportForm.metrics"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ metric.name }}</p>
                    <p class="text-xs text-gray-600">{{ metric.description }}</p>
                  </div>
                </label>
              </div>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Filtrlar
              </label>
              <div class="space-y-3">
                <div
                  v-for="(filter, index) in reportForm.filters"
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <select
                    v-model="filter.field"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Maydon tanlang</option>
                    <option value="department">Bo'lim</option>
                    <option value="category">Kategoriya</option>
                    <option value="status">Holat</option>
                  </select>
                  <select
                    v-model="filter.operator"
                    class="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="equals">Teng</option>
                    <option value="contains">O'z ichiga oladi</option>
                    <option value="greater">Katta</option>
                    <option value="less">Kichik</option>
                  </select>
                  <input
                    v-model="filter.value"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Qiymat"
                  />
                  <button
                    @click="removeFilter(index)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>
                <button
                  @click="addFilter"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Filtr qo'shish
                </button>
              </div>
            </div>
          </div>
  
          <!-- Step 4: Visualization -->
          <div v-show="currentStep === 4" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Vizualizatsiya turi
              </label>
              <div class="grid grid-cols-3 gap-3">
                <label
                  v-for="viz in visualizations"
                  :key="viz.id"
                  class="flex flex-col items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
                  :class="{ 'border-blue-500 bg-blue-50': reportForm.visualization === viz.id }"
                >
                  <input
                    type="radio"
                    :value="viz.id"
                    v-model="reportForm.visualization"
                    class="sr-only"
                  />
                  <component :is="viz.icon" class="w-8 h-8 text-gray-600 mb-2" />
                  <span class="text-sm font-medium text-gray-900">{{ viz.name }}</span>
                </label>
              </div>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tartiblash
              </label>
              <div class="grid grid-cols-2 gap-4">
                <select
                  v-model="reportForm.sortBy"
                  class="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Tanlang</option>
                  <option value="date">Sana</option>
                  <option value="value">Qiymat</option>
                  <option value="name">Nomi</option>
                </select>
                <select
                  v-model="reportForm.sortOrder"
                  class="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="desc">Kamayish</option>
                  <option value="asc">O'sish</option>
                </select>
              </div>
            </div>
  
            <div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="reportForm.autoRefresh"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">
                  Avtomatik yangilash (har 5 daqiqada)
                </span>
              </label>
            </div>
          </div>
  
          <!-- Navigation Buttons -->
          <div class="flex items-center justify-between pt-6 border-t">
            <button
              v-if="currentStep > 1"
              @click="previousStep"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Orqaga
            </button>
            <div class="flex-1"></div>
            <button
              v-if="currentStep < 4"
              @click="nextStep"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Keyingisi
            </button>
            <button
              v-else
              @click="saveReport"
              :disabled="saving"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ saving ? 'Saqlanmoqda...' : 'Saqlash va yaratish' }}
            </button>
          </div>
        </div>
      </Modal>
  
      <!-- Schedule Report Modal -->
      <Modal v-model="showScheduleModal" title="Hisobotni rejalashtirish" size="lg">
        <form @submit.prevent="saveSchedule" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Chastota
            </label>
            <select
              v-model="scheduleForm.frequency"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="daily">Har kuni</option>
              <option value="weekly">Har hafta</option>
              <option value="monthly">Har oy</option>
              <option value="quarterly">Har chorak</option>
            </select>
          </div>
  
          <div v-if="scheduleForm.frequency === 'weekly'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Kun
            </label>
            <select
              v-model="scheduleForm.dayOfWeek"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="1">Dushanba</option>
              <option value="2">Seshanba</option>
              <option value="3">Chorshanba</option>
              <option value="4">Payshanba</option>
              <option value="5">Juma</option>
            </select>
          </div>
  
          <div v-if="scheduleForm.frequency === 'monthly'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Oyning kuni
            </label>
            <input
              v-model.number="scheduleForm.dayOfMonth"
              type="number"
              min="1"
              max="31"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Vaqt
            </label>
            <input
              v-model="scheduleForm.time"
              type="time"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email yuborish
            </label>
            <input
              v-model="scheduleForm.email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="email@example.com"
            />
          </div>
  
          <div>
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="scheduleForm.enabled"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Faollashtirish</span>
            </label>
          </div>
  
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showScheduleModal = false"
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
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { useReportStore } from '@/stores/report'
  import {
    PlusIcon,
    EllipsisVerticalIcon,
    XMarkIcon,
    ChartBarIcon,
    TableCellsIcon,
    ChartPieIcon,
    DocumentTextIcon,
    ClockIcon,
    CurrencyDollarIcon,
    CubeIcon,
    UsersIcon,
    ShieldCheckIcon,
    ArrowTrendingUpIcon
  } from '@heroicons/vue/24/outline'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const router = useRouter()
  const reportStore = useReportStore()
  
  const saving = ref(false)
  const showBuilderModal = ref(false)
  const showScheduleModal = ref(false)
  const currentStep = ref(1)
  const selectedReport = ref(null)
  
  const builderSteps = ['Asosiy', 'Ma\'lumotlar', 'Ko\'rsatkichlar', 'Vizualizatsiya']
  
  const savedReports = ref([
    {
      id: 1,
      name: 'Oylik ishlab chiqarish hisoboti',
      description: 'Barcha liniyalar bo\'yicha ishlab chiqarish',
      type: 'production',
      typeLabel: 'Ishlab chiqarish',
      lastUpdated: '2024-01-27',
      views: 145,
      icon: CubeIcon,
      color: 'bg-blue-600'
    },
    {
      id: 2,
      name: 'Sotuvlar tahlili',
      description: 'Mijozlar va mahsulotlar bo\'yicha',
      type: 'sales',
      typeLabel: 'Sotuvlar',
      lastUpdated: '2024-01-26',
      views: 98,
      icon: CurrencyDollarIcon,
      color: 'bg-green-600'
    },
    {
      id: 3,
      name: 'Xodimlar ish faoliyati',
      description: 'Davomat va unumdorlik',
      type: 'hr',
      typeLabel: 'Kadrlar',
      lastUpdated: '2024-01-25',
      views: 67,
      icon: UsersIcon,
      color: 'bg-purple-600'
    }
  ])
  
  const templates = ref([
    {
      id: 1,
      name: 'Moliyaviy hisobot',
      description: 'Daromad va xarajatlar',
      icon: CurrencyDollarIcon
    },
    {
      id: 2,
      name: 'Sifat tahlili',
      description: 'Defektlar va qayta ishlash',
      icon: ShieldCheckIcon
    },
    {
      id: 3,
      name: 'Samaradorlik',
      description: 'OEE va mahsuldorlik',
      icon: ArrowTrendingUpIcon
    },
    {
      id: 4,
      name: 'Ombor holati',
      description: 'Qoldiq va harakatlar',
      icon: CubeIcon
    }
  ])
  
  const dataSources = ref([
    { id: 1, name: 'Ishlab chiqarish', description: 'Liniyalar va smena ma\'lumotlari' },
    { id: 2, name: 'Sotuvlar', description: 'Buyurtmalar va to\'lovlar' },
    { id: 3, name: 'Ombor', description: 'Qoldiq va harakatlar' },
    { id: 4, name: 'Moliya', description: 'Tranzaksiyalar va hisobotlar' },
    { id: 5, name: 'Kadrlar', description: 'Xodimlar va ish haqi' },
    { id: 6, name: 'Sifat', description: 'Tekshiruvlar va defektlar' }
  ])
  
  const availableMetrics = ref([
    { id: 1, name: 'Jami ishlab chiqarish', description: 'Barcha mahsulotlar' },
    { id: 2, name: 'Savdo hajmi', description: 'Umumiy sotuvlar summasi' },
    { id: 3, name: 'Foyda', description: 'Sof foyda' },
    { id: 4, name: 'Xarajatlar', description: 'Jami xarajatlar' },
    { id: 5, name: 'Defekt darajasi', description: 'Foizda' },
    { id: 6, name: 'OEE', description: 'Samaradorlik ko\'rsatkichi' }
  ])
  
  const visualizations = ref([
    { id: 'table', name: 'Jadval', icon: TableCellsIcon },
    { id: 'chart', name: 'Grafik', icon: ChartBarIcon },
    { id: 'pie', name: 'Doira', icon: ChartPieIcon }
  ])
  
  const reportForm = reactive({
    name: '',
    description: '',
    type: '',
    dataSources: [],
    dateFrom: '',
    dateTo: '',
    metrics: [],
    filters: [],
    visualization: 'table',
    sortBy: '',
    sortOrder: 'desc',
    autoRefresh: false
  })
  
  const scheduleForm = reactive({
    frequency: 'monthly',
    dayOfWeek: '1',
    dayOfMonth: 1,
    time: '09:00',
    email: '',
    enabled: true
  })
  
  const getReportTypeBadgeColor = (type) => {
    const colors = {
      production: 'blue',
      sales: 'green',
      finance: 'purple',
      warehouse: 'orange',
      hr: 'pink',
      quality: 'yellow'
    }
    return colors[type] || 'gray'
  }
  
  const openReportBuilder = () => {
    currentStep.value = 1
    showBuilderModal.value = true
  }
  
  const nextStep = () => {
    if (currentStep.value < 4) {
      currentStep.value++
    }
  }
  
  const previousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }
  
  const addFilter = () => {
    reportForm.filters.push({
      field: '',
      operator: 'equals',
      value: ''
    })
  }
  
  const removeFilter = (index) => {
    reportForm.filters.splice(index, 1)
  }
  
  const saveReport = async () => {
    saving.value = true
    try {
      await reportStore.createReport(reportForm)
      showBuilderModal.value = false
      // Reload reports
    } finally {
      saving.value = false
    }
  }
  
  const viewReport = (report) => {
    router.push(`/analytics/reports/${report.id}`)
  }
  
  const generateReport = async (report) => {
    try {
      await reportStore.generateReport(report.id)
    } catch (error) {
      console.error('Failed to generate report:', error)
    }
  }
  
  const scheduleReport = (report) => {
    selectedReport.value = report
    showScheduleModal.value = true
  }
  
  const saveSchedule = async () => {
    try {
      await reportStore.scheduleReport(selectedReport.value.id, scheduleForm)
      showScheduleModal.value = false
    } catch (error) {
      console.error('Failed to schedule report:', error)
    }
  }
  
  const useTemplate = (template) => {
    // Pre-fill form with template data
    openReportBuilder()
  }
  
  const openMenu = (report) => {
    // Show context menu
  }
  </script>