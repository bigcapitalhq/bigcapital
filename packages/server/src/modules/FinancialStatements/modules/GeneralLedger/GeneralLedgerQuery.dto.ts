import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { FinancialSheetBranchesQueryDto } from '../../dtos/FinancialSheetBranchesQuery.dto';
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

export class GeneralLedgerQueryDto extends FinancialSheetBranchesQueryDto {
  @IsDateString()
  @IsOptional()
  fromDate: Date | string;

  @IsDateString()
  @IsOptional()
  toDate: Date | string;

  @IsString()
  @IsOptional()
  basis: string;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  numberFormat: NumberFormatQueryDto;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  noneTransactions: boolean;

  @IsArray()
  @IsOptional()
  accountsIds: number[];
}
