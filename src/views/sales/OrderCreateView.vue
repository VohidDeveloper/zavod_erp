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
              {{ isEdit ? 'Buyurtmani tahrirlash' : 'Yangi buyurtma' }}
            </h1>
            <p class="text-gray-600 mt-1">Sotish buyurtmasi yaratish</p>
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
            @click="saveOrder"
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
          <!-- Customer Selection -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Mijoz</h3>
            </template>
  
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mijoz tanlash <span class="text-red-600">*</span>
                </label>
                <div class="flex space-x-2">
                  <select
                    v-model="form.customerId"
                    @change="onCustomerChange"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Mijoz tanlang</option>
                    <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                      {{ customer.name }}
                    </option>
                  </select>
                  <button
                    @click="$router.push({ name: 'sales-customers-create' })"
                    class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    + Yangi
                  </button>
                </div>
                <p v-if="errors.customerId" class="text-red-600 text-sm mt-1">{{ errors.customerId }}</p>
              </div>
  
              <!-- Selected Customer Info -->
              <div v-if="selectedCustomer" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-gray-600">Telefon:</p>
                    <p class="font-medium text-gray-900">{{ selectedCustomer.phone }}</p>
                  </div>
                  <div v-if="selectedCustomer.discount">
                    <p class="text-gray-600">Chegirma:</p>
                    <p class="font-medium text-green-600">{{ selectedCustomer.discount }}%</p>
                  </div>
                  <div v-if="selectedCustomer.debt">
                    <p class="text-gray-600">Qarz:</p>
                    <p class="font-medium text-red-600">{{ formatCurrency(selectedCustomer.debt) }}</p>
                  </div>
                  <div v-if="selectedCustomer.creditLimit">
                    <p class="text-gray-600">Kredit limiti:</p>
                    <p class="font-medium text-gray-900">{{ formatCurrency(selectedCustomer.creditLimit) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
  
          <!-- Order Items -->
          <BaseCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Mahsulotlar</h3>
                <button
                  @click="showProductModal = true"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Mahsulot qo'shish
                </button>
              </div>
            </template>
  
            <div class="space-y-3">
              <div
                v-for="(item, index) in form.items"
                :key="item.id"
                class="p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex items-start space-x-4">
                  <div class="flex-1 grid grid-cols-12 gap-4">
                    <!-- Product Info -->
                    <div class="col-span-4">
                      <p class="font-medium text-gray-900">{{ item.product.name }}</p>
                      <p class="text-sm text-gray-600">{{ item.product.sku }}</p>
                      <p class="text-xs text-gray-500 mt-1">
                        Omborda: {{ item.product.stock }} {{ item.product.unit }}
                      </p>
                    </div>
  
                    <!-- Quantity -->
                    <div class="col-span-2">
                      <label class="block text-xs text-gray-600 mb-1">Miqdor</label>
                      <input
                        v-model.number="item.quantity"
                        @input="updateItemTotal(index)"
                        type="number"
                        min="1"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
  
                    <!-- Price -->
                    <div class="col-span-2">
                      <label class="block text-xs text-gray-600 mb-1">Narx</label>
                      <input
                        v-model.number="item.price"
                        @input="updateItemTotal(index)"
                        type="number"
                        min="0"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
  
                    <!-- Discount -->
                    <div class="col-span-2">
                      <label class="block text-xs text-gray-600 mb-1">Chegirma (%)</label>
                      <input
                        v-model.number="item.discount"
                        @input="updateItemTotal(index)"
                        type="number"
                        min="0"
                        max="100"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
  
                    <!-- Total -->
                    <div class="col-span-2">
                      <label class="block text-xs text-gray-600 mb-1">Jami</label>
                      <p class="text-lg font-bold text-gray-900 mt-2">
                        {{ formatCurrency(item.total) }}
                      </p>
                    </div>
                  </div>
  
                  <!-- Remove Button -->
                  <button
                    @click="removeItem(index)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
  
              <!-- Empty State -->
              <div v-if="form.items.length === 0" class="text-center py-8 text-gray-500">
                <ShoppingCartIcon class="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p class="text-sm">Mahsulot qo'shing</p>
              </div>
            </div>
          </BaseCard>
  
          <!-- Additional Information -->
          <BaseCard>
            <template #header>
              <h3 class="text-lg font-semibold">Qo'shimcha ma'lumotlar</h3>
            </template>
  
            <div class="space-y-4">
              <!-- Dates -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Buyurtma sanasi <span class="text-red-600">*</span>
                  </label>
                  <input
                    v-model="form.orderDate"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Yetkazib berish sanasi
                  </label>
                  <input
                    v-model="form.deliveryDate"
                    type="date"
                    :min="form.orderDate"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
  
              <!-- Payment Method -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  To'lov usuli <span class="text-red-600">*</span>
                </label>
                <select
                  v-model="form.paymentMethod"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Tanlang</option>
                  <option value="cash">Naqd</option>
                  <option value="bank_transfer">Bank o'tkazmasi</option>
                  <option value="card">Karta</option>
                  <option value="credit">Nasiya</option>
                </select>
              </div>
  
              <!-- Delivery Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Yetkazib berish manzili
                </label>
                <textarea
                  v-model="form.deliveryAddress"
                  rows="2"
                  placeholder="Manzil..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>
  
              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Izoh
                </label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  placeholder="Qo'shimcha izohlar..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                ></textarea>
              </div>
            </div>
          </BaseCard>
        </div>
  
        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Order Summary -->
          <BaseCard class="sticky top-6">
            <h3 class="text-lg font-semibold mb-4">Buyurtma xulasasi</h3>
            
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Mahsulotlar:</span>
                <span class="font-medium text-gray-900">{{ form.items.length }} ta</span>
              </div>
  
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Jami miqdor:</span>
                <span class="font-medium text-gray-900">{{ totalQuantity }}</span>
              </div>
  
              <div class="pt-3 border-t">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal:</span>
                  <span class="font-medium text-gray-900">{{ formatCurrency(subtotal) }}</span>
                </div>
              </div>
  
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Chegirma:</span>
                <span class="font-medium text-red-600">-{{ formatCurrency(totalDiscount) }}</span>
              </div>
  
              <div v-if="form.shippingCost > 0" class="flex justify-between text-sm">
                <span class="text-gray-600">Yetkazib berish:</span>
                <span class="font-medium text-gray-900">{{ formatCurrency(form.shippingCost) }}</span>
              </div>
  
              <div class="pt-3 border-t">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-semibold text-gray-900">Jami:</span>
                  <span class="text-2xl font-bold text-blue-600">{{ formatCurrency(grandTotal) }}</span>
                </div>
              </div>
  
              <!-- Shipping Cost Input -->
              <div class="pt-3 border-t">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Yetkazib berish xarajati
                </label>
                <input
                  v-model.number="form.shippingCost"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </BaseCard>
  
          <!-- Tips -->
          <BaseCard>
            <h3 class="text-sm font-medium text-gray-700 mb-3">Maslahatlar</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Mijozni tanlang</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Mahsulotlarni qo'shing</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Miqdor va narxlarni tekshiring</p>
              </div>
              <div class="flex items-start space-x-2">
                <CheckCircleIcon class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Yetkazib berish sanasini belgilang</p>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
  
      <!-- Product Selection Modal -->
      <Modal v-model="showProductModal" title="Mahsulot tanlash" size="lg">
        <div class="space-y-4">
          <input
            v-model="productSearch"
            type="text"
            placeholder="Mahsulot qidirish..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
  
          <div class="max-h-96 overflow-y-auto space-y-2">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              @click="addProduct(product)"
              class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-sm text-gray-600">{{ product.sku }}</p>
                  <p class="text-xs text-gray-500 mt-1">Omborda: {{ product.stock }} {{ product.unit }}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-gray-900">{{ formatCurrency(product.price) }}</p>
                  <Badge v-if="product.stock <= product.minStock" color="orange" size="sm">
                    Kam
                  </Badge>
                </div>
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
  import { useSalesStore } from '@/stores/sales'
  import {
    ArrowLeftIcon,
    XMarkIcon,
    ShoppingCartIcon,
    CheckCircleIcon
  } from '@heroicons/vue/24/outline'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  
  const route = useRoute()
  const router = useRouter()
  const salesStore = useSalesStore()
  
  const isEdit = computed(() => !!route.params.id)
  const saving = ref(false)
  const showProductModal = ref(false)
  const productSearch = ref('')
  
  const customers = ref([])
  const products = ref([])
  const selectedCustomer = ref(null)
  
  const form = reactive({
    customerId: '',
    items: [],
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    paymentMethod: '',
    deliveryAddress: '',
    notes: '',
    shippingCost: 0
  })
  
  const errors = ref({})
  
  const filteredProducts = computed(() => {
    if (!productSearch.value) return products.value
    const query = productSearch.value.toLowerCase()
    return products.value.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query)
    )
  })
  
  const totalQuantity = computed(() => {
    return form.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
  })
  
  const subtotal = computed(() => {
    return form.items.reduce((sum, item) => sum + (item.total || 0), 0)
  })
  
  const totalDiscount = computed(() => {
    return form.items.reduce((sum, item) => {
      const discount = (item.price * item.quantity * (item.discount || 0)) / 100
      return sum + discount
    }, 0)
  })
  
  const grandTotal = computed(() => {
    return subtotal.value - totalDiscount.value + (form.shippingCost || 0)
  })
  
  const isValid = computed(() => {
    return form.customerId && form.items.length > 0 && form.orderDate && form.paymentMethod
  })
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  const onCustomerChange = () => {
    selectedCustomer.value = customers.value.find(c => c.id === form.customerId)
    if (selectedCustomer.value?.address) {
      form.deliveryAddress = selectedCustomer.value.address
    }
  }
  
  const addProduct = (product) => {
    const existingItem = form.items.find(item => item.product.id === product.id)
    
    if (existingItem) {
      existingItem.quantity++
      updateItemTotal(form.items.indexOf(existingItem))
    } else {
      const discount = selectedCustomer.value?.discount || 0
      const item = {
        id: Date.now(),
        product: product,
        quantity: 1,
        price: product.price,
        discount: discount,
        total: product.price
      }
      form.items.push(item)
      updateItemTotal(form.items.length - 1)
    }
    
    showProductModal.value = false
    productSearch.value = ''
  }
  
  const removeItem = (index) => {
    form.items.splice(index, 1)
  }
  
  const updateItemTotal = (index) => {
    const item = form.items[index]
    const subtotal = item.price * item.quantity
    const discount = (subtotal * (item.discount || 0)) / 100
    item.total = subtotal - discount
  }
  
  const saveOrder = async () => {
    if (!isValid.value) return
    
    saving.value = true
    try {
      const orderData = {
        ...form,
        subtotal: subtotal.value,
        discount: totalDiscount.value,
        total: grandTotal.value
      }
      
      if (isEdit.value) {
        await salesStore.updateOrder(route.params.id, orderData)
      } else {
        await salesStore.createOrder(orderData)
      }
      
      router.push({ name: 'sales-orders' })
    } catch (error) {
      console.error('Failed to save order:', error)
    } finally {
      saving.value = false
    }
  }
  
  const saveDraft = async () => {
    saving.value = true
    try {
      await salesStore.saveDraft({ ...form, status: 'draft' })
      router.push({ name: 'sales-orders' })
    } finally {
      saving.value = false
    }
  }
  
  onMounted(async () => {
    customers.value = (await salesStore.fetchCustomers()).data
    products.value = (await salesStore.fetchProducts()).data
    
    if (route.query.customerId) {
      form.customerId = route.query.customerId
      onCustomerChange()
    }
    
    if (isEdit.value) {
      const order = await salesStore.fetchOrder(route.params.id)
      Object.assign(form, order)
      onCustomerChange()
    }
  })
  </script>