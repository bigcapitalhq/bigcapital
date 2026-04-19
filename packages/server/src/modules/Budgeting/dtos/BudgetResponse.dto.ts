import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class BudgetEntryResponseDto {
  @ApiProperty({ description: 'Entry ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Account ID', example: 1 })
  accountId: number;

  @ApiProperty({ description: 'Budget amount', example: 5000.0 })
  amount: number;

  @ApiProperty({ description: 'Period date', example: '2026-01-01' })
  periodDate: string;

  @ApiPropertyOptional({ description: 'Account details' })
  account?: any;
}

export class BudgetResponseDto {
  @ApiProperty({ description: 'Budget ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Budget name', example: '2026 Annual Budget' })
  name: string;

  @ApiPropertyOptional({
    description: 'Budget description',
    example: 'Annual operating budget',
  })
  description?: string;

  @ApiProperty({ description: 'Start date', example: '2026-01-01' })
  startDate: string;

  @ApiProperty({ description: 'End date', example: '2026-12-31' })
  endDate: string;

  @ApiProperty({
    description: 'Budget type',
    enum: ['profit_and_loss', 'balance_sheet'],
  })
  budgetType: string;

  @ApiProperty({
    description: 'Period type',
    enum: ['monthly', 'quarterly', 'annual'],
  })
  periodType: string;

  @ApiProperty({
    description: 'Status',
    enum: ['draft', 'active', 'closed'],
  })
  status: string;

  @ApiProperty({ description: 'Is draft', example: true })
  isDraft: boolean;

  @ApiProperty({ description: 'Is active', example: false })
  isActive: boolean;

  @ApiProperty({ description: 'Is closed', example: false })
  isClosed: boolean;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Updated at' })
  updatedAt?: Date;

  @ApiProperty({
    description: 'Budget entries',
    type: [BudgetEntryResponseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetEntryResponseDto)
  entries: BudgetEntryResponseDto[];
}
