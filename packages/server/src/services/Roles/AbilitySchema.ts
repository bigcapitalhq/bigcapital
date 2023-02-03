import {
  ReportsAction,
  ISubjectAbilitiesSchema,
  ISubjectAbilitySchema,
  AbilitySubject,
  ManualJournalAction,
  AccountAction,
  SaleInvoiceAction,
  ItemAction,
  VendorAction,
  CustomerAction,
  ExpenseAction,
  PaymentReceiveAction,
  InventoryAdjustmentAction,
  SaleEstimateAction,
  BillAction,
  SaleReceiptAction,
  IPaymentMadeAction,
  CashflowAction,
  PreferencesAction,
  CreditNoteAction,
  VendorCreditAction,
} from '@/interfaces';

export const AbilitySchema: ISubjectAbilitiesSchema[] = [
  {
    subject: AbilitySubject.Account,
    subjectLabel: 'ability.accounts',
    abilities: [
      { key: AccountAction.VIEW, label: 'ability.view' },
      { key: AccountAction.CREATE, label: 'ability.create' },
      { key: AccountAction.EDIT, label: 'ability.edit' },
      { key: AccountAction.DELETE, label: 'ability.delete' },
    ],
    extraAbilities: [
      {
        key: AccountAction.TransactionsLocking,
        label: 'ability.transactions_locking',
      },
    ],
  },
  {
    subject: AbilitySubject.ManualJournal,
    subjectLabel: 'ability.manual_journal',
    abilities: [
      { key: ManualJournalAction.View, label: 'ability.view' },
      { key: ManualJournalAction.Create, label: 'ability.create' },
      { key: ManualJournalAction.Edit, label: 'ability.edit' },
      { key: ManualJournalAction.Delete, label: 'ability.delete' },
    ],
  },
  {
    subject: AbilitySubject.Cashflow,
    subjectLabel: 'ability.cashflow',
    abilities: [
      { key: CashflowAction.View, label: 'ability.view' },
      { key: CashflowAction.Create, label: 'ability.create' },
      { key: CashflowAction.Delete, label: 'ability.delete' },
    ],
  },
  {
    subject: AbilitySubject.Item,
    subjectLabel: 'ability.items',
    abilities: [
      { key: ItemAction.VIEW, label: 'ability.view', default: true },
      { key: ItemAction.CREATE, label: 'ability.create', default: true },
      { key: ItemAction.EDIT, label: 'ability.edit', default: true },
      { key: ItemAction.DELETE, label: 'ability.delete', default: true },
    ],
  },
  {
    subject: AbilitySubject.InventoryAdjustment,
    subjectLabel: 'ability.inventory_adjustment',
    abilities: [
      {
        key: InventoryAdjustmentAction.VIEW,
        label: 'ability.view',
        default: true,
      },
      {
        key: InventoryAdjustmentAction.CREATE,
        label: 'ability.create',
        default: true,
      },
      {
        key: InventoryAdjustmentAction.EDIT,
        label: 'ability.edit',
        default: true,
      },
      { key: InventoryAdjustmentAction.DELETE, label: 'ability.delete' },
    ],
  },
  {
    subject: AbilitySubject.Customer,
    subjectLabel: 'ability.customers',
    // description: 'Description is here',
    abilities: [
      { key: CustomerAction.View, label: 'ability.view', default: true },
      { key: CustomerAction.Create, label: 'ability.create', default: true },
      { key: CustomerAction.Edit, label: 'ability.edit', default: true },
      { key: CustomerAction.Delete, label: 'ability.delete', default: true },
    ],
  },
  {
    subject: AbilitySubject.Vendor,
    subjectLabel: 'ability.vendors',
    abilities: [
      { key: VendorAction.View, label: 'ability.view', default: true },
      { key: VendorAction.Create, label: 'ability.create', default: true },
      { key: VendorAction.Edit, label: 'ability.edit', default: true },
      { key: VendorAction.Delete, label: 'ability.delete', default: true },
    ],
  },
  {
    subject: AbilitySubject.SaleEstimate,
    subjectLabel: 'ability.sale_estimates',
    abilities: [
      { key: SaleEstimateAction.View, label: 'ability.view', default: true },
      {
        key: SaleEstimateAction.Create,
        label: 'ability.create',
        default: true,
      },
      { key: SaleEstimateAction.Edit, label: 'ability.edit', default: true },
      {
        key: SaleEstimateAction.Delete,
        label: 'ability.delete',
        default: true,
      },
    ],
  },
  {
    subject: AbilitySubject.SaleInvoice,
    subjectLabel: 'ability.sale_invoices',
    abilities: [
      { key: SaleInvoiceAction.View, label: 'ability.view', default: true },
      { key: SaleInvoiceAction.Create, label: 'ability.create', default: true },
      { key: SaleInvoiceAction.Edit, label: 'ability.edit', default: true },
      { key: SaleInvoiceAction.Delete, label: 'ability.delete', default: true },
    ],
    extraAbilities: [{ key: 'bad-debt', label: 'Due amount to bad debit' }],
  },
  {
    subject: AbilitySubject.SaleReceipt,
    subjectLabel: 'ability.sale_receipts',
    abilities: [
      { key: SaleReceiptAction.View, label: 'ability.view', default: true },
      { key: SaleReceiptAction.Create, label: 'ability.create', default: true },
      { key: SaleReceiptAction.Edit, label: 'ability.edit', default: true },
      { key: SaleReceiptAction.Delete, label: 'ability.delete', default: true },
    ],
  },
  {
    subject: AbilitySubject.CreditNote,
    subjectLabel: 'ability.credit_note',
    abilities: [
      { key: CreditNoteAction.View, label: 'ability.view', default: true },
      { key: CreditNoteAction.Create, label: 'ability.create', default: true },
      { key: CreditNoteAction.Edit, label: 'ability.edit', default: true },
      { key: CreditNoteAction.Delete, label: 'ability.delete', default: true },
      { key: CreditNoteAction.Refund, label: 'ability.refund', default: true },
    ],
  },
  {
    subject: AbilitySubject.PaymentReceive,
    subjectLabel: 'ability.payments_receive',
    abilities: [
      { key: PaymentReceiveAction.View, label: 'ability.view', default: true },
      {
        key: PaymentReceiveAction.Create,
        label: 'ability.create',
        default: true,
      },
      { key: PaymentReceiveAction.Edit, label: 'ability.edit', default: true },
      {
        key: PaymentReceiveAction.Delete,
        label: 'ability.delete',
        default: true,
      },
    ],
  },
  {
    subject: AbilitySubject.Bill,
    subjectLabel: 'ability.purchase_invoices',
    abilities: [
      { key: BillAction.View, label: 'ability.view', default: true },
      { key: BillAction.Create, label: 'ability.create', default: true },
      { key: BillAction.Edit, label: 'ability.edit', default: true },
      { key: BillAction.Delete, label: 'ability.delete', default: true },
    ],
  },
  {
    subject: AbilitySubject.VendorCredit,
    subjectLabel: 'ability.vendor_credit',
    abilities: [
      { key: VendorCreditAction.View, label: 'ability.view', default: true },
      {
        key: VendorCreditAction.Create,
        label: 'ability.create',
        default: true,
      },
      { key: VendorCreditAction.Edit, label: 'ability.edit', default: true },
      {
        key: VendorCreditAction.Delete,
        label: 'ability.delete',
        default: true,
      },
      {
        key: VendorCreditAction.Refund,
        label: 'ability.refund',
        default: true,
      },
    ],
  },
  {
    subject: AbilitySubject.PaymentMade,
    subjectLabel: 'ability.payments_made',
    abilities: [
      { key: IPaymentMadeAction.View, label: 'ability.view', default: true },
      {
        key: IPaymentMadeAction.Create,
        label: 'ability.create',
        default: true,
      },
      { key: IPaymentMadeAction.Edit, label: 'ability.edit', default: true },
      {
        key: IPaymentMadeAction.Delete,
        label: 'ability.delete',
        default: true,
      },
    ],
  },
  {
    subject: AbilitySubject.Expense,
    subjectLabel: 'ability.expenses',
    abilities: [
      { key: ExpenseAction.View, label: 'ability.view', default: true },
      { key: ExpenseAction.Create, label: 'ability.create', default: true },
      { key: ExpenseAction.Edit, label: 'ability.edit', default: true },
      { key: ExpenseAction.Delete, label: 'ability.delete', default: true },
    ],
  },
  {
    subject: AbilitySubject.Report,
    subjectLabel: 'ability.all_reports',
    extraAbilities: [
      {
        key: ReportsAction.READ_BALANCE_SHEET,
        label: 'ability.balance_sheet_report',
      },
      {
        key: ReportsAction.READ_PROFIT_LOSS,
        label: 'ability.profit_loss_sheet',
      },
      { key: ReportsAction.READ_JOURNAL, label: 'ability.journal' },
      {
        key: ReportsAction.READ_GENERAL_LEDGET,
        label: 'ability.general_ledger',
      },
      { key: ReportsAction.READ_CASHFLOW, label: 'ability.cashflow_report' },
      {
        key: ReportsAction.READ_AR_AGING_SUMMARY,
        label: 'ability.AR_aging_summary_report',
      },
      {
        key: ReportsAction.READ_AP_AGING_SUMMARY,
        label: 'ability.AP_aging_summary_report',
      },
      {
        key: ReportsAction.READ_PURCHASES_BY_ITEMS,
        label: 'ability.purchases_by_items',
      },
      {
        key: ReportsAction.READ_SALES_BY_ITEMS,
        label: 'ability.sales_by_items_report',
      },
      {
        key: ReportsAction.READ_CUSTOMERS_TRANSACTIONS,
        label: 'ability.customers_transactions_report',
      },
      {
        key: ReportsAction.READ_VENDORS_TRANSACTIONS,
        label: 'ability.vendors_transactions_report',
      },
      {
        key: ReportsAction.READ_CUSTOMERS_SUMMARY_BALANCE,
        label: 'ability.customers_summary_balance_report',
      },
      {
        key: ReportsAction.READ_VENDORS_SUMMARY_BALANCE,
        label: 'ability.vendors_summary_balance_report',
      },
      {
        key: ReportsAction.READ_INVENTORY_VALUATION_SUMMARY,
        label: 'ability.inventory_valuation_summary',
      },
      {
        key: ReportsAction.READ_INVENTORY_ITEM_DETAILS,
        label: 'ability.inventory_items_details',
      },
    ],
  },
  {
    subject: AbilitySubject.Preferences,
    subjectLabel: 'ability.preferences',
    extraAbilities: [
      {
        key: PreferencesAction.Mutate,
        label: 'ability.mutate_system_preferences',
      },
    ],
  },
];

/**
 * Retrieve the permissions subject.
 * @param {string} key
 * @returns {ISubjectAbilitiesSchema | null}
 */
export const getPermissionsSubject = (
  key: string
): ISubjectAbilitiesSchema | null => {
  return AbilitySchema.find((subject) => subject.subject === key);
};

/**
 * Retrieve the permission subject ability.
 * @param {String} subjectKey
 * @param {string} abilityKey
 * @returns
 */
export const getPermissionAbility = (
  subjectKey: string,
  abilityKey: string
): ISubjectAbilitySchema | null => {
  const subject = getPermissionsSubject(subjectKey);

  return subject?.abilities.find((ability) => ability.key === abilityKey);
};
