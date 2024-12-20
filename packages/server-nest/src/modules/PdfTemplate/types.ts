export enum ERRORS {
  CANNOT_DELETE_PREDEFINED_PDF_TEMPLATE = 'CANNOT_DELETE_PREDEFINED_PDF_TEMPLATE',
}

export interface IEditPdfTemplateDTO {
  templateName: string;
  attributes: Record<string, any>;
}

export interface ICreateInvoicePdfTemplateDTO {
  // Colors
  primaryColor?: string;
  secondaryColor?: string;

  // Company Logo
  showCompanyLogo?: boolean;
  companyLogo?: string;

  // Top details.
  showInvoiceNumber?: boolean;
  invoiceNumberLabel?: string;

  showDateIssue?: boolean;
  dateIssueLabel?: string;

  showDueDate?: boolean;
  dueDateLabel?: string;

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

  showDiscount?: boolean;
  discountLabel?: string;

  showTaxes?: boolean;

  showTotal?: boolean;
  totalLabel?: string;

  paymentMadeLabel?: string;
  showPaymentMade?: boolean;

  dueAmountLabel?: string;
  showDueAmount?: boolean;

  // Footer paragraphs.
  termsConditionsLabel?: string;
  showTermsConditions?: boolean;

  statementLabel?: string;
  showStatement?: boolean;
}

export interface CommonOrganizationBrandingAttributes {
  companyName?: string;
  primaryColor?: string;
  companyLogoKey?: string;
  companyLogoUri?: string;
  companyAddress?: string;
}
