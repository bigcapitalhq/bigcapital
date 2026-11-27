import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class BudgetEntryResponseDto {
  @ApiProperty({ description: 'Budget entry ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Budget ID', example: 1 })
  budgetId: number;

  @ApiProperty({ description: 'Account ID', example: 1 })
  accountId: number;

  @ApiProperty({ description: 'Account name', example: 'Sales' })
  accountName: string;

  @ApiProperty({ description: 'Account code', example: '4000' })
  accountCode: string;

  @ApiProperty({
    description: 'Budget entry month date',
    example: '2024-01-01',
  })
  date: Date;

  @ApiProperty({
    description: 'Formatted budget entry date',
    example: 'Jan 2024',
  })
  formattedDate: string;

  @ApiProperty({ description: 'Budgeted amount', example: 1000.0 })
  amount: number;

  @ApiProperty({
    description: 'Formatted budgeted amount',
    example: '$1,000.00',
  })
  formattedAmount: string;
}

export class BudgetPrefillEntryResponseDto {
  @ApiProperty({ description: 'Account ID', example: 1 })
  accountId: number;

  @ApiProperty({
    description: 'Target budget month date (the first day of the month)',
    example: '2024-01-01',
  })
  date: string;

  @ApiProperty({ description: 'Actual amount', example: 1000.0 })
  amount: number;
}

export class BudgetPrefillResponseDto {
  @ApiProperty({
    description: 'The year the actual amounts were sourced from',
    example: 2023,
  })
  sourceYear: number;

  @ApiProperty({
    description: 'Budget start date',
    example: '2024-01-01',
  })
  fromDate: string;

  @ApiProperty({
    description: 'Budget end date',
    example: '2024-12-31',
  })
  toDate: string;

  @ApiProperty({
    description: 'The budget entries prefilled from the actual amounts',
    type: [BudgetPrefillEntryResponseDto],
  })
  entries: BudgetPrefillEntryResponseDto[];
}

export class BudgetResponseDto {
  @ApiProperty({ description: 'Budget ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Budget name', example: 'Annual budget 2024' })
  name: string;

  @ApiPropertyOptional({
    description: 'Budget description',
    example: 'The annual budget of the organization',
  })
  description?: string;

  @ApiProperty({ description: 'Budget start date', example: '2024-01-01' })
  fromDate: Date;

  @ApiProperty({ description: 'Budget end date', example: '2024-12-31' })
  toDate: Date;

  @ApiProperty({
    description: 'Formatted budget start date',
    example: 'Jan 1, 2024',
  })
  formattedFromDate: string;

  @ApiProperty({
    description: 'Formatted budget end date',
    example: 'Dec 31, 2024',
  })
  formattedToDate: string;

  @ApiProperty({
    description: 'Formatted created date',
    example: 'Mar 20, 2024',
  })
  formattedCreatedAt: string;

  @ApiProperty({
    description: 'Budget entries',
    type: [BudgetEntryResponseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetEntryResponseDto)
  entries: BudgetEntryResponseDto[];
}
