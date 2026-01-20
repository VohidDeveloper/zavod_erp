import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useNotifications } from './useNotifications'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const notifications = useNotifications()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const userRole = computed(() => authStore.userRole)

  async function login(credentials) {
    try {
      await authStore.login(credentials)
      notifications.success('Xush kelibsiz!')
      router.push('/dashboard')
    } catch (error) {
      const message = error.response?.data?.detail || 'Login xatosi'
      notifications.error(message)
      throw error
    }
  }

  async function logout() {
    try {
      await authStore.logout()
      notifications.info('Tizimdan chiqdingiz')
      router.push('/login')
    } catch (error) {
      notifications.error('Logout xatosi')
    }
  }

  function hasPermission(permission) {
    return authStore.hasPermission(permission)
  }

  function hasAnyPermission(permissions) {
    return authStore.hasAnyPermission(permissions)
  }

  function hasRole(role) {
    return authStore.hasRole(role)
  }

  return {
    isAuthenticated,
    user,
    userRole,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasRole,
  }
}