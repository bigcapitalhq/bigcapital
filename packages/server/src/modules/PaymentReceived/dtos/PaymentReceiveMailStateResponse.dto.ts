import { ApiProperty } from '@nestjs/swagger';
import { PaymentReceiveMailAddressItemDto } from './PaymentReceiveMailOpts.dto';

export class PaymentReceiveMailEntryDto {
  @ApiProperty({
    description: 'The invoice number',
    example: 'INV-001',
  })
  invoiceNumber: string;

  @ApiProperty({
    description: 'The formatted paid amount',
    example: '$500.00',
  })
  paidAmount: string;
}

export class PaymentReceiveMailStateResponseDto {
  @ApiProperty({
    description: 'The organization company name',
    example: 'Acme Inc.',
  })
  companyName: string;

  @ApiProperty({
    description: 'The company logo URI',
    example: 'https://example.com/logo.png',
    required: false,
  })
  companyLogoUri?: string;

  @ApiProperty({
    description: 'The primary brand color',
    example: '#2563eb',
    required: false,
  })
  primaryColor?: string;

  @ApiProperty({
    description: 'The customer display name',
    example: 'John Doe',
  })
  customerName: string;

  @ApiProperty({
    description: 'The payment invoice entries',
    type: [PaymentReceiveMailEntryDto],
  })
  entries: Array<PaymentReceiveMailEntryDto>;

  @ApiProperty({
    description: 'Sender email addresses',
    type: [String],
  })
  from: Array<string>;

  @ApiProperty({
    description: 'Recipient email addresses',
    type: [String],
  })
  to: Array<string>;

  @ApiProperty({
    description: 'CC recipient email addresses',
    type: [String],
    required: false,
  })
  cc?: Array<string>;

  @ApiProperty({
    description: 'BCC recipient email addresses',
    type: [String],
    required: false,
  })
  bcc?: Array<string>;

  @ApiProperty({ description: 'The email subject' })
  subject: string;

  @ApiProperty({ description: 'The email body message' })
  message: string;

  @ApiProperty({
    description: 'Available sender address options',
    type: [PaymentReceiveMailAddressItemDto],
  })
  fromOptions: Array<PaymentReceiveMailAddressItemDto>;

  @ApiProperty({
    description: 'Available recipient address options',
    type: [PaymentReceiveMailAddressItemDto],
  })
  toOptions: Array<PaymentReceiveMailAddressItemDto>;

  @ApiProperty({
    description: 'The ISO payment date',
    example: '2024-03-15',
  })
  paymentDate: string;

  @ApiProperty({
    description: 'The human-readable payment date',
    example: 'March 15, 2024',
  })
  paymentDateFormatted: string;

  @ApiProperty({
    description: 'The numeric payment total',
    example: 500,
  })
  total: number;

  @ApiProperty({
    description: 'The formatted payment total',
    example: '$500.00',
  })
  totalFormatted: string;

  @ApiProperty({
    description: 'The numeric payment subtotal',
    example: 500,
  })
  subtotal: number;

  @ApiProperty({
    description: 'The formatted payment subtotal',
    example: '$500.00',
  })
  subtotalFormatted: string;

  @ApiProperty({
    description: 'The payment receive number',
    example: 'PR-0001',
  })
  paymentNumber: string;

  @ApiProperty({
    description: 'Template format arguments',
    type: Object,
    required: false,
  })
  formatArgs?: Record<string, unknown>;
}
