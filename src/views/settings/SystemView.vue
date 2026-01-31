<template>
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Tizim sozlamalari</h1>
        <p class="text-gray-600 mt-1">Umumiy tizim sozlamalari</p>
      </div>
  
      <!-- Settings Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Company Info -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Kompaniya ma'lumotlari</h3>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Kompaniya nomi</label>
              <input v-model="settings.company_name" type="text" class="input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input v-model="settings.company_email" type="email" class="input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
              <input v-model="settings.company_phone" type="tel" class="input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Manzil</label>
              <textarea v-model="settings.company_address" rows="3" class="input"></textarea>
            </div>
          </div>
        </div>
  
        <!-- System Settings -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Tizim sozlamalari</h3>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Til</label>
              <select v-model="settings.language" class="input">
                <option value="uz">O'zbekcha</option>
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Vaqt mintaqasi</label>
              <select v-model="settings.timezone" class="input">
                <option value="Asia/Tashkent">Asia/Tashkent (UTC+5)</option>
                <option value="Asia/Samarkand">Asia/Samarkand (UTC+5)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Valyuta</label>
              <select v-model="settings.currency" class="input">
                <option value="UZS">UZS - O'zbek so'm</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sana formati</label>
              <select v-model="settings.date_format" class="input">
                <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
  
        <!-- Security Settings -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Xavfsizlik</h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">Ikki faktorli autentifikatsiya</p>
                <p class="text-sm text-gray-500">Qo'shimcha xavfsizlik qatlami</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="settings.two_factor_auth" type="checkbox" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">Login tarixini saqlash</p>
                <p class="text-sm text-gray-500">Kirish tarixini yozib borish</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="settings.track_login_history" type="checkbox" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Parol amal qilish muddati (kunlarda)</label>
              <input v-model.number="settings.password_expiry_days" type="number" min="0" class="input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sessiya timeout (daqiqalarda)</label>
              <input v-model.number="settings.session_timeout" type="number" min="1" class="input" />
            </div>
          </div>
        </div>
  
        <!-- Notification Settings -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Bildirishnomalar</h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">Email bildirishnomalar</p>
                <p class="text-sm text-gray-500">Muhim xabarlarni emailga yuborish</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="settings.email_notifications" type="checkbox" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">SMS bildirishnomalar</p>
                <p class="text-sm text-gray-500">Telefon orqali bildirishnomalar</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="settings.sms_notifications" type="checkbox" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">Push bildirishnomalar</p>
                <p class="text-sm text-gray-500">Brauzer bildirishnomalari</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input v-model="settings.push_notifications" type="checkbox" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Save Button -->
      <div class="flex justify-end">
        <button
          @click="saveSettings"
          :disabled="saving"
          class="btn-primary"
        >
          <span v-if="saving">Saqlanmoqda...</span>
          <span v-else>Saqlash</span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useSettingsStore } from '@/stores/settings'
  import { useNotifications } from '@/composables/useNotifications'
  
  const settingsStore = useSettingsStore()
  const notifications = useNotifications()
  
  const settings = ref({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    language: 'uz',
    timezone: 'Asia/Tashkent',
    currency: 'UZS',
    date_format: 'DD.MM.YYYY',
    two_factor_auth: false,
    track_login_history: true,
    password_expiry_days: 90,
    session_timeout: 30,
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
  })
  
  const saving = ref(false)
  
  onMounted(() => {
    fetchSettings()
  })
  
  async function fetchSettings() {
    try {
      const data = await settingsStore.fetchSystemSettings()
      if (data) {
        settings.value = { ...settings.value, ...data }
      }
    } catch (error) {
      console.error('Settings error:', error)
    }
  }
  
  async function saveSettings() {
    saving.value = true
    try {
      await settingsStore.updateSystemSettings(settings.value)
      notifications.success('Sozlamalar saqlandi')
    } catch (error) {
      notifications.apiError(error)
    } finally {
      saving.value = false
    }
  }
  </script>