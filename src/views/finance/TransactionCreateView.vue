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
              {{ isEdit ? 'Tranzaksiyani tahrirlash' : 'Yangi tranzaksiya' }}
            </h1>
            <p class="text-gray-600 mt-1">Moliyaviy tranzaksiya yaratish yoki tahrirlash</p>
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
            @click="saveTransaction"
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
          <!-- Transaction Type -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Tranzaksiya turi</h3>
            </template>
  
            <div class="grid grid-cols-2 gap-4">
              <div
                @click="form.type = 'income'"
                :class="[
                  'p-6 border-2 rounded-lg cursor-pointer transition text-center',
                  form.type === 'income'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                ]"
              >
                <div :class="[
                  'w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3',
                  form.type === 'income' ? 'bg-green-100' : 'bg-gray-100'
                ]">
                  <ArrowDownIcon :class="[
                    'w-8 h-8',
                    form.type === 'income' ? 'text-green-600' : 'text-gray-400'
                  ]" />
                </div>
                <p :class="[
                  'font-semibold text-lg',
                  form.type === 'income' ? 'text-green-900' : 'text-gray-700'
                ]">
                  Tushum
                </p>
                <p class="text-sm text-gray-600 mt-1">Kirim va daromadlar</p>
              </div>
  
              <div
                @click="form.type = 'expense'"
                :class="[
                  'p-6 border-2 rounded-lg cursor-pointer transition text-center',
                  form.type === 'expense'
                    ? 'border-red-600 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                ]"
              >
                <div :class="[
                  'w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3',
                  form.type === 'expense' ? 'bg-red-100' : 'bg-gray-100'
                ]">
                  <ArrowUpIcon :class="[
                    'w-8 h-8',
                    form.type === 'expense' ? 'text-red-600' : 'text-gray-400'
                  ]" />
                </div>
                <p :class="[
                  'font-semibold text-lg',
                  form.type === 'expense' ? 'text-red-900' : 'text-gray-700'
                ]">
                  Chiqim
                </p>
                <p class="text-sm text-gray-600 mt-1">Xarajatlar va to'lovlar</p>
              </div>
            </div>
            <p v-if="errors.type" class="text-red-600 text-sm mt-2">{{ errors.type }}</p>
          </BaseCard>
  
          <!-- Basic Information -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Asosiy ma'lumotlar</h3>
            </template>
  
            <div class="space-y-4">
              <!-- Amount -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Summa <span class="text-red-600">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model.number="form.amount"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    class="w-full px-4 py-3 text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">
                    UZS
                  </span>
                </div>
                <p v-if="errors.amount" class="text-red-600 text-sm mt-1">{{ errors.amount }}</p>
                <p v-if="form.amount > 0" class="text-sm text-gray-600 mt-1">
                  {{ formatAmountInWords(form.amount) }}
                </p>
              </div>
  
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sarlavha <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="Qisqa tavsif"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p v-if="errors.title" class="text-red-600 text-sm mt-1">{{ errors.title }}</p>
              </div>
  
              <!-- Category and Payment Method -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Kategoriya <span class="text-red-600">*</span>
                  </label>
                  <select
                    v-model="form.category"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Tanlang</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                      {{ cat.name }}
                    </option>
                  </select>
                </div>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    To'lov usuli <span class="text-red-600">*</span>
                  </label>
                  <select
                    v-model="form.paymentMethod"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Tanlang</option>
                    <option value="cash">Naqd</option>
                    <option value="bank_transfer">Bank o'tkazmasi</option>
                    <option value="card">Karta</option>
                    <option value="check">Chek</option>
                    <option value="other">Boshqa</option>
                  </select>
                </div>
              </div>
  
              <!-- Date and Time -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Sana <span class="text-red-600">*</span>
                  </label>
                  <input
                    v-model="form.date"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Vaqt
                  </label>
                  <input
                    v-model="form.time"
                    type="time"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
  
              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tavsif
                </label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  placeholder="Qo'shimcha ma'lumotlar..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>
          </BaseCard>
  
          <!-- Party Information -->
          <BaseCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">
                  {{ form.type === 'income' ? 'Kimdan' : 'Kimga' }}
                </h3>
                <button
                  v-if="!showPartyForm"
                  @click="showPartyForm = true"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Qo'shish
                </button>
              </div>
            </template>
  
            <div v-if="showPartyForm" class="space-y-4">
              <!-- Party Selection or New -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tanlash yoki yangi
                </label>
                <div class="flex space-x-2">
                  <select
                    v-model="form.partyId"
                    @change="onPartySelect"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Yangi qo'shish</option>
                    <option v-for="party in parties" :key="party.id" :value="party.id">
                      {{ party.name }}
                    </option>
                  </select>
                  <button
                    @click="showPartyForm = false; form.partyId = ''"
                    class="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
  
              <div v-if="!form.partyId" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nomi
                  </label>
                  <input
                    v-model="form.partyName"
                    type="text"
                    placeholder="Kompaniya yoki shaxs nomi"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
  
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      v-model="form.partyPhone"
                      type="tel"
                      placeholder="+998 XX XXX-XX-XX"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      v-model="form.partyEmail"
                      type="email"
                      placeholder="email@example.com"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Hisob raqami
                  </label>
                  <input
                    v-model="form.partyAccount"
                    type="text"
                    placeholder="2020 1234 5678 9012"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
  
            <div v-else class="text-center py-8 text-gray-500">
              <UserPlusIcon class="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p class="text-sm">Tomon ma'lumotlarini qo'shish (ixtiyoriy)</p>
            </div>
          </BaseCard>
  
          <!-- Additional Details -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Qo'shimcha</h3>
            </template>
  
            <div class="space-y-4">
              <!-- Reference Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Havola raqami
                </label>
                <input
                  v-model="form.reference"
                  type="text"
                  placeholder="TXN-2024-001234"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
  
              <!-- Tags -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Teglar
                </label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <Badge
                    v-for="(tag, index) in form.tags"
                    :key="index"
                    color="blue"
                    @click="removeTag(index)"
                    class="cursor-pointer"
                  >
                    {{ tag }} ×
                  </Badge>
                </div>
                <div class="flex space-x-2">
                  <input
                    v-model="newTag"
                    @keydown.enter.prevent="addTag"
                    type="text"
                    placeholder="Teg qo'shish"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    @click="addTag"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Qo'shish
                  </button>
                </div>
              </div>
  
              <!-- Attachments -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fayllar
                </label>
                <div
                  @drop.prevent="handleFileDrop"
                  @dragover.prevent
                  class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer"
                  @click="$refs.fileInput.click()"
                >
                  <DocumentPlusIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p class="text-sm text-gray-600">Fayllarni shu yerga tashlang yoki tanlang</p>
                  <p class="text-xs text-gray-500 mt-1">PDF, JPG, PNG (maks 10MB)</p>
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    @change="handleFileSelect"
                    class="hidden"
                  />
                </div>
  
                <!-- File List -->
                <div v-if="form.files.length > 0" class="mt-3 space-y-2">
                  <div
                    v-for="(file, index) in form.files"
                    :key="index"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div class="flex items-center space-x-3">
                      <DocumentIcon class="w-5 h-5 text-gray-400" />
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                        <p class="text-xs text-gray-600">{{ formatFileSize(file.size) }}</p>
                      </div>
                    </div>
                    <button
                      @click="removeFile(index)"
                      class="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <XMarkIcon class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
  
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Summary Card -->
          <BaseCard :class="[
            'border-2',
            form.type === 'income' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          ]">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Xulasa</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Turi:</span>
                <Badge :color="form.type === 'income' ? 'green' : 'red'">
                  {{ form.type === 'income' ? 'Tushum' : 'Chiqim' }}
                </Badge>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Summa:</span>
                <span :class="[
                  'text-xl font-bold',
                  form.type === 'income' ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ form.amount ? formatCurrency(form.amount) : '0 UZS' }}
                </span>
              </div>
              <div v-if="form.category" class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Kategoriya:</span>
                <span class="text-sm font-medium text-gray-900">{{ getCategoryName(form.category) }}</span>
              </div>
              <div v-if="form.date" class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Sana:</span>
                <span class="text-sm font-medium text-gray-900">{{ form.date }}</span>
              </div>
            </div>
          </BaseCard>
  
          <!-- Quick Info -->
          <BaseCard>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Maslahatlar</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Aniq va tushunarli sarlavha bering</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>To'g'ri kategoriyani tanlang</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Havola raqamini kiriting</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Hujjatlarni ilova qiling</p>
              </div>
            </div>
          </BaseCard>
  
          <!-- Recent Transactions -->
          <BaseCard v-if="recentTransactions.length > 0">
            <h3 class="text-sm font-medium text-gray-700 mb-3">So'nggi tranzaksiyalar</h3>
            <div class="space-y-2">
              <div
                v-for="txn in recentTransactions"
                :key="txn.id"
                class="p-2 bg-gray-50 rounded text-xs"
              >
                <p class="font-medium text-gray-900">{{ txn.title }}</p>
                <div class="flex items-center justify-between mt-1">
                  <span class="text-gray-600">{{ txn.date }}</span>
                  <span :class="txn.type === 'income' ? 'text-green-600' : 'text-red-600'">
                    {{ formatCurrency(txn.amount) }}
                  </span>
                </div>
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
  import { useFinanceStore } from '@/stores/finance'
  import {
    ArrowLeftIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    XMarkIcon,
    UserPlusIcon,
    DocumentPlusIcon,
    DocumentIcon,
    CheckCircleIcon
  } from '@heroicons/vue/24/outline'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const route = useRoute()
  const router = useRouter()
  const financeStore = useFinanceStore()
  
  const isEdit = computed(() => !!route.params.id)
  const saving = ref(false)
  const showPartyForm = ref(false)
  const newTag = ref('')
  const fileInput = ref(null)
  
  const categories = ref([])
  const parties = ref([])
  const recentTransactions = ref([])
  
  const form = reactive({
    type: 'income',
    amount: 0,
    title: '',
    category: '',
    paymentMethod: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    description: '',
    partyId: '',
    partyName: '',
    partyPhone: '',
    partyEmail: '',
    partyAccount: '',
    reference: '',
    tags: [],
    files: []
  })
  
  const errors = ref({})
  
  const isValid = computed(() => {
    return form.type &&
           form.amount > 0 &&
           form.title &&
           form.category &&
           form.paymentMethod &&
           form.date
  })
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  const formatAmountInWords = (amount) => {
    // Simple implementation - you may want a more sophisticated number-to-words converter
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} million so'm`
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)} ming so'm`
    }
    return `${amount} so'm`
  }
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }
  
  const getCategoryName = (id) => {
    return categories.value.find(c => c.id === id)?.name || ''
  }
  
  const onPartySelect = () => {
    if (form.partyId) {
      const party = parties.value.find(p => p.id === form.partyId)
      if (party) {
        form.partyName = party.name
        form.partyPhone = party.phone
        form.partyEmail = party.email
        form.partyAccount = party.account
      }
    }
  }
  
  const addTag = () => {
    if (newTag.value.trim() && !form.tags.includes(newTag.value.trim())) {
      form.tags.push(newTag.value.trim())
      newTag.value = ''
    }
  }
  
  const removeTag = (index) => {
    form.tags.splice(index, 1)
  }
  
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    form.files.push(...files.filter(f => f.size <= 10 * 1024 * 1024))
  }
  
  const handleFileDrop = (event) => {
    const files = Array.from(event.dataTransfer.files)
    form.files.push(...files.filter(f => f.size <= 10 * 1024 * 1024))
  }
  
  const removeFile = (index) => {
    form.files.splice(index, 1)
  }
  
  const validate = () => {
    errors.value = {}
    
    if (!form.type) errors.value.type = 'Turni tanlang'
    if (!form.amount || form.amount <= 0) errors.value.amount = 'Summani kiriting'
    if (!form.title) errors.value.title = 'Sarlavhani kiriting'
    
    return Object.keys(errors.value).length === 0
  }
  
  const saveTransaction = async () => {
    if (!validate() || !isValid.value) return
    
    saving.value = true
    try {
      const formData = new FormData()
      
      Object.keys(form).forEach(key => {
        if (key !== 'files') {
          if (Array.isArray(form[key])) {
            formData.append(key, JSON.stringify(form[key]))
          } else {
            formData.append(key, form[key])
          }
        }
      })
      
      form.files.forEach((file, i) => formData.append(`files[${i}]`, file))
      
      if (isEdit.value) {
        await financeStore.updateTransaction(route.params.id, formData)
      } else {
        await financeStore.createTransaction(formData)
      }
      
      router.push({ name: 'finance-transactions' })
    } catch (error) {
      console.error('Failed to save transaction:', error)
    } finally {
      saving.value = false
    }
  }
  
  const saveDraft = async () => {
    saving.value = true
    try {
      await financeStore.saveDraft({ ...form, status: 'draft' })
      router.push({ name: 'finance-transactions' })
    } finally {
      saving.value = false
    }
  }
  
  onMounted(async () => {
    categories.value = (await financeStore.fetchCategories()).data
    parties.value = (await financeStore.fetchParties()).data
    recentTransactions.value = (await financeStore.fetchRecentTransactions({ limit: 5 })).data
    
    if (isEdit.value) {
      const transaction = await financeStore.fetchTransaction(route.params.id)
      Object.assign(form, transaction)
    }
    
    if (route.query.duplicate) {
      const transaction = await financeStore.fetchTransaction(route.query.duplicate)
      Object.assign(form, {
        ...transaction,
        date: new Date().toISOString().split('T')[0],
        reference: ''
      })
    }
  })
  </script>