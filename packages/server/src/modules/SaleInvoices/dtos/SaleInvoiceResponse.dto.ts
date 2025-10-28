import { ApiProperty } from '@nestjs/swagger';
import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { AttachmentLinkDto } from '@/modules/Attachments/dtos/Attachment.dto';
import { PaymentMethodDto } from '../dtos/SaleInvoice.dto';
import { DiscountType } from '@/common/types/Discount';

export class SaleInvoiceResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the sale invoice',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The date of the invoice',
    example: '2023-01-01T00:00:00Z',
  })
  invoiceDate: Date;

  @ApiProperty({
    description: 'The due date of the invoice',
    example: '2023-01-15T00:00:00Z',
  })
  dueDate: Date;

  @ApiProperty({
    description: 'The invoice number',
    example: 'INV-001',
  })
  invoiceNo: string;

  @ApiProperty({
    description: 'The reference number',
    example: 'REF-001',
    required: false,
  })
  referenceNo?: string;

  @ApiProperty({
    description: 'The ID of the customer',
    example: 1,
  })
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
    description: 'Custom message on the invoice',
    example: 'Thank you for your business',
    required: false,
  })
  invoiceMessage?: string;

  @ApiProperty({
    description: 'Terms and conditions of the invoice',
    example: 'Payment due within 14 days',
    required: false,
  })
  termsConditions?: string;

  @ApiProperty({
    description: 'Whether tax is inclusive in the item rates',
    example: false,
    required: false,
  })
  isInclusiveTax?: boolean;

  @ApiProperty({
    description: 'The line items of the invoice',
    type: [ItemEntryDto],
  })
  entries: ItemEntryDto[];

  @ApiProperty({
    description: 'Whether the invoice has been delivered',
    example: false,
  })
  delivered: boolean;

  @ApiProperty({
    description: 'The date when the invoice was delivered',
    example: '2023-01-02T00:00:00Z',
    required: false,
  })
  deliveredAt?: Date;

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
    description: 'The ID of the project',
    example: 1,
    required: false,
  })
  projectId?: number;

  @ApiProperty({
    description: 'The attachments of the invoice',
    type: [AttachmentLinkDto],
    required: false,
  })
  attachments?: AttachmentLinkDto[];

  @ApiProperty({
    description: 'The payment methods associated with the invoice',
    type: [PaymentMethodDto],
    required: false,
  })
  paymentMethods?: PaymentMethodDto[];

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
    description: 'The total amount of tax withheld',
    example: 50,
    required: false,
  })
  taxAmountWithheld?: number;

  @ApiProperty({
    description: 'The balance of the invoice',
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
    description: 'Whether the invoice is overdue',
    example: false,
  })
  isOverdue: boolean;

  @ApiProperty({
    description: 'Whether the invoice is partially paid',
    example: true,
  })
  isPartiallyPaid: boolean;

  @ApiProperty({
    description: 'Whether the invoice is fully paid',
    example: false,
  })
  isFullyPaid: boolean;

  @ApiProperty({
    description: 'The date when the invoice was created',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the invoice was last updated',
    example: '2023-01-02T00:00:00Z',
    required: false,
  })
  updatedAt?: Date;
}
