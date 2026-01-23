import { apiClient } from './api'

const maintenanceService = {
  // ==================== EQUIPMENT ====================
  
  getEquipment(params = {}) {
    return apiClient.get('/maintenance/equipment', params)
  },

  getEquipmentById(id) {
    return apiClient.get(`/maintenance/equipment/${id}`)
  },

  createEquipment(data) {
    return apiClient.post('/maintenance/equipment', data)
  },

  updateEquipment(id, data) {
    return apiClient.put(`/maintenance/equipment/${id}`, data)
  },

  deleteEquipment(id) {
    return apiClient.delete(`/maintenance/equipment/${id}`)
  },

  // Equipment status
  updateEquipmentStatus(id, status) {
    return apiClient.patch(`/maintenance/equipment/${id}/status`, { status })
  },

  // ==================== MAINTENANCE REQUESTS ====================
  
  getRequests(params = {}) {
    return apiClient.get('/maintenance/requests', params)
  },

  getRequest(id) {
    return apiClient.get(`/maintenance/requests/${id}`)
  },

  createRequest(data) {
    return apiClient.post('/maintenance/requests', data)
  },

  updateRequest(id, data) {
    return apiClient.put(`/maintenance/requests/${id}`, data)
  },

  deleteRequest(id) {
    return apiClient.delete(`/maintenance/requests/${id}`)
  },

  // Request actions
  assignRequest(id, data) {
    return apiClient.post(`/maintenance/requests/${id}/assign`, data)
  },

  startRequest(id) {
    return apiClient.post(`/maintenance/requests/${id}/start`)
  },

  completeRequest(id, data) {
    return apiClient.post(`/maintenance/requests/${id}/complete`, data)
  },

  cancelRequest(id, reason) {
    return apiClient.post(`/maintenance/requests/${id}/cancel`, { reason })
  },

  // ==================== MAINTENANCE SCHEDULE ====================
  
  getSchedules(params = {}) {
    return apiClient.get('/maintenance/schedules', params)
  },

  getSchedule(id) {
    return apiClient.get(`/maintenance/schedules/${id}`)
  },

  createSchedule(data) {
    return apiClient.post('/maintenance/schedules', data)
  },

  updateSchedule(id, data) {
    return apiClient.put(`/maintenance/schedules/${id}`, data)
  },

  deleteSchedule(id) {
    return apiClient.delete(`/maintenance/schedules/${id}`)
  },

  // Schedule actions
  completeScheduledMaintenance(id, data) {
    return apiClient.post(`/maintenance/schedules/${id}/complete`, data)
  },

  postponeScheduledMaintenance(id, newDate) {
    return apiClient.post(`/maintenance/schedules/${id}/postpone`, { new_date: newDate })
  },

  getUpcomingSchedules(days = 7) {
    return apiClient.get('/maintenance/schedules/upcoming', { days })
  },

  getOverdueSchedules() {
    return apiClient.get('/maintenance/schedules/overdue')
  },

  // ==================== SPARE PARTS ====================
  
  getSpareParts(params = {}) {
    return apiClient.get('/maintenance/spare-parts', params)
  },

  getSparePart(id) {
    return apiClient.get(`/maintenance/spare-parts/${id}`)
  },

  createSparePart(data) {
    return apiClient.post('/maintenance/spare-parts', data)
  },

  updateSparePart(id, data) {
    return apiClient.put(`/maintenance/spare-parts/${id}`, data)
  },

  deleteSparePart(id) {
    return apiClient.delete(`/maintenance/spare-parts/${id}`)
  },

  // Stock management
  updateSparePartStock(id, data) {
    return apiClient.patch(`/maintenance/spare-parts/${id}/stock`, data)
  },

  adjustStock(id, quantity, type, reason) {
    return apiClient.post(`/maintenance/spare-parts/${id}/adjust-stock`, {
      quantity,
      type, // 'add' or 'remove'
      reason
    })
  },

  getLowStockParts() {
    return apiClient.get('/maintenance/spare-parts/low-stock')
  },

  // ==================== MAINTENANCE HISTORY ====================
  
  getHistory(params = {}) {
    return apiClient.get('/maintenance/history', params)
  },

  getEquipmentHistory(equipmentId, params = {}) {
    return apiClient.get(`/maintenance/equipment/${equipmentId}/history`, params)
  },

  addHistoryEntry(data) {
    return apiClient.post('/maintenance/history', data)
  },

  // ==================== TECHNICIANS ====================
  
  getTechnicians(params = {}) {
    return apiClient.get('/maintenance/technicians', params)
  },

  getTechnician(id) {
    return apiClient.get(`/maintenance/technicians/${id}`)
  },

  getTechnicianWorkload(id, params = {}) {
    return apiClient.get(`/maintenance/technicians/${id}/workload`, params)
  },

  // ==================== STATISTICS ====================
  
  getStats(params = {}) {
    return apiClient.get('/maintenance/stats', params)
  },

  getEquipmentStats(params = {}) {
    return apiClient.get('/maintenance/stats/equipment', params)
  },

  getRequestStats(params = {}) {
    return apiClient.get('/maintenance/stats/requests', params)
  },

  getDowntimeAnalysis(params = {}) {
    return apiClient.get('/maintenance/stats/downtime', params)
  },

  getCostAnalysis(params = {}) {
    return apiClient.get('/maintenance/stats/costs', params)
  },

  // ==================== REPORTS ====================
  
  generateReport(type, params = {}) {
    return apiClient.get(`/maintenance/reports/${type}`, params)
  },

  // Maintenance summary
  getMaintenanceSummary(params = {}) {
    return apiClient.get('/maintenance/reports/summary', params)
  },

  // Equipment performance
  getEquipmentPerformance(equipmentId, params = {}) {
    return apiClient.get(`/maintenance/equipment/${equipmentId}/performance`, params)
  },

  // Preventive maintenance compliance
  getPreventiveMaintenanceCompliance(params = {}) {
    return apiClient.get('/maintenance/reports/preventive-compliance', params)
  },

  // ==================== EXPORTS ====================
  
  exportEquipment(params = {}, format = 'xlsx') {
    return apiClient.download('/maintenance/equipment/export', `equipment.${format}`, { ...params, format })
  },

  exportRequests(params = {}, format = 'xlsx') {
    return apiClient.download('/maintenance/requests/export', `maintenance-requests.${format}`, { ...params, format })
  },

  exportHistory(params = {}, format = 'xlsx') {
    return apiClient.download('/maintenance/history/export', `maintenance-history.${format}`, { ...params, format })
  },

  exportSpareParts(params = {}, format = 'xlsx') {
    return apiClient.download('/maintenance/spare-parts/export', `spare-parts.${format}`, { ...params, format })
  },

  // ==================== ATTACHMENTS ====================
  
  uploadAttachment(requestId, file, onProgress) {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.upload(`/maintenance/requests/${requestId}/attachments`, formData, onProgress)
  },

  deleteAttachment(requestId, attachmentId) {
    return apiClient.delete(`/maintenance/requests/${requestId}/attachments/${attachmentId}`)
  },

  // ==================== NOTIFICATIONS ====================
  
  getMaintenanceNotifications(params = {}) {
    return apiClient.get('/maintenance/notifications', params)
  },

  markNotificationRead(id) {
    return apiClient.patch(`/maintenance/notifications/${id}/read`)
  }
}

export default maintenanceService