<template>
    <Modal
      v-model="isOpen"
      :title="`Tranzaksiya #${transaction?.id || ''}`"
      size="2xl"
      @close="handleClose"
    >
      <div v-if="transaction" class="space-y-6">
        <!-- Type & Amount -->
        <div class="bg-gradient-to-br rounded-lg p-6 border-2"
             :class="transaction.type === 'income' 
               ? 'from-green-50 to-emerald-50 border-green-200' 
               : 'from-red-50 to-rose-50 border-red-200'">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 rounded-lg"
                     :class="transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'">
                  <ArrowDownLeftIcon v-if="transaction.type === 'income'" 
                                     class="w-6 h-6 text-green-600" />
                  <ArrowUpRightIcon v-else 
                                    class="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p class="text-sm text-gray-600">Tranzaksiya turi</p>
                  <p class="text-lg font-semibold"
                     :class="transaction.type === 'income' ? 'text-green-700' : 'text-red-700'">
                    {{ transaction.type === 'income' ? 'Kirim' : 'Chiqim' }}
                  </p>
                </div>
              </div>
            </div>
            
            <div class="text-right">
              <p class="text-sm text-gray-600 mb-1">Summa</p>
              <p class="text-3xl font-bold"
                 :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'">
                {{ transaction.type === 'income' ? '+' : '-' }} {{ formatCurrency(transaction.amount) }}
              </p>
            </div>
          </div>
        </div>
  
        <!-- Main Info -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <CalendarIcon class="w-4 h-4 text-gray-500" />
              <p class="text-xs uppercase tracking-wide text-gray-500">Sana</p>
            </div>
            <p class="text-base font-medium text-gray-900">{{ formatDate(transaction.date) }}</p>
          </div>
  
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <TagIcon class="w-4 h-4 text-gray-500" />
              <p class="text-xs uppercase tracking-wide text-gray-500">Kategoriya</p>
            </div>
            <p class="text-base font-medium text-gray-900">{{ transaction.category?.name || '-' }}</p>
          </div>
  
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <CreditCardIcon class="w-4 h-4 text-gray-500" />
              <p class="text-xs uppercase tracking-wide text-gray-500">Hisob</p>
            </div>
            <p class="text-base font-medium text-gray-900">{{ transaction.account?.name || '-' }}</p>
          </div>
        </div>
  
        <!-- Payment Method & Reference -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <BanknotesIcon class="w-4 h-4 text-gray-500" />
              <p class="text-xs uppercase tracking-wide text-gray-500">To'lov usuli</p>
            </div>
            <p class="text-base font-medium text-gray-900">{{ getPaymentMethodLabel(transaction.payment_method) }}</p>
          </div>
  
          <div v-if="transaction.reference_number" class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <DocumentTextIcon class="w-4 h-4 text-gray-500" />
              <p class="text-xs uppercase tracking-wide text-gray-500">Hujjat raqami</p>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-base font-medium text-gray-900">{{ transaction.reference_number }}</p>
              <button
                @click="copyToClipboard(transaction.reference_number)"
                class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                title="Nusxa olish"
              >
                <ClipboardDocumentIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
  
        <!-- Counterparty -->
        <div v-if="transaction.counterparty">
          <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <UserIcon class="w-4 h-4 mr-2 text-gray-500" />
            Kontragent
          </h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-base text-gray-900">{{ transaction.counterparty }}</p>
          </div>
        </div>
  
        <!-- Description -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <ChatBubbleBottomCenterTextIcon class="w-4 h-4 mr-2 text-gray-500" />
            Izoh
          </h3>
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-base text-gray-900">{{ transaction.description }}</p>
          </div>
        </div>
  
        <!-- Tags -->
        <div v-if="transaction.tags && transaction.tags.length > 0">
          <h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <TagIcon class="w-4 h-4 mr-2 text-gray-500" />
            Teglar
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in transaction.tags"
              :key="tag"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {{ tag }}
            </span>
          </div>
        </div>
  
        <!-- Status -->
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-2">Holat</h3>
          <StatusBadge :status="transaction.status || 'completed'" />
        </div>
  
        <!-- Timestamps -->
        <div class="border-t pt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="flex items-start">
              <CalendarIcon class="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p class="text-gray-600">Yaratilgan</p>
                <p class="font-medium text-gray-900">{{ formatDateTime(transaction.created_at) }}</p>
                <p v-if="transaction.created_by" class="text-xs text-gray-500 mt-1">
                  {{ transaction.created_by.name }}
                </p>
              </div>
            </div>
            
            <div v-if="transaction.updated_at" class="flex items-start">
              <ClockIcon class="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p class="text-gray-600">Yangilangan</p>
                <p class="font-medium text-gray-900">{{ formatDateTime(transaction.updated_at) }}</p>
                <p v-if="transaction.updated_by" class="text-xs text-gray-500 mt-1">
                  {{ transaction.updated_by.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Loading State -->
      <div v-else class="flex flex-col items-center justify-center py-16">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="h-8 w-8 bg-white rounded-full"></div>
          </div>
        </div>
        <p class="mt-4 text-gray-600 font-medium">Yuklanmoqda...</p>
      </div>
  
      <!-- Footer Actions -->
      <template #footer>
        <div class="flex items-center justify-between">
          <div class="flex gap-2">
            <button
              v-if="canEdit"
              type="button"
              @click="handleEdit"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <PencilIcon class="w-4 h-4 mr-2" />
              Tahrirlash
            </button>
            
            <button
              type="button"
              @click="handlePrint"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <PrinterIcon class="w-4 h-4 mr-2" />
              Chop etish
            </button>
            
            <button
              v-if="canDelete"
              type="button"
              @click="handleDelete"
              class="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transition-colors"
            >
              <TrashIcon class="w-4 h-4 mr-2" />
              O'chirish
            </button>
          </div>
          
          <button
            type="button"
            @click="handleClose"
            class="px-6 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Yopish
          </button>
        </div>
      </template>
    </Modal>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { Modal, StatusBadge } from '@/components/common'
  import {
    ArrowDownLeftIcon,
    ArrowUpRightIcon,
    CalendarIcon,
    TagIcon,
    CreditCardIcon,
    BanknotesIcon,
    DocumentTextIcon,
    UserIcon,
    ChatBubbleBottomCenterTextIcon,
    ClockIcon,
    PencilIcon,
    PrinterIcon,
    TrashIcon,
    ClipboardDocumentIcon
  } from '@heroicons/vue/24/outline'
  import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters'
  import { useNotifications } from '@/composables/useNotifications'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    transaction: {
      type: Object,
      default: null
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    canDelete: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'edit', 'delete', 'print', 'close'])
  
  const notifications = useNotifications()
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  function getPaymentMethodLabel(method) {
    const labels = {
      cash: 'Naqd',
      card: 'Plastik karta',
      transfer: 'Bank o\'tkazmasi',
      check: 'Chek'
    }
    return labels[method] || method
  }
  
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
      notifications.success('Nusxa olindi', 'Muvaffaqiyat')
    } catch (error) {
      notifications.error('Nusxa olishda xatolik', 'Xatolik')
    }
  }
  
  function handleEdit() {
    emit('edit', props.transaction)
  }
  
  function handlePrint() {
    emit('print', props.transaction)
    window.print()
  }
  
  function handleDelete() {
    emit('delete', props.transaction)
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