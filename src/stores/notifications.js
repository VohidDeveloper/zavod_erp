import { defineStore } from 'pinia'
import notificationService from '@/services/notificationService'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    // Notifications
    notifications: [],
    unreadCount: 0,
    
    // Notification types
    types: {
      info: [],
      success: [],
      warning: [],
      error: [],
      system: []
    },
    
    // Priority
    priorities: {
      low: [],
      normal: [],
      high: [],
      urgent: []
    },
    
    // Categories
    categories: {
      production: [],
      sales: [],
      finance: [],
      warehouse: [],
      hr: [],
      maintenance: [],
      system: []
    },
    
    // Filter & Sort
    filter: 'all', // all, unread, read, today, thisWeek
    sortBy: 'created_at', // created_at, priority, type
    sortOrder: 'desc', // asc, desc
    
    // Pagination
    currentPage: 1,
    perPage: 20,
    total: 0,
    
    // Settings
    settings: {
      sound: true,
      desktop: true,
      email: false,
      sms: false,
      autoMarkRead: true,
      showPreview: true
    },
    
    // Real-time
    connected: false,
    lastUpdate: null,
    
    // Loading
    loading: false,
    error: null
  }),

  getters: {
    // Filtered notifications
    unreadNotifications: (state) => {
      return state.notifications.filter(n => !n.read)
    },
    
    readNotifications: (state) => {
      return state.notifications.filter(n => n.read)
    },
    
    filteredNotifications: (state) => {
      let filtered = state.notifications
      
      // Apply filter
      switch (state.filter) {
        case 'unread':
          filtered = filtered.filter(n => !n.read)
          break
        case 'read':
          filtered = filtered.filter(n => n.read)
          break
        case 'today':
          const today = new Date().toISOString().split('T')[0]
          filtered = filtered.filter(n => n.created_at.startsWith(today))
          break
        case 'thisWeek':
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          filtered = filtered.filter(n => new Date(n.created_at) >= weekAgo)
          break
      }
      
      // Apply sort
      filtered = [...filtered].sort((a, b) => {
        let compareA, compareB
        
        switch (state.sortBy) {
          case 'priority':
            const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 }
            compareA = priorityOrder[a.priority] || 0
            compareB = priorityOrder[b.priority] || 0
            break
          case 'type':
            compareA = a.type
            compareB = b.type
            break
          case 'created_at':
          default:
            compareA = new Date(a.created_at)
            compareB = new Date(b.created_at)
        }
        
        if (state.sortOrder === 'asc') {
          return compareA > compareB ? 1 : -1
        } else {
          return compareA < compareB ? 1 : -1
        }
      })
      
      return filtered
    },
    
    // By type
    notificationsByType: (state) => (type) => {
      return state.notifications.filter(n => n.type === type)
    },
    
    // By priority
    notificationsByPriority: (state) => (priority) => {
      return state.notifications.filter(n => n.priority === priority)
    },
    
    // By category
    notificationsByCategory: (state) => (category) => {
      return state.notifications.filter(n => n.category === category)
    },
    
    // Urgent notifications
    urgentNotifications: (state) => {
      return state.notifications.filter(n => n.priority === 'urgent' && !n.read)
    },
    
    // Recent notifications (last 10)
    recentNotifications: (state) => {
      return state.notifications.slice(0, 10)
    },
    
    // Today's notifications
    todayNotifications: (state) => {
      const today = new Date().toISOString().split('T')[0]
      return state.notifications.filter(n => n.created_at.startsWith(today))
    },
    
    // Has unread
    hasUnread: (state) => {
      return state.unreadCount > 0
    },
    
    // Pagination
    totalPages: (state) => {
      return Math.ceil(state.total / state.perPage)
    },
    
    paginatedNotifications: (state) => {
      const start = (state.currentPage - 1) * state.perPage
      const end = start + state.perPage
      return state.filteredNotifications.slice(start, end)
    }
  },

  actions: {
    // ==================== FETCH ====================
    
    async fetchNotifications(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await notificationService.getNotifications({
          page: this.currentPage,
          per_page: this.perPage,
          filter: this.filter,
          sort_by: this.sortBy,
          sort_order: this.sortOrder,
          ...params
        })
        
        this.notifications = response.data
        this.total = response.total || response.data.length
        this.unreadCount = response.data.filter(n => !n.read).length
        this.updateTypeGroups()
        this.updatePriorityGroups()
        this.updateCategoryGroups()
        this.lastUpdate = new Date().toISOString()
        
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      try {
        const response = await notificationService.getUnreadCount()
        this.unreadCount = response.data.count
        return response
      } catch (error) {
        console.error('Failed to fetch unread count:', error)
      }
    },

    async refreshNotifications() {
      await this.fetchNotifications()
    },

    // ==================== READ/UNREAD ====================
    
    async markAsRead(id) {
      this.loading = true
      this.error = null
      try {
        await notificationService.markAsRead(id)
        
        const notification = this.notifications.find(n => n.id === id)
        if (notification && !notification.read) {
          notification.read = true
          notification.read_at = new Date().toISOString()
          this.unreadCount = Math.max(0, this.unreadCount - 1)
          this.updateTypeGroups()
          this.updatePriorityGroups()
          this.updateCategoryGroups()
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async markAsUnread(id) {
      this.loading = true
      this.error = null
      try {
        await notificationService.markAsUnread(id)
        
        const notification = this.notifications.find(n => n.id === id)
        if (notification && notification.read) {
          notification.read = false
          notification.read_at = null
          this.unreadCount++
          this.updateTypeGroups()
          this.updatePriorityGroups()
          this.updateCategoryGroups()
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async markAllAsRead() {
      this.loading = true
      this.error = null
      try {
        await notificationService.markAllAsRead()
        
        this.notifications.forEach(n => {
          if (!n.read) {
            n.read = true
            n.read_at = new Date().toISOString()
          }
        })
        this.unreadCount = 0
        this.updateTypeGroups()
        this.updatePriorityGroups()
        this.updateCategoryGroups()
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async markMultipleAsRead(ids) {
      this.loading = true
      this.error = null
      try {
        await notificationService.markMultipleAsRead({ ids })
        
        ids.forEach(id => {
          const notification = this.notifications.find(n => n.id === id)
          if (notification && !notification.read) {
            notification.read = true
            notification.read_at = new Date().toISOString()
            this.unreadCount = Math.max(0, this.unreadCount - 1)
          }
        })
        this.updateTypeGroups()
        this.updatePriorityGroups()
        this.updateCategoryGroups()
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== DELETE ====================
    
    async deleteNotification(id) {
      this.loading = true
      this.error = null
      try {
        await notificationService.deleteNotification(id)
        
        const index = this.notifications.findIndex(n => n.id === id)
        if (index !== -1) {
          const notification = this.notifications[index]
          if (!notification.read) {
            this.unreadCount = Math.max(0, this.unreadCount - 1)
          }
          this.notifications.splice(index, 1)
          this.total--
          this.updateTypeGroups()
          this.updatePriorityGroups()
          this.updateCategoryGroups()
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteMultiple(ids) {
      this.loading = true
      this.error = null
      try {
        await notificationService.deleteMultiple({ ids })
        
        ids.forEach(id => {
          const index = this.notifications.findIndex(n => n.id === id)
          if (index !== -1) {
            const notification = this.notifications[index]
            if (!notification.read) {
              this.unreadCount = Math.max(0, this.unreadCount - 1)
            }
            this.notifications.splice(index, 1)
            this.total--
          }
        })
        this.updateTypeGroups()
        this.updatePriorityGroups()
        this.updateCategoryGroups()
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteRead() {
      this.loading = true
      this.error = null
      try {
        await notificationService.deleteRead()
        
        this.notifications = this.notifications.filter(n => !n.read)
        this.total = this.notifications.length
        this.updateTypeGroups()
        this.updatePriorityGroups()
        this.updateCategoryGroups()
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async clearAll() {
      this.loading = true
      this.error = null
      try {
        await notificationService.clearAll()
        
        this.notifications = []
        this.unreadCount = 0
        this.total = 0
        this.types = { info: [], success: [], warning: [], error: [], system: [] }
        this.priorities = { low: [], normal: [], high: [], urgent: [] }
        this.categories = {
          production: [],
          sales: [],
          finance: [],
          warehouse: [],
          hr: [],
          maintenance: [],
          system: []
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== REAL-TIME ====================
    
    addNotification(notification) {
      // Add to beginning of array
      this.notifications.unshift(notification)
      this.total++
      
      if (!notification.read) {
        this.unreadCount++
      }
      
      this.updateTypeGroups()
      this.updatePriorityGroups()
      this.updateCategoryGroups()
      
      // Play sound if enabled
      if (this.settings.sound) {
        this.playNotificationSound()
      }
      
      // Show desktop notification if enabled
      if (this.settings.desktop && 'Notification' in window) {
        this.showDesktopNotification(notification)
      }
    },

    updateNotification(id, data) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification) {
        Object.assign(notification, data)
        this.updateTypeGroups()
        this.updatePriorityGroups()
        this.updateCategoryGroups()
      }
    },

    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index !== -1) {
        const notification = this.notifications[index]
        if (!notification.read) {
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        }
        this.notifications.splice(index, 1)
        this.total--
        this.updateTypeGroups()
        this.updatePriorityGroups()
        this.updateCategoryGroups()
      }
    },

    // ==================== SETTINGS ====================
    
    async fetchSettings() {
      this.loading = true
      this.error = null
      try {
        const response = await notificationService.getSettings()
        this.settings = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSettings(data) {
      this.loading = true
      this.error = null
      try {
        const response = await notificationService.updateSettings(data)
        this.settings = { ...this.settings, ...response.data }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    toggleSetting(key) {
      this.settings[key] = !this.settings[key]
      this.updateSettings({ [key]: this.settings[key] })
    },

    // ==================== FILTER & SORT ====================
    
    setFilter(filter) {
      this.filter = filter
      this.currentPage = 1
    },

    setSortBy(sortBy) {
      if (this.sortBy === sortBy) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortBy = sortBy
        this.sortOrder = 'desc'
      }
    },

    setSortOrder(order) {
      this.sortOrder = order
    },

    // ==================== PAGINATION ====================
    
    setPage(page) {
      this.currentPage = page
      this.fetchNotifications()
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchNotifications()
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchNotifications()
      }
    },

    setPerPage(perPage) {
      this.perPage = perPage
      this.currentPage = 1
      this.fetchNotifications()
    },

    // ==================== HELPERS ====================
    
    updateTypeGroups() {
      this.types = {
        info: this.notifications.filter(n => n.type === 'info'),
        success: this.notifications.filter(n => n.type === 'success'),
        warning: this.notifications.filter(n => n.type === 'warning'),
        error: this.notifications.filter(n => n.type === 'error'),
        system: this.notifications.filter(n => n.type === 'system')
      }
    },

    updatePriorityGroups() {
      this.priorities = {
        low: this.notifications.filter(n => n.priority === 'low'),
        normal: this.notifications.filter(n => n.priority === 'normal'),
        high: this.notifications.filter(n => n.priority === 'high'),
        urgent: this.notifications.filter(n => n.priority === 'urgent')
      }
    },

    updateCategoryGroups() {
      this.categories = {
        production: this.notifications.filter(n => n.category === 'production'),
        sales: this.notifications.filter(n => n.category === 'sales'),
        finance: this.notifications.filter(n => n.category === 'finance'),
        warehouse: this.notifications.filter(n => n.category === 'warehouse'),
        hr: this.notifications.filter(n => n.category === 'hr'),
        maintenance: this.notifications.filter(n => n.category === 'maintenance'),
        system: this.notifications.filter(n => n.category === 'system')
      }
    },

    playNotificationSound() {
      // Simple beep sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2a+7OegTAwhTqbh7q1jHgU3kdXx0IU')
      audio.play().catch(() => {})
    },

    showDesktopNotification(notification) {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id
        })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.showDesktopNotification(notification)
          }
        })
      }
    },

    // WebSocket connection
    connect() {
      this.connected = true
    },

    disconnect() {
      this.connected = false
    },

    // Reset
    reset() {
      this.notifications = []
      this.unreadCount = 0
      this.total = 0
      this.currentPage = 1
      this.filter = 'all'
      this.sortBy = 'created_at'
      this.sortOrder = 'desc'
      this.types = { info: [], success: [], warning: [], error: [], system: [] }
      this.priorities = { low: [], normal: [], high: [], urgent: [] }
      this.categories = {
        production: [],
        sales: [],
        finance: [],
        warehouse: [],
        hr: [],
        maintenance: [],
        system: []
      }
      this.error = null
    }
  }
})