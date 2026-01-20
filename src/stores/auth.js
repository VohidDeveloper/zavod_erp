import { defineStore } from 'pinia'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    isAuthenticated: false,
  }),

  getters: {
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.role?.name,
    userPermissions: (state) => state.user?.role?.permissions || [],

    hasPermission: (state) => (permission) => {
      if (!state.user?.role?.permissions) return false
      return state.user.role.permissions.includes(permission)
    },

    hasAnyPermission: (state) => (permissions) => {
      if (!state.user?.role?.permissions) return false
      return permissions.some(permission =>
        state.user.role.permissions.includes(permission)
      )
    },

    hasRole: (state) => (role) => {
      return state.user?.role?.name === role
    },

    isRole: (state) => (roles) => {
      if (!Array.isArray(roles)) {
        return state.user?.role?.name === roles
      }
      return roles.includes(state.user?.role?.name)
    },
  },

  actions: {
    async login(credentials) {
      try {
        const response = await authService.login(credentials)

        this.token = response.access_token
        this.refreshToken = response.refresh_token
        this.user = response.user
        this.isAuthenticated = true

        localStorage.setItem('access_token', this.token)
        localStorage.setItem('refresh_token', this.refreshToken)

        return response
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    async logout() {
      try {
        await authService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
      }
    },

    async fetchCurrentUser() {
      try {
        const user = await authService.getCurrentUser()
        this.user = user
        this.isAuthenticated = true
        return user
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    async refreshAccessToken() {
      try {
        const response = await authService.refreshToken(this.refreshToken)
        this.token = response.access_token
        localStorage.setItem('access_token', this.token)
        return response
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    async changePassword(data) {
      return await authService.changePassword(data)
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.refreshToken = null
      this.isAuthenticated = false

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },
  },
})