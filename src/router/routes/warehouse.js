export default [
    {
      path: 'warehouse',
      name: 'warehouse',
      redirect: { name: 'warehouse-receipts' },
      meta: {
        title: 'Ombor',
        requiresAuth: true,
        permission: 'read:warehouse'
      },
      children: [
        {
          path: 'receipts',
          name: 'warehouse-receipts',
          component: () => import('@/views/warehouse/ReceiptsView.vue'),
          meta: {
            title: 'Qabul qilish',
            requiresAuth: true,
            permission: 'read:warehouse'
          }
        },
        {
          path: 'receipts/create',
          name: 'warehouse-receipts-create',
          component: () => import('@/views/warehouse/ReceiptCreateView.vue'),
          meta: {
            title: 'Yangi qabul',
            requiresAuth: true,
            permission: 'create:warehouse-receipt'
          }
        },
        {
          path: 'receipts/:id',
          name: 'warehouse-receipts-details',
          component: () => import('@/views/warehouse/ReceiptDetailsView.vue'),
          meta: {
            title: 'Qabul tafsilotlari',
            requiresAuth: true,
            permission: 'read:warehouse'
          }
        },
        {
          path: 'stock',
          name: 'warehouse-stock',
          component: () => import('@/views/warehouse/StockView.vue'),
          meta: {
            title: 'Qoldiq',
            requiresAuth: true,
            permission: 'read:warehouse'
          }
        },
        {
          path: 'requests',
          name: 'warehouse-requests',
          component: () => import('@/views/warehouse/RequestsView.vue'),
          meta: {
            title: 'So\'rovlar',
            requiresAuth: true,
            permission: 'read:warehouse'
          }
        },
        {
          path: 'requests/create',
          name: 'warehouse-requests-create',
          component: () => import('@/views/warehouse/RequestCreateView.vue'),
          meta: {
            title: 'Yangi so\'rov',
            requiresAuth: true,
            permission: 'create:warehouse-request'
          }
        },
        {
          path: 'suppliers',
          name: 'warehouse-suppliers',
          component: () => import('@/views/warehouse/SuppliersView.vue'),
          meta: {
            title: 'Yetkazib beruvchilar',
            requiresAuth: true,
            permission: 'read:warehouse'
          }
        }
      ]
    }
  ]