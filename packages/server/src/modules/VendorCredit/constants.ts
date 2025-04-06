export const ERRORS = {
  VENDOR_CREDIT_NOT_FOUND: 'VENDOR_CREDIT_NOT_FOUND',
  VENDOR_CREDIT_ALREADY_OPENED: 'VENDOR_CREDIT_ALREADY_OPENED',
  VENDOR_CREDIT_HAS_NO_REMAINING_AMOUNT:
    'VENDOR_CREDIT_HAS_NO_REMAINING_AMOUNT',
  VENDOR_CREDIT_APPLY_TO_BILLS_NOT_FOUND:
    'VENDOR_CREDIT_APPLY_TO_BILLS_NOT_FOUND',
  BILLS_HAS_NO_REMAINING_AMOUNT: 'BILLS_HAS_NO_REMAINING_AMOUNT',
  VENDOR_CREDIT_HAS_REFUND_TRANSACTIONS:
    'VENDOR_CREDIT_HAS_REFUND_TRANSACTIONS',
  VENDOR_CREDIT_HAS_APPLIED_BILLS: 'VENDOR_CREDIT_HAS_APPLIED_BILLS',
};

export const DEFAULT_VIEW_COLUMNS = [];
export const DEFAULT_VIEWS = [
  {
    name: 'vendor_credit.view.draft',
    slug: 'draft',
    rolesLogicExpression: '1',
    roles: [
      { index: 1, fieldKey: 'status', comparator: 'equals', value: 'draft' },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'vendor_credit.view.published',
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
  {
    name: 'vendor_credit.view.open',
    slug: 'open',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'status',
        comparator: 'equals',
        value: 'open',
      },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'vendor_credit.view.closed',
    slug: 'closed',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'status',
        comparator: 'equals',
        value: 'closed',
      },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
];

export const VendorCreditsSampleData = [
  {
    Vendor: 'Randall Kohler VENDOR',
    'Vendor Credit Date': '2024-01-01',
    'Vendor Credit No.': 'VC-0001',
    'Reference No.': 'REF-00001',
    'Exchange Rate': '',
    Note: 'Note',
    Open: 'T',
    'Item Name': 'Hettinger, Schumm and Bartoletti',
    Quantity: 100,
    Rate: 100,
  },
];
