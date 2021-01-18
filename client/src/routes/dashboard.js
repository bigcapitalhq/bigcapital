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
    hotkey: 'shift+a',
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
  // Accounting.
  {
    path: `/make-journal-entry`,
    component: LazyLoader({
      loader: () => import('containers/Accounting/MakeJournalEntriesPage'),
    }),
    breadcrumb: 'Make Journal Entry',
    hotkey: 'ctrl+shift+m',
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
    hotkey: 'shift+m',
  },
  {
    path: `/items/categories`,
    component: LazyLoader({
      loader: () => import('containers/Items/ItemCategoriesList'),
    }),
    breadcrumb: 'Categories',
  },
  // Items.
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
    hotkey: 'ctrl+shift+w',
  },
  {
    path: `/items`,
    component: LazyLoader({
      loader: () => import('containers/Items/ItemsList'),
    }),
    breadcrumb: 'Items',
    hotkey: 'shift+w',
  },

  // Inventory adjustments.
  {
    path: `/inventory-adjustments`,
    component: LazyLoader({
      loader: () => import('containers/Items/InventoryAdjustmentList'),
    }),
    breadcrumb: 'Inventory a adjustments',
  },

  // Financial Reports.
  {
    path: `/financial-reports/general-ledger`,
    component: LazyLoader({
      loader: () =>
        import('containers/FinancialStatements/GeneralLedger/GeneralLedger'),
    }),
    breadcrumb: 'General Ledger',
    hotkey: 'shift+4',
  },
  {
    path: `/financial-reports/balance-sheet`,
    component: LazyLoader({
      loader: () =>
        import('containers/FinancialStatements/BalanceSheet/BalanceSheet'),
    }),
    breadcrumb: 'Balance Sheet',
    hotkey: 'shift+1',
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
    hotkey: 'shift+5',
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
    hotkey: 'shift+2',
  },
  {
    path: '/financial-reports/receivable-aging-summary',
    component: LazyLoader({
      loader: () =>
        import('containers/FinancialStatements/ARAgingSummary/ARAgingSummary'),
    }),
    breadcrumb: 'Receivable Aging Summary',
  },
  {
    path: `/financial-reports/journal-sheet`,
    component: LazyLoader({
      loader: () => import('containers/FinancialStatements/Journal/Journal'),
    }),
    breadcrumb: 'Journal Sheet',
    hotkey: 'shift+3',
  },
  {
    path: '/financial-reports',
    component: LazyLoader({
      loader: () => import('containers/FinancialStatements/FinancialReports'),
    }),
    breadcrumb: 'Financial Reports',
  },
  // Exchange Rates
  {
    path: `/exchange-rates`,
    component: LazyLoader({
      loader: () => import('containers/ExchangeRates/ExchangeRatesList'),
    }),
    breadcrumb: 'Exchange Rates',
  },
  // Expenses.
  {
    path: `/expenses/new`,
    component: LazyLoader({
      loader: () => import('containers/Expenses/ExpenseFormPage'),
    }),
    breadcrumb: 'Expenses',
    hotkey: 'ctrl+shift+x',
  },
  {
    path: `/expenses/:id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Expenses/ExpenseFormPage'),
    }),
    breadcrumb: 'Edit',
  },
  {
    path: `/expenses`,
    component: LazyLoader({
      loader: () => import('containers/Expenses/ExpensesList'),
    }),
    breadcrumb: 'Expenses List',
    hotkey: 'shift+x',
  },

  // Customers
  {
    path: `/customers/:id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Customers/CustomerFormPage'),
    }),
    breadcrumb: 'Edit Customer',
  },
  {
    path: `/customers/new`,
    component: LazyLoader({
      loader: () => import('containers/Customers/CustomerFormPage'),
    }),
    breadcrumb: 'New Customer',
    hotkey: 'ctrl+shift+c',
  },
  {
    path: `/customers`,
    component: LazyLoader({
      loader: () => import('containers/Customers/CustomersList'),
    }),
    breadcrumb: 'Customers',
    hotkey: 'shift+c',
  },

  // Vendors
  {
    path: `/vendors/:id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Vendors/VendorFormPage'),
    }),
    breadcrumb: 'Edit Vendor',
  },
  {
    path: `/vendors/new`,
    component: LazyLoader({
      loader: () => import('containers/Vendors/VendorFormPage'),
    }),
    breadcrumb: 'New Vendor',
    hotkey: 'ctrl+shift+v',
  },
  {
    path: `/vendors`,
    component: LazyLoader({
      loader: () => import('containers/Vendors/VendorsList'),
    }),
    breadcrumb: 'Vendors',
    hotkey: 'shift+v',
  },

  // Estimates
  {
    path: `/estimates/:id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Estimate/EstimateFormPage'),
    }),
    breadcrumb: 'Edit',
  },
  {
    path: `/estimates/new`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Estimate/EstimateFormPage'),
    }),
    breadcrumb: 'New Estimate',
    hotkey: 'ctrl+shift+e',
  },
  {
    path: `/estimates`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Estimate/EstimatesList'),
    }),
    breadcrumb: 'Estimates List',
    hotkey: 'shift+e',
  },

  // Invoices.
  {
    path: `/invoices/:id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Invoice/InvoiceFormPage'),
    }),
    breadcrumb: 'Edit',
  },
  {
    path: `/invoices/new`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Invoice/InvoiceFormPage'),
    }),
    breadcrumb: 'New Invoice',
    hotkey: 'ctrl+shift+i',
  },
  {
    path: `/invoices`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Invoice/InvoicesList'),
    }),
    breadcrumb: 'Invoices List',
    hotkey: 'shift+i',
  },

  // Sales Receipts.
  {
    path: `/receipts/:id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Receipt/ReceiptFormPage'),
    }),
    breadcrumb: 'Edit',
  },
  {
    path: `/receipts/new`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Receipt/ReceiptFormPage'),
    }),
    breadcrumb: 'New Receipt',
    hotkey: 'ctrl+shift+r',
  },
  {
    path: `/receipts`,
    component: LazyLoader({
      loader: () => import('containers/Sales/Receipt/ReceiptsList'),
    }),
    breadcrumb: 'Receipts List',
    hotkey: 'shift+r',
  },

  // Payment receives
  {
    path: `/payment-receives/:id/edit`,
    component: LazyLoader({
      loader: () =>
        import('containers/Sales/PaymentReceive/PaymentReceiveFormPage'),
    }),
    breadcrumb: 'Edit',
  },
  {
    path: `/payment-receives/new`,
    component: LazyLoader({
      loader: () =>
        import('containers/Sales/PaymentReceive/PaymentReceiveFormPage'),
    }),
    breadcrumb: 'New Payment Receive',
  },
  {
    path: `/payment-receives`,
    component: LazyLoader({
      loader: () =>
        import('containers/Sales/PaymentReceive/PaymentReceivesList'),
    }),
    breadcrumb: 'Payment Receives List',
  },

  // Bills
  {
    path: `/bills/:id/edit`,
    component: LazyLoader({
      loader: () => import('containers/Purchases/Bill/BillFormPage'),
    }),
    breadcrumb: 'Edit',
  },
  {
    path: `/bills/new`,
    component: LazyLoader({
      loader: () => import('containers/Purchases/Bill/BillFormPage'),
    }),
    breadcrumb: 'New Bill',
    hotkey: 'ctrl+shift+b',
  },
  {
    path: `/bills`,
    component: LazyLoader({
      loader: () => import('containers/Purchases/Bill/BillsList'),
    }),
    breadcrumb: 'Bills List',
    hotkey: 'shift+b',
  },

  // Subscription billing.
  {
    path: `/billing`,
    component: LazyLoader({
      loader: () => import('containers/Subscriptions/BillingForm'),
    }),
    breadcrumb: 'New Billing',
  },
  // Payment modes.
  {
    path: `/payment-mades/:id/edit`,
    component: LazyLoader({
      loader: () =>
        import('containers/Purchases/PaymentMades/PaymentMadeFormPage'),
    }),
    breadcrumb: 'Edit',
  },
  {
    path: `/payment-mades/new`,
    component: LazyLoader({
      loader: () =>
        import('containers/Purchases/PaymentMades/PaymentMadeFormPage'),
    }),
    breadcrumb: 'New Payment Made',
  },
  {
    path: `/payment-mades`,
    component: LazyLoader({
      loader: () => import('containers/Purchases/PaymentMades/PaymentMadeList'),
    }),
    breadcrumb: 'Payment Made List',
  },
];
