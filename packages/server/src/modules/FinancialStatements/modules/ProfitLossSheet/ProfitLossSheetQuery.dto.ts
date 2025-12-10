import { FinancialSheetBranchesQueryDto } from '../../dtos/FinancialSheetBranchesQuery.dto';
import { INumberFormatQuery } from '../../types/Report.types';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ToNumber } from '@/common/decorators/Validators';
import { parseBoolean } from '@/utils/parse-boolean';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';

export class ProfitLossSheetQueryDto extends FinancialSheetBranchesQueryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'The basis for the profit and loss sheet' })
  basis: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: 'Start date for the profit and loss sheet' })
  fromDate: moment.MomentInput;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ description: 'End date for the profit and loss sheet' })
  toDate: moment.MomentInput;

  @ApiProperty({ description: 'Number format configuration' })
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
  @IsEnum(['day', 'month', 'year'])
  @IsOptional()
  @ApiProperty({ description: 'How to display columns' })
  displayColumnsBy: 'day' | 'month' | 'year' = 'year';

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
}
