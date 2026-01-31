<template>
    <FormModal
      v-model="isOpen"
      :title="modalTitle"
      :loading="loading"
      size="2xl"
      @submit="handleSubmit"
      @close="handleClose"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Transaction Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tranzaksiya turi <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-4">
            <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                   :class="{ 'border-green-500 bg-green-50': form.type === 'income' }">
              <input
                v-model="form.type"
                type="radio"
                value="income"
                class="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span class="ml-3">
                <span class="block text-sm font-medium text-gray-900">Kirim</span>
                <span class="block text-xs text-gray-500">Tushgan pul</span>
              </span>
            </label>
            
            <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                   :class="{ 'border-red-500 bg-red-50': form.type === 'expense' }">
              <input
                v-model="form.type"
                type="radio"
                value="expense"
                class="w-4 h-4 text-red-600 focus:ring-red-500"
              />
              <span class="ml-3">
                <span class="block text-sm font-medium text-gray-900">Chiqim</span>
                <span class="block text-xs text-gray-500">Chiqarilgan pul</span>
              </span>
            </label>
          </div>
        </div>
  
        <!-- Amount & Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Summa <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="form.amount"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-4 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.amount }"
                placeholder="0.00"
                @input="validateAmount"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                so'm
              </span>
            </div>
            <p v-if="errors.amount" class="mt-1 text-sm text-red-600">{{ errors.amount }}</p>
            <p v-if="form.amount > 0" class="mt-1 text-xs text-gray-500">
              {{ formatAmountInWords(form.amount) }}
            </p>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sana <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.date"
              type="date"
              required
              :max="today"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.date }"
            />
            <p v-if="errors.date" class="mt-1 text-sm text-red-600">{{ errors.date }}</p>
          </div>
        </div>
  
        <!-- Category & Account -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Kategoriya <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.category_id"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.category_id }"
            >
              <option value="">Tanlang</option>
              <optgroup v-if="form.type === 'income'" label="Kirim kategoriyalari">
                <option value="1">Mahsulot sotish</option>
                <option value="2">Xizmat ko'rsatish</option>
                <option value="3">Investitsiya</option>
                <option value="4">Boshqa kirimlar</option>
              </optgroup>
              <optgroup v-if="form.type === 'expense'" label="Chiqim kategoriyalari">
                <option value="5">Xomashyo</option>
                <option value="6">Ish haqi</option>
                <option value="7">Kommunal xizmatlar</option>
                <option value="8">Transport</option>
                <option value="9">Ofis xarajatlari</option>
                <option value="10">Marketing</option>
                <option value="11">Soliq</option>
                <option value="12">Boshqa xarajatlar</option>
              </optgroup>
            </select>
            <p v-if="errors.category_id" class="mt-1 text-sm text-red-600">{{ errors.category_id }}</p>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hisob raqam <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.account_id"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.account_id }"
            >
              <option value="">Tanlang</option>
              <option value="1">Asosiy hisob - UZS (****1234)</option>
              <option value="2">Naqd pul - Kassa</option>
              <option value="3">Dollar hisobi - USD (****5678)</option>
              <option value="4">Plastik karta (****9012)</option>
            </select>
            <p v-if="errors.account_id" class="mt-1 text-sm text-red-600">{{ errors.account_id }}</p>
          </div>
        </div>
  
        <!-- Payment Method -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            To'lov usuli <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label
              v-for="method in paymentMethods"
              :key="method.value"
              class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              :class="{ 'border-blue-500 bg-blue-50': form.payment_method === method.value }"
            >
              <input
                v-model="form.payment_method"
                type="radio"
                :value="method.value"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-900">{{ method.label }}</span>
            </label>
          </div>
        </div>
  
        <!-- Reference (optional) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hujjat raqami
            </label>
            <input
              v-model="form.reference_number"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="INV-001"
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Kontragent
            </label>
            <input
              v-model="form.counterparty"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Kontragent nomi"
            />
          </div>
        </div>
  
        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Izoh <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            :class="{ 'border-red-500': errors.description }"
            placeholder="Tranzaksiya haqida qisqacha ma'lumot..."
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
          <p class="mt-1 text-xs text-gray-500">{{ form.description.length }} / 500 belgi</p>
        </div>
  
        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Teglar
          </label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="(tag, index) in form.tags"
              :key="index"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {{ tag }}
              <button
                type="button"
                @click="removeTag(index)"
                class="ml-2 text-blue-600 hover:text-blue-800"
              >
                <XMarkIcon class="w-4 h-4" />
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newTag"
              type="text"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Teg qo'shish..."
              @keypress.enter.prevent="addTag"
            />
            <button
              type="button"
              @click="addTag"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Qo'shish
            </button>
          </div>
        </div>
  
        <!-- Summary -->
        <div v-if="form.amount > 0" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jami summa</p>
              <p class="text-2xl font-bold"
                 :class="form.type === 'income' ? 'text-green-600' : 'text-red-600'">
                {{ form.type === 'income' ? '+' : '-' }} {{ formatCurrency(form.amount) }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Kategoriya</p>
              <p class="text-base font-medium text-gray-900">{{ getCategoryName(form.category_id) }}</p>
            </div>
          </div>
        </div>
  
        <!-- Error Summary -->
        <div v-if="Object.keys(errors).length > 0" class="bg-red-50 border-l-4 border-red-500 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">Iltimos, barcha majburiy maydonlarni to'ldiring</p>
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { FormModal } from '@/components/common'
  import { XMarkIcon } from '@heroicons/vue/24/outline'
  import { formatCurrency } from '@/utils/formatters'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    transaction: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'submit', 'close'])
  
  const loading = ref(false)
  const errors = ref({})
  const newTag = ref('')
  
  const today = new Date().toISOString().split('T')[0]
  
  const paymentMethods = [
    { value: 'cash', label: 'Naqd' },
    { value: 'card', label: 'Karta' },
    { value: 'transfer', label: 'O\'tkazma' },
    { value: 'check', label: 'Chek' }
  ]
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const modalTitle = computed(() => {
    return props.transaction ? 'Tranzaksiyani tahrirlash' : 'Yangi tranzaksiya'
  })
  
  const form = ref({
    type: 'income',
    amount: 0,
    date: today,
    category_id: '',
    account_id: '',
    payment_method: 'cash',
    reference_number: '',
    counterparty: '',
    description: '',
    tags: []
  })
  
  watch(() => props.transaction, (transaction) => {
    if (transaction) {
      form.value = {
        type: transaction.type || 'income',
        amount: transaction.amount || 0,
        date: transaction.date || today,
        category_id: transaction.category_id || '',
        account_id: transaction.account_id || '',
        payment_method: transaction.payment_method || 'cash',
        reference_number: transaction.reference_number || '',
        counterparty: transaction.counterparty || '',
        description: transaction.description || '',
        tags: transaction.tags || []
      }
    } else {
      resetForm()
    }
    errors.value = {}
  }, { immediate: true })
  
  function validateAmount() {
    if (form.value.amount <= 0) {
      errors.value.amount = 'Summa 0 dan katta bo\'lishi kerak'
    } else {
      delete errors.value.amount
    }
  }
  
  function formatAmountInWords(amount) {
    if (!amount) return ''
    const formatter = new Intl.NumberFormat('uz-UZ', { style: 'decimal' })
    return `(${formatter.format(amount)} so'm)`
  }
  
  function getCategoryName(categoryId) {
    const categories = {
      '1': 'Mahsulot sotish',
      '2': 'Xizmat ko\'rsatish',
      '3': 'Investitsiya',
      '4': 'Boshqa kirimlar',
      '5': 'Xomashyo',
      '6': 'Ish haqi',
      '7': 'Kommunal xizmatlar',
      '8': 'Transport',
      '9': 'Ofis xarajatlari',
      '10': 'Marketing',
      '11': 'Soliq',
      '12': 'Boshqa xarajatlar'
    }
    return categories[categoryId] || ''
  }
  
  function addTag() {
    if (newTag.value && !form.value.tags.includes(newTag.value)) {
      form.value.tags.push(newTag.value.trim())
      newTag.value = ''
    }
  }
  
  function removeTag(index) {
    form.value.tags.splice(index, 1)
  }
  
  function validateForm() {
    errors.value = {}
    
    if (!form.value.amount || form.value.amount <= 0) {
      errors.value.amount = 'Summa majburiy va 0 dan katta bo\'lishi kerak'
    }
    
    if (!form.value.date) {
      errors.value.date = 'Sana majburiy'
    }
    
    if (!form.value.category_id) {
      errors.value.category_id = 'Kategoriya majburiy'
    }
    
    if (!form.value.account_id) {
      errors.value.account_id = 'Hisob raqam majburiy'
    }
    
    if (!form.value.description || form.value.description.trim() === '') {
      errors.value.description = 'Izoh majburiy'
    } else if (form.value.description.length > 500) {
      errors.value.description = 'Izoh 500 belgidan oshmasligi kerak'
    }
    
    return Object.keys(errors.value).length === 0
  }
  
  async function handleSubmit() {
    if (!validateForm()) {
      return
    }
    
    loading.value = true
    
    try {
      emit('submit', form.value)
    } catch (error) {
      console.error('Form submit error:', error)
    } finally {
      loading.value = false
    }
  }
  
  function handleClose() {
    emit('close')
    errors.value = {}
  }
  
  function resetForm() {
    form.value = {
      type: 'income',
      amount: 0,
      date: today,
      category_id: '',
      account_id: '',
      payment_method: 'cash',
      reference_number: '',
      counterparty: '',
      description: '',
      tags: []
    }
    errors.value = {}
    newTag.value = ''
  }
  </script>