import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { AttachmentLinkDto } from '@/modules/Attachments/dtos/Attachment.dto';
import { BranchResponseDto } from '@/modules/Branches/dtos/BranchResponse.dto';
import { VendorResponseDto } from '@/modules/Vendors/dtos/VendorResponse.dto';
import { DiscountType } from '@/common/types/Discount';

export class VendorCreditResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the vendor credit',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The vendor credit number',
    example: 'VC-2024-001',
  })
  vendorCreditNumber: string;

  @ApiProperty({
    description: 'The date of the vendor credit',
    example: '2024-03-15T00:00:00Z',
  })
  vendorCreditDate: Date;

  @ApiProperty({
    description: 'The reference number',
    example: 'PO-2024-001',
    required: false,
  })
  referenceNo?: string;

  @ApiProperty({
    description: 'The ID of the vendor',
    example: 1001,
  })
  vendorId: number;

  @ApiProperty({
    description: 'The vendor credit amount',
    example: 1000,
  })
  amount: number;

  @ApiProperty({
    description: 'The currency code',
    example: 'USD',
    required: false,
  })
  currencyCode?: string;

  @ApiProperty({
    description: 'The exchange rate for currency conversion',
    example: 1.25,
    required: false,
  })
  exchangeRate?: number;

  @ApiProperty({
    description: 'Additional notes about the vendor credit',
    example: 'Credit for returned goods',
    required: false,
  })
  note?: string;

  @ApiProperty({
    description: 'The date the vendor credit was opened',
    example: '2024-03-15T00:00:00Z',
    required: false,
  })
  openedAt?: Date;

  @ApiProperty({
    description: 'The ID of the user who created the vendor credit',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'The amount already refunded',
    example: 0,
  })
  refundedAmount: number;

  @ApiProperty({
    description: 'The amount already invoiced (applied to bills)',
    example: 0,
  })
  invoicedAmount: number;

  @ApiProperty({
    description: 'The adjustment amount',
    example: 0,
    required: false,
  })
  adjustment?: number;

  @ApiProperty({
    description: 'The discount value',
    example: 0,
    required: false,
  })
  discount?: number;

  @ApiProperty({
    description: 'The type of discount (percentage or fixed)',
    enum: DiscountType,
    example: DiscountType.Amount,
    required: false,
  })
  discountType?: DiscountType;

  @ApiProperty({
    description: 'The ID of the branch',
    example: 1,
    required: false,
  })
  branchId?: number;

  @ApiProperty({
    description: 'The ID of the warehouse',
    example: 1,
    required: false,
  })
  warehouseId?: number;

  @ApiProperty({
    description: 'The line items of the vendor credit',
    type: [ItemEntryDto],
  })
  @Type(() => ItemEntryDto)
  entries: ItemEntryDto[];

  @ApiProperty({
    description: 'Branch details',
    type: () => BranchResponseDto,
    required: false,
  })
  @Type(() => BranchResponseDto)
  branch?: BranchResponseDto;

  @ApiProperty({
    description: 'Vendor details',
    type: () => VendorResponseDto,
    required: false,
  })
  @Type(() => VendorResponseDto)
  vendor?: VendorResponseDto;

  @ApiProperty({
    description: 'The attachments of the vendor credit',
    type: [AttachmentLinkDto],
    required: false,
  })
  attachments?: AttachmentLinkDto[];

  // Computed status flags
  @ApiProperty({
    description: 'Whether the vendor credit is in draft state',
    example: false,
  })
  isDraft: boolean;

  @ApiProperty({
    description: 'Whether the vendor credit has been published',
    example: true,
  })
  isPublished: boolean;

  @ApiProperty({
    description: 'Whether the vendor credit is open (has remaining credits)',
    example: true,
  })
  isOpen: boolean;

  @ApiProperty({
    description: 'Whether the vendor credit is closed (no remaining credits)',
    example: false,
  })
  isClosed: boolean;

  @ApiProperty({
    description: 'The remaining credits available',
    example: 1000,
  })
  creditsRemaining: number;

  // Computed amounts
  @ApiProperty({
    description: 'The subtotal (equal to amount)',
    example: 1000,
  })
  subtotal: number;

  @ApiProperty({
    description: 'The total amount after discount and adjustment',
    example: 950,
  })
  total: number;

  @ApiProperty({
    description: 'The amount in the local currency',
    example: 1250,
    required: false,
  })
  localAmount?: number;

  @ApiProperty({
    description: 'The subtotal in the local currency',
    example: 1250,
    required: false,
  })
  subtotalLocal?: number;

  @ApiProperty({
    description: 'The total in the local currency',
    example: 1187.5,
    required: false,
  })
  totalLocal?: number;

  @ApiProperty({
    description: 'The computed discount amount',
    example: 50,
    required: false,
  })
  discountAmount?: number;

  @ApiProperty({
    description: 'The computed discount amount in local currency',
    example: 62.5,
    required: false,
    nullable: true,
  })
  discountAmountLocal?: number | null;

  @ApiProperty({
    description:
      'The discount percentage (only when discountType is Percentage)',
    example: 10,
    required: false,
    nullable: true,
  })
  discountPercentage?: number | null;

  @ApiProperty({
    description: 'The adjustment amount in local currency',
    example: 0,
    required: false,
    nullable: true,
  })
  adjustmentLocal?: number | null;

  // Formatted fields
  @ApiProperty({
    description: 'Formatted vendor credit date',
    example: '2024-03-15',
    required: false,
  })
  formattedVendorCreditDate?: string;

  @ApiProperty({
    description: 'Formatted created at date',
    example: '2024-03-15',
    required: false,
  })
  formattedCreatedAt?: string;

  @ApiProperty({
    description: 'Formatted vendor credit amount',
    example: '$1,000.00',
    required: false,
  })
  formattedAmount?: string;

  @ApiProperty({
    description: 'Formatted subtotal',
    example: '1,000.00',
    required: false,
  })
  formattedSubtotal?: string;

  @ApiProperty({
    description: 'Formatted credits remaining',
    example: '$1,000.00',
    required: false,
  })
  formattedCreditsRemaining?: string;

  @ApiProperty({
    description: 'Formatted invoiced amount',
    example: '$0.00',
    required: false,
  })
  formattedInvoicedAmount?: string;

  @ApiProperty({
    description: 'Formatted discount amount',
    example: '$50.00',
    required: false,
  })
  discountAmountFormatted?: string;

  @ApiProperty({
    description: 'Formatted discount amount in local currency',
    example: '$62.50',
    required: false,
  })
  discountAmountLocalFormatted?: string;

  @ApiProperty({
    description: 'Formatted discount percentage',
    example: '10%',
    required: false,
  })
  discountPercentageFormatted?: string;

  @ApiProperty({
    description: 'Formatted adjustment amount',
    example: '$0.00',
    required: false,
  })
  adjustmentFormatted?: string;

  @ApiProperty({
    description: 'Formatted adjustment amount in local currency',
    example: '$0.00',
    required: false,
  })
  adjustmentLocalFormatted?: string;

  @ApiProperty({
    description: 'Formatted total amount',
    example: '$950.00',
    required: false,
  })
  totalFormatted?: string;

  // Timestamps
  @ApiProperty({
    description: 'The date when the vendor credit was created',
    example: '2024-03-15T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the vendor credit was last updated',
    example: '2024-03-16T00:00:00Z',
    required: false,
  })
  updatedAt?: Date;
}
