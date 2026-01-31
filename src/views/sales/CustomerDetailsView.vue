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
              <h1 class="text-2xl font-bold text-gray-900">{{ customer.name }}</h1>
              <Badge :color="getStatusColor(customer.status)">
                {{ getStatusText(customer.status) }}
              </Badge>
              <Badge v-if="customer.isVIP" color="purple">VIP</Badge>
            </div>
            <p class="text-gray-600 mt-1">Mijoz ID: {{ customer.id }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="editCustomer"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <PencilIcon class="w-5 h-5 inline mr-2" />
            Tahrirlash
          </button>
          <button
            @click="showMoreMenu = !showMoreMenu"
            class="p-2 hover:bg-gray-100 rounded-lg relative"
          >
            <EllipsisVerticalIcon class="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
  
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Jami xaridlar"
          :value="formatCurrency(stats.totalPurchases)"
          :change="stats.purchaseChange"
          icon="ShoppingCartIcon"
          color="blue"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">{{ stats.orderCount }} ta buyurtma</p>
          </template>
        </StatCard>
  
        <StatCard
          title="O'rtacha buyurtma"
          :value="formatCurrency(stats.averageOrder)"
          icon="ChartBarIcon"
          color="green"
        />
  
        <StatCard
          title="Qarz"
          :value="formatCurrency(stats.debt)"
          icon="ExclamationTriangleIcon"
          :color="stats.debt > 0 ? 'red' : 'gray'"
        />
  
        <StatCard
          title="Oxirgi xarid"
          :value="stats.lastPurchaseDate"
          icon="CalendarIcon"
          color="purple"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">{{ stats.daysSinceLastPurchase }} kun oldin</p>
          </template>
        </StatCard>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Customer Info -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Mijoz ma'lumotlari</h3>
            </template>
  
            <div class="space-y-4">
              <!-- Contact Info -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Telefon</p>
                  <p class="font-medium text-gray-900 flex items-center">
                    <PhoneIcon class="w-4 h-4 mr-2 text-gray-400" />
                    {{ customer.phone }}
                  </p>
                </div>
                <div v-if="customer.email">
                  <p class="text-sm text-gray-600">Email</p>
                  <p class="font-medium text-gray-900 flex items-center">
                    <EnvelopeIcon class="w-4 h-4 mr-2 text-gray-400" />
                    {{ customer.email }}
                  </p>
                </div>
              </div>
  
              <!-- Address -->
              <div v-if="customer.address">
                <p class="text-sm text-gray-600 mb-1">Manzil</p>
                <p class="font-medium text-gray-900 flex items-start">
                  <MapPinIcon class="w-4 h-4 mr-2 text-gray-400 mt-1" />
                  {{ customer.address }}
                </p>
              </div>
  
              <!-- Company Info (if company) -->
              <div v-if="customer.type === 'company'" class="pt-4 border-t space-y-3">
                <h4 class="font-medium text-gray-900">Kompaniya ma'lumotlari</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div v-if="customer.inn">
                    <p class="text-gray-600">INN:</p>
                    <p class="font-medium text-gray-900">{{ customer.inn }}</p>
                  </div>
                  <div v-if="customer.director">
                    <p class="text-gray-600">Direktor:</p>
                    <p class="font-medium text-gray-900">{{ customer.director }}</p>
                  </div>
                  <div v-if="customer.bankName">
                    <p class="text-gray-600">Bank:</p>
                    <p class="font-medium text-gray-900">{{ customer.bankName }}</p>
                  </div>
                  <div v-if="customer.accountNumber">
                    <p class="text-gray-600">Hisob raqam:</p>
                    <p class="font-medium text-gray-900">{{ customer.accountNumber }}</p>
                  </div>
                </div>
              </div>
  
              <!-- Customer Group & Discount -->
              <div class="pt-4 border-t">
                <div class="grid grid-cols-2 gap-4">
                  <div v-if="customer.customerGroup">
                    <p class="text-sm text-gray-600">Guruh</p>
                    <Badge :color="getGroupColor(customer.customerGroup)">
                      {{ customer.customerGroup }}
                    </Badge>
                  </div>
                  <div v-if="customer.discount">
                    <p class="text-sm text-gray-600">Chegirma</p>
                    <p class="font-medium text-green-600">{{ customer.discount }}%</p>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
  
          <!-- Recent Orders -->
          <BaseCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">So'nggi buyurtmalar</h3>
                <button
                  @click="viewAllOrders"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  Barchasini ko'rish →
                </button>
              </div>
            </template>
  
            <div class="space-y-3">
              <div
                v-for="order in recentOrders"
                :key="order.id"
                @click="viewOrder(order)"
                class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition"
              >
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <p class="font-medium text-gray-900">Buyurtma #{{ order.orderNumber }}</p>
                    <p class="text-sm text-gray-600">{{ order.date }}</p>
                  </div>
                  <Badge :color="getOrderStatusColor(order.status)">
                    {{ getOrderStatusText(order.status) }}
                  </Badge>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-sm text-gray-600">{{ order.itemCount }} ta mahsulot</p>
                  <p class="text-lg font-bold text-gray-900">{{ formatCurrency(order.total) }}</p>
                </div>
              </div>
            </div>
  
            <div v-if="recentOrders.length === 0" class="text-center py-8 text-gray-500">
              <ShoppingCartIcon class="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p class="text-sm">Buyurtmalar mavjud emas</p>
            </div>
          </BaseCard>
  
          <!-- Payment History -->
          <BaseCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">To'lov tarixi</h3>
                <button
                  @click="showPaymentModal = true"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  + To'lov qo'shish
                </button>
              </div>
            </template>
  
            <div class="space-y-2">
              <div
                v-for="payment in paymentHistory"
                :key="payment.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ payment.method }}</p>
                  <p class="text-sm text-gray-600">{{ payment.date }}</p>
                </div>
                <p class="text-lg font-bold text-green-600">+{{ formatCurrency(payment.amount) }}</p>
              </div>
            </div>
  
            <div v-if="paymentHistory.length === 0" class="text-center py-8 text-gray-500">
              <CreditCardIcon class="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p class="text-sm">To'lovlar mavjud emas</p>
            </div>
          </BaseCard>
  
          <!-- Notes -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Izohlar</h3>
            </template>
  
            <div class="space-y-4">
              <div
                v-for="note in notes"
                :key="note.id"
                class="flex space-x-3"
              >
                <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-xs font-semibold text-gray-600">
                    {{ note.user.name.split(' ').map(n => n[0]).join('') }}
                  </span>
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <p class="font-medium text-sm text-gray-900">{{ note.user.name }}</p>
                    <span class="text-xs text-gray-500">{{ note.createdAt }}</span>
                  </div>
                  <p class="text-sm text-gray-700">{{ note.text }}</p>
                </div>
              </div>
  
              <!-- Add Note -->
              <div class="flex space-x-3 pt-4 border-t">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon class="w-4 h-4 text-blue-600" />
                </div>
                <div class="flex-1">
                  <textarea
                    v-model="newNote"
                    rows="2"
                    placeholder="Izoh qo'shish..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  ></textarea>
                  <div class="flex justify-end mt-2">
                    <button
                      @click="addNote"
                      :disabled="!newNote.trim()"
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
                @click="createOrder"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Yangi buyurtma
              </button>
              <button
                @click="createInvoice"
                class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hisob-faktura yaratish
              </button>
              <button
                @click="viewStatement"
                class="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hisobot ko'rish
              </button>
            </div>
          </BaseCard>
  
          <!-- Financial Info -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Moliyaviy ma'lumot</h3>
            </template>
  
            <dl class="space-y-3 text-sm">
              <div>
                <dt class="text-gray-600">Kredit limiti:</dt>
                <dd class="font-medium text-gray-900 mt-1">
                  {{ customer.creditLimit ? formatCurrency(customer.creditLimit) : 'Yo\'q' }}
                </dd>
              </div>
              <div>
                <dt class="text-gray-600">To'lov muddati:</dt>
                <dd class="font-medium text-gray-900 mt-1">{{ customer.paymentTermDays || 0 }} kun</dd>
              </div>
              <div>
                <dt class="text-gray-600">Balans:</dt>
                <dd :class="[
                  'font-medium mt-1',
                  stats.debt > 0 ? 'text-red-600' : 'text-green-600'
                ]">
                  {{ formatCurrency(Math.abs(stats.debt)) }}
                  {{ stats.debt > 0 ? '(qarz)' : stats.debt < 0 ? '(kredit)' : '' }}
                </dd>
              </div>
            </dl>
          </BaseCard>
  
          <!-- Customer Info -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Qo'shimcha</h3>
            </template>
  
            <dl class="space-y-3 text-sm">
              <div>
                <dt class="text-gray-600">Ro'yxatdan o'tgan:</dt>
                <dd class="font-medium text-gray-900 mt-1">{{ customer.createdAt }}</dd>
              </div>
              <div>
                <dt class="text-gray-600">Yaratuvchi:</dt>
                <dd class="font-medium text-gray-900 mt-1">{{ customer.createdBy }}</dd>
              </div>
              <div v-if="customer.source">
                <dt class="text-gray-600">Manba:</dt>
                <dd class="font-medium text-gray-900 mt-1">{{ customer.source }}</dd>
              </div>
            </dl>
          </BaseCard>
  
          <!-- Tags -->
          <BaseCard v-if="customer.tags && customer.tags.length > 0">
            <template #header>
              <h3 class="text-lg font-semibold">Teglar</h3>
            </template>
  
            <div class="flex flex-wrap gap-2">
              <Badge v-for="tag in customer.tags" :key="tag" color="blue">
                {{ tag }}
              </Badge>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSalesStore } from '@/stores/sales'
  import {
    ArrowLeftIcon,
    PencilIcon,
    EllipsisVerticalIcon,
    ShoppingCartIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
    CalendarIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    CreditCardIcon,
    UserIcon
  } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  
  const route = useRoute()
  const router = useRouter()
  const salesStore = useSalesStore()
  
  const showMoreMenu = ref(false)
  const showPaymentModal = ref(false)
  const newNote = ref('')
  
  const customer = ref({
    id: route.params.id,
    name: 'ABC Company',
    type: 'company',
    status: 'active',
    isVIP: true,
    phone: '+998 90 123-45-67',
    email: 'info@abc.uz',
    address: 'Toshkent sh., Yunusobod t., Amir Temur ko\'chasi 123',
    inn: '123456789',
    director: 'Aliyev Ali',
    bankName: 'Xalq Bank',
    accountNumber: '2020 1234 5678 9012',
    customerGroup: 'VIP',
    discount: 10,
    creditLimit: 50000000,
    paymentTermDays: 30,
    createdAt: '2023-05-15',
    createdBy: 'Nodira Karimova',
    source: 'Website',
    tags: ['Ulgurji', 'Doimiy']
  })
  
  const stats = ref({
    totalPurchases: 125000000,
    purchaseChange: 15.3,
    orderCount: 45,
    averageOrder: 2777778,
    debt: 5000000,
    lastPurchaseDate: '2024-01-25',
    daysSinceLastPurchase: 3
  })
  
  const recentOrders = ref([])
  const paymentHistory = ref([])
  const notes = ref([])
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  const getStatusColor = (status) => {
    return { active: 'green', inactive: 'gray', blocked: 'red' }[status] || 'gray'
  }
  
  const getStatusText = (status) => {
    return { active: 'Faol', inactive: 'Nofaol', blocked: 'Bloklangan' }[status] || status
  }
  
  const getGroupColor = (group) => {
    const colors = { VIP: 'purple', regular: 'blue', wholesale: 'green', retail: 'orange' }
    return colors[group] || 'gray'
  }
  
  const getOrderStatusColor = (status) => {
    const colors = { pending: 'orange', processing: 'blue', completed: 'green', cancelled: 'red' }
    return colors[status] || 'gray'
  }
  
  const getOrderStatusText = (status) => {
    const texts = { pending: 'Kutilmoqda', processing: 'Jarayonda', completed: 'Tugatilgan', cancelled: 'Bekor qilingan' }
    return texts[status] || status
  }
  
  const editCustomer = () => {
    router.push(`/sales/customers/${customer.value.id}/edit`)
  }
  
  const viewOrder = (order) => {
    router.push(`/sales/orders/${order.id}`)
  }
  
  const viewAllOrders = () => {
    router.push({ name: 'sales-orders', query: { customerId: customer.value.id } })
  }
  
  const createOrder = () => {
    router.push({ name: 'sales-orders-create', query: { customerId: customer.value.id } })
  }
  
  const createInvoice = () => {
    router.push({ name: 'finance-invoices-create', query: { customerId: customer.value.id } })
  }
  
  const viewStatement = () => {
    router.push(`/sales/customers/${customer.value.id}/statement`)
  }
  
  const addNote = async () => {
    if (!newNote.value.trim()) return
    
    try {
      await salesStore.addCustomerNote(customer.value.id, newNote.value)
      newNote.value = ''
      // Reload notes
    } catch (error) {
      console.error('Failed to add note:', error)
    }
  }
  
  onMounted(async () => {
    try {
      const data = await salesStore.fetchCustomer(route.params.id)
      customer.value = data
      
      recentOrders.value = await salesStore.fetchCustomerOrders(route.params.id, { limit: 5 })
      paymentHistory.value = await salesStore.fetchCustomerPayments(route.params.id, { limit: 5 })
      notes.value = await salesStore.fetchCustomerNotes(route.params.id)
    } catch (error) {
      console.error('Failed to load customer:', error)
    }
  })
  </script>