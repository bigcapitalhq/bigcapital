import { BrandingState, BrandingTemplateValues } from "@/containers/BrandingTemplates/types";

export interface EstimateBrandingState extends BrandingState {

}

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
  showBilledFromAddress?: boolean;
  showBilledToAddress?: boolean;
  billedToLabel?: string;

  // Entries
  itemNameLabel?: string;
  itemDescriptionLabel?: string;
  itemRateLabel?: string;
  itemTotalLabel?: string;

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
