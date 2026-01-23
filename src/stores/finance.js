import { defineStore } from 'pinia'
import financeService from '@/services/financeService'

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    // Transactions
    transactions: [],
    currentTransaction: null,
    
    // Payments
    payments: [],
    pendingPayments: [],
    completedPayments: [],
    
    // Invoices
    invoices: [],
    unpaidInvoices: [],
    
    // Accounts
    accounts: [],
    
    // Reports
    reports: {
      profitLoss: null,
      cashFlow: null,
      balance: null,
      incomeStatement: null
    },
    
    // Statistics
    stats: {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      pendingPayments: 0,
      overdueInvoices: 0
    },
    
    // Date range for reports
    reportDateRange: {
      start: null,
      end: null
    },
    
    // Loading states
    loading: false,
    transactionsLoading: false,
    paymentsLoading: false,
    reportsLoading: false,
    
    error: null
  }),

  getters: {
    // Transaction getters
    incomeTransactions: (state) => state.transactions.filter(t => t.type === 'income'),
    expenseTransactions: (state) => state.transactions.filter(t => t.type === 'expense'),
    
    totalIncome: (state) => {
      return state.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
    },
    
    totalExpense: (state) => {
      return state.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
    },
    
    balance: (state) => {
      return state.transactions.reduce((sum, t) => {
        return t.type === 'income' ? sum + t.amount : sum - t.amount
      }, 0)
    },
    
    // Payment getters
    totalPendingPayments: (state) => {
      return state.pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    },
    
    // Invoice getters
    totalUnpaidInvoices: (state) => {
      return state.unpaidInvoices.reduce((sum, i) => sum + (i.amount || 0), 0)
    },
    
    overdueInvoices: (state) => {
      const today = new Date()
      return state.unpaidInvoices.filter(i => new Date(i.due_date) < today)
    },
    
    // Account getters
    totalAccountBalance: (state) => {
      return state.accounts.reduce((sum, a) => sum + (a.balance || 0), 0)
    }
  },

  actions: {
    // ==================== TRANSACTIONS ====================
    
    async fetchTransactions(params = {}) {
      this.transactionsLoading = true
      this.error = null
      try {
        const response = await financeService.getTransactions(params)
        this.transactions = response.data
        this.updateStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.transactionsLoading = false
      }
    },

    async fetchTransaction(id) {
      this.loading = true
      this.error = null
      try {
        const response = await financeService.getTransaction(id)
        this.currentTransaction = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTransaction(data) {
      this.loading = true
      this.error = null
      try {
        const response = await financeService.createTransaction(data)
        this.transactions.unshift(response.data)
        this.updateStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTransaction(id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await financeService.updateTransaction(id, data)
        const index = this.transactions.findIndex(t => t.id === id)
        if (index !== -1) {
          this.transactions[index] = response.data
        }
        this.updateStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTransaction(id) {
      this.loading = true
      this.error = null
      try {
        await financeService.deleteTransaction(id)
        this.transactions = this.transactions.filter(t => t.id !== id)
        this.updateStats()
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== PAYMENTS ====================
    
    async fetchPayments(params = {}) {
      this.paymentsLoading = true
      this.error = null
      try {
        const response = await financeService.getPayments(params)
        this.payments = response.data
        this.pendingPayments = response.data.filter(p => p.status === 'pending')
        this.completedPayments = response.data.filter(p => p.status === 'completed')
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.paymentsLoading = false
      }
    },

    async createPayment(data) {
      this.loading = true
      this.error = null
      try {
        const response = await financeService.createPayment(data)
        this.payments.unshift(response.data)
        if (response.data.status === 'pending') {
          this.pendingPayments.unshift(response.data)
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePayment(id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await financeService.updatePayment(id, data)
        const index = this.payments.findIndex(p => p.id === id)
        if (index !== -1) {
          this.payments[index] = response.data
        }
        this.pendingPayments = this.payments.filter(p => p.status === 'pending')
        this.completedPayments = this.payments.filter(p => p.status === 'completed')
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async confirmPayment(id) {
      this.loading = true
      this.error = null
      try {
        const response = await financeService.confirmPayment(id)
        const index = this.payments.findIndex(p => p.id === id)
        if (index !== -1) {
          this.payments[index] = response.data
        }
        this.pendingPayments = this.payments.filter(p => p.status === 'pending')
        this.completedPayments = this.payments.filter(p => p.status === 'completed')
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== INVOICES ====================
    
    async fetchInvoices(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await financeService.getInvoices(params)
        this.invoices = response.data
        this.unpaidInvoices = response.data.filter(i => i.status === 'unpaid')
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createInvoice(data) {
      this.loading = true
      this.error = null
      try {
        const response = await financeService.createInvoice(data)
        this.invoices.unshift(response.data)
        if (response.data.status === 'unpaid') {
          this.unpaidInvoices.unshift(response.data)
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateInvoice(id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await financeService.updateInvoice(id, data)
        const index = this.invoices.findIndex(i => i.id === id)
        if (index !== -1) {
          this.invoices[index] = response.data
        }
        this.unpaidInvoices = this.invoices.filter(i => i.status === 'unpaid')
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== ACCOUNTS ====================
    
    async fetchAccounts() {
      this.loading = true
      this.error = null
      try {
        const response = await financeService.getAccounts()
        this.accounts = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateAccount(id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await financeService.updateAccount(id, data)
        const index = this.accounts.findIndex(a => a.id === id)
        if (index !== -1) {
          this.accounts[index] = response.data
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== REPORTS ====================
    
    async fetchProfitLossReport(params = {}) {
      this.reportsLoading = true
      this.error = null
      try {
        const response = await financeService.getProfitLossReport(params)
        this.reports.profitLoss = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.reportsLoading = false
      }
    },

    async fetchCashFlowReport(params = {}) {
      this.reportsLoading = true
      this.error = null
      try {
        const response = await financeService.getCashFlowReport(params)
        this.reports.cashFlow = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.reportsLoading = false
      }
    },

    async fetchBalanceReport(params = {}) {
      this.reportsLoading = true
      this.error = null
      try {
        const response = await financeService.getBalanceReport(params)
        this.reports.balance = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.reportsLoading = false
      }
    },

    async fetchIncomeStatement(params = {}) {
      this.reportsLoading = true
      this.error = null
      try {
        const response = await financeService.getIncomeStatement(params)
        this.reports.incomeStatement = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.reportsLoading = false
      }
    },

    // ==================== STATISTICS ====================
    
    updateStats() {
      this.stats = {
        totalIncome: this.totalIncome,
        totalExpense: this.totalExpense,
        balance: this.balance,
        pendingPayments: this.totalPendingPayments,
        overdueInvoices: this.overdueInvoices.length
      }
    },

    setReportDateRange(start, end) {
      this.reportDateRange = { start, end }
    },

    // Reset
    reset() {
      this.transactions = []
      this.payments = []
      this.invoices = []
      this.accounts = []
      this.reports = {
        profitLoss: null,
        cashFlow: null,
        balance: null,
        incomeStatement: null
      }
      this.error = null
    }
  }
})