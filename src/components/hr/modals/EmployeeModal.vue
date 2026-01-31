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
        <!-- Personal Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserIcon class="w-5 h-5 mr-2 text-gray-500" />
            Shaxsiy ma'lumotlar
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ism <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.first_name"
                type="text"
                required
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
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.last_name }"
                placeholder="Familiya"
              />
              <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Otasining ismi
              </label>
              <input
                v-model="form.middle_name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Otasining ismi"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tug'ilgan sana <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.birth_date"
                type="date"
                required
                :max="maxBirthDate"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.birth_date }"
              />
              <p v-if="errors.birth_date" class="mt-1 text-sm text-red-600">{{ errors.birth_date }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Jinsi <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.gender"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.gender }"
              >
                <option value="">Tanlang</option>
                <option value="male">Erkak</option>
                <option value="female">Ayol</option>
              </select>
              <p v-if="errors.gender" class="mt-1 text-sm text-red-600">{{ errors.gender }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Pasport seriya va raqami <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.passport"
                type="text"
                required
                maxlength="9"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                :class="{ 'border-red-500': errors.passport }"
                placeholder="AA1234567"
              />
              <p v-if="errors.passport" class="mt-1 text-sm text-red-600">{{ errors.passport }}</p>
            </div>
          </div>
        </div>
  
        <!-- Contact Information -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PhoneIcon class="w-5 h-5 mr-2 text-gray-500" />
            Aloqa ma'lumotlari
          </h3>
          
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
  
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Manzil
              </label>
              <input
                v-model="form.address"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="To'liq manzil"
              />
            </div>
          </div>
        </div>
  
        <!-- Employment Information -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BriefcaseIcon class="w-5 h-5 mr-2 text-gray-500" />
            Ish ma'lumotlari
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Xodim ID <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.employee_id"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.employee_id }"
                placeholder="EMP-001"
              />
              <p v-if="errors.employee_id" class="mt-1 text-sm text-red-600">{{ errors.employee_id }}</p>
            </div>
  
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
                <option value="1">Ishlab chiqarish</option>
                <option value="2">Ombor</option>
                <option value="3">Sotish</option>
                <option value="4">Moliya</option>
                <option value="5">Boshqaruv</option>
                <option value="6">Texnik xizmat</option>
              </select>
              <p v-if="errors.department_id" class="mt-1 text-sm text-red-600">{{ errors.department_id }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Lavozim <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.position"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.position }"
                placeholder="Lavozim"
              />
              <p v-if="errors.position" class="mt-1 text-sm text-red-600">{{ errors.position }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ishga kirgan sana <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.hire_date"
                type="date"
                required
                :max="today"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.hire_date }"
              />
              <p v-if="errors.hire_date" class="mt-1 text-sm text-red-600">{{ errors.hire_date }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ish turi <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.employment_type"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="full_time">To'liq stavka</option>
                <option value="part_time">Yarim stavka</option>
                <option value="contract">Shartnoma</option>
                <option value="temporary">Vaqtinchalik</option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Holat <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.status"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Faol</option>
                <option value="on_leave">Ta'tilda</option>
                <option value="terminated">Ishdan bo'shatilgan</option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Oylik maosh <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model.number="form.salary"
                  type="number"
                  step="100000"
                  min="0"
                  required
                  class="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'border-red-500': errors.salary }"
                  placeholder="0"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                  so'm
                </span>
              </div>
              <p v-if="errors.salary" class="mt-1 text-sm text-red-600">{{ errors.salary }}</p>
              <p v-if="form.salary > 0" class="mt-1 text-xs text-gray-500">
                {{ formatCurrency(form.salary) }}
              </p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                To'lov turi
              </label>
              <select
                v-model="form.payment_type"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="monthly">Oylik</option>
                <option value="hourly">Soatlik</option>
                <option value="daily">Kunlik</option>
              </select>
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
  import { UserIcon, PhoneIcon, BriefcaseIcon } from '@heroicons/vue/24/outline'
  import { formatCurrency } from '@/utils/formatters'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    employee: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'submit', 'close'])
  
  const loading = ref(false)
  const errors = ref({})
  
  const today = new Date().toISOString().split('T')[0]
  const maxBirthDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const modalTitle = computed(() => {
    return props.employee ? 'Xodimni tahrirlash' : 'Yangi xodim qo\'shish'
  })
  
  const form = ref({
    first_name: '',
    last_name: '',
    middle_name: '',
    birth_date: '',
    gender: '',
    passport: '',
    phone: '',
    email: '',
    address: '',
    employee_id: '',
    department_id: '',
    position: '',
    hire_date: today,
    employment_type: 'full_time',
    status: 'active',
    salary: 0,
    payment_type: 'monthly',
    notes: ''
  })
  
  watch(() => props.employee, (employee) => {
    if (employee) {
      form.value = {
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        middle_name: employee.middle_name || '',
        birth_date: employee.birth_date || '',
        gender: employee.gender || '',
        passport: employee.passport || '',
        phone: employee.phone || '',
        email: employee.email || '',
        address: employee.address || '',
        employee_id: employee.employee_id || '',
        department_id: employee.department_id || '',
        position: employee.position || '',
        hire_date: employee.hire_date || today,
        employment_type: employee.employment_type || 'full_time',
        status: employee.status || 'active',
        salary: employee.salary || 0,
        payment_type: employee.payment_type || 'monthly',
        notes: employee.notes || ''
      }
    } else {
      resetForm()
    }
    errors.value = {}
  }, { immediate: true })
  
  function formatPhoneNumber(event) {
    let value = event.target.value.replace(/\D/g, '')
    
    if (!value.startsWith('998')) {
      value = '998' + value
    }
    
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
  
  function validateForm() {
    errors.value = {}
    
    if (!form.value.first_name || form.value.first_name.trim() === '') {
      errors.value.first_name = 'Ism majburiy'
    }
    
    if (!form.value.last_name || form.value.last_name.trim() === '') {
      errors.value.last_name = 'Familiya majburiy'
    }
    
    if (!form.value.birth_date) {
      errors.value.birth_date = 'Tug\'ilgan sana majburiy'
    }
    
    if (!form.value.gender) {
      errors.value.gender = 'Jinsi majburiy'
    }
    
    if (!form.value.passport || form.value.passport.trim() === '') {
      errors.value.passport = 'Pasport majburiy'
    } else if (!/^[A-Z]{2}\d{7}$/.test(form.value.passport.toUpperCase())) {
      errors.value.passport = 'Pasport formati noto\'g\'ri (masalan: AA1234567)'
    }
    
    if (!form.value.phone || form.value.phone.trim() === '') {
      errors.value.phone = 'Telefon majburiy'
    }
    
    if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      errors.value.email = 'Email noto\'g\'ri formatda'
    }
    
    if (!form.value.employee_id || form.value.employee_id.trim() === '') {
      errors.value.employee_id = 'Xodim ID majburiy'
    }
    
    if (!form.value.department_id) {
      errors.value.department_id = 'Bo\'lim majburiy'
    }
    
    if (!form.value.position || form.value.position.trim() === '') {
      errors.value.position = 'Lavozim majburiy'
    }
    
    if (!form.value.hire_date) {
      errors.value.hire_date = 'Ishga kirgan sana majburiy'
    }
    
    if (!form.value.salary || form.value.salary <= 0) {
      errors.value.salary = 'Maosh majburiy va 0 dan katta bo\'lishi kerak'
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
      first_name: '',
      last_name: '',
      middle_name: '',
      birth_date: '',
      gender: '',
      passport: '',
      phone: '',
      email: '',
      address: '',
      employee_id: '',
      department_id: '',
      position: '',
      hire_date: today,
      employment_type: 'full_time',
      status: 'active',
      salary: 0,
      payment_type: 'monthly',
      notes: ''
    }
    errors.value = {}
  }
  </script>