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
  @ApiPropertyOptional({
    description: 'Start date for the transactions by contact query',
    example: '2024-01-01',
  })
  fromDate: Date | string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'End date for the transactions by contact query',
    example: '2024-12-31',
  })
  toDate: Date | string;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Number format configuration for the report',
    type: NumberFormatQueryDto,
    example: {
      precision: 2,
      divideOn1000: false,
      showZero: true,
      formatMoney: 'total',
      negativeFormat: 'parentheses',
    },
  })
  numberFormat: INumberFormatQuery;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Whether to exclude transactions',
    example: false,
    default: false,
  })
  noneTransactions: boolean;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Whether to exclude zero values',
    example: false,
    default: false,
  })
  noneZero: boolean;
}
