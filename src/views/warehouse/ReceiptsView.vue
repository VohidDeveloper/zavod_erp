<template>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Qabul qilish</h1>
          <p class="text-gray-600 mt-1">Tovarlarni omborda qabul qilish</p>
        </div>
        <button
          @click="openReceiveModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Yangi qabul
        </button>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Bugungi qabullar" :value="stats.today" color="blue" />
        <StatCard title="Bu oylik" :value="stats.thisMonth" color="green" />
        <StatCard title="Jami qiymat" :value="formatCurrency(stats.totalValue)" color="purple" />
      </div>
  
      <BaseCard>
        <template #header>
          <h3 class="text-lg font-semibold">Qabul qilish tarixi</h3>
        </template>
        
        <DataTable :data="receipts" :columns="columns" :loading="loading">
          <template #status="{ row }">
            <StatusBadge :status="row.status" />
          </template>
          <template #actions="{ row }">
            <button @click="viewReceipt(row)" class="text-blue-600 hover:text-blue-700">
              Ko'rish
            </button>
          </template>
        </DataTable>
  
        <Pagination v-model="pagination.page" :total="pagination.total" :per-page="pagination.perPage" />
      </BaseCard>
  
      <Modal v-model="showModal" title="Qabul qilish" size="xl">
        <form @submit.prevent="saveReceipt" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Yetkazib beruvchi</label>
              <select v-model="form.supplier_id" class="w-full px-4 py-2 border rounded-lg" required>
                <option value="">Tanlang</option>
                <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sana</label>
              <input v-model="form.date" type="date" class="w-full px-4 py-2 border rounded-lg" required>
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mahsulotlar</label>
            <div v-for="(item, index) in form.items" :key="index" class="flex gap-2 mb-2">
              <select v-model="item.product_id" class="flex-1 px-4 py-2 border rounded-lg" required>
                <option value="">Mahsulot tanlang</option>
                <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
              <input v-model.number="item.quantity" type="number" placeholder="Miqdor" class="w-32 px-4 py-2 border rounded-lg" required>
              <input v-model.number="item.price" type="number" placeholder="Narx" class="w-32 px-4 py-2 border rounded-lg" required>
              <button type="button" @click="removeItem(index)" class="text-red-600 px-2">
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>
            <button type="button" @click="addItem" class="text-blue-600 text-sm hover:text-blue-700">
              + Mahsulot qo'shish
            </button>
          </div>
  
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showModal = false" class="px-4 py-2 border rounded-lg">Bekor qilish</button>
            <button type="submit" :disabled="saving" class="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {{ saving ? 'Saqlanmoqda...' : 'Saqlash' }}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useWarehouseStore } from '@/stores/warehouse'
  import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline'
  
  const warehouseStore = useWarehouseStore()
  const loading = ref(false)
  const saving = ref(false)
  const showModal = ref(false)
  const receipts = ref([])
  const suppliers = ref([])
  const products = ref([])
  
  const stats = ref({ today: 0, thisMonth: 0, totalValue: 0 })
  const pagination = reactive({ page: 1, perPage: 10, total: 0 })
  
  const form = reactive({
    supplier_id: '',
    date: new Date().toISOString().split('T')[0],
    items: [{ product_id: '', quantity: 0, price: 0 }]
  })
  
  const columns = [
    { key: 'id', label: '#' },
    { key: 'date', label: 'Sana' },
    { key: 'supplier', label: 'Yetkazib beruvchi' },
    { key: 'items_count', label: 'Mahsulotlar' },
    { key: 'total', label: 'Jami' },
    { key: 'status', label: 'Holat', slot: true },
    { key: 'actions', label: '', slot: true }
  ]
  
  const openReceiveModal = () => {
    form.items = [{ product_id: '', quantity: 0, price: 0 }]
    showModal.value = true
  }
  
  const addItem = () => {
    form.items.push({ product_id: '', quantity: 0, price: 0 })
  }
  
  const removeItem = (index) => {
    form.items.splice(index, 1)
  }
  
  const saveReceipt = async () => {
    saving.value = true
    try {
      await warehouseStore.createReceiving(form)
      showModal.value = false
      loadReceipts()
    } finally {
      saving.value = false
    }
  }
  
  const loadReceipts = async () => {
    loading.value = true
    try {
      const response = await warehouseStore.fetchReceivings({ page: pagination.page })
      receipts.value = response.data
      pagination.total = response.total
    } finally {
      loading.value = false
    }
  }
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', minimumFractionDigits: 0 }).format(value)
  }
  
  onMounted(async () => {
    loadReceipts()
    suppliers.value = (await warehouseStore.fetchSuppliers()).data
    products.value = (await warehouseStore.fetchProducts()).data
  })
  </script>