import { apiClient } from './api'

const notificationService = {
  // ==================== FETCH ====================
  
  getNotifications(params = {}) {
    return apiClient.get('/notifications', params)
  },

  getNotification(id) {
    return apiClient.get(`/notifications/${id}`)
  },

  getUnreadCount() {
    return apiClient.get('/notifications/unread/count')
  },

  getUnreadNotifications(params = {}) {
    return apiClient.get('/notifications/unread', params)
  },

  // ==================== READ/UNREAD ====================
  
  markAsRead(id) {
    return apiClient.patch(`/notifications/${id}/read`)
  },

  markAsUnread(id) {
    return apiClient.patch(`/notifications/${id}/unread`)
  },

  markAllAsRead() {
    return apiClient.post('/notifications/mark-all-read')
  },

  markMultipleAsRead(data) {
    return apiClient.post('/notifications/mark-multiple-read', data)
  },

  // ==================== DELETE ====================
  
  deleteNotification(id) {
    return apiClient.delete(`/notifications/${id}`)
  },

  deleteMultiple(data) {
    return apiClient.post('/notifications/delete-multiple', data)
  },

  deleteRead() {
    return apiClient.delete('/notifications/read')
  },

  clearAll() {
    return apiClient.delete('/notifications/all')
  },

  // ==================== FILTER ====================
  
  getByType(type, params = {}) {
    return apiClient.get(`/notifications/type/${type}`, params)
  },

  getByPriority(priority, params = {}) {
    return apiClient.get(`/notifications/priority/${priority}`, params)
  },

  getByCategory(category, params = {}) {
    return apiClient.get(`/notifications/category/${category}`, params)
  },

  getToday(params = {}) {
    return apiClient.get('/notifications/today', params)
  },

  getThisWeek(params = {}) {
    return apiClient.get('/notifications/this-week', params)
  },

  // ==================== SETTINGS ====================
  
  getSettings() {
    return apiClient.get('/notifications/settings')
  },

  updateSettings(data) {
    return apiClient.put('/notifications/settings', data)
  },

  getPreferences() {
    return apiClient.get('/notifications/preferences')
  },

  updatePreferences(data) {
    return apiClient.put('/notifications/preferences', data)
  },

  // ==================== CHANNELS ====================
  
  getChannelSettings() {
    return apiClient.get('/notifications/channels')
  },

  updateChannelSettings(channel, data) {
    return apiClient.put(`/notifications/channels/${channel}`, data)
  },

  testNotification(channel, data) {
    return apiClient.post(`/notifications/test/${channel}`, data)
  },

  // ==================== SUBSCRIPTION ====================
  
  subscribe(data) {
    return apiClient.post('/notifications/subscribe', data)
  },

  unsubscribe(data) {
    return apiClient.post('/notifications/unsubscribe', data)
  },

  getSubscriptions() {
    return apiClient.get('/notifications/subscriptions')
  },

  // ==================== PUSH NOTIFICATIONS ====================
  
  registerPushDevice(data) {
    return apiClient.post('/notifications/push/register', data)
  },

  unregisterPushDevice(deviceId) {
    return apiClient.delete(`/notifications/push/devices/${deviceId}`)
  },

  getPushDevices() {
    return apiClient.get('/notifications/push/devices')
  },

  // ==================== EMAIL ====================
  
  verifyEmail(email) {
    return apiClient.post('/notifications/email/verify', { email })
  },

  unsubscribeEmail(token) {
    return apiClient.post('/notifications/email/unsubscribe', { token })
  },

  // ==================== SMS ====================
  
  verifySMS(phone) {
    return apiClient.post('/notifications/sms/verify', { phone })
  },

  unsubscribeSMS(token) {
    return apiClient.post('/notifications/sms/unsubscribe', { token })
  },

  // ==================== TEMPLATES ====================
  
  getTemplates(params = {}) {
    return apiClient.get('/notifications/templates', params)
  },

  getTemplate(id) {
    return apiClient.get(`/notifications/templates/${id}`)
  },

  // ==================== HISTORY ====================
  
  getHistory(params = {}) {
    return apiClient.get('/notifications/history', params)
  },

  getSentNotifications(params = {}) {
    return apiClient.get('/notifications/sent', params)
  },

  // ==================== STATISTICS ====================
  
  getStats(params = {}) {
    return apiClient.get('/notifications/stats', params)
  },

  getDeliveryStats(params = {}) {
    return apiClient.get('/notifications/stats/delivery', params)
  },

  // ==================== BULK OPERATIONS ====================
  
  sendBulkNotification(data) {
    return apiClient.post('/notifications/bulk/send', data)
  },

  scheduleBulkNotification(data) {
    return apiClient.post('/notifications/bulk/schedule', data)
  },

  // ==================== SCHEDULED ====================
  
  getScheduledNotifications(params = {}) {
    return apiClient.get('/notifications/scheduled', params)
  },

  scheduleNotification(data) {
    return apiClient.post('/notifications/schedule', data)
  },

  cancelScheduled(id) {
    return apiClient.delete(`/notifications/scheduled/${id}`)
  },

  // ==================== EXPORTS ====================
  
  exportNotifications(params = {}, format = 'xlsx') {
    return apiClient.download('/notifications/export', `notifications.${format}`, { ...params, format })
  }
}

export default notificationService