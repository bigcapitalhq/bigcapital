import {
  IsBoolean,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { INumberFormatQuery } from '../../types/Report.types';
import { Transform, Type } from 'class-transformer';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { parseBoolean } from '@/utils/parse-boolean';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ContactBalanceSummaryQueryDto {
  @ApiPropertyOptional({
    description: 'The date as of which the balance summary is calculated',
    example: '2024-01-01',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  asDate: Date;

  @ApiPropertyOptional({
    description: 'Number formatting options for the summary',
    type: NumberFormatQueryDto,
  })
  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: INumberFormatQuery;

  @ApiPropertyOptional({
    description: 'Whether to show the percentage column in the summary',
    example: false,
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  percentageColumn: boolean;

  @ApiPropertyOptional({
    description: 'Whether to exclude contacts with no transactions',
    example: false,
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneTransactions: boolean;

  @ApiPropertyOptional({
    description: 'Whether to exclude contacts with zero balance',
    example: false,
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneZero: boolean;
}
