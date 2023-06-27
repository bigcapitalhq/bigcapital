// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import { Features } from '@/constants/features';
import {
  ISidebarMenuItemType,
  ISidebarMenuOverlayIds,
} from '@/containers/Dashboard/Sidebar/interfaces';
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
} from '@/constants/abilityOption';

export const SidebarMenu = [
  // ---------------
  // # Homepage
  // ---------------
  {
    text: <T id={'sidebar.homepage'} />,
    type: ISidebarMenuItemType.Link,
    disabled: false,
    href: '/',
    matchExact: true,
  },
  // ---------------
  // # Sales & Inventory
  // ---------------
  {
    text: <T id={'sidebar.sales_inventory'} />,
    type: ISidebarMenuItemType.Group,
    children: [
      {
        text: <T id={'sidebar.items'} />,
        type: ISidebarMenuItemType.Overlay,
        overlayId: ISidebarMenuOverlayIds.Items,
        children: [
          {
            text: <T id={'sidebar.items'} />,
            type: ISidebarMenuItemType.Group,
            children: [
              {
                text: <T id={'sidebar.items'} />,
                href: '/items',
                type: ISidebarMenuItemType.Link,
                permission: {
                  subject: AbilitySubject.Item,
                  ability: ItemAction.View,
                },
              },
              {
                text: <T id={'sidebar.inventory_adjustments'} />,
                href: '/inventory-adjustments',
                type: ISidebarMenuItemType.Link,
                permission: {
                  subject: AbilitySubject.InventoryAdjustment,
                  ability: InventoryAdjustmentAction.View,
                },
              },
              {
                text: <T id={'category_list'} />,
                href: '/items/categories',
                type: ISidebarMenuItemType.Link,
                permission: {
                  subject: AbilitySubject.Item,
                  ability: ItemAction.View,
                },
              },
              {
                text: <T id={'sidebar.warehouse_transfer'} />,
                href: '/warehouses-transfers',
                type: ISidebarMenuItemType.Link,
                feature: Features.Warehouses,
              },
            ],
          },
          {
            text: <T id={'sidebar.new_tasks'} />,
            type: ISidebarMenuItemType.Group,
            children: [
              {
                text: <T id={'sidebar.new_inventory_item'} />,
                href: '/items/new',
                type: ISidebarMenuItemType.Link,
                permission: {
                  subject: AbilitySubject.Item,
                  ability: ItemAction.Create,
                },
              },
              {
                text: <T id={'sidebar.new_service'} />,
                href: '/items/new',
                type: ISidebarMenuItemType.Link,
                permission: {
                  subject: AbilitySubject.Item,
                  ability: ItemAction.Create,
                },
              },
              {
                text: <T id={'sidebar.new_item_category'} />,
                href: '/items/categories/new',
                type: ISidebarMenuItemType.Dialog,
                dialogName: 'item-category-form',
                permission: {
                  subject: AbilitySubject.Item,
                  ability: ItemAction.Create,
                },
              },
              {
                text: <T id={'sidebar.new_warehouse_transfer'} />,
                href: '/warehouses-transfers/new',
                type: ISidebarMenuItemType.Link,
                feature: Features.Warehouses,
              },
            ],
          },
        ],
      },
    ],
  },
  // ---------------
  // # Sales
  // ---------------
  {
    text: <T id={'sidebar.sales'} />,
    type: ISidebarMenuItemType.Overlay,
    overlayId: ISidebarMenuOverlayIds.Sales,
    children: [
      {
        text: <T id={'sidebar.sales'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'sidebar.estimates'} />,
            href: '/estimates',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Estimate,
              ability: SaleEstimateAction.View,
            },
          },
          {
            text: <T id={'sidebar.invoices'} />,
            href: '/invoices',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Invoice,
              ability: SaleInvoiceAction.View,
            },
          },
          {
            text: <T id={'sidebar.receipts'} />,
            href: '/receipts',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Receipt,
              ability: SaleReceiptAction.View,
            },
          },
          {
            text: <T id={'sidebar.credit_notes'} />,
            href: '/credit-notes',
            type: ISidebarMenuItemType.Link,
          },
          {
            text: <T id={'sidebar.payment_receives'} />,
            href: '/payment-receives',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.PaymentReceive,
              ability: PaymentReceiveAction.View,
            },
          },
        ],
      },
      {
        text: <T id={'sidebar.new_tasks'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'sidebar.new_estimate'} />,
            href: '/estimates/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Estimate,
              ability: SaleEstimateAction.Create,
            },
          },
          {
            text: <T id={'sidebar.new_invoice'} />,
            href: '/invoices/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Invoice,
              ability: SaleInvoiceAction.Create,
            },
          },
          {
            text: <T id={'sidebar.new_receipt'} />,
            href: '/receipts/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Receipt,
              ability: SaleReceiptAction.Create,
            },
          },
          {
            text: <T id={'sidebar.new_credit_note'} />,
            href: '/credit-notes/new',
            type: ISidebarMenuItemType.Link,
          },
          {
            text: <T id={'sidebar.new_payment_receive'} />,
            href: '/payment-receives/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.PaymentReceive,
              ability: PaymentReceiveAction.Create,
            },
          },
        ],
      },
    ],
  },
  // ---------------
  // # Purchases
  // ---------------
  {
    text: <T id={'sidebar.purchases'} />,
    type: ISidebarMenuItemType.Overlay,
    overlayId: ISidebarMenuOverlayIds.Purchases,
    children: [
      {
        text: <T id={'sidebar.purchases'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'bills'} />,
            href: '/bills',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Bill,
              ability: BillAction.View,
            },
          },
          {
            text: <T id={'sidebar_vendor_credits'} />,
            href: '/vendor-credits',
            type: ISidebarMenuItemType.Link,
          },
          {
            text: <T id={'payments_made'} />,
            href: '/payments-made',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.PaymentMade,
              ability: PaymentMadeAction.View,
            },
          },
        ],
      },
      {
        text: <T id={'sidebar.new_tasks'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'sidebar.new_purchase_invoice'} />,
            href: '/bills/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Bill,
              ability: BillAction.Create,
            },
          },
          {
            text: <T id={'sidebar.new_vendor_credit'} />,
            href: '/vendor-credits/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Bill,
              ability: BillAction.Create,
            },
          },
          {
            text: <T id={'sidebar.new_payment_made'} />,
            href: '/payments-made/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.PaymentMade,
              ability: PaymentMadeAction.Create,
            },
          },
        ],
      },
    ],
  },
  // ---------------
  // # Contacts
  // ---------------
  {
    text: <T id={'sidebar.contacts'} />,
    type: ISidebarMenuItemType.Overlay,
    overlayId: ISidebarMenuOverlayIds.Contacts,
    children: [
      {
        text: <T id={'sidebar.contacts'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'sidebar.customers'} />,
            href: '/customers',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Customer,
              ability: CustomerAction.View,
            },
          },
          {
            text: <T id={'sidebar.vendors'} />,
            href: '/vendors',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Vendor,
              ability: VendorAction.Create,
            },
          },
        ],
      },
      {
        text: <T id={'sidebar.new_tasks'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'sidebar.new_customer'} />,
            href: '/customers/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Customer,
              ability: CustomerAction.View,
            },
          },
          {
            text: <T id={'sidebar.new_vendor'} />,
            href: '/vendors/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Vendor,
              ability: VendorAction.View,
            },
          },
        ],
      },
    ],
  },
  // ---------------
  // # Accounting
  // ---------------
  {
    text: <T id={'sidebar.accounting'} />,
    type: ISidebarMenuItemType.Group,
    children: [
      {
        text: <T id={'sidebar.financial'} />,
        type: ISidebarMenuItemType.Overlay,
        overlayId: ISidebarMenuOverlayIds.Financial,
        children: [
          {
            text: <T id={'sidebar.financial'} />,
            type: ISidebarMenuItemType.Group,
            children: [
              {
                text: <T id={'sidebar.accounts_chart'} />,
                href: '/accounts',
                type: ISidebarMenuItemType.Link,
                permission: {
                  subject: AbilitySubject.Account,
                  ability: AccountAction.View,
                },
              },
              {
                text: <T id={'sidebar.manual_journals'} />,
                href: '/manual-journals',
                type: ISidebarMenuItemType.Link,
                permission: {
                  subject: AbilitySubject.ManualJournal,
                  ability: ManualJournalAction.View,
                },
              },
              {
                text: <T id={'sidebar.transactions_locking'} />,
                href: '/transactions-locking',
                type: ISidebarMenuItemType.Link,
              },
            ],
          },
          {
            text: <T id={'sidebar.new_tasks'} />,
            type: ISidebarMenuItemType.Group,
            children: [
              {
                text: <T id={'sidebar.make_journal_entry'} />,
                href: '/make-journal-entry',
                type: ISidebarMenuItemType.Link,
                permission: {
                  subject: AbilitySubject.ManualJournal,
                  ability: ManualJournalAction.Create,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // ---------------
  // # Cashflow
  // ---------------
  {
    text: <T id={'sidebar.cashflow'} />,
    type: ISidebarMenuItemType.Overlay,
    overlayId: ISidebarMenuOverlayIds.Cashflow,
    children: [
      {
        text: <T id={'sidebar.cashflow'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'sidebar.cash_bank_accounts'} />,
            href: '/cashflow-accounts',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Cashflow,
              ability: CashflowAction.View,
            },
          },
        ],
      },
      {
        text: <T id={'sidebar.new_tasks'} />,
        type: ISidebarMenuItemType.Group,
        divider: true,
        children: [
          {
            text: <T id={'sidebar.add_money_in'} />,
            href: '/cashflow-accounts',
            type: ISidebarMenuItemType.Dialog,
            dialogName: 'money-in',
            permission: {
              subject: AbilitySubject.Cashflow,
              ability: CashflowAction.Create,
            },
          },
          {
            text: <T id={'sidebar.add_money_out'} />,
            href: '/cashflow-accounts',
            type: ISidebarMenuItemType.Dialog,
            permission: {
              subject: AbilitySubject.Cashflow,
              ability: CashflowAction.Create,
            },
          },
          {
            text: <T id={'sidebar.add_cash_account'} />,
            href: '/cashflow-accounts',
            type: ISidebarMenuItemType.Dialog,
            permission: {
              subject: AbilitySubject.Cashflow,
              ability: CashflowAction.Create,
            },
          },
          {
            text: <T id={'sidebar.add_bank_account'} />,
            href: '/cashflow-accounts',
            type: ISidebarMenuItemType.Dialog,
            permission: {
              subject: AbilitySubject.Cashflow,
              ability: CashflowAction.Create,
            },
          },
        ],
      },
    ],
  },
  // ---------------
  // # Expenses
  // ---------------
  {
    text: <T id={'sidebar.expenses'} />,
    type: ISidebarMenuItemType.Overlay,
    overlayId: ISidebarMenuOverlayIds.Expenses,
    children: [
      {
        text: <T id={'sidebar.expenses'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'sidebar.expenses'} />,
            href: '/expenses',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Expense,
              ability: ExpenseAction.View,
            },
          },
        ],
      },
      {
        text: <T id={'sidebar.new_tasks'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'sidebar.new_expense'} />,
            href: '/expenses/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Expense,
              ability: ExpenseAction.Create,
            },
          },
        ],
      },
    ],
  },
  // ---------------------
  // # Projects Management
  // ---------------------
  // {
  //   text: <T id={'sidebar.projects'} />,
  //   type: ISidebarMenuItemType.Overlay,
  //   overlayId: ISidebarMenuOverlayIds.Projects,
  //   children: [
  //     {
  //       text: <T id={'sidebar.projects'} />,
  //       type: ISidebarMenuItemType.Group,
  //       children: [
  //         {
  //           text: <T id={'sidebar.projects'} />,
  //           href: '/projects',
  //           type: ISidebarMenuItemType.Link,
  //           permission: {
  //             subject: AbilitySubject.Project,
  //             ability: ProjectAction.View,
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       text: <T id={'sidebar.new_tasks'} />,
  //       type: ISidebarMenuItemType.Group,
  //       children: [
  //         {
  //           text: <T id={'sidebar.new_project'} />,
  //           type: ISidebarMenuItemType.Dialog,
  //           dialogName: 'project-form',
  //           permission: {
  //             subject: AbilitySubject.Project,
  //             ability: ProjectAction.Create,
  //           },
  //         },
  //         {
  //           text: <T id={'sidebar.new_time_entry'} />,
  //           type: ISidebarMenuItemType.Dialog,
  //           dialogName: 'project-time-entry-form',
  //         },
  //       ],
  //     },
  //     {
  //       text: <T id={'sidebar.reports'} />,
  //       type: ISidebarMenuItemType.Group,
  //       children: [
  //         {
  //           text: <T id={'sidebar.project_profitability_summary'} />,
  //           href: '/financial-reports/project-profitability-summary',
  //           type: ISidebarMenuItemType.Link,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // ---------------
  // # Reports
  // ---------------
  {
    text: <T id={'sidebar.reports'} />,
    type: ISidebarMenuItemType.Overlay,
    overlayId: ISidebarMenuOverlayIds.Reports,
    children: [
      {
        text: <T id={'sidebar.reports'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'sidebar.balance_sheet'} />,
            href: '/financial-reports/balance-sheet',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_BALANCE_SHEET,
            },
          },
          {
            text: <T id={'sidebar.trial_balance_sheet'} />,
            href: '/financial-reports/trial-balance-sheet',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_TRIAL_BALANCE_SHEET,
            },
          },
          {
            text: <T id={'sidebar.journal'} />,
            href: '/financial-reports/journal-sheet',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_JOURNAL,
            },
          },
          {
            text: <T id={'sidebar.general_ledger'} />,
            href: '/financial-reports/general-ledger',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_GENERAL_LEDGET,
            },
          },
          {
            text: <T id={'sidebar.profit_loss_sheet'} />,
            href: '/financial-reports/profit-loss-sheet',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_PROFIT_LOSS,
            },
          },
          {
            text: <T id={'sidebar.cash_flow_statement'} />,
            href: '/financial-reports/cash-flow',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_CASHFLOW_ACCOUNT_TRANSACTION,
            },
          },
          {
            text: <T id={'sidebar.ar_aging_Summary'} />,
            href: '/financial-reports/receivable-aging-summary',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_AR_AGING_SUMMARY,
            },
          },
          {
            text: <T id={'sidebar.ap_aging_summary'} />,
            href: '/financial-reports/payable-aging-summary',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_AP_AGING_SUMMARY,
            },
          },
        ],
      },
      {
        text: <T id={'sidebar.sales_purchases'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'sidebar.purchases_by_items'} />,
            type: ISidebarMenuItemType.Link,
            href: '/financial-reports/purchases-by-items',
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_PURCHASES_BY_ITEMS,
            },
          },
          {
            text: <T id={'sidebar.sales_by_items'} />,
            href: '/financial-reports/sales-by-items',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_SALES_BY_ITEMS,
            },
          },
          {
            text: <T id={'sidebar.customers_transactions'} />,
            href: '/financial-reports/transactions-by-customers',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_CUSTOMERS_TRANSACTIONS,
            },
          },
          {
            text: <T id={'sidebar.vendors_transactions'} />,
            href: '/financial-reports/transactions-by-vendors',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_VENDORS_TRANSACTIONS,
            },
          },
          {
            text: <T id={'sidebar.customers_balance_summary'} />,
            href: '/financial-reports/customers-balance-summary',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_CUSTOMERS_SUMMARY_BALANCE,
            },
          },
          {
            text: <T id={'sidebar.vendors_balance_summary'} />,
            href: '/financial-reports/vendors-balance-summary',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_VENDORS_SUMMARY_BALANCE,
            },
          },
        ],
      },
      {
        text: <T id={'sidebar.inventory'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'sidebar.inventory_item_details'} />,
            href: '/financial-reports/inventory-item-details',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_INVENTORY_ITEM_DETAILS,
            },
          },
          {
            text: <T id={'sidebar.inventory_valuation'} />,
            href: '/financial-reports/inventory-valuation',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_INVENTORY_VALUATION_SUMMARY,
            },
          },
        ],
      },
    ],
  },
  {
    text: <T id={'sidebar.system'} />,
    type: ISidebarMenuItemType.Group,
    children: [
      {
        text: <T id={'sidebar.preferences'} />,
        href: '/preferences',
        type: ISidebarMenuItemType.Link,
        permission: {
          subject: AbilitySubject.Preferences,
          ability: PreferencesAbility.Mutate,
        },
      },
    ],
  },
];
