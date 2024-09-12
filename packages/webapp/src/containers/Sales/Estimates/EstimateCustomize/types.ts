import { BrandingTemplateValues } from "@/containers/BrandingTemplates/types";

export interface EstimateCustomizeValues extends BrandingTemplateValues {
  // Colors
  primaryColor?: string;
  secondaryColor?: string;

  // Company Logo
  showCompanyLogo?: boolean;
  companyLogo?: string;

  // Top details.
  estimateNumberLabel?: string;
  showEstimateNumber?: boolean;

  showExpirationDate?: boolean;
  expirationDateLabel?: string;

  estimateDateLabel?: string;
  showEstimateDate?: boolean;

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
  showCustomerNote?: boolean;
  customerNoteLabel?: string;

  showTermsConditions?: boolean;
  termsConditionsLabel?: string;
}
