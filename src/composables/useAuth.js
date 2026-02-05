import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { useRouter } from 'vue-router'

const user = ref(null)
const token = ref(null)
const loading = ref(false)
const error = ref(null)

export function useAuth() {
  const router = useRouter()

  // Check if user is authenticated
  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  // Get user role
  const userRole = computed(() => {
    return user.value?.role || null
  })

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!user.value || !user.value.permissions) return false
    return user.value.permissions.includes(permission)
  }

  // Check if user has role
  const hasRole = (role) => {
    if (!user.value) return false
    return user.value.role === role
  }

  // Check if user is admin
  const isAdmin = computed(() => {
    return hasRole('admin') || hasRole('super_admin')
  })

  /**
   * Initialize auth from localStorage
   */
  const initAuth = async () => {
    try {
      const storedToken = localStorage.getItem('access_token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)

        // Verify token by fetching current user
        try {
          const currentUser = await authService.getCurrentUser()
          user.value = currentUser
          localStorage.setItem('user', JSON.stringify(currentUser))
        } catch (err) {
          // Token invalid, clear auth
          await logout()
        }
      }
    } catch (err) {
      console.error('Init auth error:', err)
      await logout()
    }
  }

  /**
   * Login
   * @param {Object} credentials - { email, password }
   */
  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      // Convert username to email if needed (backend expects email)
      const loginData = {
        email: credentials.email || credentials.username,
        password: credentials.password
      }

      const response = await authService.login(loginData)

      // Store tokens
      token.value = response.access_token
      localStorage.setItem('access_token', response.access_token)
      
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token)
      }

      // Get user info
      const currentUser = await authService.getCurrentUser()
      user.value = currentUser
      localStorage.setItem('user', JSON.stringify(currentUser))

      return currentUser
    } catch (err) {
      error.value = err.response?.data?.detail || 'Login xatoligi'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout
   */
  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear state
      user.value = null
      token.value = null
      error.value = null

      // Clear localStorage
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')

      // Redirect to login
      router.push('/login')
    }
  }

  /**
   * Register new user
   * @param {Object} userData
   */
  const register = async (userData) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.register(userData)
      return response
    } catch (err) {
      error.value = err.response?.data?.detail || 'Ro\'yxatdan o\'tishda xatolik'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Change password
   * @param {Object} data - { old_password, new_password }
   */
  const changePassword = async (data) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.changePassword(data)
      return response
    } catch (err) {
      error.value = err.response?.data?.detail || 'Parolni o\'zgartirishda xatolik'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Request password reset
   * @param {string} email
   */
  const requestPasswordReset = async (email) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.requestPasswordReset(email)
      return response
    } catch (err) {
      error.value = err.response?.data?.detail || 'Xatolik yuz berdi'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Reset password with token
   * @param {Object} data - { token, new_password }
   */
  const resetPassword = async (data) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.resetPassword(data)
      return response
    } catch (err) {
      error.value = err.response?.data?.detail || 'Parolni tiklashda xatolik'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update user profile
   */
  const updateProfile = async (profileData) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.updateProfile(profileData)
      user.value = response
      localStorage.setItem('user', JSON.stringify(response))
      return response
    } catch (err) {
      error.value = err.response?.data?.detail || 'Profilni yangilashda xatolik'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,

    // Computed
    isAuthenticated,
    userRole,
    isAdmin,

    // Methods
    initAuth,
    login,
    logout,
    register,
    changePassword,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    hasPermission,
    hasRole
  }
}