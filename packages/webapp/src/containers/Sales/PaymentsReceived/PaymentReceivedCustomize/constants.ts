export const initialValues = {
  templateName: '',

  // Colors
  primaryColor: '#2c3dd8',
  secondaryColor: '#2c3dd8',

  // Company logo.
  showCompanyLogo: true,
  companyLogoUri: '',
  companyLogoKey: '',

  // Top details.
  showPaymentReceivedNumber: true,
  paymentReceivedNumberLabel: 'Payment number',

  showPaymentReceivedDate: true,
  paymentReceivedDateLabel: 'Date of Issue',

  // Company name
  companyName: 'Bigcapital Technology, Inc.',

  // Addresses
  showBilledFromAddress: true,
  showBillingToAddress: true,
  billedToLabel: 'Billed To',

  // Entries
  itemNameLabel: 'Item',
  itemDescriptionLabel: 'Description',
  itemRateLabel: 'Rate',
  itemTotalLabel: 'Total',

  // Totals
  showSubtotal: true,
  subtotalLabel: 'Subtotal',

  showTotal: true,
  totalLabel: 'Total',
};

export const fieldsGroups = [
  {
    label: 'Header',
    fields: [
      {
        labelKey: 'paymentReceivedNumberLabel',
        enableKey: 'showPaymentReceivedNumber',
        label: 'Payment No.',
      },
      {
        labelKey: 'paymentReceivedDateLabel',
        enableKey: 'showPaymentReceivedDate',
        label: 'Payment Date',
      },
      {
        enableKey: 'showBillingToAddress',
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
];
