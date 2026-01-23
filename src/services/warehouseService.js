import { apiClient } from './api'

const warehouseService = {
  // ==================== PRODUCTS ====================
  
  getProducts(params = {}) {
    return apiClient.get('/warehouse/products', params)
  },

  getProduct(id) {
    return apiClient.get(`/warehouse/products/${id}`)
  },

  createProduct(data) {
    return apiClient.post('/warehouse/products', data)
  },

  updateProduct(id, data) {
    return apiClient.put(`/warehouse/products/${id}`, data)
  },

  deleteProduct(id) {
    return apiClient.delete(`/warehouse/products/${id}`)
  },

  getProductStock(id) {
    return apiClient.get(`/warehouse/products/${id}/stock`)
  },

  updateProductStock(id, data) {
    return apiClient.patch(`/warehouse/products/${id}/stock`, data)
  },

  // ==================== STOCK ====================
  
  getStock(params = {}) {
    return apiClient.get('/warehouse/stock', params)
  },

  getStockByProduct(productId, params = {}) {
    return apiClient.get(`/warehouse/products/${productId}/stock-history`, params)
  },

  getLowStockProducts(params = {}) {
    return apiClient.get('/warehouse/stock/low', params)
  },

  getOutOfStockProducts(params = {}) {
    return apiClient.get('/warehouse/stock/out', params)
  },

  // ==================== STOCK MOVEMENTS ====================
  
  getStockMovements(params = {}) {
    return apiClient.get('/warehouse/stock-movements', params)
  },

  getStockMovement(id) {
    return apiClient.get(`/warehouse/stock-movements/${id}`)
  },

  createStockMovement(data) {
    return apiClient.post('/warehouse/stock-movements', data)
  },

  // Stock adjustments
  adjustStock(data) {
    return apiClient.post('/warehouse/stock/adjust', data)
  },

  stockIn(data) {
    return apiClient.post('/warehouse/stock/in', data)
  },

  stockOut(data) {
    return apiClient.post('/warehouse/stock/out', data)
  },

  transferStock(data) {
    return apiClient.post('/warehouse/stock/transfer', data)
  },

  // ==================== WAREHOUSES ====================
  
  getWarehouses(params = {}) {
    return apiClient.get('/warehouse/warehouses', params)
  },

  getWarehouse(id) {
    return apiClient.get(`/warehouse/warehouses/${id}`)
  },

  createWarehouse(data) {
    return apiClient.post('/warehouse/warehouses', data)
  },

  updateWarehouse(id, data) {
    return apiClient.put(`/warehouse/warehouses/${id}`, data)
  },

  deleteWarehouse(id) {
    return apiClient.delete(`/warehouse/warehouses/${id}`)
  },

  getWarehouseStock(id, params = {}) {
    return apiClient.get(`/warehouse/warehouses/${id}/stock`, params)
  },

  // ==================== CATEGORIES ====================
  
  getCategories(params = {}) {
    return apiClient.get('/warehouse/categories', params)
  },

  getCategory(id) {
    return apiClient.get(`/warehouse/categories/${id}`)
  },

  createCategory(data) {
    return apiClient.post('/warehouse/categories', data)
  },

  updateCategory(id, data) {
    return apiClient.put(`/warehouse/categories/${id}`, data)
  },

  deleteCategory(id) {
    return apiClient.delete(`/warehouse/categories/${id}`)
  },

  // ==================== SUPPLIERS ====================
  
  getSuppliers(params = {}) {
    return apiClient.get('/warehouse/suppliers', params)
  },

  getSupplier(id) {
    return apiClient.get(`/warehouse/suppliers/${id}`)
  },

  createSupplier(data) {
    return apiClient.post('/warehouse/suppliers', data)
  },

  updateSupplier(id, data) {
    return apiClient.put(`/warehouse/suppliers/${id}`, data)
  },

  deleteSupplier(id) {
    return apiClient.delete(`/warehouse/suppliers/${id}`)
  },

  // ==================== PURCHASE ORDERS ====================
  
  getPurchaseOrders(params = {}) {
    return apiClient.get('/warehouse/purchase-orders', params)
  },

  getPurchaseOrder(id) {
    return apiClient.get(`/warehouse/purchase-orders/${id}`)
  },

  createPurchaseOrder(data) {
    return apiClient.post('/warehouse/purchase-orders', data)
  },

  updatePurchaseOrder(id, data) {
    return apiClient.put(`/warehouse/purchase-orders/${id}`, data)
  },

  deletePurchaseOrder(id) {
    return apiClient.delete(`/warehouse/purchase-orders/${id}`)
  },

  approvePurchaseOrder(id) {
    return apiClient.post(`/warehouse/purchase-orders/${id}/approve`)
  },

  receivePurchaseOrder(id, data) {
    return apiClient.post(`/warehouse/purchase-orders/${id}/receive`, data)
  },

  cancelPurchaseOrder(id, reason) {
    return apiClient.post(`/warehouse/purchase-orders/${id}/cancel`, { reason })
  },

  // ==================== RECEIVING ====================
  
  getReceivings(params = {}) {
    return apiClient.get('/warehouse/receivings', params)
  },

  getReceiving(id) {
    return apiClient.get(`/warehouse/receivings/${id}`)
  },

  createReceiving(data) {
    return apiClient.post('/warehouse/receivings', data)
  },

  updateReceiving(id, data) {
    return apiClient.put(`/warehouse/receivings/${id}`, data)
  },

  confirmReceiving(id) {
    return apiClient.post(`/warehouse/receivings/${id}/confirm`)
  },

  // ==================== BATCHES ====================
  
  getBatches(params = {}) {
    return apiClient.get('/warehouse/batches', params)
  },

  getBatch(id) {
    return apiClient.get(`/warehouse/batches/${id}`)
  },

  createBatch(data) {
    return apiClient.post('/warehouse/batches', data)
  },

  updateBatch(id, data) {
    return apiClient.put(`/warehouse/batches/${id}`, data)
  },

  getExpiringBatches(days = 30) {
    return apiClient.get('/warehouse/batches/expiring', { days })
  },

  getExpiredBatches() {
    return apiClient.get('/warehouse/batches/expired')
  },

  // ==================== LOCATIONS ====================
  
  getLocations(params = {}) {
    return apiClient.get('/warehouse/locations', params)
  },

  getLocation(id) {
    return apiClient.get(`/warehouse/locations/${id}`)
  },

  createLocation(data) {
    return apiClient.post('/warehouse/locations', data)
  },

  updateLocation(id, data) {
    return apiClient.put(`/warehouse/locations/${id}`, data)
  },

  deleteLocation(id) {
    return apiClient.delete(`/warehouse/locations/${id}`)
  },

  // ==================== BARCODES ====================
  
  generateBarcode(productId) {
    return apiClient.post(`/warehouse/products/${productId}/barcode`)
  },

  scanBarcode(barcode) {
    return apiClient.get('/warehouse/barcode/scan', { barcode })
  },

  printBarcode(productId, quantity = 1) {
    return apiClient.download(
      `/warehouse/products/${productId}/barcode/print`,
      `barcode-${productId}.pdf`,
      { quantity }
    )
  },

  // ==================== STOCK TAKING ====================
  
  getStockTakings(params = {}) {
    return apiClient.get('/warehouse/stock-takings', params)
  },

  getStockTaking(id) {
    return apiClient.get(`/warehouse/stock-takings/${id}`)
  },

  createStockTaking(data) {
    return apiClient.post('/warehouse/stock-takings', data)
  },

  updateStockTaking(id, data) {
    return apiClient.put(`/warehouse/stock-takings/${id}`, data)
  },

  completeStockTaking(id) {
    return apiClient.post(`/warehouse/stock-takings/${id}/complete`)
  },

  cancelStockTaking(id) {
    return apiClient.post(`/warehouse/stock-takings/${id}/cancel`)
  },

  // ==================== STATISTICS ====================
  
  getStats(params = {}) {
    return apiClient.get('/warehouse/stats', params)
  },

  getStockStats(params = {}) {
    return apiClient.get('/warehouse/stats/stock', params)
  },

  getMovementStats(params = {}) {
    return apiClient.get('/warehouse/stats/movements', params)
  },

  getTurnoverRate(params = {}) {
    return apiClient.get('/warehouse/stats/turnover', params)
  },

  getStockValue() {
    return apiClient.get('/warehouse/stats/value')
  },

  // ==================== REPORTS ====================
  
  generateReport(type, params = {}) {
    return apiClient.get(`/warehouse/reports/${type}`, params)
  },

  getInventoryReport(params = {}) {
    return apiClient.get('/warehouse/reports/inventory', params)
  },

  getMovementReport(params = {}) {
    return apiClient.get('/warehouse/reports/movements', params)
  },

  getStockValuationReport(params = {}) {
    return apiClient.get('/warehouse/reports/valuation', params)
  },

  getAgingReport(params = {}) {
    return apiClient.get('/warehouse/reports/aging', params)
  },

  // ==================== EXPORTS ====================
  
  exportProducts(params = {}, format = 'xlsx') {
    return apiClient.download('/warehouse/products/export', `products.${format}`, { ...params, format })
  },

  exportStock(params = {}, format = 'xlsx') {
    return apiClient.download('/warehouse/stock/export', `stock.${format}`, { ...params, format })
  },

  exportMovements(params = {}, format = 'xlsx') {
    return apiClient.download('/warehouse/stock-movements/export', `movements.${format}`, { ...params, format })
  },

  exportPurchaseOrders(params = {}, format = 'xlsx') {
    return apiClient.download('/warehouse/purchase-orders/export', `purchase-orders.${format}`, { ...params, format })
  },

  // ==================== IMPORTS ====================
  
  importProducts(formData, onProgress) {
    return apiClient.upload('/warehouse/products/import', formData, onProgress)
  },

  importStock(formData, onProgress) {
    return apiClient.upload('/warehouse/stock/import', formData, onProgress)
  },

  downloadImportTemplate(type) {
    return apiClient.download(`/warehouse/import-template/${type}`, `${type}-template.xlsx`)
  }
}

export default warehouseService