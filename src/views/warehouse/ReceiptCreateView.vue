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
              {{ isEdit ? 'Qabulni tahrirlash' : 'Yangi qabul' }}
            </h1>
            <p class="text-gray-600 mt-1">Omborga mahsulot qabul qilish</p>
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
            @click="saveReceipt"
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
          <!-- Receipt Type & Supplier -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Asosiy ma'lumotlar</h3>
            </template>
  
            <div class="space-y-4">
              <!-- Receipt Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Qabul turi <span class="text-red-600">*</span>
                </label>
                <div class="grid grid-cols-3 gap-3">
                  <div
                    v-for="type in receiptTypes"
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
  
              <!-- Supplier Selection -->
              <div v-if="form.type === 'purchase'">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Yetkazib beruvchi <span class="text-red-600">*</span>
                </label>
                <div class="flex space-x-2">
                  <select
                    v-model="form.supplierId"
                    @change="onSupplierChange"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    :required="form.type === 'purchase'"
                  >
                    <option value="">Tanlang</option>
                    <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                      {{ supplier.name }}
                    </option>
                  </select>
                  <button
                    @click="showAddSupplierModal = true"
                    class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    + Yangi
                  </button>
                </div>
  
                <!-- Selected Supplier Info -->
                <div v-if="selectedSupplier" class="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <span class="text-gray-600">Telefon:</span>
                      <span class="font-medium text-gray-900 ml-2">{{ selectedSupplier.phone }}</span>
                    </div>
                    <div>
                      <span class="text-gray-600">Email:</span>
                      <span class="font-medium text-gray-900 ml-2">{{ selectedSupplier.email }}</span>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Receipt Date & Number -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Qabul sanasi <span class="text-red-600">*</span>
                  </label>
                  <input
                    v-model="form.receiptDate"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Hujjat raqami
                  </label>
                  <input
                    v-model="form.documentNumber"
                    type="text"
                    placeholder="Masalan: INV-2024-001"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
  
              <!-- Warehouse Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ombor <span class="text-red-600">*</span>
                </label>
                <select
                  v-model="form.warehouseId"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Tanlang</option>
                  <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                    {{ warehouse.name }}
                  </option>
                </select>
              </div>
            </div>
          </BaseCard>
  
          <!-- Items -->
          <BaseCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Mahsulotlar</h3>
                <button
                  @click="showProductModal = true"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Mahsulot qo'shish
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
                  <div class="flex-1 grid grid-cols-12 gap-4">
                    <!-- Product Info -->
                    <div class="col-span-4">
                      <p class="font-medium text-gray-900">{{ item.product.name }}</p>
                      <p class="text-sm text-gray-600">SKU: {{ item.product.sku }}</p>
                      <p class="text-xs text-gray-500 mt-1">
                        Hozirgi qoldiq: {{ item.product.currentStock }} {{ item.product.unit }}
                      </p>
                    </div>
  
                    <!-- Quantity -->
                    <div class="col-span-2">
                      <label class="block text-xs text-gray-600 mb-1">Miqdor <span class="text-red-600">*</span></label>
                      <input
                        v-model.number="item.quantity"
                        @input="updateItemTotal(index)"
                        type="number"
                        min="1"
                        step="0.01"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        required
                      />
                    </div>
  
                    <!-- Unit Price -->
                    <div class="col-span-2">
                      <label class="block text-xs text-gray-600 mb-1">Birlik narxi</label>
                      <input
                        v-model.number="item.unitPrice"
                        @input="updateItemTotal(index)"
                        type="number"
                        min="0"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
  
                    <!-- Total -->
                    <div class="col-span-2">
                      <label class="block text-xs text-gray-600 mb-1">Jami</label>
                      <p class="text-lg font-bold text-gray-900 mt-2">
                        {{ formatCurrency(item.total) }}
                      </p>
                    </div>
  
                    <!-- Location -->
                    <div class="col-span-2">
                      <label class="block text-xs text-gray-600 mb-1">Joylashuv</label>
                      <input
                        v-model="item.location"
                        type="text"
                        placeholder="A-01-03"
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
  
                <!-- Quality Check -->
                <div class="mt-3 pt-3 border-t">
                  <div class="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <label class="flex items-center space-x-2">
                        <input
                          v-model="item.qualityChecked"
                          type="checkbox"
                          class="rounded border-gray-300"
                        />
                        <span class="text-gray-700">Sifat tekshirildi</span>
                      </label>
                    </div>
                    <div v-if="item.qualityChecked">
                      <select
                        v-model="item.qualityStatus"
                        class="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="passed">Qabul qilindi</option>
                        <option value="rejected">Rad etildi</option>
                        <option value="conditional">Shartli</option>
                      </select>
                    </div>
                    <div v-if="item.qualityChecked">
                      <input
                        v-model="item.qualityNotes"
                        type="text"
                        placeholder="Izoh..."
                        class="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Empty State -->
              <div v-if="form.items.length === 0" class="text-center py-8 text-gray-500">
                <CubeIcon class="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p class="text-sm">Mahsulot qo'shing</p>
              </div>
            </div>
          </BaseCard>
  
          <!-- Additional Information -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Qo'shimcha</h3>
            </template>
  
            <div class="space-y-4">
              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Izoh
                </label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  placeholder="Qo'shimcha ma'lumotlar..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>
  
              <!-- Attachments -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Hujjatlar
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
                <span class="text-gray-600">Qabul turi:</span>
                <Badge :color="form.type === 'purchase' ? 'blue' : form.type === 'return' ? 'orange' : 'purple'">
                  {{ getReceiptTypeText(form.type) }}
                </Badge>
              </div>
  
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Mahsulotlar:</span>
                <span class="font-medium text-gray-900">{{ form.items.length }} ta</span>
              </div>
  
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Jami miqdor:</span>
                <span class="font-medium text-gray-900">{{ totalQuantity }}</span>
              </div>
  
              <div class="pt-3 border-t">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-semibold text-gray-900">Jami summa:</span>
                  <span class="text-2xl font-bold text-blue-600">{{ formatCurrency(grandTotal) }}</span>
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
                <p>Mahsulotlarni to'g'ri tanlang</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Miqdorlarni aniq kiriting</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Sifatni tekshiring</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Joylashuvni belgilang</p>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
  
      <!-- Product Selection Modal -->
      <Modal v-model="showProductModal" title="Mahsulot tanlash" size="lg">
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
                <div>
                  <p class="font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-sm text-gray-600">{{ product.sku }}</p>
                  <p class="text-xs text-gray-500 mt-1">Qoldiq: {{ product.currentStock }} {{ product.unit }}</p>
                </div>
                <p class="text-lg font-bold text-gray-900">{{ formatCurrency(product.price) }}</p>
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
    DocumentPlusIcon,
    DocumentIcon,
    TruckIcon,
    ArrowUturnLeftIcon,
    ArrowsRightLeftIcon
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
  const showAddSupplierModal = ref(false)
  const productSearch = ref('')
  
  const receiptTypes = [
    { value: 'purchase', label: 'Xarid', icon: TruckIcon },
    { value: 'return', label: 'Qaytarish', icon: ArrowUturnLeftIcon },
    { value: 'transfer', label: 'O\'tkazma', icon: ArrowsRightLeftIcon }
  ]
  
  const suppliers = ref([])
  const products = ref([])
  const warehouses = ref([])
  const selectedSupplier = ref(null)
  
  const form = reactive({
    type: 'purchase',
    supplierId: '',
    receiptDate: new Date().toISOString().split('T')[0],
    documentNumber: '',
    warehouseId: '',
    items: [],
    notes: '',
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
  
  const grandTotal = computed(() => {
    return form.items.reduce((sum, item) => sum + (item.total || 0), 0)
  })
  
  const isValid = computed(() => {
    return form.receiptDate && form.warehouseId && form.items.length > 0 &&
           (form.type !== 'purchase' || form.supplierId)
  })
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', minimumFractionDigits: 0 }).format(value)
  }
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }
  
  const getReceiptTypeText = (type) => {
    return { purchase: 'Xarid', return: 'Qaytarish', transfer: 'O\'tkazma' }[type] || type
  }
  
  const onSupplierChange = () => {
    selectedSupplier.value = suppliers.value.find(s => s.id === form.supplierId)
  }
  
  const addProduct = (product) => {
    const item = {
      id: Date.now(),
      product: product,
      quantity: 1,
      unitPrice: product.price || 0,
      total: product.price || 0,
      location: '',
      qualityChecked: false,
      qualityStatus: 'passed',
      qualityNotes: ''
    }
    form.items.push(item)
    showProductModal.value = false
    productSearch.value = ''
  }
  
  const removeItem = (index) => {
    form.items.splice(index, 1)
  }
  
  const updateItemTotal = (index) => {
    const item = form.items[index]
    item.total = (item.quantity || 0) * (item.unitPrice || 0)
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
  
  const saveReceipt = async () => {
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
        await warehouseStore.updateReceipt(route.params.id, formData)
      } else {
        await warehouseStore.createReceipt(formData)
      }
      
      router.push({ name: 'warehouse-receipts' })
    } catch (error) {
      console.error('Failed to save receipt:', error)
    } finally {
      saving.value = false
    }
  }
  
  const saveDraft = async () => {
    saving.value = true
    try {
      await warehouseStore.saveDraft({ ...form, status: 'draft' })
      router.push({ name: 'warehouse-receipts' })
    } finally {
      saving.value = false
    }
  }
  
  onMounted(async () => {
    suppliers.value = (await warehouseStore.fetchSuppliers()).data
    products.value = (await warehouseStore.fetchProducts()).data
    warehouses.value = (await warehouseStore.fetchWarehouses()).data
    
    if (isEdit.value) {
      const receipt = await warehouseStore.fetchReceipt(route.params.id)
      Object.assign(form, receipt)
      onSupplierChange()
    }
  })
  </script>