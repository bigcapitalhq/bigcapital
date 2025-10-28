import { ACCOUNT_TYPE } from '@/constants/accounts';

export const ERRORS = {
  CASHFLOW_TRANSACTION_TYPE_INVALID: 'CASHFLOW_TRANSACTION_TYPE_INVALID',
  CASHFLOW_ACCOUNTS_HAS_INVALID_TYPE: 'CASHFLOW_ACCOUNTS_HAS_INVALID_TYPE',
  CASHFLOW_TRANSACTION_NOT_FOUND: 'CASHFLOW_TRANSACTION_NOT_FOUND',
  CASHFLOW_ACCOUNTS_IDS_NOT_FOUND: 'CASHFLOW_ACCOUNTS_IDS_NOT_FOUND',
  CREDIT_ACCOUNTS_IDS_NOT_FOUND: 'CREDIT_ACCOUNTS_IDS_NOT_FOUND',
  CREDIT_ACCOUNTS_HAS_INVALID_TYPE: 'CREDIT_ACCOUNTS_HAS_INVALID_TYPE',
  ACCOUNT_ID_HAS_INVALID_TYPE: 'ACCOUNT_ID_HAS_INVALID_TYPE',
  ACCOUNT_HAS_ASSOCIATED_TRANSACTIONS: 'account_has_associated_transactions',
  TRANSACTION_ALREADY_CATEGORIZED: 'TRANSACTION_ALREADY_CATEGORIZED',
  TRANSACTION_ALREADY_UNCATEGORIZED: 'TRANSACTION_ALREADY_UNCATEGORIZED',
  UNCATEGORIZED_TRANSACTION_TYPE_INVALID:
    'UNCATEGORIZED_TRANSACTION_TYPE_INVALID',
  CANNOT_DELETE_TRANSACTION_CONVERTED_FROM_UNCATEGORIZED:
    'CANNOT_DELETE_TRANSACTION_CONVERTED_FROM_UNCATEGORIZED',
  CANNOT_CATEGORIZE_EXCLUDED_TRANSACTION:
    'CANNOT_CATEGORIZE_EXCLUDED_TRANSACTION',
  TRANSACTION_NOT_CATEGORIZED: 'TRANSACTION_NOT_CATEGORIZED',
  TRANSACTION_NOT_PENDING: 'TRANSACTION_NOT_PENDING',
};

export enum CASHFLOW_DIRECTION {
  IN = 'In',
  OUT = 'Out',
}

export enum CASHFLOW_TRANSACTION_TYPE {
  ONWERS_DRAWING = 'OwnerDrawing',
  OWNER_CONTRIBUTION = 'OwnerContribution',
  OTHER_INCOME = 'OtherIncome',
  TRANSFER_FROM_ACCOUNT = 'TransferFromAccount',
  TRANSFER_TO_ACCOUNT = 'TransferToAccount',
  OTHER_EXPENSE = 'OtherExpense',
}

