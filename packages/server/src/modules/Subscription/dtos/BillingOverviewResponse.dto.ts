import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export class BillingCustomerResponseDto {
  @ApiProperty({
    required: false,
    nullable: true,
    example: 'billing@example.com',
  })
  email: string | null;

  @ApiProperty({ required: false, nullable: true, example: 'Acme Inc.' })
  name: string | null;
}

export class BillingPaymentMethodResponseDto {
  @ApiProperty({ example: 'visa' })
  brand: string;

  @ApiProperty({ example: '4242' })
  last4: string;

  @ApiProperty({ example: 12 })
  expMonth: number;

  @ApiProperty({ example: 2030 })
  expYear: number;
}

export class BillingUpcomingInvoiceResponseDto {
  @ApiProperty({ example: 1000 })
  amountDue: number;

  @ApiProperty({ example: '$10.00' })
  amountDueFormatted: string;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({ example: '2026-12-01T00:00:00.000Z' })
  date: string;

  @ApiProperty({ example: 'Dec 1, 2026' })
  dateFormatted: string;
}

export class BillingInvoiceResponseDto {
  @ApiProperty({ example: 'in_xxx' })
  id: string;

  @ApiProperty({ required: false, nullable: true, example: 'INV-0001' })
  number: string | null;

  @ApiProperty({ required: false, nullable: true, example: 'paid' })
  status: string | null;

  @ApiProperty({ example: 1000 })
  amount: number;

  @ApiProperty({ example: '$10.00' })
  amountFormatted: string;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({ example: '2026-11-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: 'Nov 1, 2026' })
  createdAtFormatted: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'https://invoice.stripe.com/xxx',
  })
  hostedInvoiceUrl: string | null;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'https://pay.stripe.com/invoice/xxx/pdf',
  })
  invoicePdf: string | null;
}

@ApiExtraModels(
  BillingCustomerResponseDto,
  BillingPaymentMethodResponseDto,
  BillingUpcomingInvoiceResponseDto,
  BillingInvoiceResponseDto,
)
export class BillingOverviewResponseDto {
  @ApiProperty({ type: BillingCustomerResponseDto, nullable: true })
  customer: BillingCustomerResponseDto | null;

  @ApiProperty({ type: BillingPaymentMethodResponseDto, nullable: true })
  paymentMethod: BillingPaymentMethodResponseDto | null;

  @ApiProperty({ type: BillingUpcomingInvoiceResponseDto, nullable: true })
  upcomingInvoice: BillingUpcomingInvoiceResponseDto | null;

  @ApiProperty({ type: [BillingInvoiceResponseDto] })
  invoices: BillingInvoiceResponseDto[];
}
