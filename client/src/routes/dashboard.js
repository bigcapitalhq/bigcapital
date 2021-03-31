import { lazy } from 'react';
import { formatMessage } from 'services/intl';

// const BASE_URL = '/dashboard';

export default [
  // Accounts.
  {
    path: `/accounts`,
    component: lazy(() => import('containers/Accounts/AccountsChart')),
    breadcrumb: 'Accounts Chart',
    hotkey: 'shift+a',
    pageTitle: 'Accounts Chart',
  },
  // Custom views.
  // {
  //   path: `/custom_views/:resource_slug/new`,
  //   component: lazy(() => import('containers/Views/ViewFormPage')),
  //   breadcrumb: 'New',
  // },
  // {
  //   path: `/custom_views/:view_id/edit`,
  //   component: lazy(() => import('containers/Views/ViewFormPage')),
  //   breadcrumb: 'Edit',
  // },
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
    backLink: true,
  },
  {
    path: `/manual-journals/:id/edit`,
    component: lazy(() =>
      import('containers/Accounting/MakeJournal/MakeJournalEntriesPage'),
    ),
    breadcrumb: 'Edit',
    pageTitle: formatMessage({ id: 'edit_journal' }),
    sidebarShrink: true,
    backLink: true,
  },
  {
    path: `/manual-journals`,
    component: lazy(() =>
      import('containers/Accounting/JournalsLanding/ManualJournalsList'),
    ),
    breadcrumb: 'Manual Journals',
    hotkey: 'shift+m',
    pageTitle: formatMessage({ id: 'manual_journals' }),
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
    name: 'item-edit',
    breadcrumb: 'Edit Item',
    pageTitle: formatMessage({ id: 'edit_item' }),
    backLink: true,
  },
  {
    path: `/items/new?duplicate=/:id`,
    component: lazy({
      loader: () => import('containers/Items/ItemFormPage'),
    }),
    breadcrumb: 'Duplicate Item',
  },
  {
    path: `/items/new`,
    component: lazy(() => import('containers/Items/ItemFormPage')),
    name: 'item-new',
    breadcrumb: 'New Item',
    hotkey: 'ctrl+shift+w',
    pageTitle: formatMessage({ id: 'new_item' }),
    backLink: true,
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
    hint: "Reports every transaction going in and out of your accounts and organized by accounts and date to monitoring activity of accounts.",
    hotkey: 'shift+4',
    pageTitle: formatMessage({ id: 'general_ledger' }),
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: `/financial-reports/balance-sheet`,
    component: lazy(() =>
      import('containers/FinancialStatements/BalanceSheet/BalanceSheet'),
    ),
    breadcrumb: 'Balance Sheet',
    hint: "Reports a company's assets, liabilities and shareholders' equity at a specific point in time with comparison period(s).",
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
    hint: "Summarizes the credit and debit balance of each account in your chart of accounts at a specific point in time. ",
    hotkey: 'shift+5',
    pageTitle: formatMessage({ id: 'trial_balance_sheet' }),
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: `/financial-reports/profit-loss-sheet`,
    component: lazy(() =>
      import('containers/FinancialStatements/ProfitLossSheet/ProfitLossSheet'),
    ),
    breadcrumb: 'Profit Loss Sheet',
    hint: "Reports the revenues, costs and expenses incurred during a specific point in time with comparison period(s).",
    hotkey: 'shift+2',
    pageTitle: formatMessage({ id: 'profit_loss_sheet' }),
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: '/financial-reports/receivable-aging-summary',
    component: lazy(() =>
      import('containers/FinancialStatements/ARAgingSummary/ARAgingSummary'),
    ),
    breadcrumb: 'Receivable Aging Summary',
    hint: "Summarize total unpaid balances of customers invoices with number of days the unpaid invoice is overdue.",
    pageTitle: formatMessage({ id: 'receivable_aging_summary' }),
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: '/financial-reports/payable-aging-summary',
    component: lazy(() =>
      import('containers/FinancialStatements/APAgingSummary/APAgingSummary'),
    ),
    breadcrumb: 'Payable Aging Summary',
    hint: "Summarize total unpaid balances of vendors purchase invoices with the number of days the unpaid invoice is overdue.",
    pageTitle: formatMessage({ id: 'payable_aging_summary' }),
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: `/financial-reports/journal-sheet`,
    component: lazy(() =>
      import('containers/FinancialStatements/Journal/Journal'),
    ),
    breadcrumb: 'Journal Sheet',
    hint: "The debit and credit entries of system transactions, sorted by date.",
    hotkey: 'shift+3',
    pageTitle: formatMessage({ id: 'journal_sheet' }),
    sidebarShrink: true,
    backLink: true,
  },
  {
    path: `/financial-reports/purchases-by-items`,
    component: lazy(() =>
      import(
        'containers/FinancialStatements/PurchasesByItems/PurchasesByItems'
      ),
    ),
    breadcrumb: 'Purchases by Items',
    // hotkey: '',
    pageTitle: formatMessage({ id: 'purchases_by_items' }),
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: `/financial-reports/sales-by-items`,
    component: lazy(() =>
      import('containers/FinancialStatements/SalesByItems/SalesByItems'),
    ),
    breadcrumb: 'Sales by Items',
    pageTitle: formatMessage({ id: 'sales_by_items' }),
    hint: 'Summarize the business’s sold items quantity, income and average income rate of each item during a specific point in time.',
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: `/financial-reports/inventory-valuation`,
    component: lazy(() =>
      import(
        'containers/FinancialStatements/InventoryValuation/InventoryValuation'
      ),
    ),
    breadcrumb: 'Inventory Valuation ',
    hint: 'Summerize your transactions for each inventory item and how they affect quantity, valuation and weighted average.',
    pageTitle: formatMessage({ id: 'inventory_valuation' }),
    backLink: true,
    sidebarShrink: true,
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
    pageTitle: formatMessage({ id: 'exchange_rates_list' }),
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
    backLink: true,
  },
  {
    path: `/expenses/:id/edit`,
    component: lazy(() =>
      import('containers/Expenses/ExpenseForm/ExpenseFormPage'),
    ),
    breadcrumb: 'Edit',
    pageTitle: formatMessage({ id: 'edit_expense' }),
    sidebarShrink: true,
    backLink: true,
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
    name: 'customer-edit',
    breadcrumb: 'Edit Customer',
    pageTitle: formatMessage({ id: 'edit_customer' }),
    backLink: true,
  },
  {
    path: `/customers/new`,
    component: lazy(() =>
      import('containers/Customers/CustomerForm/CustomerFormPage'),
    ),
    name: 'customer-new',
    breadcrumb: 'New Customer',
    hotkey: 'ctrl+shift+c',
    pageTitle: formatMessage({ id: 'new_customer' }),
    backLink: true,
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
  {
    path: `/customers/contact_duplicate=/:id`,
    component: lazy(() =>
      import('containers/Customers/CustomerForm/CustomerFormPage'),
    ),
    name: 'duplicate-customer',
    breadcrumb: 'Duplicate  Customer',
    pageTitle: formatMessage({ id: 'new_customer' }),
    backLink: true,
  },

  // Vendors
  {
    path: `/vendors/:id/edit`,
    component: lazy(() =>
      import('containers/Vendors/VendorForm/VendorFormPage'),
    ),
    name: 'vendor-edit',
    breadcrumb: 'Edit Vendor',
    pageTitle: formatMessage({ id: 'edit_vendor' }),
    backLink: true,
  },
  {
    path: `/vendors/new`,
    component: lazy(() =>
      import('containers/Vendors/VendorForm/VendorFormPage'),
    ),
    name: 'vendor-new',
    breadcrumb: 'New Vendor',
    hotkey: 'ctrl+shift+v',
    pageTitle: formatMessage({ id: 'new_vendor' }),
    backLink: true,
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
  {
    path: `/vendors/contact_duplicate=/:id`,
    component: lazy(() =>
      import('containers/Vendors/VendorForm/VendorFormPage'),
    ),
    name: 'duplicate-vendor',
    breadcrumb: 'Duplicate  Vendor',
    pageTitle: formatMessage({ id: 'new_vendor' }),
    backLink: true,
  },

  // Estimates
  {
    path: `/estimates/:id/edit`,
    component: lazy(() =>
      import('containers/Sales/Estimates/EstimateForm/EstimateFormPage'),
    ),
    name: 'estimate-edit',
    breadcrumb: 'Edit',
    pageTitle: formatMessage({ id: 'edit_estimate' }),
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: `/invoices/new?from_estimate_id=/:id`,
    component: lazy(() =>
      import('containers/Sales/Estimates/EstimateForm/EstimateFormPage'),
    ),
    name: 'convert-to-invoice',
    breadcrumb: 'New Estimate',
    pageTitle: formatMessage({ id: 'new_estimate' }),
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: `/estimates/new`,
    component: lazy(() =>
      import('containers/Sales/Estimates/EstimateForm/EstimateFormPage'),
    ),
    name: 'estimate-new',
    breadcrumb: 'New Estimate',
    hotkey: 'ctrl+shift+e',
    pageTitle: formatMessage({ id: 'new_estimate' }),
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: `/estimates`,
    component: lazy(() =>
      import('containers/Sales/Estimates/EstimatesLanding/EstimatesList'),
    ),
    name: 'estimates-list',
    breadcrumb: 'Estimates List',
    hotkey: 'shift+e',
    pageTitle: formatMessage({ id: 'estimates_list' }),
  },

  // Invoices.
  {
    path: `/invoices/:id/edit`,
    component: lazy(() =>
      import('containers/Sales/Invoices/InvoiceForm/InvoiceFormPage'),
    ),
    name: 'invoice-edit',
    breadcrumb: 'Edit',
    pageTitle: formatMessage({ id: 'edit_invoice' }),
    sidebarShrink: true,
    backLink: true,
  },
  {
    path: `/invoices/new`,
    component: lazy(() =>
      import('containers/Sales/Invoices/InvoiceForm/InvoiceFormPage'),
    ),
    name: 'invoice-new',
    breadcrumb: 'New Invoice',
    hotkey: 'ctrl+shift+i',
    pageTitle: formatMessage({ id: 'new_invoice' }),
    sidebarShrink: true,
    backLink: true,
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
    name: 'receipt-edit',
    breadcrumb: 'Edit',
    pageTitle: formatMessage({ id: 'edit_receipt' }),
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: `/receipts/new`,
    component: lazy(() =>
      import('containers/Sales/Receipts/ReceiptForm/ReceiptFormPage'),
    ),
    name: 'receipt-new',
    breadcrumb: 'New Receipt',
    hotkey: 'ctrl+shift+r',
    pageTitle: formatMessage({ id: 'new_receipt' }),
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: `/receipts`,
    component: lazy(() =>
      import('containers/Sales/Receipts/ReceiptsLanding/ReceiptsList'),
    ),
    breadcrumb: 'Receipts List',
    hotkey: 'shift+r',
    pageTitle: formatMessage({ id: 'receipts_list' }),
  },

  // Payment receives
  {
    path: `/payment-receives/:id/edit`,
    component: lazy(() =>
      import(
        'containers/Sales/PaymentReceives/PaymentReceiveForm/PaymentReceiveFormPage'
      ),
    ),
    name: 'payment-receive-edit',
    breadcrumb: 'Edit',
    pageTitle: formatMessage({ id: 'edit_payment_receive' }),
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: `/payment-receives/new`,
    component: lazy(() =>
      import(
        'containers/Sales/PaymentReceives/PaymentReceiveForm/PaymentReceiveFormPage'
      ),
    ),
    name: 'payment-receive-new',
    breadcrumb: 'New Payment Receive',
    pageTitle: formatMessage({ id: 'new_payment_receive' }),
    backLink: true,
    sidebarShrink: true,
  },
  {
    path: `/payment-receives`,
    component: lazy(() =>
      import(
        'containers/Sales/PaymentReceives/PaymentsLanding/PaymentReceivesList'
      ),
    ),
    breadcrumb: 'Payment Receives List',
    pageTitle: formatMessage({ id: 'payment_receives_list' }),
  },

  // Bills
  {
    path: `/bills/:id/edit`,
    component: lazy(() =>
      import('containers/Purchases/Bills/BillForm/BillFormPage'),
    ),
    name: 'bill-edit',
    breadcrumb: 'Edit',
    pageTitle: formatMessage({ id: 'edit_bill' }),
    sidebarShrink: true,
    backLink: true,
  },
  {
    path: `/bills/new`,
    component: lazy(() =>
      import('containers/Purchases/Bills/BillForm/BillFormPage'),
    ),
    name: 'bill-new',
    breadcrumb: 'New Bill',
    hotkey: 'ctrl+shift+b',
    pageTitle: formatMessage({ id: 'new_bill' }),
    sidebarShrink: true,
    backLink: true,
  },
  {
    path: `/bills`,
    component: lazy(() =>
      import('containers/Purchases/Bills/BillsLanding/BillsList'),
    ),
    breadcrumb: 'Bills List',
    hotkey: 'shift+b',
    pageTitle: formatMessage({ id: 'bills_list' }),
  },

  // Subscription billing.
  {
    path: `/billing`,
    component: lazy(() => import('containers/Subscriptions/BillingForm')),
    breadcrumb: 'New Billing',
  },
  // Payment modes.
  {
    path: `/payment-mades/:id/edit`,
    component: lazy(() =>
      import(
        'containers/Purchases/PaymentMades/PaymentForm/PaymentMadeFormPage'
      ),
    ),
    name: 'payment-made-edit',
    breadcrumb: 'Edit',
    pageTitle: formatMessage({ id: 'edit_payment_made' }),
    sidebarShrink: true,
    backLink: true,
  },
  {
    path: `/payment-mades/new`,
    component: lazy(() =>
      import(
        'containers/Purchases/PaymentMades/PaymentForm/PaymentMadeFormPage'
      ),
    ),
    name: 'payment-made-new',
    breadcrumb: 'New Payment Made',
    pageTitle: formatMessage({ id: 'new_payment_made' }),
    sidebarShrink: true,
    backLink: true,
  },
  {
    path: `/payment-mades`,
    component: lazy(() =>
      import(
        'containers/Purchases/PaymentMades/PaymentsLanding/PaymentMadeList'
      ),
    ),
    breadcrumb: 'Payment Made List',
    pageTitle: formatMessage({ id: 'payment_made_list' }),
  },
  // Homepage
  {
    path: `/`,
    component: lazy(() => import('containers/Homepage/Homepage')),
    breadcrumb: 'Home',
  },
];
