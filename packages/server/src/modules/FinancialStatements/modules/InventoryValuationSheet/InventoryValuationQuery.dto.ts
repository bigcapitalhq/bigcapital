import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { INumberFormatQuery } from '../../types/Report.types';
import { Transform, Type } from 'class-transformer';
import { parseBoolean } from '@/utils/parse-boolean';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';

export class InventoryValuationQueryDto {
  @IsDateString()
  @IsOptional()
  asDate: Date | string;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: INumberFormatQuery;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneTransactions: boolean;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneZero: boolean;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  onlyActive: boolean;

  @IsArray()
  @IsOptional()
  itemsIds: number[];

  @IsArray()
  @IsOptional()
  warehousesIds?: number[];

  @IsArray()
  @IsOptional()
  branchesIds?: number[];
}
