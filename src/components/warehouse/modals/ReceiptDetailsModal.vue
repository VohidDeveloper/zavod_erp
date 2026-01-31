<template>
    <Modal
      v-model="isOpen"
      :title="`Qabul #${receipt?.receipt_number || ''}`"
      size="2xl"
      @close="handleClose"
    >
      <div v-if="receipt" class="space-y-6">
        <!-- Receipt Info -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Qabul raqami</p>
              <p class="text-base font-medium text-gray-900">{{ receipt.receipt_number }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Sana</p>
              <p class="text-base font-medium text-gray-900">{{ formatDate(receipt.receipt_date) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Yetkazib beruvchi</p>
              <p class="text-base font-medium text-gray-900">{{ receipt.supplier?.name || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Ombor</p>
              <p class="text-base font-medium text-gray-900">{{ receipt.warehouse?.name || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Hisob-faktura</p>
              <p class="text-base font-medium text-gray-900">{{ receipt.invoice_number || '-' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Holat</p>
              <StatusBadge :status="receipt.status" />
            </div>
          </div>
        </div>
  
        <!-- Items Table -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Mahsulotlar</h3>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mahsulot
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Miqdor
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Narxi
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jami
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(item, index) in receipt.items"
                  :key="item.id || index"
                >
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ index + 1 }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900">
                    {{ item.product?.name || item.product_name || '-' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 text-right">
                    {{ formatNumber(item.quantity) }} {{ item.unit || 'kg' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-900 text-right">
                    {{ formatCurrency(item.unit_price) }}
                  </td>
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                    {{ formatCurrency(item.quantity * item.unit_price) }}
                  </td>
                </tr>
                
                <!-- Empty State -->
                <tr v-if="!receipt.items || receipt.items.length === 0">
                  <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                    Mahsulotlar topilmadi
                  </td>
                </tr>
              </tbody>
              
              <!-- Total Row -->
              <tfoot v-if="receipt.items && receipt.items.length > 0" class="bg-gray-50">
                <tr>
                  <td colspan="4" class="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                    Jami summa:
                  </td>
                  <td class="px-4 py-3 text-base font-bold text-gray-900 text-right">
                    {{ formatCurrency(totalAmount) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
  
        <!-- Notes -->
        <div v-if="receipt.notes" class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <InformationCircleIcon class="h-5 w-5 text-yellow-400" />
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                <span class="font-medium">Izoh:</span>
                {{ receipt.notes }}
              </p>
            </div>
          </div>
        </div>
  
        <!-- Created/Updated Info -->
        <div class="border-t pt-4">
          <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p>Yaratilgan: {{ formatDateTime(receipt.created_at) }}</p>
              <p v-if="receipt.created_by">Yaratgan: {{ receipt.created_by?.name || '-' }}</p>
            </div>
            <div v-if="receipt.updated_at">
              <p>Yangilangan: {{ formatDateTime(receipt.updated_at) }}</p>
              <p v-if="receipt.updated_by">Yangilagan: {{ receipt.updated_by?.name || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Loading State -->
      <div v-else class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
  
      <!-- Footer Actions -->
      <template #footer>
        <div class="flex items-center justify-between">
          <div class="flex gap-2">
            <button
              type="button"
              @click="handlePrint"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <PrinterIcon class="w-4 h-4 mr-2" />
              Chop etish
            </button>
            <button
              v-if="canEdit"
              type="button"
              @click="handleEdit"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <PencilIcon class="w-4 h-4 mr-2" />
              Tahrirlash
            </button>
          </div>
          
          <button
            type="button"
            @click="handleClose"
            class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            Yopish
          </button>
        </div>
      </template>
    </Modal>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { Modal } from '@/components/common'
  import { StatusBadge } from '@/components/common'
  import {
    PrinterIcon,
    PencilIcon,
    InformationCircleIcon
  } from '@heroicons/vue/24/outline'
  import { formatCurrency, formatNumber, formatDate, formatDateTime } from '@/utils/formatters'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    receipt: {
      type: Object,
      default: null
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'edit', 'print', 'close'])
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const totalAmount = computed(() => {
    if (!props.receipt?.items) return 0
    return props.receipt.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unit_price)
    }, 0)
  })
  
  function handleEdit() {
    emit('edit', props.receipt)
  }
  
  function handlePrint() {
    emit('print', props.receipt)
    // Or implement print directly
    window.print()
  }
  
  function handleClose() {
    emit('close')
  }
  </script>
  
  <style scoped>
  @media print {
    .modal-footer {
      display: none;
    }
  }
  </style>