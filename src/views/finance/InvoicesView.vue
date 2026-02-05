<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Hisob-fakturalar</h1>
        <p class="text-gray-600 mt-1">Hisob-fakturalarni boshqarish va kuzatuv</p>
      </div>
      <button
        disabled
        class="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
      >
        + Yangi hisob-faktura
      </button>
    </div>

    <!-- Info Card -->
    <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-purple-900 mb-2">Hisob-fakturalar funksiyasi</h3>
          <p class="text-purple-800 mb-4">
            Bu bo'limda siz mijozlarga hisob-fakturalar yaratishingiz, yuborishingiz va to'lovlarni kuzatib borishingiz mumkin. 
            Avtomatik eslatmalar va to'lov holati kuzatuvi bilan.
          </p>
          <p class="text-sm text-purple-700">
            <strong>Eslatma:</strong> Backend API hali to'liq amalga oshirilmagan. Invoice moduli Sales yoki boshqa modulda bo'lishi mumkin.
          </p>
        </div>
      </div>
    </div>

    <!-- Placeholder Content -->
    <div class="bg-white rounded-lg shadow p-12">
      <div class="text-center">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Hisob-fakturalar tez orada</h3>
        <p class="text-gray-600 mb-6 max-w-md mx-auto">
          Hisob-faktura boshqaruvi funksiyasi ustida ishlanmoqda. 
          Tez orada bu bo'limda hisob-fakturalar yaratish va kuzatish imkoniyati paydo bo'ladi.
        </p>
        
        <!-- Feature Preview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-8">
          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Yaratish</h4>
            <p class="text-sm text-gray-600">Tez va oson hisob-faktura yaratish</p>
          </div>

          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Yuborish</h4>
            <p class="text-sm text-gray-600">Email orqali avtomatik yuborish</p>
          </div>

          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Kuzatuv</h4>
            <p class="text-sm text-gray-600">To'lov holatini kuzatish</p>
          </div>

          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Eslatmalar</h4>
            <p class="text-sm text-gray-600">Avtomatik to'lov eslatmalari</p>
          </div>
        </div>

        <!-- Alternative Suggestion -->
        <div class="mt-8 p-6 bg-blue-50 rounded-lg max-w-2xl mx-auto">
          <h4 class="font-semibold text-blue-900 mb-2">Hozircha...</h4>
          <p class="text-sm text-blue-800">
            Hisob-fakturalar uchun <strong>Tranzaksiyalar</strong> bo'limidan foydalanishingiz mumkin. 
            Har bir savdo yoki xizmat uchun tranzaksiya yarating va to'lovlarni kuzating.
          </p>
          <button
            @click="$router.push({ name: 'finance-transactions' })"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tranzaksiyalar bo'limiga o'tish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>