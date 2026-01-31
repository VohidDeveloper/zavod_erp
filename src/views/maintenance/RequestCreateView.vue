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
              {{ isEdit ? 'So\'rov tahrirlash' : 'Yangi ta\'mir so\'rovi' }}
            </h1>
            <p class="text-gray-600 mt-1">Uskunadagi muammolar uchun ta'mir so'rovi yaratish</p>
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
            @click="submitRequest"
            :disabled="saving || !isValid"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? 'Yuborilmoqda...' : 'Yuborish' }}
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
  
            <form class="space-y-6">
              <!-- Machine Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Uskuna <span class="text-red-600">*</span>
                </label>
                <div class="relative">
                  <select
                    v-model="form.machineId"
                    @change="onMachineChange"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Uskuna tanlang</option>
                    <option v-for="machine in machines" :key="machine.id" :value="machine.id">
                      {{ machine.code }} - {{ machine.name }}
                    </option>
                  </select>
                  <CogIcon class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <p v-if="errors.machineId" class="text-red-600 text-sm mt-1">{{ errors.machineId }}</p>
              </div>
  
              <!-- Machine Info (if selected) -->
              <div v-if="selectedMachine" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CogIcon class="w-6 h-6 text-blue-600" />
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ selectedMachine.name }}</p>
                    <p class="text-sm text-gray-600">{{ selectedMachine.location }}</p>
                  </div>
                  <Badge :color="getMachineStatusColor(selectedMachine.status)">
                    {{ getMachineStatusText(selectedMachine.status) }}
                  </Badge>
                </div>
              </div>
  
              <!-- Issue Category -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Muammo kategoriyasi <span class="text-red-600">*</span>
                </label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div
                    v-for="category in issueCategories"
                    :key="category.id"
                    @click="form.category = category.id"
                    :class="[
                      'p-4 border-2 rounded-lg cursor-pointer transition text-center',
                      form.category === category.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    ]"
                  >
                    <component 
                      :is="category.icon" 
                      :class="['w-6 h-6 mx-auto mb-2', form.category === category.id ? 'text-blue-600' : 'text-gray-400']" 
                    />
                    <p :class="['text-sm font-medium', form.category === category.id ? 'text-blue-900' : 'text-gray-700']">
                      {{ category.name }}
                    </p>
                  </div>
                </div>
                <p v-if="errors.category" class="text-red-600 text-sm mt-1">{{ errors.category }}</p>
              </div>
  
              <!-- Priority -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Muhimlik darajasi <span class="text-red-600">*</span>
                </label>
                <div class="grid grid-cols-3 gap-4">
                  <div
                    v-for="priority in priorities"
                    :key="priority.value"
                    @click="form.priority = priority.value"
                    :class="[
                      'p-4 border-2 rounded-lg cursor-pointer transition',
                      form.priority === priority.value
                        ? `border-${priority.color}-600 bg-${priority.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <div class="flex items-center justify-center mb-2">
                      <component 
                        :is="priority.icon" 
                        :class="[
                          'w-6 h-6',
                          form.priority === priority.value ? `text-${priority.color}-600` : 'text-gray-400'
                        ]" 
                      />
                    </div>
                    <p :class="['text-center font-medium mb-1', form.priority === priority.value ? 'text-gray-900' : 'text-gray-700']">
                      {{ priority.label }}
                    </p>
                    <p class="text-xs text-gray-600 text-center">{{ priority.description }}</p>
                  </div>
                </div>
              </div>
  
              <!-- Issue Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Muammo nomi <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="Qisqa va aniq tavsif"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p v-if="errors.title" class="text-red-600 text-sm mt-1">{{ errors.title }}</p>
              </div>
  
              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Batafsil tavsif <span class="text-red-600">*</span>
                </label>
                <textarea
                  v-model="form.description"
                  rows="5"
                  placeholder="Muammoni batafsil tasvirlab bering..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                ></textarea>
                <p class="text-xs text-gray-600 mt-1">{{ form.description.length }}/500 belgi</p>
                <p v-if="errors.description" class="text-red-600 text-sm mt-1">{{ errors.description }}</p>
              </div>
  
              <!-- Symptoms Checklist -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Kuzatilgan belgilar
                </label>
                <div class="space-y-2">
                  <label
                    v-for="symptom in symptoms"
                    :key="symptom.id"
                    class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :value="symptom.id"
                      v-model="form.symptoms"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900">{{ symptom.name }}</p>
                      <p class="text-xs text-gray-600">{{ symptom.description }}</p>
                    </div>
                  </label>
                </div>
              </div>
  
              <!-- Impact Assessment -->
              <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-3">Ta'sir baholash</h4>
                <div class="space-y-3">
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="form.impact.productionStopped"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span class="text-sm text-gray-700">Ishlab chiqarish to'xtatildi</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="form.impact.safetyRisk"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span class="text-sm text-gray-700">Xavfsizlik xavfi</span>
                  </label>
                  <label class="flex items-center space-x-2">
                    <input
                      v-model="form.impact.qualityIssue"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span class="text-sm text-gray-700">Sifat muammosi</span>
                  </label>
                </div>
              </div>
            </form>
          </BaseCard>
  
          <!-- Additional Information -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Qo'shimcha ma'lumotlar</h3>
            </template>
  
            <form class="space-y-6">
              <!-- Preferred Technician -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tavsiya etilgan texnik
                </label>
                <select
                  v-model="form.preferredTechnicianId"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tanlang (ixtiyoriy)</option>
                  <option v-for="tech in technicians" :key="tech.id" :value="tech.id">
                    {{ tech.name }} - {{ tech.specialization }}
                  </option>
                </select>
              </div>
  
              <!-- Expected Resolution Time -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Kutilayotgan hal qilish muddati
                </label>
                <select
                  v-model="form.expectedResolutionTime"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tanlang</option>
                  <option value="immediate">Darhol (1 soat ichida)</option>
                  <option value="urgent">Tezkor (4 soat ichida)</option>
                  <option value="normal">Oddiy (24 soat ichida)</option>
                  <option value="planned">Rejalashtirilgan (1 hafta)</option>
                </select>
              </div>
  
              <!-- File Attachments -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fayllar
                </label>
                <div
                  @dragover.prevent
                  @drop.prevent="handleFileDrop"
                  class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer"
                  @click="$refs.fileInput.click()"
                >
                  <ArrowUpTrayIcon class="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p class="text-sm text-gray-600 mb-1">
                    Fayllarni bu yerga tashlang yoki
                    <span class="text-blue-600">yuklash uchun bosing</span>
                  </p>
                  <p class="text-xs text-gray-500">Rasm, video yoki hujjat (max 10MB)</p>
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
                    @change="handleFileSelect"
                    class="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                </div>
  
                <!-- File List -->
                <div v-if="form.attachments.length > 0" class="mt-3 space-y-2">
                  <div
                    v-for="(file, index) in form.attachments"
                    :key="index"
                    class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
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
  
              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Qo'shimcha izohlar
                </label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  placeholder="Qo'shimcha ma'lumotlar yoki izohlar..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
            </form>
          </BaseCard>
        </div>
  
        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Quick Tips -->
          <BaseCard>
            <template #header>
              <div class="flex items-center space-x-2">
                <InformationCircleIcon class="w-5 h-5 text-blue-600" />
                <h3 class="text-lg font-semibold">Maslahatlar</h3>
              </div>
            </template>
  
            <div class="space-y-3 text-sm">
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p class="text-gray-700">Muammoni aniq va qisqa tasvirlab bering</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p class="text-gray-700">Rasm yoki video qo'shish muammoni tezroq hal qilishga yordam beradi</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p class="text-gray-700">Xavfsizlik xavfi bo'lsa, darhol xabar bering</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p class="text-gray-700">Barcha kuzatilgan belgilarni belgilang</p>
              </div>
            </div>
          </BaseCard>
  
          <!-- Priority Guide -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Muhimlik darajasi qo'llanmasi</h3>
            </template>
  
            <div class="space-y-3">
              <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center space-x-2 mb-1">
                  <ExclamationCircleIcon class="w-4 h-4 text-red-600" />
                  <p class="font-semibold text-red-900 text-sm">Kritik</p>
                </div>
                <p class="text-xs text-gray-700">Ishlab chiqarish to'xtagan, xavfsizlik xavfi</p>
              </div>
  
              <div class="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div class="flex items-center space-x-2 mb-1">
                  <ExclamationTriangleIcon class="w-4 h-4 text-orange-600" />
                  <p class="font-semibold text-orange-900 text-sm">Yuqori</p>
                </div>
                <p class="text-xs text-gray-700">Tezkor aralashuv talab qilinadi</p>
              </div>
  
              <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-center space-x-2 mb-1">
                  <InformationCircleIcon class="w-4 h-4 text-blue-600" />
                  <p class="font-semibold text-blue-900 text-sm">O'rtacha</p>
                </div>
                <p class="text-xs text-gray-700">Rejalashtirilgan ta'mir</p>
              </div>
            </div>
          </BaseCard>
  
          <!-- Recent Requests for this Machine -->
          <BaseCard v-if="selectedMachine && recentRequests.length > 0">
            <template #header>
              <h3 class="text-lg font-semibold">So'nggi so'rovlar</h3>
            </template>
  
            <div class="space-y-2">
              <div
                v-for="request in recentRequests"
                :key="request.id"
                class="p-3 bg-gray-50 rounded-lg text-sm"
              >
                <div class="flex items-center justify-between mb-1">
                  <p class="font-medium text-gray-900">{{ request.title }}</p>
                  <Badge :color="getStatusColor(request.status)" size="sm">
                    {{ request.status }}
                  </Badge>
                </div>
                <p class="text-xs text-gray-600">{{ request.date }}</p>
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
  import { useMaintenanceStore } from '@/stores/maintenance'
  import {
    ArrowLeftIcon,
    CogIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    ArrowUpTrayIcon,
    DocumentIcon,
    XMarkIcon,
    BoltIcon,
    FireIcon,
    WrenchScrewdriverIcon,
    BeakerIcon,
    SignalIcon,
    SpeakerWaveIcon
  } from '@heroicons/vue/24/outline'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const route = useRoute()
  const router = useRouter()
  const maintenanceStore = useMaintenanceStore()
  
  const isEdit = computed(() => !!route.params.id)
  const saving = ref(false)
  
  const machines = ref([])
  const technicians = ref([])
  const recentRequests = ref([])
  
  const issueCategories = [
    { id: 'mechanical', name: 'Mexanik', icon: CogIcon },
    { id: 'electrical', name: 'Elektr', icon: BoltIcon },
    { id: 'hydraulic', name: 'Gidravlik', icon: BeakerIcon },
    { id: 'thermal', name: 'Issiqlik', icon: FireIcon },
    { id: 'control', name: 'Boshqaruv', icon: SignalIcon },
    { id: 'noise', name: 'Shovqin', icon: SpeakerWaveIcon }
  ]
  
  const priorities = [
    { 
      value: 'critical', 
      label: 'Kritik', 
      color: 'red',
      description: 'Darhol aralashish',
      icon: ExclamationCircleIcon
    },
    { 
      value: 'high', 
      label: 'Yuqori', 
      color: 'orange',
      description: 'Tezkor ta\'mir',
      icon: ExclamationTriangleIcon
    },
    { 
      value: 'medium', 
      label: 'O\'rtacha', 
      color: 'blue',
      description: 'Rejalashtirilgan',
      icon: InformationCircleIcon
    }
  ]
  
  const symptoms = [
    { id: 'unusual_noise', name: 'G\'ayritabiiy shovqin', description: 'Oddiy emas tovushlar' },
    { id: 'vibration', name: 'Tebranish', description: 'Kuchli yoki g\'ayritabiiy tebranish' },
    { id: 'overheating', name: 'Haddan tashqari qizish', description: 'Yuqori harorat' },
    { id: 'leakage', name: 'Oqish', description: 'Moy, suv yoki boshqa suyuqlik' },
    { id: 'smoke', name: 'Tutun yoki hid', description: 'Tutun yoki yoqimsiz hid' },
    { id: 'error_codes', name: 'Xato kodlari', description: 'Displeyda xato' }
  ]
  
  const form = reactive({
    machineId: '',
    category: '',
    priority: 'medium',
    title: '',
    description: '',
    symptoms: [],
    impact: {
      productionStopped: false,
      safetyRisk: false,
      qualityIssue: false
    },
    preferredTechnicianId: '',
    expectedResolutionTime: '',
    attachments: [],
    notes: ''
  })
  
  const errors = ref({})
  
  const selectedMachine = computed(() => {
    return machines.value.find(m => m.id === form.machineId)
  })
  
  const isValid = computed(() => {
    return form.machineId &&
           form.category &&
           form.title &&
           form.description &&
           form.description.length >= 20
  })
  
  const onMachineChange = async () => {
    if (form.machineId) {
      // Load recent requests for this machine
      try {
        recentRequests.value = await maintenanceStore.fetchMachineRequests(form.machineId, { limit: 3 })
      } catch (error) {
        console.error('Failed to load recent requests:', error)
      }
    }
  }
  
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    addFiles(files)
  }
  
  const handleFileDrop = (event) => {
    const files = Array.from(event.dataTransfer.files)
    addFiles(files)
  }
  
  const addFiles = (files) => {
    files.forEach(file => {
      if (file.size <= 10 * 1024 * 1024) { // 10MB limit
        form.attachments.push(file)
      } else {
        alert(`${file.name} juda katta (max 10MB)`)
      }
    })
  }
  
  const removeFile = (index) => {
    form.attachments.splice(index, 1)
  }
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }
  
  const getMachineStatusColor = (status) => {
    if (status === 'active') return 'green'
    if (status === 'maintenance') return 'orange'
    return 'red'
  }
  
  const getMachineStatusText = (status) => {
    if (status === 'active') return 'Faol'
    if (status === 'maintenance') return 'Texnik ko\'rikda'
    return 'To\'xtatilgan'
  }
  
  const getStatusColor = (status) => {
    if (status === 'completed') return 'green'
    if (status === 'in_progress') return 'blue'
    if (status === 'pending') return 'orange'
    return 'gray'
  }
  
  const validateForm = () => {
    errors.value = {}
    
    if (!form.machineId) errors.value.machineId = 'Uskunani tanlang'
    if (!form.category) errors.value.category = 'Kategoriyani tanlang'
    if (!form.title) errors.value.title = 'Muammo nomini kiriting'
    if (!form.description || form.description.length < 20) {
      errors.value.description = 'Kamida 20 ta belgi kiriting'
    }
    
    return Object.keys(errors.value).length === 0
  }
  
  const submitRequest = async () => {
    if (!validateForm()) return
    
    saving.value = true
    try {
      const formData = new FormData()
      
      // Add form fields
      Object.keys(form).forEach(key => {
        if (key === 'attachments') {
          form.attachments.forEach(file => {
            formData.append('attachments[]', file)
          })
        } else if (key === 'impact' || key === 'symptoms') {
          formData.append(key, JSON.stringify(form[key]))
        } else {
          formData.append(key, form[key])
        }
      })
      
      if (isEdit.value) {
        await maintenanceStore.updateRequest(route.params.id, formData)
      } else {
        await maintenanceStore.createRequest(formData)
      }
      
      router.push({ name: 'maintenance-requests' })
    } catch (error) {
      console.error('Failed to submit request:', error)
    } finally {
      saving.value = false
    }
  }
  
  const saveDraft = async () => {
    saving.value = true
    try {
      await maintenanceStore.saveDraft({ ...form, status: 'draft' })
      router.push({ name: 'maintenance-requests' })
    } finally {
      saving.value = false
    }
  }
  
  onMounted(async () => {
    // Load machines and technicians
    machines.value = (await maintenanceStore.fetchMachines()).data
    technicians.value = (await maintenanceStore.fetchTechnicians()).data
    
    // Pre-fill machine if coming from machine details
    if (route.query.machineId) {
      form.machineId = route.query.machineId
      onMachineChange()
    }
    
    // Load existing request if editing
    if (isEdit.value) {
      const request = await maintenanceStore.fetchRequest(route.params.id)
      Object.assign(form, request)
    }
  })
  </script>