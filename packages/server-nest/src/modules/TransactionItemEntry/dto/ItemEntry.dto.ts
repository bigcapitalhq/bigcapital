import { DiscountType } from '@/common/types/Discount';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ItemEntryDto {
  @IsInt()
  index: number;

  @IsInt()
  @IsNotEmpty()
  itemId: number;

  @IsNumber()
  @IsNotEmpty()
  rate: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType = DiscountType.Percentage;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  taxCode?: string;

  @IsOptional()
  @IsInt()
  taxRateId?: number;

  @IsOptional()
  @IsInt()
  warehouseId?: number;

  @IsOptional()
  @IsInt()
  projectId?: number;

  @IsOptional()
  @IsInt()
  projectRefId?: number;

  @IsOptional()
  @IsString()
  @IsIn(['TASK', 'BILL', 'EXPENSE'])
  projectRefType?: string;

  @IsOptional()
  @IsNumber()
  projectRefInvoicedAmount?: number;

  @IsOptional()
  @IsInt()
  sellAccountId?: number;

  @IsOptional()
  @IsInt()
  costAccountId?: number;
}
