import {
  IsBoolean,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { INumberFormatQuery } from '../../types/Report.types';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { Transform, Type } from 'class-transformer';
import { parseBoolean } from '@/utils/parse-boolean';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TransactionsByContactQueryDto {
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

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Whether to exclude transactions' })
  noneTransactions: boolean;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Whether to exclude zero values' })
  noneZero: boolean;
}
