export const ERRORS = {
  ACCOUNT_NOT_FOUND: 'account_not_found',
  ACCOUNT_TYPE_NOT_FOUND: 'account_type_not_found',
  PARENT_ACCOUNT_NOT_FOUND: 'parent_account_not_found',
  ACCOUNT_CODE_NOT_UNIQUE: 'account_code_not_unique',
  ACCOUNT_NAME_NOT_UNIQUE: 'account_name_not_unique',
  PARENT_ACCOUNT_HAS_DIFFERENT_TYPE: 'parent_has_different_type',
  ACCOUNT_TYPE_NOT_ALLOWED_TO_CHANGE: 'account_type_not_allowed_to_changed',
  ACCOUNT_PREDEFINED: 'account_predefined',
  ACCOUNT_HAS_ASSOCIATED_TRANSACTIONS: 'account_has_associated_transactions',
  PREDEFINED_ACCOUNTS: 'predefined_accounts',
  ACCOUNTS_HAVE_TRANSACTIONS: 'accounts_have_transactions',
  CLOSE_ACCOUNT_AND_TO_ACCOUNT_NOT_SAME_TYPE:
    'close_account_and_to_account_not_same_type',
  ACCOUNTS_NOT_FOUND: 'accounts_not_found',
  ACCOUNT_TYPE_NOT_SUPPORTS_MULTI_CURRENCY:
    'ACCOUNT_TYPE_NOT_SUPPORTS_MULTI_CURRENCY',
  ACCOUNT_CURRENCY_NOT_SAME_PARENT_ACCOUNT:
    'ACCOUNT_CURRENCY_NOT_SAME_PARENT_ACCOUNT',
  PARENT_ACCOUNT_EXCEEDED_THE_DEPTH_LEVEL:
    'PARENT_ACCOUNT_EXCEEDED_THE_DEPTH_LEVEL',
};

// Default views columns.
export const DEFAULT_VIEW_COLUMNS = [
  { key: 'name', label: 'Account name' },
  { key: 'code', label: 'Account code' },
  { key: 'account_type_label', label: 'Account type' },
  { key: 'account_normal', label: 'Account normal' },
  { key: 'amount', label: 'Balance' },
  { key: 'currencyCode', label: 'Currency' },
];

export const MAX_ACCOUNTS_CHART_DEPTH = 5;

// Accounts default views.
export const DEFAULT_VIEWS = [
  {
    name: 'Assets',
    slug: 'assets',
    rolesLogicExpression: '1',
    roles: [
      { index: 1, fieldKey: 'root_type', comparator: 'equals', value: 'asset' },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'Liabilities',
    slug: 'liabilities',
    rolesLogicExpression: '1',
    roles: [
      {
        fieldKey: 'root_type',
        index: 1,
        comparator: 'equals',
        value: 'liability',
      },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'Equity',
    slug: 'equity',
    rolesLogicExpression: '1',
    roles: [
      {
        fieldKey: 'root_type',
        index: 1,
        comparator: 'equals',
        value: 'equity',
      },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'Income',
    slug: 'income',
    rolesLogicExpression: '1',
    roles: [
      {
        fieldKey: 'root_type',
        index: 1,
        comparator: 'equals',
        value: 'income',
      },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'Expenses',
    slug: 'expenses',
    rolesLogicExpression: '1',
    roles: [
      {
        fieldKey: 'root_type',
        index: 1,
        comparator: 'equals',
        value: 'expense',
      },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
];
