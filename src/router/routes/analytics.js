export default [
    {
      path: 'analytics',
      name: 'analytics',
      redirect: { name: 'analytics-production' },
      meta: {
        title: 'Analitika',
        requiresAuth: true,
        permission: 'read:analytics'
      },
      children: [
        {
          path: 'production',
          name: 'analytics-production',
          component: () => import('@/views/analytics/ProductionAnalyticsView.vue'),
          meta: {
            title: 'Ishlab chiqarish analitikasi',
            requiresAuth: true,
            permission: 'read:analytics'
          }
        },
        {
          path: 'sales',
          name: 'analytics-sales',
          component: () => import('@/views/analytics/SalesAnalyticsView.vue'),
          meta: {
            title: 'Savdo analitikasi',
            requiresAuth: true,
            permission: 'read:analytics'
          }
        },
        {
          path: 'finance',
          name: 'analytics-finance',
          component: () => import('@/views/analytics/FinanceAnalyticsView.vue'),
          meta: {
            title: 'Moliya analitikasi',
            requiresAuth: true,
            permission: 'read:analytics'
          }
        },
        {
          path: 'warehouse',
          name: 'analytics-warehouse',
          component: () => import('@/views/analytics/WarehouseAnalyticsView.vue'),
          meta: {
            title: 'Ombor analitikasi',
            requiresAuth: true,
            permission: 'read:analytics'
          }
        },
        {
          path: 'hr',
          name: 'analytics-hr',
          component: () => import('@/views/analytics/HRAnalyticsView.vue'),
          meta: {
            title: 'Kadrlar analitikasi',
            requiresAuth: true,
            permission: 'read:analytics'
          }
        },
        {
          path: 'quality',
          name: 'analytics-quality',
          component: () => import('@/views/analytics/QualityAnalyticsView.vue'),
          meta: {
            title: 'Sifat analitikasi',
            requiresAuth: true,
            permission: 'read:analytics'
          }
        },
        {
          path: 'efficiency',
          name: 'analytics-efficiency',
          component: () => import('@/views/analytics/EfficiencyAnalyticsView.vue'),
          meta: {
            title: 'Samaradorlik analitikasi',
            requiresAuth: true,
            permission: 'read:analytics'
          }
        },
        {
          path: 'custom',
          name: 'analytics-custom',
          component: () => import('@/views/analytics/CustomReportView.vue'),
          meta: {
            title: 'Maxsus hisobot',
            requiresAuth: true,
            permission: 'create:custom-report'
          }
        }
      ]
    }
  ]