export interface ReceiptCustomizeValues {
  // Colors
  primaryColor?: string;
  secondaryColor?: string;

  // Company Logo
  showCompanyLogo?: boolean;
  companyLogo?: string;

  // Top details.
  showReceiptNumber?: boolean;
  receiptNumberLabel?: string;

  showReceiptDate?: boolean;
  receiptDateLabel?: string;

  // Company name
  companyName?: string;

  // Addresses
  showBilledFromAddress?: boolean;
  showBillingToAddress?: boolean;
  billedToLabel?: string;

  // Entries
  itemNameLabel?: string;
  itemDescriptionLabel?: string;
  itemRateLabel?: string;
  itemTotalLabel?: string;

  // Totals
  showSubtotal?: boolean;
  subtotalLabel?: string;

  showTotal?: boolean;
  totalLabel?: string;

  // Statements
  termsConditionsLabel?: string;
  showTermsConditions?: boolean;

  customerNoteLabel?: string;
  showCustomerNote?: boolean;
}
