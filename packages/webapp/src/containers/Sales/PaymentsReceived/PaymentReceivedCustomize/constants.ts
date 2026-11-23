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

  // Payment date
  showPaymentReceivedDate: true,
  paymentReceivedDateLabel: 'Date of Issue',

  // Company address
  showCompanyAddress: true,

  // Customer address
  showCustomerAddress: true,
  billedToLabel: 'Billed To',

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
