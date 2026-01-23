<template>
    <div class="space-y-6">
      <div class="flex justify-between">
        <h1 class="text-2xl font-bold">Tovar so'rovlari</h1>
        <button @click="createRequest" class="bg-blue-600 text-white px-4 py-2 rounded-lg">
          + Yangi so'rov
        </button>
      </div>
  
      <div class="grid md:grid-cols-3 gap-6">
        <StatCard title="Jarayonda" :value="stats.pending" color="blue" />
        <StatCard title="Tasdiqlangan" :value="stats.approved" color="green" />
        <StatCard title="Rad etilgan" :value="stats.rejected" color="red" />
      </div>
  
      <BaseCard>
        <DataTable :data="requests" :columns="requestColumns" :loading="loading">
          <template #status="{ row }">
            <StatusBadge :status="row.status" />
          </template>
          <template #actions="{ row }">
            <button @click="approve(row)" v-if="row.status === 'pending'" class="text-green-600 mr-2">Tasdiqlash</button>
            <button @click="reject(row)" v-if="row.status === 'pending'" class="text-red-600">Rad etish</button>
          </template>
        </DataTable>
      </BaseCard>
  
      <Modal v-model="showModal" title="Yangi so'rov">
        <form @submit.prevent="saveRequest" class="space-y-4">
          <select v-model="form.product_id" class="w-full px-4 py-2 border rounded-lg" required>
            <option value="">Mahsulot tanlang</option>
            <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
          <input v-model.number="form.quantity" type="number" placeholder="Miqdor" class="w-full px-4 py-2 border rounded-lg" required>
          <textarea v-model="form.notes" placeholder="Izoh" class="w-full px-4 py-2 border rounded-lg" rows="3"></textarea>
          <div class="flex justify-end gap-2">
            <button type="button" @click="showModal = false" class="px-4 py-2 border rounded-lg">Bekor qilish</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg">Yuborish</button>
          </div>
        </form>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useWarehouseStore } from '@/stores/warehouse'
  
  const store = useWarehouseStore()
  const loading = ref(false)
  const showModal = ref(false)
  const requests = ref([])
  const products = ref([])
  const stats = ref({ pending: 0, approved: 0, rejected: 0 })
  
  const form = reactive({ product_id: '', quantity: 0, notes: '' })
  
  const requestColumns = [
    { key: 'id', label: '#' },
    { key: 'product', label: 'Mahsulot' },
    { key: 'quantity', label: 'Miqdor' },
    { key: 'requested_by', label: 'So\'rovchi' },
    { key: 'date', label: 'Sana' },
    { key: 'status', label: 'Holat', slot: true },
    { key: 'actions', label: '', slot: true }
  ]
  
  const createRequest = () => { showModal.value = true }
  
  onMounted(async () => {
    requests.value = (await store.fetchPurchaseOrders()).data
    products.value = (await store.fetchProducts()).data
  })
  </script>