import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { FinancialSheetBranchesQueryDto } from '../../dtos/FinancialSheetBranchesQuery.dto';
import { parseBoolean } from '@/utils/parse-boolean';
import { ToNumber } from '@/common/decorators/Validators';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class APAgingSummaryQueryDto extends FinancialSheetBranchesQueryDto {
  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The date as of which the AP aging summary is calculated',
    example: '2024-06-01',
  })
  asDate: Date | string;

  @ToNumber()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Number of days before the aging period starts',
    example: 30,
  })
  agingDaysBefore: number;

  @ToNumber()
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Number of aging periods to calculate',
    example: 4,
  })
  agingPeriods: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @ApiPropertyOptional({
    description: 'Number format configuration',
    example: {
      precision: 2,
      divideOn1000: false,
      showZero: true,
      formatMoney: 'total',
      negativeFormat: 'parentheses',
    },
  })
  numberFormat: NumberFormatQueryDto;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Whether to exclude zero values',
    example: false,
  })
  noneZero: boolean;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Array of vendor IDs to include',
    example: [1, 2, 3],
  })
  vendorsIds: number[];
}
