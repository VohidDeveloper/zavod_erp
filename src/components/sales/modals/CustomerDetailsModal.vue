<template>
    <Modal
      v-model="isOpen"
      :title="customerTitle"
      size="2xl"
      @close="handleClose"
    >
      <div v-if="customer" class="space-y-6">
        <!-- Customer Type Badge -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-blue-100 rounded-lg">
              <UserIcon v-if="customer.type === 'individual'" class="w-6 h-6 text-blue-600" />
              <BuildingOfficeIcon v-else class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-gray-600">Mijoz turi</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ customer.type === 'company' ? 'Yuridik shaxs' : 'Jismoniy shaxs' }}
              </p>
            </div>
          </div>
          
          <StatusBadge :status="customer.status || 'active'" />
        </div>
  
        <!-- Main Info -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Company Info -->
            <div v-if="customer.type === 'company'">
              <div class="space-y-3">
                <div>
                  <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">Kompaniya nomi</p>
                  <p class="text-lg font-semibold text-gray-900">{{ customer.company_name }}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">INN</p>
                    <p class="text-sm font-medium text-gray-800">{{ formatTIN(customer.inn) }}</p>
                  </div>
                  
                  <div v-if="customer.oked">
                    <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">OKED</p>
                    <p class="text-sm font-medium text-gray-800">{{ customer.oked }}</p>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Individual Info -->
            <div v-else>
              <div class="space-y-3">
                <div>
                  <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">F.I.O</p>
                  <p class="text-lg font-semibold text-gray-900">
                    {{ customer.first_name }} {{ customer.last_name }}
                  </p>
                </div>
              </div>
            </div>
  
            <!-- Customer ID -->
            <div class="flex items-end">
              <div>
                <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">Mijoz ID</p>
                <p class="text-sm font-mono font-medium text-gray-700">#{{ String(customer.id).padStart(6, '0') }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PhoneIcon class="w-5 h-5 mr-2 text-gray-500" />
            Aloqa ma'lumotlari
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">Telefon</p>
                  <a
                    :href="`tel:${customer.phone}`"
                    class="text-base font-medium text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    {{ formatPhone(customer.phone) }}
                    <ArrowTopRightOnSquareIcon class="w-4 h-4 ml-1" />
                  </a>
                </div>
                <button
                  @click="copyToClipboard(customer.phone)"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Nusxa olish"
                >
                  <ClipboardDocumentIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div v-if="customer.email" class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="text-xs uppercase tracking-wide text-gray-500 mb-1">Email</p>
                  <a
                    :href="`mailto:${customer.email}`"
                    class="text-base font-medium text-blue-600 hover:text-blue-700 flex items-center break-all"
                  >
                    {{ customer.email }}
                    <ArrowTopRightOnSquareIcon class="w-4 h-4 ml-1 flex-shrink-0" />
                  </a>
                </div>
                <button
                  @click="copyToClipboard(customer.email)"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Nusxa olish"
                >
                  <ClipboardDocumentIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Address -->
        <div v-if="hasAddress">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPinIcon class="w-5 h-5 mr-2 text-gray-500" />
            Manzil
          </h3>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-start">
              <div class="flex-1">
                <p class="text-base text-gray-900">{{ formatAddress(customer) }}</p>
              </div>
              <button
                @click="copyToClipboard(formatAddress(customer))"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                title="Nusxa olish"
              >
                <ClipboardDocumentIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
  
        <!-- Statistics -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon class="w-5 h-5 mr-2 text-gray-500" />
            Statistika
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-blue-700">Jami buyurtmalar</p>
                <ShoppingCartIcon class="w-5 h-5 text-blue-600" />
              </div>
              <p class="text-3xl font-bold text-blue-900">{{ customer.total_orders || 0 }}</p>
              <p class="text-xs text-blue-600 mt-1">ta buyurtma</p>
            </div>
            
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-green-700">Jami summa</p>
                <BanknotesIcon class="w-5 h-5 text-green-600" />
              </div>
              <p class="text-2xl font-bold text-green-900">{{ formatCurrency(customer.total_amount || 0) }}</p>
              <p class="text-xs text-green-600 mt-1">umumiy savdo</p>
            </div>
            
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-purple-700">Qarz</p>
                <CreditCardIcon class="w-5 h-5 text-purple-600" />
              </div>
              <p class="text-2xl font-bold text-purple-900">{{ formatCurrency(customer.debt || 0) }}</p>
              <p class="text-xs text-purple-600 mt-1">to'lanmagan summa</p>
            </div>
          </div>
        </div>
  
        <!-- Notes -->
        <div v-if="customer.notes">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon class="w-5 h-5 mr-2 text-gray-500" />
            Izoh
          </h3>
          
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p class="text-sm text-yellow-800">{{ customer.notes }}</p>
          </div>
        </div>
  
        <!-- Timestamps -->
        <div class="border-t pt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="flex items-start">
              <CalendarIcon class="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p class="text-gray-600">Yaratilgan</p>
                <p class="font-medium text-gray-900">{{ formatDateTime(customer.created_at) }}</p>
                <p v-if="customer.created_by" class="text-xs text-gray-500 mt-1">
                  {{ customer.created_by.name }}
                </p>
              </div>
            </div>
            
            <div v-if="customer.updated_at" class="flex items-start">
              <ClockIcon class="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p class="text-gray-600">Yangilangan</p>
                <p class="font-medium text-gray-900">{{ formatDateTime(customer.updated_at) }}</p>
                <p v-if="customer.updated_by" class="text-xs text-gray-500 mt-1">
                  {{ customer.updated_by.name }}
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
    PencilIcon,
    TrashIcon,
    UserIcon,
    BuildingOfficeIcon,
    PhoneIcon,
    MapPinIcon,
    ChartBarIcon,
    DocumentTextIcon,
    CalendarIcon,
    ClockIcon,
    ShoppingCartIcon,
    BanknotesIcon,
    CreditCardIcon,
    ArrowTopRightOnSquareIcon,
    ClipboardDocumentIcon
  } from '@heroicons/vue/24/outline'
  import { formatCurrency, formatPhone, formatDateTime, formatTIN } from '@/utils/formatters'
  import { useNotifications } from '@/composables/useNotifications'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    customer: {
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
  
  const emit = defineEmits(['update:modelValue', 'edit', 'delete', 'close'])
  
  const notifications = useNotifications()
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const customerTitle = computed(() => {
    if (!props.customer) return 'Mijoz'
    
    if (props.customer.type === 'company') {
      return props.customer.company_name
    } else {
      return `${props.customer.first_name} ${props.customer.last_name}`
    }
  })
  
  const hasAddress = computed(() => {
    return props.customer && (
      props.customer.region ||
      props.customer.district ||
      props.customer.address
    )
  })
  
  function formatAddress(customer) {
    if (!customer) return '-'
    
    const parts = []
    if (customer.region) parts.push(customer.region)
    if (customer.district) parts.push(customer.district)
    if (customer.address) parts.push(customer.address)
    
    return parts.length > 0 ? parts.join(', ') : '-'
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
    emit('edit', props.customer)
  }
  
  function handleDelete() {
    emit('delete', props.customer)
  }
  
  function handleClose() {
    emit('close')
  }
  </script>