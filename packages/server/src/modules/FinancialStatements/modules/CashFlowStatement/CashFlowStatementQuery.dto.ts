import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FinancialSheetBranchesQueryDto } from '../../dtos/FinancialSheetBranchesQuery.dto';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { Transform, Type } from 'class-transformer';
import { parseBoolean } from '@/utils/parse-boolean';
import { ApiProperty } from '@nestjs/swagger';

export class CashFlowStatementQueryDto extends FinancialSheetBranchesQueryDto {
  @ApiProperty({
    description: 'Start date for the cash flow statement period',
    required: false,
    type: Date,
  })
  @IsDateString()
  @IsOptional()
  fromDate: Date | string;

  @ApiProperty({
    description: 'End date for the cash flow statement period',
    required: false,
    type: Date,
  })
  @IsDateString()
  @IsOptional()
  toDate: Date | string;

  @ApiProperty({
    description: 'Display columns by time period',
    required: false,
    enum: ['day', 'month', 'year'],
    default: 'year',
  })
  @IsString()
  @IsOptional()
  @IsEnum(['day', 'month', 'year'])
  displayColumnsBy: 'day' | 'month' | 'year' = 'year';

  @ApiProperty({
    description: 'Type of column display',
    required: false,
    enum: ['total', 'date_periods'],
    default: 'total',
  })
  @IsEnum(['total', 'date_periods'])
  @IsOptional()
  displayColumnsType: 'total' | 'date_periods' = 'total';

  @ApiProperty({
    description: 'Filter out zero values',
    required: false,
    type: Boolean,
    default: false,
  })
  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  noneZero: boolean;

  @ApiProperty({
    description: 'Filter out transactions',
    required: false,
    type: Boolean,
    default: false,
  })
  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  noneTransactions: boolean;

  @ApiProperty({
    description: 'Number format configuration',
    required: true,
    type: NumberFormatQueryDto,
  })
  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: NumberFormatQueryDto;

  @ApiProperty({
    description: 'Basis for the cash flow statement',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  basis: string;
}
