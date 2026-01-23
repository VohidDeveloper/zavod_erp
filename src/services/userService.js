import { apiClient } from './api'

const userService = {
  // ==================== PROFILE ====================
  
  getProfile() {
    return apiClient.get('/user/profile')
  },

  updateProfile(data) {
    return apiClient.put('/user/profile', data)
  },

  uploadAvatar(formData, onProgress) {
    return apiClient.upload('/user/avatar', formData, onProgress)
  },

  removeAvatar() {
    return apiClient.delete('/user/avatar')
  },

  // ==================== PREFERENCES ====================
  
  getPreferences() {
    return apiClient.get('/user/preferences')
  },

  updatePreferences(data) {
    return apiClient.put('/user/preferences', data)
  },

  // ==================== ACTIVITY ====================
  
  getRecentActivity(params = {}) {
    return apiClient.get('/user/activity/recent', params)
  },

  getActivityHistory(params = {}) {
    return apiClient.get('/user/activity/history', params)
  },

  getLoginHistory(params = {}) {
    return apiClient.get('/user/login-history', params)
  },

  logActivity(data) {
    return apiClient.post('/user/activity', data)
  },

  // ==================== STATISTICS ====================
  
  getStats() {
    return apiClient.get('/user/stats')
  },

  getDashboardStats() {
    return apiClient.get('/user/stats/dashboard')
  },

  getModuleStats(module) {
    return apiClient.get(`/user/stats/${module}`)
  },

  // ==================== SAVED FILTERS ====================
  
  getSavedFilters(params = {}) {
    return apiClient.get('/user/saved-filters', params)
  },

  getSavedFilter(id) {
    return apiClient.get(`/user/saved-filters/${id}`)
  },

  saveFilter(data) {
    return apiClient.post('/user/saved-filters', data)
  },

  updateFilter(id, data) {
    return apiClient.put(`/user/saved-filters/${id}`, data)
  },

  deleteFilter(id) {
    return apiClient.delete(`/user/saved-filters/${id}`)
  },

  applyFilter(id) {
    return apiClient.get(`/user/saved-filters/${id}/apply`)
  },

  // ==================== BOOKMARKS ====================
  
  getBookmarks(params = {}) {
    return apiClient.get('/user/bookmarks', params)
  },

  getBookmarksByType(type, params = {}) {
    return apiClient.get(`/user/bookmarks/${type}`, params)
  },

  addBookmark(data) {
    return apiClient.post('/user/bookmarks', data)
  },

  removeBookmark(id) {
    return apiClient.delete(`/user/bookmarks/${id}`)
  },

  toggleBookmark(data) {
    return apiClient.post('/user/bookmarks/toggle', data)
  },

  // ==================== RECENT ITEMS ====================
  
  getRecentItems(type, params = {}) {
    return apiClient.get(`/user/recent/${type}`, params)
  },

  addRecentItem(type, data) {
    return apiClient.post(`/user/recent/${type}`, data)
  },

  clearRecentItems(type) {
    return apiClient.delete(`/user/recent/${type}`)
  },

  // ==================== QUICK ACCESS ====================
  
  getQuickAccess() {
    return apiClient.get('/user/quick-access')
  },

  updateQuickAccess(data) {
    return apiClient.put('/user/quick-access', data)
  },

  addToQuickAccess(data) {
    return apiClient.post('/user/quick-access', data)
  },

  removeFromQuickAccess(id) {
    return apiClient.delete(`/user/quick-access/${id}`)
  },

  reorderQuickAccess(data) {
    return apiClient.put('/user/quick-access/reorder', data)
  },

  // ==================== NOTIFICATION PREFERENCES ====================
  
  getNotificationPreferences() {
    return apiClient.get('/user/notification-preferences')
  },

  updateNotificationPreferences(data) {
    return apiClient.put('/user/notification-preferences', data)
  },

  updateModuleNotificationPreferences(module, data) {
    return apiClient.put(`/user/notification-preferences/${module}`, data)
  },

  // ==================== PASSWORD & SECURITY ====================
  
  changePassword(data) {
    return apiClient.post('/user/change-password', data)
  },

  enableTwoFactor() {
    return apiClient.post('/user/two-factor/enable')
  },

  disableTwoFactor() {
    return apiClient.post('/user/two-factor/disable')
  },

  verifyTwoFactor(code) {
    return apiClient.post('/user/two-factor/verify', { code })
  },

  getTwoFactorQRCode() {
    return apiClient.get('/user/two-factor/qr-code')
  },

  getTwoFactorRecoveryCodes() {
    return apiClient.get('/user/two-factor/recovery-codes')
  },

  regenerateRecoveryCodes() {
    return apiClient.post('/user/two-factor/recovery-codes/regenerate')
  },

  // ==================== SESSIONS ====================
  
  getActiveSessions() {
    return apiClient.get('/user/sessions')
  },

  revokeSession(sessionId) {
    return apiClient.delete(`/user/sessions/${sessionId}`)
  },

  revokeAllSessions() {
    return apiClient.delete('/user/sessions/all')
  },

  getCurrentSession() {
    return apiClient.get('/user/sessions/current')
  },

  // ==================== API TOKENS ====================
  
  getApiTokens() {
    return apiClient.get('/user/api-tokens')
  },

  createApiToken(data) {
    return apiClient.post('/user/api-tokens', data)
  },

  revokeApiToken(id) {
    return apiClient.delete(`/user/api-tokens/${id}`)
  },

  regenerateApiToken(id) {
    return apiClient.post(`/user/api-tokens/${id}/regenerate`)
  },

  // ==================== DASHBOARD WIDGETS ====================
  
  getDashboardWidgets() {
    return apiClient.get('/user/dashboard/widgets')
  },

  updateDashboardWidgets(data) {
    return apiClient.put('/user/dashboard/widgets', data)
  },

  addDashboardWidget(data) {
    return apiClient.post('/user/dashboard/widgets', data)
  },

  removeDashboardWidget(id) {
    return apiClient.delete(`/user/dashboard/widgets/${id}`)
  },

  reorderDashboardWidgets(data) {
    return apiClient.put('/user/dashboard/widgets/reorder', data)
  },

  // ==================== SHORTCUTS ====================
  
  getKeyboardShortcuts() {
    return apiClient.get('/user/shortcuts')
  },

  updateKeyboardShortcuts(data) {
    return apiClient.put('/user/shortcuts', data)
  },

  resetKeyboardShortcuts() {
    return apiClient.post('/user/shortcuts/reset')
  },

  // ==================== NOTES ====================
  
  getNotes(params = {}) {
    return apiClient.get('/user/notes', params)
  },

  getNote(id) {
    return apiClient.get(`/user/notes/${id}`)
  },

  createNote(data) {
    return apiClient.post('/user/notes', data)
  },

  updateNote(id, data) {
    return apiClient.put(`/user/notes/${id}`, data)
  },

  deleteNote(id) {
    return apiClient.delete(`/user/notes/${id}`)
  },

  // ==================== TASKS ====================
  
  getTasks(params = {}) {
    return apiClient.get('/user/tasks', params)
  },

  getTask(id) {
    return apiClient.get(`/user/tasks/${id}`)
  },

  createTask(data) {
    return apiClient.post('/user/tasks', data)
  },

  updateTask(id, data) {
    return apiClient.put(`/user/tasks/${id}`, data)
  },

  deleteTask(id) {
    return apiClient.delete(`/user/tasks/${id}`)
  },

  completeTask(id) {
    return apiClient.post(`/user/tasks/${id}/complete`)
  },

  // ==================== CALENDAR ====================
  
  getCalendarEvents(params = {}) {
    return apiClient.get('/user/calendar/events', params)
  },

  createCalendarEvent(data) {
    return apiClient.post('/user/calendar/events', data)
  },

  updateCalendarEvent(id, data) {
    return apiClient.put(`/user/calendar/events/${id}`, data)
  },

  deleteCalendarEvent(id) {
    return apiClient.delete(`/user/calendar/events/${id}`)
  },

  // ==================== SEARCH HISTORY ====================
  
  getSearchHistory(params = {}) {
    return apiClient.get('/user/search-history', params)
  },

  addSearchHistory(query) {
    return apiClient.post('/user/search-history', { query })
  },

  clearSearchHistory() {
    return apiClient.delete('/user/search-history')
  },

  // ==================== THEME ====================
  
  getThemeSettings() {
    return apiClient.get('/user/theme')
  },

  updateThemeSettings(data) {
    return apiClient.put('/user/theme', data)
  },

  // ==================== LANGUAGE ====================
  
  getLanguageSettings() {
    return apiClient.get('/user/language')
  },

  updateLanguageSettings(language) {
    return apiClient.put('/user/language', { language })
  },

  // ==================== DATA EXPORT ====================
  
  exportUserData(format = 'json') {
    return apiClient.download('/user/export', `user-data.${format}`, { format })
  },

  exportActivity(params = {}, format = 'xlsx') {
    return apiClient.download('/user/activity/export', `activity.${format}`, { ...params, format })
  },

  // ==================== ACCOUNT ====================
  
  deleteAccount(data) {
    return apiClient.post('/user/delete-account', data)
  },

  requestAccountData() {
    return apiClient.post('/user/request-data')
  },

  // ==================== HELP & SUPPORT ====================
  
  submitFeedback(data) {
    return apiClient.post('/user/feedback', data)
  },

  reportBug(data) {
    return apiClient.post('/user/bug-report', data)
  },

  requestFeature(data) {
    return apiClient.post('/user/feature-request', data)
  },

  // ==================== NOTIFICATIONS ====================
  
  getUserNotifications(params = {}) {
    return apiClient.get('/user/notifications', params)
  },

  markNotificationRead(id) {
    return apiClient.patch(`/user/notifications/${id}/read`)
  },

  // ==================== PERMISSIONS ====================
  
  getUserPermissions() {
    return apiClient.get('/user/permissions')
  },

  checkPermission(permission) {
    return apiClient.get('/user/permissions/check', { permission })
  }
}

export default userService