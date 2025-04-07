import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

enum DiscountType {
  Percentage = 'percentage',
  Amount = 'amount',
}

class PaymentMethodDto {
  @IsInt()
  paymentIntegrationId: number;

  @IsBoolean()
  enable: boolean;
}


class AttachmentDto {
  @IsString()
  key: string;
}

class CommandSaleInvoiceDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'Customer ID', example: 1 })
  customerId: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({ description: 'Invoice date', example: '2023-01-01T00:00:00Z' })
  invoiceDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({ description: 'Due date', example: '2023-01-15T00:00:00Z' })
  dueDate: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Invoice number',
    required: false,
    example: 'INV-001',
  })
  invoiceNo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Reference number',
    required: false,
    example: 'REF-001',
  })
  referenceNo?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the invoice is delivered',
    default: false,
    required: false,
  })
  delivered: boolean = false;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Invoice message',
    required: false,
    example: 'Thank you for your business',
  })
  invoiceMessage?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Terms and conditions',
    required: false,
    example: 'Payment due within 14 days',
  })
  termsConditions?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Exchange rate',
    required: false,
    minimum: 0,
    example: 1.0,
  })
  exchangeRate?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'Warehouse ID', required: false, example: 1 })
  warehouseId?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'Branch ID', required: false, example: 1 })
  branchId?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'Project ID', required: false, example: 1 })
  projectId?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether tax is inclusive',
    required: false,
    example: false,
  })
  isInclusiveTax?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemEntryDto)
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'Invoice line items',
    type: [ItemEntryDto],
    minItems: 1,
  })
  entries: ItemEntryDto[];

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'PDF template ID', required: false, example: 1 })
  pdfTemplateId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodDto)
  @ApiProperty({
    description: 'Payment methods',
    type: [PaymentMethodDto],
    required: false,
  })
  paymentMethods?: PaymentMethodDto[];

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'Discount value', required: false, example: 10 })
  discount?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  @ApiProperty({
    description: 'Discount type',
    enum: DiscountType,
    required: false,
    example: DiscountType.Percentage,
  })
  discountType?: DiscountType;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Adjustment amount',
    required: false,
    example: 5,
  })
  adjustment?: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    description: 'ID of the estimate this invoice is created from',
    required: false,
    example: 1,
  })
  fromEstimateId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  @ApiProperty({
    description: 'The attachments of the sale receipt',
    example: [{ key: '123456' }],
  })
  attachments?: AttachmentDto[];
}

export class CreateSaleInvoiceDto extends CommandSaleInvoiceDto {}
export class EditSaleInvoiceDto extends CommandSaleInvoiceDto {}
