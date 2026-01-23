<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div class="max-w-md w-full">
        <!-- Logo and Title -->
        <div class="text-center mb-8">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span class="text-3xl font-bold text-white">SP</span>
            </div>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">S PROMAX PLAST</h1>
          <p class="text-gray-600 mt-2">Parolni o'zgartirish</p>
        </div>
  
        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <!-- Success Message -->
          <div v-if="success" class="mb-6">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center">
                <CheckCircleIcon class="w-5 h-5 text-green-600 mr-3" />
                <p class="text-sm text-green-800">
                  Parol muvaffaqiyatli o'zgartirildi! Yangi parol bilan kirish mumkin.
                </p>
              </div>
            </div>
            <div class="mt-6 text-center">
              <router-link
                to="/login"
                class="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Kirish sahifasiga o'tish
              </router-link>
            </div>
          </div>
  
          <!-- Form -->
          <form v-else @submit.prevent="handleChangePassword">
            <!-- Instructions -->
            <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start">
                <InformationCircleIcon class="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div class="text-sm text-blue-800">
                  <p class="font-medium mb-1">Parol talablari:</p>
                  <ul class="list-disc list-inside space-y-1">
                    <li>Kamida 8 ta belgi</li>
                    <li>Kamida bitta katta harf</li>
                    <li>Kamida bitta kichik harf</li>
                    <li>Kamida bitta raqam</li>
                    <li>Kamida bitta maxsus belgi (@$!%*?&)</li>
                  </ul>
                </div>
              </div>
            </div>
  
            <!-- Current Password -->
            <div class="mb-4">
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Joriy parol
              </label>
              <div class="relative">
                <input
                  id="currentPassword"
                  v-model="form.current_password"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Joriy parolingizni kiriting"
                >
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <EyeIcon v-if="!showCurrentPassword" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
              <span v-if="errors.current_password" class="text-red-500 text-sm mt-1 block">
                {{ errors.current_password }}
              </span>
            </div>
  
            <!-- New Password -->
            <div class="mb-4">
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Yangi parol
              </label>
              <div class="relative">
                <input
                  id="newPassword"
                  v-model="form.new_password"
                  :type="showNewPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Yangi parolingizni kiriting"
                  @input="validatePassword"
                >
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <EyeIcon v-if="!showNewPassword" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
              <span v-if="errors.new_password" class="text-red-500 text-sm mt-1 block">
                {{ errors.new_password }}
              </span>
              
              <!-- Password Strength Indicator -->
              <div v-if="form.new_password" class="mt-2">
                <div class="flex items-center space-x-2 text-sm">
                  <span class="text-gray-600">Parol kuchi:</span>
                  <div class="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      :class="[
                        'h-full transition-all duration-300',
                        passwordStrength.color
                      ]"
                      :style="{ width: passwordStrength.width }"
                    ></div>
                  </div>
                  <span :class="passwordStrength.textColor" class="font-medium">
                    {{ passwordStrength.label }}
                  </span>
                </div>
              </div>
            </div>
  
            <!-- Confirm Password -->
            <div class="mb-6">
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Yangi parolni tasdiqlash
              </label>
              <div class="relative">
                <input
                  id="confirmPassword"
                  v-model="form.new_password_confirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Yangi parolni qayta kiriting"
                >
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <EyeIcon v-if="!showConfirmPassword" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
              <span v-if="errors.new_password_confirmation" class="text-red-500 text-sm mt-1 block">
                {{ errors.new_password_confirmation }}
              </span>
              
              <!-- Password Match Indicator -->
              <div v-if="form.new_password && form.new_password_confirmation" class="mt-2">
                <div class="flex items-center text-sm">
                  <CheckCircleIcon v-if="passwordsMatch" class="w-4 h-4 text-green-600 mr-1" />
                  <XCircleIcon v-else class="w-4 h-4 text-red-600 mr-1" />
                  <span :class="passwordsMatch ? 'text-green-600' : 'text-red-600'">
                    {{ passwordsMatch ? 'Parollar mos keladi' : 'Parollar mos kelmayapti' }}
                  </span>
                </div>
              </div>
            </div>
  
            <!-- Error message -->
            <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center">
                <XCircleIcon class="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                <p class="text-sm text-red-600">{{ errorMessage }}</p>
              </div>
            </div>
  
            <!-- Buttons -->
            <div class="flex space-x-4">
              <button
                type="submit"
                :disabled="loading || !canSubmit"
                class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saqlanmoqda...
                </span>
                <span v-else>Parolni o'zgartirish</span>
              </button>
              
              <router-link
                to="/login"
                class="flex-1 bg-white text-gray-700 py-3 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition text-center"
              >
                Bekor qilish
              </router-link>
            </div>
          </form>
        </div>
  
        <!-- Footer -->
        <div class="mt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 S PROMAX PLAST. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { 
    EyeIcon, 
    EyeSlashIcon, 
    CheckCircleIcon, 
    XCircleIcon,
    InformationCircleIcon 
  } from '@heroicons/vue/24/outline'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const form = ref({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  })
  
  const showCurrentPassword = ref(false)
  const showNewPassword = ref(false)
  const showConfirmPassword = ref(false)
  const loading = ref(false)
  const success = ref(false)
  const errorMessage = ref('')
  const errors = ref({})
  
  // Password validation
  const passwordRequirements = computed(() => {
    const password = form.value.new_password
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&]/.test(password)
    }
  })
  
  const passwordStrength = computed(() => {
    const password = form.value.new_password
    if (!password) return { width: '0%', color: 'bg-gray-300', textColor: 'text-gray-500', label: '' }
    
    const requirements = passwordRequirements.value
    const passed = Object.values(requirements).filter(Boolean).length
    
    if (passed <= 2) {
      return { width: '25%', color: 'bg-red-500', textColor: 'text-red-600', label: 'Zaif' }
    } else if (passed === 3) {
      return { width: '50%', color: 'bg-orange-500', textColor: 'text-orange-600', label: 'O\'rtacha' }
    } else if (passed === 4) {
      return { width: '75%', color: 'bg-yellow-500', textColor: 'text-yellow-600', label: 'Yaxshi' }
    } else {
      return { width: '100%', color: 'bg-green-500', textColor: 'text-green-600', label: 'Kuchli' }
    }
  })
  
  const passwordsMatch = computed(() => {
    return form.value.new_password && 
           form.value.new_password_confirmation && 
           form.value.new_password === form.value.new_password_confirmation
  })
  
  const canSubmit = computed(() => {
    return form.value.current_password &&
           form.value.new_password &&
           form.value.new_password_confirmation &&
           passwordsMatch.value &&
           Object.values(passwordRequirements.value).every(Boolean)
  })
  
  const validatePassword = () => {
    errors.value.new_password = ''
    
    const requirements = passwordRequirements.value
    
    if (!requirements.length) {
      errors.value.new_password = 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak'
    } else if (!requirements.uppercase) {
      errors.value.new_password = 'Parolda kamida bitta katta harf bo\'lishi kerak'
    } else if (!requirements.lowercase) {
      errors.value.new_password = 'Parolda kamida bitta kichik harf bo\'lishi kerak'
    } else if (!requirements.number) {
      errors.value.new_password = 'Parolda kamida bitta raqam bo\'lishi kerak'
    } else if (!requirements.special) {
      errors.value.new_password = 'Parolda kamida bitta maxsus belgi (@$!%*?&) bo\'lishi kerak'
    }
  }
  
  const handleChangePassword = async () => {
    loading.value = true
    errorMessage.value = ''
    errors.value = {}
  
    try {
      await authStore.changePassword(form.value)
      success.value = true
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error) {
      if (error.errors) {
        errors.value = error.errors
      } else {
        errorMessage.value = error.message || 'Parolni o\'zgartirishda xatolik yuz berdi'
      }
    } finally {
      loading.value = false
    }
  }
  </script>