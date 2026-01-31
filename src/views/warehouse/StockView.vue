<template>
    <div class="space-y-6">
      <div class="flex justify-between">
        <h1 class="text-2xl font-bold">Qoldiqlar</h1>
        <div class="flex gap-2">
          <button @click="adjustStock" class="bg-blue-600 text-white px-4 py-2 rounded-lg">Tuzatish</button>
          <button @click="exportStock" class="border px-4 py-2 rounded-lg">Eksport</button>
        </div>
      </div>
  
      <div class="grid md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border">
          <p class="text-sm text-gray-600">Jami qoldiq</p>
          <p class="text-2xl font-bold mt-2">{{ formatNumber(stats.total || 0) }}</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border">
          <p class="text-sm text-gray-600">Kam qolgan</p>
          <p class="text-2xl font-bold text-amber-600 mt-2">{{ stats.low || 0 }}</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border">
          <p class="text-sm text-gray-600">Tugagan</p>
          <p class="text-2xl font-bold text-red-600 mt-2">{{ stats.out || 0 }}</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border">
          <p class="text-sm text-gray-600">Umumiy qiymat</p>
          <p class="text-2xl font-bold mt-2">{{ formatCurrency(stats.value || 0) }}</p>
        </div>
      </div>
  
      <div class="bg-white rounded-xl shadow-sm border">
        <div class="p-6 border-b">
          <div class="flex gap-4">
            <input v-model="search" placeholder="Qidirish..." class="flex-1 px-4 py-2 border rounded-lg">
            <select v-model="filter" @change="applyFilter" class="px-4 py-2 border rounded-lg">
              <option value="">Barchasi</option>
              <option value="low">Kam qolgan</option>
              <option value="out">Tugagan</option>
            </select>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table v-if="!loading && stocks.length > 0" class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mahsulot</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qoldiq</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Birligi</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qiymat</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amallar</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="stock in filteredStocks" :key="stock.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium">{{ stock.product }}</td>
                <td class="px-6 py-4 text-sm">{{ stock.sku }}</td>
                <td class="px-6 py-4">
                  <span :class="getStockClass(stock)">{{ stock.stock }}</span>
                </td>
                <td class="px-6 py-4 text-sm">{{ stock.unit }}</td>
                <td class="px-6 py-4 text-sm">{{ stock.min_stock }}</td>
                <td class="px-6 py-4 text-sm font-medium">{{ formatCurrency(stock.value) }}</td>
                <td class="px-6 py-4 text-right">
                  <button @click="adjust(stock)" class="text-blue-600">Tuzatish</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="loading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useWarehouseStore } from '@/stores/warehouse'
  
  const store = useWarehouseStore()
  const loading = ref(false)
  const stocks = ref([])
  const search = ref('')
  const filter = ref('')
  const stats = ref({ total: 0, low: 0, out: 0, value: 0 })
  
  const filteredStocks = computed(() => {
    let result = stocks.value
    if (search.value) {
      result = result.filter(s => s.product.toLowerCase().includes(search.value.toLowerCase()))
    }
    if (filter.value === 'low') {
      result = result.filter(s => s.stock <= s.min_stock && s.stock > 0)
    } else if (filter.value === 'out') {
      result = result.filter(s => s.stock === 0)
    }
    return result
  })
  
  const getStockClass = (stock) => {
    if (stock.stock === 0) return 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'
    if (stock.stock <= stock.min_stock) return 'px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800'
    return 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'
  }
  
  const formatNumber = (v) => new Intl.NumberFormat('uz-UZ').format(v)
  const formatCurrency = (v) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS' }).format(v)
  
  onMounted(async () => {
    loading.value = true
    const res = await store.fetchStock()
    stocks.value = res.data || []
    loading.value = false
  })
  </script>