import LazyLoader from 'components/LazyLoader';

const BASE_URL = '/dashboard';

export default [
  // Homepage
  {
    path: `${BASE_URL}/homepage`,
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Homepage')
    }),
  },

  // Accounts.
  {
    path: `${BASE_URL}/accounts`,
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Accounts/AccountsChart')
    })
  },

  // Custom views.
  {
    path: `${BASE_URL}/custom_views/:resource_slug/new`,
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Views/ViewFormPage')
    })
  },
  {
    path: `${BASE_URL}/custom_views/:view_id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Views/ViewFormPage')
    })
  },

  // Expenses.
  {
    path: `${BASE_URL}/expenses/new`,
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Expenses/ExpenseForm')
    }),
  },
  {
    path: `${BASE_URL}/expenses`,
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Expenses/ExpensesList')
    })
  },

  // Accounting
  {
    path: `${BASE_URL}/accounting/make-journal-entry`,
    component: LazyLoader({
      loader: () =>
        import('containers/Dashboard/Accounting/MakeJournalEntriesPage')
    }),
  },
  {
    path: `${BASE_URL}/accounting/manual-journals/:id/edit`,
    component: LazyLoader({
      loader: () =>
        import('containers/Dashboard/Accounting/MakeJournalEntriesPage')
    }),
  },
  {
    path: `${BASE_URL}/accounting/manual-journals`,
    component: LazyLoader({
      loader: () =>
        import('containers/Dashboard/Accounting/ManualJournalsTable')
    }),
  },
  {
    path: `${BASE_URL}/items/categories`,
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Items/ItemsCategoryList')
    })
  },  
  {
    path: `${BASE_URL}/items/new`,
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Items/ItemForm')
    })
  },

  // Items
  {
    path: `${BASE_URL}/items`,
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Items/ItemsList')
    })
  },

  // Financial Reports.
  {
    path: `${BASE_URL}/accounting/general-ledger`,
    component: LazyLoader({
      loader: () =>
        import(
          'containers/Dashboard/FinancialStatements/GeneralLedger/GeneralLedger'
        )
    })
  },
  {
    path: `${BASE_URL}/accounting/balance-sheet`,
    component: LazyLoader({
      loader: () =>
        import(
          'containers/Dashboard/FinancialStatements/BalanceSheet/BalanceSheet'
        )
    })
  },
  {
    path: `${BASE_URL}/accounting/trial-balance-sheet`,
    component: LazyLoader({
      loader: () =>
        import(
          'containers/Dashboard/FinancialStatements/TrialBalanceSheet/TrialBalanceSheet'
        )
    })
  },
  {
    path: `${BASE_URL}/accounting/profit-loss-sheet`,
    component: LazyLoader({
      loader: () =>
        import(
          'containers/Dashboard/FinancialStatements/ProfitLossSheet/ProfitLossSheet'
        )
    })
  },
  {
    path: `${BASE_URL}/accounting/journal-sheet`,
    component: LazyLoader({
      loader: () =>
        import('containers/Dashboard/FinancialStatements/Journal/Journal')
    })
  },
];
