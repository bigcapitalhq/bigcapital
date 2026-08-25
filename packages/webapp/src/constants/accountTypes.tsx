export const ACCOUNT_TYPE = {
  CASH: 'cash',
  BANK: 'bank',
  ACCOUNTS_RECEIVABLE: 'accounts-receivable',
  INVENTORY: 'inventory',
  OTHER_CURRENT_ASSET: 'other-current-asset',
  FIXED_ASSET: 'fixed-asset',
  NON_CURRENT_ASSET: 'non-current-asset',

  ACCOUNTS_PAYABLE: 'accounts-payable',
  CREDIT_CARD: 'credit-card',
  TAX_PAYABLE: 'tax-payable',
  OTHER_CURRENT_LIABILITY: 'other-current-liability',
  LOGN_TERM_LIABILITY: 'long-term-liability',
  NON_CURRENT_LIABILITY: 'non-current-liability',

  EQUITY: 'equity',
  INCOME: 'income',
  OTHER_INCOME: 'other-income',
  COST_OF_GOODS_SOLD: 'cost-of-goods-sold',
  EXPENSE: 'expense',
  OTHER_EXPENSE: 'other-expense',
} as const;

export const ACCOUNT_PARENT_TYPE = {
  CURRENT_ASSET: 'current-asset',
  FIXED_ASSET: 'fixed-asset',
  NON_CURRENT_ASSET: 'non-current-asset',

  CURRENT_LIABILITY: 'current-liability',
  LOGN_TERM_LIABILITY: 'long-term-liability',
  NON_CURRENT_LIABILITY: 'non-current-liability',

  EQUITY: 'equity',
  EXPENSE: 'expense',
  INCOME: 'income',
} as const;

export const ACCOUNT_ROOT_TYPE = {
  ASSET: 'asset',
  LIABILITY: 'liability',
  EQUITY: 'equity',
  EXPENSE: 'expense',
  INCOME: 'income',
} as const;

export const ACCOUNT_NORMAL = {
  CREDIT: 'credit',
  DEBIT: 'debit',
} as const;

export interface AccountTypeOption {
  label: string;
  key: (typeof ACCOUNT_TYPE)[keyof typeof ACCOUNT_TYPE];
  normal: (typeof ACCOUNT_NORMAL)[keyof typeof ACCOUNT_NORMAL];
  parentType: (typeof ACCOUNT_PARENT_TYPE)[keyof typeof ACCOUNT_PARENT_TYPE];
  rootType: (typeof ACCOUNT_ROOT_TYPE)[keyof typeof ACCOUNT_ROOT_TYPE];
  balanceSheet: boolean;
  incomeSheet: boolean;
}

