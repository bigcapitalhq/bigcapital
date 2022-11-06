// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import { Features } from '@/constants/features';
import {
  ISidebarMenuItemType,
  ISidebarMenuOverlayIds,
  ISidebarSubscriptionAbility,
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
  ProjectAction,
  PreferencesAbility,
  SubscriptionBillingAbility,
} from '@/constants/abilityOption';

export const SidebarMenu = [
  // ---------------
  // # Homepage
  // ---------------
  {
    text: <T id={'homepage'} />,
    type: ISidebarMenuItemType.Link,
    disabled: false,
    href: '/',
    matchExact: true,
  },
  // ---------------
  // # Sales & Inventory
  // ---------------
  {
    text: <T id={'sales_inventory'} />,
    type: ISidebarMenuItemType.Group,
    children: [
      {
        text: <T id={'items'} />,
        type: ISidebarMenuItemType.Overlay,
        overlayId: ISidebarMenuOverlayIds.Items,
        children: [
          {
            text: <T id={'items'} />,
            type: ISidebarMenuItemType.Group,
            children: [
              {
                text: <T id={'items'} />,
                href: '/items',
                type: ISidebarMenuItemType.Link,
                permission: {
                  subject: AbilitySubject.Item,
                  ability: ItemAction.View,
                },
              },
              {
                text: <T id={'inventory_adjustments'} />,
                href: '/inventory-adjustments',
                type: ISidebarMenuItemType.Link,
                permission: {
                  subject: AbilitySubject.InventoryAdjustment,
                  ability: InventoryAdjustmentAction.View,
                },
              },
              {
                text: <T id={'sidebar_warehouse_transfer'} />,
                href: '/warehouses-transfers',
                type: ISidebarMenuItemType.Link,
                feature: Features.Warehouses,
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
            ],
          },
          {
            text: <T id={'New tasks'} />,
            type: ISidebarMenuItemType.Group,
            children: [
              {
                text: <T id={'New inventory item'} />,
                href: '/items/new',
                type: ISidebarMenuItemType.Link,
                permission: {
                  subject: AbilitySubject.Item,
                  ability: ItemAction.Create,
                },
              },
              {
                text: (
                  <T id={'warehouse_transfer.label.new_warehouse_transfer'} />
                ),
                href: '/warehouses-transfers/new',
                type: ISidebarMenuItemType.Link,
                feature: Features.Warehouses,
              },
              {
                text: <T id={'New service'} />,
                href: '/items/new',
                type: ISidebarMenuItemType.Link,
                permission: {
                  subject: AbilitySubject.Item,
                  ability: ItemAction.Create,
                },
              },
              {
                text: <T id={'New item category'} />,
                href: '/items/categories/new',
                type: ISidebarMenuItemType.Dialog,
                dialogName: 'item-category-form',
                permission: {
                  subject: AbilitySubject.Item,
                  ability: ItemAction.Create,
                },
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
    text: <T id={'sales'} />,
    type: ISidebarMenuItemType.Overlay,
    overlayId: ISidebarMenuOverlayIds.Sales,
    children: [
      {
        text: <T id={'sales'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'estimates'} />,
            href: '/estimates',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Estimate,
              ability: SaleEstimateAction.View,
            },
          },
          {
            text: <T id={'invoices'} />,
            href: '/invoices',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Invoice,
              ability: SaleInvoiceAction.View,
            },
          },
          {
            text: <T id={'receipts'} />,
            href: '/receipts',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Receipt,
              ability: SaleReceiptAction.View,
            },
          },
          {
            text: <T id={'sidebar_credit_note'} />,
            href: '/credit-notes',
            type: ISidebarMenuItemType.Link,
          },
          {
            text: <T id={'payment_receives'} />,
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
        text: <T id={'New tasks'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'new_estimate'} />,
            href: '/estimates/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Estimate,
              ability: SaleEstimateAction.Create,
            },
          },
          {
            text: <T id={'new_invoice'} />,
            href: '/invoices/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Invoice,
              ability: SaleInvoiceAction.Create,
            },
          },
          {
            text: <T id={'new_receipt'} />,
            href: '/receipts/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Receipt,
              ability: SaleReceiptAction.Create,
            },
          },
          {
            text: <T id={'credit_note.label.new_credit_note'} />,
            href: '/credit-notes/new',
            type: ISidebarMenuItemType.Link,
          },
          {
            text: <T id={'new_payment_receive'} />,
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
    text: <T id={'purchases'} />,
    type: ISidebarMenuItemType.Overlay,
    overlayId: ISidebarMenuOverlayIds.Purchases,
    children: [
      {
        text: <T id={'purchases'} />,
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
            text: <T id={'payment_mades'} />,
            href: '/payment-mades',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.PaymentMade,
              ability: PaymentMadeAction.View,
            },
          },
        ],
      },
      {
        text: <T id={'New tasks'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'New purchase invoice'} />,
            href: '/bills/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Bill,
              ability: BillAction.Create,
            },
          },
          {
            text: <T id={'vendor_credits.label.new_vendor_credit'} />,
            href: '/vendor-credits/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Bill,
              ability: BillAction.Create,
            },
          },
          {
            text: <T id={'new_payment_made'} />,
            href: '/payment-mades/new',
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
    text: <T id={'contacts'} />,
    type: ISidebarMenuItemType.Overlay,
    overlayId: ISidebarMenuOverlayIds.Contacts,
    children: [
      {
        text: <T id={'contacts'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'customers'} />,
            href: '/customers',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Customer,
              ability: CustomerAction.View,
            },
          },
          {
            text: <T id={'vendors'} />,
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
        text: <T id={'New tasks'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'new_customer'} />,
            href: '/customers/new',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Customer,
              ability: CustomerAction.View,
            },
          },
          {
            text: <T id={'new_vendor'} />,
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
    text: <T id={'accounting'} />,
    type: ISidebarMenuItemType.Group,
    children: [
      {
        text: <T id={'financial'} />,
        type: ISidebarMenuItemType.Overlay,
        overlayId: ISidebarMenuOverlayIds.Financial,
        children: [
          {
            text: <T id={'financial'} />,
            type: ISidebarMenuItemType.Group,
            children: [
              {
                text: <T id={'accounts_chart'} />,
                href: '/accounts',
                type: ISidebarMenuItemType.Link,
                permission: {
                  subject: AbilitySubject.Account,
                  ability: AccountAction.View,
                },
              },
              {
                text: <T id={'manual_journals'} />,
                href: '/manual-journals',
                type: ISidebarMenuItemType.Link,
                permission: {
                  subject: AbilitySubject.ManualJournal,
                  ability: ManualJournalAction.View,
                },
              },
              {
                text: <T id={'sidebar.transactions_locaking'} />,
                href: '/transactions-locking',
                type: ISidebarMenuItemType.Link,
              },
            ],
          },
          {
            text: <T id={'New tasks'} />,
            type: ISidebarMenuItemType.Group,
            children: [
              {
                text: <T id={'make_journal_entry'} />,
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
    text: <T id={'siebar.cashflow'} />,
    type: ISidebarMenuItemType.Overlay,
    overlayId: ISidebarMenuOverlayIds.Cashflow,
    children: [
      {
        text: <T id={'siebar.cashflow'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'siebar.cashflow.label_cash_and_bank_accounts'} />,
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
        text: <T id={'New tasks'} />,
        type: ISidebarMenuItemType.Group,
        divider: true,
        children: [
          {
            text: <T id={'cash_flow.label.add_money_in'} />,
            href: '/cashflow-accounts',
            type: ISidebarMenuItemType.Dialog,
            dialogName: 'money-in',
            permission: {
              subject: AbilitySubject.Cashflow,
              ability: CashflowAction.Create,
            },
          },
          {
            text: <T id={'cash_flow.label.add_money_out'} />,
            href: '/cashflow-accounts',
            type: ISidebarMenuItemType.Dialog,
            permission: {
              subject: AbilitySubject.Cashflow,
              ability: CashflowAction.Create,
            },
          },
          {
            text: <T id={'cash_flow.label.add_cash_account'} />,
            href: '/cashflow-accounts',
            type: ISidebarMenuItemType.Dialog,
            permission: {
              subject: AbilitySubject.Cashflow,
              ability: CashflowAction.Create,
            },
          },
          {
            text: <T id={'cash_flow.label.add_bank_account'} />,
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
    text: <T id={'expenses'} />,
    type: ISidebarMenuItemType.Overlay,
    overlayId: ISidebarMenuOverlayIds.Expenses,
    children: [
      {
        text: <T id={'expenses'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'expenses'} />,
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
        text: <T id={'New tasks'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'new_expense'} />,
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
  //   text: 'Projects',
  //   type: ISidebarMenuItemType.Overlay,
  //   overlayId: ISidebarMenuOverlayIds.Projects,
  //   children: [
  //     {
  //       text: 'Projects',
  //       type: ISidebarMenuItemType.Group,
  //       children: [
  //         {
  //           text: 'Projects',
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
  //       text: <T id={'New tasks'} />,
  //       type: ISidebarMenuItemType.Group,
  //       children: [
  //         {
  //           text: <T id={'projects.label.new_project'} />,
  //           type: ISidebarMenuItemType.Dialog,
  //           dialogName: 'project-form',
  //           permission: {
  //             subject: AbilitySubject.Project,
  //             ability: ProjectAction.Create,
  //           },
  //         },
  //         {
  //           text: <T id={'projects.label.new_time_entry'} />,
  //           type: ISidebarMenuItemType.Dialog,
  //           dialogName: 'project-time-entry-form',
  //         },
  //       ],
  //     },
  //     {
  //       text: <T id={'Reports'} />,
  //       type: ISidebarMenuItemType.Group,
  //       children: [
  //         {
  //           text: <T id={'project_profitability_summary'} />,
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
    text: <T id={'Reports'} />,
    type: ISidebarMenuItemType.Overlay,
    overlayId: ISidebarMenuOverlayIds.Reports,
    children: [
      {
        text: <T id={'Reports'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'balance_sheet'} />,
            href: '/financial-reports/balance-sheet',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_BALANCE_SHEET,
            },
          },
          {
            text: <T id={'trial_balance_sheet'} />,
            href: '/financial-reports/trial-balance-sheet',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_TRIAL_BALANCE_SHEET,
            },
          },
          {
            text: <T id={'journal'} />,
            href: '/financial-reports/journal-sheet',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_JOURNAL,
            },
          },
          {
            text: <T id={'general_ledger'} />,
            href: '/financial-reports/general-ledger',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_GENERAL_LEDGET,
            },
          },
          {
            text: <T id={'profit_loss_sheet'} />,
            href: '/financial-reports/profit-loss-sheet',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_PROFIT_LOSS,
            },
          },
          {
            text: <T id={'cash_flow_statement'} />,
            href: '/financial-reports/cash-flow',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_CASHFLOW_ACCOUNT_TRANSACTION,
            },
          },
          {
            text: <T id={'AR_Aging_Summary'} />,
            href: '/financial-reports/receivable-aging-summary',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_AR_AGING_SUMMARY,
            },
          },
          {
            text: <T id={'AP_Aging_Summary'} />,
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
        text: <T id={'Sales/Purchases'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'purchases_by_items'} />,
            type: ISidebarMenuItemType.Link,
            href: '/financial-reports/purchases-by-items',
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_PURCHASES_BY_ITEMS,
            },
          },
          {
            text: <T id={'sales_by_items'} />,
            href: '/financial-reports/sales-by-items',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_SALES_BY_ITEMS,
            },
          },
          {
            text: <T id={'customers_transactions'} />,
            href: '/financial-reports/transactions-by-customers',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_CUSTOMERS_TRANSACTIONS,
            },
          },
          {
            text: <T id={'vendors_transactions'} />,
            href: '/financial-reports/transactions-by-vendors',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_VENDORS_TRANSACTIONS,
            },
          },
          {
            text: <T id={'customers_balance_summary'} />,
            href: '/financial-reports/customers-balance-summary',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_CUSTOMERS_SUMMARY_BALANCE,
            },
          },
          {
            text: <T id={'vendors_balance_summary'} />,
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
        text: <T id={'inventory'} />,
        type: ISidebarMenuItemType.Group,
        children: [
          {
            text: <T id={'inventory_item_details'} />,
            href: '/financial-reports/inventory-item-details',
            type: ISidebarMenuItemType.Link,
            permission: {
              subject: AbilitySubject.Report,
              ability: ReportsAction.READ_INVENTORY_ITEM_DETAILS,
            },
          },
          {
            text: <T id={'inventory_valuation'} />,
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
    text: <T id={'system'} />,
    type: ISidebarMenuItemType.Group,
    children: [
      {
        text: <T id={'preferences'} />,
        href: '/preferences',
        type: ISidebarMenuItemType.Link,
        permission: {
          subject: AbilitySubject.Preferences,
          ability: PreferencesAbility.Mutate,
        },
      },
      {
        text: <T id={'billing'} />,
        href: '/billing',
        type: ISidebarMenuItemType.Link,
        subscription: [
          ISidebarSubscriptionAbility.Expired,
          ISidebarSubscriptionAbility.Active,
        ],
        permission: {
          subject: AbilitySubject.SubscriptionBilling,
          ability: SubscriptionBillingAbility.View,
        },
      },
    ],
  },
];