export const CASHFLOW_TRANSACTION_TYPE_META = {
  [`${CASHFLOW_TRANSACTION_TYPE.ONWERS_DRAWING}`]: {
    type: 'OwnerDrawing',
    direction: CASHFLOW_DIRECTION.OUT,
    creditType: [ACCOUNT_TYPE.EQUITY],
  },
  [`${CASHFLOW_TRANSACTION_TYPE.OWNER_CONTRIBUTION}`]: {
    type: 'OwnerContribution',
    direction: CASHFLOW_DIRECTION.IN,
    creditType: [ACCOUNT_TYPE.EQUITY],
  },
  [`${CASHFLOW_TRANSACTION_TYPE.OTHER_INCOME}`]: {
    type: 'OtherIncome',
    direction: CASHFLOW_DIRECTION.IN,
    creditType: [ACCOUNT_TYPE.INCOME, ACCOUNT_TYPE.OTHER_INCOME],
  },
  [`${CASHFLOW_TRANSACTION_TYPE.TRANSFER_FROM_ACCOUNT}`]: {
    type: 'TransferFromAccount',
    direction: CASHFLOW_DIRECTION.IN,
    creditType: [
      ACCOUNT_TYPE.CASH,
      ACCOUNT_TYPE.BANK,
      ACCOUNT_TYPE.CREDIT_CARD,
    ],
  },
  [`${CASHFLOW_TRANSACTION_TYPE.TRANSFER_TO_ACCOUNT}`]: {
    type: 'TransferToAccount',
    direction: CASHFLOW_DIRECTION.OUT,
    creditType: [
      ACCOUNT_TYPE.CASH,
      ACCOUNT_TYPE.BANK,
      ACCOUNT_TYPE.CREDIT_CARD,
    ],
  },
  [`${CASHFLOW_TRANSACTION_TYPE.OTHER_EXPENSE}`]: {
    type: 'OtherExpense',
    direction: CASHFLOW_DIRECTION.OUT,
    creditType: [
      ACCOUNT_TYPE.EXPENSE,
      ACCOUNT_TYPE.OTHER_EXPENSE,
      ACCOUNT_TYPE.COST_OF_GOODS_SOLD,
    ],
  },
};

export interface ICashflowTransactionTypeMeta {
  type: string;
  direction: CASHFLOW_DIRECTION;
  creditType: string[];
}

export const BankTransactionsSampleData = [
  {
    Amount: '6,410.19',
    Date: '2024-03-26',
    Payee: 'MacGyver and Sons',
    'Reference No.': 'REF-1',
    Description: 'Commodi quo labore.',
  },
  {
    Amount: '8,914.17',
    Date: '2024-01-05',
    Payee: 'Eichmann - Bergnaum',
    'Reference No.': 'REF-1',
    Description: 'Quia enim et.',
  },
  {
    Amount: '6,200.88',
    Date: '2024-02-17',
    Payee: 'Luettgen, Mraz and Legros',
    'Reference No.': 'REF-1',
    Description: 'Occaecati consequuntur cum impedit illo.',
  },
];

export const CashflowTransactionTypes = {
  OtherIncome: 'transaction_type.other_income',
  OtherExpense: 'transaction_type.other_expense',
  OwnerDrawing: 'transaction_type.owner_drawing',
  OwnerContribution: 'transaction_type.owner_contribution',
  TransferToAccount: 'transaction_type.transfer_to_account',
  TransferFromAccount: 'transaction_type.transfer_from_account',
};

export const TransactionTypes = {
  SaleInvoice: 'transaction_type.sale_invoice',
  SaleReceipt: 'transaction_type.sale_receipt',
  PaymentReceive: 'transaction_type.payment_received',
  Bill: 'transaction_type.bill',
  BillPayment: 'transaction_type.payment_made',
  VendorOpeningBalance: 'transaction_type.vendor_opening_balance',
  CustomerOpeningBalance: 'transaction_type.customer_opening_balance',
  InventoryAdjustment: 'transaction_type.inventory_adjustment',
  ManualJournal: 'transaction_type.manual_journal',
  Journal: 'transaction_type.manual_journal',
  Expense: 'transaction_type.expense',
  OwnerContribution: 'transaction_type.owner_contribution',
  TransferToAccount: 'transaction_type.transfer_to_account',
  TransferFromAccount: 'transaction_type.transfer_from_account',
  OtherIncome: 'transaction_type.other_income',
  OtherExpense: 'transaction_type.other_expense',
  OwnerDrawing: 'transaction_type.owner_drawing',
  InvoiceWriteOff: 'transaction_type.invoice_write_off',
  CreditNote: 'transaction_type.credit_note',
  VendorCredit: 'transaction_type.vendor_credit',
  RefundCreditNote: 'transaction_type.refund_credit_note',
  RefundVendorCredit: 'transaction_type.refund_vendor_credit',
  LandedCost: 'transaction_type.landed_cost',
  CashflowTransaction: CashflowTransactionTypes,
};
