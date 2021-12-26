import { chain } from 'lodash';
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

export const permissions = [
  {
    label: 'Items & Inventory',
    type: ModulePermissionsStyle.Columns,
    serviceFullAccess: true,
    moduleFullAccess: true,
    columns: [
      { label: 'View', key: 'view' },
      { label: 'Create', key: 'create' },
      { label: 'Edit', key: 'edit' },
      { label: 'Delete', key: 'delete' },
    ],
    services: [
      {
        label: 'Items',
        subject: AbilitySubject.Item,
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
          },
          {
            label: 'Edit',
            key: ItemAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: ItemAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
        ],
      },
      {
        label: 'Inventory adjustments',
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
          },
          {
            label: 'Edit',
            key: ItemAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: ItemAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
        ],
      },
    ],
  },
  {
    label: 'Contacts',
    type: ModulePermissionsStyle.Columns,
    serviceFullAccess: true,
    moduleFullAccess: true,
    columns: [
      { label: 'View', key: 'view' },
      { label: 'Create', key: 'create' },
      { label: 'Edit', key: 'edit' },
      { label: 'Delete', key: 'delete' },
    ],
    services: [
      {
        label: 'Customers',
        subject: AbilitySubject.Customer,
        permissions: [
          {
            label: 'View',
            key: CustomerAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: 'Create',
            key: CustomerAction.Create,
            relatedColumn: PermissionColumn.Create,
          },
          {
            label: 'Edit',
            key: CustomerAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: CustomerAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
        ],
      },
      {
        label: 'Vendors',
        subject: AbilitySubject.Vendor,
        permissions: [
          {
            label: 'View',
            key: VendorAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: 'Create',
            key: VendorAction.Create,
            relatedColumn: PermissionColumn.Create,
          },
          {
            label: 'Edit',
            key: VendorAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: VendorAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
        ],
      },
    ],
  },
  {
    label: 'Sales',
    type: ModulePermissionsStyle.Columns,
    serviceFullAccess: true,
    moduleFullAccess: true,
    columns: [
      { label: 'View', key: 'view' },
      { label: 'Create', key: 'create' },
      { label: 'Edit', key: 'edit' },
      { label: 'Delete', key: 'delete' },
    ],
    services: [
      {
        label: 'Sale Invoice',
        subject: AbilitySubject.Invoice,
        permissions: [
          {
            label: 'View',
            key: SaleInvoiceAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: 'Create',
            key: SaleInvoiceAction.Create,
            relatedColumn: PermissionColumn.Create,
          },
          {
            label: 'Edit',
            key: SaleInvoiceAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: SaleInvoiceAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
          { label: 'Written-off invoice', key: SaleInvoiceAction.Writeoff },
        ],
      },
      {
        label: 'Sale Estimate',
        subject: AbilitySubject.Estimate,
        permissions: [
          {
            label: 'View',
            key: SaleEstimateAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: 'Create',
            key: SaleEstimateAction.Create,
            relatedColumn: PermissionColumn.Create,
          },
          {
            label: 'Edit',
            key: SaleEstimateAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: SaleEstimateAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
        ],
      },
      {
        label: 'Sale Receipt',
        subject: AbilitySubject.Receipt,
        permissions: [
          {
            label: 'View',
            key: SaleReceiptAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: 'Create',
            key: SaleReceiptAction.Create,
            relatedColumn: PermissionColumn.Create,
          },
          {
            label: 'Edit',
            key: SaleReceiptAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: SaleReceiptAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
        ],
      },
      {
        label: 'Credit note',
        subject: AbilitySubject.CreditNote,
        permissions: [
          {
            label: 'View',
            key: CreditNoteAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: 'Create',
            key: CreditNoteAction.Create,
            relatedColumn: PermissionColumn.Create,
          },
          {
            label: 'Edit',
            key: CreditNoteAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: CreditNoteAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
          { label: 'Refund credit note', key: CreditNoteAction.Refund },
        ],
      },
      {
        label: 'Payment Receive',
        subject: AbilitySubject.PaymentReceive,
        permissions: [
          {
            label: 'View',
            key: PaymentReceiveAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: 'Create',
            key: PaymentReceiveAction.Create,
            relatedColumn: PermissionColumn.Create,
          },
          {
            label: 'Edit',
            key: PaymentReceiveAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: PaymentReceiveAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
        ],
      },
    ],
  },
  {
    label: 'Purchases',
    type: ModulePermissionsStyle.Columns,
    serviceFullAccess: true,
    moduleFullAccess: true,
    columns: [
      { label: 'View', key: 'view' },
      { label: 'Create', key: 'create' },
      { label: 'Edit', key: 'edit' },
      { label: 'Delete', key: 'delete' },
    ],
    services: [
      {
        label: 'Bills',
        subject: AbilitySubject.Bill,
        permissions: [
          {
            label: 'View',
            key: BillAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: 'Create',
            key: BillAction.Create,
            relatedColumn: PermissionColumn.Create,
          },
          {
            label: 'Edit',
            key: BillAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: BillAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
        ],
      },
      {
        label: 'Vendor Credits',
        subject: AbilitySubject.VendorCredit,
        permissions: [
          {
            label: 'View',
            key: VendorCreditAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: 'Create',
            key: VendorCreditAction.Create,
            relatedColumn: PermissionColumn.Create,
          },
          {
            label: 'Edit',
            key: VendorCreditAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: VendorCreditAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
          { label: 'Refund vendor credit', key: VendorCreditAction.Refund },
        ],
      },
      {
        label: 'Payment Made',
        subject: AbilitySubject.PaymentMade,
        permissions: [
          {
            label: 'View',
            key: PaymentMadeAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: 'Create',
            key: PaymentMadeAction.Create,
            relatedColumn: PermissionColumn.Create,
          },
          {
            label: 'Edit',
            key: PaymentMadeAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: PaymentMadeAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
        ],
      },
    ],
  },
  {
    label: 'Financial Accounting',
    type: ModulePermissionsStyle.Columns,
    serviceFullAccess: true,
    moduleFullAccess: true,
    columns: [
      { label: 'View', key: 'view' },
      { label: 'Create', key: 'create' },
      { label: 'Edit', key: 'edit' },
      { label: 'Delete', key: 'delete' },
    ],
    services: [
      {
        label: 'Manual Journals',
        subject: AbilitySubject.ManualJournal,
        permissions: [
          {
            label: 'View',
            key: ManualJournalAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: 'Create',
            key: ManualJournalAction.Create,
            relatedColumn: PermissionColumn.Create,
          },
          {
            label: 'Edit',
            key: ManualJournalAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: ManualJournalAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
        ],
      },
      {
        label: 'Chart of Accounts',
        subject: AbilitySubject.Account,
        permissions: [
          {
            label: 'View',
            key: AccountAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: 'Create',
            key: AccountAction.Create,
            relatedColumn: PermissionColumn.Create,
          },
          {
            label: 'Edit',
            key: AccountAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: AccountAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
          {
            label: 'Transactions locking',
            key: AccountAction.TransactionsLocking,
          },
        ],
      },
      {
        label: 'Expenses',
        subject: AbilitySubject.Expense,
        permissions: [
          {
            label: 'View',
            key: ExpenseAction.View,
            relatedColumn: PermissionColumn.View,
          },
          {
            label: 'Create',
            key: ExpenseAction.Create,
            relatedColumn: PermissionColumn.Create,
          },
          {
            label: 'Edit',
            key: ExpenseAction.Edit,
            relatedColumn: PermissionColumn.Edit,
          },
          {
            label: 'Delete',
            key: ExpenseAction.Delete,
            relatedColumn: PermissionColumn.Delete,
          },
        ],
      },
    ],
  },
  {
    label: 'Financial Reports',
    type: ModulePermissionsStyle.Vertical,
    serviceFullAccess: true,
    moduleFullAccess: true,
    services: [
      {
        label: 'Financial reprots',
        subject: AbilitySubject.Report,
        permissions: [
          { label: 'Balance sheet', key: ReportsAction.READ_BALANCE_SHEET },
          {
            label: 'Trial Balance sheet',
            key: ReportsAction.READ_TRIAL_BALANCE_SHEET,
          },
          { label: 'Profit & Loss sheet', key: ReportsAction.READ_PROFIT_LOSS },
          { label: 'Cash flow sheet', key: ReportsAction.READ_CASHFLOW },
          { label: 'Journal sheet', key: ReportsAction.READ_JOURNAL },
          { label: 'General ledger', key: ReportsAction.READ_GENERAL_LEDGET },
          {
            label: 'A/R Aging Summary report',
            key: ReportsAction.READ_AR_AGING_SUMMARY,
          },
          {
            label: 'A/P Aging Summary report',
            key: ReportsAction.READ_AP_AGING_SUMMARY,
          },
          {
            label: 'Purchases by items',
            key: ReportsAction.READ_PURCHASES_BY_ITEMS,
          },
          { label: 'Sales by items', key: ReportsAction.READ_SALES_BY_ITEMS },
          {
            label: 'Customers transactions',
            key: ReportsAction.READ_CUSTOMERS_TRANSACTIONS,
          },
          {
            label: 'Vendors transactions',
            key: ReportsAction.READ_VENDORS_TRANSACTIONS,
          },
          {
            label: 'Customers summary balance',
            key: ReportsAction.READ_CUSTOMERS_SUMMARY_BALANCE,
          },
          {
            label: 'Vendors summary balance',
            key: ReportsAction.READ_VENDORS_SUMMARY_BALANCE,
          },
          {
            label: 'Inventory valuation summary',
            key: ReportsAction.READ_INVENTORY_VALUATION_SUMMARY,
          },
          {
            label: 'Inventory items details',
            key: ReportsAction.READ_INVENTORY_ITEM_DETAILS,
          },
          {
            label: 'Cashflow account transactions',
            key: ReportsAction.READ_CASHFLOW_ACCOUNT_TRANSACTION,
          },
        ],
      },
    ],
  },
];

export function getPermissionsSchemaService(subject) {
  return chain(permissions)
    .map((perm) => perm.services)
    .flatten()
    .find((service) => service.subject === subject)
    .value();
}

export function getPermissionsSchemaServices() {
  return chain(permissions)
    .map((module) => module.services)
    .flatten()
    .value();
}
