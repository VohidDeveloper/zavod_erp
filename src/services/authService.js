import api from './api'

export const authService = {
  /**
   * Login
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response
  },

  /**
   * Logout
   */
  async logout() {
    const response = await api.post('/auth/logout')
    return response
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response
  },

  /**
   * Refresh token
   */
  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken
    })
    return response
  },

  /**
   * Change password
   */
  async changePassword(data) {
    const response = await api.put('/auth/change-password', data)
    return response
  },
}

export default authService