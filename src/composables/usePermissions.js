import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePermissions() {
  const authStore = useAuthStore()

  const user = computed(() => authStore.user)
  const permissions = computed(() => user.value?.permissions || [])

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user.value) return false
    
    // Super admin has all permissions
    if (user.value.role === 'super_admin') return true
    
    return permissions.value.includes(permission)
  }

  // Check if user has all specified permissions
  const hasAllPermissions = (requiredPermissions) => {
    if (!user.value) return false
    if (user.value.role === 'super_admin') return true
    
    return requiredPermissions.every(permission => hasPermission(permission))
  }

  // Check if user has any of the specified permissions
  const hasAnyPermission = (requiredPermissions) => {
    if (!user.value) return false
    if (user.value.role === 'super_admin') return true
    
    return requiredPermissions.some(permission => hasPermission(permission))
  }

  // Module-specific permissions
  const canViewWarehouse = computed(() => hasPermission('warehouse.view'))
  const canEditWarehouse = computed(() => hasPermission('warehouse.edit'))
  const canDeleteWarehouse = computed(() => hasPermission('warehouse.delete'))

  const canViewProduction = computed(() => hasPermission('production.view'))
  const canEditProduction = computed(() => hasPermission('production.edit'))
  const canDeleteProduction = computed(() => hasPermission('production.delete'))

  const canViewSales = computed(() => hasPermission('sales.view'))
  const canEditSales = computed(() => hasPermission('sales.edit'))
  const canDeleteSales = computed(() => hasPermission('sales.delete'))

  const canViewFinance = computed(() => hasPermission('finance.view'))
  const canEditFinance = computed(() => hasPermission('finance.edit'))
  const canDeleteFinance = computed(() => hasPermission('finance.delete'))

  const canViewHR = computed(() => hasPermission('hr.view'))
  const canEditHR = computed(() => hasPermission('hr.edit'))
  const canDeleteHR = computed(() => hasPermission('hr.delete'))

  const canViewAnalytics = computed(() => hasPermission('analytics.view'))
  const canViewSettings = computed(() => hasPermission('settings.view'))
  const canEditSettings = computed(() => hasPermission('settings.edit'))

  return {
    // General methods
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    
    // Module permissions
    canViewWarehouse,
    canEditWarehouse,
    canDeleteWarehouse,
    canViewProduction,
    canEditProduction,
    canDeleteProduction,
    canViewSales,
    canEditSales,
    canDeleteSales,
    canViewFinance,
    canEditFinance,
    canDeleteFinance,
    canViewHR,
    canEditHR,
    canDeleteHR,
    canViewAnalytics,
    canViewSettings,
    canEditSettings
  }
}