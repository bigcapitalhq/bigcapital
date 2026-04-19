import { ToNumber } from '@/common/decorators/Validators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class BudgetEntryDto {
  @ApiProperty({ description: 'Account ID', example: 1 })
  @IsNotEmpty()
  @ToNumber()
  @IsInt()
  accountId: number;

  @ApiProperty({ description: 'Budget amount for the period', example: 5000.0 })
  @ToNumber()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Period date (first day of the period)',
    example: '2026-01-01',
  })
  @IsString()
  periodDate: string;
}
