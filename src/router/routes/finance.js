export default [
    {
      path: 'finance',
      name: 'finance',
      redirect: { name: 'finance-transactions' },
      meta: {
        title: 'Moliya',
        requiresAuth: true,
        permission: 'read:finance'
      },
      children: [
        {
          path: 'transactions',
          name: 'finance-transactions',
          component: () => import('@/views/finance/TransactionsView.vue'),
          meta: {
            title: 'Tranzaksiyalar',
            requiresAuth: true,
            permission: 'read:finance'
          }
        },
        {
          path: 'transactions/create',
          name: 'finance-transactions-create',
          component: () => import('@/views/finance/TransactionCreateView.vue'),
          meta: {
            title: 'Yangi tranzaksiya',
            requiresAuth: true,
            permission: 'create:transaction'
          }
        },
        {
          path: 'transactions/:id',
          name: 'finance-transactions-details',
          component: () => import('@/views/finance/TransactionDetailsView.vue'),
          meta: {
            title: 'Tranzaksiya tafsilotlari',
            requiresAuth: true,
            permission: 'read:finance'
          }
        },
        {
          path: 'reports',
          name: 'finance-reports',
          component: () => import('@/views/finance/ReportsView.vue'),
          meta: {
            title: 'Hisobotlar',
            requiresAuth: true,
            permission: 'read:finance'
          }
        },
        {
          path: 'accounts',
          name: 'finance-accounts',
          component: () => import('@/views/finance/AccountsView.vue'),
          meta: {
            title: 'Hisoblar',
            requiresAuth: true,
            permission: 'read:finance'
          }
        },
        {
          path: 'budgets',
          name: 'finance-budgets',
          component: () => import('@/views/finance/BudgetsView.vue'),
          meta: {
            title: 'Byudjetlar',
            requiresAuth: true,
            permission: 'read:finance'
          }
        },
        {
          path: 'invoices',
          name: 'finance-invoices',
          component: () => import('@/views/finance/InvoicesView.vue'),
          meta: {
            title: 'Hisob-fakturalar',
            requiresAuth: true,
            permission: 'read:finance'
          }
        }
      ]
    }
  ]