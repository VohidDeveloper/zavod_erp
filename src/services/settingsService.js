import { apiClient } from './api'

const settingsService = {
  // ==================== SYSTEM SETTINGS ====================
  
  getSystemSettings() {
    return apiClient.get('/settings/system')
  },

  updateSystemSettings(data) {
    return apiClient.put('/settings/system', data)
  },

  uploadCompanyLogo(formData, onProgress) {
    return apiClient.upload('/settings/system/logo', formData, onProgress)
  },

  deleteCompanyLogo() {
    return apiClient.delete('/settings/system/logo')
  },

  // ==================== USER SETTINGS ====================
  
  getUserSettings() {
    return apiClient.get('/settings/user')
  },

  updateUserSettings(data) {
    return apiClient.put('/settings/user', data)
  },

  // ==================== USERS ====================
  
  getUsers(params = {}) {
    return apiClient.get('/settings/users', params)
  },

  getUser(id) {
    return apiClient.get(`/settings/users/${id}`)
  },

  createUser(data) {
    return apiClient.post('/settings/users', data)
  },

  updateUser(id, data) {
    return apiClient.put(`/settings/users/${id}`, data)
  },

  deleteUser(id) {
    return apiClient.delete(`/settings/users/${id}`)
  },

  activateUser(id) {
    return apiClient.post(`/settings/users/${id}/activate`)
  },

  deactivateUser(id) {
    return apiClient.post(`/settings/users/${id}/deactivate`)
  },

  resetUserPassword(id) {
    return apiClient.post(`/settings/users/${id}/reset-password`)
  },

  // ==================== ROLES ====================
  
  getRoles(params = {}) {
    return apiClient.get('/settings/roles', params)
  },

  getRole(id) {
    return apiClient.get(`/settings/roles/${id}`)
  },

  createRole(data) {
    return apiClient.post('/settings/roles', data)
  },

  updateRole(id, data) {
    return apiClient.put(`/settings/roles/${id}`, data)
  },

  deleteRole(id) {
    return apiClient.delete(`/settings/roles/${id}`)
  },

  // ==================== PERMISSIONS ====================
  
  getPermissions() {
    return apiClient.get('/settings/permissions')
  },

  getPermissionGroups() {
    return apiClient.get('/settings/permissions/groups')
  },

  updateRolePermissions(roleId, data) {
    return apiClient.put(`/settings/roles/${roleId}/permissions`, data)
  },

  updateUserPermissions(userId, data) {
    return apiClient.put(`/settings/users/${userId}/permissions`, data)
  },

  // ==================== CATEGORIES ====================
  
  getCategories(type) {
    return apiClient.get(`/settings/categories/${type}`)
  },

  getCategory(type, id) {
    return apiClient.get(`/settings/categories/${type}/${id}`)
  },

  createCategory(type, data) {
    return apiClient.post(`/settings/categories/${type}`, data)
  },

  updateCategory(type, id, data) {
    return apiClient.put(`/settings/categories/${type}/${id}`, data)
  },

  deleteCategory(type, id) {
    return apiClient.delete(`/settings/categories/${type}/${id}`)
  },

  reorderCategories(type, data) {
    return apiClient.put(`/settings/categories/${type}/reorder`, data)
  },

  // ==================== MODULE CONFIGURATION ====================
  
  getConfiguration(module) {
    return apiClient.get(`/settings/configuration/${module}`)
  },

  updateConfiguration(module, data) {
    return apiClient.put(`/settings/configuration/${module}`, data)
  },

  resetConfiguration(module) {
    return apiClient.post(`/settings/configuration/${module}/reset`)
  },

  // ==================== EMAIL TEMPLATES ====================
  
  getEmailTemplates(params = {}) {
    return apiClient.get('/settings/email-templates', params)
  },

  getEmailTemplate(id) {
    return apiClient.get(`/settings/email-templates/${id}`)
  },

  createEmailTemplate(data) {
    return apiClient.post('/settings/email-templates', data)
  },

  updateEmailTemplate(id, data) {
    return apiClient.put(`/settings/email-templates/${id}`, data)
  },

  deleteEmailTemplate(id) {
    return apiClient.delete(`/settings/email-templates/${id}`)
  },

  testEmailTemplate(id, recipient) {
    return apiClient.post(`/settings/email-templates/${id}/test`, { recipient })
  },

  // ==================== SMS TEMPLATES ====================
  
  getSMSTemplates(params = {}) {
    return apiClient.get('/settings/sms-templates', params)
  },

  getSMSTemplate(id) {
    return apiClient.get(`/settings/sms-templates/${id}`)
  },

  createSMSTemplate(data) {
    return apiClient.post('/settings/sms-templates', data)
  },

  updateSMSTemplate(id, data) {
    return apiClient.put(`/settings/sms-templates/${id}`, data)
  },

  deleteSMSTemplate(id) {
    return apiClient.delete(`/settings/sms-templates/${id}`)
  },

  testSMSTemplate(id, recipient) {
    return apiClient.post(`/settings/sms-templates/${id}/test`, { recipient })
  },

  // ==================== TAX SETTINGS ====================
  
  getTaxSettings() {
    return apiClient.get('/settings/tax')
  },

  updateTaxSettings(data) {
    return apiClient.put('/settings/tax', data)
  },

  getTaxRates() {
    return apiClient.get('/settings/tax/rates')
  },

  createTaxRate(data) {
    return apiClient.post('/settings/tax/rates', data)
  },

  updateTaxRate(id, data) {
    return apiClient.put(`/settings/tax/rates/${id}`, data)
  },

  deleteTaxRate(id) {
    return apiClient.delete(`/settings/tax/rates/${id}`)
  },

  // ==================== PAYMENT METHODS ====================
  
  getPaymentMethods() {
    return apiClient.get('/settings/payment-methods')
  },

  createPaymentMethod(data) {
    return apiClient.post('/settings/payment-methods', data)
  },

  updatePaymentMethod(id, data) {
    return apiClient.put(`/settings/payment-methods/${id}`, data)
  },

  deletePaymentMethod(id) {
    return apiClient.delete(`/settings/payment-methods/${id}`)
  },

  togglePaymentMethod(id) {
    return apiClient.patch(`/settings/payment-methods/${id}/toggle`)
  },

  // ==================== BACKUP SETTINGS ====================
  
  getBackupSettings() {
    return apiClient.get('/settings/backup')
  },

  updateBackupSettings(data) {
    return apiClient.put('/settings/backup', data)
  },

  createBackup() {
    return apiClient.post('/settings/backup/create')
  },

  getBackups() {
    return apiClient.get('/settings/backup/list')
  },

  downloadBackup(id) {
    return apiClient.download(`/settings/backup/${id}/download`, `backup-${id}.zip`)
  },

  deleteBackup(id) {
    return apiClient.delete(`/settings/backup/${id}`)
  },

  restoreBackup(id) {
    return apiClient.post(`/settings/backup/${id}/restore`)
  },

  // ==================== INTEGRATIONS ====================
  
  getIntegrations() {
    return apiClient.get('/settings/integrations')
  },

  getIntegration(type) {
    return apiClient.get(`/settings/integrations/${type}`)
  },

  updateIntegration(type, data) {
    return apiClient.put(`/settings/integrations/${type}`, data)
  },

  testIntegration(type) {
    return apiClient.post(`/settings/integrations/${type}/test`)
  },

  enableIntegration(type) {
    return apiClient.post(`/settings/integrations/${type}/enable`)
  },

  disableIntegration(type) {
    return apiClient.post(`/settings/integrations/${type}/disable`)
  },

  // ==================== LOCALIZATION ====================
  
  getLanguages() {
    return apiClient.get('/settings/localization/languages')
  },

  getCurrencies() {
    return apiClient.get('/settings/localization/currencies')
  },

  getTimezones() {
    return apiClient.get('/settings/localization/timezones')
  },

  getDateFormats() {
    return apiClient.get('/settings/localization/date-formats')
  },

  // ==================== SECURITY ====================
  
  getSecuritySettings() {
    return apiClient.get('/settings/security')
  },

  updateSecuritySettings(data) {
    return apiClient.put('/settings/security', data)
  },

  getSessionSettings() {
    return apiClient.get('/settings/security/sessions')
  },

  updateSessionSettings(data) {
    return apiClient.put('/settings/security/sessions', data)
  },

  getPasswordPolicy() {
    return apiClient.get('/settings/security/password-policy')
  },

  updatePasswordPolicy(data) {
    return apiClient.put('/settings/security/password-policy', data)
  },

  // ==================== AUDIT LOG ====================
  
  getAuditLogs(params = {}) {
    return apiClient.get('/settings/audit-logs', params)
  },

  getAuditLog(id) {
    return apiClient.get(`/settings/audit-logs/${id}`)
  },

  exportAuditLogs(params = {}, format = 'xlsx') {
    return apiClient.download('/settings/audit-logs/export', `audit-logs.${format}`, { ...params, format })
  },

  // ==================== ACTIVITY LOG ====================
  
  getActivityLogs(params = {}) {
    return apiClient.get('/settings/activity-logs', params)
  },

  getUserActivityLogs(userId, params = {}) {
    return apiClient.get(`/settings/users/${userId}/activity`, params)
  },

  // ==================== SYSTEM INFO ====================
  
  getSystemInfo() {
    return apiClient.get('/settings/system/info')
  },

  getSystemHealth() {
    return apiClient.get('/settings/system/health')
  },

  clearCache() {
    return apiClient.post('/settings/system/clear-cache')
  },

  optimizeDatabase() {
    return apiClient.post('/settings/system/optimize-database')
  },

  // ==================== IMPORTS ====================
  
  importSettings(formData, onProgress) {
    return apiClient.upload('/settings/import', formData, onProgress)
  },

  // ==================== EXPORTS ====================
  
  exportSettings(format = 'json') {
    return apiClient.download('/settings/export', `settings.${format}`, { format })
  },

  exportUsers(params = {}, format = 'xlsx') {
    return apiClient.download('/settings/users/export', `users.${format}`, { ...params, format })
  },

  exportRoles(format = 'xlsx') {
    return apiClient.download('/settings/roles/export', `roles.${format}`, { format })
  }
}

export default settingsService