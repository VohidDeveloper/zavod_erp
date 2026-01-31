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
        <!-- Customer Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Mijoz turi <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-4">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="form.type"
                type="radio"
                value="company"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Yuridik shaxs</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input
                v-model="form.type"
                type="radio"
                value="individual"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Jismoniy shaxs</span>
            </label>
          </div>
        </div>
  
        <!-- Company Info (if type is company) -->
        <div v-if="form.type === 'company'" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Kompaniya nomi <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.company_name"
                type="text"
                :required="form.type === 'company'"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.company_name }"
                placeholder="Kompaniya nomi"
              />
              <p v-if="errors.company_name" class="mt-1 text-sm text-red-600">{{ errors.company_name }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                INN <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.inn"
                type="text"
                :required="form.type === 'company'"
                maxlength="9"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.inn }"
                placeholder="123456789"
                @input="validateINN"
              />
              <p v-if="errors.inn" class="mt-1 text-sm text-red-600">{{ errors.inn }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                OKED
              </label>
              <input
                v-model="form.oked"
                type="text"
                maxlength="5"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12345"
              />
            </div>
          </div>
        </div>
  
        <!-- Individual Info (if type is individual) -->
        <div v-if="form.type === 'individual'" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ism <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.first_name"
                type="text"
                :required="form.type === 'individual'"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.first_name }"
                placeholder="Ism"
              />
              <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">{{ errors.first_name }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Familiya <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.last_name"
                type="text"
                :required="form.type === 'individual'"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.last_name }"
                placeholder="Familiya"
              />
              <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name }}</p>
            </div>
          </div>
        </div>
  
        <!-- Contact Info -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Aloqa ma'lumotlari</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Telefon <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.phone"
                type="tel"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.phone }"
                placeholder="+998 90 123-45-67"
                @input="formatPhoneNumber"
              />
              <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.email }"
                placeholder="email@example.com"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>
          </div>
        </div>
  
        <!-- Address -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Manzil</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Viloyat/Shahar
              </label>
              <select
                v-model="form.region"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tanlang</option>
                <option value="Toshkent">Toshkent</option>
                <option value="Samarqand">Samarqand</option>
                <option value="Buxoro">Buxoro</option>
                <option value="Andijon">Andijon</option>
                <option value="Farg'ona">Farg'ona</option>
                <option value="Namangan">Namangan</option>
                <option value="Qashqadaryo">Qashqadaryo</option>
                <option value="Surxondaryo">Surxondaryo</option>
                <option value="Xorazm">Xorazm</option>
                <option value="Navoiy">Navoiy</option>
                <option value="Jizzax">Jizzax</option>
                <option value="Sirdaryo">Sirdaryo</option>
                <option value="Qoraqalpog'iston">Qoraqalpog'iston</option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tuman
              </label>
              <input
                v-model="form.district"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Yakkasaroy"
              />
            </div>
  
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ko'cha va uy raqami
              </label>
              <input
                v-model="form.address"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Amir Temur ko'chasi, 1-uy"
              />
            </div>
          </div>
        </div>
  
        <!-- Additional Info -->
        <div>
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
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    customer: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'submit', 'close'])
  
  const loading = ref(false)
  const errors = ref({})
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const modalTitle = computed(() => {
    return props.customer ? 'Mijozni tahrirlash' : 'Yangi mijoz qo\'shish'
  })
  
  const form = ref({
    type: 'company',
    company_name: '',
    inn: '',
    oked: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    region: '',
    district: '',
    address: '',
    notes: ''
  })
  
  // Watch customer prop
  watch(() => props.customer, (customer) => {
    if (customer) {
      form.value = {
        type: customer.type || 'company',
        company_name: customer.company_name || '',
        inn: customer.inn || '',
        oked: customer.oked || '',
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        region: customer.region || '',
        district: customer.district || '',
        address: customer.address || '',
        notes: customer.notes || ''
      }
    } else {
      resetForm()
    }
    // Clear errors when customer changes
    errors.value = {}
  }, { immediate: true })
  
  // Validate form
  function validateForm() {
    errors.value = {}
    
    // Type-specific validation
    if (form.value.type === 'company') {
      if (!form.value.company_name || form.value.company_name.trim() === '') {
        errors.value.company_name = 'Kompaniya nomi majburiy'
      }
      if (!form.value.inn || form.value.inn.trim() === '') {
        errors.value.inn = 'INN majburiy'
      } else if (!/^\d{9}$/.test(form.value.inn)) {
        errors.value.inn = 'INN 9 ta raqamdan iborat bo\'lishi kerak'
      }
    } else {
      if (!form.value.first_name || form.value.first_name.trim() === '') {
        errors.value.first_name = 'Ism majburiy'
      }
      if (!form.value.last_name || form.value.last_name.trim() === '') {
        errors.value.last_name = 'Familiya majburiy'
      }
    }
    
    // Phone validation
    if (!form.value.phone || form.value.phone.trim() === '') {
      errors.value.phone = 'Telefon majburiy'
    } else if (!/^\+998\s?\d{2}\s?\d{3}-?\d{2}-?\d{2}$/.test(form.value.phone.replace(/\s/g, ''))) {
      errors.value.phone = 'Telefon raqami noto\'g\'ri formatda'
    }
    
    // Email validation (optional but must be valid if provided)
    if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      errors.value.email = 'Email noto\'g\'ri formatda'
    }
    
    return Object.keys(errors.value).length === 0
  }
  
  // Format phone number
  function formatPhoneNumber(event) {
    let value = event.target.value.replace(/\D/g, '')
    
    // Ensure starts with 998
    if (!value.startsWith('998')) {
      value = '998' + value
    }
    
    // Format: +998 XX XXX-XX-XX
    if (value.length > 3) {
      value = '+998 ' + value.substring(3)
    }
    if (value.length > 8) {
      value = value.substring(0, 8) + ' ' + value.substring(8)
    }
    if (value.length > 12) {
      value = value.substring(0, 12) + '-' + value.substring(12)
    }
    if (value.length > 15) {
      value = value.substring(0, 15) + '-' + value.substring(15, 17)
    }
    
    form.value.phone = value.substring(0, 19)
  }
  
  // Validate INN
  function validateINN() {
    if (form.value.inn && form.value.inn.length === 9) {
      if (!/^\d{9}$/.test(form.value.inn)) {
        errors.value.inn = 'INN faqat raqamlardan iborat bo\'lishi kerak'
      } else {
        delete errors.value.inn
      }
    }
  }
  
  // Handle submit
  async function handleSubmit() {
    if (!validateForm()) {
      return
    }
    
    loading.value = true
    
    try {
      // Prepare data for API
      const data = {
        type: form.value.type,
        phone: form.value.phone,
        email: form.value.email || null,
        region: form.value.region || null,
        district: form.value.district || null,
        address: form.value.address || null,
        notes: form.value.notes || null
      }
      
      if (form.value.type === 'company') {
        data.company_name = form.value.company_name
        data.inn = form.value.inn
        data.oked = form.value.oked || null
      } else {
        data.first_name = form.value.first_name
        data.last_name = form.value.last_name
      }
      
      emit('submit', data)
    } catch (error) {
      console.error('Form submit error:', error)
    } finally {
      loading.value = false
    }
  }
  
  // Handle close
  function handleClose() {
    emit('close')
    errors.value = {}
  }
  
  // Reset form
  function resetForm() {
    form.value = {
      type: 'company',
      company_name: '',
      inn: '',
      oked: '',
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      region: '',
      district: '',
      address: '',
      notes: ''
    }
    errors.value = {}
  }
  </script>