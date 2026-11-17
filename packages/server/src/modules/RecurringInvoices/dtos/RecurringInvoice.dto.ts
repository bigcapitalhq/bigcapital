import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ToNumber } from '@/common/decorators/Validators';
import { DiscountType } from '@/common/types/Discount';
import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import {
  RecurringInvoiceDeliveryMode,
  RecurringInvoiceFrequency,
} from '../RecurringInvoice.types';

export class CommandRecurringInvoiceDto {
  @ToNumber()
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'Customer ID', example: 1 })
  customerId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Recurring invoice profile name',
    example: 'Monthly retainer',
  })
  profileName: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The first invoice date',
    example: '2026-11-05',
  })
  startDate: string;

  @IsEnum(RecurringInvoiceFrequency)
  @ApiProperty({
    description: 'Recurrence frequency',
    enum: RecurringInvoiceFrequency,
    example: RecurringInvoiceFrequency.Month,
  })
  frequency: RecurringInvoiceFrequency;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Repeat every N periods',
    example: 1,
    default: 1,
  })
  repeatInterval?: number = 1;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Optional end date',
    example: '2027-11-05',
  })
  endDate?: string;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: 'Optional maximum number of generated invoices',
    example: 12,
  })
  maxOccurrences?: number;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({
    description: 'Due date offset in days from the invoice date',
    example: 15,
    default: 0,
  })
  dueDays?: number = 0;

  @IsOptional()
  @IsEnum(RecurringInvoiceDeliveryMode)
  @ApiPropertyOptional({
    description: 'What to do with generated invoices',
    enum: RecurringInvoiceDeliveryMode,
    default: RecurringInvoiceDeliveryMode.Draft,
  })
  deliveryMode?: RecurringInvoiceDeliveryMode =
    RecurringInvoiceDeliveryMode.Draft;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Email subject override' })
  emailSubject?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Email message override' })
  emailMessage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ description: 'Email CC recipients', type: [String] })
  emailCc?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ description: 'Email BCC recipients', type: [String] })
  emailBcc?: string[];

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Whether the generated invoice PDF is attached',
    default: true,
  })
  attachInvoice?: boolean = true;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Reference number' })
  referenceNo?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Invoice message' })
  invoiceMessage?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Terms and conditions' })
  termsConditions?: string;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ description: 'Exchange rate', example: 1 })
  exchangeRate?: number;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @ApiPropertyOptional({ description: 'Branch ID' })
  branchId?: number;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @ApiPropertyOptional({ description: 'Warehouse ID' })
  warehouseId?: number;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @ApiPropertyOptional({ description: 'PDF template ID' })
  pdfTemplateId?: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Whether tax is inclusive' })
  isInclusiveTax?: boolean;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ description: 'Discount value' })
  discount?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  @ApiPropertyOptional({ description: 'Discount type', enum: DiscountType })
  discountType?: DiscountType;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @ApiPropertyOptional({ description: 'Adjustment amount' })
  adjustment?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemEntryDto)
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'Recurring invoice line items',
    type: ItemEntryDto,
    isArray: true,
  })
  entries: ItemEntryDto[];
}

export class CreateRecurringInvoiceDto extends CommandRecurringInvoiceDto {}

export class EditRecurringInvoiceDto extends CommandRecurringInvoiceDto {}
