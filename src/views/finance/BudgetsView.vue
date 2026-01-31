<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Byudjetlar</h1>
          <p class="text-gray-600 mt-1">Xarajatlarni rejalashtirish va nazorat qilish</p>
        </div>
        <div class="flex items-center space-x-3">
          <select
            v-model="selectedPeriod"
            @change="loadBudgets"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="current">Joriy oy</option>
            <option value="next">Keyingi oy</option>
            <option value="quarter">Chorak</option>
            <option value="year">Yil</option>
          </select>
          <button
            @click="showAddModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Yangi byudjet
          </button>
        </div>
      </div>
  
      <!-- Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <BaseCard class="text-center">
          <p class="text-sm text-gray-600 mb-2">Jami byudjet</p>
          <p class="text-3xl font-bold text-blue-600">
            {{ formatCurrency(overview.totalBudget) }}
          </p>
        </BaseCard>
  
        <BaseCard class="text-center">
          <p class="text-sm text-gray-600 mb-2">Sarflangan</p>
          <p class="text-3xl font-bold text-orange-600">
            {{ formatCurrency(overview.spent) }}
          </p>
          <p class="text-xs text-gray-600 mt-1">{{ overview.spentPercentage }}%</p>
        </BaseCard>
  
        <BaseCard class="text-center">
          <p class="text-sm text-gray-600 mb-2">Qolgan</p>
          <p class="text-3xl font-bold text-green-600">
            {{ formatCurrency(overview.remaining) }}
          </p>
          <p class="text-xs text-gray-600 mt-1">{{ overview.remainingPercentage }}%</p>
        </BaseCard>
  
        <BaseCard class="text-center">
          <p class="text-sm text-gray-600 mb-2">Ogohlantirishlar</p>
          <p class="text-3xl font-bold text-red-600">{{ overview.warnings }}</p>
          <p class="text-xs text-gray-600 mt-1">Oshib ketgan</p>
        </BaseCard>
      </div>
  
      <!-- Overall Progress -->
      <BaseCard>
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Umumiy holat</h3>
            <p class="text-sm text-gray-600">
              {{ overview.spent > overview.totalBudget ? 'Byudjet oshib ketdi!' : 'Byudjet chegarasida' }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-gray-900">{{ overview.spentPercentage }}%</p>
            <p class="text-sm text-gray-600">foydalanildi</p>
          </div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4">
          <div
            :class="[
              'h-4 rounded-full transition-all',
              overview.spentPercentage >= 100 ? 'bg-red-600' :
              overview.spentPercentage >= 80 ? 'bg-orange-600' :
              'bg-green-600'
            ]"
            :style="{ width: `${Math.min(overview.spentPercentage, 100)}%` }"
          ></div>
        </div>
      </BaseCard>
  
      <!-- Budget List -->
      <div class="space-y-4">
        <div
          v-for="budget in budgets"
          :key="budget.id"
          class="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg cursor-pointer transition"
          @click="viewBudgetDetails(budget)"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div :class="['w-12 h-12 rounded-full flex items-center justify-center', getCategoryBgColor(budget.category)]">
                <component :is="getCategoryIcon(budget.category)" :class="['w-6 h-6', getCategoryIconColor(budget.category)]" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ budget.name }}</h3>
                <p class="text-sm text-gray-600">{{ budget.category }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <Badge :color="getStatusColor(budget.status)">
                {{ getStatusText(budget.status) }}
              </Badge>
              <button @click.stop="showEditModal(budget)" class="text-gray-400 hover:text-gray-600">
                <PencilIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
  
          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p class="text-xs text-gray-600">Byudjet</p>
              <p class="text-lg font-bold text-gray-900">{{ formatCurrency(budget.allocated) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600">Sarflangan</p>
              <p class="text-lg font-bold text-orange-600">{{ formatCurrency(budget.spent) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-600">Qolgan</p>
              <p :class="['text-lg font-bold', budget.remaining < 0 ? 'text-red-600' : 'text-green-600']">
                {{ formatCurrency(Math.abs(budget.remaining)) }}{{ budget.remaining < 0 ? ' oshiq' : '' }}
              </p>
            </div>
          </div>
  
          <!-- Progress -->
          <div class="mb-4">
            <div class="flex items-center justify-between text-sm mb-2">
              <span class="text-gray-600">{{ budget.spentPercentage }}% foydalanildi</span>
              <span :class="['font-medium', budget.spentPercentage >= 100 ? 'text-red-600' : budget.spentPercentage >= 80 ? 'text-orange-600' : 'text-green-600']">
                {{ budget.daysLeft }} kun qoldi
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                :class="['h-3 rounded-full transition-all', budget.spentPercentage >= 100 ? 'bg-red-600' : budget.spentPercentage >= 80 ? 'bg-orange-600' : 'bg-green-600']"
                :style="{ width: `${Math.min(budget.spentPercentage, 100)}%` }"
              ></div>
            </div>
          </div>
  
          <!-- Footer -->
          <div class="flex items-center justify-between text-sm pt-4 border-t">
            <span class="text-gray-600">Davr: {{ budget.period }}</span>
            <div class="flex space-x-2">
              <button @click.stop="viewTransactions(budget)" class="text-blue-600 hover:text-blue-700">
                Tranzaksiyalar
              </button>
            </div>
          </div>
  
          <!-- Warnings -->
          <div v-if="budget.spentPercentage >= 100" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center space-x-2">
              <ExclamationTriangleIcon class="w-5 h-5 text-red-600" />
              <p class="text-sm text-red-800">Byudjet {{ formatCurrency(Math.abs(budget.remaining)) }} ga oshib ketdi!</p>
            </div>
          </div>
          <div v-else-if="budget.spentPercentage >= 80" class="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div class="flex items-center space-x-2">
              <ExclamationTriangleIcon class="w-5 h-5 text-orange-600" />
              <p class="text-sm text-orange-800">Byudjetning {{ budget.spentPercentage }}% ishlatildi!</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Empty State -->
      <div v-if="budgets.length === 0" class="text-center py-12">
        <ChartBarIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Byudjet yo'q</h3>
        <p class="text-gray-600 mb-4">Xarajatlarni boshqarish uchun byudjet yarating</p>
        <button @click="showAddModal = true" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Yangi byudjet
        </button>
      </div>
  
      <!-- Modal -->
      <Modal v-model="showAddModal" :title="editingBudget ? 'Tahrirlash' : 'Yangi byudjet'">
        <form @submit.prevent="saveBudget" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nomi <span class="text-red-600">*</span></label>
            <input v-model="budgetForm.name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kategoriya <span class="text-red-600">*</span></label>
            <select v-model="budgetForm.category" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
              <option value="">Tanlang</option>
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Summa <span class="text-red-600">*</span></label>
            <input v-model.number="budgetForm.allocated" type="number" min="0" step="1000" class="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Davr</label>
            <select v-model="budgetForm.period" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="monthly">Oylik</option>
              <option value="quarterly">Choraklik</option>
              <option value="yearly">Yillik</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showAddModal = false" class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              Bekor qilish
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Saqlash
            </button>
          </div>
        </form>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useFinanceStore } from '@/stores/finance'
  import {
    ChartBarIcon,
    ExclamationTriangleIcon,
    PencilIcon,
    ShoppingBagIcon,
    TruckIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
    WrenchScrewdriverIcon
  } from '@heroicons/vue/24/outline'
  import BaseCard from '@/components/common/cards/BaseCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  
  const router = useRouter()
  const financeStore = useFinanceStore()
  
  const selectedPeriod = ref('current')
  const showAddModal = ref(false)
  const editingBudget = ref(null)
  
  const overview = ref({
    totalBudget: 150000000,
    spent: 112500000,
    spentPercentage: 75,
    remaining: 37500000,
    remainingPercentage: 25,
    warnings: 2
  })
  
  const categories = [
    { value: 'operations', label: 'Operatsion' },
    { value: 'salaries', label: 'Ish haqi' },
    { value: 'materials', label: 'Materiallar' },
    { value: 'maintenance', label: 'Texnik xizmat' },
    { value: 'marketing', label: 'Marketing' }
  ]
  
  const budgets = ref([])
  
  const budgetForm = reactive({
    name: '',
    category: '',
    allocated: 0,
    period: 'monthly'
  })
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', minimumFractionDigits: 0 }).format(value)
  }
  
  const getCategoryIcon = (category) => {
    const icons = { operations: BuildingOfficeIcon, salaries: UserGroupIcon, materials: ShoppingBagIcon, maintenance: WrenchScrewdriverIcon, marketing: ChartBarIcon }
    return icons[category] || BuildingOfficeIcon
  }
  
  const getCategoryBgColor = (category) => {
    const colors = { operations: 'bg-blue-100', salaries: 'bg-purple-100', materials: 'bg-green-100', maintenance: 'bg-orange-100', marketing: 'bg-pink-100' }
    return colors[category] || 'bg-gray-100'
  }
  
  const getCategoryIconColor = (category) => {
    const colors = { operations: 'text-blue-600', salaries: 'text-purple-600', materials: 'text-green-600', maintenance: 'text-orange-600', marketing: 'text-pink-600' }
    return colors[category] || 'text-gray-600'
  }
  
  const getStatusColor = (status) => {
    return { active: 'green', warning: 'orange', exceeded: 'red' }[status] || 'gray'
  }
  
  const getStatusText = (status) => {
    return { active: 'Faol', warning: 'Ogohlantirish', exceeded: 'Oshib ketgan' }[status] || status
  }
  
  const viewBudgetDetails = (budget) => router.push(`/finance/budgets/${budget.id}`)
  const viewTransactions = (budget) => router.push({ name: 'finance-transactions', query: { budgetId: budget.id } })
  const showEditModal = (budget) => { editingBudget.value = budget; Object.assign(budgetForm, budget); showAddModal.value = true }
  
  const saveBudget = async () => {
    try {
      if (editingBudget.value) await financeStore.updateBudget(editingBudget.value.id, budgetForm)
      else await financeStore.createBudget(budgetForm)
      showAddModal.value = false
      editingBudget.value = null
      loadBudgets()
    } catch (error) {
      console.error('Failed to save budget:', error)
    }
  }
  
  const loadBudgets = async () => {
    try {
      const response = await financeStore.fetchBudgets({ period: selectedPeriod.value })
      budgets.value = response.data
    } catch (error) {
      console.error('Failed to load budgets:', error)
    }
  }
  
  onMounted(() => loadBudgets())
  </script>