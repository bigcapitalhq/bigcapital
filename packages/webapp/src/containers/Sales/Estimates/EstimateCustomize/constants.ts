export const initialValues = {
  templateName: '',

  // Colors
  primaryColor: '#2c3dd8',
  secondaryColor: '#2c3dd8',

  // Company logo.
  showCompanyLogo: true,
  companyLogoKey: '',
  companyLogoUri: '',

  // Top details.
  showEstimateNumber: true,
  estimateNumberLabel: 'Estimate number',

  estimateDateLabel: 'Date of Issue',
  showEstimateDate: true,

  showExpirationDate: true,
  expirationDateLabel: 'Expiration Date',

  // Customer address
  showCustomerAddress: true,

  // Company address
  showCompanyAddress: true,
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

  // Statements
  showCustomerNote: true,
  customerNoteLabel: 'Customer Note',

  // Terms & Conditions
  showTermsConditions: true,
  termsConditionsLabel: 'Terms & Conditions',
};

export const fieldsGroups = [
  {
    label: 'Header',
    fields: [
      {
        labelKey: 'estimateNumberLabel',
        enableKey: 'showEstimateNumber',
        label: 'Estimate No.',
      },
      {
        labelKey: 'estimateDateLabel',
        enableKey: 'showEstimateDate',
        label: 'Issue Date',
      },
      {
        labelKey: 'expirationDateLabel',
        enableKey: 'showExpirationDate',
        label: 'Expiration Date',
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
  {
    label: 'Footer',
    fields: [
      {
        labelKey: 'termsConditionsLabel',
        enableKey: 'showTermsConditions',
        label: 'Terms & Conditions',
      },
      {
        labelKey: 'customerNoteLabel',
        enableKey: 'showCustomerNote',
        label: 'Statement',
        labelPlaceholder: 'Statement',
      },
    ],
  },
];
