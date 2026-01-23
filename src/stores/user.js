import { defineStore } from 'pinia'
import userService from '@/services/userService'

export const useUserStore = defineStore('user', {
  state: () => ({
    // Current user profile
    profile: null,
    
    // User preferences
    preferences: {
      language: 'uz',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: false,
        desktop: true,
        sound: true
      },
      dashboard: {
        layout: 'grid', // grid, list
        widgets: [
          'production_stats',
          'sales_stats',
          'finance_stats',
          'warehouse_stats'
        ],
        refreshInterval: 300000 // 5 minutes
      },
      display: {
        itemsPerPage: 10,
        dateFormat: 'DD.MM.YYYY',
        timeFormat: '24h',
        timezone: 'Asia/Tashkent',
        currency: 'UZS'
      }
    },
    
    // User activity
    recentActivity: [],
    loginHistory: [],
    
    // User statistics
    stats: {
      totalOrders: 0,
      totalSales: 0,
      totalProduction: 0,
      loginCount: 0,
      lastLogin: null,
      accountAge: null,
      tasksCompleted: 0,
      documentsCreated: 0
    },
    
    // Saved searches/filters
    savedFilters: [],
    
    // Bookmarks/favorites
    bookmarks: [],
    
    // Recent items
    recentItems: {
      products: [],
      customers: [],
      orders: [],
      documents: []
    },
    
    // Quick access
    quickAccess: [],
    
    // Notifications preferences
    notificationPreferences: {
      production: {
        enabled: true,
        priorities: ['high', 'urgent'],
        channels: ['push', 'email']
      },
      sales: {
        enabled: true,
        priorities: ['high', 'urgent'],
        channels: ['push', 'email']
      },
      warehouse: {
        enabled: true,
        priorities: ['urgent'],
        channels: ['push']
      },
      finance: {
        enabled: true,
        priorities: ['high', 'urgent'],
        channels: ['email']
      }
    },
    
    // Security
    security: {
      twoFactorEnabled: false,
      lastPasswordChange: null,
      passwordExpiryDays: 90,
      activeSessions: []
    },
    
    // Loading
    loading: false,
    profileLoading: false,
    activityLoading: false,
    
    error: null
  }),

  getters: {
    // Profile
    fullName: (state) => {
      if (!state.profile) return ''
      return `${state.profile.first_name || ''} ${state.profile.last_name || ''}`.trim() || 'User'
    },
    
    initials: (state) => {
      if (!state.profile) return 'U'
      const first = state.profile.first_name?.[0] || ''
      const last = state.profile.last_name?.[0] || ''
      return (first + last).toUpperCase() || 'U'
    },
    
    email: (state) => state.profile?.email || '',
    phone: (state) => state.profile?.phone || '',
    avatar: (state) => state.profile?.avatar || null,
    
    // Role & Permissions
    role: (state) => state.profile?.role || '',
    permissions: (state) => state.profile?.permissions || [],
    
    isAdmin: (state) => {
      return state.profile?.role === 'admin' || state.profile?.role === 'super_admin'
    },
    
    isSuperAdmin: (state) => {
      return state.profile?.role === 'super_admin'
    },
    
    hasPermission: (state) => (permission) => {
      if (!state.profile) return false
      if (state.profile.role === 'super_admin') return true
      return state.profile.permissions?.includes(permission) || false
    },
    
    hasAnyPermission: (state) => (permissions) => {
      if (!state.profile) return false
      if (state.profile.role === 'super_admin') return true
      return permissions.some(p => state.profile.permissions?.includes(p))
    },
    
    hasAllPermissions: (state) => (permissions) => {
      if (!state.profile) return false
      if (state.profile.role === 'super_admin') return true
      return permissions.every(p => state.profile.permissions?.includes(p))
    },
    
    // Preferences
    isDarkMode: (state) => state.preferences.theme === 'dark',
    currentLanguage: (state) => state.preferences.language,
    dashboardLayout: (state) => state.preferences.dashboard.layout,
    
    // Notifications
    isEmailNotificationsEnabled: (state) => state.preferences.notifications.email,
    isPushNotificationsEnabled: (state) => state.preferences.notifications.push,
    isDesktopNotificationsEnabled: (state) => state.preferences.notifications.desktop,
    isSoundNotificationsEnabled: (state) => state.preferences.notifications.sound,
    
    // Activity
    recentActivityCount: (state) => state.recentActivity.length,
    lastActivity: (state) => state.recentActivity[0] || null,
    
    // Bookmarks
    bookmarkedCount: (state) => state.bookmarks.length,
    hasBookmark: (state) => (type, id) => {
      return state.bookmarks.some(b => b.type === type && b.id === id)
    },
    
    // Security
    isTwoFactorEnabled: (state) => state.security.twoFactorEnabled,
    passwordNeedsChange: (state) => {
      if (!state.security.lastPasswordChange) return true
      const daysSinceChange = Math.floor(
        (new Date() - new Date(state.security.lastPasswordChange)) / (1000 * 60 * 60 * 24)
      )
      return daysSinceChange >= state.security.passwordExpiryDays
    }
  },

  actions: {
    // ==================== PROFILE ====================
    
    async fetchProfile() {
      this.profileLoading = true
      this.error = null
      try {
        const response = await userService.getProfile()
        this.profile = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.profileLoading = false
      }
    },

    async updateProfile(data) {
      this.loading = true
      this.error = null
      try {
        const response = await userService.updateProfile(data)
        this.profile = { ...this.profile, ...response.data }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async uploadAvatar(file) {
      this.loading = true
      this.error = null
      try {
        const formData = new FormData()
        formData.append('avatar', file)
        const response = await userService.uploadAvatar(formData)
        if (this.profile) {
          this.profile.avatar = response.data.avatar
        }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeAvatar() {
      this.loading = true
      this.error = null
      try {
        await userService.removeAvatar()
        if (this.profile) {
          this.profile.avatar = null
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== PREFERENCES ====================
    
    async fetchPreferences() {
      this.loading = true
      this.error = null
      try {
        const response = await userService.getPreferences()
        this.preferences = { ...this.preferences, ...response.data }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePreferences(data) {
      this.loading = true
      this.error = null
      try {
        const response = await userService.updatePreferences(data)
        this.preferences = { ...this.preferences, ...response.data }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    toggleTheme() {
      const newTheme = this.preferences.theme === 'light' ? 'dark' : 'light'
      this.preferences.theme = newTheme
      this.updatePreferences({ theme: newTheme })
      
      // Apply theme to document
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    },

    setLanguage(language) {
      this.preferences.language = language
      this.updatePreferences({ language })
    },

    setDashboardLayout(layout) {
      this.preferences.dashboard.layout = layout
      this.updatePreferences({ dashboard: this.preferences.dashboard })
    },

    toggleNotification(type, value) {
      this.preferences.notifications[type] = value
      this.updatePreferences({ notifications: this.preferences.notifications })
    },

    // ==================== ACTIVITY ====================
    
    async fetchRecentActivity(params = {}) {
      this.activityLoading = true
      this.error = null
      try {
        const response = await userService.getRecentActivity({
          limit: 20,
          ...params
        })
        this.recentActivity = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.activityLoading = false
      }
    },

    async fetchLoginHistory(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await userService.getLoginHistory(params)
        this.loginHistory = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    addActivity(activity) {
      this.recentActivity.unshift(activity)
      if (this.recentActivity.length > 50) {
        this.recentActivity = this.recentActivity.slice(0, 50)
      }
    },

    // ==================== STATISTICS ====================
    
    async fetchStats() {
      this.loading = true
      this.error = null
      try {
        const response = await userService.getStats()
        this.stats = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== SAVED FILTERS ====================
    
    async fetchSavedFilters() {
      this.loading = true
      this.error = null
      try {
        const response = await userService.getSavedFilters()
        this.savedFilters = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async saveFilter(data) {
      this.loading = true
      this.error = null
      try {
        const response = await userService.saveFilter(data)
        this.savedFilters.unshift(response.data)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateFilter(id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await userService.updateFilter(id, data)
        const index = this.savedFilters.findIndex(f => f.id === id)
        if (index !== -1) this.savedFilters[index] = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteFilter(id) {
      this.loading = true
      this.error = null
      try {
        await userService.deleteFilter(id)
        this.savedFilters = this.savedFilters.filter(f => f.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== BOOKMARKS ====================
    
    async fetchBookmarks() {
      this.loading = true
      this.error = null
      try {
        const response = await userService.getBookmarks()
        this.bookmarks = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addBookmark(data) {
      this.loading = true
      this.error = null
      try {
        const response = await userService.addBookmark(data)
        this.bookmarks.unshift(response.data)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeBookmark(id) {
      this.loading = true
      this.error = null
      try {
        await userService.removeBookmark(id)
        this.bookmarks = this.bookmarks.filter(b => b.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    toggleBookmark(type, id, data = {}) {
      const existing = this.bookmarks.find(b => b.type === type && b.item_id === id)
      if (existing) {
        this.removeBookmark(existing.id)
      } else {
        this.addBookmark({ type, item_id: id, ...data })
      }
    },

    // ==================== RECENT ITEMS ====================
    
    async fetchRecentItems(type) {
      this.loading = true
      this.error = null
      try {
        const response = await userService.getRecentItems(type)
        this.recentItems[type] = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    addRecentItem(type, item) {
      if (!this.recentItems[type]) this.recentItems[type] = []
      
      // Remove if already exists
      this.recentItems[type] = this.recentItems[type].filter(i => i.id !== item.id)
      
      // Add to beginning
      this.recentItems[type].unshift(item)
      
      // Keep only last 10
      if (this.recentItems[type].length > 10) {
        this.recentItems[type] = this.recentItems[type].slice(0, 10)
      }
    },

    // ==================== QUICK ACCESS ====================
    
    async fetchQuickAccess() {
      this.loading = true
      this.error = null
      try {
        const response = await userService.getQuickAccess()
        this.quickAccess = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateQuickAccess(items) {
      this.loading = true
      this.error = null
      try {
        const response = await userService.updateQuickAccess({ items })
        this.quickAccess = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== NOTIFICATION PREFERENCES ====================
    
    async fetchNotificationPreferences() {
      this.loading = true
      this.error = null
      try {
        const response = await userService.getNotificationPreferences()
        this.notificationPreferences = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateNotificationPreferences(data) {
      this.loading = true
      this.error = null
      try {
        const response = await userService.updateNotificationPreferences(data)
        this.notificationPreferences = { ...this.notificationPreferences, ...response.data }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== PASSWORD & SECURITY ====================
    
    async changePassword(data) {
      this.loading = true
      this.error = null
      try {
        const response = await userService.changePassword(data)
        this.security.lastPasswordChange = new Date().toISOString()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async enableTwoFactor() {
      this.loading = true
      this.error = null
      try {
        const response = await userService.enableTwoFactor()
        this.security.twoFactorEnabled = true
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async disableTwoFactor() {
      this.loading = true
      this.error = null
      try {
        const response = await userService.disableTwoFactor()
        this.security.twoFactorEnabled = false
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchActiveSessions() {
      this.loading = true
      this.error = null
      try {
        const response = await userService.getActiveSessions()
        this.security.activeSessions = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async revokeSession(sessionId) {
      this.loading = true
      this.error = null
      try {
        await userService.revokeSession(sessionId)
        this.security.activeSessions = this.security.activeSessions.filter(s => s.id !== sessionId)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async revokeAllSessions() {
      this.loading = true
      this.error = null
      try {
        await userService.revokeAllSessions()
        this.security.activeSessions = []
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== EXPORT ====================
    
    async exportUserData() {
      this.loading = true
      this.error = null
      try {
        const response = await userService.exportUserData()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Reset
    reset() {
      this.profile = null
      this.recentActivity = []
      this.loginHistory = []
      this.savedFilters = []
      this.bookmarks = []
      this.recentItems = {
        products: [],
        customers: [],
        orders: [],
        documents: []
      }
      this.quickAccess = []
      this.error = null
    }
  }
})