// @ts-nocheck
import { lazy } from 'react';
import intl from 'react-intl-universal';
import { RESOURCES_TYPES } from '@/constants/resourcesTypes';

const SUBSCRIPTION_TYPE = {
  MAIN: 'main',
};
// const BASE_URL = '/dashboard';

export const getDashboardRoutes = () => [
  // Accounts.
  {
    path: `/accounts`,
    component: lazy(() => import('@/containers/Accounts/AccountsChart')),
    breadcrumb: intl.get('accounts_chart'),
    hotkey: 'shift+a',
    pageTitle: intl.get('accounts_chart'),
    defaultSearchResource: RESOURCES_TYPES.ACCOUNT,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },

  // Accounting.
  {
    path: `/make-journal-entry`,
    component: lazy(
      () =>
        import('@/containers/Accounting/MakeJournal/MakeJournalEntriesPage'),
    ),
    breadcrumb: intl.get('make_journal_entry'),
    hotkey: 'ctrl+shift+m',
    pageTitle: intl.get('new_journal'),
    sidebarExpand: false,
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.MANUAL_JOURNAL,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/manual-journals/:id/edit`,
    component: lazy(
      () =>
        import('@/containers/Accounting/MakeJournal/MakeJournalEntriesPage'),
    ),
    breadcrumb: intl.get('edit'),
    pageTitle: intl.get('edit_journal'),
    sidebarExpand: false,
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.MANUAL_JOURNAL,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/manual-journals`,
    component: lazy(
      () =>
        import('@/containers/Accounting/JournalsLanding/ManualJournalsList'),
    ),
    breadcrumb: intl.get('manual_journals'),
    hotkey: 'shift+m',
    pageTitle: intl.get('manual_journals'),
    defaultSearchResource: RESOURCES_TYPES.MANUAL_JOURNAL,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/items/categories`,
    component: lazy(
      () => import('@/containers/ItemsCategories/ItemCategoriesList'),
    ),
    breadcrumb: intl.get('categories'),
    pageTitle: intl.get('category_list'),
    defaultSearchResource: RESOURCES_TYPES.ITEM,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },

  // Items.
  {
    path: `/items/:id/edit`,
    component: lazy(() => import('@/containers/Items/ItemFormPage')),
    name: 'item-edit',
    breadcrumb: intl.get('edit_item'),
    pageTitle: intl.get('edit_item'),
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.ITEM,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/items/new?duplicate=/:id`,
    component: lazy({
      loader: () => import('@/containers/Items/ItemFormPage'),
    }),
    breadcrumb: intl.get('duplicate_item'),
    defaultSearchResource: RESOURCES_TYPES.ITEM,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/items/new`,
    component: lazy(() => import('@/containers/Items/ItemFormPage')),
    name: 'item-new',
    breadcrumb: intl.get('new_item'),
    hotkey: 'ctrl+shift+w',
    pageTitle: intl.get('new_item'),
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.ITEM,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/items`,
    component: lazy(() => import('@/containers/Items/ItemsList')),
    breadcrumb: intl.get('items'),
    hotkey: 'shift+w',
    pageTitle: intl.get('items_list'),
    defaultSearchResource: RESOURCES_TYPES.ITEM,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },

  // Inventory adjustments.
  {
    path: `/inventory-adjustments`,
    component: lazy(
      () => import('@/containers/InventoryAdjustments/InventoryAdjustmentList'),
    ),
    breadcrumb: intl.get('inventory_adjustments'),
    pageTitle: intl.get('inventory_adjustment_list'),
    defaultSearchResource: RESOURCES_TYPES.ITEM,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },

  // Warehouse Transfer.
  {
    path: `/warehouses-transfers/:id/edit`,
    component: lazy(
      () =>
        import(
          '@/containers/WarehouseTransfers/WarehouseTransferForm/WarehouseTransferFormPage'
        ),
    ),
    name: 'warehouse-transfer-edit',
    pageTitle: intl.get('warehouse_transfer.label.edit_warehouse_transfer'),
    sidebarExpand: false,
    backLink: true,
  },
  {
    path: `/warehouses-transfers/new`,
    component: lazy(
      () =>
        import(
          '@/containers/WarehouseTransfers/WarehouseTransferForm/WarehouseTransferFormPage'
        ),
    ),
    name: 'warehouses-transfer-new',
    pageTitle: intl.get('warehouse_transfer.label.new_warehouse_transfer'),
    sidebarExpand: false,
    backLink: true,
  },
  {
    path: `/warehouses-transfers`,
    component: lazy(
      () =>
        import(
          '@/containers/WarehouseTransfers/WarehouseTransfersLanding/WarehouseTransfersList'
        ),
    ),
    pageTitle: intl.get('warehouse_transfer.label.warehouse_transfer_list'),
    // defaultSearchResource: RESOURCES_TYPES.ITEM,
    // subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },

  // Financial Reports.
  {
    path: `/financial-reports/general-ledger`,
    component: lazy(
      () =>
        import('@/containers/FinancialStatements/GeneralLedger/GeneralLedger'),
    ),
    breadcrumb: intl.get('general_ledger'),
    hint: intl.get('reports_every_transaction_going_in_and_out_of_your'),
    hotkey: 'shift+4',
    pageTitle: intl.get('general_ledger'),
    backLink: true,
    sidebarExpand: false,
    defaultSearchResource: RESOURCES_TYPES.INVENTORY_ADJUSTMENT,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/balance-sheet`,
    component: lazy(
      () =>
        import('@/containers/FinancialStatements/BalanceSheet/BalanceSheet'),
    ),
    breadcrumb: intl.get('balance_sheet'),
    hint: intl.get('reports_a_company_s_assets_liabilities_and_shareholders'),
    hotkey: 'shift+1',
    pageTitle: intl.get('balance_sheet'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/trial-balance-sheet`,
    component: lazy(
      () =>
        import(
          '@/containers/FinancialStatements/TrialBalanceSheet/TrialBalanceSheet'
        ),
    ),
    breadcrumb: intl.get('trial_balance_sheet'),
    hint: intl.get('summarizes_the_credit_and_debit_balance_of_each_account'),
    hotkey: 'shift+5',
    pageTitle: intl.get('trial_balance_sheet'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/profit-loss-sheet`,
    component: lazy(
      () =>
        import(
          '@/containers/FinancialStatements/ProfitLossSheet/ProfitLossSheet'
        ),
    ),
    breadcrumb: intl.get('profit_loss_sheet'),
    hint: intl.get('reports_the_revenues_costs_and_expenses'),
    hotkey: 'shift+2',
    pageTitle: intl.get('profit_loss_sheet'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: '/financial-reports/receivable-aging-summary',
    component: lazy(
      () =>
        import(
          '@/containers/FinancialStatements/ARAgingSummary/ARAgingSummary'
        ),
    ),
    breadcrumb: intl.get('receivable_aging_summary'),
    hint: intl.get('summarize_total_unpaid_balances_of_customers_invoices'),
    pageTitle: intl.get('receivable_aging_summary'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: '/financial-reports/payable-aging-summary',
    component: lazy(
      () =>
        import(
          '@/containers/FinancialStatements/APAgingSummary/APAgingSummary'
        ),
    ),
    breadcrumb: intl.get('payable_aging_summary'),
    hint: intl.get('summarize_total_unpaid_balances_of_vendors_purchase'),
    pageTitle: intl.get('payable_aging_summary'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/journal-sheet`,
    component: lazy(
      () => import('@/containers/FinancialStatements/Journal/Journal'),
    ),
    breadcrumb: intl.get('journal_sheet'),
    hint: intl.get('the_debit_and_credit_entries_of_system_transactions'),
    hotkey: 'shift+3',
    pageTitle: intl.get('journal_sheet'),
    sidebarExpand: false,
    backLink: true,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/purchases-by-items`,
    component: lazy(
      () =>
        import(
          '@/containers/FinancialStatements/PurchasesByItems/PurchasesByItems'
        ),
    ),
    breadcrumb: intl.get('purchases_by_items'),
    // hotkey: '',
    pageTitle: intl.get('purchases_by_items'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/sales-by-items`,
    component: lazy(
      () =>
        import('@/containers/FinancialStatements/SalesByItems/SalesByItems'),
    ),
    breadcrumb: intl.get('sales_by_items'),
    pageTitle: intl.get('sales_by_items'),
    hint: intl.get(
      'summarize_the_business_s_sold_items_quantity_income_and_average_income_rate',
    ),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/inventory-valuation`,
    component: lazy(
      () =>
        import(
          '@/containers/FinancialStatements/InventoryValuation/InventoryValuation'
        ),
    ),
    breadcrumb: intl.get('inventory_valuation'),
    hint: intl.get('summerize_your_transactions_for_each_inventory_item'),
    pageTitle: intl.get('inventory_valuation'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/customers-balance-summary`,
    component: lazy(
      () =>
        import(
          '@/containers/FinancialStatements/CustomersBalanceSummary/CustomersBalanceSummary'
        ),
    ),
    breadcrumb: intl.get('customers_balance_summary'),
    hint: intl.get('summerize_how_much_each_customer_owes_your_business'),
    pageTitle: intl.get('customers_balance_summary'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/vendors-balance-summary`,
    component: lazy(
      () =>
        import(
          '@/containers/FinancialStatements/VendorsBalanceSummary/VendorsBalanceSummary'
        ),
    ),
    breadcrumb: intl.get('vendors_balance_summary'),
    hint: intl.get('summerize_the_total_amount_your_business_owes_each_vendor'),
    pageTitle: intl.get('vendors_balance_summary'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/transactions-by-customers`,
    component: lazy(
      () =>
        import(
          '@/containers/FinancialStatements/CustomersTransactions/CustomersTransactions'
        ),
    ),
    breadcrumb: intl.get('customers_transactions'),
    hint: intl.get(
      'reports_every_transaction_going_in_and_out_of_each_customer',
    ),
    pageTitle: intl.get('customers_transactions'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/transactions-by-vendors`,
    component: lazy(
      () =>
        import(
          '@/containers/FinancialStatements/VendorsTransactions/VendorsTransactions'
        ),
    ),
    breadcrumb: intl.get('vendors_transactions'),
    hint: intl.get(
      'reports_every_transaction_going_in_and_out_of_each_vendor_supplier',
    ),
    pageTitle: intl.get('vendors_transactions'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/cash-flow`,
    component: lazy(
      () =>
        import(
          '@/containers/FinancialStatements/CashFlowStatement/CashFlowStatement'
        ),
    ),
    breadcrumb: intl.get('cash_flow_statement'),
    hint: intl.get('reports_inflow_and_outflow_of_cash_and_cash_equivalents'),
    pageTitle: intl.get('cash_flow_statement'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/inventory-item-details`,
    component: lazy(
      () =>
        import(
          '@/containers/FinancialStatements/InventoryItemDetails/InventoryItemDetails'
        ),
    ),
    breadcrumb: intl.get('inventory_item_details'),
    hint: intl.get('reports_every_transaction_going_in_and_out_of_your_items'),
    pageTitle: intl.get('inventory_item_details'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/realized-gain-loss`,
    component: lazy(
      () =>
        import(
          '@/containers/FinancialStatements/RealizedGainOrLoss/RealizedGainOrLoss'
        ),
    ),
    breadcrumb: intl.get('realized_gain_or_loss.label'),
    pageTitle: intl.get('realized_gain_or_loss.label'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/unrealized-gain-loss`,
    component: lazy(
      () =>
        import(
          '@/containers/FinancialStatements/UnrealizedGainOrLoss/UnrealizedGainOrLoss'
        ),
    ),
    breadcrumb: intl.get('unrealized_gain_or_loss.label'),
    pageTitle: intl.get('unrealized_gain_or_loss.label'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/financial-reports/project-profitability-summary`,
    component: lazy(
      () =>
        import('@/containers/FinancialStatements/ProjectProfitabilitySummary/ProjectProfitabilitySummary'),
    ),
    breadcrumb: intl.get('project_profitability_summary'),
    pageTitle: intl.get('project_profitability_summary'),
    backLink: true,
    sidebarExpand: false,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: '/financial-reports',
    component: lazy(
      () => import('@/containers/FinancialStatements/FinancialReports'),
    ),
    breadcrumb: intl.get('financial_reports'),
    pageTitle: intl.get('all_financial_reports'),
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  // Exchange Rates
  // {
  //   path: `/exchange-rates`,
  //   component: lazy(
  //     () => import('@/containers/ExchangeRates/ExchangeRatesList'),
  //   ),
  //   breadcrumb: intl.get('exchange_rates_list'),
  //   pageTitle: intl.get('exchange_rates_list'),
  //   subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  // },
  // Expenses.
  {
    path: `/expenses/new`,
    component: lazy(
      () => import('@/containers/Expenses/ExpenseForm/ExpenseFormPage'),
    ),
    breadcrumb: intl.get('expenses'),
    hotkey: 'ctrl+shift+x',
    pageTitle: intl.get('new_expense'),
    sidebarExpand: false,
    backLink: true,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/expenses/:id/edit`,
    component: lazy(
      () => import('@/containers/Expenses/ExpenseForm/ExpenseFormPage'),
    ),
    breadcrumb: intl.get('edit'),
    pageTitle: intl.get('edit_expense'),
    sidebarExpand: false,
    backLink: true,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/expenses`,
    component: lazy(
      () => import('@/containers/Expenses/ExpensesLanding/ExpensesList'),
    ),
    breadcrumb: intl.get('expenses_list'),
    pageTitle: intl.get('expenses_list'),
    hotkey: 'shift+x',
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },

  // Customers
  {
    path: `/customers/:id/edit`,
    component: lazy(
      () => import('@/containers/Customers/CustomerForm/CustomerFormPage'),
    ),
    name: 'customer-edit',
    breadcrumb: intl.get('edit_customer'),
    pageTitle: intl.get('edit_customer'),
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.CUSTOMER,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/customers/new`,
    component: lazy(
      () => import('@/containers/Customers/CustomerForm/CustomerFormPage'),
    ),
    name: 'customer-new',
    breadcrumb: intl.get('new_customer'),
    hotkey: 'ctrl+shift+c',
    pageTitle: intl.get('new_customer'),
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.CUSTOMER,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/customers`,
    component: lazy(
      () => import('@/containers/Customers/CustomersLanding/CustomersList'),
    ),
    breadcrumb: intl.get('customers'),
    hotkey: 'shift+c',
    pageTitle: intl.get('customers_list'),
    defaultSearchResource: RESOURCES_TYPES.CUSTOMER,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/customers/contact_duplicate=/:id`,
    component: lazy(
      () => import('@/containers/Customers/CustomerForm/CustomerFormPage'),
    ),
    name: 'duplicate-customer',
    breadcrumb: intl.get('duplicate_customer'),
    pageTitle: intl.get('new_customer'),
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.CUSTOMER,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },

  // Vendors
  {
    path: `/vendors/:id/edit`,
    component: lazy(
      () => import('@/containers/Vendors/VendorForm/VendorFormPage'),
    ),
    name: 'vendor-edit',
    breadcrumb: intl.get('edit_vendor'),
    pageTitle: intl.get('edit_vendor'),
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.VENDOR,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/vendors/new`,
    component: lazy(
      () => import('@/containers/Vendors/VendorForm/VendorFormPage'),
    ),
    name: 'vendor-new',
    breadcrumb: intl.get('new_vendor'),
    hotkey: 'ctrl+shift+v',
    pageTitle: intl.get('new_vendor'),
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.VENDOR,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/vendors`,
    component: lazy(
      () => import('@/containers/Vendors/VendorsLanding/VendorsList'),
    ),
    breadcrumb: intl.get('vendors'),
    hotkey: 'shift+v',
    pageTitle: intl.get('vendors_list'),
    defaultSearchResource: RESOURCES_TYPES.VENDOR,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/vendors/contact_duplicate=/:id`,
    component: lazy(
      () => import('@/containers/Vendors/VendorForm/VendorFormPage'),
    ),
    name: 'duplicate-vendor',
    breadcrumb: intl.get('duplicate_vendor'),
    pageTitle: intl.get('new_vendor'),
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.VENDOR,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },

  // Estimates
  {
    path: `/estimates/:id/edit`,
    component: lazy(
      () =>
        import('@/containers/Sales/Estimates/EstimateForm/EstimateFormPage'),
    ),
    name: 'estimate-edit',
    breadcrumb: intl.get('edit'),
    pageTitle: intl.get('edit_estimate'),
    backLink: true,
    sidebarExpand: false,
    defaultSearchResource: RESOURCES_TYPES.ESTIMATE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/invoices/new?from_estimate_id=/:id`,
    component: lazy(
      () =>
        import('@/containers/Sales/Estimates/EstimateForm/EstimateFormPage'),
    ),
    name: 'convert-to-invoice',
    breadcrumb: intl.get('new_estimate'),
    pageTitle: intl.get('new_estimate'),
    backLink: true,
    sidebarExpand: false,
    defaultSearchResource: RESOURCES_TYPES.INVOICE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/estimates/new`,
    component: lazy(
      () =>
        import('@/containers/Sales/Estimates/EstimateForm/EstimateFormPage'),
    ),
    name: 'estimate-new',
    breadcrumb: intl.get('new_estimate'),
    hotkey: 'ctrl+shift+e',
    pageTitle: intl.get('new_estimate'),
    backLink: true,
    sidebarExpand: false,
    defaultSearchResource: RESOURCES_TYPES.ESTIMATE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/estimates`,
    component: lazy(
      () =>
        import('@/containers/Sales/Estimates/EstimatesLanding/EstimatesList'),
    ),
    name: 'estimates-list',
    breadcrumb: intl.get('estimates_list'),
    hotkey: 'shift+e',
    pageTitle: intl.get('estimates_list'),
    defaultSearchResource: RESOURCES_TYPES.ESTIMATE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },

  // Invoices.
  {
    path: `/invoices/:id/edit`,
    component: lazy(
      () => import('@/containers/Sales/Invoices/InvoiceForm/InvoiceFormPage'),
    ),
    name: 'invoice-edit',
    breadcrumb: intl.get('edit'),
    pageTitle: intl.get('edit_invoice'),
    sidebarExpand: false,
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.INVOICE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/invoices/new`,
    component: lazy(
      () => import('@/containers/Sales/Invoices/InvoiceForm/InvoiceFormPage'),
    ),
    name: 'invoice-new',
    breadcrumb: intl.get('new_invoice'),
    hotkey: 'ctrl+shift+i',
    pageTitle: intl.get('new_invoice'),
    sidebarExpand: false,
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.INVOICE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/invoices`,
    component: lazy(
      () => import('@/containers/Sales/Invoices/InvoicesLanding/InvoicesList'),
    ),
    breadcrumb: intl.get('invoices_list'),
    hotkey: 'shift+i',
    pageTitle: intl.get('invoices_list'),
    defaultSearchResource: RESOURCES_TYPES.INVOICE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },

  // Sales Receipts.
  {
    path: `/receipts/:id/edit`,
    component: lazy(
      () => import('@/containers/Sales/Receipts/ReceiptForm/ReceiptFormPage'),
    ),
    name: 'receipt-edit',
    breadcrumb: intl.get('edit'),
    pageTitle: intl.get('edit_receipt'),
    backLink: true,
    sidebarExpand: false,
    defaultSearchResource: RESOURCES_TYPES.RECEIPT,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/receipts/new`,
    component: lazy(
      () => import('@/containers/Sales/Receipts/ReceiptForm/ReceiptFormPage'),
    ),
    name: 'receipt-new',
    breadcrumb: intl.get('new_receipt'),
    hotkey: 'ctrl+shift+r',
    pageTitle: intl.get('new_receipt'),
    backLink: true,
    sidebarExpand: false,
    defaultSearchResource: RESOURCES_TYPES.RECEIPT,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/receipts`,
    component: lazy(
      () => import('@/containers/Sales/Receipts/ReceiptsLanding/ReceiptsList'),
    ),
    breadcrumb: intl.get('receipts_list'),
    hotkey: 'shift+r',
    pageTitle: intl.get('receipts_list'),
    defaultSearchResource: RESOURCES_TYPES.RECEIPT,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },

  // Sales Credit notes.
  {
    path: `/credit-notes/:id/edit`,
    component: lazy(
      () =>
        import(
          '@/containers/Sales/CreditNotes/CreditNoteForm/CreditNoteFormPage'
        ),
    ),
    name: 'credit-note-edit',
    breadcrumb: intl.get('edit'),
    pageTitle: intl.get('credit_note.label.edit_credit_note'),
    backLink: true,
    sidebarExpand: false,
    defaultSearchResource: RESOURCES_TYPES.CREDIT_NOTE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/credit-notes/new/?from_invoice_id=/:id`,
    component: lazy(
      () =>
        import(
          '@/containers/Sales/CreditNotes/CreditNoteForm/CreditNoteFormPage'
        ),
    ),
    name: 'credit-note-new',
    breadcrumb: intl.get('credit_note.label.new_credit_note'),
    backLink: true,
    sidebarExpand: false,
    pageTitle: intl.get('credit_note.label.new_credit_note'),
    defaultSearchResource: RESOURCES_TYPES.CREDIT_NOTE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: '/credit-notes/new',
    component: lazy(
      () =>
        import(
          '@/containers/Sales/CreditNotes/CreditNoteForm/CreditNoteFormPage'
        ),
    ),
    name: 'credit-note-new',
    breadcrumb: intl.get('credit_note.label.new_credit_note'),
    backLink: true,
    sidebarExpand: false,
    pageTitle: intl.get('credit_note.label.new_credit_note'),
    defaultSearchResource: RESOURCES_TYPES.CREDIT_NOTE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: '/credit-notes',
    component: lazy(
      () =>
        import(
          '@/containers/Sales/CreditNotes/CreditNotesLanding/CreditNotesList'
        ),
    ),
    breadcrumb: intl.get('credit_note.label_create_note_list'),
    pageTitle: intl.get('credit_note.label_create_note_list'),
    defaultSearchResource: RESOURCES_TYPES.CREDIT_NOTE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },

  // Payment receives
  {
    path: `/payment-receives/:id/edit`,
    component: lazy(
      () =>
        import(
          '@/containers/Sales/PaymentReceives/PaymentReceiveForm/PaymentReceiveFormPage'
        ),
    ),
    name: 'payment-receive-edit',
    breadcrumb: intl.get('edit'),
    pageTitle: intl.get('edit_payment_receive'),
    backLink: true,
    sidebarExpand: false,
    defaultSearchResource: RESOURCES_TYPES.PAYMENT_RECEIVE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/payment-receives/new`,
    component: lazy(
      () =>
        import(
          '@/containers/Sales/PaymentReceives/PaymentReceiveForm/PaymentReceiveFormPage'
        ),
    ),
    name: 'payment-receive-new',
    breadcrumb: intl.get('new_payment_receive'),
    pageTitle: intl.get('new_payment_receive'),
    backLink: true,
    sidebarExpand: false,
    defaultSearchResource: RESOURCES_TYPES.PAYMENT_RECEIVE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/payment-receives`,
    component: lazy(
      () =>
        import(
          '@/containers/Sales/PaymentReceives/PaymentsLanding/PaymentReceivesList'
        ),
    ),
    breadcrumb: intl.get('payment_receives_list'),
    pageTitle: intl.get('payment_receives_list'),
    defaultSearchResource: RESOURCES_TYPES.PAYMENT_RECEIVE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },

  // Bills
  {
    path: `/bills/:id/edit`,
    component: lazy(
      () => import('@/containers/Purchases/Bills/BillForm/BillFormPage'),
    ),
    name: 'bill-edit',
    breadcrumb: intl.get('edit'),
    pageTitle: intl.get('edit_bill'),
    sidebarExpand: false,
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.BILL,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/bills/new`,
    component: lazy(
      () => import('@/containers/Purchases/Bills/BillForm/BillFormPage'),
    ),
    name: 'bill-new',
    breadcrumb: intl.get('new_bill'),
    hotkey: 'ctrl+shift+b',
    pageTitle: intl.get('new_bill'),
    sidebarExpand: false,
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.BILL,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/bills`,
    component: lazy(
      () => import('@/containers/Purchases/Bills/BillsLanding/BillsList'),
    ),
    breadcrumb: intl.get('bills_list'),
    hotkey: 'shift+b',
    pageTitle: intl.get('bills_list'),
    defaultSearchResource: RESOURCES_TYPES.BILL,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  //  Purchases Credit note.
  {
    path: `/vendor-credits/:id/edit`,
    component: lazy(
      () =>
        import(
          '@/containers/Purchases/CreditNotes/CreditNoteForm/VendorCreditNoteFormPage'
        ),
    ),
    name: 'vendor-credits-edit',
    breadcrumb: intl.get('edit'),
    pageTitle: intl.get('vendor_credits.label.edit_vendor_credit'),
    backLink: true,
    sidebarExpand: false,
    defaultSearchResource: RESOURCES_TYPES.VENDOR_CREDIT,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: '/vendor-credits/new/?from_bill_id=/:id',
    component: lazy(
      () =>
        import(
          '@/containers/Purchases/CreditNotes/CreditNoteForm/VendorCreditNoteFormPage'
        ),
    ),
    name: 'vendor-credits-new',
    backLink: true,
    sidebarExpand: false,
    breadcrumb: intl.get('vendor_credits.label.new_vendor_credit'),
    pageTitle: intl.get('vendor_credits.label.new_vendor_credit'),
    defaultSearchResource: RESOURCES_TYPES.VENDOR_CREDIT,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: '/vendor-credits/new',
    component: lazy(
      () =>
        import(
          '@/containers/Purchases/CreditNotes/CreditNoteForm/VendorCreditNoteFormPage'
        ),
    ),
    name: 'vendor-credits-new',
    backLink: true,
    sidebarExpand: false,
    breadcrumb: intl.get('vendor_credits.label.new_vendor_credit'),
    pageTitle: intl.get('vendor_credits.label.new_vendor_credit'),
    defaultSearchResource: RESOURCES_TYPES.VENDOR_CREDIT,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: '/vendor-credits',
    component: lazy(
      () =>
        import(
          '@/containers/Purchases/CreditNotes/CreditNotesLanding/VendorsCreditNotesList'
        ),
    ),
    breadcrumb: intl.get('vendor_credits.label_vendor_credit_list'),
    pageTitle: intl.get('vendor_credits.label_vendor_credit_list'),
    defaultSearchResource: RESOURCES_TYPES.VENDOR_CREDIT,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },

  // Subscription billing.
  {
    path: `/billing`,
    component: lazy(() => import('@/containers/Subscriptions/BillingForm')),
    breadcrumb: intl.get('new_billing'),
    subscriptionInactive: [SUBSCRIPTION_TYPE.MAIN],
  },
  // Payment modes.
  {
    path: `/payment-mades/:id/edit`,
    component: lazy(
      () =>
        import(
          '@/containers/Purchases/PaymentMades/PaymentForm/PaymentMadeFormPage'
        ),
    ),
    name: 'payment-made-edit',
    breadcrumb: intl.get('edit'),
    pageTitle: intl.get('edit_payment_made'),
    sidebarExpand: false,
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.PAYMENT_MADE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/payment-mades/new`,
    component: lazy(
      () =>
        import(
          '@/containers/Purchases/PaymentMades/PaymentForm/PaymentMadeFormPage'
        ),
    ),
    name: 'payment-made-new',
    breadcrumb: intl.get('new_payment_made'),
    pageTitle: intl.get('new_payment_made'),
    sidebarExpand: false,
    backLink: true,
    defaultSearchResource: RESOURCES_TYPES.PAYMENT_MADE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  {
    path: `/payment-mades`,
    component: lazy(
      () =>
        import(
          '@/containers/Purchases/PaymentMades/PaymentsLanding/PaymentMadeList'
        ),
    ),
    breadcrumb: intl.get('payment_made_list'),
    pageTitle: intl.get('payment_made_list'),
    defaultSearchResource: RESOURCES_TYPES.PAYMENT_MADE,
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
  // Cash flow
  {
    path: `/cashflow-accounts/:id/transactions`,
    component: lazy(
      () =>
        import(
          '@/containers/CashFlow/AccountTransactions/AccountTransactionsList'
        ),
    ),
    sidebarExpand: false,
    backLink: true,
    pageTitle: intl.get('cash_flow.label_account_transcations'),
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
    defaultSearchResource: RESOURCES_TYPES.ACCOUNT,
  },
  {
    path: `/cashflow-accounts`,
    component: lazy(
      () =>
        import('@/containers/CashFlow/CashFlowAccounts/CashFlowAccountsList'),
    ),
    pageTitle: intl.get('siebar.cashflow.label_cash_and_bank_accounts'),
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
    defaultSearchResource: RESOURCES_TYPES.ACCOUNT,
  },
  {
    path: `/transactions-locking`,
    component: lazy(
      () => import('@/containers/TransactionsLocking/TransactionsLockingPage'),
    ),
    pageTitle: intl.get('sidebar.transactions_locking'),
  },
  {
    path: '/projects/:id/details',
    component: lazy(
      () => import('@/containers/Projects/containers/ProjectDetails'),
    ),
    sidebarExpand: false,
    backLink: true,
  },
  {
    path: '/projects',
    component: lazy(
      () =>
        import('@/containers/Projects/containers/ProjectsLanding/ProjectsList'),
    ),
    pageTitle: intl.get('sidebar.projects'),
  },
  // Homepage
  {
    path: `/`,
    component: lazy(() => import('@/containers/Homepage/Homepage')),
    breadcrumb: intl.get('homepage'),
    subscriptionActive: [SUBSCRIPTION_TYPE.MAIN],
  },
];
