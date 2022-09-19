// @ts-nocheck
import { chain } from 'lodash';
import intl from 'react-intl-universal';
import {
  AbilitySubject,
  AccountAction,
  BillAction,
  CreditNoteAction,
  CustomerAction,
  ExpenseAction,
  ItemAction,
  ManualJournalAction,
  PaymentMadeAction,
  PaymentReceiveAction,
  ReportsAction,
  SaleEstimateAction,
  SaleInvoiceAction,
  SaleReceiptAction,
  VendorAction,
  VendorCreditAction,
} from './abilityOption';

export const ModulePermissionsStyle = {
  Columns: 'columns',
  Vertical: 'vertical',
};

const PermissionColumn = {
  View: 'view',
  Create: 'create',
  Delete: 'delete',
  Edit: 'edit',
};

export const getPermissionsSchema = () => [
  {
    label: intl.get('permissions.items_inventory'),
    type: ModulePermissionsStyle.Columns,
    serviceFullAccess: true,
    columns: [
      { label: intl.get('permissions.column.view'), key: 'view' },
      { label: intl.get('permissions.column.create'), key: 'create' },
      { label: intl.get('permissions.column.edit'), key: 'edit' },
      { label: intl.get('permissions.column.delete'), key: 'delete' },
    ],
    services: [
      {
        label: intl.get('permissions.items'),
        subject: AbilitySubject.Item,
        permissions: [
          {
            label: intl.get('permissions.column.view'),
            key: ItemAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: intl.get('permissions.column.create'),
            key: ItemAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: ItemAction.View }],
          },
          {
            label: intl.get('permissions.column.edit'),
            key: ItemAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: ItemAction.Create }],
          },
          {
            label: intl.get('permissions.column.delete'),
            key: ItemAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: ItemAction.Edit }],
          },
        ],
      },
      {
        label: intl.get('permissions.inventory_adjustment'),
        subject: AbilitySubject.InventoryAdjustment,
        permissions: [
          {
            label: 'View',
            key: ItemAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: 'Create',
            key: ItemAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: ItemAction.View }],
          },
          {
            label: 'Edit',
            key: ItemAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: ItemAction.Create }],
          },
          {
            label: 'Delete',
            key: ItemAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: ItemAction.Edit }],
          },
        ],
      },
    ],
  },
  {
    label: intl.get('permissions.contacts'),
    type: ModulePermissionsStyle.Columns,
    serviceFullAccess: true,
    moduleFullAccess: true,
    columns: [
      { label: intl.get('permissions.column.view'), key: 'view' },
      { label: intl.get('permissions.column.create'), key: 'create' },
      { label: intl.get('permissions.column.edit'), key: 'edit' },
      { label: intl.get('permissions.column.delete'), key: 'delete' },
    ],
    services: [
      {
        label: intl.get('permissions.customers'),
        subject: AbilitySubject.Customer,
        permissions: [
          {
            label: intl.get('permissions.column.view'),
            key: CustomerAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: intl.get('permissions.column.create'),
            key: CustomerAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: CustomerAction.View }],
          },
          {
            label: intl.get('permissions.column.edit'),
            key: CustomerAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: CustomerAction.Create }],
          },
          {
            label: intl.get('permissions.column.delete'),
            key: CustomerAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: CustomerAction.Edit }],
          },
        ],
      },
      {
        label: intl.get('permissions.vendors'),
        subject: AbilitySubject.Vendor,
        permissions: [
          {
            label: intl.get('permissions.column.view'),
            key: VendorAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: intl.get('permissions.column.create'),
            key: VendorAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: VendorAction.View }],
          },
          {
            label: intl.get('permissions.column.edit'),
            key: VendorAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: VendorAction.Create }],
          },
          {
            label: intl.get('permissions.column.delete'),
            key: VendorAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: VendorAction.Edit }],
          },
        ],
      },
    ],
  },
  {
    label: intl.get('permissions.sales'),
    type: ModulePermissionsStyle.Columns,
    serviceFullAccess: true,
    moduleFullAccess: true,
    columns: [
      { label: intl.get('permissions.column.view'), key: 'view' },
      { label: intl.get('permissions.column.create'), key: 'create' },
      { label: intl.get('permissions.column.edit'), key: 'edit' },
      { label: intl.get('permissions.column.delete'), key: 'delete' },
    ],
    services: [
      {
        label: intl.get('permissions.sale_invoice'),
        subject: AbilitySubject.Invoice,
        permissions: [
          {
            label: intl.get('permissions.column.view'),
            key: SaleInvoiceAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: intl.get('permissions.column.create'),
            key: SaleInvoiceAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: SaleInvoiceAction.View }],
          },
          {
            label: intl.get('permissions.column.edit'),
            key: SaleInvoiceAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: SaleInvoiceAction.Create }],
          },
          {
            label: intl.get('permissions.column.delete'),
            key: SaleInvoiceAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: SaleInvoiceAction.Edit }],
          },
          {
            label: intl.get('permissions.column.written_off_invoice'),
            key: SaleInvoiceAction.Writeoff,
            depend: [{ key: SaleInvoiceAction.Edit }],
          },
        ],
      },
      {
        label: intl.get('permissions.sale_estimate'),
        subject: AbilitySubject.Estimate,
        permissions: [
          {
            label: intl.get('permissions.column.view'),
            key: SaleEstimateAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: intl.get('permissions.column.create'),
            key: SaleEstimateAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: SaleEstimateAction.View }],
          },
          {
            label: intl.get('permissions.column.edit'),
            key: SaleEstimateAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: SaleEstimateAction.Create }],
          },
          {
            label: intl.get('permissions.column.delete'),
            key: SaleEstimateAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: SaleEstimateAction.Edit }],
          },
        ],
      },
      {
        label: intl.get('permissions.sale_receipt'),
        subject: AbilitySubject.Receipt,
        permissions: [
          {
            label: intl.get('permissions.column.view'),
            key: SaleReceiptAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: intl.get('permissions.column.create'),
            key: SaleReceiptAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: SaleReceiptAction.View }],
          },
          {
            label: intl.get('permissions.column.edit'),
            key: SaleReceiptAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: SaleReceiptAction.Create }],
          },
          {
            label: intl.get('permissions.column.delete'),
            key: SaleReceiptAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: SaleReceiptAction.Edit }],
          },
        ],
      },
      {
        label: intl.get('permissions.credit_note'),
        subject: AbilitySubject.CreditNote,
        permissions: [
          {
            label: intl.get('permissions.column.view'),
            key: CreditNoteAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: intl.get('permissions.column.create'),
            key: CreditNoteAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: CreditNoteAction.View }],
          },
          {
            label: intl.get('permissions.column.edit'),
            key: CreditNoteAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: CreditNoteAction.Create }],
          },
          {
            label: intl.get('permissions.column.delete'),
            key: CreditNoteAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: CreditNoteAction.Edit }],
          },
          {
            label: intl.get('permissions.column.refund_credit_note'),
            key: CreditNoteAction.Refund,
            depend: [{ key: CreditNoteAction.View }],
          },
        ],
      },
      {
        label: intl.get('permissions.payment_receive'),
        subject: AbilitySubject.PaymentReceive,
        permissions: [
          {
            label: intl.get('permissions.column.view'),
            key: PaymentReceiveAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: intl.get('permissions.column.create'),
            key: PaymentReceiveAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: PaymentReceiveAction.View }],
          },
          {
            label: intl.get('permissions.column.edit'),
            key: PaymentReceiveAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: PaymentReceiveAction.Create }],
          },
          {
            label: intl.get('permissions.column.delete'),
            key: PaymentReceiveAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: PaymentReceiveAction.Edit }],
          },
        ],
      },
    ],
  },
  {
    label: intl.get('permissions.purchases'),
    type: ModulePermissionsStyle.Columns,
    serviceFullAccess: true,
    moduleFullAccess: true,
    columns: [
      { label: intl.get('permissions.column.view'), key: 'view' },
      { label: intl.get('permissions.column.create'), key: 'create' },
      { label: intl.get('permissions.column.edit'), key: 'edit' },
      { label: intl.get('permissions.column.delete'), key: 'delete' },
    ],
    services: [
      {
        label: intl.get('permissions.bills'),
        subject: AbilitySubject.Bill,
        permissions: [
          {
            label: intl.get('permissions.column.view'),
            key: BillAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: intl.get('permissions.column.create'),
            key: BillAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: BillAction.View }],
          },
          {
            label: intl.get('permissions.column.edit'),
            key: BillAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: BillAction.Create }],
          },
          {
            label: intl.get('permissions.column.delete'),
            key: BillAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: BillAction.Edit }],
          },
        ],
      },
      {
        label: intl.get('permissions.vendor_credits'),
        subject: AbilitySubject.VendorCredit,
        permissions: [
          {
            label: intl.get('permissions.column.view'),
            key: VendorCreditAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: intl.get('permissions.column.create'),
            key: VendorCreditAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: VendorCreditAction.View }],
          },
          {
            label: intl.get('permissions.column.edit'),
            key: VendorCreditAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: VendorCreditAction.Create }],
          },
          {
            label: intl.get('permissions.column.delete'),
            key: VendorCreditAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: VendorCreditAction.Edit }],
          },
          {
            label: intl.get('permissions.column.refund_vendor_credit'),
            key: VendorCreditAction.Refund,
            depend: [{ key: VendorCreditAction.View }],
          },
        ],
      },
      {
        label: intl.get('permissions.payment_made'),
        subject: AbilitySubject.PaymentMade,
        permissions: [
          {
            label: intl.get('permissions.column.view'),
            key: PaymentMadeAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: intl.get('permissions.column.create'),
            key: PaymentMadeAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: PaymentMadeAction.View }],
          },
          {
            label: intl.get('permissions.column.edit'),
            key: PaymentMadeAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: PaymentMadeAction.Create }],
          },
          {
            label: intl.get('permissions.column.delete'),
            key: PaymentMadeAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: PaymentMadeAction.Edit }],
          },
        ],
      },
    ],
  },
  {
    label: intl.get('permissions.financial_accounting'),
    type: ModulePermissionsStyle.Columns,
    serviceFullAccess: true,
    moduleFullAccess: true,
    columns: [
      { label: intl.get('permissions.column.view'), key: 'view' },
      { label: intl.get('permissions.column.create'), key: 'create' },
      { label: intl.get('permissions.column.edit'), key: 'edit' },
      { label: intl.get('permissions.column.delete'), key: 'delete' },
    ],
    services: [
      {
        label: intl.get('permissions.manual_journals'),
        subject: AbilitySubject.ManualJournal,
        permissions: [
          {
            label: intl.get('permissions.column.view'),
            key: ManualJournalAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: intl.get('permissions.column.create'),
            key: ManualJournalAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: ManualJournalAction.View }],
          },
          {
            label: intl.get('permissions.column.edit'),
            key: ManualJournalAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: ManualJournalAction.Create }],
          },
          {
            label: intl.get('permissions.column.delete'),
            key: ManualJournalAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: ManualJournalAction.Edit }],
          },
        ],
      },
      {
        label: intl.get('permissions.chart_of_accounts'),
        subject: AbilitySubject.Account,
        permissions: [
          {
            label: intl.get('permissions.column.view'),
            key: AccountAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: intl.get('permissions.column.create'),
            key: AccountAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: AccountAction.View }],
          },
          {
            label: intl.get('permissions.column.edit'),
            key: AccountAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: AccountAction.Create }],
          },
          {
            label: intl.get('permissions.column.delete'),
            key: AccountAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: AccountAction.Edit }],
          },
          {
            label: intl.get('permissions.column.transactions_locking'),
            key: AccountAction.TransactionsLocking,
          },
        ],
      },
      {
        label: intl.get('permissions.expenses'),
        subject: AbilitySubject.Expense,
        permissions: [
          {
            label: intl.get('permissions.column.view'),
            key: ExpenseAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: intl.get('permissions.column.create'),
            key: ExpenseAction.Create,
            relatedColumn: PermissionColumn.Create,
            depend: [{ key: ExpenseAction.View }],
          },
          {
            label: intl.get('permissions.column.edit'),
            key: ExpenseAction.Edit,
            relatedColumn: PermissionColumn.Edit,
            depend: [{ key: ExpenseAction.Create }],
          },
          {
            label: intl.get('permissions.column.delete'),
            key: ExpenseAction.Delete,
            relatedColumn: PermissionColumn.Delete,
            depend: [{ key: ExpenseAction.Edit }],
          },
        ],
      },
    ],
  },
  {
    label: intl.get('permissions.reports'),
    type: ModulePermissionsStyle.Vertical,
    serviceFullAccess: true,
    moduleFullAccess: true,
    services: [
      {
        label: intl.get('permissions.financial_reports'),
        subject: AbilitySubject.Report,
        permissions: [
          {
            label: intl.get('permissions.balance_sheet'),
            key: ReportsAction.READ_BALANCE_SHEET,
          },
          {
            label: intl.get('permissions.trial_balance_sheet'),
            key: ReportsAction.READ_TRIAL_BALANCE_SHEET,
          },
          {
            label: intl.get('permissions.profit_loss_sheet'),
            key: ReportsAction.READ_PROFIT_LOSS,
          },
          {
            label: intl.get('permissions.cash_flow_sheet'),
            key: ReportsAction.READ_CASHFLOW,
          },
          {
            label: intl.get('permissions.journal_sheet'),
            key: ReportsAction.READ_JOURNAL,
          },
          {
            label: intl.get('permissions.general_ledger'),
            key: ReportsAction.READ_GENERAL_LEDGET,
          },
          {
            label: intl.get('permissions.a_r_aging_summary_report'),
            key: ReportsAction.READ_AR_AGING_SUMMARY,
          },
          {
            label: intl.get('permissions.a_r_aging_summary_report'),
            key: ReportsAction.READ_AP_AGING_SUMMARY,
          },
          {
            label: intl.get('permissions.purchases_by_items'),
            key: ReportsAction.READ_PURCHASES_BY_ITEMS,
          },
          {
            label: intl.get('permissions.sales_by_items'),
            key: ReportsAction.READ_SALES_BY_ITEMS,
          },
          {
            label: intl.get('permissions.customers_transactions'),
            key: ReportsAction.READ_CUSTOMERS_TRANSACTIONS,
          },
          {
            label: intl.get('permissions.vendors_transactions'),
            key: ReportsAction.READ_VENDORS_TRANSACTIONS,
          },
          {
            label: intl.get('permissions.customers_summary_balance'),
            key: ReportsAction.READ_CUSTOMERS_SUMMARY_BALANCE,
          },
          {
            label: intl.get('permissions.vendors_summary_balance'),
            key: ReportsAction.READ_VENDORS_SUMMARY_BALANCE,
          },
          {
            label: intl.get('permissions.inventory_valuation_summary'),
            key: ReportsAction.READ_INVENTORY_VALUATION_SUMMARY,
          },
          {
            label: intl.get('permissions.inventory_items_details'),
            key: ReportsAction.READ_INVENTORY_ITEM_DETAILS,
          },
          {
            label: intl.get('permissions.cashflow_account_transactions'),
            key: ReportsAction.READ_CASHFLOW_ACCOUNT_TRANSACTION,
          },
        ],
      },
    ],
  },
];

export function getPermissionsSchemaService(subject) {
  const permissions = getPermissionsSchema();

  return chain(permissions)
    .map((perm) => perm.services)
    .flatten()
    .find((service) => service.subject === subject)
    .value();
}

export function getPermissionsSchemaServices() {
  const permissions = getPermissionsSchema();

  return chain(permissions)
    .map((module) => module.services)
    .flatten()
    .value();
}
