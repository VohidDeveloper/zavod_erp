import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  // Computed properties
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const token = computed(() => authStore.token)
  const isLoading = computed(() => authStore.loading)

  // Login
  const login = async (credentials) => {
    try {
      await authStore.login(credentials)
      router.push('/dashboard')
    } catch (error) {
      throw error
    }
  }

  // Logout
  const logout = async () => {
    try {
      await authStore.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Change password
  const changePassword = async (data) => {
    try {
      await authStore.changePassword(data)
    } catch (error) {
      throw error
    }
  }

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user.value) return false
    return user.value.role === role || user.value.roles?.includes(role)
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!user.value) return false
    return roles.some(role => hasRole(role))
  }

  return {
    // State
    user,
    isAuthenticated,
    token,
    isLoading,
    
    // Methods
    login,
    logout,
    changePassword,
    hasRole,
    hasAnyRole
  }
}