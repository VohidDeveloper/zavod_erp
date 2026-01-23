export default [
    {
      path: 'sales',
      name: 'sales',
      redirect: { name: 'sales-customers' },
      meta: {
        title: 'Savdo',
        requiresAuth: true,
        permission: 'read:sales'
      },
      children: [
        {
          path: 'customers',
          name: 'sales-customers',
          component: () => import('@/views/sales/CustomersView.vue'),
          meta: {
            title: 'Mijozlar',
            requiresAuth: true,
            permission: 'read:sales'
          }
        },
        {
          path: 'customers/create',
          name: 'sales-customers-create',
          component: () => import('@/views/sales/CustomerCreateView.vue'),
          meta: {
            title: 'Yangi mijoz',
            requiresAuth: true,
            permission: 'create:customer'
          }
        },
        {
          path: 'customers/:id',
          name: 'sales-customers-details',
          component: () => import('@/views/sales/CustomerDetailsView.vue'),
          meta: {
            title: 'Mijoz tafsilotlari',
            requiresAuth: true,
            permission: 'read:sales'
          }
        },
        {
          path: 'orders',
          name: 'sales-orders',
          component: () => import('@/views/sales/OrdersView.vue'),
          meta: {
            title: 'Buyurtmalar',
            requiresAuth: true,
            permission: 'read:sales'
          }
        },
        {
          path: 'orders/create',
          name: 'sales-orders-create',
          component: () => import('@/views/sales/OrderCreateView.vue'),
          meta: {
            title: 'Yangi buyurtma',
            requiresAuth: true,
            permission: 'create:order'
          }
        },
        {
          path: 'orders/:id',
          name: 'sales-orders-details',
          component: () => import('@/views/sales/OrderDetailsView.vue'),
          meta: {
            title: 'Buyurtma tafsilotlari',
            requiresAuth: true,
            permission: 'read:sales'
          }
        },
        {
          path: 'products',
          name: 'sales-products',
          component: () => import('@/views/sales/ProductsView.vue'),
          meta: {
            title: 'Mahsulotlar',
            requiresAuth: true,
            permission: 'read:sales'
          }
        },
        {
          path: 'payments',
          name: 'sales-payments',
          component: () => import('@/views/sales/PaymentsView.vue'),
          meta: {
            title: 'To\'lovlar',
            requiresAuth: true,
            permission: 'read:sales'
          }
        },
        {
          path: 'shipments',
          name: 'sales-shipments',
          component: () => import('@/views/sales/ShipmentsView.vue'),
          meta: {
            title: 'Yetkazib berish',
            requiresAuth: true,
            permission: 'read:sales'
          }
        }
      ]
    }
  ]