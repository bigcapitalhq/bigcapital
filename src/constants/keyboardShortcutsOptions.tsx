// @ts-nocheck
import intl from 'react-intl-universal';
import {
  AbilitySubject,
  AccountAction,
  BillAction,
  CashflowAction,
  CustomerAction,
  ExpenseAction,
  ItemAction,
  ManualJournalAction,
  ReportsAction,
  SaleEstimateAction,
  SaleInvoiceAction,
  SaleReceiptAction,
  VendorAction,
} from './abilityOption';

export default [
  {
    shortcut_key: 'Shift + I',
    description: intl.get('jump_to_the_invoices'),
    permission: {
      ability: SaleInvoiceAction.View,
      subject: AbilitySubject.Invoice,
    },
  },
  {
    shortcut_key: 'Shift + E',
    description: intl.get('jump_to_the_estimates'),
    permission: {
      ability: SaleEstimateAction.View,
      subject: AbilitySubject.Estimate,
    },
  },
  {
    shortcut_key: 'Shift + R',
    description: intl.get('jump_to_the_receipts'),
    permission: {
      ability: SaleReceiptAction.View,
      subject: AbilitySubject.Receipt,
    },
  },
  {
    shortcut_key: 'Shift + X',
    description: intl.get('jump_to_the_expenses'),
    permission: {
      ability: ExpenseAction.View,
      subject: AbilitySubject.Expense,
    },
  },
  {
    shortcut_key: 'Shift + C',
    description: intl.get('jump_to_the_customers'),
    permission: {
      ability: CustomerAction.View,
      subject: AbilitySubject.Customer,
    },
  },
  {
    shortcut_key: 'Shift + V',
    description: intl.get('jump_to_the_vendors'),
    permission: {
      ability: VendorAction.View,
      subject: AbilitySubject.Vendor,
    },
  },
  {
    shortcut_key: 'Shift + A',
    description: intl.get('jump_to_the_chart_of_accounts'),
    permission: {
      ability: AccountAction.View,
      subject: AbilitySubject.Account,
    },
  },
  {
    shortcut_key: 'Shift + B',
    description: intl.get('jump_to_the_bills'),
    permission: {
      ability: BillAction.View,
      subject: AbilitySubject.Bill,
    },
  },
  {
    shortcut_key: 'Shift + M',
    description: intl.get('jump_to_the_manual_journals'),
    permission: {
      ability: ManualJournalAction.View,
      subject: AbilitySubject.ManualJournal,
    },
  },
  {
    shortcut_key: 'Shift + W',
    description: intl.get('jump_to_the_items'),
    permission: {
      ability: ItemAction.View,
      subject: AbilitySubject.Item,
    },
  },
  {
    shortcut_key: 'Shift + D',
    description: intl.get('jump_to_the_add_money_in'),
    permission: {
      ability: CashflowAction.Create,
      subject: AbilitySubject.Cashflow,
    },
  },
  {
    shortcut_key: 'Shift + Q',
    description: intl.get('jump_to_the_add_money_out'),
    permission: {
      ability: CashflowAction.Create,
      subject: AbilitySubject.Cashflow,
    },
  },
  {
    shortcut_key: 'Shift + 1',
    description: intl.get('jump_to_the_balance_sheet'),
    permission: {
      ability: ReportsAction.READ_BALANCE_SHEET,
      subject: AbilitySubject.Report,
    },
  },
  {
    shortcut_key: 'Shift + 2',
    description: intl.get('jump_to_the_profit_loss_sheet'),
    permission: {
      ability: ReportsAction.READ_PROFIT_LOSS,
      subject: AbilitySubject.Report,
    },
  },
  {
    shortcut_key: 'Shift + 3',
    description: intl.get('jump_to_the_journal_sheet'),
    permission: {
      ability: ReportsAction.READ_JOURNAL,
      subject: AbilitySubject.Report,
    },
  },
  {
    shortcut_key: 'Shift + 4',
    description: intl.get('jump_to_the_general_ledger_sheet'),
    permission: {
      ability: ReportsAction.READ_GENERAL_LEDGET,
      subject: AbilitySubject.Report,
    },
  },
  {
    shortcut_key: 'Shift + 5',
    description: intl.get('jump_to_the_trial_balance_sheet'),
    permission: {
      ability: ReportsAction.READ_TRIAL_BALANCE_SHEET,
      subject: AbilitySubject.Report,
    },
  },
  {
    shortcut_key: 'Ctrl + Shift  + I ',
    description: intl.get('create_a_new_invoice'),
    permission: {
      ability: SaleInvoiceAction.Create,
      subject: AbilitySubject.Invoice,
    },
  },
  {
    shortcut_key: 'Ctrl + Shift  + E ',
    description: intl.get('create_a_new_estimate'),
    permission: {
      ability: SaleEstimateAction.Create,
      subject: AbilitySubject.Estimate,
    },
  },
  {
    shortcut_key: 'Ctrl + Shift  + R ',
    description: intl.get('create_a_new_receipt'),
    permission: {
      ability: SaleReceiptAction.Create,
      subject: AbilitySubject.Receipt,
    },
  },
  {
    shortcut_key: 'Ctrl + Shift  + X ',
    description: intl.get('create_a_new_expense'),
    permission: {
      ability: ExpenseAction.Create,
      subject: AbilitySubject.Expense,
    },
  },
  {
    shortcut_key: 'Ctrl + Shift  + C ',
    description: intl.get('create_a_new_customer'),
    permission: {
      ability: CustomerAction.Create,
      subject: AbilitySubject.Customer,
    },
  },
  {
    shortcut_key: 'Ctrl + Shift  + V ',
    description: intl.get('create_a_new_vendor'),
    permission: {
      ability: VendorAction.Create,
      subject: AbilitySubject.Vendor,
    },
  },
  {
    shortcut_key: 'Ctrl + Shift  + B ',
    description: intl.get('create_a_new_bill'),
    permission: {
      ability: BillAction.Create,
      subject: AbilitySubject.Bill,
    },
  },
  {
    shortcut_key: 'Ctrl + Shift  + M ',
    description: intl.get('create_a_new_journal'),
    permission: {
      ability: ManualJournalAction.Create,
      subject: AbilitySubject.ManualJournal,
    },
  },
  {
    shortcut_key: 'Ctrl + Shift  + W ',
    description: intl.get('create_a_new_item'),
    permission: {
      ability: ItemAction.Create,
      subject: AbilitySubject.Item,
    },
  },
  {
    shortcut_key: 'Ctrl + / ',
    description: intl.get('close_and_open_sidebar'),
  },
];
