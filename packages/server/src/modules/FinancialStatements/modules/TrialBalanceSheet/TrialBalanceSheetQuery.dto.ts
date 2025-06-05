import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { FinancialSheetBranchesQueryDto } from '../../dtos/FinancialSheetBranchesQuery.dto';
import { INumberFormatQuery } from '../../types/Report.types';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { parseBoolean } from '@/utils/parse-boolean';

export class TrialBalanceSheetQueryDto extends FinancialSheetBranchesQueryDto {
  @IsDateString()
  @IsOptional()
  fromDate: Date;

  @IsDateString()
  @IsOptional()
  toDate: Date;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: INumberFormatQuery;

  @IsString()
  @IsOptional()
  basis: 'cash' | 'accrual';

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneZero: boolean;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneTransactions: boolean;

  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  onlyActive: boolean;

  @IsArray()
  @IsOptional()
  accountIds: number[];
}
