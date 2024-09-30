import { BrandingTemplateValues } from '@/containers/BrandingTemplates/types';

export interface PaymentReceivedCustomizeValues extends BrandingTemplateValues {
  // Colors
  primaryColor?: string;
  secondaryColor?: string;

  // Company Logo
  showCompanyLogo?: boolean;

  // Top details.
  showInvoiceNumber?: boolean;
  invoiceNumberLabel?: string;

  // # Issue date
  showDateIssue?: boolean;
  dateIssueLabel?: string;

  // # Due date
  showDueDate?: boolean;
  dueDateLabel?: string;

  // # Company name
  companyName?: string;

  // # Customer address
  showCustomerAddress?: boolean;

  // # Company address
  showCompanyAddress?: boolean;
  companyAddress?: string;
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

  // # Statement
  statementLabel?: string;
  showStatement?: boolean;
}
