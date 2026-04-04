import { ApiProperty } from '@nestjs/swagger';

export class PaymentLinkAddressDto {
  @ApiProperty({ description: 'Address line 1' })
  address_1: string;

  @ApiProperty({ description: 'Address line 2' })
  address_2: string;

  @ApiProperty({ description: 'Postal code' })
  postal_code: string;

  @ApiProperty({ description: 'City' })
  city: string;

  @ApiProperty({ description: 'State or province' })
  state_province: string;

  @ApiProperty({ description: 'Phone number' })
  phone: string;
}

export class PaymentLinkOrganizationDto {
  @ApiProperty({ type: 'object', description: 'Organization address' })
  address: Record<string, PaymentLinkAddressDto>;

  @ApiProperty({ description: 'Organization name' })
  name: string;

  @ApiProperty({ description: 'Primary brand color' })
  primaryColor: string;

  @ApiProperty({ description: 'Logo URI' })
  logoUri: string;

  @ApiProperty({ description: 'Formatted address text' })
  addressTextFormatted: string;
}

export class PaymentLinkEntryDto {
  @ApiProperty({ description: 'Line item description' })
  description: string;

  @ApiProperty({ description: 'Item name' })
  itemName: string;

  @ApiProperty({ description: 'Quantity' })
  quantity: number;

  @ApiProperty({ description: 'Formatted quantity' })
  quantityFormatted: string;

  @ApiProperty({ description: 'Unit rate' })
  rate: number;

  @ApiProperty({ description: 'Formatted rate' })
  rateFormatted: string;

  @ApiProperty({ description: 'Line total' })
  total: number;

  @ApiProperty({ description: 'Formatted total' })
  totalFormatted: string;
}

export class PaymentLinkTaxEntryDto {
  @ApiProperty({ description: 'Tax name' })
  name: string;

  @ApiProperty({ description: 'Tax rate amount' })
  taxRateAmount: number;

  @ApiProperty({ description: 'Formatted tax rate amount' })
  taxRateAmountFormatted: string;

  @ApiProperty({ description: 'Tax rate code' })
  taxRateCode: string;
}

export class PaymentLinkBrandingTemplateDto {
  @ApiProperty({ description: 'Company logo URI' })
  companyLogoUri: string;

  @ApiProperty({ description: 'Primary color' })
  primaryColor: string;

  @ApiProperty({ description: 'Secondary color', required: false })
  secondaryColor?: string;
}

export class GetInvoicePaymentLinkResponseDto {
  @ApiProperty({ description: 'Amount due' })
  dueAmount: number;

  @ApiProperty({ description: 'Formatted amount due' })
  dueAmountFormatted: string;

  @ApiProperty({ description: 'Due date' })
  dueDate: string;

  @ApiProperty({ description: 'Formatted due date' })
  dueDateFormatted: string;

  @ApiProperty({ description: 'Formatted invoice date' })
  invoiceDateFormatted: string;

  @ApiProperty({ description: 'Invoice number' })
  invoiceNo: string;

  @ApiProperty({ description: 'Payment amount' })
  paymentAmount: number;

  @ApiProperty({ description: 'Formatted payment amount' })
  paymentAmountFormatted: string;

  @ApiProperty({ description: 'Subtotal' })
  subtotal: number;

  @ApiProperty({ description: 'Formatted subtotal' })
  subtotalFormatted: string;

  @ApiProperty({ description: 'Formatted subtotal in local currency' })
  subtotalLocalFormatted: string;

  @ApiProperty({ description: 'Total amount' })
  total: number;

  @ApiProperty({ description: 'Formatted total' })
  totalFormatted: string;

  @ApiProperty({ description: 'Formatted total in local currency' })
  totalLocalFormatted: string;

  @ApiProperty({ description: 'Customer name' })
  customerName: string;

  @ApiProperty({ description: 'Invoice message' })
  invoiceMessage: string;

  @ApiProperty({ description: 'Terms and conditions' })
  termsConditions: string;

  @ApiProperty({
    type: [PaymentLinkEntryDto],
    description: 'Invoice line entries',
  })
  entries: PaymentLinkEntryDto[];

  @ApiProperty({ type: [PaymentLinkTaxEntryDto], description: 'Tax entries' })
  taxes: PaymentLinkTaxEntryDto[];

  @ApiProperty({
    type: PaymentLinkBrandingTemplateDto,
    description: 'Branding template',
  })
  brandingTemplate: PaymentLinkBrandingTemplateDto;

  @ApiProperty({
    type: PaymentLinkOrganizationDto,
    description: 'Organization metadata',
  })
  organization: PaymentLinkOrganizationDto;

  @ApiProperty({ description: 'Whether Stripe is available as payment method' })
  hasStripePaymentMethod: boolean;

  @ApiProperty({ description: 'Whether invoice has receivable balance' })
  isReceivable: boolean;

  @ApiProperty({ description: 'Formatted customer address' })
  formattedCustomerAddress: string;
}

export class GetInvoicePaymentLinkResponseWrapperDto {
  @ApiProperty({
    type: GetInvoicePaymentLinkResponseDto,
    description: 'Payment link invoice metadata',
  })
  data: GetInvoicePaymentLinkResponseDto;
}
