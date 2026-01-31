<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-1">Asosiy ko'rsatkichlar va statistika</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Warehouse Stock -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Ombor zaxirasi</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">
              {{ formatNumber(stats?.warehouse?.total_stock || 0) }} kg
            </p>
          </div>
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-gray-600">
            Yetarli: {{ stats?.warehouse?.sufficient_items || 0 }} ta
          </span>
        </div>
      </div>

      <!-- Production Today -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Bugungi ishlab chiqarish</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">
              {{ formatNumber(stats?.production?.today_output || 0) }} kg
            </p>
          </div>
          <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-success-600">
            +{{ stats?.production?.efficiency || 0 }}% samaradorlik
          </span>
        </div>
      </div>

      <!-- Active Orders -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Faol buyurtmalar</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">
              {{ stats?.sales?.active_orders || 0 }}
            </p>
          </div>
          <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-gray-600">
            Pending: {{ stats?.sales?.pending_orders || 0 }}
          </span>
        </div>
      </div>

      <!-- Monthly Revenue -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Oylik daromad</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">
              {{ formatCurrency(stats?.finance?.monthly_revenue || 0) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4">
          <span class="text-sm text-success-600">
            +{{ stats?.finance?.growth || 0 }}% o'sish
          </span>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Production Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Ishlab chiqarish grafigi</h3>
        <div class="h-64 flex items-center justify-center text-gray-400">
          Chart placeholder - ApexCharts will be here
        </div>
      </div>

      <!-- Sales Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Sotuvlar grafigi</h3>
        <div class="h-64 flex items-center justify-center text-gray-400">
          Chart placeholder - ApexCharts will be here
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">So'nggi harakatlar</h3>
      </div>
      <div class="p-6">
        <div v-if="loading" class="text-center py-8 text-gray-500">
          Yuklanmoqda...
        </div>
        <div v-else-if="!recentActivities.length" class="text-center py-8 text-gray-500">
          Harakatlar yo'q
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-primary-600 font-semibold">{{ activity.user.first_name[0] }}</span>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-900">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDateTime(activity.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import { formatNumber, formatCurrency, formatDateTime } from '@/utils/formatters'

const analyticsStore = useAnalyticsStore()

const stats = ref(null)
const recentActivities = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await analyticsStore.fetchDashboard()
    stats.value = data.stats
    recentActivities.value = data.recent_activities || []
  } catch (error) {
    console.error('Dashboard load error:', error)
  } finally {
    loading.value = false
  }
})
</script>