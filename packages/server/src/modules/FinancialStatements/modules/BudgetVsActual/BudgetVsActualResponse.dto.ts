import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class BudgetVsActualCellDto {
  @ApiProperty({ description: 'Budgeted amount', example: 1000 })
  budget: number;

  @ApiProperty({
    description: 'Formatted budgeted amount',
    example: '$1,000.00',
  })
  formattedBudget: string;

  @ApiProperty({ description: 'Actual amount', example: 800 })
  actual: number;

  @ApiProperty({ description: 'Formatted actual amount', example: '$800.00' })
  formattedActual: string;

  @ApiProperty({
    description: 'Variance amount (actual - budget)',
    example: 9000,
  })
  variance: number;

  @ApiProperty({
    description: 'Formatted variance amount',
    example: '$9,000.00',
  })
  formattedVariance: string;

  @ApiProperty({
    description: 'Variance percentage of the budget',
    example: 0.06,
  })
  percentage: number;

  @ApiProperty({
    description: 'Formatted variance percentage',
    example: '%6.00',
  })
  formattedPercentage: string;
}

export class BudgetVsActualPeriodDto {
  @ApiProperty({ description: 'Period key', example: '2024-01' })
  key: string;

  @ApiProperty({ description: 'Period label', example: 'Jan 2024' })
  label: string;

  @ApiProperty({ description: 'Period from date', example: '2024-01-01' })
  fromDate: Date;

  @ApiProperty({ description: 'Period to date', example: '2024-01-31' })
  toDate: Date;
}

export class BudgetVsActualAccountRowDto {
  @ApiProperty({ description: 'Account ID', example: 1 })
  accountId: number;

  @ApiProperty({ description: 'Account code', example: '4000' })
  accountCode: string;

  @ApiProperty({ description: 'Account name', example: 'Sales' })
  accountName: string;

  @ApiProperty({ description: 'Account type', example: 'income' })
  accountType: string;

  @ApiProperty({
    description: 'Period cells',
    type: [BudgetVsActualCellDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetVsActualCellDto)
  cells: BudgetVsActualCellDto[];

  @ApiProperty({ description: 'Total cell', type: BudgetVsActualCellDto })
  total: BudgetVsActualCellDto;
}

export class BudgetVsActualReportDataDto {
  @ApiProperty({
    description: 'The report date periods',
    type: [BudgetVsActualPeriodDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetVsActualPeriodDto)
  periods: BudgetVsActualPeriodDto[];

  @ApiProperty({
    description: 'The report accounts',
    type: [BudgetVsActualAccountRowDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetVsActualAccountRowDto)
  accounts: BudgetVsActualAccountRowDto[];

  @ApiPropertyOptional({ description: 'The report totals' })
  totals: any;
}

export class BudgetVsActualResponseDto {
  @ApiProperty({ description: 'The report data' })
  data: BudgetVsActualReportDataDto;

  @ApiPropertyOptional({ description: 'The report query' })
  query: any;

  @ApiPropertyOptional({ description: 'The report meta' })
  meta: any;
}

export class BudgetVsActualTableResponseDto {
  @ApiProperty({ description: 'The report table columns and rows' })
  table: any;

  @ApiPropertyOptional({ description: 'The report query' })
  query: any;

  @ApiPropertyOptional({ description: 'The report meta' })
  meta: any;
}
