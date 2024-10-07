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

  // Payment number
  showPaymentReceivedDate: true,
  paymentReceivedDateLabel: 'Date of Issue',

  // Customer address
  showCompanyAddress: true,

  // Company address
  showCustomerAddress: true,
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
        enableKey: 'showCustomerAddress',
        labelKey: 'billedToLabel',
        label: 'Bill To',
      },
      {
        enableKey: 'showCompanyAddress',
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
