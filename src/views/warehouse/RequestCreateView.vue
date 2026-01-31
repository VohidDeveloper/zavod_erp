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
              {{ isEdit ? 'So\'rovni tahrirlash' : 'Yangi so\'rov' }}
            </h1>
            <p class="text-gray-600 mt-1">Material so'rovi yaratish</p>
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
            @click="saveRequest"
            :disabled="saving || !isValid"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? 'Saqlanmoqda...' : 'Yuborish' }}
          </button>
        </div>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Request Type & Priority -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Asosiy ma'lumotlar</h3>
            </template>
  
            <div class="space-y-4">
              <!-- Request Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  So'rov turi <span class="text-red-600">*</span>
                </label>
                <div class="grid grid-cols-3 gap-3">
                  <div
                    v-for="type in requestTypes"
                    :key="type.value"
                    @click="form.type = type.value"
                    :class="[
                      'p-4 border-2 rounded-lg cursor-pointer transition text-center',
                      form.type === type.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    ]"
                  >
                    <component 
                      :is="type.icon" 
                      :class="[
                        'w-8 h-8 mx-auto mb-2',
                        form.type === type.value ? 'text-blue-600' : 'text-gray-400'
                      ]" 
                    />
                    <p :class="[
                      'text-sm font-medium',
                      form.type === type.value ? 'text-blue-900' : 'text-gray-700'
                    ]">
                      {{ type.label }}
                    </p>
                  </div>
                </div>
              </div>
  
              <!-- Priority -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Muhimlik darajasi <span class="text-red-600">*</span>
                </label>
                <div class="grid grid-cols-3 gap-3">
                  <div
                    v-for="priority in priorities"
                    :key="priority.value"
                    @click="form.priority = priority.value"
                    :class="[
                      'p-3 border-2 rounded-lg cursor-pointer transition text-center',
                      form.priority === priority.value
                        ? `border-${priority.color}-500 bg-${priority.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <p :class="[
                      'text-sm font-medium',
                      form.priority === priority.value ? `text-${priority.color}-900` : 'text-gray-700'
                    ]">
                      {{ priority.label }}
                    </p>
                  </div>
                </div>
              </div>
  
              <!-- Department & Required Date -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Bo'lim <span class="text-red-600">*</span>
                  </label>
                  <select
                    v-model="form.departmentId"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Tanlang</option>
                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                      {{ dept.name }}
                    </option>
                  </select>
                </div>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Kerak bo'lish sanasi
                  </label>
                  <input
                    v-model="form.requiredDate"
                    type="date"
                    :min="new Date().toISOString().split('T')[0]"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
  
              <!-- Purpose -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Maqsad <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="form.purpose"
                  type="text"
                  placeholder="Masalan: Ishlab chiqarish uchun zarur"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
          </BaseCard>
  
          <!-- Requested Items -->
          <BaseCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">So'ralgan materiallar</h3>
                <button
                  @click="showProductModal = true"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Material qo'shish
                </button>
              </div>
            </template>
  
            <div class="space-y-3">
              <div
                v-for="(item, index) in form.items"
                :key="item.id"
                class="p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex items-start space-x-4">
                  <div class="flex-1">
                    <div class="flex items-start justify-between mb-3">
                      <div>
                        <p class="font-medium text-gray-900">{{ item.product.name }}</p>
                        <p class="text-sm text-gray-600">SKU: {{ item.product.sku }}</p>
                        <div class="flex items-center space-x-2 mt-1">
                          <p class="text-xs text-gray-500">
                            Omborda: {{ item.product.availableStock }} {{ item.product.unit }}
                          </p>
                          <Badge 
                            v-if="item.product.availableStock <= item.product.minStock" 
                            color="orange" 
                            size="sm"
                          >
                            Kam
                          </Badge>
                        </div>
                      </div>
                    </div>
  
                    <div class="grid grid-cols-12 gap-4">
                      <!-- Quantity -->
                      <div class="col-span-3">
                        <label class="block text-xs text-gray-600 mb-1">
                          Miqdor <span class="text-red-600">*</span>
                        </label>
                        <input
                          v-model.number="item.quantity"
                          type="number"
                          min="1"
                          step="0.01"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          required
                        />
                      </div>
  
                      <!-- Unit -->
                      <div class="col-span-2">
                        <label class="block text-xs text-gray-600 mb-1">O'lchov</label>
                        <input
                          v-model="item.product.unit"
                          type="text"
                          readonly
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                        />
                      </div>
  
                      <!-- Available -->
                      <div class="col-span-3">
                        <label class="block text-xs text-gray-600 mb-1">Mavjud</label>
                        <p :class="[
                          'text-sm font-medium mt-2',
                          item.quantity > item.product.availableStock ? 'text-red-600' : 'text-green-600'
                        ]">
                          {{ item.product.availableStock }} {{ item.product.unit }}
                        </p>
                      </div>
  
                      <!-- Status -->
                      <div class="col-span-4">
                        <label class="block text-xs text-gray-600 mb-1">Holat</label>
                        <Badge 
                          :color="item.quantity > item.product.availableStock ? 'red' : 'green'"
                          class="mt-1"
                        >
                          {{ item.quantity > item.product.availableStock ? 'Yetarli emas' : 'Mavjud' }}
                        </Badge>
                      </div>
                    </div>
  
                    <!-- Item Notes -->
                    <div class="mt-3">
                      <input
                        v-model="item.notes"
                        type="text"
                        placeholder="Izoh (ixtiyoriy)..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
  
                  <!-- Remove Button -->
                  <button
                    @click="removeItem(index)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
  
              <!-- Empty State -->
              <div v-if="form.items.length === 0" class="text-center py-8 text-gray-500">
                <CubeIcon class="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p class="text-sm">Material qo'shing</p>
              </div>
            </div>
          </BaseCard>
  
          <!-- Additional Information -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Qo'shimcha ma'lumotlar</h3>
            </template>
  
            <div class="space-y-4">
              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Batafsil tavsif
                </label>
                <textarea
                  v-model="form.description"
                  rows="4"
                  placeholder="So'rov haqida qo'shimcha ma'lumot..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>
  
              <!-- Attachments -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Qo'shimcha fayllar
                </label>
                <div
                  @drop.prevent="handleFileDrop"
                  @dragover.prevent
                  class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer"
                  @click="$refs.fileInput.click()"
                >
                  <DocumentPlusIcon class="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p class="text-sm text-gray-600">Fayllarni shu yerga tashlang</p>
                  <input
                    ref="fileInput"
                    type="file"
                    multiple
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
          <!-- Summary -->
          <BaseCard class="sticky top-6">
            <h3 class="text-lg font-semibold mb-4">Xulasa</h3>
            
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">So'rov turi:</span>
                <Badge :color="getTypeColor(form.type)">
                  {{ getTypeText(form.type) }}
                </Badge>
              </div>
  
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Muhimlik:</span>
                <Badge :color="getPriorityColor(form.priority)">
                  {{ getPriorityText(form.priority) }}
                </Badge>
              </div>
  
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Materiallar:</span>
                <span class="font-medium text-gray-900">{{ form.items.length }} ta</span>
              </div>
  
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Jami miqdor:</span>
                <span class="font-medium text-gray-900">{{ totalQuantity }}</span>
              </div>
  
              <!-- Warnings -->
              <div v-if="insufficientItems.length > 0" class="pt-3 border-t">
                <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div class="flex items-start space-x-2">
                    <ExclamationTriangleIcon class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p class="text-sm font-medium text-red-900">Yetarli emas</p>
                      <p class="text-xs text-red-800">
                        {{ insufficientItems.length }} ta material omborda yetarli emas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
  
          <!-- Tips -->
          <BaseCard>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Maslahatlar</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Muhimlik darajasini to'g'ri belgilang</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Kerak bo'lish sanasini kiriting</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Aniq miqdorlarni ko'rsating</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Maqsadni batafsil yozing</p>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
  
      <!-- Product Selection Modal -->
      <Modal v-model="showProductModal" title="Material tanlash" size="lg">
        <div class="space-y-4">
          <input
            v-model="productSearch"
            type="text"
            placeholder="Qidirish..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
  
          <div class="max-h-96 overflow-y-auto space-y-2">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              @click="addProduct(product)"
              class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-sm text-gray-600">{{ product.sku }}</p>
                  <div class="flex items-center space-x-2 mt-1">
                    <p class="text-xs text-gray-500">
                      Omborda: {{ product.availableStock }} {{ product.unit }}
                    </p>
                    <Badge 
                      v-if="product.availableStock <= product.minStock" 
                      color="orange" 
                      size="sm"
                    >
                      Kam
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useWarehouseStore } from '@/stores/warehouse'
  import {
    ArrowLeftIcon,
    XMarkIcon,
    CubeIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    DocumentPlusIcon,
    DocumentIcon,
    ClipboardDocumentListIcon,
    WrenchScrewdriverIcon,
    ShoppingCartIcon
  } from '@heroicons/vue/24/outline'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  
  const route = useRoute()
  const router = useRouter()
  const warehouseStore = useWarehouseStore()
  
  const isEdit = computed(() => !!route.params.id)
  const saving = ref(false)
  const showProductModal = ref(false)
  const productSearch = ref('')
  
  const requestTypes = [
    { value: 'production', label: 'Ishlab chiqarish', icon: ClipboardDocumentListIcon },
    { value: 'maintenance', label: 'Texnik xizmat', icon: WrenchScrewdriverIcon },
    { value: 'office', label: 'Ofis', icon: ShoppingCartIcon }
  ]
  
  const priorities = [
    { value: 'low', label: 'Past', color: 'gray' },
    { value: 'medium', label: 'O\'rtacha', color: 'blue' },
    { value: 'high', label: 'Yuqori', color: 'red' }
  ]
  
  const departments = ref([])
  const products = ref([])
  
  const form = reactive({
    type: 'production',
    priority: 'medium',
    departmentId: '',
    requiredDate: '',
    purpose: '',
    description: '',
    items: [],
    files: []
  })
  
  const filteredProducts = computed(() => {
    if (!productSearch.value) return products.value
    const query = productSearch.value.toLowerCase()
    return products.value.filter(p =>
      p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)
    )
  })
  
  const totalQuantity = computed(() => {
    return form.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
  })
  
  const insufficientItems = computed(() => {
    return form.items.filter(item => item.quantity > item.product.availableStock)
  })
  
  const isValid = computed(() => {
    return form.type && form.priority && form.departmentId && 
           form.purpose && form.items.length > 0
  })
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }
  
  const getTypeColor = (type) => {
    return { production: 'blue', maintenance: 'orange', office: 'purple' }[type] || 'gray'
  }
  
  const getTypeText = (type) => {
    return { production: 'Ishlab chiqarish', maintenance: 'Texnik xizmat', office: 'Ofis' }[type] || type
  }
  
  const getPriorityColor = (priority) => {
    return { low: 'gray', medium: 'blue', high: 'red' }[priority] || 'gray'
  }
  
  const getPriorityText = (priority) => {
    return { low: 'Past', medium: 'O\'rtacha', high: 'Yuqori' }[priority] || priority
  }
  
  const addProduct = (product) => {
    const existingItem = form.items.find(item => item.product.id === product.id)
    
    if (existingItem) {
      existingItem.quantity++
    } else {
      form.items.push({
        id: Date.now(),
        product: product,
        quantity: 1,
        notes: ''
      })
    }
    
    showProductModal.value = false
    productSearch.value = ''
  }
  
  const removeItem = (index) => {
    form.items.splice(index, 1)
  }
  
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    form.files.push(...files)
  }
  
  const handleFileDrop = (event) => {
    const files = Array.from(event.dataTransfer.files)
    form.files.push(...files)
  }
  
  const removeFile = (index) => {
    form.files.splice(index, 1)
  }
  
  const saveRequest = async () => {
    if (!isValid.value) return
    
    saving.value = true
    try {
      const formData = new FormData()
      Object.keys(form).forEach(key => {
        if (key !== 'files') {
          formData.append(key, Array.isArray(form[key]) ? JSON.stringify(form[key]) : form[key])
        }
      })
      form.files.forEach((file, i) => formData.append(`files[${i}]`, file))
      
      if (isEdit.value) {
        await warehouseStore.updateRequest(route.params.id, formData)
      } else {
        await warehouseStore.createRequest(formData)
      }
      
      router.push({ name: 'warehouse-requests' })
    } catch (error) {
      console.error('Failed to save request:', error)
    } finally {
      saving.value = false
    }
  }
  
  const saveDraft = async () => {
    saving.value = true
    try {
      await warehouseStore.saveDraft({ ...form, status: 'draft' })
      router.push({ name: 'warehouse-requests' })
    } finally {
      saving.value = false
    }
  }
  
  onMounted(async () => {
    departments.value = (await warehouseStore.fetchDepartments()).data
    products.value = (await warehouseStore.fetchProducts()).data
    
    if (isEdit.value) {
      const request = await warehouseStore.fetchRequest(route.params.id)
      Object.assign(form, request)
    }
  })
  </script>