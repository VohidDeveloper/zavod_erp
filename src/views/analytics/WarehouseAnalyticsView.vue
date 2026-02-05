<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ombor Tahlili</h1>
        <p class="text-gray-600 mt-1">Ombor ko'rsatkichlari va statistika</p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="fetchData"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button
          @click="exportReport"
          class="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Eksport
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="fetchData" class="mt-2 text-sm text-red-600 hover:text-red-700">
        Qayta urinish
      </button>
    </div>

    <!-- Content -->
    <template v-else-if="inventoryData">
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Raw Materials -->
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm">Xom-ashyo</p>
              <p class="text-3xl font-bold mt-2">{{ formatNumber(inventoryData.total_raw_materials) }}</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-blue-100">
              Qiymat: {{ formatCurrency(inventoryData.total_raw_material_value) }}
            </span>
          </div>
        </div>

        <!-- Finished Products -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Tayyor mahsulot</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ formatNumber(inventoryData.total_finished_products) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              Qiymat: {{ formatCurrency(inventoryData.total_finished_product_value) }}
            </span>
          </div>
        </div>

        <!-- Low Stock Materials -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Kam qolgan</p>
              <p class="text-2xl font-bold text-amber-600 mt-2">{{ formatNumber(inventoryData.low_stock_materials) }}</p>
            </div>
            <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              Minimal qoldiqdan past
            </span>
          </div>
        </div>

        <!-- Spare Parts -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Ehtiyot qismlar</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ formatNumber(inventoryData.total_spare_parts) }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              Qiymat: {{ formatCurrency(inventoryData.total_spare_parts_value) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Raw Materials by Category -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Xom-ashyo kategoriya bo'yicha</h3>
          <div v-if="inventoryData.raw_materials_by_category.length > 0" class="space-y-3">
            <div 
              v-for="(category, index) in inventoryData.raw_materials_by_category" 
              :key="index"
              class="space-y-2"
            >
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-gray-900">{{ category.name || category.category }}</span>
                <span class="text-gray-600">{{ formatNumber(category.quantity || category.count) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div 
                  class="h-3 rounded-full bg-blue-500 transition-all duration-500"
                  :style="{ width: `${(category.quantity / inventoryData.total_raw_materials * 100).toFixed(0)}%` }"
                ></div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-400 py-8">
            Ma'lumot yo'q
          </div>
        </div>

        <!-- Stock Status Distribution -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Qoldiq holati</h3>
          <div class="space-y-4">
            <!-- Adequate Stock -->
            <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Yetarli</p>
                  <p class="text-sm text-gray-600">Optimal qoldiq</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-900">
                  {{ formatNumber(inventoryData.total_raw_materials + inventoryData.total_finished_products - inventoryData.low_stock_materials - inventoryData.low_stock_finished_products) }}
                </p>
              </div>
            </div>

            <!-- Low Stock -->
            <div class="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Kam qolgan</p>
                  <p class="text-sm text-gray-600">Xom-ashyo va mahsulotlar</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-900">
                  {{ formatNumber(inventoryData.low_stock_materials + inventoryData.low_stock_finished_products) }}
                </p>
              </div>
            </div>

            <!-- Low Spare Parts -->
            <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Ehtiyot qismlar</p>
                  <p class="text-sm text-gray-600">Kam qolgan</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-gray-900">
                  {{ formatNumber(inventoryData.low_stock_spare_parts) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Values Summary -->
      <div class="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Jami inventarizatsiya qiymati</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-600">Xom-ashyo</p>
            <p class="text-2xl font-bold text-blue-600 mt-2">
              {{ formatCurrency(inventoryData.total_raw_material_value) }}
            </p>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-600">Tayyor mahsulot</p>
            <p class="text-2xl font-bold text-green-600 mt-2">
              {{ formatCurrency(inventoryData.total_finished_product_value) }}
            </p>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <p class="text-sm text-gray-600">Ehtiyot qismlar</p>
            <p class="text-2xl font-bold text-purple-600 mt-2">
              {{ formatCurrency(inventoryData.total_spare_parts_value) }}
            </p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <span class="text-lg font-semibold text-gray-900">Umumiy qiymat:</span>
            <span class="text-3xl font-bold text-gray-900">
              {{ formatCurrency(
                parseFloat(inventoryData.total_raw_material_value) + 
                parseFloat(inventoryData.total_finished_product_value) + 
                parseFloat(inventoryData.total_spare_parts_value)
              ) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Low Stock Alerts -->
      <div v-if="inventoryData.low_stock_materials > 0 || inventoryData.low_stock_finished_products > 0 || inventoryData.low_stock_spare_parts > 0" 
           class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Ogohlantirishlar</h3>
            <span class="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
              {{ inventoryData.low_stock_materials + inventoryData.low_stock_finished_products + inventoryData.low_stock_spare_parts }} ta
            </span>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-if="inventoryData.low_stock_materials > 0" 
                 class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="font-medium text-gray-900">Kam xom-ashyo</p>
              </div>
              <p class="text-2xl font-bold text-amber-600 mt-2">{{ inventoryData.low_stock_materials }}</p>
              <p class="text-sm text-gray-600 mt-1">ta xom-ashyo kam qolgan</p>
            </div>

            <div v-if="inventoryData.low_stock_finished_products > 0" 
                 class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="font-medium text-gray-900">Kam tayyor mahsulot</p>
              </div>
              <p class="text-2xl font-bold text-amber-600 mt-2">{{ inventoryData.low_stock_finished_products }}</p>
              <p class="text-sm text-gray-600 mt-1">ta mahsulot kam qolgan</p>
            </div>

            <div v-if="inventoryData.low_stock_spare_parts > 0" 
                 class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="font-medium text-gray-900">Kam ehtiyot qism</p>
              </div>
              <p class="text-2xl font-bold text-red-600 mt-2">{{ inventoryData.low_stock_spare_parts }}</p>
              <p class="text-sm text-gray-600 mt-1">ta ehtiyot qism kam qolgan</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsStore } from '@/stores/analytics'
import { formatNumber, formatCurrency } from '@/utils/formatters'

const analyticsStore = useAnalyticsStore()

const loading = computed(() => analyticsStore.loading)
const error = computed(() => analyticsStore.error?.detail || analyticsStore.error?.message || null)
const inventoryData = computed(() => analyticsStore.inventoryAnalytics)

async function fetchData() {
  try {
    await analyticsStore.fetchInventoryAnalytics()
  } catch (err) {
    console.error('Inventory analytics error:', err)
  }
}

function exportReport() {
  console.log('Export inventory report')
  // TODO: Implement export functionality
}

onMounted(() => {
  fetchData()
})
</script>