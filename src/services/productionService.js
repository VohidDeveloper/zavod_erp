import { apiClient } from './api'

const productionService = {
  // ==================== PRODUCTION ORDERS ====================
  
  getProductionOrders(params = {}) {
    return apiClient.get('/production/orders', params)
  },

  getProductionOrder(id) {
    return apiClient.get(`/production/orders/${id}`)
  },

  createProductionOrder(data) {
    return apiClient.post('/production/orders', data)
  },

  updateProductionOrder(id, data) {
    return apiClient.put(`/production/orders/${id}`, data)
  },

  deleteProductionOrder(id) {
    return apiClient.delete(`/production/orders/${id}`)
  },

  startProductionOrder(id) {
    return apiClient.post(`/production/orders/${id}/start`)
  },

  pauseProductionOrder(id, reason) {
    return apiClient.post(`/production/orders/${id}/pause`, { reason })
  },

  resumeProductionOrder(id) {
    return apiClient.post(`/production/orders/${id}/resume`)
  },

  completeProductionOrder(id, data) {
    return apiClient.post(`/production/orders/${id}/complete`, data)
  },

  cancelProductionOrder(id, reason) {
    return apiClient.post(`/production/orders/${id}/cancel`, { reason })
  },

  // ==================== PRODUCTION LINES ====================
  
  getProductionLines(params = {}) {
    return apiClient.get('/production/lines', params)
  },

  getProductionLine(id) {
    return apiClient.get(`/production/lines/${id}`)
  },

  createProductionLine(data) {
    return apiClient.post('/production/lines', data)
  },

  updateProductionLine(id, data) {
    return apiClient.put(`/production/lines/${id}`, data)
  },

  deleteProductionLine(id) {
    return apiClient.delete(`/production/lines/${id}`)
  },

  getLineStatus(id) {
    return apiClient.get(`/production/lines/${id}/status`)
  },

  getLinePerformance(id, params = {}) {
    return apiClient.get(`/production/lines/${id}/performance`, params)
  },

  // ==================== PRODUCTION SCHEDULES ====================
  
  getSchedules(params = {}) {
    return apiClient.get('/production/schedules', params)
  },

  getSchedule(id) {
    return apiClient.get(`/production/schedules/${id}`)
  },

  createSchedule(data) {
    return apiClient.post('/production/schedules', data)
  },

  updateSchedule(id, data) {
    return apiClient.put(`/production/schedules/${id}`, data)
  },

  deleteSchedule(id) {
    return apiClient.delete(`/production/schedules/${id}`)
  },

  getTodaySchedule() {
    return apiClient.get('/production/schedules/today')
  },

  getWeeklySchedule() {
    return apiClient.get('/production/schedules/weekly')
  },

  // ==================== WORK ORDERS ====================
  
  getWorkOrders(params = {}) {
    return apiClient.get('/production/work-orders', params)
  },

  getWorkOrder(id) {
    return apiClient.get(`/production/work-orders/${id}`)
  },

  createWorkOrder(data) {
    return apiClient.post('/production/work-orders', data)
  },

  updateWorkOrder(id, data) {
    return apiClient.put(`/production/work-orders/${id}`, data)
  },

  deleteWorkOrder(id) {
    return apiClient.delete(`/production/work-orders/${id}`)
  },

  assignWorkOrder(id, data) {
    return apiClient.post(`/production/work-orders/${id}/assign`, data)
  },

  startWorkOrder(id) {
    return apiClient.post(`/production/work-orders/${id}/start`)
  },

  completeWorkOrder(id, data) {
    return apiClient.post(`/production/work-orders/${id}/complete`, data)
  },

  // ==================== BILL OF MATERIALS (BOM) ====================
  
  getBOMs(params = {}) {
    return apiClient.get('/production/bom', params)
  },

  getBOM(id) {
    return apiClient.get(`/production/bom/${id}`)
  },

  createBOM(data) {
    return apiClient.post('/production/bom', data)
  },

  updateBOM(id, data) {
    return apiClient.put(`/production/bom/${id}`, data)
  },

  deleteBOM(id) {
    return apiClient.delete(`/production/bom/${id}`)
  },

  getProductBOM(productId) {
    return apiClient.get(`/production/products/${productId}/bom`)
  },

  // ==================== QUALITY CONTROL ====================
  
  getQualityChecks(params = {}) {
    return apiClient.get('/production/quality-checks', params)
  },

  getQualityCheck(id) {
    return apiClient.get(`/production/quality-checks/${id}`)
  },

  createQualityCheck(data) {
    return apiClient.post('/production/quality-checks', data)
  },

  updateQualityCheck(id, data) {
    return apiClient.put(`/production/quality-checks/${id}`, data)
  },

  passQualityCheck(id, data) {
    return apiClient.post(`/production/quality-checks/${id}/pass`, data)
  },

  failQualityCheck(id, data) {
    return apiClient.post(`/production/quality-checks/${id}/fail`, data)
  },

  getDefects(params = {}) {
    return apiClient.get('/production/defects', params)
  },

  recordDefect(data) {
    return apiClient.post('/production/defects', data)
  },

  // ==================== SHIFTS ====================
  
  getShifts(params = {}) {
    return apiClient.get('/production/shifts', params)
  },

  getShift(id) {
    return apiClient.get(`/production/shifts/${id}`)
  },

  createShift(data) {
    return apiClient.post('/production/shifts', data)
  },

  updateShift(id, data) {
    return apiClient.put(`/production/shifts/${id}`, data)
  },

  deleteShift(id) {
    return apiClient.delete(`/production/shifts/${id}`)
  },

  getCurrentShift() {
    return apiClient.get('/production/shifts/current')
  },

  startShift(id) {
    return apiClient.post(`/production/shifts/${id}/start`)
  },

  endShift(id, data) {
    return apiClient.post(`/production/shifts/${id}/end`, data)
  },

  // ==================== DOWNTIME ====================
  
  getDowntimes(params = {}) {
    return apiClient.get('/production/downtimes', params)
  },

  getDowntime(id) {
    return apiClient.get(`/production/downtimes/${id}`)
  },

  recordDowntime(data) {
    return apiClient.post('/production/downtimes', data)
  },

  updateDowntime(id, data) {
    return apiClient.put(`/production/downtimes/${id}`, data)
  },

  resolveDowntime(id, data) {
    return apiClient.post(`/production/downtimes/${id}/resolve`, data)
  },

  // ==================== PRODUCTION OUTPUT ====================
  
  getOutputs(params = {}) {
    return apiClient.get('/production/outputs', params)
  },

  recordOutput(data) {
    return apiClient.post('/production/outputs', data)
  },

  getDailyOutput(params = {}) {
    return apiClient.get('/production/outputs/daily', params)
  },

  getWeeklyOutput(params = {}) {
    return apiClient.get('/production/outputs/weekly', params)
  },

  getMonthlyOutput(params = {}) {
    return apiClient.get('/production/outputs/monthly', params)
  },

  // ==================== MATERIALS ====================
  
  getMaterialUsage(params = {}) {
    return apiClient.get('/production/materials/usage', params)
  },

  recordMaterialUsage(data) {
    return apiClient.post('/production/materials/usage', data)
  },

  getAvailableMaterials(productionOrderId) {
    return apiClient.get(`/production/orders/${productionOrderId}/materials/available`)
  },

  reserveMaterials(productionOrderId, data) {
    return apiClient.post(`/production/orders/${productionOrderId}/materials/reserve`, data)
  },

  // ==================== WASTE ====================
  
  getWaste(params = {}) {
    return apiClient.get('/production/waste', params)
  },

  recordWaste(data) {
    return apiClient.post('/production/waste', data)
  },

  getWasteByProduct(params = {}) {
    return apiClient.get('/production/waste/by-product', params)
  },

  // ==================== EFFICIENCY ====================
  
  getEfficiency(params = {}) {
    return apiClient.get('/production/efficiency', params)
  },

  getLineEfficiency(lineId, params = {}) {
    return apiClient.get(`/production/lines/${lineId}/efficiency`, params)
  },

  getOEE(params = {}) {
    return apiClient.get('/production/oee', params)
  },

  // ==================== STATISTICS ====================
  
  getStats(params = {}) {
    return apiClient.get('/production/stats', params)
  },

  getProductionStats(params = {}) {
    return apiClient.get('/production/stats/production', params)
  },

  getQualityStats(params = {}) {
    return apiClient.get('/production/stats/quality', params)
  },

  getPerformanceStats(params = {}) {
    return apiClient.get('/production/stats/performance', params)
  },

  // ==================== REPORTS ====================
  
  generateReport(type, params = {}) {
    return apiClient.get(`/production/reports/${type}`, params)
  },

  getProductionReport(params = {}) {
    return apiClient.get('/production/reports/production', params)
  },

  getEfficiencyReport(params = {}) {
    return apiClient.get('/production/reports/efficiency', params)
  },

  getQualityReport(params = {}) {
    return apiClient.get('/production/reports/quality', params)
  },

  getDowntimeReport(params = {}) {
    return apiClient.get('/production/reports/downtime', params)
  },

  getWasteReport(params = {}) {
    return apiClient.get('/production/reports/waste', params)
  },

  // ==================== EXPORTS ====================
  
  exportProductionOrders(params = {}, format = 'xlsx') {
    return apiClient.download('/production/orders/export', `production-orders.${format}`, { ...params, format })
  },

  exportWorkOrders(params = {}, format = 'xlsx') {
    return apiClient.download('/production/work-orders/export', `work-orders.${format}`, { ...params, format })
  },

  exportOutputs(params = {}, format = 'xlsx') {
    return apiClient.download('/production/outputs/export', `outputs.${format}`, { ...params, format })
  },

  exportDefects(params = {}, format = 'xlsx') {
    return apiClient.download('/production/defects/export', `defects.${format}`, { ...params, format })
  },

  exportDowntime(params = {}, format = 'xlsx') {
    return apiClient.download('/production/downtimes/export', `downtime.${format}`, { ...params, format })
  }
}

export default productionService