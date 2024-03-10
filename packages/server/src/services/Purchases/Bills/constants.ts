export const ERRORS = {
  BILL_NOT_FOUND: 'BILL_NOT_FOUND',
  BILL_VENDOR_NOT_FOUND: 'BILL_VENDOR_NOT_FOUND',
  BILL_ITEMS_NOT_PURCHASABLE: 'BILL_ITEMS_NOT_PURCHASABLE',
  BILL_NUMBER_EXISTS: 'BILL_NUMBER_EXISTS',
  BILL_ITEMS_NOT_FOUND: 'BILL_ITEMS_NOT_FOUND',
  BILL_ENTRIES_IDS_NOT_FOUND: 'BILL_ENTRIES_IDS_NOT_FOUND',
  NOT_PURCHASE_ABLE_ITEMS: 'NOT_PURCHASE_ABLE_ITEMS',
  BILL_ALREADY_OPEN: 'BILL_ALREADY_OPEN',
  BILL_NO_IS_REQUIRED: 'BILL_NO_IS_REQUIRED',
  BILL_HAS_ASSOCIATED_PAYMENT_ENTRIES: 'BILL_HAS_ASSOCIATED_PAYMENT_ENTRIES',
  VENDOR_HAS_BILLS: 'VENDOR_HAS_BILLS',
  BILL_HAS_ASSOCIATED_LANDED_COSTS: 'BILL_HAS_ASSOCIATED_LANDED_COSTS',
  BILL_ENTRIES_ALLOCATED_COST_COULD_DELETED:
    'BILL_ENTRIES_ALLOCATED_COST_COULD_DELETED',
  LOCATED_COST_ENTRIES_SHOULD_BIGGE_THAN_NEW_ENTRIES:
    'LOCATED_COST_ENTRIES_SHOULD_BIGGE_THAN_NEW_ENTRIES',
  LANDED_COST_ENTRIES_SHOULD_BE_INVENTORY_ITEMS:
    'LANDED_COST_ENTRIES_SHOULD_BE_INVENTORY_ITEMS',
  BILL_HAS_APPLIED_TO_VENDOR_CREDIT: 'BILL_HAS_APPLIED_TO_VENDOR_CREDIT',
  BILL_AMOUNT_SMALLER_THAN_PAID_AMOUNT: 'BILL_AMOUNT_SMALLER_THAN_PAID_AMOUNT',
};

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
    name: 'Opened',
    slug: 'opened',
    rolesLogicExpression: '1',
    roles: [
      { index: 1, fieldKey: 'status', comparator: 'equals', value: 'opened' },
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
    name: 'Partially paid',
    slug: 'partially-paid',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'status',
        comparator: 'equals',
        value: 'partially-paid',
      },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
];
