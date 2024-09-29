export const MANAGE_LINK_URL = '/preferences/payment-methods';

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
  showInvoiceNumber: true,
  invoiceNumberLabel: 'Invoice number',

  showDateIssue: true,
  dateIssueLabel: 'Date of Issue',

  showDueDate: true,
  dueDateLabel: 'Due Date',

  // Company name
  companyName: 'Bigcapital Technology, Inc.',

  // Addresses
  showCustomerAddress: true,
  showCompanyAddress: true,
  companyAddress: '',
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

  paymentMadeLabel: 'Payment Made',
  showPaymentMade: true,

  dueAmountLabel: 'Due Amount',
  showDueAmount: true,

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
        labelKey: 'invoiceNumberLabel',
        enableKey: 'showInvoiceNumber',
        label: 'Invoice No.',
      },
      {
        labelKey: 'dateIssueLabel',
        enableKey: 'showDateIssue',
        label: 'Issue Date',
      },
      {
        labelKey: 'dueDateLabel',
        enableKey: 'showDueDate',
        label: 'Due Date',
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
      {
        labelKey: 'paymentMadeLabel',
        enableKey: 'showPaymentMade',
        label: 'Payment Made',
      },
      {
        labelKey: 'dueAmountLabel',
        enableKey: 'showDueAmount',
        label: 'Due Amount',
      },
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
