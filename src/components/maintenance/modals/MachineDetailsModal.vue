<template>
    <Modal
      v-model="isOpen"
      :title="machine?.name || 'Uskuna'"
      size="2xl"
      @close="handleClose"
    >
      <div v-if="machine" class="space-y-6">
        <!-- Machine Type & Status -->
        <div class="bg-gradient-to-br rounded-lg p-6 border-2"
             :class="getStatusColor(machine.status)">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 rounded-lg bg-white">
                  <CogIcon class="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p class="text-sm text-gray-600">Uskuna turi</p>
                  <p class="text-lg font-semibold text-gray-900">
                    {{ getMachineTypeLabel(machine.type) }}
                  </p>
                </div>
              </div>
              <p class="text-sm text-gray-600">Kod: <span class="font-mono font-medium text-gray-900">{{ machine.machine_code }}</span></p>
            </div>
            
            <div class="text-right">
              <StatusBadge :status="machine.status" />
            </div>
          </div>
        </div>
  
        <!-- Main Info -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <BuildingOfficeIcon class="w-4 h-4 text-gray-500" />
              <p class="text-xs uppercase tracking-wide text-gray-500">Ishlab chiqaruvchi</p>
            </div>
            <p class="text-base font-medium text-gray-900">{{ machine.manufacturer || '-' }}</p>
          </div>
  
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <CubeIcon class="w-4 h-4 text-gray-500" />
              <p class="text-xs uppercase tracking-wide text-gray-500">Model</p>
            </div>
            <p class="text-base font-medium text-gray-900">{{ machine.model || '-' }}</p>
          </div>
  
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <HashtagIcon class="w-4 h-4 text-gray-500" />
              <p class="text-xs uppercase tracking-wide text-gray-500">Seriya raqami</p>
            </div>
            <p class="text-base font-medium text-gray-900">{{ machine.serial_number || '-' }}</p>
          </div>
        </div>
  
        <!-- Installation & Purchase -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CalendarIcon class="w-5 h-5 mr-2 text-gray-500" />
            Xarid va o'rnatish
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600 mb-1">Xarid qilingan sana</p>
              <p class="text-base font-medium text-gray-900">{{ formatDate(machine.purchase_date) || '-' }}</p>
            </div>
  
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600 mb-1">O'rnatilgan sana</p>
              <p class="text-base font-medium text-gray-900">{{ formatDate(machine.installation_date) }}</p>
            </div>
  
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600 mb-1">Xarid narxi</p>
              <p class="text-base font-medium text-gray-900">
                {{ machine.purchase_cost ? formatCurrency(machine.purchase_cost) : '-' }}
              </p>
            </div>
  
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600 mb-1">Kafolat muddati</p>
              <p class="text-base font-medium text-gray-900">
                {{ machine.warranty_months ? `${machine.warranty_months} oy` : '-' }}
              </p>
            </div>
          </div>
        </div>
  
        <!-- Location -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPinIcon class="w-5 h-5 mr-2 text-gray-500" />
            Joylashuv
          </h3>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600 mb-1">Bo'lim</p>
                <p class="text-base font-medium text-gray-900">{{ machine.department?.name || '-' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-1">Aniq joylashuv</p>
                <p class="text-base font-medium text-gray-900">{{ machine.location || '-' }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Technical Specifications -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon class="w-5 h-5 mr-2 text-gray-500" />
            Texnik xususiyatlar
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-blue-700">Quvvat</p>
                <BoltIcon class="w-5 h-5 text-blue-600" />
              </div>
              <p class="text-2xl font-bold text-blue-900">
                {{ machine.power_rating ? `${machine.power_rating} kW` : '-' }}
              </p>
            </div>
  
            <div class="bg-green-50 rounded-lg p-4 border border-green-200">
              <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-medium text-green-700">Ishlab chiqarish quvvati</p>
                <ChartBarIcon class="w-5 h-5 text-green-600" />
              </div>
              <p class="text-2xl font-bold text-green-900">
                {{ machine.capacity ? `${machine.capacity} kg/soat` : '-' }}
              </p>
            </div>
          </div>
  
          <div v-if="machine.specifications" class="mt-4 bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-600 mb-2">Qo'shimcha ma'lumot</p>
            <p class="text-base text-gray-900">{{ machine.specifications }}</p>
          </div>
        </div>
  
        <!-- Maintenance Info -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <WrenchScrewdriverIcon class="w-5 h-5 mr-2 text-gray-500" />
            Ta'mirlash ma'lumotlari
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p class="text-sm text-purple-700 mb-1">Keyingi texnik ko'rik</p>
              <p class="text-base font-bold text-purple-900">
                {{ formatDate(machine.next_maintenance_date) || 'Rejalanmagan' }}
              </p>
            </div>
  
            <div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <p class="text-sm text-orange-700 mb-1">Texnik ko'rik davri</p>
              <p class="text-base font-bold text-orange-900">
                {{ machine.maintenance_interval ? `${machine.maintenance_interval} kun` : '-' }}
              </p>
            </div>
  
            <div v-if="machine.responsible_person" class="md:col-span-2 bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600 mb-1">Mas'ul xodim</p>
              <p class="text-base font-medium text-gray-900">{{ machine.responsible_person }}</p>
            </div>
          </div>
        </div>
  
        <!-- Notes -->
        <div v-if="machine.notes">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChatBubbleBottomCenterTextIcon class="w-5 h-5 mr-2 text-gray-500" />
            Izoh
          </h3>
          
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p class="text-sm text-yellow-800">{{ machine.notes }}</p>
          </div>
        </div>
  
        <!-- Timestamps -->
        <div class="border-t pt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div class="flex items-start">
              <CalendarIcon class="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p class="text-gray-600">Yaratilgan</p>
                <p class="font-medium text-gray-900">{{ formatDateTime(machine.created_at) }}</p>
                <p v-if="machine.created_by" class="text-xs text-gray-500 mt-1">
                  {{ machine.created_by.name }}
                </p>
              </div>
            </div>
            
            <div v-if="machine.updated_at" class="flex items-start">
              <ClockIcon class="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p class="text-gray-600">Yangilangan</p>
                <p class="font-medium text-gray-900">{{ formatDateTime(machine.updated_at) }}</p>
                <p v-if="machine.updated_by" class="text-xs text-gray-500 mt-1">
                  {{ machine.updated_by.name }}
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
    CogIcon,
    BuildingOfficeIcon,
    CubeIcon,
    HashtagIcon,
    CalendarIcon,
    MapPinIcon,
    DocumentTextIcon,
    WrenchScrewdriverIcon,
    ChatBubbleBottomCenterTextIcon,
    ClockIcon,
    PencilIcon,
    TrashIcon,
    BoltIcon,
    ChartBarIcon
  } from '@heroicons/vue/24/outline'
  import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    machine: {
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
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  function getMachineTypeLabel(type) {
    const labels = {
      extrusion: 'Ekstruziya mashinasi',
      printing: 'Chop etish mashinasi',
      cutting: 'Kesish mashinasi',
      sealing: 'Yopish mashinasi',
      packaging: 'Qadoqlash mashinasi',
      auxiliary: 'Yordamchi uskuna'
    }
    return labels[type] || type
  }
  
  function getStatusColor(status) {
    const colors = {
      operational: 'from-green-50 to-emerald-50 border-green-200',
      maintenance: 'from-yellow-50 to-amber-50 border-yellow-200',
      idle: 'from-gray-50 to-slate-50 border-gray-200',
      broken: 'from-red-50 to-rose-50 border-red-200',
      retired: 'from-purple-50 to-violet-50 border-purple-200'
    }
    return colors[status] || colors.idle
  }
  
  function handleEdit() {
    emit('edit', props.machine)
  }
  
  function handleDelete() {
    emit('delete', props.machine)
  }
  
  function handleClose() {
    emit('close')
  }
  </script>