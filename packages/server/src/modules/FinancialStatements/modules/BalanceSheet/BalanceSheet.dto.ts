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

export class BalanceSheetQueryDto extends FinancialSheetBranchesQueryDto {
  @IsString()
  @IsOptional()
  @IsEnum(['total', 'date_periods'])
  displayColumnsType: 'total' | 'date_periods' = 'total';

  @IsString()
  @IsOptional()
  @IsEnum(['day', 'month', 'year'])
  displayColumnsBy: 'day' | 'month' | 'year' = 'year';

  @IsDateString()
  @IsOptional()
  fromDate: string;

  @IsDateString()
  @IsOptional()
  toDate: string;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: NumberFormatQueryDto;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneTransactions: boolean;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneZero: boolean;

  @IsString()
  @IsOptional()
  basis: 'cash' | 'accrual';
  accountIds: number[];

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  percentageOfColumn: boolean;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  percentageOfRow: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => parseBoolean(value, false))
  previousPeriod: boolean;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  previousPeriodAmountChange: boolean;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  previousPeriodPercentageChange: boolean;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  previousYear: boolean;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  previousYearAmountChange: boolean;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  previousYearPercentageChange: boolean;
}
