import {
  IsBoolean,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { INumberFormatQuery } from '../../types/Report.types';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { Transform, Type } from 'class-transformer';
import { parseBoolean } from '@/utils/parse-boolean';

export class PurchasesByItemsQueryDto {
  @IsDateString()
  @IsOptional()
  fromDate: Date | string;

  @IsDateString()
  @IsOptional()
  toDate: Date | string;

  @IsArray()
  @IsOptional()
  itemsIds: number[];

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: INumberFormatQuery;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  noneTransactions: boolean;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  onlyActive: boolean;
}
