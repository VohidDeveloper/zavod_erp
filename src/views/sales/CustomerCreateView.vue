<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="$router.back()"
            class="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeftIcon class="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEdit ? 'Mijozni tahrirlash' : 'Yangi mijoz' }}
            </h1>
            <p class="text-gray-600 mt-1">Mijoz ma'lumotlarini kiritish</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="saveDraft"
            :disabled="saving"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Qoralama
          </button>
          <button
            @click="saveCustomer"
            :disabled="saving || !isValid"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
          </button>
        </div>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Information -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Asosiy ma'lumotlar</h3>
            </template>
  
            <div class="space-y-4">
              <!-- Customer Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mijoz turi <span class="text-red-600">*</span>
                </label>
                <div class="grid grid-cols-2 gap-4">
                  <div
                    @click="form.type = 'individual'"
                    :class="[
                      'p-4 border-2 rounded-lg cursor-pointer transition text-center',
                      form.type === 'individual'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    ]"
                  >
                    <UserIcon :class="['w-8 h-8 mx-auto mb-2', form.type === 'individual' ? 'text-blue-600' : 'text-gray-400']" />
                    <p :class="['font-medium', form.type === 'individual' ? 'text-blue-900' : 'text-gray-700']">
                      Jismoniy shaxs
                    </p>
                  </div>
                  <div
                    @click="form.type = 'company'"
                    :class="[
                      'p-4 border-2 rounded-lg cursor-pointer transition text-center',
                      form.type === 'company'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    ]"
                  >
                    <BuildingOfficeIcon :class="['w-8 h-8 mx-auto mb-2', form.type === 'company' ? 'text-blue-600' : 'text-gray-400']" />
                    <p :class="['font-medium', form.type === 'company' ? 'text-blue-900' : 'text-gray-700']">
                      Yuridik shaxs
                    </p>
                  </div>
                </div>
              </div>
  
              <!-- Name / Company Name -->
              <div v-if="form.type === 'individual'" class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Ism <span class="text-red-600">*</span>
                  </label>
                  <input
                    v-model="form.firstName"
                    type="text"
                    placeholder="Ism"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Familiya <span class="text-red-600">*</span>
                  </label>
                  <input
                    v-model="form.lastName"
                    type="text"
                    placeholder="Familiya"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
  
              <div v-if="form.type === 'company'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Kompaniya nomi <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="form.companyName"
                  type="text"
                  placeholder="Kompaniya nomi"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
  
              <!-- Contact Information -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Telefon <span class="text-red-600">*</span>
                  </label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    placeholder="+998 XX XXX-XX-XX"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="email@example.com"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
  
              <!-- Additional Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Qo'shimcha telefon
                </label>
                <input
                  v-model="form.additionalPhone"
                  type="tel"
                  placeholder="+998 XX XXX-XX-XX"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </BaseCard>
  
          <!-- Company Details (for company type) -->
          <BaseCard v-if="form.type === 'company'">
            <template #header>
              <h3 class="text-lg font-semibold">Kompaniya ma'lumotlari</h3>
            </template>
  
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    INN
                  </label>
                  <input
                    v-model="form.inn"
                    type="text"
                    placeholder="123456789"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    OKED
                  </label>
                  <input
                    v-model="form.oked"
                    type="text"
                    placeholder="12345"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Bank nomi
                </label>
                <input
                  v-model="form.bankName"
                  type="text"
                  placeholder="Xalq Bank"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Hisob raqami
                </label>
                <input
                  v-model="form.accountNumber"
                  type="text"
                  placeholder="2020 1234 5678 9012"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Direktor
                </label>
                <input
                  v-model="form.director"
                  type="text"
                  placeholder="FIO"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </BaseCard>
  
          <!-- Address -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Manzil</h3>
            </template>
  
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Viloyat
                  </label>
                  <select
                    v-model="form.region"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Tanlang</option>
                    <option v-for="region in regions" :key="region" :value="region">
                      {{ region }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Shahar/Tuman
                  </label>
                  <input
                    v-model="form.city"
                    type="text"
                    placeholder="Shahar"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  To'liq manzil
                </label>
                <textarea
                  v-model="form.address"
                  rows="2"
                  placeholder="Ko'cha, uy raqami..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>
            </div>
          </BaseCard>
  
          <!-- Additional Information -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Qo'shimcha ma'lumotlar</h3>
            </template>
  
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mijoz guruhi
                </label>
                <select
                  v-model="form.customerGroup"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Tanlang</option>
                  <option value="vip">VIP</option>
                  <option value="regular">Doimiy</option>
                  <option value="wholesale">Ulgurji</option>
                  <option value="retail">Chakana</option>
                </select>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Chegirma (%)
                </label>
                <input
                  v-model.number="form.discount"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Kredit limiti
                </label>
                <input
                  v-model.number="form.creditLimit"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  To'lov muddati (kun)
                </label>
                <input
                  v-model.number="form.paymentTermDays"
                  type="number"
                  min="0"
                  placeholder="30"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Izoh
                </label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  placeholder="Qo'shimcha izohlar..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>
            </div>
          </BaseCard>
        </div>
  
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Summary -->
          <BaseCard>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Xulasa</h3>
            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Turi:</span>
                <Badge :color="form.type === 'company' ? 'blue' : 'green'">
                  {{ form.type === 'company' ? 'Yuridik' : 'Jismoniy' }}
                </Badge>
              </div>
              <div v-if="form.type === 'individual' && (form.firstName || form.lastName)">
                <span class="text-gray-600">Ism familiya:</span>
                <p class="font-medium text-gray-900 mt-1">{{ form.firstName }} {{ form.lastName }}</p>
              </div>
              <div v-if="form.type === 'company' && form.companyName">
                <span class="text-gray-600">Kompaniya:</span>
                <p class="font-medium text-gray-900 mt-1">{{ form.companyName }}</p>
              </div>
              <div v-if="form.phone">
                <span class="text-gray-600">Telefon:</span>
                <p class="font-medium text-gray-900 mt-1">{{ form.phone }}</p>
              </div>
              <div v-if="form.customerGroup">
                <span class="text-gray-600">Guruh:</span>
                <p class="font-medium text-gray-900 mt-1">{{ form.customerGroup }}</p>
              </div>
            </div>
          </BaseCard>
  
          <!-- Tips -->
          <BaseCard>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Maslahatlar</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>To'liq va aniq ma'lumot kiriting</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Telefon raqamini to'g'ri formatda yozing</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Yuridik shaxslar uchun INN majburiy</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Mijoz guruhini belgilang</p>
              </div>
            </div>
          </BaseCard>
  
          <!-- Quick Info -->
          <BaseCard class="bg-blue-50 border-blue-200">
            <div class="flex items-start space-x-3">
              <InformationCircleIcon class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 class="font-semibold text-blue-900 mb-2 text-sm">Ma'lumot</h4>
                <p class="text-xs text-blue-800">
                  Mijoz ma'lumotlari maxfiy saqlanadi va faqat sotuvlar uchun ishlatiladi
                </p>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSalesStore } from '@/stores/sales'
  import {
    ArrowLeftIcon,
    UserIcon,
    BuildingOfficeIcon,
    CheckCircleIcon,
    InformationCircleIcon
  } from '@heroicons/vue/24/outline'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const route = useRoute()
  const router = useRouter()
  const salesStore = useSalesStore()
  
  const isEdit = computed(() => !!route.params.id)
  const saving = ref(false)
  
  const regions = [
    'Toshkent',
    'Andijon',
    'Buxoro',
    'Farg\'ona',
    'Jizzax',
    'Namangan',
    'Navoiy',
    'Qashqadaryo',
    'Qoraqalpog\'iston',
    'Samarqand',
    'Sirdaryo',
    'Surxondaryo',
    'Toshkent viloyati',
    'Xorazm'
  ]
  
  const form = reactive({
    type: 'individual',
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    email: '',
    additionalPhone: '',
    inn: '',
    oked: '',
    bankName: '',
    accountNumber: '',
    director: '',
    region: '',
    city: '',
    address: '',
    customerGroup: '',
    discount: 0,
    creditLimit: 0,
    paymentTermDays: 30,
    notes: ''
  })
  
  const isValid = computed(() => {
    if (form.type === 'individual') {
      return form.firstName && form.lastName && form.phone
    } else {
      return form.companyName && form.phone
    }
  })
  
  const saveCustomer = async () => {
    if (!isValid.value) return
    
    saving.value = true
    try {
      if (isEdit.value) {
        await salesStore.updateCustomer(route.params.id, form)
      } else {
        await salesStore.createCustomer(form)
      }
      router.push({ name: 'sales-customers' })
    } catch (error) {
      console.error('Failed to save customer:', error)
    } finally {
      saving.value = false
    }
  }
  
  const saveDraft = async () => {
    saving.value = true
    try {
      await salesStore.saveDraft({ ...form, status: 'draft' })
      router.push({ name: 'sales-customers' })
    } finally {
      saving.value = false
    }
  }
  
  onMounted(async () => {
    if (isEdit.value) {
      const customer = await salesStore.fetchCustomer(route.params.id)
      Object.assign(form, customer)
    }
  })
  </script>