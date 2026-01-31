<template>
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <svg class="animate-spin h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  
    <div v-else-if="!order" class="text-center py-12">
      <p class="text-gray-500">Buyurtma topilmadi</p>
      <button @click="$router.back()" class="mt-4 btn-primary">
        Orqaga
      </button>
    </div>
  
    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button
            @click="$router.back()"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Buyurtma #{{ order.order_number }}
            </h1>
            <p class="text-gray-600 mt-1">{{ formatDateTime(order.created_at) }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            @click="printOrder"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Chop etish
          </button>
          <button
            v-if="can('UPDATE_ORDER') && order.status === 'pending'"
            @click="editOrder"
            class="btn-primary flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Tahrirlash
          </button>
        </div>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Items Table -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">Mahsulotlar</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead class="bg-gray-50 border-b">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mahsulot
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Miqdor
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Narx
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Jami
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="item in order.items" :key="item.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div>
                        <p class="font-medium text-gray-900">{{ item.product?.name }}</p>
                        <p class="text-sm text-gray-500 mt-1">{{ item.product?.code }}</p>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right text-gray-900">
                      {{ formatNumber(item.quantity) }}
                    </td>
                    <td class="px-6 py-4 text-right text-gray-900">
                      {{ formatCurrency(item.unit_price) }}
                    </td>
                    <td class="px-6 py-4 text-right font-semibold text-gray-900">
                      {{ formatCurrency(item.total_price) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colspan="3" class="px-6 py-4 text-right font-semibold text-gray-900">
                      JAMI:
                    </td>
                    <td class="px-6 py-4 text-right text-xl font-bold text-primary-600">
                      {{ formatCurrency(order.total_amount) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
  
          <!-- Notes -->
          <div v-if="order.notes" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Izohlar</h3>
            <p class="text-gray-600">{{ order.notes }}</p>
          </div>
        </div>
  
        <!-- Right Column - Sidebar -->
        <div class="space-y-6">
          <!-- Status Card -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Holat</h3>
            <div class="space-y-4">
              <div>
                <span
                  class="px-3 py-2 text-sm font-medium rounded-full inline-block"
                  :class="getStatusClass(order.status)"
                >
                  {{ formatStatus(order.status) }}
                </span>
              </div>
              <div v-if="can('UPDATE_ORDER') && order.status !== 'cancelled'" class="space-y-2">
                <button
                  v-if="order.status === 'pending'"
                  @click="updateStatus('processing')"
                  class="w-full px-4 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700"
                >
                  Jarayonga o'tkazish
                </button>
                <button
                  v-if="order.status === 'processing'"
                  @click="updateStatus('delivered')"
                  class="w-full px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700"
                >
                  Yetkazildi
                </button>
                <button
                  v-if="order.status === 'pending'"
                  @click="updateStatus('cancelled')"
                  class="w-full px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          </div>
  
          <!-- Customer Card -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Mijoz</h3>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-primary-600 font-semibold text-sm">
                    {{ getCustomerInitials(order.customer) }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900">
                    {{ order.customer?.company_name || formatCustomerName(order.customer) }}
                  </p>
                  <p v-if="order.customer?.company_name" class="text-sm text-gray-500 mt-1">
                    {{ formatCustomerName(order.customer) }}
                  </p>
                </div>
              </div>
              <div class="pt-3 border-t space-y-2">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ formatPhone(order.customer?.phone) }}
                </div>
                <div v-if="order.customer?.email" class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ order.customer?.email }}
                </div>
              </div>
            </div>
          </div>
  
          <!-- Delivery Info -->
          <div v-if="order.delivery_address || order.delivery_date" class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Yetkazib berish</h3>
            <div class="space-y-3">
              <div v-if="order.delivery_address" class="flex items-start gap-2">
                <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="text-sm text-gray-600">{{ order.delivery_address }}</p>
              </div>
              <div v-if="order.delivery_date" class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-sm text-gray-600">{{ formatDate(order.delivery_date) }}</p>
              </div>
            </div>
          </div>
  
          <!-- Payment Info -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">To'lov ma'lumotlari</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">To'lov usuli:</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ formatPaymentMethod(order.payment_method) }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">To'lov holati:</span>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="order.payment_status === 'paid' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'"
                >
                  {{ order.payment_status === 'paid' ? 'To\'langan' : 'Kutilmoqda' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSalesStore } from '@/stores/sales'
  import { usePermissions } from '@/composables/usePermissions'
  import { useNotifications } from '@/composables/useNotifications'
  import {
    formatCurrency,
    formatDate,
    formatDateTime,
    formatPhone,
    formatCustomerName,
    formatStatus,
    formatNumber,
    getOrderStatusColor,
  } from '@/utils/formatters'
  
  const route = useRoute()
  const router = useRouter()
  const salesStore = useSalesStore()
  const { can } = usePermissions()
  const notifications = useNotifications()
  
  const order = ref(null)
  const loading = ref(true)
  
  onMounted(async () => {
    await fetchOrder()
  })
  
  async function fetchOrder() {
    loading.value = true
    try {
      const id = route.params.id
      order.value = await salesStore.getOrder(id)
    } catch (error) {
      notifications.apiError(error)
    } finally {
      loading.value = false
    }
  }
  
  function getStatusClass(status) {
    const color = getOrderStatusColor(status)
    return `bg-${color}-100 text-${color}-800`
  }
  
  function getCustomerInitials(customer) {
    if (!customer) return 'M'
    if (customer.company_name) {
      return customer.company_name.substring(0, 2).toUpperCase()
    }
    const first = customer.first_name?.charAt(0) || ''
    const last = customer.last_name?.charAt(0) || ''
    return (first + last).toUpperCase() || 'M'
  }
  
  function formatPaymentMethod(method) {
    const methods = {
      cash: 'Naqd',
      card: 'Plastik',
      transfer: 'O\'tkazma',
    }
    return methods[method] || method
  }
  
  async function updateStatus(newStatus) {
    try {
      await salesStore.updateOrderStatus(order.value.id, newStatus)
      notifications.success('Holat yangilandi')
      await fetchOrder()
    } catch (error) {
      notifications.apiError(error)
    }
  }
  
  function editOrder() {
    router.push(`/sales/orders/${order.value.id}/edit`)
  }
  
  function printOrder() {
    window.print()
  }
  </script>