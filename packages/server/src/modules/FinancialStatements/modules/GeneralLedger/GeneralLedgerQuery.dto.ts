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
import { ApiProperty } from '@nestjs/swagger';

export class GeneralLedgerQueryDto extends FinancialSheetBranchesQueryDto {
  @ApiProperty({
    description: 'Start date for the general ledger report',
    example: '2024-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fromDate: Date | string;

  @ApiProperty({
    description: 'End date for the general ledger report',
    example: '2024-12-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  toDate: Date | string;

  @ApiProperty({
    description: 'Accounting basis for the report (e.g., cash, accrual)',
    example: 'accrual',
    required: false,
  })
  @IsString()
  @IsOptional()
  basis: string;

  @ApiProperty({
    description: 'Number format configuration for the report',
    type: NumberFormatQueryDto,
  })
  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  numberFormat: NumberFormatQueryDto;

  @ApiProperty({
    description: 'Whether to exclude transactions from the report',
    example: false,
    required: false,
    default: false,
  })
  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  noneTransactions: boolean;

  @ApiProperty({
    description: 'Array of account IDs to filter the report',
    example: [1, 2, 3],
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  accountsIds: number[];
}
