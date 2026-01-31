import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'

// Route modules
import authRoutes from './routes/auth'
import warehouseRoutes from './routes/warehouse'
import productionRoutes from './routes/production'
import salesRoutes from './routes/sales'
import financeRoutes from './routes/finance'
import hrRoutes from './routes/hr'
import maintenanceRoutes from './routes/maintenance'
import analyticsRoutes from './routes/analytics'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    
    // Auth routes (no layout)
    ...authRoutes,
    
    // Main app routes (with layout)
    {
      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        // Dashboard
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: {
            title: 'Bosh sahifa',
            requiresAuth: true
          }
        },
        
        // Warehouse module
        ...warehouseRoutes,
        
        // Production module
        ...productionRoutes,
        
        // Sales module
        ...salesRoutes,
        
        // Finance module
        ...financeRoutes,
        
        // HR module
        ...hrRoutes,
        
        // Maintenance module
        ...maintenanceRoutes,
        
        // Analytics module
        ...analyticsRoutes,
        
        // Settings
        {
          path: 'settings',
          name: 'settings',
          redirect: { name: 'settings-users' },
          meta: {
            title: 'Sozlamalar',
            requiresAuth: true,
            permission: 'read:settings'
          },
          children: [
            {
              path: 'users',
              name: 'settings-users',
              component: () => import('@/views/settings/UsersView.vue'),
              meta: {
                title: 'Foydalanuvchilar',
                requiresAuth: true,
                permission: 'read:users'
              }
            },
            {
              path: 'roles',
              name: 'settings-roles',
              component: () => import('@/views/settings/RolesView.vue'),
              meta: {
                title: 'Rollar',
                requiresAuth: true,
                permission: 'read:roles'
              }
            },
            {
              path: 'system',
              name: 'settings-system',
              component: () => import('@/views/settings/SystemView.vue'),
              meta: {
                title: 'Tizim sozlamalari',
                requiresAuth: true,
                permission: 'read:system-settings'
              }
            }
          ]
        },
        
        // Profile
        // {
        //   path: 'profile',
        //   name: 'profile',
        //   component: () => import('@/views/ProfileView.vue'),
        //   meta: {
        //     title: 'Profil',
        //     requiresAuth: true
        //   }
        // }
      ]
    },
    
    // Error pages
    {
      path: '/403',
      name: 'forbidden',
      component: () => import('@/views/errors/ForbiddenView.vue'),
      meta: {
        title: 'Kirish taqiqlangan'
      }
    },
    {
      path: '/500',
      name: 'server-error',
      component: () => import('@/views/errors/ServerErrorView.vue'),
      meta: {
        title: 'Server xatosi'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/errors/NotFoundView.vue'),
      meta: {
        title: 'Sahifa topilmadi'
      }
    }
  ],
  
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Setup navigation guards
setupGuards(router)

export default router