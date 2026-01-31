<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Uskunalar</h1>
          <p class="text-gray-600 mt-1">Ishlab chiqarish uskunalari boshqaruvi</p>
        </div>
        <button
          v-if="can('CREATE_MACHINE')"
          @click="openCreateModal"
          class="btn-primary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Yangi uskuna
        </button>
      </div>
  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Jami uskunalar</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Ishlamoqda</p>
              <p class="text-2xl font-bold text-success-600 mt-2">{{ stats.operational }}</p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-gray-500">
              {{ ((stats.operational / stats.total) * 100).toFixed(1) }}% barcha uskunalardan
            </span>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Ta'mirlashda</p>
              <p class="text-2xl font-bold text-warning-600 mt-2">{{ stats.under_maintenance }}</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Ishlamayapti</p>
              <p class="text-2xl font-bold text-danger-600 mt-2">{{ stats.broken }}</p>
            </div>
            <div class="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Qidirish..."
            class="input"
            @input="debouncedFetch"
          />
          <select v-model="filters.type" class="input" @change="fetchMachines">
            <option value="">Barcha turlar</option>
            <option value="production">Ishlab chiqarish</option>
            <option value="packaging">Qadoqlash</option>
            <option value="transport">Transport</option>
            <option value="other">Boshqa</option>
          </select>
          <select v-model="filters.status" class="input" @change="fetchMachines">
            <option value="">Barcha holatlar</option>
            <option value="operational">Ishlamoqda</option>
            <option value="under_maintenance">Ta'mirlashda</option>
            <option value="broken">Ishlamayapti</option>
          </select>
          <select v-model="filters.sort" class="input" @change="fetchMachines">
            <option value="name">Nomi (A-Z)</option>
            <option value="-name">Nomi (Z-A)</option>
            <option value="-purchase_date">Xarid (yangi)</option>
            <option value="purchase_date">Xarid (eski)</option>
          </select>
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Tozalash
          </button>
        </div>
      </div>
  
      <!-- Machines Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <template v-if="loading">
          <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow animate-pulse">
            <div class="h-32 bg-gray-200 rounded-t-lg"></div>
            <div class="p-6 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </template>
  
        <div
          v-else-if="!machines.length"
          class="col-span-full bg-white rounded-lg shadow p-12 text-center"
        >
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <p class="text-gray-500">Uskunalar topilmadi</p>
        </div>
  
        <div
          v-else
          v-for="machine in machines"
          :key="machine.id"
          class="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
          @click="viewMachine(machine)"
        >
          <div class="h-32 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center relative">
            <svg class="w-20 h-20 text-primary-300 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span
              class="absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusBadgeClass(machine.status)"
            >
              {{ formatStatus(machine.status) }}
            </span>
          </div>
          <div class="p-6">
            <h3 class="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
              {{ machine.name }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">{{ machine.code }}</p>
            <div class="mt-4 space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Turi:</span>
                <span class="font-medium text-gray-900">{{ formatType(machine.type) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Oxirgi TA:</span>
                <span class="font-medium text-gray-900">
                  {{ machine.last_maintenance ? formatDate(machine.last_maintenance) : 'Yo\'q' }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Keyingi TA:</span>
                <span class="font-medium" :class="getNextMaintenanceClass(machine.next_maintenance)">
                  {{ machine.next_maintenance ? formatDate(machine.next_maintenance) : 'Belgilanmagan' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modals -->
      <MachineModal
        v-if="showModal"
        :machine="selectedMachine"
        @close="closeModal"
        @saved="handleSaved"
      />
  
      <MachineDetailsModal
        v-if="showDetailsModal"
        :machine="selectedMachine"
        @close="showDetailsModal = false"
        @edit="editMachine"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useMaintenanceStore } from '@/stores/maintenance'
  import { usePermissions } from '@/composables/usePermissions'
  import { useNotifications } from '@/composables/useNotifications'
  import { formatDate, formatStatus } from '@/utils/formatters'
  import { createDebounce } from '@/utils/helpers'
  import MachineModal from '@/components/maintenance/modals/MachineModal.vue'
  import MachineDetailsModal from '@/components/maintenance/modals/MachineDetailsModal.vue'
  
  const maintenanceStore = useMaintenanceStore()
  const { can } = usePermissions()
  const notifications = useNotifications()
  
  const filters = reactive({
    search: '',
    type: '',
    status: '',
    sort: 'name',
  })
  
  const stats = ref({
    total: 0,
    operational: 0,
    under_maintenance: 0,
    broken: 0,
  })
  
  const machines = ref([])
  const loading = ref(false)
  const showModal = ref(false)
  const showDetailsModal = ref(false)
  const selectedMachine = ref(null)
  
  const hasActiveFilters = computed(() => {
    return filters.search || filters.type || filters.status
  })
  
  const debouncedFetch = createDebounce(fetchMachines, 500)
  
  onMounted(() => {
    fetchMachines()
  })
  
  async function fetchMachines() {
    loading.value = true
    try {
      await maintenanceStore.fetchMachines(filters)
      machines.value = maintenanceStore.machines
      
      // Calculate stats
      stats.value = {
        total: machines.value.length,
        operational: machines.value.filter(m => m.status === 'operational').length,
        under_maintenance: machines.value.filter(m => m.status === 'under_maintenance').length,
        broken: machines.value.filter(m => m.status === 'broken').length,
      }
    } catch (error) {
      notifications.apiError(error)
    } finally {
      loading.value = false
    }
  }
  
  function clearFilters() {
    Object.keys(filters).forEach(key => {
      if (key !== 'sort') filters[key] = ''
    })
    fetchMachines()
  }
  
  function openCreateModal() {
    selectedMachine.value = null
    showModal.value = true
  }
  
  function closeModal() {
    showModal.value = false
    selectedMachine.value = null
  }
  
  function viewMachine(machine) {
    selectedMachine.value = machine
    showDetailsModal.value = true
  }
  
  function editMachine(machine) {
    selectedMachine.value = machine
    showDetailsModal.value = false
    showModal.value = true
  }
  
  function handleSaved() {
    closeModal()
    fetchMachines()
  }
  
  function formatType(type) {
    const types = {
      production: 'Ishlab chiqarish',
      packaging: 'Qadoqlash',
      transport: 'Transport',
      other: 'Boshqa',
    }
    return types[type] || type
  }
  
  function getStatusBadgeClass(status) {
    const classes = {
      operational: 'bg-success-100 text-success-800',
      under_maintenance: 'bg-warning-100 text-warning-800',
      broken: 'bg-danger-100 text-danger-800',
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  }
  
  function getNextMaintenanceClass(date) {
    if (!date) return 'text-gray-500'
    const now = new Date()
    const nextDate = new Date(date)
    const diffDays = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'text-danger-600'
    if (diffDays <= 7) return 'text-warning-600'
    return 'text-gray-900'
  }
  </script>