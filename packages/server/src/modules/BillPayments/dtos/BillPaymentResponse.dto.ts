import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AttachmentLinkDto } from '@/modules/Attachments/dtos/Attachment.dto';

// Minimal Bill response for entry
class BillResponseDto {
  @ApiProperty({ description: 'The bill ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'The bill number', example: 'BILL-001' })
  billNo: string;

  @ApiProperty({
    description: 'The formatted bill date',
    example: '2024-01-01',
  })
  formattedBillDate: string;

  @ApiProperty({ description: 'The formatted due date', example: '2024-01-15' })
  formattedDueDate: string;

  @ApiProperty({
    description: 'The formatted total amount',
    example: '1,000.00 USD',
  })
  totalFormatted: string;
}

export class BillPaymentEntryResponseDto {
  @ApiProperty({
    description: 'The payment amount formatted',
    example: '100.00',
  })
  paymentAmountFormatted: string;

  @ApiProperty({ description: 'The bill details', type: BillResponseDto })
  @Type(() => BillResponseDto)
  bill: BillResponseDto;
}

export class BillPaymentResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the bill payment',
    example: 1,
  })
  id: number;

  @ApiProperty({ description: 'The vendor ID', example: 1 })
  vendorId: number;

  @ApiProperty({ description: 'The amount paid', example: 100 })
  amount: number;

  @ApiProperty({
    description: 'The currency code',
    example: 'USD',
    required: false,
  })
  currencyCode?: string;

  @ApiProperty({ description: 'The payment account ID', example: 2 })
  paymentAccountId: number;

  @ApiProperty({
    description: 'The payment number',
    example: 'PAY-2024-001',
    required: false,
  })
  paymentNumber?: string;

  @ApiProperty({ description: 'The payment date', example: '2024-01-01' })
  paymentDate: string;

  @ApiProperty({
    description: 'The formatted payment date',
    example: '2024-01-01',
  })
  formattedPaymentDate: string;

  @ApiProperty({
    description: 'The exchange rate',
    example: 1,
    required: false,
  })
  exchangeRate?: number;

  @ApiProperty({
    description: 'Statement or note',
    example: 'Payment for January bills',
    required: false,
  })
  statement?: string;

  @ApiProperty({
    description: 'Reference number',
    example: 'REF-123',
    required: false,
  })
  reference?: string;

  @ApiProperty({ description: 'The branch ID', example: 1, required: false })
  branchId?: number;

  @ApiProperty({ description: 'The formatted amount', example: '100.00 USD' })
  formattedAmount: string;

  @ApiProperty({ description: 'The formatted total', example: '100.00 USD' })
  formattedTotal: string;

  @ApiProperty({ description: 'The formatted subtotal', example: '100.00 USD' })
  formattedSubtotal: string;

  @ApiProperty({
    description: 'The date when the payment was created',
    example: '2024-01-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The formatted created at date',
    example: '2024-01-01',
  })
  formattedCreatedAt: string;

  @ApiProperty({
    description: 'The date when the payment was last updated',
    example: '2024-01-02T12:00:00Z',
    required: false,
  })
  updatedAt?: Date;

  @ApiProperty({
    description: 'The entries of the bill payment',
    type: [BillPaymentEntryResponseDto],
  })
  @Type(() => BillPaymentEntryResponseDto)
  entries: BillPaymentEntryResponseDto[];

  @ApiProperty({
    description: 'The attachments of the bill payment',
    type: [AttachmentLinkDto],
    required: false,
  })
  @Type(() => AttachmentLinkDto)
  attachments?: AttachmentLinkDto[];
}
