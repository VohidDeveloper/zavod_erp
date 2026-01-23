export default [
    {
      path: '/login',
      component: () => import('@/components/layout/AuthLayout.vue'),
      children: [
        {
          path: '',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
          meta: {
            title: 'Kirish',
            guest: true
          }
        }
      ]
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: () => import('@/views/auth/ChangePasswordView.vue'),
      meta: {
        title: 'Parolni o\'zgartirish',
        requiresAuth: true
      }
    }
  ]