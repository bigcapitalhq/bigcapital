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
  CUSTOMER_HAS_LINKED_CREDIT_NOTES: 'CUSTOMER_HAS_LINKED_CREDIT_NOTES',
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

export const defaultCreditNoteBrandingAttributes = {
  // # Colors
  primaryColor: '',
  secondaryColor: '',
  
  // # Company logo
  showCompanyLogo: true,
  companyLogoKey: '',
  companyLogoUri: '',

  // # Company name
  companyName: 'Bigcapital Technology, Inc.',

  // # Customer address
  showCustomerAddress: true,
  customerAddress: '',

  // # Company address
  showCompanyAddress: true,
  companyAddress: '',
  billedToLabel: 'Billed To',

  // Total
  total: '$1000.00',
  totalLabel: 'Total',
  showTotal: true,

  // Subtotal
  subtotal: '1000/00',
  subtotalLabel: 'Subtotal',
  showSubtotal: true,

  // Customer note
  showCustomerNote: true,
  customerNote:
    'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  customerNoteLabel: 'Customer Note',

  // Terms & conditions
  showTermsConditions: true,
  termsConditions:
    'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  termsConditionsLabel: 'Terms & Conditions',

  lines: [
    {
      item: 'Simply dummy text',
      description: 'Simply dummy text of the printing and typesetting',
      rate: '1',
      quantity: '1000',
      total: '$1000.00',
    },
  ],
  // Credit note number.
  showCreditNoteNumber: true,
  creditNoteNumberLabel: 'Credit Note Number',
  creditNoteNumebr: '346D3D40-0001',

  // Credit note date.
  creditNoteDate: 'September 3, 2024',
  showCreditNoteDate: true,
  creditNoteDateLabel: 'Credit Note Date',
};
