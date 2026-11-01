import { ApiProperty } from '@nestjs/swagger';
import { AddressItem } from '@/modules/MailNotification/MailNotification.types';

export class PaymentReceiveMailAddressItemDto implements AddressItem {
  @ApiProperty({
    description: 'The email address',
    example: 'john@example.com',
  })
  mail: string;

  @ApiProperty({
    description: 'The display label for the address',
    example: 'John Doe',
  })
  label: string;

  @ApiProperty({
    description: 'Whether this is the primary address',
    example: true,
    required: false,
  })
  primary?: boolean;
}

export class PaymentReceiveMailOptsDto {
  @ApiProperty({
    description: 'Sender email addresses',
    example: ['billing@company.com'],
    type: [String],
  })
  from: Array<string>;

  @ApiProperty({
    description: 'Recipient email addresses',
    example: ['customer@example.com'],
    type: [String],
  })
  to: Array<string>;

  @ApiProperty({
    description: 'CC recipient email addresses',
    example: ['accounting@company.com'],
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

  @ApiProperty({
    description: 'The email subject',
    example: 'Payment Received',
  })
  subject: string;

  @ApiProperty({
    description: 'The email body message',
    example: 'We have received your payment.',
  })
  message: string;

  @ApiProperty({
    description: 'Available recipient address options',
    type: [PaymentReceiveMailAddressItemDto],
  })
  toOptions: Array<PaymentReceiveMailAddressItemDto>;

  @ApiProperty({
    description: 'Available sender address options',
    type: [PaymentReceiveMailAddressItemDto],
  })
  fromOptions: Array<PaymentReceiveMailAddressItemDto>;

  @ApiProperty({
    description: 'Template format arguments',
    type: Object,
    required: false,
  })
  formatArgs?: Record<string, unknown>;

  @ApiProperty({
    description: 'Whether to attach the payment PDF',
    example: true,
    required: false,
  })
  attachPdf?: boolean;
}
