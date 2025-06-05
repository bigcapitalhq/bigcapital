import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsDateString, IsBoolean, ValidateNested, IsArray } from 'class-validator';
import { FinancialSheetBranchesQueryDto } from '../../dtos/FinancialSheetBranchesQuery.dto';
import { parseBoolean } from '@/utils/parse-boolean';
import { ToNumber } from '@/common/decorators/Validators';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';

export class APAgingSummaryQueryDto extends FinancialSheetBranchesQueryDto {
  @IsDateString()
  @IsOptional()
  asDate: Date | string;

  @ToNumber()
  @IsNumber()
  @IsOptional()
  agingDaysBefore: number;

  @ToNumber()
  @IsNumber()
  @IsOptional()
  agingPeriods: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  numberFormat: NumberFormatQueryDto;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  noneZero: boolean;

  @IsArray()
  @IsOptional()
  vendorsIds: number[];
}
