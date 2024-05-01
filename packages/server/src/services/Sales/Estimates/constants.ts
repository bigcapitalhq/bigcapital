export const DEFAULT_ESTIMATE_REMINDER_MAIL_SUBJECT =
  'Estimate {EstimateNumber} is awaiting your approval';
export const DEFAULT_ESTIMATE_REMINDER_MAIL_CONTENT = `<p>Dear {CustomerName}</p>
<p>Thank you for your business, You can view or print your estimate from attachements.</p>
<p>
Estimate <strong>#{EstimateNumber}</strong><br />
Expiration Date : <strong>{EstimateExpirationDate}</strong><br />
Amount   : <strong>{EstimateAmount}</strong></br />
</p>

<p>
<i>Regards</i><br />
<i>{CompanyName}</i>
</p>
`;

export const ERRORS = {
  SALE_ESTIMATE_NOT_FOUND: 'SALE_ESTIMATE_NOT_FOUND',
  SALE_ESTIMATE_NUMBER_EXISTANCE: 'SALE_ESTIMATE_NUMBER_EXISTANCE',
  SALE_ESTIMATE_CONVERTED_TO_INVOICE: 'SALE_ESTIMATE_CONVERTED_TO_INVOICE',
  SALE_ESTIMATE_NOT_DELIVERED: 'SALE_ESTIMATE_NOT_DELIVERED',
  SALE_ESTIMATE_ALREADY_REJECTED: 'SALE_ESTIMATE_ALREADY_REJECTED',
  CUSTOMER_HAS_SALES_ESTIMATES: 'CUSTOMER_HAS_SALES_ESTIMATES',
  SALE_ESTIMATE_NO_IS_REQUIRED: 'SALE_ESTIMATE_NO_IS_REQUIRED',
  SALE_ESTIMATE_ALREADY_DELIVERED: 'SALE_ESTIMATE_ALREADY_DELIVERED',
  SALE_ESTIMATE_ALREADY_APPROVED: 'SALE_ESTIMATE_ALREADY_APPROVED',
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
    name: 'Approved',
    slug: 'approved',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'status',
        comparator: 'equals',
        value: 'approved',
      },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'Rejected',
    slug: 'rejected',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'status',
        comparator: 'equals',
        value: 'rejected',
      },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'Invoiced',
    slug: 'invoiced',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'status',
        comparator: 'equals',
        value: 'invoiced',
      },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'Expired',
    slug: 'expired',
    rolesLogicExpression: '1',
    roles: [
      {
        index: 1,
        fieldKey: 'status',
        comparator: 'equals',
        value: 'expired',
      },
    ],
    columns: DEFAULT_VIEW_COLUMNS,
  },
  {
    name: 'Closed',
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

export const SaleEstimatesSampleData = [
  {
    Customer: 'Ambrose Olson',
    'Estimate Date': '2024-01-01',
    'Expiration Date': '2025-01-01',
    'Estimate No.': 'EST-0001',
    'Reference No.': 'REF-0001',
    Currency: '',
    'Exchange Rate': '',
    Note: 'Vel autem quis aut ab.',
    'Terms & Conditions': 'Provident illo architecto sit iste in.',
    Delivered: 'T',
    'Item Name': 'Hettinger, Schumm and Bartoletti',
    Quantity: 1000,
    Rate: 20,
    'Line Description': 'Rem esse doloremque praesentium harum maiores.',
  },
  {
    Customer: 'Ambrose Olson',
    'Estimate Date': '2024-01-02',
    'Expiration Date': '2025-01-02',
    'Estimate No.': 'EST-0002',
    'Reference No.': 'REF-0002',
    Currency: '',
    'Exchange Rate': '',
    Note: 'Tempora voluptas odio deleniti rerum vitae consequatur nihil quis sunt.',
    'Terms & Conditions': 'Ut eum incidunt quibusdam rerum vero.',
    Delivered: 'T',
    'Item Name': 'Hettinger, Schumm and Bartoletti',
    Quantity: 1000,
    Rate: 20,
    'Line Description': 'Qui voluptate aliquam maxime aliquam.',
  },
  {
    Customer: 'Ambrose Olson',
    'Estimate Date': '2024-01-03',
    'Expiration Date': '2025-01-03',
    'Estimate No.': 'EST-0003',
    'Reference No.': 'REF-0003',
    Currency: '',
    'Exchange Rate': '',
    Note: 'Quia voluptatem delectus doloremque.',
    'Terms & Conditions': 'Facilis porro vitae ratione.',
    Delivered: 'T',
    'Item Name': 'Hettinger, Schumm and Bartoletti',
    Quantity: 1000,
    Rate: 20,
    'Line Description': 'Qui suscipit ducimus qui qui.',
  },
];