export const ACCOUNT_TYPES: AccountTypeOption[] = [
  {
    label: 'Cash',
    key: ACCOUNT_TYPE.CASH,
    normal: ACCOUNT_NORMAL.DEBIT,
    parentType: ACCOUNT_PARENT_TYPE.CURRENT_ASSET,
    rootType: ACCOUNT_ROOT_TYPE.ASSET,
    balanceSheet: true,
    incomeSheet: false,
  },
  {
    label: 'Bank',
    key: ACCOUNT_TYPE.BANK,
    normal: ACCOUNT_NORMAL.DEBIT,
    parentType: ACCOUNT_PARENT_TYPE.CURRENT_ASSET,
    rootType: ACCOUNT_ROOT_TYPE.ASSET,
    balanceSheet: true,
    incomeSheet: false,
  },
  {
    label: 'Accounts Receivable',
    key: ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE,
    normal: ACCOUNT_NORMAL.DEBIT,
    rootType: ACCOUNT_ROOT_TYPE.ASSET,
    parentType: ACCOUNT_PARENT_TYPE.CURRENT_ASSET,
    balanceSheet: true,
    incomeSheet: false,
  },
  {
    label: 'Inventory',
    key: ACCOUNT_TYPE.INVENTORY,
    normal: ACCOUNT_NORMAL.DEBIT,
    rootType: ACCOUNT_ROOT_TYPE.ASSET,
    parentType: ACCOUNT_PARENT_TYPE.CURRENT_ASSET,
    balanceSheet: true,
    incomeSheet: false,
  },
  {
    label: 'Other Current Asset',
    key: ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
    normal: ACCOUNT_NORMAL.DEBIT,
    rootType: ACCOUNT_ROOT_TYPE.ASSET,
    parentType: ACCOUNT_PARENT_TYPE.CURRENT_ASSET,
    balanceSheet: true,
    incomeSheet: false,
  },
  {
    label: 'Fixed Asset',
    key: ACCOUNT_TYPE.FIXED_ASSET,
    normal: ACCOUNT_NORMAL.DEBIT,
    rootType: ACCOUNT_ROOT_TYPE.ASSET,
    parentType: ACCOUNT_PARENT_TYPE.FIXED_ASSET,
    balanceSheet: true,
    incomeSheet: false,
  },
  {
    label: 'Non-Current Asset',
    key: ACCOUNT_TYPE.NON_CURRENT_ASSET,
    normal: ACCOUNT_NORMAL.DEBIT,
    rootType: ACCOUNT_ROOT_TYPE.ASSET,
    parentType: ACCOUNT_PARENT_TYPE.FIXED_ASSET,
    balanceSheet: true,
    incomeSheet: false,
  },
  {
    label: 'Accounts Payable',
    key: ACCOUNT_TYPE.ACCOUNTS_PAYABLE,
    normal: ACCOUNT_NORMAL.CREDIT,
    rootType: ACCOUNT_ROOT_TYPE.LIABILITY,
    parentType: ACCOUNT_PARENT_TYPE.CURRENT_LIABILITY,
    balanceSheet: true,
    incomeSheet: false,
  },
  {
    label: 'Credit Card',
    key: ACCOUNT_TYPE.CREDIT_CARD,
    normal: ACCOUNT_NORMAL.CREDIT,
    rootType: ACCOUNT_ROOT_TYPE.LIABILITY,
    parentType: ACCOUNT_PARENT_TYPE.CURRENT_LIABILITY,
    balanceSheet: true,
    incomeSheet: false,
  },
  {
    label: 'Tax Payable',
    key: ACCOUNT_TYPE.TAX_PAYABLE,
    normal: ACCOUNT_NORMAL.CREDIT,
    rootType: ACCOUNT_ROOT_TYPE.LIABILITY,
    parentType: ACCOUNT_PARENT_TYPE.CURRENT_LIABILITY,
    balanceSheet: true,
    incomeSheet: false,
  },
  {
    label: 'Other Current Liability',
    key: ACCOUNT_TYPE.OTHER_CURRENT_LIABILITY,
    normal: ACCOUNT_NORMAL.CREDIT,
    rootType: ACCOUNT_ROOT_TYPE.LIABILITY,
    parentType: ACCOUNT_PARENT_TYPE.CURRENT_LIABILITY,
    balanceSheet: false,
    incomeSheet: true,
  },
  {
    label: 'Long Term Liability',
    key: ACCOUNT_TYPE.LOGN_TERM_LIABILITY,
    normal: ACCOUNT_NORMAL.CREDIT,
    rootType: ACCOUNT_ROOT_TYPE.LIABILITY,
    parentType: ACCOUNT_PARENT_TYPE.LOGN_TERM_LIABILITY,
    balanceSheet: false,
    incomeSheet: true,
  },
  {
    label: 'Non-Current Liability',
    key: ACCOUNT_TYPE.NON_CURRENT_LIABILITY,
    normal: ACCOUNT_NORMAL.CREDIT,
    rootType: ACCOUNT_ROOT_TYPE.LIABILITY,
    parentType: ACCOUNT_PARENT_TYPE.NON_CURRENT_LIABILITY,
    balanceSheet: false,
    incomeSheet: true,
  },
  {
    label: 'Equity',
    key: ACCOUNT_TYPE.EQUITY,
    normal: ACCOUNT_NORMAL.CREDIT,
    rootType: ACCOUNT_ROOT_TYPE.EQUITY,
    parentType: ACCOUNT_PARENT_TYPE.EQUITY,
    balanceSheet: true,
    incomeSheet: false,
  },
  {
    label: 'Income',
    key: ACCOUNT_TYPE.INCOME,
    normal: ACCOUNT_NORMAL.CREDIT,
    rootType: ACCOUNT_ROOT_TYPE.INCOME,
    parentType: ACCOUNT_PARENT_TYPE.INCOME,
    balanceSheet: false,
    incomeSheet: true,
  },
  {
    label: 'Other Income',
    key: ACCOUNT_TYPE.OTHER_INCOME,
    normal: ACCOUNT_NORMAL.CREDIT,
    rootType: ACCOUNT_ROOT_TYPE.INCOME,
    parentType: ACCOUNT_PARENT_TYPE.INCOME,
    balanceSheet: false,
    incomeSheet: true,
  },
  {
    label: 'Cost of Goods Sold',
    key: ACCOUNT_TYPE.COST_OF_GOODS_SOLD,
    normal: ACCOUNT_NORMAL.DEBIT,
    rootType: ACCOUNT_ROOT_TYPE.EXPENSE,
    parentType: ACCOUNT_PARENT_TYPE.EXPENSE,
    balanceSheet: false,
    incomeSheet: true,
  },
  {
    label: 'Expense',
    key: ACCOUNT_TYPE.EXPENSE,
    normal: ACCOUNT_NORMAL.DEBIT,
    rootType: ACCOUNT_ROOT_TYPE.EXPENSE,
    parentType: ACCOUNT_PARENT_TYPE.EXPENSE,
    balanceSheet: false,
    incomeSheet: true,
  },
  {
    label: 'Other Expense',
    key: ACCOUNT_TYPE.OTHER_EXPENSE,
    normal: ACCOUNT_NORMAL.DEBIT,
    rootType: ACCOUNT_ROOT_TYPE.EXPENSE,
    parentType: ACCOUNT_PARENT_TYPE.EXPENSE,
    balanceSheet: false,
    incomeSheet: true,
  },
];

export const FOREIGN_CURRENCY_ACCOUNTS: string[] = ['cash', 'bank'];
