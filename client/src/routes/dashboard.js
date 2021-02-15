import { lazy } from 'react';
import { formatMessage } from 'services/intl';

// const BASE_URL = '/dashboard';

export default [
  // Homepage
  {
    path: `/homepage`,
    component: lazy(() => import('containers/Homepage/Homepage')),
    breadcrumb: 'Home',
    pageTitle: 'Homepage',
  },
  // Accounts.
  {
    path: `/accounts`,
    component: lazy(() => import('containers/Accounts/AccountsChart')),
    breadcrumb: 'Accounts Chart',
    hotkey: 'shift+a',
    pageTitle: 'Accounts Chart',
  },
  // Custom views.
  {
    path: `/custom_views/:resource_slug/new`,
    component: lazy(() => import('containers/Views/ViewFormPage')),
    breadcrumb: 'New',
  },
  {
    path: `/custom_views/:view_id/edit`,
    component: lazy(() => import('containers/Views/ViewFormPage')),
    breadcrumb: 'Edit',
  },
  // Accounting.
  {
    path: `/make-journal-entry`,
    component: lazy(() =>
      import('containers/Accounting/MakeJournal/MakeJournalEntriesPage'),
    ),
    breadcrumb: 'Make Journal Entry',
    hotkey: 'ctrl+shift+m',
    pageTitle: formatMessage({ id: 'new_journal' }),
    sidebarShrink: true,
    backLink: true
  },
  {
    path: `/manual-journals/:id/edit`,
    component: lazy(() =>
      import('containers/Accounting/MakeJournal/MakeJournalEntriesPage'),
    ),
    breadcrumb: 'Edit',
    pageTitle: formatMessage({ id: 'edit_journal' }),
    sidebarShrink: true,
    backLink: true
  },
  {
    path: `/manual-journals`,
    component: lazy(() =>
      import('containers/Accounting/JournalsLanding/ManualJournalsList'),
    ),
    breadcrumb: 'Manual Journals',
    hotkey: 'shift+m',
  },
  {
    path: `/items/categories`,
    component: lazy(() =>
      import('containers/ItemsCategories/ItemCategoriesList'),
    ),
    breadcrumb: 'Categories',
    pageTitle: formatMessage({ id: 'category_list' }),
  },
  // Items.
  {
    path: `/items/:id/edit`,
    component: lazy(() => import('containers/Items/ItemFormPage')),
    breadcrumb: 'Edit Item',
    pageTitle: formatMessage({ id: 'edit_item' }),
    backLink: true
  },
  {
    path: `/items/new`,
    component: lazy(() => import('containers/Items/ItemFormPage')),
    breadcrumb: 'New Item',
    hotkey: 'ctrl+shift+w',
    pageTitle: formatMessage({ id: 'new_item' }),
    backLink: true
  },
  {
    path: `/items`,
    component: lazy(() => import('containers/Items/ItemsList')),
    breadcrumb: 'Items',
    hotkey: 'shift+w',
  },

  // Inventory adjustments.
  {
    path: `/inventory-adjustments`,
    component: lazy(() =>
      import('containers/InventoryAdjustments/InventoryAdjustmentList'),
    ),
    breadcrumb: 'Inventory a adjustments',
    pageTitle: formatMessage({ id: 'inventory_adjustment_list' }),
  },

  // Financial Reports.
  {
    path: `/financial-reports/general-ledger`,
    component: lazy(() =>
      import('containers/FinancialStatements/GeneralLedger/GeneralLedger'),
    ),
    breadcrumb: 'General Ledger',
    hotkey: 'shift+4',
  },
  {
    path: `/financial-reports/balance-sheet`,
    component: lazy(() =>
      import('containers/FinancialStatements/BalanceSheet/BalanceSheet'),
    ),
    breadcrumb: 'Balance Sheet',
    hotkey: 'shift+1',
    pageTitle: formatMessage({ id: 'balance_sheet' }),
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: `/financial-reports/trial-balance-sheet`,
    component: lazy(() =>
      import(
        'containers/FinancialStatements/TrialBalanceSheet/TrialBalanceSheet'
      ),
    ),
    breadcrumb: 'Trial Balance Sheet',
    hotkey: 'shift+5',
  },
  {
    path: `/financial-reports/profit-loss-sheet`,
    component: lazy(() =>
      import('containers/FinancialStatements/ProfitLossSheet/ProfitLossSheet'),
    ),
    breadcrumb: 'Profit Loss Sheet',
    hotkey: 'shift+2',
  },
  {
    path: '/financial-reports/receivable-aging-summary',
    component: lazy(() =>
      import('containers/FinancialStatements/ARAgingSummary/ARAgingSummary'),
    ),
    breadcrumb: 'Receivable Aging Summary',
  },
  {
    path: `/financial-reports/journal-sheet`,
    component: lazy(() =>
      import('containers/FinancialStatements/Journal/Journal'),
    ),
    breadcrumb: 'Journal Sheet',
    hotkey: 'shift+3',
  },
  {
    path: '/financial-reports',
    component: lazy(() =>
      import('containers/FinancialStatements/FinancialReports'),
    ),
    breadcrumb: 'Financial Reports',
    pageTitle: formatMessage({ id: 'all_financial_reports' }),
  },
  // Exchange Rates
  {
    path: `/exchange-rates`,
    component: lazy(() => import('containers/ExchangeRates/ExchangeRatesList')),
    breadcrumb: 'Exchange Rates',
  },
  // Expenses.
  {
    path: `/expenses/new`,
    component: lazy(() =>
      import('containers/Expenses/ExpenseForm/ExpenseFormPage'),
    ),
    breadcrumb: 'Expenses',
    hotkey: 'ctrl+shift+x',
    pageTitle: formatMessage({ id: 'new_expense' }),
    sidebarShrink: true,
    backLink: true
  },
  {
    path: `/expenses/:id/edit`,
    component: lazy(() =>
      import('containers/Expenses/ExpenseForm/ExpenseFormPage'),
    ),
    breadcrumb: 'Edit',
    pageTitle: formatMessage({ id: 'edit_expense' }),
    sidebarShrink: true,
    backLink: true
  },
  {
    path: `/expenses`,
    component: lazy(() =>
      import('containers/Expenses/ExpensesLanding/ExpensesList'),
    ),
    breadcrumb: 'Expenses List',
    pageTitle: formatMessage({ id: 'expenses_list' }),
    hotkey: 'shift+x',
  },

  // Customers
  {
    path: `/customers/:id/edit`,
    component: lazy(() =>
      import('containers/Customers/CustomerForm/CustomerFormPage'),
    ),
    breadcrumb: 'Edit Customer',
    pageTitle: formatMessage({ id: 'edit_customer' }),
    backLink: true
  },
  {
    path: `/customers/new`,
    component: lazy(() =>
      import('containers/Customers/CustomerForm/CustomerFormPage'),
    ),
    breadcrumb: 'New Customer',
    hotkey: 'ctrl+shift+c',
    pageTitle: formatMessage({ id: 'new_customer' }),
    backLink: true
  },
  {
    path: `/customers`,
    component: lazy(() =>
      import('containers/Customers/CustomersLanding/CustomersList'),
    ),
    breadcrumb: 'Customers',
    hotkey: 'shift+c',
    pageTitle: formatMessage({ id: 'customers_list' }),
  },

  // Vendors
  {
    path: `/vendors/:id/edit`,
    component: lazy(() =>
      import('containers/Vendors/VendorForm/VendorFormPage'),
    ),
    breadcrumb: 'Edit Vendor',
    pageTitle: formatMessage({ id: 'edit_vendor' }),
  },
  {
    path: `/vendors/new`,
    component: lazy(() =>
      import('containers/Vendors/VendorForm/VendorFormPage'),
    ),
    breadcrumb: 'New Vendor',
    hotkey: 'ctrl+shift+v',
    pageTitle: formatMessage({ id: 'new_vendor' }),
  },
  {
    path: `/vendors`,
    component: lazy(() =>
      import('containers/Vendors/VendorsLanding/VendorsList'),
    ),
    breadcrumb: 'Vendors',
    hotkey: 'shift+v',
    pageTitle: formatMessage({ id: 'vendors_list' }),
  },

  // Estimates
  // {
  //   path: `/estimates/:id/edit`,
  //   component: LazyLoader({
  //     loader: () => import('containers/Sales/Estimate/EstimateFormPage'),
  //   }),
  //   breadcrumb: 'Edit',
  // },
  // {
  //   path: `/estimates/new`,
  //   component: LazyLoader({
  //     loader: () => import('containers/Sales/Estimate/EstimateFormPage'),
  //   }),
  //   breadcrumb: 'New Estimate',
  //   hotkey: 'ctrl+shift+e',
  // },
  {
    path: `/estimates`,
    component: lazy(() =>
      import('containers/Sales/Estimates/EstimatesLanding/EstimatesList'),
    ),
    breadcrumb: 'Estimates List',
    hotkey: 'shift+e',
    pageTitle: formatMessage({ id: 'estimates_list' })
  },

  // Invoices.
  {
    path: `/invoices/:id/edit`,
    component: lazy(() =>
      import('containers/Sales/Invoices/InvoiceForm/InvoiceFormPage'),
    ),
    breadcrumb: 'Edit',
    pageTitle: formatMessage({ id: 'edit_invoice' }),
    sidebarShrink: true,
    backLink: true
  },
  {
    path: `/invoices/new`,
    component: lazy(() =>
      import('containers/Sales/Invoices/InvoiceForm/InvoiceFormPage'),
    ),
    breadcrumb: 'New Invoice',
    hotkey: 'ctrl+shift+i',
    pageTitle: formatMessage({ id: 'new_invoice' }),
    sidebarShrink: true,
    backLink: true
  },
  {
    path: `/invoices`,
    component: lazy(() =>
      import('containers/Sales/Invoices/InvoicesLanding/InvoicesList'),
    ),
    breadcrumb: 'Invoices List',
    hotkey: 'shift+i',
    pageTitle: formatMessage({ id: 'invoices_list' }),
  },

  // Sales Receipts.
  {
    path: `/receipts/:id/edit`,
    component: lazy(() =>
      import('containers/Sales/Receipts/ReceiptForm/ReceiptFormPage'),
    ),
    breadcrumb: 'Edit',
  },
  {
    path: `/receipts/new`,
    component: lazy(() =>
      import('containers/Sales/Receipts/ReceiptForm/ReceiptFormPage'),
    ),
    breadcrumb: 'New Receipt',
    hotkey: 'ctrl+shift+r',
  },
  {
    path: `/receipts`,
    component: lazy(() =>
      import('containers/Sales/Receipts/ReceiptsLanding/ReceiptsList'),
    ),
    breadcrumb: 'Receipts List',
    hotkey: 'shift+r',
    pageTitle: formatMessage({ id: 'receipts_list' })
  },

  // Payment receives
  // {
  //   path: `/payment-receives/:id/edit`,
  //   component: LazyLoader({
  //     loader: () =>
  //       import('containers/Sales/PaymentReceive/PaymentReceiveFormPage'),
  //   }),
  //   breadcrumb: 'Edit',
  // },
  // {
  //   path: `/payment-receives/new`,
  //   component: LazyLoader({
  //     loader: () =>
  //       import('containers/Sales/PaymentReceive/PaymentReceiveFormPage'),
  //   }),
  //   breadcrumb: 'New Payment Receive',
  // },
  {
    path: `/payment-receives`,
    component: lazy(() =>
      import(
        'containers/Sales/PaymentReceive/PaymentsLanding/PaymentReceivesList'
      ),
    ),
    breadcrumb: 'Payment Receives List',
  },

  // Bills
  {
    path: `/bills/:id/edit`,
    component: lazy(() =>
      import('containers/Purchases/Bills/BillForm/BillFormPage'),
    ),
    breadcrumb: 'Edit',
    pageTitle: formatMessage({ id: 'edit_bill' })
  },
  {
    path: `/bills/new`,
    component: lazy(() =>
      import('containers/Purchases/Bills/BillForm/BillFormPage'),
    ),
    breadcrumb: 'New Bill',
    hotkey: 'ctrl+shift+b',
    pageTitle: formatMessage({ id: 'new_bill' })
  },
  {
    path: `/bills`,
    component: lazy(() =>
      import('containers/Purchases/Bills/BillsLanding/BillsList'),
    ),
    breadcrumb: 'Bills List',
    hotkey: 'shift+b',
    pageTitle: formatMessage({ id: 'bills_list' })
  },

  // Subscription billing.
  {
    path: `/billing`,
    component: lazy(() => import('containers/Subscriptions/BillingForm')),
    breadcrumb: 'New Billing',
  },
  // Payment modes.
  // {
  //   path: `/payment-mades/:id/edit`,
  //   component: LazyLoader({
  //     loader: () =>
  //       import('containers/Purchases/PaymentMades/PaymentMadeFormPage'),
  //   }),
  //   breadcrumb: 'Edit',
  // },
  // {
  //   path: `/payment-mades/new`,
  //   component: LazyLoader({
  //     loader: () =>
  //       import('containers/Purchases/PaymentMades/PaymentMadeFormPage'),
  //   }),
  //   breadcrumb: 'New Payment Made',
  // },
  {
    path: `/payment-mades`,
    component: lazy(() =>
      import(
        'containers/Purchases/PaymentMades/PaymentsLanding/PaymentMadeList'
      ),
    ),
    breadcrumb: 'Payment Made List',
    pageTitle: formatMessage({ id: 'payment_made_list' })
  },
];
