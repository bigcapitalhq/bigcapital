import {
  BrandingState,
  BrandingTemplateValues,
} from '@/containers/BrandingTemplates/types';

export interface CreditNoteBrandingState extends BrandingState {}

export interface CreditNoteCustomizeValues extends BrandingTemplateValues {
  // Colors
  primaryColor?: string;
  secondaryColor?: string;

  // Company Logo
  showCompanyLogo?: boolean;

  // Addresses
  showCustomerAddress?: boolean;
  showCompanyAddress?: boolean;
  billedToLabel?: string;

  // Entries
  lineItemLabel?: string;
  lineRateLabel?: string;
  lineTotalLabel?: string;

  // Total
  showTotal?: boolean;
  totalLabel?: string;

  // Subtotal
  showSubtotal?: boolean;
  subtotalLabel?: string;

  // Customer Note.
  showCustomerNote?: boolean;
  customerNoteLabel?: string;

  // Terms & Conditions
  showTermsConditions?: boolean;
  termsConditionsLabel?: string;

  // Date issue.
  creditNoteDateLabel?: string;
  showCreditNoteDate?: boolean;

  // Credit Number.
  creditNoteNumberLabel?: string;
  showCreditNoteNumber?: boolean;
}
