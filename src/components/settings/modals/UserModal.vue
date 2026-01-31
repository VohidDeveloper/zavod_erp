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
        <!-- User Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserIcon class="w-5 h-5 mr-2 text-gray-500" />
            Foydalanuvchi ma'lumotlari
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Foydalanuvchi nomi <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.username"
                type="text"
                required
                :disabled="isEditMode"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                :class="{ 'border-red-500': errors.username }"
                placeholder="username"
              />
              <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
              <p v-if="isEditMode" class="mt-1 text-xs text-gray-500">Foydalanuvchi nomini o'zgartirib bo'lmaydi</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.email }"
                placeholder="user@example.com"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>
  
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
                Telefon
              </label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+998 90 123-45-67"
                @input="formatPhoneNumber"
              />
            </div>
          </div>
        </div>
  
        <!-- Password (only for new users or when changing) -->
        <div v-if="!isEditMode || showPasswordFields" class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <KeyIcon class="w-5 h-5 mr-2 text-gray-500" />
            Parol
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Parol <span v-if="!isEditMode" class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  :required="!isEditMode"
                  class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :class="{ 'border-red-500': errors.password }"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Parolni tasdiqlash <span v-if="!isEditMode" class="text-red-500">*</span>
              </label>
              <input
                v-model="form.password_confirmation"
                :type="showPassword ? 'text' : 'password'"
                :required="!isEditMode"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.password_confirmation }"
                placeholder="••••••••"
              />
              <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">{{ errors.password_confirmation }}</p>
            </div>
          </div>
  
          <div v-if="isEditMode && !showPasswordFields" class="mt-4">
            <button
              type="button"
              @click="showPasswordFields = true"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              Parolni o'zgartirish
            </button>
          </div>
        </div>
  
        <!-- Role & Permissions -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ShieldCheckIcon class="w-5 h-5 mr-2 text-gray-500" />
            Rol va ruxsatlar
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Rol <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.role"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.role }"
              >
                <option value="">Tanlang</option>
                <option value="admin">Administrator</option>
                <option value="manager">Menejer</option>
                <option value="operator">Operator</option>
                <option value="viewer">Ko'ruvchi</option>
              </select>
              <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Holat <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.is_active"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option :value="true">Faol</option>
                <option :value="false">Faol emas</option>
              </select>
            </div>
          </div>
  
          <!-- Permissions -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Ruxsatlar
            </label>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label
                v-for="permission in availablePermissions"
                :key="permission.value"
                class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                :class="{ 'border-blue-500 bg-blue-50': form.permissions.includes(permission.value) }"
              >
                <input
                  v-model="form.permissions"
                  type="checkbox"
                  :value="permission.value"
                  class="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <span class="ml-3 text-sm text-gray-900">{{ permission.label }}</span>
              </label>
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
  import { UserIcon, KeyIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['update:modelValue', 'submit', 'close'])
  
  const loading = ref(false)
  const errors = ref({})
  const showPassword = ref(false)
  const showPasswordFields = ref(false)
  
  const availablePermissions = [
    { value: 'users.view', label: 'Foydalanuvchilarni ko\'rish' },
    { value: 'users.create', label: 'Foydalanuvchi yaratish' },
    { value: 'users.edit', label: 'Foydalanuvchini tahrirlash' },
    { value: 'users.delete', label: 'Foydalanuvchini o\'chirish' },
    { value: 'warehouse.view', label: 'Omborni ko\'rish' },
    { value: 'warehouse.manage', label: 'Omborni boshqarish' },
    { value: 'production.view', label: 'Ishlab chiqarishni ko\'rish' },
    { value: 'production.manage', label: 'Ishlab chiqarishni boshqarish' },
    { value: 'sales.view', label: 'Sotishni ko\'rish' },
    { value: 'sales.manage', label: 'Sotishni boshqarish' },
    { value: 'finance.view', label: 'Moliyani ko\'rish' },
    { value: 'finance.manage', label: 'Moliyani boshqarish' },
    { value: 'hr.view', label: 'HR ni ko\'rish' },
    { value: 'hr.manage', label: 'HR ni boshqarish' },
    { value: 'maintenance.view', label: 'Ta\'mirlashni ko\'rish' },
    { value: 'maintenance.manage', label: 'Ta\'mirlashni boshqarish' },
    { value: 'settings.view', label: 'Sozlamalarni ko\'rish' },
    { value: 'settings.manage', label: 'Sozlamalarni boshqarish' }
  ]
  
  const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })
  
  const modalTitle = computed(() => {
    return props.user ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi qo\'shish'
  })
  
  const isEditMode = computed(() => !!props.user)
  
  const form = ref({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: '',
    is_active: true,
    permissions: [],
    notes: ''
  })
  
  watch(() => props.user, (user) => {
    if (user) {
      form.value = {
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        password: '',
        password_confirmation: '',
        role: user.role || '',
        is_active: user.is_active !== undefined ? user.is_active : true,
        permissions: user.permissions || [],
        notes: user.notes || ''
      }
      showPasswordFields.value = false
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
    
    if (!form.value.username || form.value.username.trim() === '') {
      errors.value.username = 'Foydalanuvchi nomi majburiy'
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.value.username)) {
      errors.value.username = 'Faqat harflar, raqamlar va _ belgisi'
    }
    
    if (!form.value.email || form.value.email.trim() === '') {
      errors.value.email = 'Email majburiy'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
      errors.value.email = 'Email noto\'g\'ri formatda'
    }
    
    if (!form.value.first_name || form.value.first_name.trim() === '') {
      errors.value.first_name = 'Ism majburiy'
    }
    
    if (!form.value.last_name || form.value.last_name.trim() === '') {
      errors.value.last_name = 'Familiya majburiy'
    }
    
    if (!isEditMode.value || showPasswordFields.value) {
      if (!form.value.password || form.value.password.trim() === '') {
        errors.value.password = 'Parol majburiy'
      } else if (form.value.password.length < 8) {
        errors.value.password = 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak'
      }
      
      if (form.value.password !== form.value.password_confirmation) {
        errors.value.password_confirmation = 'Parollar mos kelmaydi'
      }
    }
    
    if (!form.value.role) {
      errors.value.role = 'Rol majburiy'
    }
    
    return Object.keys(errors.value).length === 0
  }
  
  async function handleSubmit() {
    if (!validateForm()) {
      return
    }
    
    loading.value = true
    
    try {
      const data = { ...form.value }
      
      // Don't send password if not changing (in edit mode)
      if (isEditMode.value && !showPasswordFields.value) {
        delete data.password
        delete data.password_confirmation
      }
      
      emit('submit', data)
    } catch (error) {
      console.error('Form submit error:', error)
    } finally {
      loading.value = false
    }
  }
  
  function handleClose() {
    emit('close')
    errors.value = {}
    showPasswordFields.value = false
  }
  
  function resetForm() {
    form.value = {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      password: '',
      password_confirmation: '',
      role: '',
      is_active: true,
      permissions: [],
      notes: ''
    }
    errors.value = {}
    showPasswordFields.value = false
  }
  </script>