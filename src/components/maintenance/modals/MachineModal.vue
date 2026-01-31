<template>
    <FormModal
      v-model="isOpen"
      :title="modalTitle"
      :loading="loading"
      size="2xl"
      submit-text="Saqlash"
      @submit="handleSubmit"
      @close="handleClose"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Machine Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CogIcon class="w-5 h-5 mr-2 text-gray-500" />
            Uskunа ma'lumotlari
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Uskuna nomi <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.name }"
                placeholder="Ekstruziya mashinasi #1"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Uskuna kodi <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.machine_code"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                :class="{ 'border-red-500': errors.machine_code }"
                placeholder="MACH-001"
              />
              <p v-if="errors.machine_code" class="mt-1 text-sm text-red-600">{{ errors.machine_code }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Turi <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.type"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.type }"
              >
                <option value="">Tanlang</option>
                <option value="extrusion">Ekstruziya mashinasi</option>
                <option value="printing">Chop etish mashinasi</option>
                <option value="cutting">Kesish mashinasi</option>
                <option value="sealing">Yopish mashinasi</option>
                <option value="packaging">Qadoqlash mashinasi</option>
                <option value="auxiliary">Yordamchi uskuna</option>
              </select>
              <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ishlab chiqaruvchi
              </label>
              <input
                v-model="form.manufacturer"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ishlab chiqaruvchi nomi"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <input
                v-model="form.model"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Model raqami"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Seriya raqami
              </label>
              <input
                v-model="form.serial_number"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SN123456"
              />
            </div>
          </div>
        </div>
  
        <!-- Installation & Purchase -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CalendarIcon class="w-5 h-5 mr-2 text-gray-500" />
            O'rnatish va xarid ma'lumotlari
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Xarid qilingan sana
              </label>
              <input
                v-model="form.purchase_date"
                type="date"
                :max="today"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                O'rnatilgan sana <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.installation_date"
                type="date"
                required
                :max="today"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.installation_date }"
              />
              <p v-if="errors.installation_date" class="mt-1 text-sm text-red-600">{{ errors.installation_date }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Xarid narxi
              </label>
              <div class="relative">
                <input
                  v-model.number="form.purchase_cost"
                  type="number"
                  step="1000000"
                  min="0"
                  class="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                  so'm
                </span>
              </div>
              <p v-if="form.purchase_cost > 0" class="mt-1 text-xs text-gray-500">
                {{ formatCurrency(form.purchase_cost) }}
              </p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Kafolat muddati (oy)
              </label>
              <input
                v-model.number="form.warranty_months"
                type="number"
                min="0"
                max="120"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12"
              />
            </div>
          </div>
        </div>
  
        <!-- Location & Department -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPinIcon class="w-5 h-5 mr-2 text-gray-500" />
            Joylashuv
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Bo'lim <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.department_id"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.department_id }"
              >
                <option value="">Tanlang</option>
                <option value="1">Ishlab chiqarish bo'limi</option>
                <option value="2">Chop etish bo'limi</option>
                <option value="3">Qadoqlash bo'limi</option>
                <option value="4">Ombor</option>
              </select>
              <p v-if="errors.department_id" class="mt-1 text-sm text-red-600">{{ errors.department_id }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Aniq joylashuv
              </label>
              <input
                v-model="form.location"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ishlab chiqarish xonasi, Liniya A"
              />
            </div>
          </div>
        </div>
  
        <!-- Specifications -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DocumentTextIcon class="w-5 h-5 mr-2 text-gray-500" />
            Texnik xususiyatlar
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Quvvat (kW)
              </label>
              <input
                v-model.number="form.power_rating"
                type="number"
                step="0.1"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ishlab chiqarish quvvati (kg/soat)
              </label>
              <input
                v-model.number="form.capacity"
                type="number"
                step="1"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
  
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Texnik tavsif
              </label>
              <textarea
                v-model="form.specifications"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Texnik xususiyatlar..."
              ></textarea>
            </div>
          </div>
        </div>
  
        <!-- Status & Maintenance -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <WrenchScrewdriverIcon class="w-5 h-5 mr-2 text-gray-500" />
            Holat va ta'mirlash
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Holat <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.status"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="operational">Ishlamoqda</option>
                <option value="maintenance">Ta'mirda</option>
                <option value="idle">Turibdi</option>
                <option value="broken">Buzilgan</option>
                <option value="retired">Foydalanishdan chiqarilgan</option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Keyingi texnik ko'rik sanasi
              </label>
              <input
                v-model="form.next_maintenance_date"
                type="date"
                :min="today"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Texnik ko'rik davri (kunlar)
              </label>
              <input
                v-model.number="form.maintenance_interval"
                type="number"
                min="1"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="90"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mas'ul xodim
              </label>
              <input
                v-model="form.responsible_person"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Xodim ismi"
              />
            </div>
          </div>
        </div>
  
        <!-- Notes -->
        <div class="border-t pt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Izoh
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Qo'shimcha ma'lumot..."
          ></textarea>
        </div>
  
        <!-- Error Summary -->
        <div v-if="Object.keys(errors).length > 0" class="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">Iltimos, barcha majburiy maydonlarni to'ldiring</p>
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { FormModal } from '@/components/common'
  import { 
    CogIcon, 
    CalendarIcon, 
    MapPinIcon, 
    DocumentTextIcon, 
    WrenchScrewdriverIcon 
  } from '@heroicons/vue/24/outline'
  import { formatCurrency } from '@/utils/formatters'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    machine: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'submit', 'close'])
  
  const loading = ref(false)
  const errors = ref({})
  
  const today = new Date().toISOString().split('T')[0]
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const modalTitle = computed(() => {
    return props.machine ? 'Uskunani tahrirlash' : 'Yangi uskuna qo\'shish'
  })
  
  const form = ref({
    name: '',
    machine_code: '',
    type: '',
    manufacturer: '',
    model: '',
    serial_number: '',
    purchase_date: '',
    installation_date: today,
    purchase_cost: 0,
    warranty_months: 0,
    department_id: '',
    location: '',
    power_rating: 0,
    capacity: 0,
    specifications: '',
    status: 'operational',
    next_maintenance_date: '',
    maintenance_interval: 90,
    responsible_person: '',
    notes: ''
  })
  
  watch(() => props.machine, (machine) => {
    if (machine) {
      form.value = {
        name: machine.name || '',
        machine_code: machine.machine_code || '',
        type: machine.type || '',
        manufacturer: machine.manufacturer || '',
        model: machine.model || '',
        serial_number: machine.serial_number || '',
        purchase_date: machine.purchase_date || '',
        installation_date: machine.installation_date || today,
        purchase_cost: machine.purchase_cost || 0,
        warranty_months: machine.warranty_months || 0,
        department_id: machine.department_id || '',
        location: machine.location || '',
        power_rating: machine.power_rating || 0,
        capacity: machine.capacity || 0,
        specifications: machine.specifications || '',
        status: machine.status || 'operational',
        next_maintenance_date: machine.next_maintenance_date || '',
        maintenance_interval: machine.maintenance_interval || 90,
        responsible_person: machine.responsible_person || '',
        notes: machine.notes || ''
      }
    } else {
      resetForm()
    }
    errors.value = {}
  }, { immediate: true })
  
  function validateForm() {
    errors.value = {}
    
    if (!form.value.name || form.value.name.trim() === '') {
      errors.value.name = 'Uskuna nomi majburiy'
    }
    
    if (!form.value.machine_code || form.value.machine_code.trim() === '') {
      errors.value.machine_code = 'Uskuna kodi majburiy'
    }
    
    if (!form.value.type) {
      errors.value.type = 'Uskuna turi majburiy'
    }
    
    if (!form.value.installation_date) {
      errors.value.installation_date = 'O\'rnatilgan sana majburiy'
    }
    
    if (!form.value.department_id) {
      errors.value.department_id = 'Bo\'lim majburiy'
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
      name: '',
      machine_code: '',
      type: '',
      manufacturer: '',
      model: '',
      serial_number: '',
      purchase_date: '',
      installation_date: today,
      purchase_cost: 0,
      warranty_months: 0,
      department_id: '',
      location: '',
      power_rating: 0,
      capacity: 0,
      specifications: '',
      status: 'operational',
      next_maintenance_date: '',
      maintenance_interval: 90,
      responsible_person: '',
      notes: ''
    }
    errors.value = {}
  }
  </script>