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
              {{ isEdit ? 'Smenani tahrirlash' : 'Yangi smena' }}
            </h1>
            <p class="text-gray-600 mt-1">Ishlab chiqarish smenasini yaratish</p>
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
            @click="saveShift"
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
              <!-- Shift Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Smena turi <span class="text-red-600">*</span>
                </label>
                <div class="grid grid-cols-3 gap-3">
                  <div
                    v-for="type in shiftTypes"
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
                      'font-medium text-sm',
                      form.type === type.value ? 'text-blue-900' : 'text-gray-700'
                    ]">
                      {{ type.label }}
                    </p>
                  </div>
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
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Hafta kuni
                  </label>
                  <input
                    :value="getWeekday(form.date)"
                    type="text"
                    disabled
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
  
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Boshlanish vaqti <span class="text-red-600">*</span>
                  </label>
                  <input
                    v-model="form.startTime"
                    type="time"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tugash vaqti <span class="text-red-600">*</span>
                  </label>
                  <input
                    v-model="form.endTime"
                    type="time"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
  
              <!-- Shift Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Smena nomi
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Masalan: Erta smena - A guruh"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </BaseCard>
  
          <!-- Production Line & Supervisor -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Ishlab chiqarish liniyasi</h3>
            </template>
  
            <div class="space-y-4">
              <!-- Production Line -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ishlab chiqarish liniyasi <span class="text-red-600">*</span>
                </label>
                <select
                  v-model="form.productionLineId"
                  @change="onLineChange"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Tanlang</option>
                  <option v-for="line in productionLines" :key="line.id" :value="line.id">
                    {{ line.name }}
                  </option>
                </select>
              </div>
  
              <!-- Selected Line Info -->
              <div v-if="selectedLine" class="p-4 bg-gray-50 rounded-lg">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-gray-600">Mashina soni:</p>
                    <p class="font-medium text-gray-900">{{ selectedLine.machineCount }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Sig'im:</p>
                    <p class="font-medium text-gray-900">{{ selectedLine.capacity }} dona/soat</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Holat:</p>
                    <Badge :color="selectedLine.status === 'active' ? 'green' : 'red'">
                      {{ selectedLine.status === 'active' ? 'Faol' : 'Nofaol' }}
                    </Badge>
                  </div>
                </div>
              </div>
  
              <!-- Supervisor -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nazoratchi <span class="text-red-600">*</span>
                </label>
                <select
                  v-model="form.supervisorId"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Tanlang</option>
                  <option v-for="supervisor in supervisors" :key="supervisor.id" :value="supervisor.id">
                    {{ supervisor.name }} - {{ supervisor.position }}
                  </option>
                </select>
              </div>
            </div>
          </BaseCard>
  
          <!-- Workers Assignment -->
          <BaseCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Ishchilar</h3>
                <button
                  @click="showWorkerModal = true"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Ishchi qo'shish
                </button>
              </div>
            </template>
  
            <div class="space-y-2">
              <div
                v-for="(worker, index) in form.workers"
                :key="worker.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon class="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ worker.name }}</p>
                    <p class="text-sm text-gray-600">{{ worker.position }} - {{ worker.skill }}</p>
                  </div>
                </div>
                <button
                  @click="removeWorker(index)"
                  class="text-red-600 hover:text-red-700"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
  
              <div v-if="form.workers.length === 0" class="text-center py-8 text-gray-500">
                <UserGroupIcon class="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p class="text-sm">Ishchilar qo'shing</p>
              </div>
            </div>
          </BaseCard>
  
          <!-- Production Plan -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Ishlab chiqarish rejasi</h3>
            </template>
  
            <div class="space-y-4">
              <!-- Product -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mahsulot
                </label>
                <select
                  v-model="form.productId"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Tanlang</option>
                  <option v-for="product in products" :key="product.id" :value="product.id">
                    {{ product.name }} - {{ product.sku }}
                  </option>
                </select>
              </div>
  
              <!-- Target Quantity -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Rejalashtirilgan miqdor
                  </label>
                  <input
                    v-model.number="form.targetQuantity"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Birlik
                  </label>
                  <input
                    :value="selectedProduct?.unit || 'dona'"
                    type="text"
                    disabled
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
  
              <!-- Quality Target -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sifat maqsadi (%)
                </label>
                <input
                  v-model.number="form.qualityTarget"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="95"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </BaseCard>
  
          <!-- Additional Notes -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Qo'shimcha</h3>
            </template>
  
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Izohlar
                </label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  placeholder="Qo'shimcha izohlar..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Maxsus talablar
                </label>
                <textarea
                  v-model="form.specialRequirements"
                  rows="2"
                  placeholder="Maxsus talablar yoki ehtiyotkorlik choralari..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>
            </div>
          </BaseCard>
        </div>
  
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Summary -->
          <BaseCard class="sticky top-6">
            <h3 class="text-sm font-medium text-gray-700 mb-3">Xulasa</h3>
            <div class="space-y-3 text-sm">
              <div>
                <p class="text-gray-600">Smena turi:</p>
                <Badge v-if="form.type" :color="getTypeColor(form.type)">
                  {{ getTypeText(form.type) }}
                </Badge>
              </div>
              <div v-if="form.date && form.startTime && form.endTime">
                <p class="text-gray-600">Davomiyligi:</p>
                <p class="font-medium text-gray-900">{{ calculateDuration() }} soat</p>
              </div>
              <div v-if="form.workers.length > 0">
                <p class="text-gray-600">Ishchilar:</p>
                <p class="font-medium text-gray-900">{{ form.workers.length }} kishi</p>
              </div>
              <div v-if="selectedLine">
                <p class="text-gray-600">Liniya:</p>
                <p class="font-medium text-gray-900">{{ selectedLine.name }}</p>
              </div>
              <div v-if="form.targetQuantity">
                <p class="text-gray-600">Reja:</p>
                <p class="font-medium text-gray-900">{{ form.targetQuantity }} dona</p>
              </div>
            </div>
          </BaseCard>
  
          <!-- Tips -->
          <BaseCard>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Maslahatlar</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Nazoratchi va ishchilarni tanlang</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Ishlab chiqarish rejasini kiriting</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Sifat maqsadini belgilang</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Maxsus talablarni qayd eting</p>
              </div>
            </div>
          </BaseCard>
  
          <!-- Quick Stats -->
          <BaseCard v-if="selectedLine" class="bg-blue-50 border-blue-200">
            <h3 class="text-sm font-medium text-blue-900 mb-3">Liniya ko'rsatkichlari</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-blue-700">O'rtacha unumdorlik:</span>
                <span class="font-medium text-blue-900">{{ selectedLine.avgEfficiency }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-700">Bugungi unumdorlik:</span>
                <span class="font-medium text-blue-900">{{ selectedLine.todayEfficiency }}%</span>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
  
      <!-- Worker Selection Modal -->
      <Modal v-model="showWorkerModal" title="Ishchi tanlash" size="lg">
        <div class="space-y-4">
          <input
            v-model="workerSearch"
            type="text"
            placeholder="Ishchi qidirish..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
  
          <div class="max-h-96 overflow-y-auto space-y-2">
            <div
              v-for="worker in filteredWorkers"
              :key="worker.id"
              @click="addWorker(worker)"
              :class="[
                'p-4 border rounded-lg cursor-pointer transition',
                isWorkerSelected(worker.id)
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserIcon class="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ worker.name }}</p>
                    <p class="text-sm text-gray-600">{{ worker.position }} - {{ worker.skill }}</p>
                  </div>
                </div>
                <Badge v-if="isWorkerSelected(worker.id)" color="blue">
                  Tanlangan
                </Badge>
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
  import { useProductionStore } from '@/stores/production'
  import {
    ArrowLeftIcon,
    XMarkIcon,
    UserIcon,
    UserGroupIcon,
    CheckCircleIcon,
    SunIcon,
    MoonIcon,
    ClockIcon
  } from '@heroicons/vue/24/outline'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  
  const route = useRoute()
  const router = useRouter()
  const productionStore = useProductionStore()
  
  const isEdit = computed(() => !!route.params.id)
  const saving = ref(false)
  const showWorkerModal = ref(false)
  const workerSearch = ref('')
  
  const shiftTypes = [
    { value: 'morning', label: 'Erta', icon: SunIcon },
    { value: 'afternoon', label: 'Kunduzi', icon: ClockIcon },
    { value: 'night', label: 'Kechki', icon: MoonIcon }
  ]
  
  const productionLines = ref([])
  const supervisors = ref([])
  const workers = ref([])
  const products = ref([])
  const selectedLine = ref(null)
  
  const form = reactive({
    type: 'morning',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '16:00',
    name: '',
    productionLineId: '',
    supervisorId: '',
    workers: [],
    productId: '',
    targetQuantity: 0,
    qualityTarget: 95,
    notes: '',
    specialRequirements: ''
  })
  
  const filteredWorkers = computed(() => {
    if (!workerSearch.value) return workers.value
    const query = workerSearch.value.toLowerCase()
    return workers.value.filter(w =>
      w.name.toLowerCase().includes(query) ||
      w.position.toLowerCase().includes(query)
    )
  })
  
  const selectedProduct = computed(() => {
    return products.value.find(p => p.id === form.productId)
  })
  
  const isValid = computed(() => {
    return form.type && form.date && form.startTime && form.endTime &&
           form.productionLineId && form.supervisorId
  })
  
  const getWeekday = (date) => {
    if (!date) return ''
    const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
    return days[new Date(date).getDay()]
  }
  
  const calculateDuration = () => {
    if (!form.startTime || !form.endTime) return 0
    const start = new Date(`2000-01-01T${form.startTime}`)
    const end = new Date(`2000-01-01T${form.endTime}`)
    let diff = (end - start) / (1000 * 60 * 60)
    if (diff < 0) diff += 24
    return diff.toFixed(1)
  }
  
  const getTypeColor = (type) => {
    const colors = { morning: 'blue', afternoon: 'orange', night: 'purple' }
    return colors[type] || 'gray'
  }
  
  const getTypeText = (type) => {
    const texts = { morning: 'Erta', afternoon: 'Kunduzi', night: 'Kechki' }
    return texts[type] || type
  }
  
  const onLineChange = () => {
    selectedLine.value = productionLines.value.find(l => l.id === form.productionLineId)
  }
  
  const isWorkerSelected = (workerId) => {
    return form.workers.some(w => w.id === workerId)
  }
  
  const addWorker = (worker) => {
    if (!isWorkerSelected(worker.id)) {
      form.workers.push(worker)
    }
    showWorkerModal.value = false
    workerSearch.value = ''
  }
  
  const removeWorker = (index) => {
    form.workers.splice(index, 1)
  }
  
  const saveShift = async () => {
    if (!isValid.value) return
    
    saving.value = true
    try {
      if (isEdit.value) {
        await productionStore.updateShift(route.params.id, form)
      } else {
        await productionStore.createShift(form)
      }
      router.push({ name: 'production-shifts' })
    } catch (error) {
      console.error('Failed to save shift:', error)
    } finally {
      saving.value = false
    }
  }
  
  const saveDraft = async () => {
    saving.value = true
    try {
      await productionStore.saveDraft({ ...form, status: 'draft' })
      router.push({ name: 'production-shifts' })
    } finally {
      saving.value = false
    }
  }
  
  onMounted(async () => {
    productionLines.value = (await productionStore.fetchProductionLines()).data
    supervisors.value = (await productionStore.fetchSupervisors()).data
    workers.value = (await productionStore.fetchWorkers()).data
    products.value = (await productionStore.fetchProducts()).data
    
    if (isEdit.value) {
      const shift = await productionStore.fetchShift(route.params.id)
      Object.assign(form, shift)
      onLineChange()
    }
  })
  </script>