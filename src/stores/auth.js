import { defineStore } from 'pinia'
import { api } from '@/plugins/axios'
import { STORAGE_KEYS } from '@/utils/constants'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
    refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || null,
    isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
    loading: false,
    error: null,
  }),

  getters: {
    /**
     * Get current user
     */
    currentUser: (state) => state.user,

    /**
     * Check if user is authenticated
     */
    isLoggedIn: (state) => state.isAuthenticated && !!state.user,

    /**
     * Get user role
     */
    userRole: (state) => state.user?.role?.name || null,

    /**
     * Get user permissions
     */
    userPermissions: (state) => state.user?.role?.permissions || [],

    /**
     * Check if user has specific permission
     */
    hasPermission: (state) => (permission) => {
      if (!state.user?.role?.permissions) return false
      return state.user.role.permissions.includes(permission)
    },

    /**
     * Check if user has any of the permissions
     */
    hasAnyPermission: (state) => (permissions) => {
      if (!state.user?.role?.permissions) return false
      return permissions.some(p => state.user.role.permissions.includes(p))
    },

    /**
     * Check if user has all permissions
     */
    hasAllPermissions: (state) => (permissions) => {
      if (!state.user?.role?.permissions) return false
      return permissions.every(p => state.user.role.permissions.includes(p))
    },

    /**
     * Check if user has specific role
     */
    hasRole: (state) => (roleName) => {
      return state.user?.role?.name === roleName
    },

    /**
     * Get user full name
     */
    userFullName: (state) => {
      if (!state.user) return ''
      const { first_name, last_name, middle_name } = state.user
      return [last_name, first_name, middle_name].filter(Boolean).join(' ')
    },

    /**
     * Get user initials
     */
    userInitials: (state) => {
      if (!state.user) return ''
      const { first_name, last_name } = state.user
      return `${first_name?.charAt(0) || ''}${last_name?.charAt(0) || ''}`
    },
  },

  actions: {
    /**
     * Login user
     */
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/login', credentials)
        const { access_token, refresh_token, user } = response

        this.token = access_token
        this.refreshToken = refresh_token
        this.user = user
        this.isAuthenticated = true

        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.TOKEN, access_token)
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))

        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Logout user
     */
    async logout() {
      try {
        await api.post('/auth/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
      }
    },

    /**
     * Clear authentication data
     */
    clearAuth() {
      this.user = null
      this.token = null
      this.refreshToken = null
      this.isAuthenticated = false
      this.error = null

      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    },

    /**
     * Fetch current user
     */
    async fetchCurrentUser() {
      if (!this.token) return

      this.loading = true
      try {
        const user = await api.get('/auth/me')
        this.user = user
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
      } catch (error) {
        console.error('Fetch user error:', error)
        this.clearAuth()
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Refresh access token
     */
    async refreshAccessToken() {
      if (!this.refreshToken) {
        throw new Error('No refresh token available')
      }

      try {
        const response = await api.post('/auth/refresh', {
          refresh_token: this.refreshToken,
        })

        const { access_token } = response
        this.token = access_token
        localStorage.setItem(STORAGE_KEYS.TOKEN, access_token)

        return access_token
      } catch (error) {
        console.error('Token refresh error:', error)
        this.clearAuth()
        throw error
      }
    },

    /**
     * Update user profile
     */
    async updateProfile(data) {
      this.loading = true
      this.error = null

      try {
        const updated = await api.put('/auth/profile', data)
        this.user = { ...this.user, ...updated }
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user))
        return updated
      } catch (error) {
        this.error = error.response?.data?.detail || 'Update failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Change password
     */
    async changePassword(data) {
      this.loading = true
      this.error = null

      try {
        await api.post('/auth/change-password', data)
      } catch (error) {
        this.error = error.response?.data?.detail || 'Password change failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Register new user
     */
    async register(userData) {
      this.loading = true
      this.error = null

      try {
        const response = await api.post('/auth/register', userData)
        return response
      } catch (error) {
        this.error = error.response?.data?.detail || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Request password reset
     */
    async requestPasswordReset(email) {
      this.loading = true
      this.error = null

      try {
        await api.post('/auth/forgot-password', { email })
      } catch (error) {
        this.error = error.response?.data?.detail || 'Request failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Reset password with token
     */
    async resetPassword(token, password) {
      this.loading = true
      this.error = null

      try {
        await api.post('/auth/reset-password', { token, password })
      } catch (error) {
        this.error = error.response?.data?.detail || 'Reset failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Initialize auth from localStorage
     */
    initAuth() {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
      const userStr = localStorage.getItem(STORAGE_KEYS.USER)

      if (token && userStr) {
        try {
          this.token = token
          this.refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true
        } catch (error) {
          console.error('Auth init error:', error)
          this.clearAuth()
        }
      }
    },
  },
})