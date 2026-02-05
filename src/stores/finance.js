import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import financeService from '@/services/financeService'

export const useFinanceStore = defineStore('finance', () => {
  // ============ STATE ============
  
  // Categories
  const categories = ref([])
  const incomeCategories = ref([])
  const expenseCategories = ref([])
  const currentCategory = ref(null)
  
  // Transactions
  const transactions = ref([])
  const currentTransaction = ref(null)
  
  // Reports
  const profitAndLoss = ref(null)
  const cashFlow = ref(null)
  const balanceSheet = ref(null)
  
  // Statistics
  const statistics = ref(null)
  
  // UI State
  const loading = ref(false)
  const error = ref(null)

  // ============ GETTERS ============
  
  const totalCategories = computed(() => categories.value.length)
  const totalTransactions = computed(() => transactions.value.length)
  
  const totalIncome = computed(() => 
    transactions.value
      .filter(t => t.transaction_type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  )
  
  const totalExpense = computed(() => 
    transactions.value
      .filter(t => t.transaction_type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  )
  
  const netProfit = computed(() => totalIncome.value - totalExpense.value)
  
  const recentTransactions = computed(() => 
    [...transactions.value]
      .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
      .slice(0, 10)
  )

  // ============ ACTIONS - CATEGORIES ============
  
  async function fetchCategories(params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await financeService.getCategories(params)
      categories.value = response.data || response
      
      // Separate by type
      incomeCategories.value = categories.value.filter(c => c.category_type === 'income')
      expenseCategories.value = categories.value.filter(c => c.category_type === 'expense')
      
      return categories.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchCategory(categoryId) {
    loading.value = true
    error.value = null
    
    try {
      const response = await financeService.getCategory(categoryId)
      currentCategory.value = response.data || response
      return currentCategory.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createCategory(data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await financeService.createCategory(data)
      const newCategory = response.data || response
      
      categories.value.push(newCategory)
      
      // Update type-specific arrays
      if (newCategory.category_type === 'income') {
        incomeCategories.value.push(newCategory)
      } else {
        expenseCategories.value.push(newCategory)
      }
      
      return newCategory
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateCategory(categoryId, data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await financeService.updateCategory(categoryId, data)
      const updated = response.data || response
      
      const index = categories.value.findIndex(c => c.id === categoryId)
      if (index !== -1) {
        categories.value[index] = updated
      }
      
      // Refresh type-specific arrays
      await fetchCategories()
      
      return updated
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteCategory(categoryId) {
    loading.value = true
    error.value = null
    
    try {
      await financeService.deleteCategory(categoryId)
      
      categories.value = categories.value.filter(c => c.id !== categoryId)
      incomeCategories.value = incomeCategories.value.filter(c => c.id !== categoryId)
      expenseCategories.value = expenseCategories.value.filter(c => c.id !== categoryId)
      
      return true
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============ ACTIONS - TRANSACTIONS ============
  
  async function fetchTransactions(params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await financeService.getTransactions(params)
      transactions.value = response.data || response
      return transactions.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchTransaction(transactionId) {
    loading.value = true
    error.value = null
    
    try {
      const response = await financeService.getTransaction(transactionId)
      currentTransaction.value = response.data || response
      return currentTransaction.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createTransaction(data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await financeService.createTransaction(data)
      const newTransaction = response.data || response
      
      transactions.value.unshift(newTransaction)
      
      return newTransaction
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateTransaction(transactionId, data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await financeService.updateTransaction(transactionId, data)
      const updated = response.data || response
      
      const index = transactions.value.findIndex(t => t.id === transactionId)
      if (index !== -1) {
        transactions.value[index] = updated
      }
      
      return updated
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteTransaction(transactionId) {
    loading.value = true
    error.value = null
    
    try {
      await financeService.deleteTransaction(transactionId)
      
      transactions.value = transactions.value.filter(t => t.id !== transactionId)
      
      return true
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============ ACTIONS - REPORTS ============
  
  async function fetchProfitAndLoss(startDate, endDate) {
    loading.value = true
    error.value = null
    
    try {
      const response = await financeService.getProfitAndLoss(startDate, endDate)
      profitAndLoss.value = response.data || response
      return profitAndLoss.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchCashFlow(startDate, endDate) {
    loading.value = true
    error.value = null
    
    try {
      const response = await financeService.getCashFlow(startDate, endDate)
      cashFlow.value = response.data || response
      return cashFlow.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchBalanceSheet(reportDate = null) {
    loading.value = true
    error.value = null
    
    try {
      const response = await financeService.getBalanceSheet(reportDate)
      balanceSheet.value = response.data || response
      return balanceSheet.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============ ACTIONS - STATISTICS ============
  
  async function fetchStatistics() {
    loading.value = true
    error.value = null
    
    try {
      const response = await financeService.getStatistics()
      statistics.value = response.data || response
      return statistics.value
    } catch (err) {
      error.value = err.response?.data || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // ============ HELPERS ============
  
  function resetState() {
    categories.value = []
    incomeCategories.value = []
    expenseCategories.value = []
    currentCategory.value = null
    transactions.value = []
    currentTransaction.value = null
    profitAndLoss.value = null
    cashFlow.value = null
    balanceSheet.value = null
    statistics.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    categories,
    incomeCategories,
    expenseCategories,
    currentCategory,
    transactions,
    currentTransaction,
    profitAndLoss,
    cashFlow,
    balanceSheet,
    statistics,
    loading,
    error,
    
    // Getters
    totalCategories,
    totalTransactions,
    totalIncome,
    totalExpense,
    netProfit,
    recentTransactions,
    
    // Actions - Categories
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Actions - Transactions
    fetchTransactions,
    fetchTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Actions - Reports
    fetchProfitAndLoss,
    fetchCashFlow,
    fetchBalanceSheet,
    
    // Actions - Statistics
    fetchStatistics,
    
    // Helpers
    resetState
  }
})