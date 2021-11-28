import React from 'react';
import { FormattedMessage as T } from 'components';
import {
  ReportsAction,
  AbilitySubject,
  ItemAction,
  InventoryAdjustmentAction,
  SaleEstimateAction,
  SaleInvoiceAction,
  SaleReceiptAction,
  PaymentReceiveAction,
  BillAction,
  PaymentMadeAction,
  CustomerAction,
  VendorAction,
  AccountAction,
  ManualJournalAction,
  ExpenseAction,
  CashflowAction,
  PreferencesAbility,
  ExchangeRateAbility,
  SubscriptionBillingAbility,
} from '../common/abilityOption';

export default [
  {
    text: <T id={'homepage'} />,
    disabled: false,
    href: '/',
    matchExact: true,
  },
  {
    text: <T id={'sales_inventory'} />,
    label: true,
    permission: [
      {
        subject: AbilitySubject.Item,
        ability: ItemAction.View,
      },
      {
        subject: AbilitySubject.InventoryAdjustment,
        ability: InventoryAdjustmentAction.View,
      },
      {
        subject: AbilitySubject.Estimate,
        ability: SaleEstimateAction.View,
      },
      {
        subject: AbilitySubject.Invoice,
        ability: SaleInvoiceAction.View,
      },
      {
        subject: AbilitySubject.Receipt,
        ability: SaleReceiptAction.View,
      },
      {
        subject: AbilitySubject.PaymentReceive,
        ability: PaymentReceiveAction.View,
      },
    ],
  },
  {
    text: <T id={'items'} />,
    children: [
      {
        text: <T id={'items'} />,
        href: '/items',
        permission: {
          subject: AbilitySubject.Item,
          ability: ItemAction.View,
        },
      },
      {
        text: <T id={'inventory_adjustments'} />,
        href: '/inventory-adjustments',
        permission: {
          subject: AbilitySubject.InventoryAdjustment,
          ability: InventoryAdjustmentAction.View,
        },
      },
      {
        text: <T id={'category_list'} />,
        href: '/items/categories',
        permission: {
          subject: AbilitySubject.Item,
          ability: ItemAction.View,
        },
      },
      {
        text: <T id={'New tasks'} />,
        label: true,
        permission: [
          {
            subject: AbilitySubject.Item,
            ability: ItemAction.Create,
          },
        ],
      },
      {
        divider: true,
        permission: [
          {
            subject: AbilitySubject.Item,
            ability: ItemAction.Create,
          },
        ],
      },
      {
        text: <T id={'New inventory item'} />,
        href: '/items/new',
        permission: {
          subject: AbilitySubject.Item,
          ability: ItemAction.Create,
        },
      },
      {
        text: <T id={'New service'} />,
        href: '/items/new',
        permission: {
          subject: AbilitySubject.Item,
          ability: ItemAction.Create,
        },
      },
      {
        text: <T id={'New item category'} />,
        href: '/items/categories/new',
        permission: {
          subject: AbilitySubject.Item,
          ability: ItemAction.Create,
        },
      },
    ],
  },
  {
    text: <T id={'sales'} />,
    children: [
      {
        text: <T id={'estimates'} />,
        href: '/estimates',
        permission: {
          subject: AbilitySubject.Estimate,
          ability: SaleEstimateAction.View,
        },
      },
      {
        text: <T id={'invoices'} />,
        href: '/invoices',
        permission: {
          subject: AbilitySubject.Invoice,
          ability: SaleInvoiceAction.View,
        },
      },
      {
        text: <T id={'receipts'} />,
        href: '/receipts',
        permission: {
          subject: AbilitySubject.Receipt,
          ability: SaleReceiptAction.View,
        },
      },
      {
        text: <T id={'payment_receives'} />,
        href: '/payment-receives',
        permission: {
          subject: AbilitySubject.PaymentReceive,
          ability: PaymentReceiveAction.View,
        },
      },
      {
        text: <T id={'New tasks'} />,
        label: true,
        permission: [
          {
            subject: AbilitySubject.Estimate,
            ability: SaleEstimateAction.Create,
          },
          {
            subject: AbilitySubject.Invoice,
            ability: SaleInvoiceAction.Create,
          },
          {
            subject: AbilitySubject.Receipt,
            ability: SaleReceiptAction.Create,
          },
          {
            subject: AbilitySubject.PaymentReceive,
            ability: PaymentReceiveAction.Create,
          },
        ],
      },
      {
        divider: true,
        permission: [
          {
            subject: AbilitySubject.Estimate,
            ability: SaleEstimateAction.Create,
          },
          {
            subject: AbilitySubject.Invoice,
            ability: SaleInvoiceAction.Create,
          },
          {
            subject: AbilitySubject.Receipt,
            ability: SaleReceiptAction.Create,
          },
          {
            subject: AbilitySubject.PaymentReceive,
            ability: PaymentReceiveAction.Create,
          },
        ],
      },
      {
        text: <T id={'new_estimate'} />,
        href: '/estimates/new',
        permission: {
          subject: AbilitySubject.Estimate,
          ability: SaleEstimateAction.Create,
        },
      },
      {
        text: <T id={'new_invoice'} />,
        href: '/invoices/new',
        permission: {
          subject: AbilitySubject.Invoice,
          ability: SaleInvoiceAction.Create,
        },
      },
      {
        text: <T id={'new_receipt'} />,
        href: '/receipts/new',
        permission: {
          subject: AbilitySubject.Receipt,
          ability: SaleReceiptAction.Create,
        },
      },
      {
        text: <T id={'new_payment_receive'} />,
        href: '/payment-receives/new',
        permission: {
          subject: AbilitySubject.PaymentReceive,
          ability: PaymentReceiveAction.Create,
        },
      },
    ],
  },
  {
    text: <T id={'purchases'} />,
    children: [
      {
        text: <T id={'bills'} />,
        href: '/bills',
        permission: {
          subject: AbilitySubject.Bill,
          ability: BillAction.View,
        },
      },
      {
        text: <T id={'payment_mades'} />,
        href: '/payment-mades',
        newTabHref: '/payment-mades/new',
        permission: {
          subject: AbilitySubject.PaymentMade,
          ability: PaymentMadeAction.View,
        },
      },
      {
        text: <T id={'New tasks'} />,
        label: true,
        permission: [
          {
            subject: AbilitySubject.Bill,
            ability: BillAction.Create,
          },
          {
            subject: AbilitySubject.PaymentMade,
            ability: PaymentMadeAction.Create,
          },
        ],
      },
      {
        divider: true,
        permission: [
          {
            subject: AbilitySubject.Bill,
            ability: BillAction.Create,
          },
          {
            subject: AbilitySubject.PaymentMade,
            ability: PaymentMadeAction.Create,
          },
        ],
      },
      {
        text: <T id={'New purchase invoice'} />,
        href: '/bills/new',
        permission: {
          subject: AbilitySubject.Bill,
          ability: BillAction.Create,
        },
      },
      {
        text: <T id={'new_payment_made'} />,
        href: '/payment-mades/new',
        permission: {
          subject: AbilitySubject.PaymentMade,
          ability: PaymentMadeAction.Create,
        },
      },
    ],
  },
  {
    text: <T id={'contacts'} />,
    children: [
      {
        text: <T id={'customers'} />,
        href: '/customers',
        permission: {
          subject: AbilitySubject.Customer,
          ability: CustomerAction.View,
        },
      },
      {
        text: <T id={'vendors'} />,
        href: '/vendors',
        permission: {
          subject: AbilitySubject.Vendor,
          ability: VendorAction.Create,
        },
      },
      {
        text: <T id={'New tasks'} />,
        label: true,
        permission: [
          {
            subject: AbilitySubject.Customer,
            ability: CustomerAction.View,
          },
          {
            subject: AbilitySubject.Vendor,
            ability: VendorAction.View,
          },
        ],
      },
      {
        divider: true,
        permission: [
          {
            subject: AbilitySubject.Customer,
            ability: CustomerAction.View,
          },
          {
            subject: AbilitySubject.Vendor,
            ability: VendorAction.View,
          },
        ],
      },
      {
        text: <T id={'new_customer'} />,
        href: '/customers/new',
        permission: {
          subject: AbilitySubject.Customer,
          ability: CustomerAction.View,
        },
      },
      {
        text: <T id={'new_vendor'} />,
        href: '/vendors/new',
        permission: {
          subject: AbilitySubject.Vendor,
          ability: VendorAction.View,
        },
      },
    ],
  },
  {
    text: <T id={'accounting'} />,
    label: true,
    permission: [
      {
        subject: AbilitySubject.Account,
        ability: AccountAction.View,
      },
      {
        subject: AbilitySubject.ManualJournal,
        ability: ManualJournalAction.View,
      },
    ],
  },
  {
    text: <T id={'financial'} />,
    children: [
      {
        text: <T id={'accounts_chart'} />,
        href: '/accounts',
        permission: {
          subject: AbilitySubject.Account,
          ability: AccountAction.View,
        },
      },
      {
        text: <T id={'manual_journals'} />,
        href: '/manual-journals',
        permission: {
          subject: AbilitySubject.ManualJournal,
          ability: ManualJournalAction.View,
        },
      },
      {
        text: <T id={'sidebar.transactions_locaking'} />,
        href: '/transactions-locking',
        permission: {
          subject: AbilitySubject.ManualJournal,
          ability: ManualJournalAction.TransactionLocking,
        },
      },
      {
        text: <T id={'exchange_rate'} />,
        href: '/exchange-rates',
        permission: {
          subject: AbilitySubject.ExchangeRate,
          ability: ExchangeRateAbility.View,
        },
      },
      {
        text: <T id={'New tasks'} />,
        label: true,
        permission: {
          subject: AbilitySubject.ManualJournal,
          ability: ManualJournalAction.Create,
        },
      },
      {
        divider: true,
        permission: {
          subject: AbilitySubject.ManualJournal,
          ability: ManualJournalAction.Create,
        },
      },
      {
        text: <T id={'make_journal_entry'} />,
        href: '/make-journal-entry',
        permission: {
          subject: AbilitySubject.ManualJournal,
          ability: ManualJournalAction.Create,
        },
      },
    ],
  },
  {
    text: <T id={'siebar.cashflow'} />,
    children: [
      {
        text: <T id={'siebar.cashflow.label_cash_and_bank_accounts'} />,
        href: '/cashflow-accounts',
        permission: {
          subject: AbilitySubject.Cashflow,
          ability: CashflowAction.View,
        },
      },
      {
        text: <T id={'New tasks'} />,
        label: true,
        permission: [
          {
            subject: AbilitySubject.Cashflow,
            ability: CashflowAction.Create,
          },
        ],
      },
      {
        divider: true,
        permission: [
          {
            subject: AbilitySubject.Cashflow,
            ability: CashflowAction.Create,
          },
        ],
      },
      {
        text: <T id={'cash_flow.label.add_money_in'} />,
        href: '/cashflow-accounts',
        permission: {
          subject: AbilitySubject.Cashflow,
          ability: CashflowAction.Create,
        },
      },
      {
        text: <T id={'cash_flow.label.add_money_out'} />,
        href: '/cashflow-accounts',
        permission: {
          subject: AbilitySubject.Cashflow,
          ability: CashflowAction.Create,
        },
      },
      {
        text: <T id={'cash_flow.label.add_cash_account'} />,
        href: '/cashflow-accounts',
        permission: {
          subject: AbilitySubject.Cashflow,
          ability: CashflowAction.Create,
        },
      },
      {
        text: <T id={'cash_flow.label.add_bank_account'} />,
        href: '/cashflow-accounts',
        permission: {
          subject: AbilitySubject.Cashflow,
          ability: CashflowAction.Create,
        },
      },
    ],
  },
  {
    text: <T id={'expenses'} />,
    children: [
      {
        text: <T id={'expenses'} />,
        href: '/expenses',
        permission: {
          subject: AbilitySubject.Expense,
          ability: ExpenseAction.View,
        },
      },
      {
        text: <T id={'New tasks'} />,
        label: true,
        permission: {
          subject: AbilitySubject.Expense,
          ability: ExpenseAction.Create,
        },
      },
      {
        divider: true,
        permission: {
          subject: AbilitySubject.Expense,
          ability: ExpenseAction.Create,
        },
      },
      {
        text: <T id={'new_expense'} />,
        href: '/expenses/new',
        permission: {
          subject: AbilitySubject.Expense,
          ability: ExpenseAction.Create,
        },
      },
    ],
  },
  {
    text: <T id={'Reports'} />,
    children: [
      {
        text: <T id={'balance_sheet'} />,
        href: '/financial-reports/balance-sheet',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_BALANCE_SHEET,
        },
      },
      {
        text: <T id={'trial_balance_sheet'} />,
        href: '/financial-reports/trial-balance-sheet',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_TRIAL_BALANCE_SHEET,
        },
      },
      {
        text: <T id={'journal'} />,
        href: '/financial-reports/journal-sheet',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_JOURNAL,
        },
      },
      {
        text: <T id={'general_ledger'} />,
        href: '/financial-reports/general-ledger',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_GENERAL_LEDGET,
        },
      },
      {
        text: <T id={'profit_loss_sheet'} />,
        href: '/financial-reports/profit-loss-sheet',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_PROFIT_LOSS,
        },
      },
      {
        text: <T id={'cash_flow_statement'} />,
        href: '/financial-reports/cash-flow',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_CASHFLOW_ACCOUNT_TRANSACTION,
        },
      },
      {
        text: <T id={'AR_Aging_Summary'} />,
        href: '/financial-reports/receivable-aging-summary',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_AR_AGING_SUMMARY,
        },
      },
      {
        text: <T id={'AP_Aging_Summary'} />,
        href: '/financial-reports/payable-aging-summary',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_AP_AGING_SUMMARY,
        },
      },
      {
        text: <T id={'Sales/Purchases'} />,
        label: true,
        permission: [
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_PURCHASES_BY_ITEMS,
          },
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_SALES_BY_ITEMS,
          },
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_CUSTOMERS_TRANSACTIONS,
          },
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_VENDORS_TRANSACTIONS,
          },
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_CUSTOMERS_SUMMARY_BALANCE,
          },
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_VENDORS_SUMMARY_BALANCE,
          },
        ],
      },
      {
        divider: true,
        permission: [
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_PURCHASES_BY_ITEMS,
          },
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_SALES_BY_ITEMS,
          },
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_CUSTOMERS_TRANSACTIONS,
          },
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_VENDORS_TRANSACTIONS,
          },
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_CUSTOMERS_SUMMARY_BALANCE,
          },
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_VENDORS_SUMMARY_BALANCE,
          },
        ],
      },
      {
        text: <T id={'purchases_by_items'} />,
        href: '/financial-reports/purchases-by-items',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_PURCHASES_BY_ITEMS,
        },
      },
      {
        text: <T id={'sales_by_items'} />,
        href: '/financial-reports/sales-by-items',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_SALES_BY_ITEMS,
        },
      },
      {
        text: <T id={'customers_transactions'} />,
        href: '/financial-reports/transactions-by-customers',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_CUSTOMERS_TRANSACTIONS,
        },
      },
      {
        text: <T id={'vendors_transactions'} />,
        href: '/financial-reports/transactions-by-vendors',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_VENDORS_TRANSACTIONS,
        },
      },
      {
        text: <T id={'customers_balance_summary'} />,
        href: '/financial-reports/customers-balance-summary',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_CUSTOMERS_SUMMARY_BALANCE,
        },
      },
      {
        text: <T id={'vendors_balance_summary'} />,
        href: '/financial-reports/vendors-balance-summary',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_VENDORS_SUMMARY_BALANCE,
        },
      },
      {
        text: <T id={'inventory'} />,
        label: true,
        permission: [
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_INVENTORY_ITEM_DETAILS,
          },
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_INVENTORY_VALUATION_SUMMARY,
          },
        ],
      },
      {
        divider: true,
        permission: [
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_INVENTORY_ITEM_DETAILS,
          },
          {
            subject: AbilitySubject.Report,
            ability: ReportsAction.READ_INVENTORY_VALUATION_SUMMARY,
          },
        ],
      },
      {
        text: <T id={'inventory_item_details'} />,
        href: '/financial-reports/inventory-item-details',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_INVENTORY_ITEM_DETAILS,
        },
      },
      {
        text: <T id={'inventory_valuation'} />,
        href: '/financial-reports/inventory-valuation',
        permission: {
          subject: AbilitySubject.Report,
          ability: ReportsAction.READ_INVENTORY_VALUATION_SUMMARY,
        },
      },
    ],
  },
  {
    text: <T id={'system'} />,
    enableBilling: true,
    label: true,
    permission: [
      {
        subject: AbilitySubject.Preferences,
        ability: PreferencesAbility.Mutate,
      },
      {
        subject: AbilitySubject.SubscriptionBilling,
        ability: SubscriptionBillingAbility.View,
      },
    ],
  },
  {
    text: <T id={'preferences'} />,
    href: '/preferences',
    permission: {
      subject: AbilitySubject.Preferences,
      ability: PreferencesAbility.Mutate,
    },
  },
  {
    text: <T id={'billing'} />,
    href: '/billing',
    enableBilling: true,
    permission: {
      subject: AbilitySubject.SubscriptionBilling,
      ability: SubscriptionBillingAbility.View,
    },
  },
];
