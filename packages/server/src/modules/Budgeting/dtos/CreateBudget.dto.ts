import { IsOptional, ToNumber } from '@/common/decorators/Validators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional as IsOpt,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { BudgetEntryDto } from './BudgetEntry.dto';

export class CommandBudgetDto {
  @ApiProperty({ description: 'Budget name', example: '2026 Annual Budget' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Budget description',
    example: 'Annual operating budget for 2026',
  })
  @IsOpt()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Budget start date', example: '2026-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Budget end date', example: '2026-12-31' })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'Budget type',
    enum: ['profit_and_loss', 'balance_sheet'],
    example: 'profit_and_loss',
  })
  @IsEnum(['profit_and_loss', 'balance_sheet'])
  budgetType: string;

  @ApiProperty({
    description: 'Period type',
    enum: ['monthly', 'quarterly', 'annual'],
    example: 'monthly',
  })
  @IsEnum(['monthly', 'quarterly', 'annual'])
  periodType: string;

  @ApiProperty({ description: 'Budget entries', type: [BudgetEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetEntryDto)
  entries: BudgetEntryDto[];
}

export class CreateBudgetDto extends CommandBudgetDto {}

export class EditBudgetDto extends CommandBudgetDto {}
