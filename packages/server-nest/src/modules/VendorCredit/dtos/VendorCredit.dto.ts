import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

enum DiscountType {
  Percentage = 'percentage',
  Amount = 'amount',
}

export class VendorCreditEntryDto extends ItemEntryDto {}

class AttachmentDto {
  @IsString()
  key: string;
}

export class CommandVendorCreditDto {
  @IsNumber()
  vendorId: number;

  @IsNumber()
  @IsOptional()
  exchangeRate?: number;

  @IsString()
  @IsOptional()
  vendorCreditNumber?: string;

  @IsString()
  @IsOptional()
  referenceNo?: string;

  @IsString() // ISO8601 date string
  vendorCreditDate: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsOptional()
  open: boolean = false;

  @IsNumber()
  @IsOptional()
  warehouseId?: number;

  @IsNumber()
  @IsOptional()
  branchId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VendorCreditEntryDto)
  entries: VendorCreditEntryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  @IsOptional()
  attachments?: AttachmentDto[];

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsEnum(DiscountType)
  @IsOptional()
  discountType?: DiscountType;

  @IsNumber()
  @IsOptional()
  adjustment?: number;
}

export class CreateVendorCreditDto extends CommandVendorCreditDto {}
export class EditVendorCreditDto extends CommandVendorCreditDto {}
