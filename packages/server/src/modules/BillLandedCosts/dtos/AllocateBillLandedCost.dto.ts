import {
  IsInt,
  IsIn,
  IsOptional,
  IsArray,
  ValidateNested,
  IsString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ToNumber } from '@/common/decorators/Validators';
import { LandedCostTransactionType } from '../types/BillLandedCosts.types';

export class AllocateBillLandedCostItemDto {
  @IsInt()
  @ToNumber()
  entryId: number;

  @IsNumber()
  @ToNumber()
  cost: number;
}

export class AllocateBillLandedCostDto {
  @IsInt()
  @ToNumber()
  transactionId: number;

  @IsIn(['Expense', 'Bill'])
  transactionType: LandedCostTransactionType;

  @IsInt()
  transactionEntryId: number;

  @IsIn(['value', 'quantity'])
  allocationMethod: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllocateBillLandedCostItemDto)
  items: AllocateBillLandedCostItemDto[];
}