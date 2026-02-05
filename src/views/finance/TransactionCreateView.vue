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
          <h1 class="text-2xl font-bold text-gray-900">
            {{ isEdit ? 'Tranzaksiyani tahrirlash' : 'Yangi tranzaksiya' }}
          </h1>
          <p class="text-gray-600 mt-1">Moliyaviy tranzaksiya yaratish yoki tahrirlash</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="$router.back()"
          class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Bekor qilish
        </button>
        <button
          @click="saveTransaction"
          :disabled="!isValid || saving"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Transaction Type -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Tranzaksiya turi</h3>

          <div class="grid grid-cols-2 gap-4">
            <div
              @click="form.transaction_type = 'income'"
              :class="[
                'p-6 border-2 rounded-lg cursor-pointer transition text-center',
                form.transaction_type === 'income'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              ]"
            >
              <div :class="[
                'w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3',
                form.transaction_type === 'income' ? 'bg-green-100' : 'bg-gray-100'
              ]">
                <svg 
                  :class="['w-8 h-8', form.transaction_type === 'income' ? 'text-green-600' : 'text-gray-400']"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p :class="[
                'font-semibold text-lg',
                form.transaction_type === 'income' ? 'text-green-900' : 'text-gray-700'
              ]">
                Tushum
              </p>
              <p class="text-sm text-gray-600 mt-1">Kirim va daromadlar</p>
            </div>

            <div
              @click="form.transaction_type = 'expense'"
              :class="[
                'p-6 border-2 rounded-lg cursor-pointer transition text-center',
                form.transaction_type === 'expense'
                  ? 'border-red-600 bg-red-50'
                  : 'border-gray-200 hover:border-red-300'
              ]"
            >
              <div :class="[
                'w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3',
                form.transaction_type === 'expense' ? 'bg-red-100' : 'bg-gray-100'
              ]">
                <svg 
                  :class="['w-8 h-8', form.transaction_type === 'expense' ? 'text-red-600' : 'text-gray-400']"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <p :class="[
                'font-semibold text-lg',
                form.transaction_type === 'expense' ? 'text-red-900' : 'text-gray-700'
              ]">
                Chiqim
              </p>
              <p class="text-sm text-gray-600 mt-1">Xarajatlar va to'lovlar</p>
            </div>
          </div>
        </div>

        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Asosiy ma'lumotlar</h3>

          <div class="space-y-4">
            <!-- Amount -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Summa <span class="text-red-600">*</span>
              </label>
              <div class="relative">
                <input
                  v-model.number="form.amount"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                  class="w-full px-4 py-3 text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">
                  UZS
                </span>
              </div>
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Kategoriya <span class="text-red-600">*</span>
              </label>
              <select
                v-model="form.category_id"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Tanlang</option>
                <option 
                  v-for="cat in filteredCategories" 
                  :key="cat.id" 
                  :value="cat.id"
                >
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <!-- Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Sana <span class="text-red-600">*</span>
              </label>
              <input
                v-model="form.transaction_date"
                type="datetime-local"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tavsif
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Qo'shimcha ma'lumotlar..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <!-- Reference (Optional) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Havola turi (ixtiyoriy)
              </label>
              <input
                v-model="form.reference_type"
                type="text"
                placeholder="Masalan: invoice, order"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Summary Card -->
        <div 
          class="border-2 rounded-lg shadow p-6"
          :class="form.transaction_type === 'income' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'"
        >
          <h3 class="text-sm font-medium text-gray-700 mb-3">Xulasa</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Turi:</span>
              <span 
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="form.transaction_type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ form.transaction_type === 'income' ? 'Tushum' : 'Chiqim' }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Summa:</span>
              <span 
                class="text-xl font-bold"
                :class="form.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'"
              >
                {{ form.amount ? formatCurrency(form.amount) : '0 UZS' }}
              </span>
            </div>
            <div v-if="form.category_id" class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Kategoriya:</span>
              <span class="text-sm font-medium text-gray-900">{{ getCategoryName(form.category_id) }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Info -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Maslahatlar</h3>
          <div class="space-y-2 text-sm text-gray-600">
            <div class="flex items-start space-x-2">
              <svg class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p>To'g'ri kategoriyani tanlang</p>
            </div>
            <div class="flex items-start space-x-2">
              <svg class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p>Aniq summa kiriting</p>
            </div>
            <div class="flex items-start space-x-2">
              <svg class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p>Tavsif qo'shing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFinanceStore } from '@/stores/finance'
import { formatCurrency } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const financeStore = useFinanceStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)

const form = reactive({
  transaction_type: 'income',
  amount: 0,
  category_id: '',
  transaction_date: new Date().toISOString().slice(0, 16),
  description: '',
  reference_type: '',
  reference_id: null
})

const categories = computed(() => financeStore.categories)

const filteredCategories = computed(() => {
  return categories.value.filter(cat => cat.category_type === form.transaction_type)
})

const isValid = computed(() => {
  return form.transaction_type &&
         form.amount > 0 &&
         form.category_id &&
         form.transaction_date
})

function getCategoryName(id) {
  return categories.value.find(c => c.id === id)?.name || ''
}

async function saveTransaction() {
  if (!isValid.value) return

  saving.value = true
  try {
    if (isEdit.value) {
      await financeStore.updateTransaction(route.params.id, form)
    } else {
      await financeStore.createTransaction(form)
    }
    router.push({ name: 'finance-transactions' })
  } catch (err) {
    console.error('Failed to save transaction:', err)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await financeStore.fetchCategories()

  if (isEdit.value) {
    const transaction = await financeStore.fetchTransaction(route.params.id)
    Object.assign(form, {
      transaction_type: transaction.transaction_type,
      amount: transaction.amount,
      category_id: transaction.category_id,
      transaction_date: transaction.transaction_date,
      description: transaction.description || '',
      reference_type: transaction.reference_type || '',
      reference_id: transaction.reference_id
    })
  }
})
</script>