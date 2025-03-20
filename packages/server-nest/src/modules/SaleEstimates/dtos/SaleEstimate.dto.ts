import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

enum DiscountType {
  Percentage = 'percentage',
  Amount = 'amount',
}

class SaleEstimateEntryDto extends ItemEntryDto {}

class AttachmentDto {
  @IsString()
  key: string;
}
export class CommandSaleEstimateDto {
  @IsNumber()
  customerId: number;

  @IsDate()
  @Type(() => Date)
  estimateDate: Date;

  @IsDate()
  @Type(() => Date)
  expirationDate: Date;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  estimateNumber?: string;

  @IsBoolean()
  delivered: boolean = false;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  exchangeRate?: number;

  @IsNumber()
  @IsOptional()
  warehouseId?: number;

  @IsNumber()
  @IsOptional()
  branchId?: number;

  @IsArray()
  @MinLength(1)
  @ValidateNested({ each: true })
  @Type(() => SaleEstimateEntryDto)
  entries: SaleEstimateEntryDto[];

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  termsConditions?: string;

  @IsString()
  @IsOptional()
  sendToEmail?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @IsNumber()
  @IsOptional()
  pdfTemplateId?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsEnum(DiscountType)
  discountType: DiscountType = DiscountType.Amount;

  @IsNumber()
  @IsOptional()
  adjustment?: number;
}

export class CreateSaleEstimateDto extends CommandSaleEstimateDto {}
export class EditSaleEstimateDto extends CommandSaleEstimateDto {}
