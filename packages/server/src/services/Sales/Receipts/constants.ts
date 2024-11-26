export const DEFAULT_RECEIPT_MAIL_SUBJECT =
  'Receipt {Receipt Number} from {Company Name}';
export const DEFAULT_RECEIPT_MAIL_CONTENT = `Hi {Customer Name},

Here's receipt # {Receipt Number} for Receipt {Receipt Amount}

The receipt paid on {Receipt Date}, and the total amount paid is {Receipt Amount}.

Please find your sale receipt attached to this email for your reference

If you have any questions, please let us know.

Thanks,
{Company Name}`;

export const ERRORS = {
  SALE_RECEIPT_NOT_FOUND: 'SALE_RECEIPT_NOT_FOUND',
  DEPOSIT_ACCOUNT_NOT_FOUND: 'DEPOSIT_ACCOUNT_NOT_FOUND',
  DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET: 'DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET',
  SALE_RECEIPT_NUMBER_NOT_UNIQUE: 'SALE_RECEIPT_NUMBER_NOT_UNIQUE',
  SALE_RECEIPT_IS_ALREADY_CLOSED: 'SALE_RECEIPT_IS_ALREADY_CLOSED',
  SALE_RECEIPT_NO_IS_REQUIRED: 'SALE_RECEIPT_NO_IS_REQUIRED',
  CUSTOMER_HAS_SALES_INVOICES: 'CUSTOMER_HAS_SALES_INVOICES',
  NO_INVOICE_CUSTOMER_EMAIL_ADDR: 'NO_INVOICE_CUSTOMER_EMAIL_ADDR',
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
    name: 'Closed',
    slug: 'closed',
    rolesLogicExpression: '1',
    roles: [
      { index: 1, fieldKey: 'status', comparator: 'equals', value: 'closed' },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
];

export const SaleReceiptsSampleData = [
  {
    'Receipt Date': '2023-01-01',
    Customer: 'Randall Kohler',
    'Deposit Account': 'Petty Cash',
    'Exchange Rate': '',
    'Receipt Number': 'REC-00001',
    'Reference No.': 'REF-0001',
    Statement: 'Delectus unde aut soluta et accusamus placeat.',
    'Receipt Message': 'Vitae asperiores dicta.',
    Closed: 'T',
    Item: 'Schmitt Group',
    Quantity: 100,
    Rate: 200,
    'Line Description':
      'Distinctio distinctio sit veritatis consequatur iste quod veritatis.',
  },
];

export const defaultSaleReceiptBrandingAttributes = {
  primaryColor: '',
  secondaryColor: '',
  companyName: 'Bigcapital Technology, Inc.',

  // # Company logo
  showCompanyLogo: true,
  companyLogoUri: '',
  companyLogoKey: '',

  // # Customer address
  showCustomerAddress: true,
  customerAddress: '',

  // # Company address
  showCompanyAddress: true,
  companyAddress: '',
  billedToLabel: 'Billed To',

  // # Total
  total: '$1000.00',
  totalLabel: 'Total',
  showTotal: true,

  subtotal: '1000/00',
  subtotalLabel: 'Subtotal',
  showSubtotal: true,

  showCustomerNote: true,
  customerNote:
    'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  customerNoteLabel: 'Customer Note',

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
  showReceiptNumber: true,
  receiptNumberLabel: 'Receipt Number',
  receiptNumebr: '346D3D40-0001',

  receiptDate: 'September 3, 2024',
  showReceiptDate: true,
  receiptDateLabel: 'Receipt Date',
};
