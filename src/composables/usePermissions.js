import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

/**
 * Permissions composable
 * Handles user authorization and permissions
 */
export function usePermissions() {
  const authStore = useAuthStore()

  const user = computed(() => authStore.user)
  const permissions = computed(() => user.value?.permissions || [])

  /**
   * Check if user has specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    if (!user.value) return false
    
    // Super admin has all permissions
    if (user.value.role === 'super_admin' || user.value.role === 'admin') return true
    
    return permissions.value.includes(permission)
  }

  /**
   * Alias for hasPermission (shorter name)
   * @param {string} permission - Permission to check
   * @returns {boolean}
   */
  const can = (permission) => {
    return hasPermission(permission)
  }

  /**
   * Check if user has all specified permissions
   * @param {Array<string>} requiredPermissions - Array of permissions
   * @returns {boolean}
   */
  const hasAllPermissions = (requiredPermissions) => {
    if (!user.value) return false
    if (user.value.role === 'super_admin' || user.value.role === 'admin') return true
    
    return requiredPermissions.every(permission => hasPermission(permission))
  }

  /**
   * Alias for hasAllPermissions
   * @param {Array<string>} requiredPermissions - Array of permissions
   * @returns {boolean}
   */
  const canAll = (requiredPermissions) => {
    return hasAllPermissions(requiredPermissions)
  }

  /**
   * Check if user has any of the specified permissions
   * @param {Array<string>} requiredPermissions - Array of permissions
   * @returns {boolean}
   */
  const hasAnyPermission = (requiredPermissions) => {
    if (!user.value) return false
    if (user.value.role === 'super_admin' || user.value.role === 'admin') return true
    
    return requiredPermissions.some(permission => hasPermission(permission))
  }

  /**
   * Alias for hasAnyPermission
   * @param {Array<string>} requiredPermissions - Array of permissions
   * @returns {boolean}
   */
  const canAny = (requiredPermissions) => {
    return hasAnyPermission(requiredPermissions)
  }

  /**
   * Check if user has specific role
   * @param {string|Array<string>} role - Role or array of roles
   * @returns {boolean}
   */
  const hasRole = (role) => {
    if (!user.value) return false
    
    if (typeof role === 'string') {
      return user.value.role === role
    }
    
    if (Array.isArray(role)) {
      return role.includes(user.value.role)
    }
    
    return false
  }

  // Role checks
  const isAdmin = computed(() => {
    return user.value?.role === 'admin' || user.value?.role === 'super_admin' || false
  })

  const isSuperAdmin = computed(() => {
    return user.value?.role === 'super_admin' || false
  })

  const isManager = computed(() => {
    return user.value?.role === 'manager' || isAdmin.value
  })

  // Module-specific permissions - Warehouse
  const canViewWarehouse = computed(() => hasPermission('warehouse.view'))
  const canCreateWarehouse = computed(() => hasPermission('warehouse.create'))
  const canEditWarehouse = computed(() => hasPermission('warehouse.edit'))
  const canDeleteWarehouse = computed(() => hasPermission('warehouse.delete'))

  // Module-specific permissions - Production
  const canViewProduction = computed(() => hasPermission('production.view'))
  const canCreateProduction = computed(() => hasPermission('production.create'))
  const canEditProduction = computed(() => hasPermission('production.edit'))
  const canDeleteProduction = computed(() => hasPermission('production.delete'))

  // Module-specific permissions - Sales
  const canViewSales = computed(() => hasPermission('sales.view'))
  const canCreateSales = computed(() => hasPermission('sales.create'))
  const canEditSales = computed(() => hasPermission('sales.edit'))
  const canDeleteSales = computed(() => hasPermission('sales.delete'))

  // Module-specific permissions - Finance
  const canViewFinance = computed(() => hasPermission('finance.view'))
  const canCreateFinance = computed(() => hasPermission('finance.create'))
  const canEditFinance = computed(() => hasPermission('finance.edit'))
  const canDeleteFinance = computed(() => hasPermission('finance.delete'))

  // Module-specific permissions - HR
  const canViewHR = computed(() => hasPermission('hr.view'))
  const canCreateHR = computed(() => hasPermission('hr.create'))
  const canEditHR = computed(() => hasPermission('hr.edit'))
  const canDeleteHR = computed(() => hasPermission('hr.delete'))

  // Module-specific permissions - Analytics & Settings
  const canViewAnalytics = computed(() => hasPermission('analytics.view'))
  const canViewSettings = computed(() => hasPermission('settings.view'))
  const canEditSettings = computed(() => hasPermission('settings.edit'))

  return {
    // General methods
    hasPermission,
    can, // Alias
    hasAllPermissions,
    canAll, // Alias
    hasAnyPermission,
    canAny, // Alias
    hasRole,
    
    // Role checks
    isAdmin,
    isSuperAdmin,
    isManager,
    
    // Warehouse permissions
    canViewWarehouse,
    canCreateWarehouse,
    canEditWarehouse,
    canDeleteWarehouse,
    
    // Production permissions
    canViewProduction,
    canCreateProduction,
    canEditProduction,
    canDeleteProduction,
    
    // Sales permissions
    canViewSales,
    canCreateSales,
    canEditSales,
    canDeleteSales,
    
    // Finance permissions
    canViewFinance,
    canCreateFinance,
    canEditFinance,
    canDeleteFinance,
    
    // HR permissions
    canViewHR,
    canCreateHR,
    canEditHR,
    canDeleteHR,
    
    // Analytics & Settings
    canViewAnalytics,
    canViewSettings,
    canEditSettings,
    
    // User & permissions
    user,
    permissions
  }
}