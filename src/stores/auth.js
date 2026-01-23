import { defineStore } from 'pinia'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    
    userRole: (state) => state.user?.role || null,
    
    userPermissions: (state) => state.user?.permissions || [],
    
    userName: (state) => state.user?.name || '',
    
    userEmail: (state) => state.user?.email || ''
  },

  actions: {
    // Login
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await authService.login(credentials)
        
        this.token = response.token
        this.refreshToken = response.refreshToken
        this.user = response.user

        // Save to localStorage
        localStorage.setItem('token', response.token)
        localStorage.setItem('refreshToken', response.refreshToken)
        localStorage.setItem('user', JSON.stringify(response.user))

        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Login xatolik'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Logout
    async logout() {
      try {
        await authService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
      }
    },

    // Clear authentication data
    clearAuth() {
      this.user = null
      this.token = null
      this.refreshToken = null
      this.error = null

      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    },

    // Fetch current user
    async fetchUser() {
      if (!this.token) return

      this.loading = true

      try {
        const response = await authService.getUser()
        this.user = response.user
        localStorage.setItem('user', JSON.stringify(response.user))
      } catch (error) {
        console.error('Fetch user error:', error)
        if (error.response?.status === 401) {
          this.clearAuth()
        }
      } finally {
        this.loading = false
      }
    },

    // Change password
    async changePassword(data) {
      this.loading = true
      this.error = null

      try {
        await authService.changePassword(data)
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Parol o\'zgartirish xatolik'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Refresh token
    async refreshAuthToken() {
      if (!this.refreshToken) {
        this.clearAuth()
        return false
      }

      try {
        const response = await authService.refreshToken(this.refreshToken)
        
        this.token = response.token
        localStorage.setItem('token', response.token)

        if (response.refreshToken) {
          this.refreshToken = response.refreshToken
          localStorage.setItem('refreshToken', response.refreshToken)
        }

        return true
      } catch (error) {
        console.error('Token refresh error:', error)
        this.clearAuth()
        return false
      }
    },

    // Initialize auth from localStorage
    initAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        this.token = token
        try {
          this.user = JSON.parse(user)
        } catch (e) {
          console.error('Parse user error:', e)
          this.clearAuth()
        }
      }
    }
  }
})