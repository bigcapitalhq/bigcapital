
export const initialValues = {
  // Colors
  primaryColor: '#2c3dd8',
  secondaryColor: '#2c3dd8',

  // Company logo.
  showCompanyLogo: true,
  companyLogo:
    'https://cdn-development.mercury.com/demo-assets/avatars/mercury-demo-dark.png',

  // Top details.
  showEstimateNumber: true,
  estimateNumberLabel: 'Estimate number',

  showDateIssue: true,
  dateIssueLabel: 'Date of Issue',

  showExpirationDate: true,
  expirationDateLabel: 'Expiration Date',

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

  showDiscount: true,
  discountLabel: 'Discount',

  showTaxes: true,

  showTotal: true,
  totalLabel: 'Total',

  // Footer paragraphs.
  termsConditionsLabel: 'Terms & Conditions',
  showTermsConditions: true,

  statementLabel: 'Statement',
  showStatement: true,
};



export const fieldsGroups = [
  {
    label: 'Header',
    fields: [
      {
        labelKey: 'estimateNumberLabel',
        enableKey: 'showEstimateeNumber',
        label: 'Estimate No.',
      },
      {
        labelKey: 'dateIssueLabel',
        enableKey: 'showDateIssue',
        label: 'Issue Date',
      },
      {
        labelKey: 'expirationDateLabel',
        enableKey: 'expirationDueDate',
        label: 'Expiration Date',
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
      {
        labelKey: 'discountLabel',
        enableKey: 'showDiscount',
        label: 'Discount',
      },
      { enableKey: 'showTaxes', label: 'Taxes' },
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
        labelKey: 'statementLabel',
        enableKey: 'showStatement',
        label: 'Statement',
        labelPlaceholder: 'Statement',
      },
    ],
  },
];
