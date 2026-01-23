import { useAuthStore } from '@/stores/auth'

/**
 * Authentication guard
 */
export function authGuard(to, from, next) {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

/**
 * Guest guard (for login page)
 */
export function guestGuard(to, from, next) {
  const authStore = useAuthStore()
  
  if (to.meta.guest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
}

/**
 * Permission guard
 */
export function permissionGuard(to, from, next) {
  const authStore = useAuthStore()
  
  if (to.meta.permission) {
    if (!authStore.hasPermission(to.meta.permission)) {
      next({ name: 'forbidden' })
    } else {
      next()
    }
  } else {
    next()
  }
}

/**
 * Title guard
 */
export function titleGuard(to, from, next) {
  const title = to.meta.title || 'S PROMAX PLAST'
  document.title = `${title} - S PROMAX PLAST`
  next()
}

/**
 * Role guard
 */
export function roleGuard(to, from, next) {
  const authStore = useAuthStore()
  
  if (to.meta.roles) {
    if (!authStore.hasAnyRole(to.meta.roles)) {
      next({ name: 'forbidden' })
    } else {
      next()
    }
  } else {
    next()
  }
}

/**
 * Setup all guards
 */
export function setupGuards(router) {
  router.beforeEach((to, from, next) => {
    // Title guard
    titleGuard(to, from, () => {
      // Guest guard
      guestGuard(to, from, () => {
        // Auth guard
        authGuard(to, from, () => {
          // Permission guard
          permissionGuard(to, from, () => {
            // Role guard
            roleGuard(to, from, next)
          })
        })
      })
    })
  })
}