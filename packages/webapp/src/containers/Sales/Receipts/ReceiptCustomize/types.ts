import {
  BrandingState,
  BrandingTemplateValues,
} from '@/containers/BrandingTemplates/types';

export interface ReceiptBrandingState extends BrandingState {}

export interface ReceiptCustomizeValues extends BrandingTemplateValues {
  // Colors
  primaryColor?: string;
  secondaryColor?: string;

  // Company Logo
  showCompanyLogo?: boolean;

  // Receipt Number
  showReceiptNumber?: boolean;
  receiptNumberLabel?: string;

  // Receipt Date.
  showReceiptDate?: boolean;
  receiptDateLabel?: string;

  // Addresses
  showCustomerAddress?: boolean;
  showCompanyAddress?: boolean;
  billedToLabel?: string;

  // Entries
  lineItemLabel?: string;
  lineRateLabel?: string;
  lineTotalLabel?: string;

  // Subtotal
  showSubtotal?: boolean;
  subtotalLabel?: string;

  // Total
  showTotal?: boolean;
  totalLabel?: string;

  // Terms & Conditions
  termsConditionsLabel?: string;
  showTermsConditions?: boolean;

  // Statement
  customerNoteLabel?: string;
  showCustomerNote?: boolean;
}
