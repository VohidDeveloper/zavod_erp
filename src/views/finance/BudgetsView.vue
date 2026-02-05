<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Byudjetlar</h1>
        <p class="text-gray-600 mt-1">Xarajatlarni rejalashtirish va nazorat qilish</p>
      </div>
      <button
        disabled
        class="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
      >
        + Yangi byudjet
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
          <h3 class="text-lg font-semibold text-blue-900 mb-2">Byudjetlar funksiyasi</h3>
          <p class="text-blue-800 mb-4">
            Bu bo'limda siz xarajatlar byudjetlarini yaratishingiz va boshqarishingiz mumkin. 
            Har bir kategoriya uchun byudjet belgilang va sarflarni real vaqt rejimida kuzating.
          </p>
          <p class="text-sm text-blue-700">
            <strong>Eslatma:</strong> Backend API hali to'liq amalga oshirilmagan. Tez orada yangi funksiyalar qo'shiladi.
          </p>
        </div>
      </div>
    </div>

    <!-- Placeholder Content -->
    <div class="bg-white rounded-lg shadow p-12">
      <div class="text-center">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Byudjetlar tez orada</h3>
        <p class="text-gray-600 mb-6 max-w-md mx-auto">
          Byudjet boshqaruvi funksiyasi ustida ishlanmoqda. 
          Tez orada bu bo'limda xarajatlarni rejalashtirish va nazorat qilish imkoniyati paydo bo'ladi.
        </p>
        
        <!-- Feature Preview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Byudjet yaratish</h4>
            <p class="text-sm text-gray-600">Har bir kategoriya uchun oylik, choraklik yoki yillik byudjet belgilang</p>
          </div>

          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Real vaqt kuzatuv</h4>
            <p class="text-sm text-gray-600">Sarflarni real vaqt rejimida kuzatib boring va byudjet limitlarini nazorat qiling</p>
          </div>

          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Ogohlantirishlar</h4>
            <p class="text-sm text-gray-600">Byudjet limitiga yaqinlashganda yoki oshib ketganda avtomatik ogohlantirishlar oling</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Placeholder component - no backend integration yet
</script>