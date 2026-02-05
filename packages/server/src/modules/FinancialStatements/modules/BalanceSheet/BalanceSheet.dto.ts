import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { parseBoolean } from '@/utils/parse-boolean';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FinancialSheetBranchesQueryDto } from '../../dtos/FinancialSheetBranchesQuery.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BalanceSheetQueryDto extends FinancialSheetBranchesQueryDto {
  @ApiProperty({
    enum: ['total', 'date_periods'],
    default: 'total',
    description: 'Type of columns to display in the balance sheet',
  })
  @IsString()
  @IsOptional()
  @IsEnum(['total', 'date_periods'])
  displayColumnsType: 'total' | 'date_periods' = 'total';

  @ApiProperty({
    enum: ['day', 'month', 'year', 'quarter'],
    default: 'year',
    description: 'Time period for column display',
  })
  @IsString()
  @IsOptional()
  @IsEnum(['day', 'month', 'year', 'quarter'])
  displayColumnsBy: 'day' | 'month' | 'year' | 'quarter' = 'year';

  @ApiProperty({
    description: 'Start date for the balance sheet period',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fromDate: string;

  @ApiProperty({
    description: 'End date for the balance sheet period',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  toDate: string;

  @ApiProperty({
    type: NumberFormatQueryDto,
    description: 'Number formatting options',
    required: false,
  })
  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: NumberFormatQueryDto;

  @ApiProperty({
    description: 'Whether to include accounts with no transactions',
    default: false,
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneTransactions: boolean;

  @ApiProperty({
    description: 'Whether to exclude zero balance accounts',
    default: false,
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneZero: boolean;

  @ApiProperty({
    enum: ['cash', 'accrual'],
    description: 'Accounting basis for the balance sheet',
    required: false,
  })
  @IsString()
  @IsOptional()
  basis: 'cash' | 'accrual';

  @ApiProperty({
    description: 'Array of account IDs to include in the balance sheet',
    type: [Number],
  })
  accountIds: number[];

  @ApiProperty({
    description: 'Whether to show percentage of column total',
    default: false,
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  percentageOfColumn: boolean;

  @ApiProperty({
    description: 'Whether to show percentage of row total',
    default: false,
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  percentageOfRow: boolean;

  @ApiProperty({
    description: 'Whether to include previous period data',
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => parseBoolean(value, false))
  previousPeriod: boolean;

  @ApiProperty({
    description: 'Whether to show amount change from previous period',
    default: false,
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  previousPeriodAmountChange: boolean;

  @ApiProperty({
    description: 'Whether to show percentage change from previous period',
    default: false,
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  previousPeriodPercentageChange: boolean;

  @ApiProperty({
    description: 'Whether to include previous year data',
    default: false,
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  previousYear: boolean;

  @ApiProperty({
    description: 'Whether to show amount change from previous year',
    default: false,
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  previousYearAmountChange: boolean;

  @ApiProperty({
    description: 'Whether to show percentage change from previous year',
    default: false,
    required: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  previousYearPercentageChange: boolean;
}
