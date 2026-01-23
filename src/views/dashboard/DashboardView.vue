<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Bosh sahifa</h1>
          <p class="text-gray-600 mt-1">{{ greeting }}, {{ user?.first_name }}!</p>
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
        </div>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Umumiy ishlab chiqarish"
          :value="stats.production.total"
          :change="stats.production.change"
          icon="ChartBarIcon"
          color="blue"
        />
        <StatCard
          title="Savdo hajmi"
          :value="formatCurrency(stats.sales.revenue)"
          :change="stats.sales.change"
          icon="CurrencyDollarIcon"
          color="green"
        />
        <StatCard
          title="Ombor qoldiq"
          :value="stats.warehouse.stock"
          :change="stats.warehouse.change"
          icon="CubeIcon"
          color="purple"
        />
        <StatCard
          title="Ish haqi fondi"
          :value="formatCurrency(stats.hr.salary)"
          :change="stats.hr.change"
          icon="UsersIcon"
          color="orange"
        />
      </div>
  
      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Production Chart -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Ishlab chiqarish dinamikasi</h3>
          </template>
          <LineChart :data="productionChartData" :options="chartOptions" />
        </BaseCard>
  
        <!-- Sales Chart -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Savdo dinamikasi</h3>
          </template>
          <BarChart :data="salesChartData" :options="chartOptions" />
        </BaseCard>
      </div>
  
      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Orders -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">So'nggi buyurtmalar</h3>
          </template>
          <div class="space-y-3">
            <div
              v-for="order in recentOrders"
              :key="order.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div>
                <p class="font-medium text-gray-900">{{ order.customer }}</p>
                <p class="text-sm text-gray-600">{{ order.product }}</p>
              </div>
              <StatusBadge :status="order.status" />
            </div>
          </div>
        </BaseCard>
  
        <!-- Low Stock Alerts -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Kam qolgan mahsulotlar</h3>
          </template>
          <div class="space-y-3">
            <div
              v-for="item in lowStockItems"
              :key="item.id"
              class="flex items-center justify-between p-3 bg-amber-50 rounded-lg"
            >
              <div>
                <p class="font-medium text-gray-900">{{ item.name }}</p>
                <p class="text-sm text-gray-600">{{ item.stock }} dona qoldi</p>
              </div>
              <Badge color="amber">Kam</Badge>
            </div>
          </div>
        </BaseCard>
  
        <!-- Upcoming Tasks -->
        <BaseCard>
          <template #header>
            <h3 class="text-lg font-semibold">Kelgusi vazifalar</h3>
          </template>
          <div class="space-y-3">
            <div
              v-for="task in upcomingTasks"
              :key="task.id"
              class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <input type="checkbox" class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ task.title }}</p>
                <p class="text-sm text-gray-600">{{ task.due_date }}</p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import { useAnalyticsStore } from '@/stores/analytics'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import LineChart from '@/components/common/charts/LineChart.vue'
  import BarChart from '@/components/common/charts/BarChart.vue'
  import StatusBadge from '@/components/common/feedback/StatusBadge.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const authStore = useAuthStore()
  const analyticsStore = useAnalyticsStore()
  
  const dateRange = ref('month')
  const user = computed(() => authStore.user)
  
  const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Xayrli tong'
    if (hour < 18) return 'Xayrli kun'
    return 'Xayrli kech'
  })
  
  const stats = ref({
    production: { total: '12,543', change: 12.5 },
    sales: { revenue: 45000000, change: 8.3 },
    warehouse: { stock: '8,234', change: -2.1 },
    hr: { salary: 25000000, change: 5.0 }
  })
  
  const productionChartData = ref({
    labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun'],
    datasets: [{
      label: 'Ishlab chiqarish',
      data: [2000, 2500, 2300, 2800, 3000, 2900],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)'
    }]
  })
  
  const salesChartData = ref({
    labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun'],
    datasets: [{
      label: 'Savdo',
      data: [40000, 48000, 45000, 52000, 55000, 51000],
      backgroundColor: '#10B981'
    }]
  })
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  }
  
  const recentOrders = ref([
    { id: 1, customer: 'ABC Company', product: 'Plastik idish', status: 'pending' },
    { id: 2, customer: 'XYZ Ltd', product: 'Qadoqlash', status: 'processing' },
    { id: 3, customer: 'DEF Corp', product: 'Konteyner', status: 'completed' }
  ])
  
  const lowStockItems = ref([
    { id: 1, name: 'Xom ashyo A', stock: 50 },
    { id: 2, name: 'Xom ashyo B', stock: 30 },
    { id: 3, name: 'Qadoqlash materiali', stock: 25 }
  ])
  
  const upcomingTasks = ref([
    { id: 1, title: 'Oylik hisobot tayyorlash', due_date: 'Bugun, 16:00' },
    { id: 2, title: 'Xom ashyo buyurtma qilish', due_date: 'Ertaga' },
    { id: 3, title: 'Uskunalar texnik ko\'rigi', due_date: '2 kundan' }
  ])
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  onMounted(async () => {
    try {
      await analyticsStore.fetchDashboardStats()
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  })
  </script>