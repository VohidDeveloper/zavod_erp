import { apiClient } from './api'

const authService = {
  // Login
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },

  // Logout
  logout() {
    return apiClient.post('/auth/logout')
  },

  // Register
  register(data) {
    return apiClient.post('/auth/register', data)
  },

  // Get current user
  me() {
    return apiClient.get('/auth/me')
  },

  // Refresh token
  refresh() {
    return apiClient.post('/auth/refresh')
  },

  // Change password
  changePassword(data) {
    return apiClient.post('/auth/change-password', data)
  },

  // Forgot password
  forgotPassword(email) {
    return apiClient.post('/auth/forgot-password', { email })
  },

  // Reset password
  resetPassword(data) {
    return apiClient.post('/auth/reset-password', data)
  },

  // Verify email
  verifyEmail(token) {
    return apiClient.post('/auth/verify-email', { token })
  },

  // Resend verification email
  resendVerification(email) {
    return apiClient.post('/auth/resend-verification', { email })
  }
}

export default authService