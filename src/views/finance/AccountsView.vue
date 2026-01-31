<template>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Hisoblar</h1>
          <p class="text-gray-600 mt-1">Bank hisoblari va kassa boshqaruvi</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="syncAccounts"
            class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            <ArrowPathIcon class="w-5 h-5 inline mr-2" />
            Sinxronlashtirish
          </button>
          <button
            @click="showAddModal = true"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Yangi hisob
          </button>
        </div>
      </div>
  
      <!-- Overview Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Jami balans"
          :value="formatCurrency(stats.totalBalance)"
          :change="stats.balanceChange"
          icon="BanknotesIcon"
          color="blue"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              {{ stats.activeAccounts }} ta faol hisob
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Bank hisoblari"
          :value="formatCurrency(stats.bankBalance)"
          icon="BuildingLibraryIcon"
          color="green"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              {{ stats.bankAccounts }} ta hisob
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Kassa"
          :value="formatCurrency(stats.cashBalance)"
          icon="BanknotesIcon"
          color="purple"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              {{ stats.cashAccounts }} ta kassa
            </p>
          </template>
        </StatCard>
  
        <StatCard
          title="Bu oy tranzaksiyalar"
          :value="stats.transactionsThisMonth"
          :change="stats.transactionsChange"
          icon="ArrowsRightLeftIcon"
          color="orange"
        >
          <template #footer>
            <p class="text-xs text-gray-600 mt-2">
              Hajm: {{ formatCurrency(stats.transactionsVolume) }}
            </p>
          </template>
        </StatCard>
      </div>
  
      <!-- Filters -->
      <div class="flex items-center space-x-4">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition',
            activeFilter === filter.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
  
      <!-- Accounts Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="account in filteredAccounts"
          :key="account.id"
          @click="viewAccountDetails(account)"
          :class="[
            'p-6 rounded-lg border-2 cursor-pointer transition hover:shadow-lg',
            getAccountBorderColor(account.type)
          ]"
        >
          <!-- Account Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div :class="[
                'w-12 h-12 rounded-full flex items-center justify-center',
                getAccountBgColor(account.type)
              ]">
                <component :is="getAccountIcon(account.type)" :class="[
                  'w-6 h-6',
                  getAccountIconColor(account.type)
                ]" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ account.name }}</h3>
                <p class="text-sm text-gray-600">{{ account.accountNumber }}</p>
              </div>
            </div>
            <Badge :color="getStatusColor(account.status)">
              {{ getStatusText(account.status) }}
            </Badge>
          </div>
  
          <!-- Balance -->
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-1">Balans</p>
            <p class="text-3xl font-bold text-gray-900">
              {{ formatCurrency(account.balance) }}
            </p>
            <div class="flex items-center space-x-4 mt-2 text-sm">
              <span :class="[
                'flex items-center',
                account.change >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                <component 
                  :is="account.change >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon" 
                  class="w-4 h-4 mr-1" 
                />
                {{ Math.abs(account.change) }}%
              </span>
              <span class="text-gray-600">Bu oy</span>
            </div>
          </div>
  
          <!-- Quick Stats -->
          <div class="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p class="text-xs text-gray-600">Kirim</p>
              <p class="text-sm font-semibold text-green-600">
                +{{ formatCurrency(account.monthlyIncome) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-600">Chiqim</p>
              <p class="text-sm font-semibold text-red-600">
                -{{ formatCurrency(account.monthlyExpense) }}
              </p>
            </div>
          </div>
  
          <!-- Account Details -->
          <div class="mt-4 pt-4 border-t space-y-2 text-sm">
            <div v-if="account.bank" class="flex justify-between">
              <span class="text-gray-600">Bank:</span>
              <span class="font-medium text-gray-900">{{ account.bank }}</span>
            </div>
            <div v-if="account.currency" class="flex justify-between">
              <span class="text-gray-600">Valyuta:</span>
              <span class="font-medium text-gray-900">{{ account.currency }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tranzaksiyalar:</span>
              <span class="font-medium text-gray-900">{{ account.transactionCount }}</span>
            </div>
            <div v-if="account.lastTransaction" class="flex justify-between">
              <span class="text-gray-600">Oxirgi:</span>
              <span class="font-medium text-gray-900">{{ account.lastTransaction }}</span>
            </div>
          </div>
  
          <!-- Quick Actions -->
          <div class="flex space-x-2 mt-4">
            <button
              @click.stop="showTransferModal(account)"
              class="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              O'tkazma
            </button>
            <button
              @click.stop="showEditModal(account)"
              class="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Tahrirlash
            </button>
          </div>
        </div>
      </div>
  
      <!-- Empty State -->
      <div v-if="filteredAccounts.length === 0" class="text-center py-12">
        <BanknotesIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Hisob topilmadi</h3>
        <p class="text-gray-600 mb-4">Yangi hisob qo'shing</p>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Yangi hisob
        </button>
      </div>
  
      <!-- Add/Edit Account Modal -->
      <Modal v-model="showAddModal" :title="editingAccount ? 'Hisobni tahrirlash' : 'Yangi hisob'">
        <form @submit.prevent="saveAccount" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Turi <span class="text-red-600">*</span>
            </label>
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="type in accountTypes"
                :key="type.value"
                @click="accountForm.type = type.value"
                :class="[
                  'p-4 border-2 rounded-lg cursor-pointer transition text-center',
                  accountForm.type === type.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                ]"
              >
                <component 
                  :is="type.icon" 
                  :class="[
                    'w-8 h-8 mx-auto mb-2',
                    accountForm.type === type.value ? 'text-blue-600' : 'text-gray-400'
                  ]" 
                />
                <p :class="[
                  'text-sm font-medium',
                  accountForm.type === type.value ? 'text-blue-900' : 'text-gray-700'
                ]">
                  {{ type.label }}
                </p>
              </div>
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nomi <span class="text-red-600">*</span>
            </label>
            <input
              v-model="accountForm.name"
              type="text"
              placeholder="Masalan: Asosiy hisob"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
  
          <div v-if="accountForm.type === 'bank'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Bank nomi
            </label>
            <input
              v-model="accountForm.bank"
              type="text"
              placeholder="Masalan: Xalq Bank"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Hisob raqami
            </label>
            <input
              v-model="accountForm.accountNumber"
              type="text"
              placeholder="2020 1234 5678 9012"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Valyuta
              </label>
              <select
                v-model="accountForm.currency"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="UZS">UZS - O'zbek so'm</option>
                <option value="USD">USD - Dollar</option>
                <option value="EUR">EUR - Yevro</option>
                <option value="RUB">RUB - Rubl</option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Boshlang'ich balans
              </label>
              <input
                v-model.number="accountForm.initialBalance"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tavsif
            </label>
            <textarea
              v-model="accountForm.description"
              rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            ></textarea>
          </div>
  
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Saqlash
            </button>
          </div>
        </form>
      </Modal>
  
      <!-- Transfer Modal -->
      <Modal v-model="showTransferModalOpen" title="Pul o'tkazish">
        <form @submit.prevent="executeTransfer" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Kimdan
            </label>
            <select
              v-model="transferForm.fromAccount"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Tanlang</option>
              <option v-for="acc in accounts" :key="acc.id" :value="acc.id">
                {{ acc.name }} - {{ formatCurrency(acc.balance) }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Kimga
            </label>
            <select
              v-model="transferForm.toAccount"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Tanlang</option>
              <option 
                v-for="acc in accounts" 
                :key="acc.id" 
                :value="acc.id"
                :disabled="acc.id === transferForm.fromAccount"
              >
                {{ acc.name }} - {{ formatCurrency(acc.balance) }}
              </option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Summa <span class="text-red-600">*</span>
            </label>
            <input
              v-model.number="transferForm.amount"
              type="number"
              min="0"
              step="1000"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Izoh
            </label>
            <textarea
              v-model="transferForm.note"
              rows="2"
              placeholder="O'tkazma haqida..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            ></textarea>
          </div>
  
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showTransferModalOpen = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              :disabled="!transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              O'tkazish
            </button>
          </div>
        </form>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useFinanceStore } from '@/stores/finance'
  import {
    ArrowPathIcon,
    BanknotesIcon,
    BuildingLibraryIcon,
    ArrowsRightLeftIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CreditCardIcon,
    WalletIcon
  } from '@heroicons/vue/24/outline'
  import StatCard from '@/components/common/cards/StatCard.vue'
  import Badge from '@/components/common/feedback/Badge.vue'
  import Modal from '@/components/common/overlays/Modal.vue'
  
  const router = useRouter()
  const financeStore = useFinanceStore()
  
  const activeFilter = ref('all')
  const showAddModal = ref(false)
  const showTransferModalOpen = ref(false)
  const editingAccount = ref(null)
  
  const stats = ref({
    totalBalance: 245000000,
    balanceChange: 12.5,
    activeAccounts: 8,
    bankBalance: 195000000,
    bankAccounts: 5,
    cashBalance: 50000000,
    cashAccounts: 3,
    transactionsThisMonth: 342,
    transactionsChange: 8.3,
    transactionsVolume: 850000000
  })
  
  const filters = [
    { value: 'all', label: 'Barchasi' },
    { value: 'bank', label: 'Bank hisoblari' },
    { value: 'cash', label: 'Kassa' },
    { value: 'card', label: 'Kartalar' }
  ]
  
  const accountTypes = [
    { value: 'bank', label: 'Bank', icon: BuildingLibraryIcon },
    { value: 'cash', label: 'Kassa', icon: BanknotesIcon },
    { value: 'card', label: 'Karta', icon: CreditCardIcon }
  ]
  
  const accounts = ref([])
  
  const accountForm = reactive({
    type: 'bank',
    name: '',
    bank: '',
    accountNumber: '',
    currency: 'UZS',
    initialBalance: 0,
    description: ''
  })
  
  const transferForm = reactive({
    fromAccount: '',
    toAccount: '',
    amount: 0,
    note: ''
  })
  
  const filteredAccounts = computed(() => {
    if (activeFilter.value === 'all') return accounts.value
    return accounts.value.filter(acc => acc.type === activeFilter.value)
  })
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  const getAccountBorderColor = (type) => {
    const colors = {
      bank: 'border-blue-200 hover:border-blue-300',
      cash: 'border-green-200 hover:border-green-300',
      card: 'border-purple-200 hover:border-purple-300'
    }
    return colors[type] || 'border-gray-200'
  }
  
  const getAccountBgColor = (type) => {
    const colors = {
      bank: 'bg-blue-100',
      cash: 'bg-green-100',
      card: 'bg-purple-100'
    }
    return colors[type] || 'bg-gray-100'
  }
  
  const getAccountIconColor = (type) => {
    const colors = {
      bank: 'text-blue-600',
      cash: 'text-green-600',
      card: 'text-purple-600'
    }
    return colors[type] || 'text-gray-600'
  }
  
  const getAccountIcon = (type) => {
    const icons = {
      bank: BuildingLibraryIcon,
      cash: BanknotesIcon,
      card: CreditCardIcon
    }
    return icons[type] || WalletIcon
  }
  
  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      inactive: 'gray',
      blocked: 'red'
    }
    return colors[status] || 'gray'
  }
  
  const getStatusText = (status) => {
    const texts = {
      active: 'Faol',
      inactive: 'Nofaol',
      blocked: 'Bloklangan'
    }
    return texts[status] || status
  }
  
  const viewAccountDetails = (account) => {
    router.push(`/finance/accounts/${account.id}`)
  }
  
  const showEditModal = (account) => {
    editingAccount.value = account
    Object.assign(accountForm, account)
    showAddModal.value = true
  }
  
  const showTransferModal = (account) => {
    transferForm.fromAccount = account.id
    showTransferModalOpen.value = true
  }
  
  const saveAccount = async () => {
    try {
      if (editingAccount.value) {
        await financeStore.updateAccount(editingAccount.value.id, accountForm)
      } else {
        await financeStore.createAccount(accountForm)
      }
      showAddModal.value = false
      editingAccount.value = null
      loadAccounts()
    } catch (error) {
      console.error('Failed to save account:', error)
    }
  }
  
  const executeTransfer = async () => {
    try {
      await financeStore.transferFunds(transferForm)
      showTransferModalOpen.value = false
      loadAccounts()
    } catch (error) {
      console.error('Failed to transfer funds:', error)
    }
  }
  
  const syncAccounts = async () => {
    try {
      await financeStore.syncAccounts()
      loadAccounts()
    } catch (error) {
      console.error('Failed to sync accounts:', error)
    }
  }
  
  const loadAccounts = async () => {
    try {
      const response = await financeStore.fetchAccounts()
      accounts.value = response.data
    } catch (error) {
      console.error('Failed to load accounts:', error)
    }
  }
  
  onMounted(() => {
    loadAccounts()
  })
  </script>