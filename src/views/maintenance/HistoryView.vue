<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Texnik ko'rik tarixi</h1>
          <p class="text-gray-600 mt-1">Barcha texnik ko'riklar va ta'mirlar tarixi</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="exportHistory"
            class="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            <ArrowDownTrayIcon class="w-5 h-5 mr-2" />
            Eksport
          </button>
        </div>
      </div>
  
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Jami texnik ko'riklar"
          :value="stats.total"
          icon="WrenchScrewdriverIcon"
          color="blue"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Bu oy: {{ stats.thisMonth }}
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="O'rtacha davomiyligi"
          :value="stats.avgDuration"
          icon="ClockIcon"
          color="purple"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Jami: {{ stats.totalHours }} soat
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Jami xarajat"
          :value="formatCurrency(stats.totalCost)"
          icon="CurrencyDollarIcon"
          color="green"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              O'rtacha: {{ formatCurrency(stats.avgCost) }}
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="MTBF"
          :value="stats.mtbf + ' kun'"
          icon="ChartBarIcon"
          color="orange"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Mean Time Between Failures
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
              placeholder="Uskuna yoki texnik qidirish..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
  
          <!-- Machine Filter -->
          <div>
            <select
              v-model="filters.machineId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Barcha uskunalar</option>
              <option v-for="machine in machines" :key="machine.id" :value="machine.id">
                {{ machine.code }} - {{ machine.name }}
              </option>
            </select>
          </div>
  
          <!-- Type Filter -->
          <div>
            <select
              v-model="filters.type"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Barcha turlar</option>
              <option value="preventive">Profilaktik</option>
              <option value="corrective">Tuzatish</option>
              <option value="predictive">Bashoratli</option>
              <option value="inspection">Tekshiruv</option>
            </select>
          </div>
  
          <!-- Date Range -->
          <div>
            <select
              v-model="filters.dateRange"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Bu hafta</option>
              <option value="month">Bu oy</option>
              <option value="quarter">Chorak</option>
              <option value="year">Bu yil</option>
              <option value="custom">Boshqa</option>
            </select>
          </div>
        </div>
  
        <!-- Custom Date Range -->
        <div v-if="filters.dateRange === 'custom'" class="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Boshlanish
            </label>
            <input
              v-model="filters.startDate"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tugash
            </label>
            <input
              v-model="filters.endDate"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
          </div>
        </div>
  
        <!-- Active Filters -->
        <div v-if="activeFiltersCount > 0" class="flex items-center space-x-2 mt-4">
          <span class="text-sm text-gray-600">Filtrlar:</span>
          <div class="flex flex-wrap gap-2">
            <Badge
              v-if="filters.machineId"
              color="blue"
              @click="filters.machineId = ''"
              class="cursor-pointer"
            >
              {{ getMachineName(filters.machineId) }} ×
            </Badge>
            <Badge
              v-if="filters.type"
              color="purple"
              @click="filters.type = ''"
              class="cursor-pointer"
            >
              {{ getTypeName(filters.type) }} ×
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
  
      <!-- View Toggle -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <button
            @click="viewMode = 'list'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition',
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <ListBulletIcon class="w-5 h-5 inline mr-2" />
            Ro'yxat
          </button>
          <button
            @click="viewMode = 'calendar'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition',
              viewMode === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <CalendarIcon class="w-5 h-5 inline mr-2" />
            Kalendar
          </button>
          <button
            @click="viewMode = 'timeline'"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition',
              viewMode === 'timeline'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            <ClockIcon class="w-5 h-5 inline mr-2" />
            Timeline
          </button>
        </div>
  
        <div class="text-sm text-gray-600">
          {{ filteredHistory.length }} ta yozuv topildi
        </div>
      </div>
  
      <!-- List View -->
      <BaseCard v-if="viewMode === 'list'">
        <DataTable
          :data="paginatedHistory"
          :columns="tableColumns"
          :loading="loading"
          @sort="handleSort"
        >
          <template #machine="{ row }">
            <div>
              <p class="font-medium text-gray-900">{{ row.machine.name }}</p>
              <p class="text-sm text-gray-600">{{ row.machine.code }}</p>
            </div>
          </template>
  
          <template #type="{ row }">
            <Badge :color="getTypeColor(row.type)">
              {{ getTypeName(row.type) }}
            </Badge>
          </template>
  
          <template #status="{ row }">
            <Badge :color="getStatusColor(row.status)">
              {{ getStatusText(row.status) }}
            </Badge>
          </template>
  
          <template #duration="{ row }">
            <div class="text-center">
              <p class="font-medium text-gray-900">{{ row.duration }}h</p>
              <div class="w-full bg-gray-200 rounded-full h-1 mt-1">
                <div
                  class="bg-blue-600 h-1 rounded-full"
                  :style="{ width: `${Math.min((row.duration / 10) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
          </template>
  
          <template #cost="{ row }">
            <span class="font-medium text-gray-900">{{ formatCurrency(row.cost) }}</span>
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
                @click="downloadReport(row)"
                class="text-gray-600 hover:text-gray-700"
              >
                Yuklab olish
              </button>
            </div>
          </template>
        </DataTable>
  
        <Pagination
          v-model="pagination.page"
          :total="pagination.total"
          :per-page="pagination.perPage"
          @change="loadHistory"
        />
      </BaseCard>
  
      <!-- Calendar View -->
      <BaseCard v-if="viewMode === 'calendar'">
        <div class="space-y-4">
          <!-- Calendar Header -->
          <div class="flex items-center justify-between">
            <button
              @click="previousMonth"
              class="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeftIcon class="w-5 h-5 text-gray-600" />
            </button>
            <h3 class="text-lg font-semibold text-gray-900">
              {{ currentMonthYear }}
            </h3>
            <button
              @click="nextMonth"
              class="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRightIcon class="w-5 h-5 text-gray-600" />
            </button>
          </div>
  
          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-2">
            <div
              v-for="day in weekDays"
              :key="day"
              class="text-center text-sm font-medium text-gray-600 py-2"
            >
              {{ day }}
            </div>
  
            <div
              v-for="day in calendarDays"
              :key="day.date"
              :class="[
                'min-h-24 p-2 border rounded-lg',
                day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                day.isToday ? 'border-blue-500 border-2' : 'border-gray-200'
              ]"
            >
              <div class="text-sm font-medium text-gray-900 mb-1">
                {{ day.day }}
              </div>
              <div class="space-y-1">
                <div
                  v-for="event in day.events"
                  :key="event.id"
                  @click="viewDetails(event)"
                  :class="[
                    'text-xs p-1 rounded cursor-pointer truncate',
                    getTypeColor(event.type) === 'blue' ? 'bg-blue-100 text-blue-800' :
                    getTypeColor(event.type) === 'green' ? 'bg-green-100 text-green-800' :
                    getTypeColor(event.type) === 'orange' ? 'bg-orange-100 text-orange-800' :
                    'bg-purple-100 text-purple-800'
                  ]"
                >
                  {{ event.machine.code }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
  
      <!-- Timeline View -->
      <BaseCard v-if="viewMode === 'timeline'">
        <div class="space-y-6">
          <div
            v-for="(group, date) in timelineGroups"
            :key="date"
            class="space-y-4"
          >
            <div class="sticky top-0 bg-white z-10 py-2">
              <h3 class="text-lg font-semibold text-gray-900">{{ date }}</h3>
            </div>
  
            <div
              v-for="(item, index) in group"
              :key="item.id"
              class="flex space-x-4"
            >
              <div class="flex flex-col items-center">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    getTypeColor(item.type) === 'blue' ? 'bg-blue-600' :
                    getTypeColor(item.type) === 'green' ? 'bg-green-600' :
                    getTypeColor(item.type) === 'orange' ? 'bg-orange-600' :
                    'bg-purple-600'
                  ]"
                >
                  <component :is="getTypeIcon(item.type)" class="w-5 h-5 text-white" />
                </div>
                <div
                  v-if="index < group.length - 1"
                  class="w-0.5 h-full bg-gray-200 mt-2"
                ></div>
              </div>
  
              <div class="flex-1 pb-8">
                <div
                  @click="viewDetails(item)"
                  class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition"
                >
                  <div class="flex items-start justify-between mb-2">
                    <div>
                      <h4 class="font-medium text-gray-900">{{ item.title }}</h4>
                      <p class="text-sm text-gray-600">{{ item.machine.name }}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                      <Badge :color="getTypeColor(item.type)" size="sm">
                        {{ getTypeName(item.type) }}
                      </Badge>
                      <Badge :color="getStatusColor(item.status)" size="sm">
                        {{ getStatusText(item.status) }}
                      </Badge>
                    </div>
                  </div>
  
                  <div class="grid grid-cols-3 gap-4 text-sm mt-3">
                    <div>
                      <p class="text-gray-600">Texnik:</p>
                      <p class="font-medium text-gray-900">{{ item.technician }}</p>
                    </div>
                    <div>
                      <p class="text-gray-600">Davomiyligi:</p>
                      <p class="font-medium text-gray-900">{{ item.duration }}h</p>
                    </div>
                    <div>
                      <p class="text-gray-600">Xarajat:</p>
                      <p class="font-medium text-gray-900">{{ formatCurrency(item.cost) }}</p>
                    </div>
                  </div>
  
                  <p v-if="item.workDone" class="text-sm text-gray-600 mt-2">
                    {{ item.workDone }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useMaintenanceStore } from '@/stores/maintenance'
  import {
    ArrowDownTrayIcon,
    WrenchScrewdriverIcon,
    ClockIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
    ListBulletIcon,
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon
  } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import DataTable from '@/components/common/tables/DataTable.vue'
  import Pagination from '@/components/common/navigation/Pagination.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const router = useRouter()
  const maintenanceStore = useMaintenanceStore()
  
  const loading = ref(false)
  const viewMode = ref('list')
  const currentDate = ref(new Date())
  
  const stats = ref({
    total: 487,
    thisMonth: 42,
    avgDuration: '3.2h',
    totalHours: 1558,
    totalCost: 245000000,
    avgCost: 503000,
    mtbf: 45
  })
  
  const machines = ref([])
  const history = ref([])
  
  const filters = reactive({
    search: '',
    machineId: '',
    type: '',
    dateRange: 'month',
    startDate: '',
    endDate: ''
  })
  
  const pagination = reactive({
    page: 1,
    perPage: 10,
    total: 0
  })
  
  const weekDays = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
  
  const tableColumns = [
    { key: 'date', label: 'Sana', sortable: true },
    { key: 'machine', label: 'Uskuna', slot: true },
    { key: 'type', label: 'Turi', slot: true },
    { key: 'technician', label: 'Texnik' },
    { key: 'duration', label: 'Davomiyligi', slot: true, sortable: true },
    { key: 'cost', label: 'Xarajat', slot: true, sortable: true },
    { key: 'status', label: 'Holat', slot: true },
    { key: 'actions', label: '', slot: true }
  ]
  
  const activeFiltersCount = computed(() => {
    let count = 0
    if (filters.machineId) count++
    if (filters.type) count++
    if (filters.search) count++
    return count
  })
  
  const filteredHistory = computed(() => {
    let filtered = history.value
  
    if (filters.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(h =>
        h.machine.name.toLowerCase().includes(query) ||
        h.machine.code.toLowerCase().includes(query) ||
        h.technician.toLowerCase().includes(query)
      )
    }
  
    if (filters.machineId) {
      filtered = filtered.filter(h => h.machine.id === filters.machineId)
    }
  
    if (filters.type) {
      filtered = filtered.filter(h => h.type === filters.type)
    }
  
    return filtered
  })
  
  const paginatedHistory = computed(() => {
    const start = (pagination.page - 1) * pagination.perPage
    const end = start + pagination.perPage
    return filteredHistory.value.slice(start, end)
  })
  
  const currentMonthYear = computed(() => {
    return currentDate.value.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })
  })
  
  const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const prevLastDay = new Date(year, month, 0)
    
    const firstDayOfWeek = firstDay.getDay() || 7
    const days = []
    
    // Previous month days
    for (let i = firstDayOfWeek - 1; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevLastDay.getDate() - i + 1),
        day: prevLastDay.getDate() - i + 1,
        isCurrentMonth: false,
        isToday: false,
        events: []
      })
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      const today = new Date()
      days.push({
        date,
        day: i,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        events: getEventsForDate(date)
      })
    }
    
    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        day: i,
        isCurrentMonth: false,
        isToday: false,
        events: []
      })
    }
    
    return days
  })
  
  const timelineGroups = computed(() => {
    const groups = {}
    filteredHistory.value.forEach(item => {
      const date = item.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(item)
    })
    return groups
  })
  
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return history.value.filter(h => h.date === dateStr)
  }
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  const getTypeColor = (type) => {
    const colors = {
      preventive: 'blue',
      corrective: 'orange',
      predictive: 'purple',
      inspection: 'green'
    }
    return colors[type] || 'gray'
  }
  
  const getTypeName = (type) => {
    const names = {
      preventive: 'Profilaktik',
      corrective: 'Tuzatish',
      predictive: 'Bashoratli',
      inspection: 'Tekshiruv'
    }
    return names[type] || type
  }
  
  const getTypeIcon = (type) => {
    const icons = {
      preventive: ClockIcon,
      corrective: WrenchScrewdriverIcon,
      predictive: ChartBarIcon,
      inspection: ListBulletIcon
    }
    return icons[type] || WrenchScrewdriverIcon
  }
  
  const getStatusColor = (status) => {
    const colors = {
      completed: 'green',
      in_progress: 'blue',
      cancelled: 'red'
    }
    return colors[status] || 'gray'
  }
  
  const getStatusText = (status) => {
    const texts = {
      completed: 'Tugatilgan',
      in_progress: 'Jarayonda',
      cancelled: 'Bekor qilingan'
    }
    return texts[status] || status
  }
  
  const getMachineName = (id) => {
    const machine = machines.value.find(m => m.id === id)
    return machine ? `${machine.code} - ${machine.name}` : ''
  }
  
  const clearFilters = () => {
    filters.search = ''
    filters.machineId = ''
    filters.type = ''
    filters.dateRange = 'month'
  }
  
  const previousMonth = () => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1
    )
  }
  
  const nextMonth = () => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1
    )
  }
  
  const handleSort = (column) => {
    console.log('Sort by:', column)
  }
  
  const viewDetails = (item) => {
    router.push(`/maintenance/history/${item.id}`)
  }
  
  const downloadReport = async (item) => {
    try {
      await maintenanceStore.downloadReport(item.id)
    } catch (error) {
      console.error('Failed to download report:', error)
    }
  }
  
  const exportHistory = async () => {
    try {
      await maintenanceStore.exportHistory({
        ...filters,
        format: 'xlsx'
      })
    } catch (error) {
      console.error('Failed to export history:', error)
    }
  }
  
  const loadHistory = async () => {
    loading.value = true
    try {
      const response = await maintenanceStore.fetchHistory({
        page: pagination.page,
        per_page: pagination.perPage,
        ...filters
      })
      history.value = response.data
      pagination.total = response.total
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(async () => {
    machines.value = (await maintenanceStore.fetchMachines()).data
    loadHistory()
  })
  </script>