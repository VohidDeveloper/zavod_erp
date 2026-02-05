<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <div class="flex items-center space-x-3">
            <h1 class="text-2xl font-bold text-gray-900">Tranzaksiya tafsilotlari</h1>
            <span
              class="px-3 py-1 text-sm font-medium rounded-full"
              :class="transaction?.transaction_type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ transaction?.transaction_type === 'income' ? 'Kirim' : 'Chiqim' }}
            </span>
          </div>
          <p class="text-gray-600 mt-1">
            {{ formatDate(transaction?.transaction_date) }}
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="editTransaction"
          class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Tahrirlash
        </button>
        <button
          @click="deleteTransaction"
          class="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
        >
          O'chirish
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="fetchTransaction" class="mt-2 text-sm text-red-600 hover:text-red-700">
        Qayta urinish
      </button>
    </div>

    <!-- Content -->
    <template v-else-if="transaction">
      <!-- Amount Card -->
      <div 
        class="border-2 rounded-lg shadow-lg p-6"
        :class="transaction.transaction_type === 'income' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">
              {{ transaction.transaction_type === 'income' ? 'Tushum' : 'Chiqim' }}
            </p>
            <p 
              class="text-4xl font-bold"
              :class="transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'"
            >
              {{ transaction.transaction_type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
            </p>
            <p class="text-sm text-gray-600 mt-2">
              {{ transaction.category?.name || 'N/A' }}
            </p>
          </div>
          <div 
            class="w-20 h-20 rounded-full flex items-center justify-center"
            :class="transaction.transaction_type === 'income' ? 'bg-green-100' : 'bg-red-100'"
          >
            <svg 
              class="w-10 h-10"
              :class="transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                :d="transaction.transaction_type === 'income' ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'" 
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Transaction Details -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Tranzaksiya tafsilotlari</h3>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Sana</p>
                  <p class="font-medium text-gray-900">{{ formatDate(transaction.transaction_date) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Turi</p>
                  <span
                    class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                    :class="transaction.transaction_type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ transaction.transaction_type === 'income' ? 'Kirim' : 'Chiqim' }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Kategoriya</p>
                  <p class="font-medium text-gray-900">{{ transaction.category?.name || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Summa</p>
                  <p 
                    class="font-bold text-lg"
                    :class="transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'"
                  >
                    {{ formatCurrency(transaction.amount) }}
                  </p>
                </div>
              </div>

              <div v-if="transaction.reference_type">
                <p class="text-sm text-gray-600">Havola turi</p>
                <p class="font-medium text-gray-900">{{ transaction.reference_type }}</p>
              </div>

              <div v-if="transaction.description">
                <p class="text-sm text-gray-600 mb-2">Tavsif</p>
                <p class="text-gray-700">{{ transaction.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Transaction Info -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold mb-4">Ma'lumot</h3>

            <dl class="space-y-3 text-sm">
              <div>
                <dt class="text-gray-600">Yaratilgan:</dt>
                <dd class="font-medium text-gray-900">{{ formatDate(transaction.created_at) }}</dd>
              </div>
              <div v-if="transaction.creator">
                <dt class="text-gray-600">Yaratuvchi:</dt>
                <dd class="font-medium text-gray-900">{{ transaction.creator.full_name || 'N/A' }}</dd>
              </div>
              <div v-if="transaction.updated_at">
                <dt class="text-gray-600">Yangilangan:</dt>
                <dd class="font-medium text-gray-900">{{ formatDate(transaction.updated_at) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFinanceStore } from '@/stores/finance'
import { formatCurrency, formatDate } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const financeStore = useFinanceStore()

const loading = computed(() => financeStore.loading)
const error = computed(() => financeStore.error?.detail || financeStore.error?.message || null)
const transaction = computed(() => financeStore.currentTransaction)

async function fetchTransaction() {
  try {
    await financeStore.fetchTransaction(route.params.id)
  } catch (err) {
    console.error('Failed to fetch transaction:', err)
  }
}

function editTransaction() {
  router.push(`/finance/transactions/${route.params.id}/edit`)
}

async function deleteTransaction() {
  if (!confirm('Tranzaksiyani o\'chirishga ishonchingiz komilmi?')) return

  try {
    await financeStore.deleteTransaction(route.params.id)
    router.push({ name: 'finance-transactions' })
  } catch (err) {
    console.error('Failed to delete transaction:', err)
  }
}

onMounted(() => {
  fetchTransaction()
})
</script>