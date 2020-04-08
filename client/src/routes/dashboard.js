import LazyLoader from 'components/LazyLoader';

const BASE_URL = '/dashboard';

export default [
  // Homepage
  {
    path: `${BASE_URL}/homepage`,
    name: 'dashboard.homepage',
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Homepage')
    }),
    exact: true
  },

  // Accounts.
  {
    path: `${BASE_URL}/accounts`,
    name: 'dashboard.accounts',
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Accounts/AccountsChart')
    })
  },

  // Custom views.
  {
    path: `${BASE_URL}/custom_views/:resource_slug/new`,
    name: 'dashboard.custom_view.new',
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Views/ViewFormPage')
    })
  },
  {
    path: `${BASE_URL}/custom_views/:view_id/edit`,
    name: 'dashboard.custom_view.edit',
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Views/ViewFormPage')
    })
  },

  // Expenses.
  {
    path: `${BASE_URL}/expenses/new`,
    name: 'dashboard.expense.new',
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Expenses/ExpenseForm')
    }),
    text: 'New Expense'
  },
  {
    path: `${BASE_URL}/expenses`,
    name: 'dashboard.expeneses.list',
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Expenses/ExpensesList')
    })
  },

  // Accounting
  {
    path: `${BASE_URL}/accounting/make-journal-entry`,
    name: 'dashboard.accounting.make.journal',
    component: LazyLoader({
      loader: () =>
        import('containers/Dashboard/Accounting/MakeJournalEntriesPage')
    }),
    text: 'Make Journal Entry'
  },

  {
    path: `${BASE_URL}/accounting/manual-journals/:id/edit`,
    name: 'dashboard.manual.journal.edit',
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
    text: 'Manual Journals'
  },

  // Items
  {
    path: `${BASE_URL}/items/list`,
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Items/ItemsList')
    })
  },
  {
    path: `${BASE_URL}/items/new`,
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Items/ItemForm')
    })
  },

  {
    path: `${BASE_URL}/items/ItemCategoriesList`,
    component: LazyLoader({
      loader: () => import('containers/Dashboard/Items/ItemsCategoryList')
    })
  },

  // Financial Reports.
  {
    path: `${BASE_URL}/accounting/general-ledger`,
    name: 'dashboard.accounting.general.ledger',
    component: LazyLoader({
      loader: () =>
        import(
          'containers/Dashboard/FinancialStatements/GeneralLedger/GeneralLedger'
        )
    })
  },
  {
    path: `${BASE_URL}/accounting/balance-sheet`,
    name: 'dashboard.accounting.balance.sheet',
    component: LazyLoader({
      loader: () =>
        import(
          'containers/Dashboard/FinancialStatements/BalanceSheet/BalanceSheet'
        )
    })
  },
  {
    path: `${BASE_URL}/accounting/trial-balance-sheet`,
    name: 'dashboard.accounting.trial.balance',
    component: LazyLoader({
      loader: () =>
        import(
          'containers/Dashboard/FinancialStatements/TrialBalanceSheet/TrialBalanceSheet'
        )
    })
  },
  {
    path: `${BASE_URL}/accounting/profit-loss-sheet`,
    name: 'dashboard.accounting.profit.loss.sheet',
    component: LazyLoader({
      loader: () =>
        import(
          'containers/Dashboard/FinancialStatements/ProfitLossSheet/ProfitLossSheet'
        )
    })
  },
  {
    path: `${BASE_URL}/accounting/journal-sheet`,
    name: 'dashboard.accounting.journal.sheet',
    component: LazyLoader({
      loader: () =>
        import('containers/Dashboard/FinancialStatements/Journal/Journal')
    })
  }
];
