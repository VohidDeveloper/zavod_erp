<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Kadrlar Tahlili</h1>
          <p class="text-gray-600 mt-1">Xodimlar va ish haqi statistikasi</p>
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
          title="Jami xodimlar"
          :value="stats.totalEmployees"
          :change="stats.employeeChange"
          icon="UsersIcon"
          color="blue"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Faol: {{ stats.activeEmployees }}
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Ish haqi fondi"
          :value="formatCurrency(stats.totalSalary)"
          :change="stats.salaryChange"
          icon="CurrencyDollarIcon"
          color="green"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              O'rtacha: {{ formatCurrency(stats.avgSalary) }}
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Davomat"
          :value="stats.attendance + '%'"
          :change="stats.attendanceChange"
          icon="ClockIcon"
          color="purple"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Bugun: {{ stats.presentToday }}/{{ stats.totalEmployees }}
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="O'rtacha ish tajribasi"
          :value="stats.avgTenure + ' yil'"
          icon="AcademicCapIcon"
          color="orange"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Rotatsiya: {{ stats.turnoverRate }}%
            </p>
          </template>
        </StatCard>
      </div>
  
      <!-- Charts Row 1 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Headcount Trend -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Xodimlar soni dinamikasi</h3>
              <div class="flex space-x-2">
                <button
                  v-for="period in ['6m', '1y', '2y']"
                  :key="period"
                  @click="headcountPeriod = period"
                  :class="[
                    'px-3 py-1 text-sm rounded-lg',
                    headcountPeriod === period
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
            <LineChart :data="headcountData" :options="chartOptions" />
          </div>
        </BaseCard>
  
        <!-- Department Distribution -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Bo'limlar bo'yicha taqsimot</h3>
          </template>
          <div class="h-80">
            <DoughnutChart :data="departmentDistributionData" :options="pieChartOptions" />
          </div>
        </BaseCard>
      </div>
  
      <!-- Department Stats & Attendance -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Department Statistics -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Bo'limlar statistikasi</h3>
          </template>
          <div class="space-y-3">
            <div
              v-for="dept in departments"
              :key="dept.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              @click="viewDepartmentDetails(dept)"
            >
              <div class="flex items-center space-x-3">
                <div
                  :class="[
                    'w-12 h-12 rounded-lg flex items-center justify-center',
                    dept.bgColor
                  ]"
                >
                  <component :is="dept.icon" :class="['w-6 h-6', dept.iconColor]" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ dept.name }}</p>
                  <p class="text-sm text-gray-600">{{ dept.employees }} xodim</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-gray-900">{{ formatCurrency(dept.avgSalary) }}</p>
                <p class="text-sm text-gray-600">O'rtacha maosh</p>
              </div>
            </div>
          </div>
        </BaseCard>
  
        <!-- Attendance Overview -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Davomat ko'rsatkichlari</h3>
          </template>
          <div class="h-80">
            <BarChart :data="attendanceData" :options="barChartOptions" />
          </div>
        </BaseCard>
      </div>
  
      <!-- Salary & Age Distribution -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Salary Distribution -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Ish haqi taqsimoti</h3>
          </template>
          <div class="h-80">
            <BarChart :data="salaryDistributionData" :options="barChartOptions" />
          </div>
        </BaseCard>
  
        <!-- Age Distribution -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Yosh taqsimoti</h3>
          </template>
          <div class="h-80">
            <BarChart :data="ageDistributionData" :options="barChartOptions" />
          </div>
        </BaseCard>
      </div>
  
      <!-- Top Performers & Recent Hires -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Performers -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Eng yaxshi xodimlar</h3>
              <Badge color="blue">Bu oy</Badge>
            </div>
          </template>
          <div class="space-y-3">
            <div
              v-for="(employee, index) in topPerformers"
              :key="employee.id"
              class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
            >
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  {{ index + 1 }}
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {{ employee.name.split(' ').map(n => n[0]).join('') }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ employee.name }}</p>
                    <p class="text-sm text-gray-600">{{ employee.position }}</p>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="flex items-center space-x-1">
                  <StarIcon class="w-5 h-5 text-yellow-500 fill-current" />
                  <span class="font-semibold text-gray-900">{{ employee.rating }}</span>
                </div>
                <p class="text-xs text-gray-600">{{ employee.department }}</p>
              </div>
            </div>
          </div>
        </BaseCard>
  
        <!-- Recent Hires -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Yangi xodimlar</h3>
              <Badge color="green">So'nggi 30 kun</Badge>
            </div>
          </template>
          <div class="space-y-3">
            <div
              v-for="hire in recentHires"
              :key="hire.id"
              class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {{ hire.name.split(' ').map(n => n[0]).join('') }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ hire.name }}</p>
                  <p class="text-sm text-gray-600">{{ hire.position }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ hire.hireDate }}</p>
                <p class="text-xs text-gray-600">{{ hire.department }}</p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Leave Requests & Training -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Leave Statistics -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Ta'til statistikasi</h3>
          </template>
          <div class="space-y-4">
            <div
              v-for="leave in leaveStats"
              :key="leave.type"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    leave.bgColor
                  ]"
                >
                  <component :is="leave.icon" :class="['w-5 h-5', leave.iconColor]" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ leave.type }}</p>
                  <p class="text-sm text-gray-600">{{ leave.description }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-900">{{ leave.count }}</p>
                <p class="text-sm text-gray-600">{{ leave.days }} kun</p>
              </div>
            </div>
          </div>
        </BaseCard>
  
        <!-- Training Completion -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">O'quv dasturlari</h3>
          </template>
          <div class="space-y-4">
            <div
              v-for="training in trainings"
              :key="training.id"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center justify-between mb-2">
                <p class="font-medium text-gray-900">{{ training.name }}</p>
                <Badge :color="training.completion >= 80 ? 'green' : 'orange'">
                  {{ training.completion }}%
                </Badge>
              </div>
              <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{{ training.completed }}/{{ training.total }} xodim</span>
                <span>{{ training.deadline }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  :class="[
                    'h-2 rounded-full',
                    training.completion >= 80 ? 'bg-green-600' : 'bg-orange-600'
                  ]"
                  :style="{ width: `${training.completion}%` }"
                ></div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
  
      <!-- Detailed Employee Table -->
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Xodimlar ro'yxati</h3>
            <div class="flex items-center space-x-3">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Qidirish..."
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <select
                v-model="departmentFilter"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Barcha bo'limlar</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>
          </div>
        </template>
  
        <DataTable
          :data="filteredEmployees"
          :columns="tableColumns"
          :loading="loading"
          @sort="handleSort"
        >
          <template #status="{ row }">
            <Badge :color="row.status === 'active' ? 'green' : 'gray'">
              {{ row.status === 'active' ? 'Faol' : 'Nofaol' }}
            </Badge>
          </template>
  
          <template #attendance="{ row }">
            <div class="text-center">
              <p class="font-medium">{{ row.attendance }}%</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  :class="[
                    'h-2 rounded-full',
                    row.attendance >= 90 ? 'bg-green-600' : row.attendance >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                  ]"
                  :style="{ width: `${row.attendance}%` }"
                ></div>
              </div>
            </div>
          </template>
  
          <template #performance="{ row }">
            <div class="flex items-center space-x-1">
              <StarIcon
                v-for="i in 5"
                :key="i"
                :class="[
                  'w-4 h-4',
                  i <= row.performance ? 'text-yellow-500 fill-current' : 'text-gray-300'
                ]"
              />
            </div>
          </template>
  
          <template #actions="{ row }">
            <div class="flex items-center space-x-2">
              <button
                @click="viewEmployeeDetails(row)"
                class="text-blue-600 hover:text-blue-700"
              >
                Ko'rish
              </button>
              <button
                @click="editEmployee(row)"
                class="text-gray-600 hover:text-gray-700"
              >
                Tahrirlash
              </button>
            </div>
          </template>
        </DataTable>
  
        <Pagination
          v-model="pagination.page"
          :total="pagination.total"
          :per-page="pagination.perPage"
          @change="loadEmployees"
        />
      </BaseCard>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useHRStore } from '@/stores/hr'
  import { useRouter } from 'vue-router'
  import {
    ArrowDownTrayIcon,
    UsersIcon,
    CurrencyDollarIcon,
    ClockIcon,
    AcademicCapIcon,
    StarIcon,
    CalendarIcon,
    BeakerIcon,
    CogIcon,
    BriefcaseIcon,
    WrenchScrewdriverIcon
  } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import LineChart from '@/components/common/charts/LineChart.vue'
  import DoughnutChart from '@/components/common/charts/DoughnutChart.vue'
  import BarChart from '@/components/common/charts/BarChart.vue'
  import DataTable from '@/components/common/tables/DataTable.vue'
  import Pagination from '@/components/common/navigation/Pagination.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const hrStore = useHRStore()
  const router = useRouter()
  
  const loading = ref(false)
  const dateRange = ref('month')
  const headcountPeriod = ref('1y')
  const searchQuery = ref('')
  const departmentFilter = ref('')
  
  const stats = ref({
    totalEmployees: 95,
    employeeChange: 5.2,
    activeEmployees: 92,
    totalSalary: 475000000,
    salaryChange: 8.3,
    avgSalary: 5000000,
    attendance: 94.5,
    attendanceChange: 2.1,
    presentToday: 87,
    avgTenure: 3.8,
    turnoverRate: 12.5
  })
  
  const departments = ref([
    {
      id: 1,
      name: 'Ishlab chiqarish',
      employees: 67,
      avgSalary: 4800000,
      icon: CogIcon,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 2,
      name: 'Boshqaruv',
      employees: 18,
      avgSalary: 7500000,
      icon: BriefcaseIcon,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 3,
      name: 'Xizmat ko\'rsatish',
      employees: 10,
      avgSalary: 3500000,
      icon: WrenchScrewdriverIcon,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ])
  
  const topPerformers = ref([
    { id: 1, name: 'Ali Valiyev', position: 'Ustachi', department: 'Ishlab chiqarish', rating: 4.9 },
    { id: 2, name: 'Nodira Karimova', position: 'Menejer', department: 'Boshqaruv', rating: 4.8 },
    { id: 3, name: 'Sardor Toshmatov', position: 'Texnik', department: 'Xizmat', rating: 4.7 },
    { id: 4, name: 'Dilnoza Ahmedova', position: 'Operator', department: 'Ishlab chiqarish', rating: 4.6 },
    { id: 5, name: 'Jahongir Aliyev', position: 'Nazoratchi', department: 'Ishlab chiqarish', rating: 4.5 }
  ])
  
  const recentHires = ref([
    { id: 1, name: 'Otabek Rahimov', position: 'Operator', department: 'Ishlab chiqarish', hireDate: '2024-01-15' },
    { id: 2, name: 'Malika Yusupova', position: 'Hisobchi', department: 'Boshqaruv', hireDate: '2024-01-10' },
    { id: 3, name: 'Bekzod Nazarov', position: 'Texnik', department: 'Xizmat', hireDate: '2024-01-05' },
    { id: 4, name: 'Zarina Ismoilova', position: 'Ustachi', department: 'Ishlab chiqarish', hireDate: '2023-12-28' }
  ])
  
  const leaveStats = ref([
    {
      type: 'Yillik ta\'til',
      description: 'Rejalashtirilgan',
      count: 12,
      days: 168,
      icon: CalendarIcon,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      type: 'Kasallik',
      description: 'Tibbiy',
      count: 8,
      days: 45,
      icon: BeakerIcon,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      type: 'Oilaviy',
      description: 'Shaxsiy',
      count: 5,
      days: 15,
      icon: UsersIcon,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ])
  
  const trainings = ref([
    { id: 1, name: 'Xavfsizlik texnikasi', completed: 85, total: 95, completion: 89, deadline: '2024-02-15' },
    { id: 2, name: 'Yangi uskunalar', completed: 45, total: 67, completion: 67, deadline: '2024-03-01' },
    { id: 3, name: 'Sifat nazorati', completed: 72, total: 75, completion: 96, deadline: '2024-02-28' }
  ])
  
  const employees = ref([])
  const pagination = reactive({
    page: 1,
    perPage: 10,
    total: 0
  })
  
  const headcountData = computed(() => ({
    labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
    datasets: [
      {
        label: 'Xodimlar soni',
        data: [88, 89, 90, 89, 91, 92, 93, 94, 94, 95, 95, 95],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }))
  
  const departmentDistributionData = computed(() => ({
    labels: ['Ishlab chiqarish', 'Boshqaruv', 'Xizmat ko\'rsatish'],
    datasets: [{
      data: [67, 18, 10],
      backgroundColor: ['#3B82F6', '#8B5CF6', '#F59E0B']
    }]
  }))
  
  const attendanceData = computed(() => ({
    labels: ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'],
    datasets: [{
      label: 'Davomat (%)',
      data: [96, 94, 95, 93, 92, 88],
      backgroundColor: '#10B981'
    }]
  }))
  
  const salaryDistributionData = computed(() => ({
    labels: ['3-4M', '4-5M', '5-6M', '6-7M', '7M+'],
    datasets: [{
      label: 'Xodimlar soni',
      data: [15, 32, 28, 12, 8],
      backgroundColor: '#3B82F6'
    }]
  }))
  
  const ageDistributionData = computed(() => ({
    labels: ['18-25', '26-35', '36-45', '46-55', '55+'],
    datasets: [{
      label: 'Xodimlar soni',
      data: [18, 38, 25, 12, 2],
      backgroundColor: '#8B5CF6'
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
    { key: 'name', label: 'FIO', sortable: true },
    { key: 'position', label: 'Lavozim' },
    { key: 'department', label: 'Bo\'lim' },
    { key: 'salary', label: 'Maosh', sortable: true },
    { key: 'attendance', label: 'Davomat', slot: true, sortable: true },
    { key: 'performance', label: 'Reyting', slot: true },
    { key: 'status', label: 'Holat', slot: true },
    { key: 'actions', label: '', slot: true }
  ]
  
  const filteredEmployees = computed(() => {
    let filtered = employees.value
  
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.position.toLowerCase().includes(query)
      )
    }
  
    if (departmentFilter.value) {
      filtered = filtered.filter(e => e.departmentId === departmentFilter.value)
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
  
  const loadEmployees = async () => {
    loading.value = true
    try {
      const response = await hrStore.fetchEmployees({
        page: pagination.page,
        per_page: pagination.perPage,
        department: departmentFilter.value,
        search: searchQuery.value
      })
      employees.value = response.data
      pagination.total = response.total
    } catch (error) {
      console.error('Failed to load employees:', error)
    } finally {
      loading.value = false
    }
  }
  
  const handleSort = (column) => {
    console.log('Sort by:', column)
    // Implement sorting logic
  }
  
  const viewEmployeeDetails = (employee) => {
    router.push(`/hr/employees/${employee.id}`)
  }
  
  const editEmployee = (employee) => {
    router.push(`/hr/employees/${employee.id}/edit`)
  }
  
  const viewDepartmentDetails = (department) => {
    router.push({
      name: 'hr-employees',
      query: { department: department.id }
    })
  }
  
  const exportReport = async () => {
    try {
      await hrStore.exportAnalytics({
        dateRange: dateRange.value,
        format: 'xlsx'
      })
    } catch (error) {
      console.error('Failed to export report:', error)
    }
  }
  
  onMounted(() => {
    loadEmployees()
  })
  </script>