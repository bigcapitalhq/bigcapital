import { ToNumber } from '@/common/decorators/Validators';
import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

enum DiscountType {
  Percentage = 'percentage',
  Amount = 'amount',
}

class SaleReceiptEntryDto extends ItemEntryDto {}

class AttachmentDto {
  @IsString()
  key: string;
}

export class CommandSaleReceiptDto {
  @IsNotEmpty()
  @ToNumber()
  @IsNumber()
  @ApiProperty({
    description: 'The id of the customer',
    example: 1,
  })
  customerId: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'The exchange rate of the sale receipt',
    example: 1,
  })
  exchangeRate?: number;

  @IsNumber()
  @ToNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'The id of the deposit account', example: 1 })
  depositAccountId: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The date of the sale receipt',
    example: '2021-01-01',
  })
  receiptDate: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The receipt number of the sale receipt',
    example: '123456',
  })
  receiptNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The reference number of the sale receipt',
    example: '123456',
  })
  referenceNo?: string;

  @IsBoolean()
  @ApiProperty({
    description: 'Whether the sale receipt is closed',
    example: false,
  })
  closed: boolean = false;

  @IsOptional()
  @IsNumber()
  @ToNumber()
  @ApiProperty({
    description: 'The id of the warehouse',
    example: 1,
  })
  warehouseId?: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @ApiProperty({
    description: 'The id of the branch',
    example: 1,
  })
  branchId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleReceiptEntryDto)
  @ArrayMinSize(1)
  @ApiProperty({
    description: 'The entries of the sale receipt',
    example: [{ key: '123456' }],
  })
  entries: SaleReceiptEntryDto[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The receipt message of the sale receipt',
    example: '123456',
  })
  receiptMessage?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The statement of the sale receipt',
    example: '123456',
  })
  statement?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  @ApiProperty({
    description: 'The attachments of the sale receipt',
    example: [{ key: '123456' }],
  })
  attachments?: AttachmentDto[];

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @ApiProperty({
    description: 'The id of the pdf template',
    example: 1,
  })
  pdfTemplateId?: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @ApiProperty({
    description: 'The discount of the sale receipt',
    example: 1,
  })
  discount?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  @ApiProperty({
    description: 'The discount type of the sale receipt',
    example: DiscountType.Percentage,
  })
  discountType?: DiscountType;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @ApiProperty({
    description: 'The adjustment of the sale receipt',
    example: 1,
  })
  adjustment?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the sale receipt is inclusive of tax',
    example: false,
  })
  isInclusiveTax?: boolean = false;
}

export class CreateSaleReceiptDto extends CommandSaleReceiptDto {}
export class EditSaleReceiptDto extends CommandSaleReceiptDto {}
