export const initialValues = {
  templateName: '',

  // Colors
  primaryColor: '#2c3dd8',
  secondaryColor: '#2c3dd8',

  // Company logo.
  showCompanyLogo: true,
  companyLogoKey: '',
  companyLogoUri: '',

  // Receipt Number
  showReceiptNumber: true,
  receiptNumberLabel: 'Receipt number',

  // Receipt Date
  showReceiptDate: true,
  receiptDateLabel: 'Date of Issue',

  // Company name
  companyName: 'Bigcapital Technology, Inc.',

  // Addresses
  showBilledFromAddress: true,
  showBilledToAddress: true,
  billedToLabel: 'Billed To',

  // Entries
  itemNameLabel: 'Item',
  itemDescriptionLabel: 'Description',
  itemRateLabel: 'Rate',
  itemTotalLabel: 'Total',

  // Subtotal
  showSubtotal: true,
  subtotalLabel: 'Subtotal',

  // Total
  showTotal: true,
  totalLabel: 'Total',

  // Terms & Conditions
  termsConditionsLabel: 'Terms & Conditions',
  showTermsConditions: true,

  // Customer Note
  customerNoteLabel: 'Customer Note',
  showCustomerNote: true,
};

export const fieldsGroups = [
  {
    label: 'Header',
    fields: [
      {
        labelKey: 'receiptNumberLabel',
        enableKey: 'showReceiptNumber',
        label: 'Receipt Number',
      },
      {
        labelKey: 'receiptDateLabel',
        enableKey: 'showReceiptDate',
        label: 'Receipt Date',
      },
      {
        enableKey: 'showBilledToAddress',
        labelKey: 'billedToLabel',
        label: 'Bill To',
      },
      {
        enableKey: 'showBilledFromAddress',
        label: 'Billed From',
      },
    ],
  },
  {
    label: 'Totals',
    fields: [
      {
        labelKey: 'subtotalLabel',
        enableKey: 'showSubtotal',
        label: 'Subtotal',
      },
      { labelKey: 'totalLabel', enableKey: 'showTotal', label: 'Total' },
    ],
  },
  {
    label: 'Statements',
    fields: [
      {
        enableKey: 'showCustomerNote',
        labelKey: 'customerNoteLabel',
        label: 'Customer Note',
      },
      {
        enableKey: 'showTermsConditions',
        labelKey: 'termsConditionsLabel',
        label: 'Terms & Conditions',
      },
    ],
  },
];
