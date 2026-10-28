import {
  BrandingState,
  BrandingTemplateValues,
} from '@/containers/BrandingTemplates/types';

export interface EstimateBrandingState extends BrandingState {}

export interface EstimateCustomizeValues extends BrandingTemplateValues {
  // Colors
  primaryColor?: string;
  secondaryColor?: string;

  // Company Logo
  showCompanyLogo?: boolean;
  companyLogoKey?: string;
  companyLogoUri?: string;

  // Top details.
  estimateNumberLabel?: string;
  showEstimateNumber?: boolean;

  showExpirationDate?: boolean;
  expirationDateLabel?: string;

  estimateDateLabel?: string;
  showEstimateDate?: boolean;

  // Addresses
  showCustomerAddress?: boolean;
  showCompanyAddress?: boolean;
  billedToLabel?: string;

  // Entries
  lineItemLabel?: string;
  lineRateLabel?: string;
  lineTotalLabel?: string;

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
