export const DEFAULT_PAYMENT_MAIL_SUBJECT = 'Payment Received by {CompanyName}';
export const DEFAULT_PAYMENT_MAIL_CONTENT = `
<p>Dear {CustomerName}</p>
<p>Thank you for your payment. It was a pleasure doing business with you. We look forward to work together again!</p>
<p>
Payment Date : <strong>{PaymentDate}</strong><br />
Amount   : <strong>{PaymentAmount}</strong></br />
</p>

<p>
<i>Regards</i><br />
<i>{CompanyName}</i>
</p>
`;

export const ERRORS = {
  PAYMENT_RECEIVE_NO_EXISTS: 'PAYMENT_RECEIVE_NO_EXISTS',
  PAYMENT_RECEIVE_NOT_EXISTS: 'PAYMENT_RECEIVE_NOT_EXISTS',
  DEPOSIT_ACCOUNT_NOT_FOUND: 'DEPOSIT_ACCOUNT_NOT_FOUND',
  DEPOSIT_ACCOUNT_INVALID_TYPE: 'DEPOSIT_ACCOUNT_INVALID_TYPE',
  INVALID_PAYMENT_AMOUNT: 'INVALID_PAYMENT_AMOUNT',
  INVOICES_IDS_NOT_FOUND: 'INVOICES_IDS_NOT_FOUND',
  ENTRIES_IDS_NOT_EXISTS: 'ENTRIES_IDS_NOT_EXISTS',
  INVOICES_NOT_DELIVERED_YET: 'INVOICES_NOT_DELIVERED_YET',
  PAYMENT_RECEIVE_NO_IS_REQUIRED: 'PAYMENT_RECEIVE_NO_IS_REQUIRED',
  PAYMENT_RECEIVE_NO_REQUIRED: 'PAYMENT_RECEIVE_NO_REQUIRED',
  PAYMENT_CUSTOMER_SHOULD_NOT_UPDATE: 'PAYMENT_CUSTOMER_SHOULD_NOT_UPDATE',
  CUSTOMER_HAS_PAYMENT_RECEIVES: 'CUSTOMER_HAS_PAYMENT_RECEIVES',
  PAYMENT_ACCOUNT_CURRENCY_INVALID: 'PAYMENT_ACCOUNT_CURRENCY_INVALID',
  NO_INVOICE_CUSTOMER_EMAIL_ADDR: 'NO_INVOICE_CUSTOMER_EMAIL_ADDR',
};

export const DEFAULT_VIEWS = [];

export const PaymentsReceiveSampleData = [
  {
    Customer: 'Randall Kohler',
    'Payment Date': '2024-10-10',
    'Payment Receive No.': 'PAY-0001',
    'Reference No.': 'REF-0001',
    'Deposit Account': 'Petty Cash',
    'Exchange Rate': '',
    Statement: 'Totam optio quisquam qui.',
    Invoice: 'INV-00001',
    'Payment Amount': 850,
  },
];

export const defaultPaymentReceivedPdfTemplateAttributes = {
  // # Colors
  primaryColor: '#000',
  secondaryColor: '#000',

  // # Company logo
  showCompanyLogo: true,
  companyLogoUri: '',

  // # Company name
  companyName: 'Bigcapital Technology, Inc.',

  // Address
  billedToAddress: [
    'Bigcapital Technology, Inc.',
    '131 Continental Dr Suite 305 Newark,',
    'Delaware 19713',
    'United States',
    '+1 762-339-5634',
    'ahmed@bigcapital.app',
  ],
  billedFromAddress: [
    '131 Continental Dr Suite 305 Newark,',
    'Delaware 19713',
    'United States',
    '+1 762-339-5634',
    'ahmed@bigcapital.app',
  ],
  showBilledFromAddress: true,
  showBillingToAddress: true,
  billedToLabel: 'Billed To',

  // Total
  total: '$1000.00',
  totalLabel: 'Total',
  showTotal: true,

  // Subtotal
  subtotal: '1000/00',
  subtotalLabel: 'Subtotal',
  showSubtotal: true,

  lines: [
    {
      invoiceNumber: 'INV-00001',
      invoiceAmount: '$1000.00',
      paidAmount: '$1000.00',
    },
  ],
  // Payment received number
  showPaymentReceivedNumber: true,
  paymentReceivedNumberLabel: 'Payment Number',
  paymentReceivedNumebr: '346D3D40-0001',

  // Payment date.
  paymentReceivedDate: 'September 3, 2024',
  showPaymentReceivedDate: true,
  paymentReceivedDateLabel: 'Payment Date',
};
