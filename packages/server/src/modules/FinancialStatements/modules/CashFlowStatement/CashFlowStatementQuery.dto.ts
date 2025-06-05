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

export class CashFlowStatementQueryDto extends FinancialSheetBranchesQueryDto {
  @IsDateString()
  @IsOptional()
  fromDate: Date | string;

  @IsDateString()
  @IsOptional()
  toDate: Date | string;

  @IsString()
  @IsOptional()
  @IsEnum(['day', 'month', 'year'])
  displayColumnsBy: 'day' | 'month' | 'year' = 'year';

  @IsEnum(['total', 'date_periods'])
  @IsOptional()
  displayColumnsType: 'total' | 'date_periods' = 'total';

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  noneZero: boolean;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  noneTransactions: boolean;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  numberFormat: NumberFormatQueryDto;

  @IsString()
  @IsOptional()
  basis: string;
}
