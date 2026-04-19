import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ToNumber } from '@/common/decorators/Validators';
import { DynamicFilterQueryDto } from '@/modules/DynamicListing/dtos/DynamicFilterQuery.dto';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BudgetVsActualQueryDto {
  @ApiProperty({ description: 'Budget ID', example: 1 })
  @IsNotEmpty()
  @ToNumber()
  @IsInt()
  budgetId: number;

  @ApiPropertyOptional({
    description: 'From date (defaults to budget start date)',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsDateString()
  fromDate: string;

  @ApiPropertyOptional({
    description: 'To date (defaults to budget end date)',
    example: '2026-12-31',
  })
  @IsOptional()
  @IsDateString()
  toDate: string;

  @ApiPropertyOptional({
    description: 'Display columns type',
    enum: ['total', 'date_periods'],
    example: 'total',
  })
  @IsOptional()
  @IsEnum(['total', 'date_periods'])
  displayColumnsType: string;

  @ApiPropertyOptional({
    description: 'Display columns by period',
    enum: ['month', 'quarter', 'year'],
    example: 'month',
  })
  @IsOptional()
  @IsEnum(['month', 'quarter', 'year'])
  displayColumnsBy: string;

  @ApiPropertyOptional({ description: 'Number format settings' })
  @IsOptional()
  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  numberFormat: NumberFormatQueryDto;

  @ApiPropertyOptional({
    description: 'Filter by specific account IDs',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @ToNumber()
  @IsInt({ each: true })
  accountsIds: number[];

  @ApiPropertyOptional({
    description: 'Filter by branch IDs',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @ToNumber()
  @IsInt({ each: true })
  branchesIds: number[];

  @ApiPropertyOptional({ description: 'Exclude zero rows' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  noneZero: boolean;

  @ApiPropertyOptional({ description: 'Exclude accounts with no transactions' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  noneTransactions: boolean;
}
