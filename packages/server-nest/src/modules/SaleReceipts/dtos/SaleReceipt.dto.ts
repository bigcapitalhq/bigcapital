import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
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
  @IsNumber()
  customerId: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  exchangeRate?: number;

  @IsNumber()
  depositAccountId: number;

  @IsDate()
  receiptDate: Date;

  @IsOptional()
  @IsString()
  receiptNumber?: string;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsBoolean()
  closed: boolean = false;

  @IsOptional()
  @IsNumber()
  warehouseId?: number;

  @IsOptional()
  @IsNumber()
  branchId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleReceiptEntryDto)
  @Min(1)
  entries: SaleReceiptEntryDto[];

  @IsOptional()
  @IsString()
  receiptMessage?: string;

  @IsOptional()
  @IsString()
  statement?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @IsOptional()
  @IsNumber()
  pdfTemplateId?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @IsOptional()
  @IsNumber()
  adjustment?: number;
}

export class CreateSaleReceiptDto extends CommandSaleReceiptDto {}
export class EditSaleReceiptDto extends CommandSaleReceiptDto {}
