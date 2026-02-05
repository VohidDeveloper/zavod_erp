<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Maxsus Hisobotlar</h1>
        <p class="text-gray-600 mt-1">O'zingizning maxsus hisobotlaringizni yarating</p>
      </div>
      <button
        @click="createNewReport"
        class="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Yangi hisobot
      </button>
    </div>

    <!-- Info Card -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-blue-900 mb-2">Maxsus hisobotlar funksiyasi</h3>
          <p class="text-blue-800 mb-4">
            Bu bo'limda siz o'zingizning maxsus hisobotlaringizni yaratishingiz va boshqarishingiz mumkin. 
            Turli modullardan ma'lumotlarni birlashtirib, kerakli ko'rsatkichlarni tahlil qilishingiz mumkin.
          </p>
          <p class="text-sm text-blue-700">
            <strong>Eslatma:</strong> Backend API hali to'liq amalga oshirilmagan. Tez orada yangi funksiyalar qo'shiladi.
          </p>
        </div>
      </div>
    </div>

    <!-- Report Builder Placeholder -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Hisobot yaratuvchi</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Data Source Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ma'lumot manbai</label>
          <select 
            v-model="selectedSource"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tanlang...</option>
            <option value="sales">Savdo</option>
            <option value="production">Ishlab chiqarish</option>
            <option value="warehouse">Ombor</option>
            <option value="finance">Moliya</option>
            <option value="hr">Kadrlar</option>
            <option value="maintenance">Texnik xizmat</option>
          </select>
        </div>

        <!-- Date Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Sana oralig'i</label>
          <select 
            v-model="dateRange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Bugun</option>
            <option value="week">Bu hafta</option>
            <option value="month">Bu oy</option>
            <option value="quarter">Bu chorak</option>
            <option value="year">Bu yil</option>
            <option value="custom">Maxsus</option>
          </select>
        </div>

        <!-- Report Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Hisobot turi</label>
          <select 
            v-model="reportType"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tanlang...</option>
            <option value="summary">Umumiy</option>
            <option value="detailed">Batafsil</option>
            <option value="comparison">Taqqoslash</option>
            <option value="trend">Tendensiya</option>
          </select>
        </div>
      </div>

      <!-- Metrics Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Ko'rsatkichlar</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label 
            v-for="metric in availableMetrics" 
            :key="metric.id"
            class="flex items-center p-3 border border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer"
          >
            <input 
              type="checkbox" 
              :value="metric.id"
              v-model="selectedMetrics"
              class="mr-2 h-4 w-4 text-blue-600"
            >
            <span class="text-sm text-gray-700">{{ metric.name }}</span>
          </label>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center space-x-3">
        <button
          @click="generateReport"
          :disabled="!canGenerateReport"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hisobot yaratish
        </button>
        <button
          @click="resetForm"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Tozalash
        </button>
      </div>
    </div>

    <!-- Saved Reports -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Saqlangan hisobotlar</h3>
      </div>
      <div class="p-6">
        <div v-if="savedReports.length > 0" class="space-y-3">
          <div
            v-for="report in savedReports"
            :key="report.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition"
          >
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ report.name }}</p>
                <p class="text-sm text-gray-600">{{ report.description }}</p>
                <p class="text-xs text-gray-500 mt-1">Yaratilgan: {{ report.created }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="viewReport(report)"
                class="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                Ko'rish
              </button>
              <button
                @click="deleteReport(report)"
                class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-gray-500">Hali saqlangan hisobotlar yo'q</p>
          <button
            @click="createNewReport"
            class="mt-4 text-blue-600 hover:text-blue-700"
          >
            Birinchi hisobotni yarating
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedSource = ref('')
const dateRange = ref('month')
const reportType = ref('')
const selectedMetrics = ref([])

const availableMetrics = ref([
  { id: 1, name: 'Jami' },
  { id: 2, name: 'O\'rtacha' },
  { id: 3, name: 'Maksimal' },
  { id: 4, name: 'Minimal' },
  { id: 5, name: 'O\'zgarish %' },
  { id: 6, name: 'Tendensiya' },
  { id: 7, name: 'Taqsimot' },
  { id: 8, name: 'Taqqoslash' }
])

const savedReports = ref([
  {
    id: 1,
    name: 'Oylik savdo hisoboti',
    description: 'Savdo bo\'yicha umumiy ko\'rsatkichlar',
    created: '2024-01-15'
  },
  {
    id: 2,
    name: 'Ishlab chiqarish samaradorligi',
    description: 'Har bir liniya bo\'yicha batafsil tahlil',
    created: '2024-01-10'
  }
])

const canGenerateReport = computed(() => {
  return selectedSource.value && reportType.value && selectedMetrics.value.length > 0
})

function createNewReport() {
  console.log('Create new report')
}

function generateReport() {
  console.log('Generate report:', {
    source: selectedSource.value,
    dateRange: dateRange.value,
    type: reportType.value,
    metrics: selectedMetrics.value
  })
  
  alert('Hisobot yaratish funksiyasi backend API tayyor bo\'lgandan keyin faollashtiriladi.')
}

function resetForm() {
  selectedSource.value = ''
  dateRange.value = 'month'
  reportType.value = ''
  selectedMetrics.value = []
}

function viewReport(report) {
  console.log('View report:', report)
  alert(`${report.name} hisobotini ko'rish funksiyasi ishlab chiqilmoqda.`)
}

function deleteReport(report) {
  console.log('Delete report:', report)
  if (confirm(`${report.name} hisobotini o'chirmoqchimisiz?`)) {
    const index = savedReports.value.findIndex(r => r.id === report.id)
    if (index !== -1) {
      savedReports.value.splice(index, 1)
    }
  }
}
</script>