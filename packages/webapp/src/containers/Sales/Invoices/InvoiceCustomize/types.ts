import {
  BrandingState,
  BrandingTemplateValues,
} from '@/containers/BrandingTemplates/types';

export interface InvoiceCustomizeState extends BrandingState {}

export interface InvoiceCustomizeFormValues extends BrandingTemplateValues {
  // Colors
  primaryColor?: string;
  secondaryColor?: string;

  // Company Logo
  showCompanyLogo?: boolean;
  companyLogoKey?: string;
  companyLogoUri?: string;

  // Top details.
  showInvoiceNumber?: boolean;
  invoiceNumberLabel?: string;

  // Date issue
  showDateIssue?: boolean;
  dateIssueLabel?: string;

  // Due date
  showDueDate?: boolean;
  dueDateLabel?: string;

  // Addresses
  showCompanyAddress?: boolean;
  showCustomerAddress?: boolean;
  billedToLabel?: string;

  // Entries
  lineItemLabel?: string;
  lineRateLabel?: string;
  lineTotalLabel?: string;

  // Totals
  showSubtotal?: boolean;
  subtotalLabel?: string;

  // Discount
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
