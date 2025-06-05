import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { INumberFormatQuery } from '../../types/Report.types';
import { Transform, Type } from 'class-transformer';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { parseBoolean } from '@/utils/parse-boolean';

export class SalesByItemsQueryDto {
  @IsDateString()
  @IsOptional()
  fromDate: Date | string;

  @IsDateString()
  @IsOptional()
  toDate: Date | string;

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
  onlyActive: boolean;

  @IsArray()
  @IsOptional()
  itemsIds: number[];
}
