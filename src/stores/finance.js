import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFinanceStore = defineStore('finance', () => {
  // State
  const transactions = ref([])
  const accounts = ref([])
  const categories = ref([])
  const stats = ref({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    thisMonthIncome: 0,
    thisMonthExpense: 0,
    profit: 0,
    profitMargin: 0,
    cashFlow: 0
  })
  
  const loading = ref(false)
  const error = ref(null)
  
  // Mock data
  const mockTransactions = [
    {
      id: 1,
      type: 'income',
      amount: 5000000,
      date: '2024-01-29',
      category_id: 1,
      category: { id: 1, name: 'Mahsulot sotish' },
      account_id: 1,
      account: { id: 1, name: 'Asosiy hisob - UZS' },
      payment_method: 'transfer',
      reference_number: 'INV-001',
      counterparty: 'Plastik Savdo',
      description: 'Plastik qoplar sotildi',
      tags: ['savdo', 'mahsulot'],
      status: 'completed',
      created_at: '2024-01-29T10:00:00',
      created_by: { name: 'Admin' }
    },
    {
      id: 2,
      type: 'expense',
      amount: 3500000,
      date: '2024-01-28',
      category_id: 5,
      category: { id: 5, name: 'Xomashyo' },
      account_id: 2,
      account: { id: 2, name: 'Naqd pul - Kassa' },
      payment_method: 'cash',
      reference_number: 'PO-045',
      counterparty: 'Polimerplast',
      description: 'Plastik granula xarid qilindi',
      tags: ['xomashyo', 'ishlab chiqarish'],
      status: 'completed',
      created_at: '2024-01-28T14:30:00',
      created_by: { name: 'Manager' }
    },
    {
      id: 3,
      type: 'expense',
      amount: 2000000,
      date: '2024-01-27',
      category_id: 6,
      category: { id: 6, name: 'Ish haqi' },
      account_id: 1,
      account: { id: 1, name: 'Asosiy hisob - UZS' },
      payment_method: 'transfer',
      reference_number: 'SAL-JAN24',
      counterparty: 'Xodimlar',
      description: 'Yanvar oylik maoshi',
      tags: ['ish haqi', 'xodimlar'],
      status: 'completed',
      created_at: '2024-01-27T09:00:00',
      created_by: { name: 'Admin' }
    }
  ]
  
  const mockStats = {
    totalIncome: 450000000,
    totalExpense: 320000000,
    balance: 130000000,
    thisMonthIncome: 125000000,
    thisMonthExpense: 85000000,
    profit: 40000000,
    profitMargin: 32,
    cashFlow: 40000000,
    incomeByCategory: [
      { category: 'Mahsulot sotish', amount: 380000000, percentage: 84 },
      { category: 'Xizmat ko\'rsatish', amount: 50000000, percentage: 11 },
      { category: 'Boshqa kirimlar', amount: 20000000, percentage: 5 }
    ],
    expenseByCategory: [
      { category: 'Xomashyo', amount: 150000000, percentage: 47 },
      { category: 'Ish haqi', amount: 80000000, percentage: 25 },
      { category: 'Kommunal', amount: 40000000, percentage: 13 },
      { category: 'Boshqa', amount: 50000000, percentage: 15 }
    ]
  }
  
  const mockAccounts = [
    { id: 1, name: 'Asosiy hisob - UZS', number: '****1234', balance: 85000000, currency: 'UZS' },
    { id: 2, name: 'Naqd pul - Kassa', number: 'CASH', balance: 12000000, currency: 'UZS' },
    { id: 3, name: 'Dollar hisobi - USD', number: '****5678', balance: 15000, currency: 'USD' },
    { id: 4, name: 'Plastik karta', number: '****9012', balance: 8000000, currency: 'UZS' }
  ]
  
  const mockCategories = [
    // Income categories
    { id: 1, name: 'Mahsulot sotish', type: 'income', icon: 'ShoppingBag' },
    { id: 2, name: 'Xizmat ko\'rsatish', type: 'income', icon: 'Briefcase' },
    { id: 3, name: 'Investitsiya', type: 'income', icon: 'TrendingUp' },
    { id: 4, name: 'Boshqa kirimlar', type: 'income', icon: 'Plus' },
    // Expense categories
    { id: 5, name: 'Xomashyo', type: 'expense', icon: 'Package' },
    { id: 6, name: 'Ish haqi', type: 'expense', icon: 'Users' },
    { id: 7, name: 'Kommunal xizmatlar', type: 'expense', icon: 'Zap' },
    { id: 8, name: 'Transport', type: 'expense', icon: 'Truck' },
    { id: 9, name: 'Ofis xarajatlari', type: 'expense', icon: 'Home' },
    { id: 10, name: 'Marketing', type: 'expense', icon: 'Megaphone' },
    { id: 11, name: 'Soliq', type: 'expense', icon: 'FileText' },
    { id: 12, name: 'Boshqa xarajatlar', type: 'expense', icon: 'MoreHorizontal' }
  ]
  
  // Actions
  
  /**
   * Fetch finance statistics
   */
  async function fetchStats() {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/finance/stats')
      await new Promise(resolve => setTimeout(resolve, 300))
      stats.value = mockStats
      return stats.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fetch transactions
   */
  async function fetchTransactions(params = {}) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/finance/transactions', { params })
      await new Promise(resolve => setTimeout(resolve, 300))
      transactions.value = mockTransactions
      return transactions.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Create transaction
   */
  async function createTransaction(data) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/finance/transactions', data)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newTransaction = {
        id: transactions.value.length + 1,
        ...data,
        status: 'completed',
        created_at: new Date().toISOString(),
        created_by: { name: 'Current User' }
      }
      
      transactions.value.unshift(newTransaction)
      
      // Update stats
      if (data.type === 'income') {
        stats.value.totalIncome += data.amount
        stats.value.thisMonthIncome += data.amount
      } else {
        stats.value.totalExpense += data.amount
        stats.value.thisMonthExpense += data.amount
      }
      stats.value.balance = stats.value.totalIncome - stats.value.totalExpense
      
      return newTransaction
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Update transaction
   */
  async function updateTransaction(id, data) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await api.put(`/finance/transactions/${id}`, data)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = transactions.value.findIndex(t => t.id === id)
      if (index > -1) {
        const oldAmount = transactions.value[index].amount
        const oldType = transactions.value[index].type
        
        transactions.value[index] = {
          ...transactions.value[index],
          ...data,
          updated_at: new Date().toISOString(),
          updated_by: { name: 'Current User' }
        }
        
        // Update stats
        if (oldType === 'income') {
          stats.value.totalIncome -= oldAmount
          stats.value.thisMonthIncome -= oldAmount
        } else {
          stats.value.totalExpense -= oldAmount
          stats.value.thisMonthExpense -= oldAmount
        }
        
        if (data.type === 'income') {
          stats.value.totalIncome += data.amount
          stats.value.thisMonthIncome += data.amount
        } else {
          stats.value.totalExpense += data.amount
          stats.value.thisMonthExpense += data.amount
        }
        
        stats.value.balance = stats.value.totalIncome - stats.value.totalExpense
      }
      
      return transactions.value[index]
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Delete transaction
   */
  async function deleteTransaction(id) {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // await api.delete(`/finance/transactions/${id}`)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const index = transactions.value.findIndex(t => t.id === id)
      if (index > -1) {
        const transaction = transactions.value[index]
        
        // Update stats
        if (transaction.type === 'income') {
          stats.value.totalIncome -= transaction.amount
          stats.value.thisMonthIncome -= transaction.amount
        } else {
          stats.value.totalExpense -= transaction.amount
          stats.value.thisMonthExpense -= transaction.amount
        }
        
        stats.value.balance = stats.value.totalIncome - stats.value.totalExpense
        
        transactions.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fetch accounts
   */
  async function fetchAccounts() {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300))
      accounts.value = mockAccounts
      return accounts.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fetch categories
   */
  async function fetchCategories() {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300))
      categories.value = mockCategories
      return categories.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Get transaction by ID
   */
  function getTransactionById(id) {
    return transactions.value.find(t => t.id === id)
  }
  
  /**
   * Get account by ID
   */
  function getAccountById(id) {
    return accounts.value.find(a => a.id === id)
  }
  
  /**
   * Get category by ID
   */
  function getCategoryById(id) {
    return categories.value.find(c => c.id === id)
  }
  
  /**
   * Get income transactions
   */
  function getIncomeTransactions() {
    return transactions.value.filter(t => t.type === 'income')
  }
  
  /**
   * Get expense transactions
   */
  function getExpenseTransactions() {
    return transactions.value.filter(t => t.type === 'expense')
  }
  
  /**
   * Search transactions
   */
  function searchTransactions(query) {
    if (!query) return transactions.value
    
    const lowerQuery = query.toLowerCase()
    return transactions.value.filter(transaction => {
      return transaction.description?.toLowerCase().includes(lowerQuery) ||
             transaction.counterparty?.toLowerCase().includes(lowerQuery) ||
             transaction.reference_number?.toLowerCase().includes(lowerQuery) ||
             transaction.category?.name?.toLowerCase().includes(lowerQuery)
    })
  }
  
  /**
   * Filter transactions by date range
   */
  function filterByDateRange(startDate, endDate) {
    return transactions.value.filter(t => {
      const date = new Date(t.date)
      return date >= new Date(startDate) && date <= new Date(endDate)
    })
  }
  
  /**
   * Filter transactions by category
   */
  function filterByCategory(categoryId) {
    return transactions.value.filter(t => t.category_id === categoryId)
  }
  
  /**
   * Reset store
   */
  function reset() {
    transactions.value = []
    accounts.value = []
    categories.value = []
    stats.value = {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      thisMonthIncome: 0,
      thisMonthExpense: 0,
      profit: 0,
      profitMargin: 0,
      cashFlow: 0
    }
    loading.value = false
    error.value = null
  }
  
  return {
    // State
    transactions,
    accounts,
    categories,
    stats,
    loading,
    error,
    
    // Actions
    fetchStats,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    fetchAccounts,
    fetchCategories,
    
    // Getters
    getTransactionById,
    getAccountById,
    getCategoryById,
    getIncomeTransactions,
    getExpenseTransactions,
    searchTransactions,
    filterByDateRange,
    filterByCategory,
    
    // Reset
    reset
  }
})