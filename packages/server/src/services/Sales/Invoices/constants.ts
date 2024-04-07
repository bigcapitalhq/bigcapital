export const DEFAULT_INVOICE_MAIL_SUBJECT =
  'Invoice {InvoiceNumber} from {CompanyName}';
export const DEFAULT_INVOICE_MAIL_CONTENT = `
<p>Dear {CustomerName}</p>
<p>Thank you for your business, You can view or print your invoice from attachements.</p>
<p>
Invoice <strong>#{InvoiceNumber}</strong><br />
Due Date : <strong>{InvoiceDueDate}</strong><br />
Amount   : <strong>{InvoiceAmount}</strong></br />
</p>

<p>
<i>Regards</i><br />
<i>{CompanyName}</i>
</p>
`;

export const DEFAULT_INVOICE_REMINDER_MAIL_SUBJECT =
  'Invoice {InvoiceNumber} reminder from {CompanyName}';
export const DEFAULT_INVOICE_REMINDER_MAIL_CONTENT = `
<p>Dear {CustomerName}</p>
<p>You might have missed the payment date and the invoice is now overdue by {OverdueDays} days.</p>
<p>Invoice <strong>#{InvoiceNumber}</strong><br />
Due Date : <strong>{InvoiceDueDate}</strong><br />
Amount   : <strong>{InvoiceAmount}</strong></p>

<p>
<i>Regards</i><br />
<i>{CompanyName}</i>
</p>
`;

export const ERRORS = {
  INVOICE_NUMBER_NOT_UNIQUE: 'INVOICE_NUMBER_NOT_UNIQUE',
  SALE_INVOICE_NOT_FOUND: 'SALE_INVOICE_NOT_FOUND',
  SALE_INVOICE_ALREADY_DELIVERED: 'SALE_INVOICE_ALREADY_DELIVERED',
  ENTRIES_ITEMS_IDS_NOT_EXISTS: 'ENTRIES_ITEMS_IDS_NOT_EXISTS',
  NOT_SELLABLE_ITEMS: 'NOT_SELLABLE_ITEMS',
  SALE_INVOICE_NO_NOT_UNIQUE: 'SALE_INVOICE_NO_NOT_UNIQUE',
  INVOICE_AMOUNT_SMALLER_THAN_PAYMENT_AMOUNT:
    'INVOICE_AMOUNT_SMALLER_THAN_PAYMENT_AMOUNT',
  INVOICE_HAS_ASSOCIATED_PAYMENT_ENTRIES:
    'INVOICE_HAS_ASSOCIATED_PAYMENT_ENTRIES',
  SALE_INVOICE_NO_IS_REQUIRED: 'SALE_INVOICE_NO_IS_REQUIRED',
  CUSTOMER_HAS_SALES_INVOICES: 'CUSTOMER_HAS_SALES_INVOICES',
  SALE_INVOICE_HAS_APPLIED_TO_CREDIT_NOTES:
    'SALE_INVOICE_HAS_APPLIED_TO_CREDIT_NOTES',
  PAYMENT_ACCOUNT_CURRENCY_INVALID: 'PAYMENT_ACCOUNT_CURRENCY_INVALID',
  SALE_INVOICE_ALREADY_WRITTEN_OFF: 'SALE_INVOICE_ALREADY_WRITTEN_OFF',
  SALE_INVOICE_NOT_WRITTEN_OFF: 'SALE_INVOICE_NOT_WRITTEN_OFF',
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
    name: 'Delivered',
    slug: 'delivered',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'status',
        comparator: 'equals',
        value: 'delivered',
      },
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
  {
    name: 'Paid',
    slug: 'paid',
    rolesLogicExpression: '1',
    roles: [
      { index: 1, fieldKey: 'status', comparator: 'equals', value: 'paid' },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
];

export const SaleInvoicesSampleData = [
  {
    'Invoice No.': 'B-101',
    'Reference No.': 'REF0',
    'Invoice Date': '2024-01-01',
    'Due Date': '2024-03-01',
    Customer: 'Harley Veum',
    'Exchange Rate': 1,
    'Invoice Message': 'Aspernatur doloremque amet quia aut.',
    'Terms & Conditions': 'Quia illum aut dolores.',
    Delivered: 'T',
    Item: 'VonRueden, Ruecker and Hettinger',
    Quantity: 100,
    Rate: 100,
    Description: 'Description',
  },
  {
    'Invoice No.': 'B-102',
    'Reference No.': 'REF0',
    'Invoice Date': '2024-01-01',
    'Due Date': '2024-03-01',
    Customer: 'Harley Veum',
    'Exchange Rate': 1,
    'Invoice Message': 'Est omnis enim vel.',
    'Terms & Conditions': 'Iusto et sint nobis sit.',
    Delivered: 'T',
    Item: 'Thompson - Reichert',
    Quantity: 200,
    Rate: 50,
    Description: 'Description',
  },
  {
    'Invoice No.': 'B-103',
    'Reference No.': 'REF0',
    'Invoice Date': '2024-01-01',
    'Due Date': '2024-03-01',
    Customer: 'Harley Veum',
    'Exchange Rate': 1,
    'Invoice Message':
      'Repudiandae voluptatibus repellat minima voluptatem rerum veniam.',
    'Terms & Conditions': 'Id quod inventore ex rerum velit sed.',
    Delivered: 'T',
    Item: 'VonRueden, Ruecker and Hettinger',
    Quantity: 100,
    Rate: 100,
    Description: 'Description',
  },
];
