import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DiscountType } from '@/common/types/Discount';
import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { AttachmentLinkDto } from '@/modules/Attachments/dtos/Attachment.dto';
import { CustomerResponseDto } from '@/modules/Customers/dtos/CustomerResponse.dto';
import { AccountResponseDto } from '@/modules/Accounts/dtos/AccountResponse.dto';
import { BranchResponseDto } from '@/modules/Branches/dtos/BranchResponse.dto';
import { WarehouseResponseDto } from '@/modules/Warehouses/dtos/WarehouseResponse.dto';

export class SaleReceiptResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the sale receipt',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The date of the sale receipt',
    example: '2024-01-01T00:00:00Z',
  })
  receiptDate: Date;

  @ApiProperty({ description: 'The receipt number', example: 'SR-2024-001' })
  receiptNumber: string;

  @ApiProperty({
    description: 'The reference number',
    example: 'REF-001',
    required: false,
  })
  referenceNo?: string;

  @ApiProperty({ description: 'The ID of the customer', example: 1 })
  customerId: number;

  @ApiProperty({
    description: 'The customer details',
    type: CustomerResponseDto,
  })
  @Type(() => CustomerResponseDto)
  customer: CustomerResponseDto;

  @ApiProperty({ description: 'The ID of the deposit account', example: 1 })
  depositAccountId: number;

  @ApiProperty({
    description: 'The deposit account details',
    type: AccountResponseDto,
  })
  @Type(() => AccountResponseDto)
  depositAccount: AccountResponseDto;

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
    description: 'The message on the receipt',
    example: 'Thank you for your payment',
    required: false,
  })
  receiptMessage?: string;

  @ApiProperty({
    description: 'The statement on the receipt',
    example: 'Paid in full',
    required: false,
  })
  statement?: string;

  @ApiProperty({ description: 'Whether the receipt is closed', example: false })
  closed: boolean;

  @ApiProperty({
    description: 'The date when the receipt was closed',
    example: '2024-01-02T00:00:00Z',
    required: false,
  })
  closedAt?: Date | string;

  @ApiProperty({
    description: 'The ID of the warehouse',
    example: 1,
    required: false,
  })
  warehouseId?: number;

  @ApiProperty({
    description: 'The warehouse details',
    type: WarehouseResponseDto,
    required: false,
  })
  @Type(() => WarehouseResponseDto)
  warehouse?: WarehouseResponseDto;

  @ApiProperty({
    description: 'The ID of the branch',
    example: 1,
    required: false,
  })
  branchId?: number;

  @ApiProperty({
    description: 'The branch details',
    type: BranchResponseDto,
    required: false,
  })
  @Type(() => BranchResponseDto)
  branch?: BranchResponseDto;

  @ApiProperty({
    description: 'The entries of the sale receipt',
    type: [ItemEntryDto],
  })
  @Type(() => ItemEntryDto)
  entries: ItemEntryDto[];

  @ApiProperty({
    description: 'The attachments of the sale receipt',
    type: [AttachmentLinkDto],
    required: false,
  })
  @Type(() => AttachmentLinkDto)
  attachments?: AttachmentLinkDto[];

  @ApiProperty({
    description: 'The discount value',
    example: 100,
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
    example: 50,
    required: false,
  })
  adjustment?: number;

  @ApiProperty({
    description: 'The subtotal amount before discount and adjustments',
    example: 900,
  })
  subtotal: number;

  @ApiProperty({ description: 'The subtotal in local currency', example: 900 })
  subtotalLocal: number;

  @ApiProperty({ description: 'The formatted subtotal', example: '900.00' })
  subtotalFormatted: string;

  @ApiProperty({
    description: 'The formatted subtotal in local currency',
    example: '900.00',
  })
  subtotalLocalFormatted: string;

  @ApiProperty({
    description: 'The total amount after discount and adjustments',
    example: 1000,
  })
  total: number;

  @ApiProperty({ description: 'The total in local currency', example: 1000 })
  totalLocal: number;

  @ApiProperty({ description: 'The formatted total', example: '1,000.00' })
  totalFormatted: string;

  @ApiProperty({
    description: 'The formatted total in local currency',
    example: '1,000.00',
  })
  totalLocalFormatted: string;

  @ApiProperty({ description: 'The formatted amount', example: '1,000.00' })
  formattedAmount: string;

  @ApiProperty({
    description: 'The formatted receipt date',
    example: '2024-01-01',
  })
  formattedReceiptDate: string;

  @ApiProperty({
    description: 'The formatted closed at date',
    example: '2024-01-02',
  })
  formattedClosedAtDate: string;

  @ApiProperty({
    description: 'The formatted created at date',
    example: '2024-01-01',
  })
  formattedCreatedAt: string;

  @ApiProperty({
    description: 'The formatted discount amount',
    example: '100.00',
  })
  discountAmountFormatted: string;

  @ApiProperty({
    description: 'The formatted discount percentage',
    example: '10%',
  })
  discountPercentageFormatted: string;

  @ApiProperty({
    description: 'The formatted adjustment amount',
    example: '50.00',
  })
  adjustmentFormatted: string;

  @ApiProperty({
    description: 'The date when the receipt was created',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the receipt was last updated',
    example: '2024-01-02T00:00:00Z',
    required: false,
  })
  updatedAt?: Date;
}
