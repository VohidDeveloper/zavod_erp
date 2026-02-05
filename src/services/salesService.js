import { apiClient } from './api'

const salesService = {
  // ==================== CUSTOMERS ====================
  
  getCustomers(params = {}) {
    return apiClient.get('/sales/customers', params)
  },

  getCustomer(id) {
    return apiClient.get(`/sales/customers/${id}`)
  },

  createCustomer(data) {
    return apiClient.post('/sales/customers', data)
  },

  updateCustomer(id, data) {
    return apiClient.put(`/sales/customers/${id}`, data)
  },

  deleteCustomer(id) {
    return apiClient.delete(`/sales/customers/${id}`)
  },

  getCustomerOrders(id, params = {}) {
    return apiClient.get(`/sales/customers/${id}/orders`, params)
  },

  getCustomerPayments(id, params = {}) {
    return apiClient.get(`/sales/customers/${id}/payments`, params)
  },

  getCustomerStats(id) {
    return apiClient.get(`/sales/customers/${id}/stats`)
  },

  // ==================== ORDERS ====================
  
  getOrders(params = {}) {
    return apiClient.get('/sales/orders', params)
  },

  getOrder(id) {
    return apiClient.get(`/sales/orders/${id}`)
  },

  createOrder(data) {
    return apiClient.post('/sales/orders', data)
  },

  updateOrder(id, data) {
    return apiClient.put(`/sales/orders/${id}`, data)
  },

  deleteOrder(id) {
    return apiClient.delete(`/sales/orders/${id}`)
  },

  confirmOrder(id) {
    return apiClient.post(`/sales/orders/${id}/confirm`)
  },

  cancelOrder(id, reason) {
    return apiClient.post(`/sales/orders/${id}/cancel`, { reason })
  },

  completeOrder(id) {
    return apiClient.post(`/sales/orders/${id}/complete`)
  },

  getPendingOrders(params = {}) {
    return apiClient.get('/sales/orders/pending', params)
  },

  getProcessingOrders(params = {}) {
    return apiClient.get('/sales/orders/processing', params)
  },

  getCompletedOrders(params = {}) {
    return apiClient.get('/sales/orders/completed', params)
  },

  // ==================== INVOICES ====================
  
  getInvoices(params = {}) {
    return apiClient.get('/sales/invoices', params)
  },

  getInvoice(id) {
    return apiClient.get(`/sales/invoices/${id}`)
  },

  createInvoice(data) {
    return apiClient.post('/sales/invoices', data)
  },

  updateInvoice(id, data) {
    return apiClient.put(`/sales/invoices/${id}`, data)
  },

  deleteInvoice(id) {
    return apiClient.delete(`/sales/invoices/${id}`)
  },

  sendInvoice(id, email) {
    return apiClient.post(`/sales/invoices/${id}/send`, { email })
  },

  printInvoice(id) {
    return apiClient.download(`/sales/invoices/${id}/print`, `invoice-${id}.pdf`)
  },

  getPendingInvoices(params = {}) {
    return apiClient.get('/sales/invoices/pending', params)
  },

  getPaidInvoices(params = {}) {
    return apiClient.get('/sales/invoices/paid', params)
  },

  getOverdueInvoices(params = {}) {
    return apiClient.get('/sales/invoices/overdue', params)
  },

  // ==================== PAYMENTS ====================
  
  getPayments(params = {}) {
    return apiClient.get('/sales/payments', params)
  },

  getPayment(id) {
    return apiClient.get(`/sales/payments/${id}`)
  },

  createPayment(data) {
    return apiClient.post('/sales/payments', data)
  },

  updatePayment(id, data) {
    return apiClient.put(`/sales/payments/${id}`, data)
  },

  deletePayment(id) {
    return apiClient.delete(`/sales/payments/${id}`)
  },

  recordPayment(data) {
    return apiClient.post('/sales/payments/record', data)
  },

  getPaymentMethods() {
    return apiClient.get('/sales/payment-methods')
  },

  // ==================== DELIVERIES ====================
  
  getDeliveries(params = {}) {
    return apiClient.get('/sales/deliveries', params)
  },

  getDelivery(id) {
    return apiClient.get(`/sales/deliveries/${id}`)
  },

  createDelivery(data) {
    return apiClient.post('/sales/deliveries', data)
  },

  updateDelivery(id, data) {
    return apiClient.put(`/sales/deliveries/${id}`, data)
  },

  scheduleDelivery(id, data) {
    return apiClient.post(`/sales/deliveries/${id}/schedule`, data)
  },

  completeDelivery(id, data) {
    return apiClient.post(`/sales/deliveries/${id}/complete`, data)
  },

  cancelDelivery(id, reason) {
    return apiClient.post(`/sales/deliveries/${id}/cancel`, { reason })
  },

  getPendingDeliveries(params = {}) {
    return apiClient.get('/sales/deliveries/pending', params)
  },

  getScheduledDeliveries(params = {}) {
    return apiClient.get('/sales/deliveries/scheduled', params)
  },

  // ==================== PRODUCTS ====================
  
  getProducts(params = {}) {
    return apiClient.get('/sales/products', params)
  },

  getProduct(id) {
    return apiClient.get(`/sales/products/${id}`)
  },

  getAvailableProducts(params = {}) {
    return apiClient.get('/sales/products/available', params)
  },

  getProductPrice(id) {
    return apiClient.get(`/sales/products/${id}/price`)
  },

  // ==================== QUOTATIONS ====================
  
  getQuotations(params = {}) {
    return apiClient.get('/sales/quotations', params)
  },

  getQuotation(id) {
    return apiClient.get(`/sales/quotations/${id}`)
  },

  createQuotation(data) {
    return apiClient.post('/sales/quotations', data)
  },

  updateQuotation(id, data) {
    return apiClient.put(`/sales/quotations/${id}`, data)
  },

  deleteQuotation(id) {
    return apiClient.delete(`/sales/quotations/${id}`)
  },

  sendQuotation(id, email) {
    return apiClient.post(`/sales/quotations/${id}/send`, { email })
  },

  convertToOrder(id) {
    return apiClient.post(`/sales/quotations/${id}/convert`)
  },

  // ==================== PRICE LISTS ====================
  
  getPriceLists(params = {}) {
    return apiClient.get('/sales/price-lists', params)
  },

  getPriceList(id) {
    return apiClient.get(`/sales/price-lists/${id}`)
  },

  createPriceList(data) {
    return apiClient.post('/sales/price-lists', data)
  },

  updatePriceList(id, data) {
    return apiClient.put(`/sales/price-lists/${id}`, data)
  },

  deletePriceList(id) {
    return apiClient.delete(`/sales/price-lists/${id}`)
  },

  // ==================== STATISTICS ====================
  
  getStats(params = {}) {
    return apiClient.get('/sales/stats', params)
  },

  getSalesStats(params = {}) {
    return apiClient.get('/sales/stats/sales', params)
  },

  getRevenueStats(params = {}) {
    return apiClient.get('/sales/stats/revenue', params)
  },

  getCustomerStats(params = {}) {
    return apiClient.get('/sales/stats/customers', params)
  },

  getProductStats(params = {}) {
    return apiClient.get('/sales/stats/products', params)
  },

  // ==================== REPORTS ====================
  
  generateReport(type, params = {}) {
    return apiClient.get(`/sales/reports/${type}`, params)
  },

  getDailyReport(params = {}) {
    return apiClient.get('/sales/reports/daily', params)
  },

  getWeeklyReport(params = {}) {
    return apiClient.get('/sales/reports/weekly', params)
  },

  getMonthlyReport(params = {}) {
    return apiClient.get('/sales/reports/monthly', params)
  },

  getSalesReport(params = {}) {
    return apiClient.get('/sales/reports/sales', params)
  },

  getCustomerReport(params = {}) {
    return apiClient.get('/sales/reports/customers', params)
  },

  getProductReport(params = {}) {
    return apiClient.get('/sales/reports/products', params)
  },

  // ==================== EXPORTS ====================
  
  exportCustomers(params = {}, format = 'xlsx') {
    return apiClient.download('/sales/customers/export', `customers.${format}`, { ...params, format })
  },

  exportOrders(params = {}, format = 'xlsx') {
    return apiClient.download('/sales/orders/export', `orders.${format}`, { ...params, format })
  },

  exportInvoices(params = {}, format = 'xlsx') {
    return apiClient.download('/sales/invoices/export', `invoices.${format}`, { ...params, format })
  },

  exportPayments(params = {}, format = 'xlsx') {
    return apiClient.download('/sales/payments/export', `payments.${format}`, { ...params, format })
  },

  exportDeliveries(params = {}, format = 'xlsx') {
    return apiClient.download('/sales/deliveries/export', `deliveries.${format}`, { ...params, format })
  }
}

export default salesService