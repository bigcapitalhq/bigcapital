export const DEFAULT_RECEIPT_MAIL_SUBJECT =
  'Receipt {ReceiptNumber} from {CompanyName}';
export const DEFAULT_RECEIPT_MAIL_CONTENT = `
<p>Dear {CustomerName}</p>
<p>Thank you for your business, You can view or print your receipt from attachements.</p>
<p>
Receipt <strong>#{ReceiptNumber}</strong><br />
Amount  : <strong>{ReceiptAmount}</strong></br />
</p>

<p>
<i>Regards</i><br />
<i>{CompanyName}</i>
</p>
`;

export const ERRORS = {
  SALE_RECEIPT_NOT_FOUND: 'SALE_RECEIPT_NOT_FOUND',
  DEPOSIT_ACCOUNT_NOT_FOUND: 'DEPOSIT_ACCOUNT_NOT_FOUND',
  DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET: 'DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET',
  SALE_RECEIPT_NUMBER_NOT_UNIQUE: 'SALE_RECEIPT_NUMBER_NOT_UNIQUE',
  SALE_RECEIPT_IS_ALREADY_CLOSED: 'SALE_RECEIPT_IS_ALREADY_CLOSED',
  SALE_RECEIPT_NO_IS_REQUIRED: 'SALE_RECEIPT_NO_IS_REQUIRED',
  CUSTOMER_HAS_SALES_INVOICES: 'CUSTOMER_HAS_SALES_INVOICES',
  NO_INVOICE_CUSTOMER_EMAIL_ADDR: 'NO_INVOICE_CUSTOMER_EMAIL_ADDR'
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
