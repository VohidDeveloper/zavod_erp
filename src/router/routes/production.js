export default [
    {
      path: 'production',
      name: 'production',
      redirect: { name: 'production-shifts' },
      meta: {
        title: 'Ishlab chiqarish',
        requiresAuth: true,
        permission: 'read:production'
      },
      children: [
        {
          path: 'shifts',
          name: 'production-shifts',
          component: () => import('@/views/production/ShiftsView.vue'),
          meta: {
            title: 'Smenalar',
            requiresAuth: true,
            permission: 'read:production'
          }
        },
        {
          path: 'shifts/create',
          name: 'production-shifts-create',
          component: () => import('@/views/production/ShiftCreateView.vue'),
          meta: {
            title: 'Yangi smena',
            requiresAuth: true,
            permission: 'create:production-shift'
          }
        },
        {
          path: 'shifts/:id',
          name: 'production-shifts-details',
          component: () => import('@/views/production/ShiftDetailsView.vue'),
          meta: {
            title: 'Smena tafsilotlari',
            requiresAuth: true,
            permission: 'read:production'
          }
        },
        {
          path: 'lines',
          name: 'production-lines',
          component: () => import('@/views/production/LinesView.vue'),
          meta: {
            title: 'Liniyalar',
            requiresAuth: true,
            permission: 'read:production'
          }
        },
        {
          path: 'output',
          name: 'production-output',
          component: () => import('@/views/production/OutputView.vue'),
          meta: {
            title: 'Mahsulot chiqarish',
            requiresAuth: true,
            permission: 'read:production'
          }
        },
        {
          path: 'quality-control',
          name: 'production-quality',
          component: () => import('@/views/production/QualityControlView.vue'),
          meta: {
            title: 'Sifat nazorati',
            requiresAuth: true,
            permission: 'read:production'
          }
        },
        {
          path: 'defects',
          name: 'production-defects',
          component: () => import('@/views/production/DefectsView.vue'),
          meta: {
            title: 'Nuqsonlar',
            requiresAuth: true,
            permission: 'read:production'
          }
        }
      ]
    }
  ]