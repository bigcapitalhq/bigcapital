export const ERRORS = {
  CREDIT_NOTE_NOT_FOUND: 'CREDIT_NOTE_NOT_FOUND',
  REFUND_CREDIT_NOTE_NOT_FOUND: 'REFUND_CREDIT_NOTE_NOT_FOUND',
  CREDIT_NOTE_ALREADY_OPENED: 'CREDIT_NOTE_ALREADY_OPENED',
  ACCOUNT_INVALID_TYPE: 'ACCOUNT_INVALID_TYPE',
  CREDIT_NOTE_HAS_NO_REMAINING_AMOUNT: 'CREDIT_NOTE_HAS_NO_REMAINING_AMOUNT',
  INVOICES_HAS_NO_REMAINING_AMOUNT: 'INVOICES_HAS_NO_REMAINING_AMOUNT',
  CREDIT_NOTE_APPLY_TO_INVOICES_NOT_FOUND:
    'CREDIT_NOTE_APPLY_TO_INVOICES_NOT_FOUND',
  CREDIT_NOTE_HAS_REFUNDS_TRANSACTIONS: 'CREDIT_NOTE_HAS_REFUNDS_TRANSACTIONS',
  CREDIT_NOTE_HAS_APPLIED_INVOICES: 'CREDIT_NOTE_HAS_APPLIED_INVOICES',
  CUSTOMER_HAS_LINKED_CREDIT_NOTES: 'CUSTOMER_HAS_LINKED_CREDIT_NOTES'
};

export const DEFAULT_VIEW_COLUMNS = [];
export const DEFAULT_VIEWS = [
  {
    name: 'credit_note.view.draft',
    slug: 'draft',
    rolesLogicExpression: '1',
    roles: [
      { index: 1, fieldKey: 'status', comparator: 'equals', value: 'draft' },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'credit_note.view.published',
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
    name: 'credit_note.view.open',
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
    name: 'credit_note.view.closed',
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
