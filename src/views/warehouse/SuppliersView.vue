<template>
    <div class="space-y-6">
      <div class="flex justify-between">
        <h1 class="text-2xl font-bold">Yetkazib beruvchilar</h1>
        <button @click="openModal" class="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Yangi</button>
      </div>
  
      <div class="grid md:grid-cols-3 gap-6">
        <StatCard title="Jami" :value="stats.total" color="blue" />
        <StatCard title="Faol" :value="stats.active" color="green" />
        <StatCard title="Bu oylik xaridlar" :value="formatCurrency(stats.purchases)" color="purple" />
      </div>
  
      <BaseCard>
        <div class="mb-4">
          <input v-model="search" placeholder="Qidirish..." class="w-full px-4 py-2 border rounded-lg">
        </div>
        <DataTable :data="suppliers" :columns="columns" :loading="loading">
          <template #status="{ row }">
            <Badge :color="row.status === 'active' ? 'green' : 'gray'">
              {{ row.status === 'active' ? 'Faol' : 'Nofaol' }}
            </Badge>
          </template>
          <template #actions="{ row }">
            <button @click="edit(row)" class="text-blue-600 mr-2">Tahrirlash</button>
            <button @click="remove(row)" class="text-red-600">O'chirish</button>
          </template>
        </DataTable>
      </BaseCard>
  
      <Modal v-model="showModal" :title="editMode ? 'Tahrirlash' : 'Yangi yetkazib beruvchi'">
        <form @submit.prevent="save" class="space-y-4">
          <input v-model="form.name" placeholder="Nomi" class="w-full px-4 py-2 border rounded-lg" required>
          <input v-model="form.contact" placeholder="Kontakt" class="w-full px-4 py-2 border rounded-lg">
          <input v-model="form.phone" placeholder="Telefon" class="w-full px-4 py-2 border rounded-lg">
          <input v-model="form.email" type="email" placeholder="Email" class="w-full px-4 py-2 border rounded-lg">
          <textarea v-model="form.address" placeholder="Manzil" class="w-full px-4 py-2 border rounded-lg" rows="2"></textarea>
          <div class="flex justify-end gap-2">
            <button type="button" @click="showModal = false" class="px-4 py-2 border rounded-lg">Bekor qilish</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg">Saqlash</button>
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
  const editMode = ref(false)
  const suppliers = ref([])
  const search = ref('')
  const stats = ref({ total: 0, active: 0, purchases: 0 })
  
  const form = reactive({ name: '', contact: '', phone: '', email: '', address: '' })
  
  const columns = [
    { key: 'name', label: 'Nomi' },
    { key: 'contact', label: 'Kontakt' },
    { key: 'phone', label: 'Telefon' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Holat', slot: true },
    { key: 'actions', label: '', slot: true }
  ]
  
  const openModal = () => { showModal.value = true; editMode.value = false }
  const formatCurrency = (v) => new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS' }).format(v)
  
  onMounted(async () => {
    suppliers.value = (await store.fetchSuppliers()).data
  })
  </script>