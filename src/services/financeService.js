import { apiClient } from './api'

const financeService = {
  // ============ CATEGORIES ============
  
  /**
   * Get all categories
   * @param {Object} params - { skip, limit, category_type }
   */
  getCategories(params = {}) {
    return apiClient.get('/finance/categories', { params })
  },

  /**
   * Get single category by ID
   * @param {string} categoryId - Category UUID
   */
  getCategory(categoryId) {
    return apiClient.get(`/finance/categories/${categoryId}`)
  },

  /**
   * Create new category
   * @param {Object} data - { name, description, category_type }
   */
  createCategory(data) {
    return apiClient.post('/finance/categories', data)
  },

  /**
   * Update category
   * @param {string} categoryId - Category UUID
   * @param {Object} data - { name, description, category_type }
   */
  updateCategory(categoryId, data) {
    return apiClient.put(`/finance/categories/${categoryId}`, data)
  },

  /**
   * Delete category
   * @param {string} categoryId - Category UUID
   */
  deleteCategory(categoryId) {
    return apiClient.delete(`/finance/categories/${categoryId}`)
  },

  // ============ TRANSACTIONS ============

  /**
   * Get all transactions
   * @param {Object} params - { skip, limit, transaction_type, start_date, end_date }
   */
  getTransactions(params = {}) {
    return apiClient.get('/finance/transactions', { params })
  },

  /**
   * Get single transaction by ID
   * @param {string} transactionId - Transaction UUID
   */
  getTransaction(transactionId) {
    return apiClient.get(`/finance/transactions/${transactionId}`)
  },

  /**
   * Create new transaction
   * @param {Object} data - { transaction_date, transaction_type, amount, category_id, description, reference_type, reference_id }
   */
  createTransaction(data) {
    return apiClient.post('/finance/transactions', data)
  },

  /**
   * Update transaction
   * @param {string} transactionId - Transaction UUID
   * @param {Object} data - { transaction_date, amount, category_id, description }
   */
  updateTransaction(transactionId, data) {
    return apiClient.put(`/finance/transactions/${transactionId}`, data)
  },

  /**
   * Delete transaction
   * @param {string} transactionId - Transaction UUID
   */
  deleteTransaction(transactionId) {
    return apiClient.delete(`/finance/transactions/${transactionId}`)
  },

  // ============ REPORTS ============

  /**
   * Get Profit & Loss report
   * @param {string} startDate - ISO date string
   * @param {string} endDate - ISO date string
   */
  getProfitAndLoss(startDate, endDate) {
    return apiClient.get('/finance/reports/pl', {
      params: { start_date: startDate, end_date: endDate }
    })
  },

  /**
   * Get Cash Flow report
   * @param {string} startDate - ISO date string
   * @param {string} endDate - ISO date string
   */
  getCashFlow(startDate, endDate) {
    return apiClient.get('/finance/reports/cashflow', {
      params: { start_date: startDate, end_date: endDate }
    })
  },

  /**
   * Get Balance Sheet
   * @param {string} reportDate - ISO date string (optional, defaults to today)
   */
  getBalanceSheet(reportDate = null) {
    const params = reportDate ? { report_date: reportDate } : {}
    return apiClient.get('/finance/reports/balance', { params })
  },

  // ============ STATISTICS ============

  /**
   * Get finance statistics
   */
  getStatistics() {
    return apiClient.get('/finance/statistics')
  }
}

export default financeService