import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ToNumber } from '@/common/decorators/Validators';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { FinancialSheetBranchesQueryDto } from '../../dtos/FinancialSheetBranchesQuery.dto';
import { BudgetVsActualDisplayColumnsBy } from './BudgetVsActual.types';

export class BudgetVsActualQueryDto extends FinancialSheetBranchesQueryDto {
  @ApiProperty({ description: 'The budget id' })
  @IsNotEmpty()
  @IsInt()
  @ToNumber()
  budgetId: number;

  @ApiPropertyOptional({
    description: 'Start date of the report (defaults to the budget start date)',
  })
  @IsDateString()
  @IsOptional()
  fromDate: string;

  @ApiPropertyOptional({
    description: 'End date of the report (defaults to the budget end date)',
  })
  @IsDateString()
  @IsOptional()
  toDate: string;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: NumberFormatQueryDto;

  @IsEnum(['month', 'quarter', 'year'])
  @IsOptional()
  @ApiPropertyOptional({
    description: 'How to display the report columns',
    enum: ['month', 'quarter', 'year'],
  })
  displayColumnsBy: BudgetVsActualDisplayColumnsBy = 'month';

  @IsArray()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ description: 'Array of account IDs to include' })
  accountsIds: number[];
}
