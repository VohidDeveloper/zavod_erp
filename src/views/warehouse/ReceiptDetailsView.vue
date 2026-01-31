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
            <div class="flex items-center space-x-3">
              <h1 class="text-2xl font-bold text-gray-900">Qabul #{{ receipt.receiptNumber }}</h1>
              <Badge :color="getStatusColor(receipt.status)">
                {{ getStatusText(receipt.status) }}
              </Badge>
              <Badge :color="getTypeColor(receipt.type)">
                {{ getTypeText(receipt.type) }}
              </Badge>
            </div>
            <p class="text-gray-600 mt-1">{{ receipt.receiptDate }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button
            v-if="canEdit"
            @click="editReceipt"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <PencilIcon class="w-5 h-5 inline mr-2" />
            Tahrirlash
          </button>
          <button
            @click="printReceipt"
            class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            <PrinterIcon class="w-5 h-5 inline mr-2" />
            Chop etish
          </button>
          <button
            @click="showMoreMenu = !showMoreMenu"
            class="p-2 hover:bg-gray-100 rounded-lg"
          >
            <EllipsisVerticalIcon class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
  
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <BaseCard class="text-center">
          <p class="text-sm text-gray-600 mb-2">Mahsulotlar</p>
          <p class="text-3xl font-bold text-blue-600">{{ receipt.itemCount }}</p>
        </BaseCard>
  
        <BaseCard class="text-center">
          <p class="text-sm text-gray-600 mb-2">Jami miqdor</p>
          <p class="text-3xl font-bold text-purple-600">{{ receipt.totalQuantity }}</p>
        </BaseCard>
  
        <BaseCard class="text-center">
          <p class="text-sm text-gray-600 mb-2">Jami summa</p>
          <p class="text-3xl font-bold text-green-600">{{ formatCurrency(receipt.totalAmount) }}</p>
        </BaseCard>
  
        <BaseCard class="text-center">
          <p class="text-sm text-gray-600 mb-2">Ombor</p>
          <p class="text-lg font-bold text-gray-900 mt-2">{{ receipt.warehouseName }}</p>
        </BaseCard>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Receipt Information -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Qabul ma'lumotlari</h3>
            </template>
  
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Qabul raqami</p>
                  <p class="font-medium text-gray-900">{{ receipt.receiptNumber }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Qabul sanasi</p>
                  <p class="font-medium text-gray-900">{{ receipt.receiptDate }}</p>
                </div>
              </div>
  
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Qabul turi</p>
                  <Badge :color="getTypeColor(receipt.type)">
                    {{ getTypeText(receipt.type) }}
                  </Badge>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Hujjat raqami</p>
                  <p class="font-medium text-gray-900">{{ receipt.documentNumber || 'Yo\'q' }}</p>
                </div>
              </div>
  
              <div v-if="receipt.supplier" class="pt-4 border-t">
                <h4 class="font-medium text-gray-900 mb-3">Yetkazib beruvchi</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-gray-600">Nomi:</p>
                    <p class="font-medium text-gray-900">{{ receipt.supplier.name }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Telefon:</p>
                    <p class="font-medium text-gray-900">{{ receipt.supplier.phone }}</p>
                  </div>
                  <div v-if="receipt.supplier.email">
                    <p class="text-gray-600">Email:</p>
                    <p class="font-medium text-gray-900">{{ receipt.supplier.email }}</p>
                  </div>
                  <div v-if="receipt.supplier.inn">
                    <p class="text-gray-600">INN:</p>
                    <p class="font-medium text-gray-900">{{ receipt.supplier.inn }}</p>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
  
          <!-- Receipt Items -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Mahsulotlar</h3>
            </template>
  
            <div class="space-y-3">
              <div
                v-for="item in receipt.items"
                :key="item.id"
                class="p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ item.productName }}</p>
                    <p class="text-sm text-gray-600">SKU: {{ item.sku }}</p>
                    <p v-if="item.location" class="text-xs text-gray-500 mt-1">
                      <MapPinIcon class="w-3 h-3 inline mr-1" />
                      Joylashuv: {{ item.location }}
                    </p>
                  </div>
                  <div v-if="item.qualityChecked" class="text-right">
                    <Badge :color="getQualityColor(item.qualityStatus)" size="sm">
                      {{ getQualityText(item.qualityStatus) }}
                    </Badge>
                  </div>
                </div>
  
                <div class="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p class="text-gray-600">Miqdor:</p>
                    <p class="font-bold text-gray-900">{{ item.quantity }} {{ item.unit }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Birlik narxi:</p>
                    <p class="font-medium text-gray-900">{{ formatCurrency(item.unitPrice) }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Jami:</p>
                    <p class="font-bold text-green-600">{{ formatCurrency(item.total) }}</p>
                  </div>
                  <div>
                    <p class="text-gray-600">Yangi qoldiq:</p>
                    <p class="font-medium text-blue-600">{{ item.newStock }} {{ item.unit }}</p>
                  </div>
                </div>
  
                <div v-if="item.qualityNotes" class="mt-3 pt-3 border-t">
                  <p class="text-sm text-gray-600">Sifat izoh:</p>
                  <p class="text-sm text-gray-700 mt-1">{{ item.qualityNotes }}</p>
                </div>
              </div>
            </div>
  
            <!-- Totals -->
            <div class="mt-4 pt-4 border-t">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">Jami summa:</span>
                <span class="text-2xl font-bold text-green-600">{{ formatCurrency(receipt.totalAmount) }}</span>
              </div>
            </div>
          </BaseCard>
  
          <!-- Notes -->
          <BaseCard v-if="receipt.notes">
            <template #header>
              <h3 class="text-lg font-semibold">Izohlar</h3>
            </template>
            <p class="text-gray-700 whitespace-pre-line">{{ receipt.notes }}</p>
          </BaseCard>
  
          <!-- Attachments -->
          <BaseCard v-if="receipt.attachments && receipt.attachments.length > 0">
            <template #header>
              <h3 class="text-lg font-semibold">Qo'shimcha hujjatlar</h3>
            </template>
  
            <div class="space-y-2">
              <div
                v-for="file in receipt.attachments"
                :key="file.id"
                @click="viewFile(file)"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              >
                <div class="flex items-center space-x-3">
                  <DocumentIcon class="w-5 h-5 text-gray-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                    <p class="text-xs text-gray-600">{{ file.size }}</p>
                  </div>
                </div>
                <ArrowDownTrayIcon class="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </BaseCard>
  
          <!-- Activity Timeline -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Faoliyat tarixi</h3>
            </template>
  
            <div class="space-y-4">
              <div
                v-for="(activity, index) in receipt.activityLog"
                :key="activity.id"
                class="flex space-x-4"
              >
                <div class="flex flex-col items-center">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    getActivityColor(activity.type)
                  ]">
                    <component :is="getActivityIcon(activity.type)" class="w-4 h-4 text-white" />
                  </div>
                  <div
                    v-if="index < receipt.activityLog.length - 1"
                    class="w-0.5 h-full bg-gray-200 mt-2"
                  ></div>
                </div>
                <div class="flex-1 pb-4">
                  <div class="flex items-center justify-between mb-1">
                    <p class="font-medium text-gray-900">{{ activity.action }}</p>
                    <span class="text-sm text-gray-600">{{ activity.time }}</span>
                  </div>
                  <p class="text-sm text-gray-600">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ activity.user }}</p>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
  
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Harakatlar</h3>
            </template>
  
            <div class="space-y-2">
              <button
                v-if="canApprove"
                @click="approveReceipt"
                class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Tasdiqlash
              </button>
              <button
                v-if="canReject"
                @click="showRejectModal = true"
                class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Rad etish
              </button>
              <button
                @click="printReceipt"
                class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Chop etish
              </button>
              <button
                @click="exportData"
                class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Eksport
              </button>
            </div>
          </BaseCard>
  
          <!-- Receipt Info -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Ma'lumot</h3>
            </template>
  
            <dl class="space-y-3 text-sm">
              <div>
                <dt class="text-gray-600">Ombor:</dt>
                <dd class="font-medium text-gray-900 mt-1">{{ receipt.warehouseName }}</dd>
              </div>
              <div>
                <dt class="text-gray-600">Yaratilgan:</dt>
                <dd class="font-medium text-gray-900 mt-1">{{ receipt.createdAt }}</dd>
              </div>
              <div>
                <dt class="text-gray-600">Yaratuvchi:</dt>
                <dd class="font-medium text-gray-900 mt-1">{{ receipt.createdBy }}</dd>
              </div>
              <div v-if="receipt.approvedBy">
                <dt class="text-gray-600">Tasdiqlagan:</dt>
                <dd class="font-medium text-gray-900 mt-1">{{ receipt.approvedBy }}</dd>
              </div>
              <div v-if="receipt.approvedAt">
                <dt class="text-gray-600">Tasdiqlangan:</dt>
                <dd class="font-medium text-gray-900 mt-1">{{ receipt.approvedAt }}</dd>
              </div>
            </dl>
          </BaseCard>
  
          <!-- Stock Impact -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Ta'siri</h3>
            </template>
  
            <div class="space-y-3">
              <div class="p-3 bg-green-50 rounded-lg">
                <p class="text-sm text-gray-600 mb-1">Qo'shildi</p>
                <p class="text-2xl font-bold text-green-600">+{{ receipt.totalQuantity }}</p>
              </div>
              <div class="text-sm text-gray-600">
                <p>{{ receipt.itemCount }} xil mahsulot qoldiq oshdi</p>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
  
      <!-- Reject Modal -->
      <Modal v-model="showRejectModal" title="Rad etish">
        <form @submit.prevent="rejectReceipt" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sabab
            </label>
            <textarea
              v-model="rejectReason"
              rows="4"
              placeholder="Rad etish sababini kiriting..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            ></textarea>
          </div>
  
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="showRejectModal = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Rad etish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useWarehouseStore } from '@/stores/warehouse'
  import {
    ArrowLeftIcon,
    PencilIcon,
    PrinterIcon,
    EllipsisVerticalIcon,
    MapPinIcon,
    DocumentIcon,
    ArrowDownTrayIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
  } from '@heroicons/vue/24/outline'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  
  const route = useRoute()
  const router = useRouter()
  const warehouseStore = useWarehouseStore()
  
  const showMoreMenu = ref(false)
  const showRejectModal = ref(false)
  const rejectReason = ref('')
  
  const receipt = ref({
    id: route.params.id,
    receiptNumber: 'RCP-2024-0128',
    receiptDate: '2024-01-28',
    type: 'purchase',
    status: 'approved',
    documentNumber: 'INV-2024-001',
    warehouseName: 'Asosiy ombor',
    itemCount: 5,
    totalQuantity: 2500,
    totalAmount: 45000000,
    supplier: {
      name: 'XYZ Materials',
      phone: '+998 90 123-45-67',
      email: 'info@xyz.uz',
      inn: '123456789'
    },
    items: [],
    notes: '',
    attachments: [],
    activityLog: [],
    createdAt: '2024-01-28 10:30',
    createdBy: 'Ali Valiyev',
    approvedBy: 'Nodira Karimova',
    approvedAt: '2024-01-28 11:00'
  })
  
  const canEdit = computed(() => receipt.value.status === 'pending')
  const canApprove = computed(() => receipt.value.status === 'pending')
  const canReject = computed(() => receipt.value.status === 'pending')
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  const getStatusColor = (status) => {
    return { pending: 'orange', approved: 'green', rejected: 'red', draft: 'gray' }[status] || 'gray'
  }
  
  const getStatusText = (status) => {
    return { pending: 'Kutilmoqda', approved: 'Tasdiqlangan', rejected: 'Rad etilgan', draft: 'Qoralama' }[status] || status
  }
  
  const getTypeColor = (type) => {
    return { purchase: 'blue', return: 'orange', transfer: 'purple' }[type] || 'gray'
  }
  
  const getTypeText = (type) => {
    return { purchase: 'Xarid', return: 'Qaytarish', transfer: 'O\'tkazma' }[type] || type
  }
  
  const getQualityColor = (status) => {
    return { passed: 'green', rejected: 'red', conditional: 'orange' }[status] || 'gray'
  }
  
  const getQualityText = (status) => {
    return { passed: 'Qabul', rejected: 'Rad', conditional: 'Shartli' }[status] || status
  }
  
  const getActivityColor = (type) => {
    const colors = {
      created: 'bg-blue-600',
      approved: 'bg-green-600',
      rejected: 'bg-red-600',
      updated: 'bg-purple-600'
    }
    return colors[type] || 'bg-gray-600'
  }
  
  const getActivityIcon = (type) => {
    const icons = {
      created: DocumentIcon,
      approved: CheckCircleIcon,
      rejected: XCircleIcon,
      updated: ClockIcon
    }
    return icons[type] || DocumentIcon
  }
  
  const editReceipt = () => {
    router.push(`/warehouse/receipts/${receipt.value.id}/edit`)
  }
  
  const printReceipt = () => {
    window.print()
  }
  
  const approveReceipt = async () => {
    try {
      await warehouseStore.approveReceipt(receipt.value.id)
      // Reload receipt
    } catch (error) {
      console.error('Failed to approve receipt:', error)
    }
  }
  
  const rejectReceipt = async () => {
    try {
      await warehouseStore.rejectReceipt(receipt.value.id, rejectReason.value)
      showRejectModal.value = false
      // Reload receipt
    } catch (error) {
      console.error('Failed to reject receipt:', error)
    }
  }
  
  const exportData = async () => {
    try {
      await warehouseStore.exportReceipt(receipt.value.id)
    } catch (error) {
      console.error('Failed to export receipt:', error)
    }
  }
  
  const viewFile = (file) => {
    window.open(file.url, '_blank')
  }
  
  onMounted(async () => {
    try {
      const data = await warehouseStore.fetchReceipt(route.params.id)
      receipt.value = data
    } catch (error) {
      console.error('Failed to load receipt:', error)
    }
  })
  </script>