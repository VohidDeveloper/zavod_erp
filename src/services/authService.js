import api from '@/utils/api'

export const authService = {
  /**
   * Login user
   * FastAPI expects: { username, password }
   * @param {Object} credentials - { email, password } or { username, password }
   */
  async login(credentials) {
    // Backend expects 'username', not 'email'
    const loginData = {
      username: credentials.username || credentials.email,
      password: credentials.password
    }
    
    const response = await api.post('/auth/login', loginData)
    return response.data
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
      // Clear local storage
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  },

  /**
   * Refresh access token
   * @param {string} refreshToken
   */
  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken
    })
    return response.data
  },

  /**
   * Register new user
   * @param {Object} userData
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  /**
   * Change password
   * @param {Object} data - { old_password, new_password }
   */
  async changePassword(data) {
    const response = await api.post('/auth/change-password', data)
    return response.data
  },

  /**
   * Request password reset
   * @param {string} email
   */
  async requestPasswordReset(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  /**
   * Reset password with token
   * @param {Object} data - { token, new_password }
   */
  async resetPassword(data) {
    const response = await api.post('/auth/reset-password', data)
    return response.data
  }
}