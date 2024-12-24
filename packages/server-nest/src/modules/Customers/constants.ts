export const DEFAULT_VIEW_COLUMNS = [];

export const DEFAULT_VIEWS = [
  {
    name: 'Overdue',
    slug: 'overdue',
    rolesLogicExpression: '1',
    roles: [
      { index: 1, fieldKey: 'status', comparator: 'equals', value: 'overdue' },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'Unpaid',
    slug: 'unpaid',
    rolesLogicExpression: '1',
    roles: [
      { index: 1, fieldKey: 'status', comparator: 'equals', value: 'unpaid' },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
];

export const ERRORS = {
  CUSTOMER_HAS_TRANSACTIONS: 'CUSTOMER_HAS_TRANSACTIONS',
  CUSTOMER_ALREADY_ACTIVE: 'CUSTOMER_ALREADY_ACTIVE',
};
