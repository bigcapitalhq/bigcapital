import { ApiProperty } from '@nestjs/swagger';
import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { AttachmentLinkDto } from '@/modules/Attachments/dtos/Attachment.dto';
import { DiscountType } from '@/common/types/Discount';

export class CreditNoteResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the credit note',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The date of the credit note',
    example: '2023-01-01T00:00:00Z',
  })
  creditNoteDate: Date;

  @ApiProperty({ description: 'The credit note number', example: 'CN-001' })
  creditNoteNumber: string;

  @ApiProperty({
    description: 'The reference number',
    example: 'REF-001',
    required: false,
  })
  referenceNo?: string;

  @ApiProperty({ description: 'The ID of the customer', example: 1 })
  customerId: number;

  @ApiProperty({
    description: 'The exchange rate for currency conversion',
    example: 1.0,
    required: false,
  })
  exchangeRate?: number;

  @ApiProperty({
    description: 'The currency code',
    example: 'USD',
    required: false,
  })
  currencyCode?: string;

  @ApiProperty({
    description: 'Custom note on the credit note',
    example: 'Thank you for your business',
    required: false,
  })
  note?: string;

  @ApiProperty({
    description: 'Terms and conditions of the credit note',
    example: 'Valid for 30 days',
    required: false,
  })
  termsConditions?: string;

  @ApiProperty({
    description: 'Whether the credit note is open',
    example: true,
  })
  isOpen: boolean;

  @ApiProperty({
    description: 'Whether the credit note is closed',
    example: false,
  })
  isClosed: boolean;

  @ApiProperty({
    description: 'The line items of the credit note',
    type: [ItemEntryDto],
  })
  entries: ItemEntryDto[];

  @ApiProperty({
    description: 'The ID of the warehouse',
    example: 1,
    required: false,
  })
  warehouseId?: number;

  @ApiProperty({
    description: 'The ID of the branch',
    example: 1,
    required: false,
  })
  branchId?: number;

  @ApiProperty({
    description: 'The attachments of the credit note',
    type: [AttachmentLinkDto],
    required: false,
  })
  attachments?: AttachmentLinkDto[];

  @ApiProperty({
    description: 'The discount value',
    example: 10,
    required: false,
  })
  discount?: number;

  @ApiProperty({
    description: 'The type of discount (percentage or fixed)',
    enum: DiscountType,
    example: DiscountType.Percentage,
    required: false,
  })
  discountType?: DiscountType;

  @ApiProperty({
    description: 'The adjustment amount',
    example: 5,
    required: false,
  })
  adjustment?: number;

  @ApiProperty({
    description: 'The ID of the PDF template',
    example: 1,
    required: false,
  })
  pdfTemplateId?: number;

  @ApiProperty({
    description: 'The total amount of credits remaining',
    example: 100,
    required: false,
  })
  creditsRemaining?: number;

  @ApiProperty({
    description: 'The total amount of credits used',
    example: 50,
    required: false,
  })
  creditsUsed?: number;

  @ApiProperty({
    description: 'The subtotal amount before discount and adjustments',
    example: 900,
  })
  subtotal: number;

  @ApiProperty({
    description: 'The subtotal amount in local currency',
    example: 900,
    required: false,
  })
  subtotalLocal?: number;

  @ApiProperty({
    description: 'The discount amount',
    example: 10,
    required: false,
  })
  discountAmount?: number;

  @ApiProperty({
    description: 'The discount amount in local currency',
    example: 10,
    required: false,
  })
  discountAmountLocal?: number;

  @ApiProperty({
    description: 'The discount percentage',
    example: 10,
    required: false,
  })
  discountPercentage?: number;

  @ApiProperty({
    description: 'The adjustment amount in local currency',
    example: 5,
    required: false,
  })
  adjustmentLocal?: number;

  @ApiProperty({
    description: 'The total amount after discount and adjustments',
    example: 1000,
  })
  total: number;

  @ApiProperty({
    description: 'The total amount in local currency',
    example: 1000,
    required: false,
  })
  totalLocal?: number;

  @ApiProperty({
    description: 'The date when the credit note was created',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the credit note was last updated',
    example: '2023-01-02T00:00:00Z',
    required: false,
  })
  updatedAt?: Date;

  // Formatted fields from transformer
  @ApiProperty({
    description: 'Formatted credit note date',
    example: '2023-01-01',
  })
  formattedCreditNoteDate: string;

  @ApiProperty({
    description: 'Formatted created at date',
    example: '2023-01-01',
  })
  formattedCreatedAt: string;

  @ApiProperty({ description: 'Formatted amount', example: '$1,000.00' })
  formattedAmount: string;

  @ApiProperty({
    description: 'Formatted credits remaining',
    example: '$100.00',
  })
  formattedCreditsRemaining: string;

  @ApiProperty({ description: 'Formatted credits used', example: '$50.00' })
  formattedCreditsUsed: string;

  @ApiProperty({ description: 'Formatted subtotal', example: '$900.00' })
  formattedSubtotal: string;

  @ApiProperty({ description: 'Formatted discount amount', example: '$10.00' })
  discountAmountFormatted: string;

  @ApiProperty({
    description: 'Formatted discount amount in local currency',
    example: '$10.00',
  })
  discountAmountLocalFormatted: string;

  @ApiProperty({ description: 'Formatted discount percentage', example: '10%' })
  discountPercentageFormatted: string;

  @ApiProperty({ description: 'Formatted adjustment', example: '$5.00' })
  adjustmentFormatted: string;

  @ApiProperty({
    description: 'Formatted adjustment in local currency',
    example: '$5.00',
  })
  adjustmentLocalFormatted: string;

  @ApiProperty({ description: 'Formatted total', example: '$1,000.00' })
  totalFormatted: string;

  @ApiProperty({
    description: 'Formatted total in local currency',
    example: '$1,000.00',
  })
  totalLocalFormatted: string;
}
