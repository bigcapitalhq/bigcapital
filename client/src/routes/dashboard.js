import React, { lazy } from 'react';
import { formatMessage } from 'services/intl';

// const BASE_URL = '/dashboard';

export default [
  // Accounts.
  {
    path: `/accounts`,
    component: lazy(() => import('containers/Accounts/AccountsChart')),
    breadcrumb: formatMessage({ id: 'accounts_chart' }),
    hotkey: 'shift+a',
    pageTitle: formatMessage({ id: 'accounts_chart' }),
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
    breadcrumb: formatMessage({ id: 'make_journal_entry' }),
    hotkey: 'ctrl+shift+m',
    pageTitle: formatMessage({ id: 'new_journal' }),
    sidebarExpand: false,
    backLink: true,
  },
  {
    path: `/manual-journals/:id/edit`,
    component: lazy(() =>
      import('containers/Accounting/MakeJournal/MakeJournalEntriesPage'),
    ),
    breadcrumb: formatMessage({ id: 'edit' }),
    pageTitle: formatMessage({ id: 'edit_journal' }),
    sidebarExpand: false,
    backLink: true,
  },
  {
    path: `/manual-journals`,
    component: lazy(() =>
      import('containers/Accounting/JournalsLanding/ManualJournalsList'),
    ),
    breadcrumb: formatMessage({ id: 'manual_journals' }),
    hotkey: 'shift+m',
    pageTitle: formatMessage({ id: 'manual_journals' }),
  },
  {
    path: `/items/categories`,
    component: lazy(() =>
      import('containers/ItemsCategories/ItemCategoriesList'),
    ),
    breadcrumb: formatMessage({ id: 'categories' }),
    pageTitle: formatMessage({ id: 'category_list' }),
  },
  // Items.
  {
    path: `/items/:id/edit`,
    component: lazy(() => import('containers/Items/ItemFormPage')),
    name: 'item-edit',
    breadcrumb: formatMessage({ id: 'edit_item' }),
    pageTitle: formatMessage({ id: 'edit_item' }),
    backLink: true,
  },
  {
    path: `/items/new?duplicate=/:id`,
    component: lazy({
      loader: () => import('containers/Items/ItemFormPage'),
    }),
    breadcrumb: formatMessage({ id: 'duplicate_item' }),
  },
  {
    path: `/items/new`,
    component: lazy(() => import('containers/Items/ItemFormPage')),
    name: 'item-new',
    breadcrumb: formatMessage({ id: 'new_item' }),
    hotkey: 'ctrl+shift+w',
    pageTitle: formatMessage({ id: 'new_item' }),
    backLink: true,
  },
  {
    path: `/items`,
    component: lazy(() => import('containers/Items/ItemsList')),
    breadcrumb: formatMessage({ id: 'items' }),
    hotkey: 'shift+w',
    pageTitle: formatMessage({ id: 'items_list' }),
  },

  // Inventory adjustments.
  {
    path: `/inventory-adjustments`,
    component: lazy(() =>
      import('containers/InventoryAdjustments/InventoryAdjustmentList'),
    ),
    breadcrumb: formatMessage({ id: 'inventory_adjustments' }),
    pageTitle: formatMessage({ id: 'inventory_adjustment_list' }),
  },

  // Financial Reports.
  {
    path: `/financial-reports/general-ledger`,
    component: lazy(() =>
      import('containers/FinancialStatements/GeneralLedger/GeneralLedger'),
    ),
    breadcrumb: formatMessage({ id: 'general_ledger' }),
    hint: formatMessage({
      id: 'reports_every_transaction_going_in_and_out_of_your',
    }),
    hotkey: 'shift+4',
    pageTitle: formatMessage({ id: 'general_ledger' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/financial-reports/balance-sheet`,
    component: lazy(() =>
      import('containers/FinancialStatements/BalanceSheet/BalanceSheet'),
    ),
    breadcrumb: formatMessage({ id: 'balance_sheet' }),
    hint: formatMessage({
      id: 'reports_a_company_s_assets_liabilities_and_shareholders',
    }),
    hotkey: 'shift+1',
    pageTitle: formatMessage({ id: 'balance_sheet' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/financial-reports/trial-balance-sheet`,
    component: lazy(() =>
      import(
        'containers/FinancialStatements/TrialBalanceSheet/TrialBalanceSheet'
      ),
    ),
    breadcrumb: formatMessage({ id: 'trial_balance_sheet' }),
    hint: formatMessage({
      id: 'summarizes_the_credit_and_debit_balance_of_each_account',
    }),
    hotkey: 'shift+5',
    pageTitle: formatMessage({ id: 'trial_balance_sheet' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/financial-reports/profit-loss-sheet`,
    component: lazy(() =>
      import('containers/FinancialStatements/ProfitLossSheet/ProfitLossSheet'),
    ),
    breadcrumb: formatMessage({ id: 'profit_loss_sheet' }),
    hint: formatMessage({ id: 'reports_the_revenues_costs_and_expenses' }),
    hotkey: 'shift+2',
    pageTitle: formatMessage({ id: 'profit_loss_sheet' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: '/financial-reports/receivable-aging-summary',
    component: lazy(() =>
      import('containers/FinancialStatements/ARAgingSummary/ARAgingSummary'),
    ),
    breadcrumb: formatMessage({ id: 'receivable_aging_summary' }),
    hint: formatMessage({
      id: 'summarize_total_unpaid_balances_of_customers_invoices',
    }),
    pageTitle: formatMessage({ id: 'receivable_aging_summary' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: '/financial-reports/payable-aging-summary',
    component: lazy(() =>
      import('containers/FinancialStatements/APAgingSummary/APAgingSummary'),
    ),
    breadcrumb: formatMessage({ id: 'payable_aging_summary' }),
    hint: formatMessage({
      id: 'summarize_total_unpaid_balances_of_vendors_purchase',
    }),
    pageTitle: formatMessage({ id: 'payable_aging_summary' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/financial-reports/journal-sheet`,
    component: lazy(() =>
      import('containers/FinancialStatements/Journal/Journal'),
    ),
    breadcrumb: formatMessage({ id: 'journal_sheet' }),
    hint: formatMessage({
      id: 'the_debit_and_credit_entries_of_system_transactions',
    }),
    hotkey: 'shift+3',
    pageTitle: formatMessage({ id: 'journal_sheet' }),
    sidebarExpand: false,
    backLink: true,
  },
  {
    path: `/financial-reports/purchases-by-items`,
    component: lazy(() =>
      import(
        'containers/FinancialStatements/PurchasesByItems/PurchasesByItems'
      ),
    ),
    breadcrumb: formatMessage({ id: 'purchases_by_items' }),
    // hotkey: '',
    pageTitle: formatMessage({ id: 'purchases_by_items' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/financial-reports/sales-by-items`,
    component: lazy(() =>
      import('containers/FinancialStatements/SalesByItems/SalesByItems'),
    ),
    breadcrumb: formatMessage({ id: 'sales_by_items' }),
    pageTitle: formatMessage({ id: 'sales_by_items' }),
    hint: formatMessage({
      id: 'summarize_the_business_s_sold_items_quantity_income_and_average_income_rate',
    }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/financial-reports/inventory-valuation`,
    component: lazy(() =>
      import(
        'containers/FinancialStatements/InventoryValuation/InventoryValuation'
      ),
    ),
    breadcrumb: formatMessage({ id: 'inventory_valuation' }),
    hint: formatMessage({
      id: 'summerize_your_transactions_for_each_inventory_item',
    }),
    pageTitle: formatMessage({ id: 'inventory_valuation' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/financial-reports/customers-balance-summary`,
    component: lazy(() =>
      import(
        'containers/FinancialStatements/CustomersBalanceSummary/CustomersBalanceSummary'
      ),
    ),
    breadcrumb: formatMessage({ id: 'customers_balance_summary' }),
    hint: formatMessage({
      id: 'summerize_how_much_each_customer_owes_your_business',
    }),
    pageTitle: formatMessage({ id: 'customers_balance_summary' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/financial-reports/vendors-balance-summary`,
    component: lazy(() =>
      import(
        'containers/FinancialStatements/VendorsBalanceSummary/VendorsBalanceSummary'
      ),
    ),
    breadcrumb: formatMessage({ id: 'vendors_balance_summary' }),
    hint: formatMessage({
      id: 'summerize_the_total_amount_your_business_owes_each_vendor',
    }),
    pageTitle: formatMessage({ id: 'vendors_balance_summary' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/financial-reports/transactions-by-customers`,
    component: lazy(() =>
      import(
        'containers/FinancialStatements/CustomersTransactions/CustomersTransactions'
      ),
    ),
    breadcrumb: formatMessage({ id: 'customers_transactions' }),
    hint: formatMessage({
      id: 'reports_every_transaction_going_in_and_out_of_each_customer',
    }),
    pageTitle: formatMessage({ id: 'customers_transactions' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/financial-reports/transactions-by-vendors`,
    component: lazy(() =>
      import(
        'containers/FinancialStatements/VendorsTransactions/VendorsTransactions'
      ),
    ),
    breadcrumb: formatMessage({ id: 'vendors_transactions' }),
    hint: formatMessage({
      id: 'reports_every_transaction_going_in_and_out_of_each_vendor_supplier',
    }),
    pageTitle: formatMessage({ id: 'vendors_transactions' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/financial-reports/cash-flow`,
    component: lazy(() =>
      import(
        'containers/FinancialStatements/CashFlowStatement/CashFlowStatement'
      ),
    ),
    breadcrumb: formatMessage({ id: 'cash_flow_statement' }),
    hint: formatMessage({
      id: 'reports_inflow_and_outflow_of_cash_and_cash_equivalents',
    }),
    pageTitle: formatMessage({ id: 'cash_flow_statement' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/financial-reports/inventory-item-details`,
    component: lazy(() =>
      import(
        'containers/FinancialStatements/InventoryItemDetails/InventoryItemDetails'
      ),
    ),
    breadcrumb: formatMessage({ id: 'inventory_item_details' }),
    hint: formatMessage({
      id: 'reports_every_transaction_going_in_and_out_of_your_items',
    }),
    pageTitle: formatMessage({ id: 'inventory_item_details' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: '/financial-reports',
    component: lazy(() =>
      import('containers/FinancialStatements/FinancialReports'),
    ),
    breadcrumb: formatMessage({ id: 'financial_reports' }),
    pageTitle: formatMessage({ id: 'all_financial_reports' }),
  },
  // Exchange Rates
  {
    path: `/exchange-rates`,
    component: lazy(() => import('containers/ExchangeRates/ExchangeRatesList')),
    breadcrumb: formatMessage({ id: 'exchange_rates_list' }),
    pageTitle: formatMessage({ id: 'exchange_rates_list' }),
  },
  // Expenses.
  {
    path: `/expenses/new`,
    component: lazy(() =>
      import('containers/Expenses/ExpenseForm/ExpenseFormPage'),
    ),
    breadcrumb: formatMessage({ id: 'expenses' }),
    hotkey: 'ctrl+shift+x',
    pageTitle: formatMessage({ id: 'new_expense' }),
    sidebarExpand: false,
    backLink: true,
  },
  {
    path: `/expenses/:id/edit`,
    component: lazy(() =>
      import('containers/Expenses/ExpenseForm/ExpenseFormPage'),
    ),
    breadcrumb: formatMessage({ id: 'edit' }),
    pageTitle: formatMessage({ id: 'edit_expense' }),
    sidebarExpand: false,
    backLink: true,
  },
  {
    path: `/expenses`,
    component: lazy(() =>
      import('containers/Expenses/ExpensesLanding/ExpensesList'),
    ),
    breadcrumb: formatMessage({ id: 'expenses_list' }),
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
    breadcrumb: formatMessage({ id: 'edit_customer' }),
    pageTitle: formatMessage({ id: 'edit_customer' }),
    backLink: true,
  },
  {
    path: `/customers/new`,
    component: lazy(() =>
      import('containers/Customers/CustomerForm/CustomerFormPage'),
    ),
    name: 'customer-new',
    breadcrumb: formatMessage({ id: 'new_customer' }),
    hotkey: 'ctrl+shift+c',
    pageTitle: formatMessage({ id: 'new_customer' }),
    backLink: true,
  },
  {
    path: `/customers`,
    component: lazy(() =>
      import('containers/Customers/CustomersLanding/CustomersList'),
    ),
    breadcrumb: formatMessage({ id: 'customers' }),
    hotkey: 'shift+c',
    pageTitle: formatMessage({ id: 'customers_list' }),
  },
  {
    path: `/customers/contact_duplicate=/:id`,
    component: lazy(() =>
      import('containers/Customers/CustomerForm/CustomerFormPage'),
    ),
    name: 'duplicate-customer',
    breadcrumb: formatMessage({ id: 'duplicate_customer' }),
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
    breadcrumb: formatMessage({ id: 'edit_vendor' }),
    pageTitle: formatMessage({ id: 'edit_vendor' }),
    backLink: true,
  },
  {
    path: `/vendors/new`,
    component: lazy(() =>
      import('containers/Vendors/VendorForm/VendorFormPage'),
    ),
    name: 'vendor-new',
    breadcrumb: formatMessage({ id: 'new_vendor' }),
    hotkey: 'ctrl+shift+v',
    pageTitle: formatMessage({ id: 'new_vendor' }),
    backLink: true,
  },
  {
    path: `/vendors`,
    component: lazy(() =>
      import('containers/Vendors/VendorsLanding/VendorsList'),
    ),
    breadcrumb: formatMessage({ id: 'vendors' }),
    hotkey: 'shift+v',
    pageTitle: formatMessage({ id: 'vendors_list' }),
  },
  {
    path: `/vendors/contact_duplicate=/:id`,
    component: lazy(() =>
      import('containers/Vendors/VendorForm/VendorFormPage'),
    ),
    name: 'duplicate-vendor',
    breadcrumb: formatMessage({ id: 'duplicate_vendor' }),
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
    breadcrumb: formatMessage({ id: 'edit' }),
    pageTitle: formatMessage({ id: 'edit_estimate' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/invoices/new?from_estimate_id=/:id`,
    component: lazy(() =>
      import('containers/Sales/Estimates/EstimateForm/EstimateFormPage'),
    ),
    name: 'convert-to-invoice',
    breadcrumb: formatMessage({ id: 'new_estimate' }),
    pageTitle: formatMessage({ id: 'new_estimate' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/estimates/new`,
    component: lazy(() =>
      import('containers/Sales/Estimates/EstimateForm/EstimateFormPage'),
    ),
    name: 'estimate-new',
    breadcrumb: formatMessage({ id: 'new_estimate' }),
    hotkey: 'ctrl+shift+e',
    pageTitle: formatMessage({ id: 'new_estimate' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/estimates`,
    component: lazy(() =>
      import('containers/Sales/Estimates/EstimatesLanding/EstimatesList'),
    ),
    name: 'estimates-list',
    breadcrumb: formatMessage({ id: 'estimates_list' }),
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
    breadcrumb: formatMessage({ id: 'edit' }),
    pageTitle: formatMessage({ id: 'edit_invoice' }),
    sidebarExpand: false,
    backLink: true,
  },
  {
    path: `/invoices/new`,
    component: lazy(() =>
      import('containers/Sales/Invoices/InvoiceForm/InvoiceFormPage'),
    ),
    name: 'invoice-new',
    breadcrumb: formatMessage({ id: 'new_invoice' }),
    hotkey: 'ctrl+shift+i',
    pageTitle: formatMessage({ id: 'new_invoice' }),
    sidebarExpand: false,
    backLink: true,
  },
  {
    path: `/invoices`,
    component: lazy(() =>
      import('containers/Sales/Invoices/InvoicesLanding/InvoicesList'),
    ),
    breadcrumb: formatMessage({ id: 'invoices_list' }),
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
    breadcrumb: formatMessage({ id: 'edit' }),
    pageTitle: formatMessage({ id: 'edit_receipt' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/receipts/new`,
    component: lazy(() =>
      import('containers/Sales/Receipts/ReceiptForm/ReceiptFormPage'),
    ),
    name: 'receipt-new',
    breadcrumb: formatMessage({ id: 'new_receipt' }),
    hotkey: 'ctrl+shift+r',
    pageTitle: formatMessage({ id: 'new_receipt' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/receipts`,
    component: lazy(() =>
      import('containers/Sales/Receipts/ReceiptsLanding/ReceiptsList'),
    ),
    breadcrumb: formatMessage({ id: 'receipts_list' }),
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
    breadcrumb: formatMessage({ id: 'edit' }),
    pageTitle: formatMessage({ id: 'edit_payment_receive' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/payment-receives/new`,
    component: lazy(() =>
      import(
        'containers/Sales/PaymentReceives/PaymentReceiveForm/PaymentReceiveFormPage'
      ),
    ),
    name: 'payment-receive-new',
    breadcrumb: formatMessage({ id: 'new_payment_receive' }),
    pageTitle: formatMessage({ id: 'new_payment_receive' }),
    backLink: true,
    sidebarExpand: false,
  },
  {
    path: `/payment-receives`,
    component: lazy(() =>
      import(
        'containers/Sales/PaymentReceives/PaymentsLanding/PaymentReceivesList'
      ),
    ),
    breadcrumb: formatMessage({ id: 'payment_receives_list' }),
    pageTitle: formatMessage({ id: 'payment_receives_list' }),
  },

  // Bills
  {
    path: `/bills/:id/edit`,
    component: lazy(() =>
      import('containers/Purchases/Bills/BillForm/BillFormPage'),
    ),
    name: 'bill-edit',
    breadcrumb: formatMessage({ id: 'edit' }),
    pageTitle: formatMessage({ id: 'edit_bill' }),
    sidebarExpand: false,
    backLink: true,
  },
  {
    path: `/bills/new`,
    component: lazy(() =>
      import('containers/Purchases/Bills/BillForm/BillFormPage'),
    ),
    name: 'bill-new',
    breadcrumb: formatMessage({ id: 'new_bill' }),
    hotkey: 'ctrl+shift+b',
    pageTitle: formatMessage({ id: 'new_bill' }),
    sidebarExpand: false,
    backLink: true,
  },
  {
    path: `/bills`,
    component: lazy(() =>
      import('containers/Purchases/Bills/BillsLanding/BillsList'),
    ),
    breadcrumb: formatMessage({ id: 'bills_list' }),
    hotkey: 'shift+b',
    pageTitle: formatMessage({ id: 'bills_list' }),
  },

  // Subscription billing.
  {
    path: `/billing`,
    component: lazy(() => import('containers/Subscriptions/BillingForm')),
    breadcrumb: formatMessage({ id: 'new_billing' }),
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
    breadcrumb: formatMessage({ id: 'edit' }),
    pageTitle: formatMessage({ id: 'edit_payment_made' }),
    sidebarExpand: false,
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
    breadcrumb: formatMessage({ id: 'new_payment_made' }),
    pageTitle: formatMessage({ id: 'new_payment_made' }),
    sidebarExpand: false,
    backLink: true,
  },
  {
    path: `/payment-mades`,
    component: lazy(() =>
      import(
        'containers/Purchases/PaymentMades/PaymentsLanding/PaymentMadeList'
      ),
    ),
    breadcrumb: formatMessage({ id: 'payment_made_list' }),
    pageTitle: formatMessage({ id: 'payment_made_list' }),
  },
  // Homepage
  {
    path: `/`,
    component: lazy(() => import('containers/Homepage/Homepage')),
    breadcrumb: formatMessage({ id: 'homepage' }),
  },
];
