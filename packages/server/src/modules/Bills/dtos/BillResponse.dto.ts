import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { AttachmentLinkDto } from '@/modules/Attachments/dtos/Attachment.dto';
import { BranchResponseDto } from '@/modules/Branches/dtos/BranchResponse.dto';
import { SaleInvoiceTaxEntryDto } from '@/modules/SaleInvoices/dtos/SaleInvoiceTaxEntry.dto';
import { VendorResponseDto } from '@/modules/Vendors/dtos/VendorResponse.dto';
import { DiscountType } from '@/common/types/Discount';

export class BillResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the bill',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The bill number',
    example: 'BILL-2024-001',
  })
  billNumber: string;

  @ApiProperty({
    description: 'The date the bill was issued',
    example: '2024-03-15T00:00:00Z',
  })
  billDate: Date;

  @ApiProperty({
    description: 'The due date of the bill',
    example: '2024-04-15T00:00:00Z',
  })
  dueDate: Date;

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
    description: 'The exchange rate for currency conversion',
    example: 1.25,
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
    description: 'Additional notes about the bill',
    example: 'Office supplies and equipment for Q2 2024',
    required: false,
  })
  note?: string;

  @ApiProperty({
    description: 'Whether tax is inclusive in the item rates',
    example: false,
    required: false,
  })
  isInclusiveTax?: boolean;

  @ApiProperty({
    description: 'The line items of the bill',
    type: [ItemEntryDto],
  })
  entries: ItemEntryDto[];

  @ApiProperty({
    description: 'The tax entries of the bill',
    type: [SaleInvoiceTaxEntryDto],
    required: false,
  })
  taxes?: SaleInvoiceTaxEntryDto[];

  @ApiProperty({
    description: 'The ID of the warehouse',
    example: 101,
    required: false,
  })
  warehouseId?: number;

  @ApiProperty({
    description: 'The ID of the branch',
    example: 201,
    required: false,
  })
  branchId?: number;

  @ApiProperty({
    description: 'Branch details',
    type: () => BranchResponseDto,
    required: false,
  })
  @Type(() => BranchResponseDto)
  branch?: BranchResponseDto;

  @ApiProperty({
    description: 'The ID of the project',
    example: 301,
    required: false,
  })
  projectId?: number;

  @ApiProperty({
    description: 'The attachments of the bill',
    type: [AttachmentLinkDto],
    required: false,
  })
  attachments?: AttachmentLinkDto[];

  @ApiProperty({
    description: 'The discount value',
    example: 100,
    required: false,
  })
  discount?: number;

  @ApiProperty({
    description: 'The computed discount amount',
    example: 100,
    required: false,
  })
  discountAmount?: number;

  @ApiProperty({
    description: 'The type of discount (percentage or fixed)',
    enum: DiscountType,
    example: DiscountType.Amount,
    required: false,
  })
  discountType?: DiscountType;

  @ApiProperty({
    description: 'The adjustment amount',
    example: 50,
    required: false,
  })
  adjustment?: number;

  @ApiProperty({
    description: 'The total amount of tax withheld',
    example: 50,
    required: false,
  })
  taxAmountWithheld?: number;

  @ApiProperty({
    description: 'The balance of the bill',
    example: 1000,
  })
  balance: number;

  @ApiProperty({
    description: 'The amount paid',
    example: 500,
  })
  paymentAmount: number;

  @ApiProperty({
    description: 'The amount credited',
    example: 0,
    required: false,
  })
  creditedAmount?: number;

  @ApiProperty({
    description: 'The subtotal amount before tax and adjustments',
    example: 900,
  })
  subtotal: number;

  @ApiProperty({
    description: 'The total amount including tax and adjustments',
    example: 1000,
  })
  total: number;

  @ApiProperty({
    description: 'The due amount remaining to be paid',
    example: 500,
  })
  dueAmount: number;

  @ApiProperty({
    description: 'Whether the bill is overdue',
    example: false,
  })
  isOverdue: boolean;

  @ApiProperty({
    description: 'Whether the bill is partially paid',
    example: true,
  })
  isPartiallyPaid: boolean;

  @ApiProperty({
    description: 'Whether the bill is fully paid',
    example: false,
  })
  isFullyPaid: boolean;

  @ApiProperty({
    description: 'Whether the bill is currently open for editing',
    example: false,
    required: false,
  })
  isOpen?: boolean;

  @ApiProperty({
    description: 'The date when the bill was created',
    example: '2024-03-15T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the bill was last updated',
    example: '2024-03-16T00:00:00Z',
    required: false,
  })
  updatedAt?: Date;

  // Formatted fields from transformer
  @ApiProperty({
    description: 'Formatted bill date',
    example: '2024-03-15',
    required: false,
  })
  formattedBillDate?: string;

  @ApiProperty({
    description: 'Formatted due date',
    example: '2024-04-15',
    required: false,
  })
  formattedDueDate?: string;

  @ApiProperty({
    description: 'Formatted created at date',
    example: '2024-03-15',
    required: false,
  })
  formattedCreatedAt?: string;

  @ApiProperty({
    description: 'Formatted bill amount',
    example: '$1,000.00',
    required: false,
  })
  formattedAmount?: string;

  @ApiProperty({
    description: 'Formatted payment amount',
    example: '$500.00',
    required: false,
  })
  formattedPaymentAmount?: string;

  @ApiProperty({
    description: 'Formatted balance amount',
    example: '$500.00',
    required: false,
  })
  formattedBalance?: string;

  @ApiProperty({
    description: 'Formatted due amount',
    example: '$500.00',
    required: false,
  })
  formattedDueAmount?: string;

  @ApiProperty({
    description: 'Formatted exchange rate',
    example: '1.25',
    required: false,
  })
  formattedExchangeRate?: string;

  @ApiProperty({
    description: 'Formatted subtotal',
    example: '$900.00',
    required: false,
  })
  subtotalFormatted?: string;

  @ApiProperty({
    description: 'Formatted subtotal in local currency',
    example: '$900.00',
    required: false,
  })
  subtotalLocalFormatted?: string;

  @ApiProperty({
    description: 'Formatted subtotal excluding tax',
    example: '$800.00',
    required: false,
  })
  subtotalExcludingTaxFormatted?: string;

  @ApiProperty({
    description: 'Formatted tax amount withheld in local currency',
    example: '$50.00',
    required: false,
  })
  taxAmountWithheldLocalFormatted?: string;

  @ApiProperty({
    description: 'Formatted total',
    example: '$1,000.00',
    required: false,
  })
  totalFormatted?: string;

  @ApiProperty({
    description: 'Formatted total in local currency',
    example: '$1,000.00',
    required: false,
  })
  totalLocalFormatted?: string;

  @ApiProperty({
    description: 'Formatted discount amount',
    example: '$100.00',
    required: false,
  })
  discountAmountFormatted?: string;

  @ApiProperty({
    description: 'Formatted discount percentage',
    example: '10%',
    required: false,
  })
  discountPercentageFormatted?: string;

  @ApiProperty({
    description: 'Formatted adjustment amount',
    example: '$50.00',
    required: false,
  })
  adjustmentFormatted?: string;

  @ApiProperty({
    description: 'The vendor of the bill',
    type: () => VendorResponseDto,
  })
  @Type(() => VendorResponseDto)
  vendor: VendorResponseDto;

  @ApiProperty({
    description: 'Number of days the bill is overdue',
    example: 0,
    nullable: true,
  })
  overdueDays: number;

  @ApiProperty({
    description: 'Number of days remaining until the bill is due',
    example: 15,
    nullable: true,
  })
  remainingDays: number;
}
