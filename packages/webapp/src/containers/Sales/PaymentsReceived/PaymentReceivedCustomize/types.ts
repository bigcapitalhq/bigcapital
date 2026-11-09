import {
  BrandingState,
  BrandingTemplateValues,
} from '@/containers/BrandingTemplates/types';

export interface PaymentReceivedPreviewState extends BrandingState {}

export interface PaymentReceivedCustomizeValues extends BrandingTemplateValues {
  // Colors
  primaryColor?: string;
  secondaryColor?: string;

  // Company Logo
  showCompanyLogo?: boolean;

  // Payment received number
  showPaymentReceivedNumber?: boolean;
  paymentReceivedNumberLabel?: string;

  // Payment received date
  showPaymentReceivedDate?: boolean;
  paymentReceivedDateLabel?: string;

  // Addresses
  showCompanyAddress?: boolean;
  showCustomerAddress?: boolean;
  billedToLabel?: string;

  // Subtotal
  showSubtotal?: boolean;
  subtotalLabel?: string;

  // Total
  showTotal?: boolean;
  totalLabel?: string;
}
