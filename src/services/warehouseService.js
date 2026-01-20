import api from './api'

export const warehouseService = {
  // Receipts
  getReceipts(params) {
    return api.get('/warehouse/receipts', { params })
  },

  getReceipt(id) {
    return api.get(`/warehouse/receipts/${id}`)
  },

  createReceipt(data) {
    return api.post('/warehouse/receipts', data)
  },

  updateReceipt(id, data) {
    return api.put(`/warehouse/receipts/${id}`, data)
  },

  deleteReceipt(id) {
    return api.delete(`/warehouse/receipts/${id}`)
  },

  // Stock
  getStock(params) {
    return api.get('/warehouse/stock', { params })
  },

  getStockByMaterial(id) {
    return api.get(`/warehouse/stock/${id}`)
  },

  // Material Requests
  getRequests(params) {
    return api.get('/warehouse/requests', { params })
  },

  getRequest(id) {
    return api.get(`/warehouse/requests/${id}`)
  },

  createRequest(data) {
    return api.post('/warehouse/requests', data)
  },

  approveRequest(id, data) {
    return api.put(`/warehouse/requests/${id}/approve`, data)
  },

  rejectRequest(id, data) {
    return api.put(`/warehouse/requests/${id}/reject`, data)
  },

  // Raw Materials
  getRawMaterials(params) {
    return api.get('/warehouse/raw-materials', { params })
  },

  createRawMaterial(data) {
    return api.post('/warehouse/raw-materials', data)
  },

  updateRawMaterial(id, data) {
    return api.put(`/warehouse/raw-materials/${id}`, data)
  },

  // Suppliers
  getSuppliers(params) {
    return api.get('/warehouse/suppliers', { params })
  },

  createSupplier(data) {
    return api.post('/warehouse/suppliers', data)
  },

  updateSupplier(id, data) {
    return api.put(`/warehouse/suppliers/${id}`, data)
  },

  // Statistics
  getLowStock() {
    return api.get('/warehouse/low-stock')
  },

  getStatistics(params) {
    return api.get('/warehouse/statistics', { params })
  },
}

export default warehouseService