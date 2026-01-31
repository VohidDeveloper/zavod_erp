<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Yetkazib berish</h1>
          <p class="text-gray-600 mt-1">Yuk jo'natmalarini kuzatish va boshqarish</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="exportShipments"
            class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            <ArrowDownTrayIcon class="w-5 h-5 inline mr-2" />
            Eksport
          </button>
          <button
            @click="$router.push({ name: 'sales-shipments-create' })"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Yangi jo'natma
          </button>
        </div>
      </div>
  
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Jami"
          :value="stats.total"
          icon="TruckIcon"
          color="blue"
        />
        <StatCard
          title="Yo'lda"
          :value="stats.inTransit"
          icon="ArrowPathIcon"
          color="orange"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">{{ stats.inTransitPercent }}%</p>
          </template>
        </StatCard>
        <StatCard
          title="Yetkazilgan"
          :value="stats.delivered"
          icon="CheckCircleIcon"
          color="green"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">{{ stats.deliveredPercent }}%</p>
          </template>
        </StatCard>
        <StatCard
          title="Kechikkan"
          :value="stats.delayed"
          icon="ExclamationTriangleIcon"
          color="red"
        />
        <StatCard
          title="Qaytarilgan"
          :value="stats.returned"
          icon="ArrowUturnLeftIcon"
          color="purple"
        />
      </div>
  
      <!-- Filters -->
      <BaseCard>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <input
              v-model="filters.search"
              type="text"
              placeholder="Raqam, mijoz qidirish..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
          </div>
  
          <!-- Status Filter -->
          <div>
            <select
              v-model="filters.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Barcha holatlar</option>
              <option value="pending">Kutilmoqda</option>
              <option value="processing">Tayyorlanmoqda</option>
              <option value="in_transit">Yo'lda</option>
              <option value="delivered">Yetkazilgan</option>
              <option value="delayed">Kechikkan</option>
              <option value="returned">Qaytarilgan</option>
            </select>
          </div>
  
          <!-- Date Range -->
          <div>
            <select
              v-model="filters.dateRange"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">Barcha davr</option>
              <option value="today">Bugun</option>
              <option value="week">Bu hafta</option>
              <option value="month">Bu oy</option>
            </select>
          </div>
  
          <!-- Driver Filter -->
          <div>
            <select
              v-model="filters.driverId"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Barcha haydovchilar</option>
              <option v-for="driver in drivers" :key="driver.id" :value="driver.id">
                {{ driver.name }}
              </option>
            </select>
          </div>
        </div>
  
        <!-- Active Filters -->
        <div v-if="activeFiltersCount > 0" class="flex items-center space-x-2 mt-4">
          <span class="text-sm text-gray-600">Filtrlar:</span>
          <div class="flex flex-wrap gap-2">
            <Badge
              v-if="filters.status"
              color="blue"
              @click="filters.status = ''"
              class="cursor-pointer"
            >
              {{ getStatusText(filters.status) }} ×
            </Badge>
            <button
              @click="clearFilters"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              Tozalash
            </button>
          </div>
        </div>
      </BaseCard>
  
      <!-- Shipments List -->
      <div class="space-y-4">
        <div
          v-for="shipment in paginatedShipments"
          :key="shipment.id"
          class="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg cursor-pointer transition"
          @click="viewShipment(shipment)"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div :class="[
                'w-12 h-12 rounded-full flex items-center justify-center',
                getStatusBgColor(shipment.status)
              ]">
                <TruckIcon :class="['w-6 h-6', getStatusIconColor(shipment.status)]" />
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="font-semibold text-gray-900">Jo'natma #{{ shipment.shipmentNumber }}</h3>
                  <Badge :color="getStatusColor(shipment.status)">
                    {{ getStatusText(shipment.status) }}
                  </Badge>
                </div>
                <p class="text-sm text-gray-600 mt-1">Buyurtma #{{ shipment.orderNumber }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Yuborilgan</p>
              <p class="font-medium text-gray-900">{{ shipment.shippedDate }}</p>
            </div>
          </div>
  
          <!-- Info Grid -->
          <div class="grid grid-cols-4 gap-4 mb-4">
            <div>
              <p class="text-xs text-gray-600 mb-1">Mijoz</p>
              <p class="font-medium text-gray-900">{{ shipment.customer.name }}</p>
              <p class="text-xs text-gray-600">{{ shipment.customer.phone }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 mb-1">Manzil</p>
              <p class="font-medium text-gray-900 text-sm">{{ shipment.deliveryAddress }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 mb-1">Haydovchi</p>
              <p class="font-medium text-gray-900">{{ shipment.driver?.name || 'Tayinlanmagan' }}</p>
              <p v-if="shipment.driver" class="text-xs text-gray-600">{{ shipment.vehicleNumber }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600 mb-1">Yetkazish sanasi</p>
              <p :class="[
                'font-medium',
                shipment.isDelayed ? 'text-red-600' : 'text-gray-900'
              ]">
                {{ shipment.deliveryDate }}
              </p>
              <p v-if="shipment.isDelayed" class="text-xs text-red-600">
                Kechikish: {{ shipment.delayDays }} kun
              </p>
            </div>
          </div>
  
          <!-- Progress Bar -->
          <div v-if="shipment.status === 'in_transit'" class="mb-4">
            <div class="flex items-center justify-between text-sm mb-2">
              <span class="text-gray-600">Jo'natma holati</span>
              <span class="font-medium text-blue-600">{{ shipment.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all"
                :style="{ width: `${shipment.progress}%` }"
              ></div>
            </div>
          </div>
  
          <!-- Footer -->
          <div class="flex items-center justify-between pt-4 border-t">
            <div class="flex items-center space-x-4 text-sm">
              <span class="text-gray-600">
                <CubeIcon class="w-4 h-4 inline mr-1" />
                {{ shipment.itemCount }} ta mahsulot
              </span>
              <span class="text-gray-600">
                <ScaleIcon class="w-4 h-4 inline mr-1" />
                {{ shipment.weight }} kg
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <button
                v-if="shipment.status === 'pending'"
                @click.stop="assignDriver(shipment)"
                class="text-blue-600 hover:text-blue-700 text-sm"
              >
                Haydovchi tayinlash
              </button>
              <button
                v-if="shipment.status === 'in_transit'"
                @click.stop="updateLocation(shipment)"
                class="text-purple-600 hover:text-purple-700 text-sm"
              >
                Lokatsiyani yangilash
              </button>
              <button
                v-if="shipment.status === 'in_transit'"
                @click.stop="markAsDelivered(shipment)"
                class="text-green-600 hover:text-green-700 text-sm"
              >
                Yetkazildi
              </button>
              <button
                @click.stop="showTrackingModal(shipment)"
                class="text-gray-600 hover:text-gray-700"
              >
                <MapPinIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Empty State -->
      <div v-if="filteredShipments.length === 0" class="text-center py-12">
        <TruckIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Jo'natma topilmadi</h3>
        <p class="text-gray-600">Yangi jo'natma yarating</p>
      </div>
  
      <!-- Pagination -->
      <div v-if="filteredShipments.length > 0">
        <Pagination
          v-model="pagination.page"
          :total="pagination.total"
          :per-page="pagination.perPage"
          @change="loadShipments"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSalesStore } from '@/stores/sales'
  import {
    ArrowDownTrayIcon,
    TruckIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowUturnLeftIcon,
    CubeIcon,
    ScaleIcon,
    MapPinIcon
  } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  import Pagination from '@/components/common/navigation/Pagination.vue'
  
  const router = useRouter()
  const salesStore = useSalesStore()
  
  const stats = ref({
    total: 287,
    inTransit: 45,
    inTransitPercent: 15.7,
    delivered: 225,
    deliveredPercent: 78.4,
    delayed: 8,
    returned: 9
  })
  
  const drivers = ref([])
  const shipments = ref([])
  
  const filters = reactive({
    search: '',
    status: '',
    dateRange: 'all',
    driverId: ''
  })
  
  const pagination = reactive({
    page: 1,
    perPage: 10,
    total: 0
  })
  
  const activeFiltersCount = computed(() => {
    let count = 0
    if (filters.status) count++
    if (filters.search) count++
    if (filters.driverId) count++
    return count
  })
  
  const filteredShipments = computed(() => {
    let filtered = shipments.value
  
    if (filters.search) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(s =>
        s.shipmentNumber.toLowerCase().includes(query) ||
        s.customer.name.toLowerCase().includes(query)
      )
    }
  
    if (filters.status) {
      filtered = filtered.filter(s => s.status === filters.status)
    }
  
    if (filters.driverId) {
      filtered = filtered.filter(s => s.driver?.id === filters.driverId)
    }
  
    return filtered
  })
  
  const paginatedShipments = computed(() => {
    const start = (pagination.page - 1) * pagination.perPage
    const end = start + pagination.perPage
    return filteredShipments.value.slice(start, end)
  })
  
  const getStatusColor = (status) => {
    const colors = {
      pending: 'gray',
      processing: 'blue',
      in_transit: 'purple',
      delivered: 'green',
      delayed: 'red',
      returned: 'orange'
    }
    return colors[status] || 'gray'
  }
  
  const getStatusText = (status) => {
    const texts = {
      pending: 'Kutilmoqda',
      processing: 'Tayyorlanmoqda',
      in_transit: 'Yo\'lda',
      delivered: 'Yetkazilgan',
      delayed: 'Kechikkan',
      returned: 'Qaytarilgan'
    }
    return texts[status] || status
  }
  
  const getStatusBgColor = (status) => {
    const colors = {
      pending: 'bg-gray-100',
      processing: 'bg-blue-100',
      in_transit: 'bg-purple-100',
      delivered: 'bg-green-100',
      delayed: 'bg-red-100',
      returned: 'bg-orange-100'
    }
    return colors[status] || 'bg-gray-100'
  }
  
  const getStatusIconColor = (status) => {
    const colors = {
      pending: 'text-gray-600',
      processing: 'text-blue-600',
      in_transit: 'text-purple-600',
      delivered: 'text-green-600',
      delayed: 'text-red-600',
      returned: 'text-orange-600'
    }
    return colors[status] || 'text-gray-600'
  }
  
  const clearFilters = () => {
    filters.search = ''
    filters.status = ''
    filters.dateRange = 'all'
    filters.driverId = ''
  }
  
  const viewShipment = (shipment) => {
    router.push(`/sales/shipments/${shipment.id}`)
  }
  
  const assignDriver = (shipment) => {
    console.log('Assign driver to:', shipment)
  }
  
  const updateLocation = (shipment) => {
    console.log('Update location for:', shipment)
  }
  
  const markAsDelivered = async (shipment) => {
    try {
      await salesStore.markShipmentAsDelivered(shipment.id)
      loadShipments()
    } catch (error) {
      console.error('Failed to mark as delivered:', error)
    }
  }
  
  const showTrackingModal = (shipment) => {
    console.log('Show tracking for:', shipment)
  }
  
  const exportShipments = async () => {
    try {
      await salesStore.exportShipments({ ...filters, format: 'xlsx' })
    } catch (error) {
      console.error('Failed to export shipments:', error)
    }
  }
  
  const loadShipments = async () => {
    try {
      const response = await salesStore.fetchShipments({
        page: pagination.page,
        per_page: pagination.perPage,
        ...filters
      })
      shipments.value = response.data
      pagination.total = response.total
    } catch (error) {
      console.error('Failed to load shipments:', error)
    }
  }
  
  onMounted(async () => {
    drivers.value = (await salesStore.fetchDrivers()).data
    loadShipments()
  })
  </script>