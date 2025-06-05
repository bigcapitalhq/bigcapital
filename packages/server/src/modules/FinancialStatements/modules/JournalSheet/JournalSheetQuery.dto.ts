import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FinancialSheetBranchesQueryDto } from '../../dtos/FinancialSheetBranchesQuery.dto';

class JournalSheetNumberFormatQueryDto {
  @IsBoolean()
  @IsOptional()
  noCents: boolean;

  @IsBoolean()
  @IsOptional()
  divideOn1000: boolean;
}

export class JournalSheetQueryDto extends FinancialSheetBranchesQueryDto {
  @IsDateString()
  @IsOptional()
  fromDate: Date | string;

  @IsDateString()
  @IsOptional()
  toDate: Date | string;

  @ValidateNested()
  @Type(() => JournalSheetNumberFormatQueryDto)
  numberFormat: JournalSheetNumberFormatQueryDto;

  @IsString()
  @IsOptional()
  transactionType: string;

  @IsString()
  @IsOptional()
  transactionId: string;

  @IsArray()
  @IsOptional()
  accountsIds: number | number[];

  @IsNumber()
  @IsOptional()
  fromRange: number;

  @IsNumber()
  @IsOptional()
  toRange: number;
}
