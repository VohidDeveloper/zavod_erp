<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ishlab chiqarish ma'lumotlari</h1>
          <p class="text-gray-600 mt-1">Ishlab chiqarish hisobotlari va statistika</p>
        </div>
        <select v-model="selectedPeriod" class="input" @change="fetchOutput">
          <option value="today">Bugun</option>
          <option value="week">Bu hafta</option>
          <option value="month">Bu oy</option>
        </select>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-gradient-to-br from-success-500 to-success-600 rounded-lg shadow-lg p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-success-100 text-sm">Jami ishlab chiqarildi</p>
              <p class="text-3xl font-bold mt-2">{{ formatNumber(stats.total_output) }}</p>
            </div>
            <div class="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p class="text-success-100 text-xs mt-4">dona mahsulot</p>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Sifatli</p>
              <p class="text-2xl font-bold text-success-600 mt-2">{{ formatNumber(stats.quality) }}</p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-4">
            {{ ((stats.quality / stats.total_output) * 100).toFixed(1) }}% sifat
          </p>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Nuqsonli</p>
              <p class="text-2xl font-bold text-danger-600 mt-2">{{ formatNumber(stats.defective) }}</p>
            </div>
            <div class="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-4">
            {{ ((stats.defective / stats.total_output) * 100).toFixed(1) }}% nuqson
          </p>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Samaradorlik</p>
              <p class="text-2xl font-bold text-warning-600 mt-2">{{ stats.efficiency }}%</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              class="bg-warning-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${stats.efficiency}%` }"
            ></div>
          </div>
        </div>
      </div>
  
      <!-- Output Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahsulot</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liniya</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ishlab chiqarildi</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sifatli</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nuqsonli</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sana</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="6" class="px-6 py-8 text-center">
                <div class="flex items-center justify-center">
                  <svg class="animate-spin h-6 w-6 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span class="text-gray-600">Yuklanmoqda...</span>
                </div>
              </td>
            </tr>
  
            <tr v-else-if="!outputs.length">
              <td colspan="6" class="px-6 py-12 text-center">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-gray-500">Ma'lumotlar topilmadi</p>
              </td>
            </tr>
  
            <tr v-else v-for="output in outputs" :key="output.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ output.product?.name }}</p>
                  <p class="text-xs text-gray-500">{{ output.product?.code }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ output.line?.name }}</td>
              <td class="px-6 py-4 text-right text-sm font-bold text-gray-900">
                {{ formatNumber(output.total_quantity) }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-semibold text-success-600">
                {{ formatNumber(output.quality_quantity) }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-semibold text-danger-600">
                {{ formatNumber(output.defective_quantity) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ formatDate(output.production_date) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useProductionStore } from '@/stores/production'
  import { useNotifications } from '@/composables/useNotifications'
  import { formatNumber, formatDate } from '@/utils/formatters'
  
  const productionStore = useProductionStore()
  const notifications = useNotifications()
  
  const selectedPeriod = ref('today')
  
  const stats = ref({
    total_output: 12540,
    quality: 11860,
    defective: 680,
    efficiency: 87,
  })
  
  const outputs = ref([])
  const loading = ref(false)
  
  onMounted(() => {
    fetchOutput()
  })
  
  async function fetchOutput() {
    loading.value = true
    try {
      await productionStore.fetchOutput({ period: selectedPeriod.value })
      outputs.value = productionStore.outputs
    } catch (error) {
      notifications.apiError(error)
    } finally {
      loading.value = false
    }
  }
  </script>