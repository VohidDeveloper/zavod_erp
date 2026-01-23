import { defineStore } from 'pinia'
import settingsService from '@/services/settingsService'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // System settings
    systemSettings: {
      companyName: 'S PROMAX PLAST',
      companyLogo: '',
      companyAddress: '',
      companyPhone: '',
      companyEmail: '',
      timezone: 'Asia/Tashkent',
      currency: 'UZS',
      language: 'uz',
      dateFormat: 'DD.MM.YYYY',
      timeFormat: '24h',
      fiscalYearStart: '01-01',
      taxRate: 12,
      enableBackup: true,
      backupFrequency: 'daily'
    },
    
    // User settings
    userSettings: {
      theme: 'light',
      sidebarCollapsed: false,
      notifications: true,
      emailNotifications: true,
      smsNotifications: false,
      desktopNotifications: true,
      soundNotifications: true,
      language: 'uz',
      timezone: 'Asia/Tashkent',
      dateFormat: 'DD.MM.YYYY',
      timeFormat: '24h',
      itemsPerPage: 10
    },
    
    // Users
    users: [],
    currentUser: null,
    userStats: {
      total: 0,
      active: 0,
      inactive: 0,
      online: 0
    },
    
    // Roles & Permissions
    roles: [],
    permissions: [],
    permissionGroups: [],
    
    // Categories & Types
    categories: {
      productCategories: [],
      expenseCategories: [],
      customerTypes: [],
      supplierTypes: [],
      paymentMethods: [],
      deliveryMethods: []
    },
    
    // Configuration
    configuration: {
      warehouse: {
        enableBarcoding: true,
        enableBatches: true,
        enableExpiry: true,
        lowStockThreshold: 10,
        reorderLevel: 20,
        autoReorder: false
      },
      production: {
        enableShiftSystem: true,
        enableQualityControl: true,
        enableMaterialTracking: true,
        defaultShiftDuration: 8,
        enableDowntimeTracking: true
      },
      sales: {
        enableDiscounts: true,
        enableCredits: true,
        creditLimit: 1000000,
        creditTerms: 30,
        enableReturns: true,
        returnPeriod: 7
      },
      finance: {
        enableAccounting: true,
        enableBudgeting: true,
        enableForecasting: true,
        fiscalYearStart: '01-01'
      },
      hr: {
        enableAttendance: true,
        enablePayroll: true,
        enableLeaveManagement: true,
        workingHoursPerDay: 8,
        workingDaysPerWeek: 6,
        overtimeRate: 1.5
      }
    },
    
    // Email templates
    emailTemplates: [],
    
    // SMS templates  
    smsTemplates: [],
    
    // Tax settings
    taxSettings: {
      enableTax: true,
      taxRate: 12,
      taxNumber: '',
      enableMultipleTax: false
    },
    
    // Backup settings
    backupSettings: {
      enabled: true,
      frequency: 'daily',
      time: '02:00',
      retention: 30,
      location: 'local'
    },
    
    // Integration settings
    integrations: {
      accounting: null,
      payment: null,
      shipping: null,
      sms: null,
      email: null
    },
    
    // Loading states
    loading: false,
    usersLoading: false,
    rolesLoading: false,
    categoriesLoading: false,
    
    error: null
  }),

  getters: {
    // Users
    activeUsers: (state) => state.users.filter(u => u.status === 'active'),
    inactiveUsers: (state) => state.users.filter(u => u.status === 'inactive'),
    adminUsers: (state) => state.users.filter(u => u.role === 'admin' || u.role === 'super_admin'),
    onlineUsers: (state) => state.users.filter(u => u.online),
    
    // Roles
    roleById: (state) => (id) => state.roles.find(r => r.id === id),
    roleByName: (state) => (name) => state.roles.find(r => r.name === name),
    permissionsByRole: (state) => (roleId) => {
      const role = state.roles.find(r => r.id === roleId)
      return role?.permissions || []
    },
    
    // Settings
    isDarkMode: (state) => state.userSettings.theme === 'dark',
    isSidebarCollapsed: (state) => state.userSettings.sidebarCollapsed,
    currentLanguage: (state) => state.userSettings.language,
    currentCurrency: (state) => state.systemSettings.currency,
    
    // Configuration
    isFeatureEnabled: (state) => (module, feature) => {
      return state.configuration[module]?.[feature] || false
    }
  },

  actions: {
    // ==================== SYSTEM SETTINGS ====================
    
    async fetchSystemSettings() {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.getSystemSettings()
        this.systemSettings = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSystemSettings(data) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.updateSystemSettings(data)
        this.systemSettings = { ...this.systemSettings, ...response.data }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async uploadCompanyLogo(file) {
      this.loading = true
      this.error = null
      try {
        const formData = new FormData()
        formData.append('logo', file)
        const response = await settingsService.uploadCompanyLogo(formData)
        this.systemSettings.companyLogo = response.data.logo
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== USER SETTINGS ====================
    
    async fetchUserSettings() {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.getUserSettings()
        this.userSettings = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUserSettings(data) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.updateUserSettings(data)
        this.userSettings = { ...this.userSettings, ...response.data }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    toggleTheme() {
      this.userSettings.theme = this.userSettings.theme === 'light' ? 'dark' : 'light'
      this.updateUserSettings({ theme: this.userSettings.theme })
    },

    toggleSidebar() {
      this.userSettings.sidebarCollapsed = !this.userSettings.sidebarCollapsed
      localStorage.setItem('sidebarCollapsed', this.userSettings.sidebarCollapsed)
    },

    setLanguage(language) {
      this.userSettings.language = language
      this.updateUserSettings({ language })
    },

    // ==================== USERS ====================
    
    async fetchUsers(params = {}) {
      this.usersLoading = true
      this.error = null
      try {
        const response = await settingsService.getUsers(params)
        this.users = response.data
        this.updateUserStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.usersLoading = false
      }
    },

    async fetchUser(id) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.getUser(id)
        this.currentUser = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createUser(data) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.createUser(data)
        this.users.unshift(response.data)
        this.updateUserStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUser(id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.updateUser(id, data)
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) this.users[index] = response.data
        this.updateUserStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id) {
      this.loading = true
      this.error = null
      try {
        await settingsService.deleteUser(id)
        this.users = this.users.filter(u => u.id !== id)
        this.updateUserStats()
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async activateUser(id) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.activateUser(id)
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) this.users[index] = response.data
        this.updateUserStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deactivateUser(id) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.deactivateUser(id)
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) this.users[index] = response.data
        this.updateUserStats()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== ROLES & PERMISSIONS ====================
    
    async fetchRoles() {
      this.rolesLoading = true
      this.error = null
      try {
        const response = await settingsService.getRoles()
        this.roles = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.rolesLoading = false
      }
    },

    async createRole(data) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.createRole(data)
        this.roles.unshift(response.data)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateRole(id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.updateRole(id, data)
        const index = this.roles.findIndex(r => r.id === id)
        if (index !== -1) this.roles[index] = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteRole(id) {
      this.loading = true
      this.error = null
      try {
        await settingsService.deleteRole(id)
        this.roles = this.roles.filter(r => r.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPermissions() {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.getPermissions()
        this.permissions = response.data.permissions || response.data
        this.permissionGroups = response.data.groups || []
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateRolePermissions(roleId, permissions) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.updateRolePermissions(roleId, { permissions })
        const index = this.roles.findIndex(r => r.id === roleId)
        if (index !== -1) this.roles[index].permissions = permissions
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== CATEGORIES ====================
    
    async fetchCategories(type) {
      this.categoriesLoading = true
      this.error = null
      try {
        const response = await settingsService.getCategories(type)
        this.categories[type] = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.categoriesLoading = false
      }
    },

    async createCategory(type, data) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.createCategory(type, data)
        if (!this.categories[type]) this.categories[type] = []
        this.categories[type].unshift(response.data)
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCategory(type, id, data) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.updateCategory(type, id, data)
        const index = this.categories[type]?.findIndex(c => c.id === id)
        if (index !== -1) this.categories[type][index] = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCategory(type, id) {
      this.loading = true
      this.error = null
      try {
        await settingsService.deleteCategory(type, id)
        if (this.categories[type]) {
          this.categories[type] = this.categories[type].filter(c => c.id !== id)
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== CONFIGURATION ====================
    
    async fetchConfiguration(module) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.getConfiguration(module)
        this.configuration[module] = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateConfiguration(module, data) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.updateConfiguration(module, data)
        this.configuration[module] = { ...this.configuration[module], ...response.data }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== EMAIL TEMPLATES ====================
    
    async fetchEmailTemplates() {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.getEmailTemplates()
        this.emailTemplates = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== TAX SETTINGS ====================
    
    async fetchTaxSettings() {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.getTaxSettings()
        this.taxSettings = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTaxSettings(data) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.updateTaxSettings(data)
        this.taxSettings = { ...this.taxSettings, ...response.data }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== BACKUP SETTINGS ====================
    
    async fetchBackupSettings() {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.getBackupSettings()
        this.backupSettings = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateBackupSettings(data) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.updateBackupSettings(data)
        this.backupSettings = { ...this.backupSettings, ...response.data }
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createBackup() {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.createBackup()
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== INTEGRATIONS ====================
    
    async fetchIntegrations() {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.getIntegrations()
        this.integrations = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateIntegration(type, data) {
      this.loading = true
      this.error = null
      try {
        const response = await settingsService.updateIntegration(type, data)
        this.integrations[type] = response.data
        return response
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== STATS ====================
    
    updateUserStats() {
      this.userStats = {
        total: this.users.length,
        active: this.users.filter(u => u.status === 'active').length,
        inactive: this.users.filter(u => u.status === 'inactive').length,
        online: this.users.filter(u => u.online).length
      }
    },

    // Reset
    reset() {
      this.users = []
      this.roles = []
      this.permissions = []
      this.currentUser = null
      this.error = null
    }
  }
})