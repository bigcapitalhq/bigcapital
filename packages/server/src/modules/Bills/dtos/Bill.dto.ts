import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

enum DiscountType {
  Percentage = 'percentage',
  Amount = 'amount',
}

export class BillEntryDto extends ItemEntryDto {
  @IsOptional()
  @IsBoolean()
  landedCost?: boolean;
}

class AttachmentDto {
  @IsString()
  key: string;
}

export class CommandBillDto {
  @IsString()
  billNumber: string;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsDate()
  @Type(() => Date)
  billDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @IsInt()
  vendorId: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  exchangeRate?: number;

  @IsOptional()
  @IsInt()
  warehouseId?: number;

  @IsOptional()
  @IsInt()
  branchId?: number;

  @IsOptional()
  @IsInt()
  projectId?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsBoolean()
  open: boolean = false;

  @IsBoolean()
  isInclusiveTax: boolean = false;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BillEntryDto)
  @ArrayMinSize(1)
  entries: BillEntryDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @IsEnum(DiscountType)
  discountType: DiscountType = DiscountType.Amount;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  adjustment?: number;
}

export class CreateBillDto extends CommandBillDto {}
export class EditBillDto extends CommandBillDto {}
