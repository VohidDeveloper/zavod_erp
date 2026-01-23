export default [
    {
      path: 'hr',
      name: 'hr',
      redirect: { name: 'hr-employees' },
      meta: {
        title: 'Kadrlar',
        requiresAuth: true,
        permission: 'read:hr'
      },
      children: [
        {
          path: 'employees',
          name: 'hr-employees',
          component: () => import('@/views/hr/EmployeesView.vue'),
          meta: {
            title: 'Xodimlar',
            requiresAuth: true,
            permission: 'read:hr'
          }
        },
        {
          path: 'employees/create',
          name: 'hr-employees-create',
          component: () => import('@/views/hr/EmployeeCreateView.vue'),
          meta: {
            title: 'Yangi xodim',
            requiresAuth: true,
            permission: 'create:employee'
          }
        },
        {
          path: 'employees/:id',
          name: 'hr-employees-details',
          component: () => import('@/views/hr/EmployeeDetailsView.vue'),
          meta: {
            title: 'Xodim tafsilotlari',
            requiresAuth: true,
            permission: 'read:hr'
          }
        },
        {
          path: 'attendance',
          name: 'hr-attendance',
          component: () => import('@/views/hr/AttendanceView.vue'),
          meta: {
            title: 'Davomat',
            requiresAuth: true,
            permission: 'read:hr'
          }
        },
        {
          path: 'salaries',
          name: 'hr-salaries',
          component: () => import('@/views/hr/SalariesView.vue'),
          meta: {
            title: 'Ish haqi',
            requiresAuth: true,
            permission: 'read:hr'
          }
        },
        {
          path: 'salaries/calculate',
          name: 'hr-salaries-calculate',
          component: () => import('@/views/hr/SalaryCalculateView.vue'),
          meta: {
            title: 'Ish haqi hisoblash',
            requiresAuth: true,
            permission: 'calculate:salary'
          }
        },
        {
          path: 'departments',
          name: 'hr-departments',
          component: () => import('@/views/hr/DepartmentsView.vue'),
          meta: {
            title: 'Bo\'limlar',
            requiresAuth: true,
            permission: 'read:hr'
          }
        },
        {
          path: 'positions',
          name: 'hr-positions',
          component: () => import('@/views/hr/PositionsView.vue'),
          meta: {
            title: 'Lavozimlar',
            requiresAuth: true,
            permission: 'read:hr'
          }
        },
        {
          path: 'leave',
          name: 'hr-leave',
          component: () => import('@/views/hr/LeaveView.vue'),
          meta: {
            title: 'Ta\'til',
            requiresAuth: true,
            permission: 'read:hr'
          }
        }
      ]
    }
  ]