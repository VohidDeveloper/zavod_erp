import { apiClient } from './api'

const financeService = {
  // ==================== ACCOUNTS ====================
  
  getAccounts(params = {}) {
    return apiClient.get('/finance/accounts', params)
  },

  getAccount(id) {
    return apiClient.get(`/finance/accounts/${id}`)
  },

  createAccount(data) {
    return apiClient.post('/finance/accounts', data)
  },

  updateAccount(id, data) {
    return apiClient.put(`/finance/accounts/${id}`, data)
  },

  deleteAccount(id) {
    return apiClient.delete(`/finance/accounts/${id}`)
  },

  getAccountBalance(id) {
    return apiClient.get(`/finance/accounts/${id}/balance`)
  },

  getAccountTransactions(id, params = {}) {
    return apiClient.get(`/finance/accounts/${id}/transactions`, params)
  },

  // ==================== TRANSACTIONS ====================
  
  getTransactions(params = {}) {
    return apiClient.get('/finance/transactions', params)
  },

  getTransaction(id) {
    return apiClient.get(`/finance/transactions/${id}`)
  },

  createTransaction(data) {
    return apiClient.post('/finance/transactions', data)
  },

  updateTransaction(id, data) {
    return apiClient.put(`/finance/transactions/${id}`, data)
  },

  deleteTransaction(id) {
    return apiClient.delete(`/finance/transactions/${id}`)
  },

  approveTransaction(id) {
    return apiClient.post(`/finance/transactions/${id}/approve`)
  },

  rejectTransaction(id, reason) {
    return apiClient.post(`/finance/transactions/${id}/reject`, { reason })
  },

  // ==================== JOURNAL ENTRIES ====================
  
  getJournalEntries(params = {}) {
    return apiClient.get('/finance/journal-entries', params)
  },

  getJournalEntry(id) {
    return apiClient.get(`/finance/journal-entries/${id}`)
  },

  createJournalEntry(data) {
    return apiClient.post('/finance/journal-entries', data)
  },

  updateJournalEntry(id, data) {
    return apiClient.put(`/finance/journal-entries/${id}`, data)
  },

  deleteJournalEntry(id) {
    return apiClient.delete(`/finance/journal-entries/${id}`)
  },

  postJournalEntry(id) {
    return apiClient.post(`/finance/journal-entries/${id}/post`)
  },

  // ==================== EXPENSES ====================
  
  getExpenses(params = {}) {
    return apiClient.get('/finance/expenses', params)
  },

  getExpense(id) {
    return apiClient.get(`/finance/expenses/${id}`)
  },

  createExpense(data) {
    return apiClient.post('/finance/expenses', data)
  },

  updateExpense(id, data) {
    return apiClient.put(`/finance/expenses/${id}`, data)
  },

  deleteExpense(id) {
    return apiClient.delete(`/finance/expenses/${id}`)
  },

  approveExpense(id) {
    return apiClient.post(`/finance/expenses/${id}/approve`)
  },

  rejectExpense(id, reason) {
    return apiClient.post(`/finance/expenses/${id}/reject`, { reason })
  },

  payExpense(id, data) {
    return apiClient.post(`/finance/expenses/${id}/pay`, data)
  },

  // ==================== EXPENSE CATEGORIES ====================
  
  getExpenseCategories(params = {}) {
    return apiClient.get('/finance/expense-categories', params)
  },

  createExpenseCategory(data) {
    return apiClient.post('/finance/expense-categories', data)
  },

  updateExpenseCategory(id, data) {
    return apiClient.put(`/finance/expense-categories/${id}`, data)
  },

  deleteExpenseCategory(id) {
    return apiClient.delete(`/finance/expense-categories/${id}`)
  },

  // ==================== REVENUE ====================
  
  getRevenue(params = {}) {
    return apiClient.get('/finance/revenue', params)
  },

  getRevenueByPeriod(params = {}) {
    return apiClient.get('/finance/revenue/by-period', params)
  },

  getRevenueByCategory(params = {}) {
    return apiClient.get('/finance/revenue/by-category', params)
  },

  // ==================== BUDGETS ====================
  
  getBudgets(params = {}) {
    return apiClient.get('/finance/budgets', params)
  },

  getBudget(id) {
    return apiClient.get(`/finance/budgets/${id}`)
  },

  createBudget(data) {
    return apiClient.post('/finance/budgets', data)
  },

  updateBudget(id, data) {
    return apiClient.put(`/finance/budgets/${id}`, data)
  },

  deleteBudget(id) {
    return apiClient.delete(`/finance/budgets/${id}`)
  },

  getBudgetComparison(id) {
    return apiClient.get(`/finance/budgets/${id}/comparison`)
  },

  // ==================== INVOICES ====================
  
  getInvoices(params = {}) {
    return apiClient.get('/finance/invoices', params)
  },

  getInvoice(id) {
    return apiClient.get(`/finance/invoices/${id}`)
  },

  getPendingInvoices(params = {}) {
    return apiClient.get('/finance/invoices/pending', params)
  },

  getOverdueInvoices(params = {}) {
    return apiClient.get('/finance/invoices/overdue', params)
  },

  // ==================== BILLS ====================
  
  getBills(params = {}) {
    return apiClient.get('/finance/bills', params)
  },

  getBill(id) {
    return apiClient.get(`/finance/bills/${id}`)
  },

  createBill(data) {
    return apiClient.post('/finance/bills', data)
  },

  updateBill(id, data) {
    return apiClient.put(`/finance/bills/${id}`, data)
  },

  deleteBill(id) {
    return apiClient.delete(`/finance/bills/${id}`)
  },

  approveBill(id) {
    return apiClient.post(`/finance/bills/${id}/approve`)
  },

  payBill(id, data) {
    return apiClient.post(`/finance/bills/${id}/pay`, data)
  },

  getPendingBills(params = {}) {
    return apiClient.get('/finance/bills/pending', params)
  },

  getOverdueBills(params = {}) {
    return apiClient.get('/finance/bills/overdue', params)
  },

  // ==================== PAYMENTS ====================
  
  getPayments(params = {}) {
    return apiClient.get('/finance/payments', params)
  },

  getPayment(id) {
    return apiClient.get(`/finance/payments/${id}`)
  },

  recordPayment(data) {
    return apiClient.post('/finance/payments', data)
  },

  updatePayment(id, data) {
    return apiClient.put(`/finance/payments/${id}`, data)
  },

  deletePayment(id) {
    return apiClient.delete(`/finance/payments/${id}`)
  },

  // ==================== CASH FLOW ====================
  
  getCashFlow(params = {}) {
    return apiClient.get('/finance/cash-flow', params)
  },

  getCashFlowByPeriod(params = {}) {
    return apiClient.get('/finance/cash-flow/by-period', params)
  },

  getCashFlowForecast(params = {}) {
    return apiClient.get('/finance/cash-flow/forecast', params)
  },

  // ==================== PROFIT & LOSS ====================
  
  getProfitLoss(params = {}) {
    return apiClient.get('/finance/profit-loss', params)
  },

  getProfitLossByPeriod(params = {}) {
    return apiClient.get('/finance/profit-loss/by-period', params)
  },

  getProfitMargin(params = {}) {
    return apiClient.get('/finance/profit-loss/margin', params)
  },

  // ==================== BALANCE SHEET ====================
  
  getBalanceSheet(params = {}) {
    return apiClient.get('/finance/balance-sheet', params)
  },

  getAssets(params = {}) {
    return apiClient.get('/finance/balance-sheet/assets', params)
  },

  getLiabilities(params = {}) {
    return apiClient.get('/finance/balance-sheet/liabilities', params)
  },

  getEquity(params = {}) {
    return apiClient.get('/finance/balance-sheet/equity', params)
  },

  // ==================== FINANCIAL RATIOS ====================
  
  getFinancialRatios(params = {}) {
    return apiClient.get('/finance/ratios', params)
  },

  getLiquidityRatios(params = {}) {
    return apiClient.get('/finance/ratios/liquidity', params)
  },

  getProfitabilityRatios(params = {}) {
    return apiClient.get('/finance/ratios/profitability', params)
  },

  getEfficiencyRatios(params = {}) {
    return apiClient.get('/finance/ratios/efficiency', params)
  },

  // ==================== TAX ====================
  
  getTaxes(params = {}) {
    return apiClient.get('/finance/taxes', params)
  },

  getTax(id) {
    return apiClient.get(`/finance/taxes/${id}`)
  },

  recordTax(data) {
    return apiClient.post('/finance/taxes', data)
  },

  updateTax(id, data) {
    return apiClient.put(`/finance/taxes/${id}`, data)
  },

  getTaxReport(params = {}) {
    return apiClient.get('/finance/taxes/report', params)
  },

  // ==================== BANK ACCOUNTS ====================
  
  getBankAccounts(params = {}) {
    return apiClient.get('/finance/bank-accounts', params)
  },

  getBankAccount(id) {
    return apiClient.get(`/finance/bank-accounts/${id}`)
  },

  createBankAccount(data) {
    return apiClient.post('/finance/bank-accounts', data)
  },

  updateBankAccount(id, data) {
    return apiClient.put(`/finance/bank-accounts/${id}`, data)
  },

  deleteBankAccount(id) {
    return apiClient.delete(`/finance/bank-accounts/${id}`)
  },

  reconcileBankAccount(id, data) {
    return apiClient.post(`/finance/bank-accounts/${id}/reconcile`, data)
  },

  // ==================== RECONCILIATION ====================
  
  getReconciliations(params = {}) {
    return apiClient.get('/finance/reconciliations', params)
  },

  getReconciliation(id) {
    return apiClient.get(`/finance/reconciliations/${id}`)
  },

  createReconciliation(data) {
    return apiClient.post('/finance/reconciliations', data)
  },

  completeReconciliation(id) {
    return apiClient.post(`/finance/reconciliations/${id}/complete`)
  },

  // ==================== STATISTICS ====================
  
  getStats(params = {}) {
    return apiClient.get('/finance/stats', params)
  },

  getRevenueStats(params = {}) {
    return apiClient.get('/finance/stats/revenue', params)
  },

  getExpenseStats(params = {}) {
    return apiClient.get('/finance/stats/expenses', params)
  },

  getProfitStats(params = {}) {
    return apiClient.get('/finance/stats/profit', params)
  },

  getCashFlowStats(params = {}) {
    return apiClient.get('/finance/stats/cash-flow', params)
  },

  // ==================== REPORTS ====================
  
  generateReport(type, params = {}) {
    return apiClient.get(`/finance/reports/${type}`, params)
  },

  getIncomeStatement(params = {}) {
    return apiClient.get('/finance/reports/income-statement', params)
  },

  getBalanceSheetReport(params = {}) {
    return apiClient.get('/finance/reports/balance-sheet', params)
  },

  getCashFlowStatement(params = {}) {
    return apiClient.get('/finance/reports/cash-flow-statement', params)
  },

  getGeneralLedger(params = {}) {
    return apiClient.get('/finance/reports/general-ledger', params)
  },

  getTrialBalance(params = {}) {
    return apiClient.get('/finance/reports/trial-balance', params)
  },

  getAgedReceivables(params = {}) {
    return apiClient.get('/finance/reports/aged-receivables', params)
  },

  getAgedPayables(params = {}) {
    return apiClient.get('/finance/reports/aged-payables', params)
  },

  // ==================== EXPORTS ====================
  
  exportTransactions(params = {}, format = 'xlsx') {
    return apiClient.download('/finance/transactions/export', `transactions.${format}`, { ...params, format })
  },

  exportExpenses(params = {}, format = 'xlsx') {
    return apiClient.download('/finance/expenses/export', `expenses.${format}`, { ...params, format })
  },

  exportInvoices(params = {}, format = 'xlsx') {
    return apiClient.download('/finance/invoices/export', `invoices.${format}`, { ...params, format })
  },

  exportBills(params = {}, format = 'xlsx') {
    return apiClient.download('/finance/bills/export', `bills.${format}`, { ...params, format })
  },

  exportGeneralLedger(params = {}, format = 'xlsx') {
    return apiClient.download('/finance/reports/general-ledger/export', `general-ledger.${format}`, { ...params, format })
  }
}

export default financeService