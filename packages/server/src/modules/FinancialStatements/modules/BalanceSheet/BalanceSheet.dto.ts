import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { parseBoolean } from '@/utils/parse-boolean';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FinancialSheetBranchesQueryDto } from '../../dtos/FinancialSheetBranchesQuery.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import {
  BALANCE_SHEET_COLUMN_KEYS,
  BalanceSheetColumnKey,
} from '../../common/constants/tableColumnKeys';
import { BalanceSheetSortOrder } from './BalanceSheet.types';

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
    enum: ['day', 'week', 'month', 'quarter', 'year'],
    default: 'year',
    description: 'Time period for column display',
  })
  @IsString()
  @IsOptional()
  @IsEnum(['day', 'week', 'month', 'quarter', 'year'])
  displayColumnsBy: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'year';

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
    enum: AccountingBasis,
    description: 'Accounting basis for the balance sheet',
    required: false,
  })
  @IsEnum(AccountingBasis)
  @IsOptional()
  basis: AccountingBasis;

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

  @ApiProperty({
    description: 'Column to sort the accounts by',
    required: false,
    enum: Object.values(BALANCE_SHEET_COLUMN_KEYS),
  })
  @IsIn(Object.values(BALANCE_SHEET_COLUMN_KEYS))
  @IsOptional()
  columnSortBy?: BalanceSheetColumnKey;

  @ApiProperty({
    description: 'Sort order for the accounts',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder?: BalanceSheetSortOrder;
}
