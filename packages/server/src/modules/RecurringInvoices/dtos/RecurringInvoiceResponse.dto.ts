import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { CustomerResponseDto } from '@/modules/Customers/dtos/CustomerResponse.dto';
import { BranchLinkDto } from '@/modules/Branches/dtos/BranchLink.dto';

export class RecurringInvoiceResponseDto {
  @ApiProperty({ description: 'Recurring invoice ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Customer ID', example: 1 })
  customerId: number;

  @ApiPropertyOptional({
    description: 'The customer of the recurring invoice profile',
    type: () => CustomerResponseDto,
  })
  @Type(() => CustomerResponseDto)
  customer?: CustomerResponseDto;

  @ApiPropertyOptional({
    description: 'The branch of the recurring invoice profile',
    type: () => BranchLinkDto,
  })
  @Type(() => BranchLinkDto)
  branch?: BranchLinkDto;

  @ApiProperty({ description: 'Profile name', example: 'Monthly retainer' })
  profileName: string;

  @ApiPropertyOptional({ description: 'Reference number' })
  referenceNo?: string;

  @ApiPropertyOptional({ description: 'Invoice message' })
  invoiceMessage?: string;

  @ApiPropertyOptional({ description: 'Terms and conditions' })
  termsConditions?: string;

  @ApiPropertyOptional({ description: 'Currency code', example: 'USD' })
  currencyCode?: string;

  @ApiPropertyOptional({ description: 'Exchange rate', example: 1 })
  exchangeRate?: number;

  @ApiPropertyOptional({ description: 'Discount value' })
  discount?: number;

  @ApiPropertyOptional({ description: 'Discount type' })
  discountType?: string;

  @ApiPropertyOptional({ description: 'Adjustment amount' })
  adjustment?: number;

  @ApiPropertyOptional({ description: 'Whether tax is inclusive' })
  isInclusiveTax?: boolean;

  @ApiPropertyOptional({ description: 'Branch ID' })
  branchId?: number;

  @ApiPropertyOptional({ description: 'Warehouse ID' })
  warehouseId?: number;

  @ApiPropertyOptional({ description: 'PDF template ID' })
  pdfTemplateId?: number;

  @ApiProperty({
    description: 'Profile status',
    enum: ['active', 'paused', 'completed'],
  })
  status: string;

  @ApiProperty({
    description: 'Recurrence frequency',
    enum: ['day', 'week', 'month', 'year'],
  })
  frequency: string;

  @ApiProperty({ description: 'Repeat interval', example: 1 })
  repeatInterval: number;

  @ApiProperty({ description: 'Start date', example: '2026-11-05' })
  startDate: string;

  @ApiPropertyOptional({ description: 'End date', example: '2027-11-05' })
  endDate?: string;

  @ApiPropertyOptional({ description: 'Maximum occurrences', example: 12 })
  maxOccurrences?: number;

  @ApiProperty({ description: 'Generated occurrences count', example: 3 })
  occurrencesCount: number;

  @ApiPropertyOptional({
    description: 'Next invoice date',
    example: '2026-12-05',
  })
  nextInvoiceDate?: string;

  @ApiPropertyOptional({
    description: 'Last generated invoice date',
    example: '2026-11-05',
  })
  lastInvoiceDate?: string;

  @ApiProperty({ description: 'Due date offset in days', example: 15 })
  dueDays: number;

  @ApiProperty({
    description: 'Delivery mode',
    enum: ['draft', 'email'],
  })
  deliveryMode: string;

  @ApiPropertyOptional({ description: 'Email subject override' })
  emailSubject?: string;

  @ApiPropertyOptional({ description: 'Email message override' })
  emailMessage?: string;

  @ApiPropertyOptional({ description: 'Email CC recipients', type: [String] })
  emailCc?: string[];

  @ApiPropertyOptional({ description: 'Email BCC recipients', type: [String] })
  emailBcc?: string[];

  @ApiPropertyOptional({ description: 'Whether the PDF is attached' })
  attachInvoice?: boolean;

  @ApiPropertyOptional({ description: 'Last generation error' })
  lastError?: string;

  @ApiPropertyOptional({ description: 'Consecutive failure count' })
  failureCount?: number;

  @ApiPropertyOptional({
    description: 'Recurring invoice line items',
    type: [ItemEntryDto],
  })
  entries?: ItemEntryDto[];

  @ApiPropertyOptional({ description: 'Subtotal amount' })
  subtotal?: number;

  @ApiPropertyOptional({ description: 'Tax amount' })
  taxAmount?: number;

  @ApiPropertyOptional({ description: 'Discount amount' })
  discountAmount?: number;

  @ApiPropertyOptional({ description: 'Total amount' })
  total?: number;

  @ApiPropertyOptional({ description: 'Formatted start date' })
  startDateFormatted?: string;

  @ApiPropertyOptional({ description: 'Formatted end date' })
  endDateFormatted?: string;

  @ApiPropertyOptional({ description: 'Formatted next invoice date' })
  nextInvoiceDateFormatted?: string;

  @ApiPropertyOptional({ description: 'Formatted last invoice date' })
  lastInvoiceDateFormatted?: string;

  @ApiPropertyOptional({ description: 'Formatted created date' })
  createdAtFormatted?: string;

  @ApiPropertyOptional({ description: 'Formatted total' })
  totalFormatted?: string;

  @ApiPropertyOptional({ description: 'Formatted subtotal' })
  subtotalFormatted?: string;

  @ApiPropertyOptional({ description: 'Formatted tax amount' })
  taxAmountFormatted?: string;

  @ApiPropertyOptional({ description: 'Formatted discount amount' })
  discountAmountFormatted?: string;

  @ApiPropertyOptional({ description: 'Formatted adjustment amount' })
  adjustmentFormatted?: string;
}
