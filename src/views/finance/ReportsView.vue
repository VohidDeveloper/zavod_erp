<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Moliyaviy hisobotlar</h1>
          <p class="text-gray-600 mt-1">Daromad, xarajat va foyda hisobotlari</p>
        </div>
      </div>
  
      <!-- Date Range -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Dan</label>
            <input v-model="filters.date_from" type="date" class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Gacha</label>
            <input v-model="filters.date_to" type="date" class="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div class="flex items-end">
            <button @click="fetchReport" class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg">
              Qo'llash
            </button>
          </div>
        </div>
      </div>
  
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-success-50 rounded-lg p-6">
          <p class="text-success-600 text-sm">Jami kirim</p>
          <p class="text-3xl font-bold text-success-700 mt-2">
            {{ formatCurrency(reportData.total_income) }}
          </p>
        </div>
        <div class="bg-danger-50 rounded-lg p-6">
          <p class="text-danger-600 text-sm">Jami chiqim</p>
          <p class="text-3xl font-bold text-danger-700 mt-2">
            {{ formatCurrency(reportData.total_expense) }}
          </p>
        </div>
        <div class="bg-primary-50 rounded-lg p-6">
          <p class="text-primary-600 text-sm">Sof foyda</p>
          <p class="text-3xl font-bold text-primary-700 mt-2">
            {{ formatCurrency(reportData.net_profit) }}
          </p>
        </div>
      </div>
  
      <!-- Table -->
      <div class="bg-white rounded-lg shadow">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left">Kategoriya</th>
              <th class="px-6 py-3 text-right">Kirim</th>
              <th class="px-6 py-3 text-right">Chiqim</th>
              <th class="px-6 py-3 text-right">Farq</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="cat in reportData.categories" :key="cat.name">
              <td class="px-6 py-4">{{ cat.name }}</td>
              <td class="px-6 py-4 text-right text-success-600">{{ formatCurrency(cat.income) }}</td>
              <td class="px-6 py-4 text-right text-danger-600">{{ formatCurrency(cat.expense) }}</td>
              <td class="px-6 py-4 text-right font-semibold"
                  :class="cat.difference >= 0 ? 'text-success-600' : 'text-danger-600'">
                {{ formatCurrency(cat.difference) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { formatCurrency } from '@/utils/formatters'
  
  const filters = reactive({
    date_from: '',
    date_to: '',
  })
  
  const reportData = ref({
    total_income: 15000000,
    total_expense: 8500000,
    net_profit: 6500000,
    categories: [
      { name: 'Sotuvdan tushum', income: 15000000, expense: 0, difference: 15000000 },
      { name: 'Xom-ashyo', income: 0, expense: 4500000, difference: -4500000 },
      { name: 'Ish haqi', income: 0, expense: 2500000, difference: -2500000 },
    ],
  })
  
  function fetchReport() {
    console.log('Fetching report...')
  }
  </script>