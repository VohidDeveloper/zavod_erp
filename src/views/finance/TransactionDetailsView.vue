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
              <h1 class="text-2xl font-bold text-gray-900">{{ transaction.title }}</h1>
              <Badge :color="getTypeColor(transaction.type)">
                {{ getTypeText(transaction.type) }}
              </Badge>
              <Badge :color="getStatusColor(transaction.status)">
                {{ getStatusText(transaction.status) }}
              </Badge>
            </div>
            <p class="text-gray-600 mt-1">
              Tranzaksiya #{{ transaction.id }} • {{ transaction.date }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button
            v-if="canEdit"
            @click="editTransaction"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Tahrirlash
          </button>
          <button
            @click="printTransaction"
            class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            <PrinterIcon class="w-5 h-5 inline mr-2" />
            Chop etish
          </button>
          <button
            @click="showMoreMenu = !showMoreMenu"
            class="p-2 hover:bg-gray-100 rounded-lg relative"
          >
            <EllipsisVerticalIcon class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
  
      <!-- Amount Card -->
      <BaseCard :class="[
        'border-2',
        transaction.type === 'income' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
      ]">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">
              {{ transaction.type === 'income' ? 'Tushum' : 'Chiqim' }}
            </p>
            <p :class="[
              'text-4xl font-bold',
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            ]">
              {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
            </p>
            <p class="text-sm text-gray-600 mt-2">
              {{ transaction.category }} • {{ transaction.paymentMethod }}
            </p>
          </div>
          <div :class="[
            'w-20 h-20 rounded-full flex items-center justify-center',
            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
          ]">
            <component 
              :is="transaction.type === 'income' ? ArrowDownIcon : ArrowUpIcon" 
              :class="[
                'w-10 h-10',
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              ]" 
            />
          </div>
        </div>
      </BaseCard>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Transaction Details -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Tranzaksiya tafsilotlari</h3>
            </template>
  
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Sana va vaqt</p>
                  <p class="font-medium text-gray-900">{{ transaction.date }} {{ transaction.time }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Turi</p>
                  <Badge :color="getTypeColor(transaction.type)">
                    {{ getTypeText(transaction.type) }}
                  </Badge>
                </div>
              </div>
  
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Kategoriya</p>
                  <p class="font-medium text-gray-900">{{ transaction.category }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">To'lov usuli</p>
                  <p class="font-medium text-gray-900">{{ transaction.paymentMethod }}</p>
                </div>
              </div>
  
              <div v-if="transaction.reference">
                <p class="text-sm text-gray-600">Havola raqami</p>
                <p class="font-medium text-gray-900">{{ transaction.reference }}</p>
              </div>
  
              <div v-if="transaction.description">
                <p class="text-sm text-gray-600 mb-2">Tavsif</p>
                <p class="text-gray-700">{{ transaction.description }}</p>
              </div>
  
              <!-- Party Information -->
              <div v-if="transaction.party" class="p-4 bg-gray-50 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-3">
                  {{ transaction.type === 'income' ? 'Kimdan' : 'Kimga' }}
                </h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-gray-600">Nomi:</p>
                    <p class="font-medium text-gray-900">{{ transaction.party.name }}</p>
                  </div>
                  <div v-if="transaction.party.phone">
                    <p class="text-gray-600">Telefon:</p>
                    <p class="font-medium text-gray-900">{{ transaction.party.phone }}</p>
                  </div>
                  <div v-if="transaction.party.email">
                    <p class="text-gray-600">Email:</p>
                    <p class="font-medium text-gray-900">{{ transaction.party.email }}</p>
                  </div>
                  <div v-if="transaction.party.account">
                    <p class="text-gray-600">Hisob raqami:</p>
                    <p class="font-medium text-gray-900">{{ transaction.party.account }}</p>
                  </div>
                </div>
              </div>
  
              <!-- Tags -->
              <div v-if="transaction.tags && transaction.tags.length > 0">
                <p class="text-sm text-gray-600 mb-2">Teglar</p>
                <div class="flex flex-wrap gap-2">
                  <Badge v-for="tag in transaction.tags" :key="tag" color="blue">
                    {{ tag }}
                  </Badge>
                </div>
              </div>
  
              <!-- Attachments -->
              <div v-if="transaction.attachments && transaction.attachments.length > 0">
                <p class="text-sm text-gray-600 mb-2">Qo'shimcha fayllar</p>
                <div class="space-y-2">
                  <div
                    v-for="file in transaction.attachments"
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
              </div>
            </div>
          </BaseCard>
  
          <!-- Related Transactions -->
          <BaseCard v-if="relatedTransactions.length > 0">
            <template #header>
              <h3 class="text-lg font-semibold">Bog'liq tranzaksiyalar</h3>
            </template>
  
            <div class="space-y-2">
              <div
                v-for="rel in relatedTransactions"
                :key="rel.id"
                @click="viewTransaction(rel.id)"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition"
              >
                <div class="flex items-center space-x-3">
                  <div :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    rel.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  ]">
                    <component 
                      :is="rel.type === 'income' ? ArrowDownIcon : ArrowUpIcon" 
                      :class="[
                        'w-5 h-5',
                        rel.type === 'income' ? 'text-green-600' : 'text-red-600'
                      ]" 
                    />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ rel.title }}</p>
                    <p class="text-sm text-gray-600">{{ rel.date }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p :class="[
                    'font-semibold',
                    rel.type === 'income' ? 'text-green-600' : 'text-red-600'
                  ]">
                    {{ rel.type === 'income' ? '+' : '-' }}{{ formatCurrency(rel.amount) }}
                  </p>
                  <Badge :color="getStatusColor(rel.status)" size="sm">
                    {{ getStatusText(rel.status) }}
                  </Badge>
                </div>
              </div>
            </div>
          </BaseCard>
  
          <!-- Activity Log -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Faoliyat tarixi</h3>
            </template>
  
            <div class="space-y-4">
              <div
                v-for="(activity, index) in transaction.activityLog"
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
                    v-if="index < transaction.activityLog.length - 1"
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
  
          <!-- Comments -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Izohlar</h3>
            </template>
  
            <div class="space-y-4">
              <div
                v-for="comment in transaction.comments"
                :key="comment.id"
                class="flex space-x-3"
              >
                <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-xs font-semibold text-gray-600">
                    {{ comment.user.name.split(' ').map(n => n[0]).join('') }}
                  </span>
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <p class="font-medium text-sm text-gray-900">{{ comment.user.name }}</p>
                    <span class="text-xs text-gray-500">{{ comment.createdAt }}</span>
                  </div>
                  <p class="text-sm text-gray-700">{{ comment.text }}</p>
                </div>
              </div>
  
              <!-- Add Comment -->
              <div class="flex space-x-3 pt-4 border-t">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon class="w-4 h-4 text-blue-600" />
                </div>
                <div class="flex-1">
                  <textarea
                    v-model="newComment"
                    rows="2"
                    placeholder="Izoh qo'shish..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                  <div class="flex justify-end mt-2">
                    <button
                      @click="addComment"
                      :disabled="!newComment.trim()"
                      class="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Yuborish
                    </button>
                  </div>
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
                @click="approveTransaction"
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
                @click="duplicateTransaction"
                class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Nusxa olish
              </button>
              <button
                v-if="canDelete"
                @click="showDeleteModal = true"
                class="w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
              >
                O'chirish
              </button>
            </div>
          </BaseCard>
  
          <!-- Transaction Info -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Ma'lumot</h3>
            </template>
  
            <dl class="space-y-3 text-sm">
              <div>
                <dt class="text-gray-600">Yaratilgan:</dt>
                <dd class="font-medium text-gray-900">{{ transaction.createdAt }}</dd>
              </div>
              <div>
                <dt class="text-gray-600">Yaratuvchi:</dt>
                <dd class="font-medium text-gray-900">{{ transaction.createdBy }}</dd>
              </div>
              <div v-if="transaction.approvedBy">
                <dt class="text-gray-600">Tasdiqlagan:</dt>
                <dd class="font-medium text-gray-900">{{ transaction.approvedBy }}</dd>
              </div>
              <div v-if="transaction.approvedAt">
                <dt class="text-gray-600">Tasdiqlangan:</dt>
                <dd class="font-medium text-gray-900">{{ transaction.approvedAt }}</dd>
              </div>
              <div v-if="transaction.updatedAt">
                <dt class="text-gray-600">Yangilangan:</dt>
                <dd class="font-medium text-gray-900">{{ transaction.updatedAt }}</dd>
              </div>
            </dl>
          </BaseCard>
  
          <!-- Statistics -->
          <BaseCard v-if="statistics">
            <template #header>
              <h3 class="text-lg font-semibold">Statistika</h3>
            </template>
  
            <div class="space-y-4">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm text-gray-600">Bu kategoriyada bu oy</p>
                  <p class="font-semibold text-gray-900">{{ statistics.thisMonth }}</p>
                </div>
                <p class="text-xs text-gray-600">
                  Jami: {{ formatCurrency(statistics.thisMonthTotal) }}
                </p>
              </div>
  
              <div>
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm text-gray-600">O'rtacha tranzaksiya</p>
                  <p class="font-semibold text-gray-900">{{ formatCurrency(statistics.avgAmount) }}</p>
                </div>
              </div>
  
              <div v-if="transaction.type === 'income'">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm text-gray-600">Bu mijozdan</p>
                  <p class="font-semibold text-gray-900">{{ statistics.fromThisParty }}</p>
                </div>
                <p class="text-xs text-gray-600">
                  Jami: {{ formatCurrency(statistics.fromThisPartyTotal) }}
                </p>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
  
      <!-- Reject Modal -->
      <Modal v-model="showRejectModal" title="Rad etish">
        <form @submit.prevent="rejectTransaction" class="space-y-4">
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
  
      <!-- Delete Confirmation Modal -->
      <Modal v-model="showDeleteModal" title="Tranzaksiyani o'chirish">
        <div class="space-y-4">
          <p class="text-gray-700">
            Ushbu tranzaksiyani o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
          </p>
  
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              @click="deleteTransaction"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              O'chirish
            </button>
          </div>
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useFinanceStore } from '@/stores/finance'
  import {
    ArrowLeftIcon,
    EllipsisVerticalIcon,
    PrinterIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    DocumentIcon,
    ArrowDownTrayIcon,
    UserIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
  } from '@heroicons/vue/24/outline'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  
  const route = useRoute()
  const router = useRouter()
  const financeStore = useFinanceStore()
  
  const showMoreMenu = ref(false)
  const showRejectModal = ref(false)
  const showDeleteModal = ref(false)
  const newComment = ref('')
  const rejectReason = ref('')
  
  const transaction = ref({
    id: route.params.id,
    title: 'Mahsulot sotish',
    type: 'income',
    status: 'completed',
    amount: 15000000,
    category: 'Savdo',
    paymentMethod: 'Bank o\'tkazmasi',
    date: '2024-01-27',
    time: '14:30',
    reference: 'TXN-2024-001234',
    description: 'ABC kompaniyasiga plastik idishlar sotildi',
    party: {
      name: 'ABC Company',
      phone: '+998 90 123-45-67',
      email: 'info@abc.uz',
      account: '2020 1234 5678 9012'
    },
    tags: ['Savdo', 'ABC Company'],
    attachments: [],
    activityLog: [
      {
        id: 1,
        type: 'created',
        action: 'Yaratildi',
        description: 'Tranzaksiya yaratildi',
        user: 'Ali Valiyev',
        time: '2024-01-27 14:30'
      },
      {
        id: 2,
        type: 'approved',
        action: 'Tasdiqlandi',
        description: 'Tranzaksiya tasdiqlandi',
        user: 'Nodira Karimova',
        time: '2024-01-27 15:00'
      },
      {
        id: 3,
        type: 'completed',
        action: 'Tugatildi',
        description: 'To\'lov qabul qilindi',
        user: 'Sistema',
        time: '2024-01-27 15:30'
      }
    ],
    comments: [],
    createdAt: '2024-01-27 14:30',
    createdBy: 'Ali Valiyev',
    approvedBy: 'Nodira Karimova',
    approvedAt: '2024-01-27 15:00',
    updatedAt: null
  })
  
  const relatedTransactions = ref([])
  
  const statistics = ref({
    thisMonth: 12,
    thisMonthTotal: 180000000,
    avgAmount: 15000000,
    fromThisParty: 8,
    fromThisPartyTotal: 120000000
  })
  
  const canEdit = computed(() => transaction.value.status === 'pending')
  const canApprove = computed(() => transaction.value.status === 'pending')
  const canReject = computed(() => transaction.value.status === 'pending')
  const canDelete = computed(() => transaction.value.status === 'pending' || transaction.value.status === 'draft')
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  const getTypeColor = (type) => {
    return type === 'income' ? 'green' : 'red'
  }
  
  const getTypeText = (type) => {
    return type === 'income' ? 'Tushum' : 'Chiqim'
  }
  
  const getStatusColor = (status) => {
    const colors = {
      completed: 'green',
      pending: 'orange',
      cancelled: 'red',
      draft: 'gray'
    }
    return colors[status] || 'gray'
  }
  
  const getStatusText = (status) => {
    const texts = {
      completed: 'Tugatilgan',
      pending: 'Kutilmoqda',
      cancelled: 'Bekor qilingan',
      draft: 'Qoralama'
    }
    return texts[status] || status
  }
  
  const getActivityColor = (type) => {
    const colors = {
      created: 'bg-blue-600',
      approved: 'bg-green-600',
      completed: 'bg-green-600',
      rejected: 'bg-red-600',
      updated: 'bg-purple-600'
    }
    return colors[type] || 'bg-gray-600'
  }
  
  const getActivityIcon = (type) => {
    const icons = {
      created: DocumentIcon,
      approved: CheckCircleIcon,
      completed: CheckCircleIcon,
      rejected: XCircleIcon,
      updated: ClockIcon
    }
    return icons[type] || DocumentIcon
  }
  
  const viewFile = (file) => {
    window.open(file.url, '_blank')
  }
  
  const viewTransaction = (id) => {
    router.push(`/finance/transactions/${id}`)
  }
  
  const editTransaction = () => {
    router.push(`/finance/transactions/${transaction.value.id}/edit`)
  }
  
  const printTransaction = () => {
    window.print()
  }
  
  const addComment = async () => {
    if (!newComment.value.trim()) return
    
    try {
      await financeStore.addComment(transaction.value.id, newComment.value)
      newComment.value = ''
      // Reload transaction
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }
  
  const approveTransaction = async () => {
    try {
      await financeStore.approveTransaction(transaction.value.id)
      // Reload transaction
    } catch (error) {
      console.error('Failed to approve transaction:', error)
    }
  }
  
  const rejectTransaction = async () => {
    try {
      await financeStore.rejectTransaction(transaction.value.id, rejectReason.value)
      showRejectModal.value = false
      // Reload transaction
    } catch (error) {
      console.error('Failed to reject transaction:', error)
    }
  }
  
  const duplicateTransaction = () => {
    router.push({
      name: 'finance-transactions-create',
      query: { duplicate: transaction.value.id }
    })
  }
  
  const deleteTransaction = async () => {
    try {
      await financeStore.deleteTransaction(transaction.value.id)
      showDeleteModal.value = false
      router.push({ name: 'finance-transactions' })
    } catch (error) {
      console.error('Failed to delete transaction:', error)
    }
  }
  
  onMounted(async () => {
    try {
      const data = await financeStore.fetchTransaction(route.params.id)
      transaction.value = data
    } catch (error) {
      console.error('Failed to load transaction:', error)
    }
    
    // Load related transactions
    if (transaction.value.party) {
      relatedTransactions.value = await financeStore.fetchRelatedTransactions(
        transaction.value.id,
        { limit: 5 }
      )
    }
  })
  </script>