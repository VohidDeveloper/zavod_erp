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
        <!-- Receipt Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Receipt Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Qabul raqami <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.receipt_number"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="RCP-001"
            />
          </div>
  
          <!-- Receipt Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Qabul sanasi <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.receipt_date"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
  
          <!-- Supplier -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Yetkazib beruvchi <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.supplier_id"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tanlang</option>
              <option
                v-for="supplier in suppliers"
                :key="supplier.id"
                :value="supplier.id"
              >
                {{ supplier.name }}
              </option>
            </select>
          </div>
  
          <!-- Warehouse -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Ombor <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.warehouse_id"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tanlang</option>
              <option
                v-for="warehouse in warehouses"
                :key="warehouse.id"
                :value="warehouse.id"
              >
                {{ warehouse.name }}
              </option>
            </select>
          </div>
  
          <!-- Invoice Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hisob-faktura raqami
            </label>
            <input
              v-model="form.invoice_number"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="INV-001"
            />
          </div>
  
          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Holat
            </label>
            <select
              v-model="form.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Kutilmoqda</option>
              <option value="completed">Tugatilgan</option>
              <option value="cancelled">Bekor qilingan</option>
            </select>
          </div>
        </div>
  
        <!-- Items Section -->
        <div class="border-t pt-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Mahsulotlar</h3>
            <button
              type="button"
              @click="addItem"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Mahsulot qo'shish
            </button>
          </div>
  
          <!-- Items List -->
          <div class="space-y-4">
            <div
              v-for="(item, index) in form.items"
              :key="index"
              class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Product -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Mahsulot
                  </label>
                  <select
                    v-model="item.product_id"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Tanlang</option>
                    <option
                      v-for="product in products"
                      :key="product.id"
                      :value="product.id"
                    >
                      {{ product.name }}
                    </option>
                  </select>
                </div>
  
                <!-- Quantity -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Miqdor
                  </label>
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
  
                <!-- Unit Price -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Narxi
                  </label>
                  <input
                    v-model.number="item.unit_price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
  
                <!-- Total -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Jami
                  </label>
                  <input
                    :value="formatCurrency(item.quantity * item.unit_price)"
                    type="text"
                    disabled
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm"
                  />
                </div>
              </div>
  
              <!-- Remove Button -->
              <button
                type="button"
                @click="removeItem(index)"
                class="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
  
          <!-- Empty State -->
          <div
            v-if="form.items.length === 0"
            class="text-center py-8 text-gray-500"
          >
            <p>Mahsulot qo'shilmagan</p>
          </div>
        </div>
  
        <!-- Total Amount -->
        <div class="border-t pt-4">
          <div class="flex justify-end">
            <div class="text-right">
              <p class="text-sm text-gray-600">Umumiy summa:</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ formatCurrency(totalAmount) }}
              </p>
            </div>
          </div>
        </div>
  
        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Izoh
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Qo'shimcha ma'lumot..."
          ></textarea>
        </div>
      </form>
    </FormModal>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { FormModal } from '@/components/common'
  import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
  import { formatCurrency } from '@/utils/formatters'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    receipt: {
      type: Object,
      default: null
    },
    suppliers: {
      type: Array,
      default: () => []
    },
    warehouses: {
      type: Array,
      default: () => []
    },
    products: {
      type: Array,
      default: () => []
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'submit', 'close'])
  
  const loading = ref(false)
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const modalTitle = computed(() => {
    return props.receipt ? 'Qabulni tahrirlash' : 'Yangi qabul'
  })
  
  const form = ref({
    receipt_number: '',
    receipt_date: new Date().toISOString().split('T')[0],
    supplier_id: '',
    warehouse_id: '',
    invoice_number: '',
    status: 'pending',
    items: [],
    notes: ''
  })
  
  const totalAmount = computed(() => {
    return form.value.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unit_price)
    }, 0)
  })
  
  watch(() => props.receipt, (receipt) => {
    if (receipt) {
      form.value = {
        receipt_number: receipt.receipt_number || '',
        receipt_date: receipt.receipt_date || new Date().toISOString().split('T')[0],
        supplier_id: receipt.supplier_id || '',
        warehouse_id: receipt.warehouse_id || '',
        invoice_number: receipt.invoice_number || '',
        status: receipt.status || 'pending',
        items: receipt.items || [],
        notes: receipt.notes || ''
      }
    } else {
      resetForm()
    }
  }, { immediate: true })
  
  function addItem() {
    form.value.items.push({
      product_id: '',
      quantity: 0,
      unit_price: 0
    })
  }
  
  function removeItem(index) {
    form.value.items.splice(index, 1)
  }
  
  function handleSubmit() {
    if (form.value.items.length === 0) {
      alert('Kamida bitta mahsulot qo\'shing')
      return
    }
  
    emit('submit', {
      ...form.value,
      total_amount: totalAmount.value
    })
  }
  
  function handleClose() {
    emit('close')
    resetForm()
  }
  
  function resetForm() {
    form.value = {
      receipt_number: '',
      receipt_date: new Date().toISOString().split('T')[0],
      supplier_id: '',
      warehouse_id: '',
      invoice_number: '',
      status: 'pending',
      items: [],
      notes: ''
    }
  }
  </script>