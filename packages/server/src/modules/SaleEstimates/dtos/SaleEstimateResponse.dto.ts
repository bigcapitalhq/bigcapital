import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { AttachmentLinkDto } from '@/modules/Attachments/dtos/Attachment.dto';

export class SaleEstimateResponseDto {
  // Model attributes
  @ApiProperty({ description: 'Unique identifier of the customer', example: 1 })
  customerId: number;

  @ApiProperty({ description: 'Date of the estimate', example: '2024-01-01' })
  estimateDate: string;

  @ApiProperty({
    description: 'Expiration date of the estimate',
    example: '2024-01-31',
  })
  expirationDate: string;

  @ApiProperty({
    description: 'Reference number of the estimate',
    example: 'EST-2024-001',
  })
  reference: string;

  @ApiProperty({ description: 'Estimate number', example: 'EST-2024-001' })
  estimateNumber: string;

  @ApiProperty({
    description: 'Note for the estimate',
    example: 'This is a note.',
  })
  note: string;

  @ApiProperty({
    description: 'Terms and conditions for the estimate',
    example: 'Payment due in 30 days.',
  })
  termsConditions: string;

  @ApiProperty({
    description: 'Email to send the estimate to',
    example: 'customer@email.com',
  })
  sendToEmail: string;

  @ApiProperty({
    description: 'Exchange rate used for the estimate',
    example: 1,
  })
  exchangeRate: number;

  @ApiProperty({ description: 'Amount of the estimate', example: 1000 })
  amount: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currencyCode: string;

  @ApiProperty({
    description: 'Delivered at date',
    example: '2024-01-05',
    required: false,
  })
  deliveredAt?: string;

  @ApiProperty({
    description: 'Approved at date',
    example: '2024-01-10',
    required: false,
  })
  approvedAt?: string;

  @ApiProperty({
    description: 'Rejected at date',
    example: '2024-01-15',
    required: false,
  })
  rejectedAt?: string;

  @ApiProperty({ description: 'User ID who created the estimate', example: 42 })
  userId: number;

  @ApiProperty({
    description: 'Converted to invoice ID',
    example: 100,
    required: false,
  })
  convertedToInvoiceId?: number;

  @ApiProperty({
    description: 'Converted to invoice at date',
    example: '2024-02-01',
    required: false,
  })
  convertedToInvoiceAt?: string;

  @ApiProperty({
    description: 'Created at date',
    example: '2024-01-01',
    required: false,
  })
  createdAt?: string;

  @ApiProperty({
    description: 'Updated at date',
    example: '2024-01-10',
    required: false,
  })
  updatedAt?: string;

  @ApiProperty({ description: 'Branch ID', example: 2, required: false })
  branchId?: number;

  @ApiProperty({ description: 'Warehouse ID', example: 3, required: false })
  warehouseId?: number;

  @ApiProperty({ description: 'Discount value', example: 100 })
  discount: number;

  @ApiProperty({ description: 'Discount type', example: 'amount' })
  discountType: string;

  @ApiProperty({ description: 'Adjustment value', example: 50 })
  adjustment: number;

  // Formatted/virtual fields
  @ApiProperty({
    description: 'Formatted subtotal of the estimate',
    example: '1,000.00',
  })
  formattedSubtotal: string;

  @ApiProperty({
    description: 'Formatted total amount of the estimate',
    example: '1,200.00',
  })
  formattedAmount: string;

  @ApiProperty({
    description: 'Formatted estimate date',
    example: '2024-01-01',
  })
  formattedEstimateDate: string;

  @ApiProperty({
    description: 'Formatted expiration date',
    example: '2024-01-31',
  })
  formattedExpirationDate: string;

  @ApiProperty({
    description: 'Formatted delivered at date',
    example: '2024-01-05',
  })
  formattedDeliveredAtDate: string;

  @ApiProperty({
    description: 'Formatted approved at date',
    example: '2024-01-10',
  })
  formattedApprovedAtDate: string;

  @ApiProperty({
    description: 'Formatted rejected at date',
    example: '2024-01-15',
  })
  formattedRejectedAtDate: string;

  @ApiProperty({ description: 'Formatted discount amount', example: '100.00' })
  discountAmountFormatted: string;

  @ApiProperty({ description: 'Formatted discount percentage', example: '10%' })
  discountPercentageFormatted: string;

  @ApiProperty({ description: 'Formatted adjustment amount', example: '50.00' })
  adjustmentFormatted: string;

  @ApiProperty({ description: 'Formatted total', example: '1,150.00' })
  totalFormatted: string;

  @ApiProperty({
    description: 'Formatted total in local currency',
    example: '1,200.00',
  })
  totalLocalFormatted: string;

  @ApiProperty({
    description: 'Formatted created at date',
    example: '2024-01-01',
  })
  formattedCreatedAt: string;

  @ApiProperty({
    description: 'Entries of the sale estimate',
    type: [ItemEntryDto],
  })
  @Type(() => ItemEntryDto)
  entries: ItemEntryDto[];

  @ApiProperty({
    description: 'Attachments of the sale estimate',
    type: [AttachmentLinkDto],
  })
  @Type(() => AttachmentLinkDto)
  attachments: AttachmentLinkDto[];
}
