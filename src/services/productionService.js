import api from './api'

export const productionService = {
  // Shifts
  getShifts(params) {
    return api.get('/production/shifts', { params })
  },

  getShift(id) {
    return api.get(`/production/shifts/${id}`)
  },

  createShift(data) {
    return api.post('/production/shifts', data)
  },

  completeShift(id, data) {
    return api.put(`/production/shifts/${id}/complete`, data)
  },

  // Production Records
  recordMaterial(data) {
    return api.post('/production/records/materials', data)
  },

  recordOutput(data) {
    return api.post('/production/records/output', data)
  },

  recordDefect(data) {
    return api.post('/production/records/defects', data)
  },

  // Shift Handover
  handoverShift(data) {
    return api.post('/production/handover', data)
  },

  // Production Lines
  getLines(params) {
    return api.get('/production/lines', { params })
  },

  getLinePerformance(lineId, params) {
    return api.get(`/production/lines/${lineId}/performance`, { params })
  },

  // Finished Products
  getFinishedProducts(params) {
    return api.get('/production/finished-products', { params })
  },

  // Statistics
  getStatistics(params) {
    return api.get('/production/statistics', { params })
  },

  // Defect Reasons
  getDefectReasons() {
    return api.get('/production/defect-reasons')
  },
}

export default productionService