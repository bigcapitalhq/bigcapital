import { ToNumber } from '@/common/decorators/Validators';
import { ItemEntryDto } from '@/modules/TransactionItemEntry/dto/ItemEntry.dto';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
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
  @IsNotEmpty()
  key: string;
}

export class CommandBillDto {
  @IsOptional()
  @IsString()
  billNumber: string;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsNotEmpty()
  @IsDateString()
  billDate: Date;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsInt()
  @IsNotEmpty()
  vendorId: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @IsPositive()
  exchangeRate?: number;

  @IsOptional()
  @ToNumber()
  @IsInt()
  warehouseId?: number;

  @IsOptional()
  @ToNumber()
  @IsInt()
  branchId?: number;

  @IsOptional()
  @ToNumber()
  @IsInt()
  projectId?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsBoolean()
  @IsOptional()
  open: boolean = false;

  @IsBoolean()
  @IsOptional()
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
  @IsOptional()
  discountType: DiscountType = DiscountType.Amount;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @IsPositive()
  discount?: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  adjustment?: number;
}

export class CreateBillDto extends CommandBillDto {}
export class EditBillDto extends CommandBillDto {}
