import { ApiProperty } from '@nestjs/swagger';

export class AddressItemDto {
  @ApiProperty({ description: 'The email label', example: 'John Doe' })
  label: string;

  @ApiProperty({
    description: 'The email address',
    example: 'john@example.com',
  })
  mail: string;

  @ApiProperty({
    description: 'Whether this is the primary email',
    example: true,
    required: false,
  })
  primary?: boolean;
}

export class SaleReceiptMailEntryDto {
  @ApiProperty({ description: 'The item name', example: 'Product A' })
  name: string;

  @ApiProperty({ description: 'The quantity', example: 2 })
  quantity: number;

  @ApiProperty({ description: 'The formatted quantity', example: '2.00' })
  quantityFormatted: string;

  @ApiProperty({ description: 'The rate/price', example: 100 })
  rate: number;

  @ApiProperty({ description: 'The formatted rate', example: '$100.00' })
  rateFormatted: string;

  @ApiProperty({ description: 'The total amount', example: 200 })
  total: number;

  @ApiProperty({ description: 'The formatted total', example: '$200.00' })
  totalFormatted: string;
}

export class SaleReceiptMailResponseDto {
  @ApiProperty({
    description: 'Whether to attach the receipt PDF',
    example: true,
  })
  attachReceipt: boolean;

  @ApiProperty({
    description: 'The closed date',
    example: '2024-01-15',
  })
  closedAtDate: string;

  @ApiProperty({
    description: 'The formatted closed date',
    example: 'Jan 15, 2024',
  })
  closedAtDateFormatted: string;

  @ApiProperty({ description: 'The company name', example: 'Acme Corp' })
  companyName: string;

  @ApiProperty({ description: 'The customer name', example: 'John Doe' })
  customerName: string;

  @ApiProperty({
    description: 'Format arguments for the message',
    type: 'object',
  })
  formatArgs: Record<string, unknown>;

  @ApiProperty({
    description: 'From email addresses',
    type: [String],
    example: ['noreply@example.com'],
  })
  from: string[];

  @ApiProperty({ description: 'From email options', type: [AddressItemDto] })
  fromOptions: AddressItemDto[];

  @ApiProperty({
    description: 'The email message body',
    example: 'Please find your receipt attached.',
  })
  message: string;

  @ApiProperty({
    description: 'The receipt date',
    example: '2024-01-15',
  })
  receiptDate: string;

  @ApiProperty({
    description: 'The formatted receipt date',
    example: 'Jan 15, 2024',
  })
  receiptDateFormatted: string;

  @ApiProperty({
    description: 'The email subject',
    example: 'Your Receipt from Acme Corp',
  })
  subject: string;

  @ApiProperty({ description: 'The subtotal amount', example: 200 })
  subtotal: number;

  @ApiProperty({ description: 'The formatted subtotal', example: '$200.00' })
  subtotalFormatted: string;

  @ApiProperty({
    description: 'To email addresses',
    type: [String],
    example: ['customer@example.com'],
  })
  to: string[];

  @ApiProperty({ description: 'To email options', type: [AddressItemDto] })
  toOptions: AddressItemDto[];

  @ApiProperty({ description: 'The discount amount', example: 20 })
  discountAmount: number;

  @ApiProperty({
    description: 'The formatted discount amount',
    example: '$20.00',
  })
  discountAmountFormatted: string;

  @ApiProperty({ description: 'The discount label', example: 'Discount (10%)' })
  discountLabel: string;

  @ApiProperty({
    description: 'The discount percentage',
    example: 10,
    nullable: true,
  })
  discountPercentage: number | null;

  @ApiProperty({
    description: 'The formatted discount percentage',
    example: '10%',
  })
  discountPercentageFormatted: string;

  @ApiProperty({ description: 'The adjustment amount', example: 0 })
  adjustment: number;

  @ApiProperty({ description: 'The formatted adjustment', example: '$0.00' })
  adjustmentFormatted: string;

  @ApiProperty({ description: 'The total amount', example: 180 })
  total: number;

  @ApiProperty({ description: 'The formatted total', example: '$180.00' })
  totalFormatted: string;

  @ApiProperty({
    description: 'The company logo URI',
    example: 'https://example.com/logo.png',
    nullable: true,
  })
  companyLogoUri?: string | null;

  @ApiProperty({
    description: 'The primary color',
    example: '#0066cc',
    nullable: true,
  })
  primaryColor?: string | null;

  @ApiProperty({
    description: 'The receipt entries',
    type: [SaleReceiptMailEntryDto],
  })
  entries: SaleReceiptMailEntryDto[];

  @ApiProperty({ description: 'The receipt number', example: 'SR-2024-001' })
  receiptNumber: string;
}

export class SaleReceiptSendMailBodyDto {
  @ApiProperty({
    description: 'Whether to attach the receipt PDF',
    example: true,
    required: false,
  })
  attachReceipt?: boolean;

  @ApiProperty({
    description: 'From email address',
    example: 'noreply@example.com',
    required: false,
  })
  from?: string;

  @ApiProperty({
    description: 'To email addresses',
    type: [String],
    example: ['customer@example.com'],
    required: false,
  })
  to?: string[];

  @ApiProperty({
    description: 'CC email addresses',
    type: [String],
    example: [],
    required: false,
  })
  cc?: string[];

  @ApiProperty({
    description: 'BCC email addresses',
    type: [String],
    example: [],
    required: false,
  })
  bcc?: string[];

  @ApiProperty({
    description: 'The email subject',
    example: 'Your Receipt',
    required: false,
  })
  subject?: string;

  @ApiProperty({
    description: 'The email message body',
    example: 'Please find your receipt attached.',
    required: false,
  })
  message?: string;

  @ApiProperty({
    description: 'Format arguments',
    type: 'object',
    required: false,
  })
  formatArgs?: Record<string, unknown>;
}

export class SaleReceiptHtmlContentResponseDto {
  @ApiProperty({
    description: 'The HTML content of the receipt',
    example: '<html>...</html>',
  })
  htmlContent: string;
}
