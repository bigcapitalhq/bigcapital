export const DEFAULT_VIEW_COLUMNS = [];
export const DEFAULT_VIEWS = [
  {
    name: 'Draft',
    slug: 'draft',
    rolesLogicExpression: '1',
    roles: [
      { index: 1, fieldKey: 'status', comparator: 'equals', value: 'draft' },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'Published',
    slug: 'published',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'status',
        comparator: 'equals',
        value: 'published',
      },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
];

export const ERRORS = {
  EXPENSE_NOT_FOUND: 'expense_not_found',
  EXPENSES_NOT_FOUND: 'EXPENSES_NOT_FOUND',
  PAYMENT_ACCOUNT_NOT_FOUND: 'payment_account_not_found',
  SOME_ACCOUNTS_NOT_FOUND: 'some_expenses_not_found',
  TOTAL_AMOUNT_EQUALS_ZERO: 'total_amount_equals_zero',
  PAYMENT_ACCOUNT_HAS_INVALID_TYPE: 'payment_account_has_invalid_type',
  EXPENSES_ACCOUNT_HAS_INVALID_TYPE: 'expenses_account_has_invalid_type',
  EXPENSE_ALREADY_PUBLISHED: 'expense_already_published',
  EXPENSE_HAS_ASSOCIATED_LANDED_COST: 'EXPENSE_HAS_ASSOCIATED_LANDED_COST',
};

export const ExpensesSampleData = [
  {
    'Payment Date': '2024-03-01',
    'Reference No.': 'REF-1',
    'Payment Account': 'Petty Cash',
    Description: 'Vel et dolorem architecto veniam.',
    'Currency Code': '',
    'Exchange Rate': '',
    'Expense Account': 'Utilities Expense',
    Amount: 9000,
    'Line Description': 'Voluptates voluptas corporis vel.',
    Publish: 'T',
  },
  {
    'Payment Date': '2024-03-02',
    'Reference No.': 'REF-2',
    'Payment Account': 'Petty Cash',
    Description: 'Id est molestias.',
    'Currency Code': '',
    'Exchange Rate': '',
    'Expense Account': 'Utilities Expense',
    Amount: 9000,
    'Line Description': 'Eos voluptatem cumque et voluptate reiciendis.',
    Publish: 'T',
  },
  {
    'Payment Date': '2024-03-03',
    'Reference No.': 'REF-3',
    'Payment Account': 'Petty Cash',
    Description: 'Quam cupiditate at nihil dicta dignissimos non fugit illo.',
    'Currency Code': '',
    'Exchange Rate': '',
    'Expense Account': 'Utilities Expense',
    Amount: 9000,
    'Line Description':
      'Hic alias rerum sed commodi dolores sint animi perferendis.',
    Publish: 'T',
  },
];
