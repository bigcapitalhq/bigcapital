import { FinancialSheetBranchesQueryDto } from '../../dtos/FinancialSheetBranchesQuery.dto';

import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ToNumber } from '@/common/decorators/Validators';
import { parseBoolean } from '@/utils/parse-boolean';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import {
  PROFIT_LOSS_COLUMN_KEYS,
  ProfitLossColumnKey,
} from '../../common/constants/tableColumnKeys';
import { ProfitLossSheetSortOrder } from './ProfitLossSheet.types';

export class ProfitLossSheetQueryDto extends FinancialSheetBranchesQueryDto {
  @IsEnum(AccountingBasis)
  @IsOptional()
  @ApiProperty({ description: 'The basis for the profit and loss sheet' })
  basis: AccountingBasis;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: 'Start date for the profit and loss sheet' })
  fromDate: moment.MomentInput;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: 'End date for the profit and loss sheet' })
  toDate: moment.MomentInput;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: NumberFormatQueryDto;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  @ApiPropertyOptional({ description: 'Whether to exclude zero values' })
  noneZero: boolean;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  @ApiPropertyOptional({ description: 'Whether to exclude transactions' })
  noneTransactions: boolean;

  @IsArray()
  @IsOptional()
  @ToNumber()
  @ApiPropertyOptional({ description: 'Array of account IDs to include' })
  accountsIds: number[];

  @IsEnum(['total', 'date_periods'])
  @IsOptional()
  @ApiProperty({
    description: 'Type of columns to display',
    enum: ['total', 'date_periods'],
  })
  displayColumnsType: 'total' | 'date_periods';

  @IsString()
  @IsEnum(['day', 'week', 'month', 'quarter', 'year'])
  @IsOptional()
  @ApiProperty({
    description: 'How to display columns',
    enum: ['day', 'week', 'month', 'quarter', 'year'],
  })
  displayColumnsBy: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'year';

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Whether to show percentage column' })
  percentageColumn: boolean;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Whether to show percentage row' })
  percentageRow: boolean;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Whether to show income percentage' })
  percentageIncome: boolean;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Whether to show expense percentage' })
  percentageExpense: boolean;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Whether to include previous period' })
  previousPeriod: boolean;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Whether to show previous period amount change',
  })
  previousPeriodAmountChange: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Whether to show previous period percentage change',
  })
  @Transform(({ value }) => parseBoolean(value, false))
  previousPeriodPercentageChange: boolean;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Whether to include previous year' })
  previousYear: boolean;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Whether to show previous year amount change',
  })
  previousYearAmountChange: boolean;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Whether to show previous year percentage change',
  })
  previousYearPercentageChange: boolean;

  @ApiProperty({
    description: 'Column to sort the accounts by',
    required: false,
    enum: Object.values(PROFIT_LOSS_COLUMN_KEYS),
  })
  @IsIn(Object.values(PROFIT_LOSS_COLUMN_KEYS))
  @IsOptional()
  columnSortBy?: ProfitLossColumnKey;

  @ApiProperty({
    description: 'Sort order for the accounts',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder?: ProfitLossSheetSortOrder;
}
