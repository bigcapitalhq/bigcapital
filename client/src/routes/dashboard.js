import LazyLoader from 'components/LazyLoader';

// const BASE_URL = '/dashboard';

export default [
  // Homepage
  {
    path: `/homepage`,
    component: LazyLoader({
      loader: () => import('containers/Homepage/Homepage'),
    }),
    breadcrumb: 'Home',
  },

  // Accounts.
  {
    path: `/accounts`,
    component: LazyLoader({
      loader: () => import('containers/Accounts/AccountsChart'),
    }),
    breadcrumb: 'Accounts Chart',
  },

  // Custom views.
  {
    path: `/custom_views/:resource_slug/new`,
    component: LazyLoader({
      loader: () => import('containers/Views/ViewFormPage'),
    }),
    breadcrumb: 'New',
  },
  {
    path: `/custom_views/:view_id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Views/ViewFormPage'),
    }),
    breadcrumb: 'Edit',
  },

  // Accounting
  {
    path: `/make-journal-entry`,
    component: LazyLoader({
      loader: () => import('containers/Accounting/MakeJournalEntriesPage'),
    }),
    breadcrumb: 'Make Journal Entry',
  },
  {
    path: `/manual-journals/:id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Accounting/MakeJournalEntriesPage'),
    }),
    breadcrumb: 'Edit',
  },
  {
    path: `/manual-journals`,
    component: LazyLoader({
      loader: () => import('containers/Accounting/ManualJournalsList'),
    }),
    breadcrumb: 'Manual Journals',
  },
  {
    path: `/items/categories`,
    component: LazyLoader({
      loader: () => import('containers/Items/ItemCategoriesList'),
    }),
    breadcrumb: 'Categories',
  },
  {
    path: `/items/:id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Items/ItemFormPage'),
    }),
    breadcrumb: 'Edit Item',
  },
  {
    path: `/items/new`,
    component: LazyLoader({
      loader: () => import('containers/Items/ItemFormPage'),
    }),
    breadcrumb: 'New Item',
  },

  // Items
  {
    path: `/items`,
    component: LazyLoader({
      loader: () => import('containers/Items/ItemsList'),
    }),
    breadcrumb: 'Items',
  },

  // Financial Reports.
  {
    path: `/financial-reports/general-ledger`,
    component: LazyLoader({
      loader: () =>
        import('containers/FinancialStatements/GeneralLedger/GeneralLedger'),
    }),
    breadcrumb: 'General Ledger',
  },
  {
    path: `/financial-reports/balance-sheet`,
    component: LazyLoader({
      loader: () =>
        import('containers/FinancialStatements/BalanceSheet/BalanceSheet'),
    }),
    breadcrumb: 'Balance Sheet',
  },
  {
    path: `/financial-reports/trial-balance-sheet`,
    component: LazyLoader({
      loader: () =>
        import(
          'containers/FinancialStatements/TrialBalanceSheet/TrialBalanceSheet'
        ),
    }),
    breadcrumb: 'Trial Balance Sheet',
  },
  {
    path: `/financial-reports/profit-loss-sheet`,
    component: LazyLoader({
      loader: () =>
        import(
          'containers/FinancialStatements/ProfitLossSheet/ProfitLossSheet'
        ),
    }),
    breadcrumb: 'Profit Loss Sheet',
  },
  {
    path: '/financial-reports/receivable-aging-summary',
    component: LazyLoader({
      loader: () =>
        import(
          'containers/FinancialStatements/ReceivableAgingSummary/ReceivableAgingSummary'
        ),
    }),
    breadcrumb: 'Receivable Aging Summary',
  },
  {
    path: `/financial-reports/journal-sheet`,
    component: LazyLoader({
      loader: () => import('containers/FinancialStatements/Journal/Journal'),
    }),
    breadcrumb: 'Journal Sheet',
  },
  {
    path: '/financial-reports',
    component: LazyLoader({
      loader: () => import('containers/FinancialStatements/FinancialReports'),
    }),
    breadcrumb: 'Financial Reports',
  },
  {
    path: `/ExchangeRates`,
    component: LazyLoader({
      loader: () => import('containers/ExchangeRates/ExchangeRate'),
    }),
    breadcrumb: 'Exchange Rates',
  },
  // Expenses
  {
    path: `/expenses/new`, // expenses/
    component: LazyLoader({
      loader: () => import('containers/Expenses/Expenses'),
    }),
    breadcrumb: 'Expenses',
  },
  {
    path: `/expenses/:id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Expenses/Expenses'),
    }),
    breadcrumb: 'Edit',
  },
  {
    path: `/expenses-list`,
    component: LazyLoader({
      loader: () => import('containers/Expenses/ExpensesList'),
    }),
    breadcrumb: 'Expenses List',
  },
  {
    path: `/customers/:id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Customers/Customer'),
    }),
    breadcrumb: 'Edit Customer',
  },

  {
    path: `/customers/new`,
    component: LazyLoader({
      loader: () => import('containers/Customers/Customer'),
    }),
    breadcrumb: 'New Customer',
  },

  // Customers
  {
    path: `/customers`,
    component: LazyLoader({
      loader: () => import('containers/Customers/CustomersList'),
    }),
    breadcrumb: 'Customers',
  },

  //Estimates
  {
    path: `/estimates/:id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Estimate/Estimates'),
    }),
    breadcrumb: 'Edit',
  },
  {
    path: `/estimates/new`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Estimate/Estimates'),
    }),
    breadcrumb: 'New Estimates',
  },
  // {
  //   path: `/estimates`,
  //   component: LazyLoader({
  //     loader: () => import('containers/Sales/EstimatesList'),
  //   }),
  //   breadcrumb: 'Estimates',
  // },

  //Invoices

  {
    path: `/invoices/:id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Invoice/Invoices'),
    }),
    breadcrumb: 'Edit',
  },

  {
    path: `/invoices/new`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Invoice/Invoices'),
    }),
    breadcrumb: 'New Invoice',
  },
  // {
  //   path:`/invoices`,
  //   component:LazyLoader({
  //     loader:()=>import('containers/Sales/Invoice/Invoices')
  //   }),
  //   breadcrumb: 'New Invoice',
  // },

  //Receipts
  {
    path: `/receipts/:id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Receipt/Receipts'),
    }),
    breadcrumb: 'Edit',
  },
  {
    path: `/receipts/new`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Receipt/Receipts'),
    }),
    breadcrumb: 'New Receipt',
  },
  // {
  //   path: `/receipts`,
  //   component: LazyLoader({
  //     loader: () => import('containers/Sales/Receipt/Receipts'),
  //   }),
  //   breadcrumb: 'New Receipt',
  // }
];
