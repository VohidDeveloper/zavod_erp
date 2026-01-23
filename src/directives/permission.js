import { useAuthStore } from '@/stores/auth'

/**
 * Permission Directive
 * Hides element if user doesn't have required permission
 * Usage: v-permission="'create:order'"
 * Usage: v-permission="['create:order', 'update:order']" (any)
 */

export default {
  mounted(el, binding) {
    const authStore = useAuthStore()
    const permission = binding.value
    
    // Check if user has permission
    let hasPermission = false
    
    if (Array.isArray(permission)) {
      // Check if user has ANY of the permissions
      hasPermission = permission.some(p => authStore.hasPermission(p))
    } else if (typeof permission === 'string') {
      // Check single permission
      hasPermission = authStore.hasPermission(permission)
    }
    
    // Remove element if no permission
    if (!hasPermission) {
      // Store original display for potential restore
      el.style.display = 'none'
      
      // Or completely remove from DOM
      // el.remove()
    }
  },
  
  updated(el, binding) {
    const authStore = useAuthStore()
    const permission = binding.value
    
    let hasPermission = false
    
    if (Array.isArray(permission)) {
      hasPermission = permission.some(p => authStore.hasPermission(p))
    } else if (typeof permission === 'string') {
      hasPermission = authStore.hasPermission(permission)
    }
    
    // Show/hide based on permission
    el.style.display = hasPermission ? '' : 'none'
  }
}