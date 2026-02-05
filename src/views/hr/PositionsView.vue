<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Lavozimlar</h1>
          <p class="text-gray-600 mt-1">Tashkilot lavozim va ish o'rinlari</p>
        </div>
        <button
          disabled
          class="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
        >
          + Yangi lavozim
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
            <h3 class="text-lg font-semibold text-blue-900 mb-2">Lavozimlar funksiyasi</h3>
            <p class="text-blue-800 mb-4">
              Bu bo'limda siz tashkilotdagi barcha lavozimlarni boshqarishingiz mumkin. 
              Har bir lavozim uchun mas'uliyat va ish haqini belgilang.
            </p>
            <p class="text-sm text-blue-700">
              <strong>Eslatma:</strong> Backend API hali to'liq amalga oshirilmagan. 
              Hozircha xodimlar yaratishda lavozimni to'g'ridan-to'g'ri kiritasiz.
            </p>
          </div>
        </div>
      </div>
  
      <!-- Current Positions (from employees) -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Joriy lavozimlar (xodimlardan)</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="position in uniquePositions"
            :key="position.name"
            class="p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-semibold text-gray-900">{{ position.name }}</h4>
              <span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {{ position.count }} xodim
              </span>
            </div>
            <p class="text-sm text-gray-600">
              Bo'limlar: {{ position.departments.join(', ') }}
            </p>
          </div>
        </div>
  
        <div v-if="uniquePositions.length === 0" class="text-center py-8 text-gray-500">
          Hozircha lavozimlar yo'q. Xodim qo'shganingizda avtomatik paydo bo'ladi.
        </div>
      </div>
  
      <!-- Placeholder Content -->
      <div class="bg-white rounded-lg shadow p-12">
        <div class="text-center">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Lavozimlar boshqaruvi tez orada</h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">
            Lavozimlar katalogi funksiyasi ustida ishlanmoqda. 
            Tez orada bu bo'limda lavozimlarni alohida boshqarish imkoniyati paydo bo'ladi.
          </p>
          
          <!-- Feature Preview -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
            <div class="p-6 bg-gray-50 rounded-lg">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">Lavozimlar yaratish</h4>
              <p class="text-sm text-gray-600">Tashkilotdagi barcha lavozimlarni boshqaring</p>
            </div>
  
            <div class="p-6 bg-gray-50 rounded-lg">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">Mas'uliyatlar</h4>
              <p class="text-sm text-gray-600">Har bir lavozim uchun mas'uliyatlarni belgilang</p>
            </div>
  
            <div class="p-6 bg-gray-50 rounded-lg">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">Ish haqi reja</h4>
              <p class="text-sm text-gray-600">Lavozimlar bo'yicha ish haqi oralig'ini belgilang</p>
            </div>
          </div>
  
          <!-- Alternative Suggestion -->
          <div class="mt-8 p-6 bg-blue-50 rounded-lg max-w-2xl mx-auto">
            <h4 class="font-semibold text-blue-900 mb-2">Hozircha...</h4>
            <p class="text-sm text-blue-800">
              Lavozimlar uchun <strong>Xodimlar</strong> bo'limidan foydalaning. 
              Yangi xodim qo'shganingizda lavozimni to'g'ridan-to'g'ri kiriting.
            </p>
            <button
              @click="$router.push({ name: 'hr-employees' })"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Xodimlar bo'limiga o'tish
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useHRStore } from '@/stores/hr'
  
  const router = useRouter()
  const hrStore = useHRStore()
  
  const employees = computed(() => hrStore.employees)
  
  // Extract unique positions from employees
  const uniquePositions = computed(() => {
    const positionsMap = new Map()
    
    employees.value.forEach(emp => {
      if (!emp.position) return
      
      if (positionsMap.has(emp.position)) {
        const pos = positionsMap.get(emp.position)
        pos.count++
        if (emp.department?.name && !pos.departments.includes(emp.department.name)) {
          pos.departments.push(emp.department.name)
        }
      } else {
        positionsMap.set(emp.position, {
          name: emp.position,
          count: 1,
          departments: emp.department?.name ? [emp.department.name] : []
        })
      }
    })
    
    return Array.from(positionsMap.values()).sort((a, b) => b.count - a.count)
  })
  
  onMounted(async () => {
    await hrStore.fetchEmployees()
  })
  </script>