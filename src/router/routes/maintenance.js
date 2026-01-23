export default [
    {
      path: 'maintenance',
      name: 'maintenance',
      redirect: { name: 'maintenance-machines' },
      meta: {
        title: 'Texnik xizmat',
        requiresAuth: true,
        permission: 'read:maintenance'
      },
      children: [
        {
          path: 'machines',
          name: 'maintenance-machines',
          component: () => import('@/views/maintenance/MachinesView.vue'),
          meta: {
            title: 'Uskunalar',
            requiresAuth: true,
            permission: 'read:maintenance'
          }
        },
        {
          path: 'machines/:id',
          name: 'maintenance-machines-details',
          component: () => import('@/views/maintenance/MachineDetailsView.vue'),
          meta: {
            title: 'Uskuna tafsilotlari',
            requiresAuth: true,
            permission: 'read:maintenance'
          }
        },
        {
          path: 'schedule',
          name: 'maintenance-schedule',
          component: () => import('@/views/maintenance/ScheduleView.vue'),
          meta: {
            title: 'Rejali xizmat',
            requiresAuth: true,
            permission: 'read:maintenance'
          }
        },
        {
          path: 'schedule/create',
          name: 'maintenance-schedule-create',
          component: () => import('@/views/maintenance/ScheduleCreateView.vue'),
          meta: {
            title: 'Yangi reja',
            requiresAuth: true,
            permission: 'create:maintenance-schedule'
          }
        },
        {
          path: 'requests',
          name: 'maintenance-requests',
          component: () => import('@/views/maintenance/RequestsView.vue'),
          meta: {
            title: 'Ta\'mirlash so\'rovlari',
            requiresAuth: true,
            permission: 'read:maintenance'
          }
        },
        {
          path: 'requests/create',
          name: 'maintenance-requests-create',
          component: () => import('@/views/maintenance/RequestCreateView.vue'),
          meta: {
            title: 'Yangi so\'rov',
            requiresAuth: true,
            permission: 'create:maintenance-request'
          }
        },
        {
          path: 'requests/:id',
          name: 'maintenance-requests-details',
          component: () => import('@/views/maintenance/RequestDetailsView.vue'),
          meta: {
            title: 'So\'rov tafsilotlari',
            requiresAuth: true,
            permission: 'read:maintenance'
          }
        },
        {
          path: 'history',
          name: 'maintenance-history',
          component: () => import('@/views/maintenance/HistoryView.vue'),
          meta: {
            title: 'Tarix',
            requiresAuth: true,
            permission: 'read:maintenance'
          }
        },
        {
          path: 'spare-parts',
          name: 'maintenance-spare-parts',
          component: () => import('@/views/maintenance/SparePartsView.vue'),
          meta: {
            title: 'Ehtiyot qismlar',
            requiresAuth: true,
            permission: 'read:maintenance'
          }
        }
      ]
    }
  ]