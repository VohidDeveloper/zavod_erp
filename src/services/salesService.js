import api from './api'

export const salesService = {
  // Customers
  getCustomers(params) {
    return api.get('/sales/customers', { params })
  },

  getCustomer(id) {
    return api.get(`/sales/customers/${id}`)
  },

  createCustomer(data) {
    return api.post('/sales/customers', data)
  },

  updateCustomer(id, data) {
    return api.put(`/sales/customers/${id}`, data)
  },

  deleteCustomer(id) {
    return api.delete(`/sales/customers/${id}`)
  },

  // Orders
  getOrders(params) {
    return api.get('/sales/orders', { params })
  },

  getOrder(id) {
    return api.get(`/sales/orders/${id}`)
  },

  createOrder(data) {
    return api.post('/sales/orders', data)
  },

  updateOrder(id, data) {
    return api.put(`/sales/orders/${id}`, data)
  },

  deleteOrder(id) {
    return api.delete(`/sales/orders/${id}`)
  },

  // Payments
  createPayment(data) {
    return api.post('/sales/payments', data)
  },

  getPayments(params) {
    return api.get('/sales/payments', { params })
  },

  // Products
  getProducts(params) {
    return api.get('/sales/products', { params })
  },

  getAvailableProducts(params) {
    return api.get('/sales/products/available', { params })
  },

  // Statistics
  getStatistics(params) {
    return api.get('/sales/statistics', { params })
  },

  getDailyReport(params) {
    return api.get('/sales/reports/daily', { params })
  },
}

export default salesService