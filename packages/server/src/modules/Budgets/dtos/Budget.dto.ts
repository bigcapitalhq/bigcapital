import { ToNumber } from '@/common/decorators/Validators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class BudgetEntryDto {
  @ApiProperty({ description: 'Account ID' })
  @IsNotEmpty()
  @IsInt()
  accountId: number;

  @ApiProperty({
    description: 'Budget entry month date (the first day of the month)',
  })
  @IsDateString()
  date: Date | string;

  @ApiProperty({ description: 'Budgeted amount' })
  @ToNumber()
  @IsNumber()
  @Min(0)
  amount: number;
}

export class CommandBudgetDto {
  @ApiProperty({ description: 'Budget name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Budget description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Budget start date' })
  @IsDateString()
  fromDate: Date | string;

  @ApiProperty({ description: 'Budget end date' })
  @IsDateString()
  toDate: Date | string;

  @ApiProperty({ description: 'Budget entries', type: [BudgetEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetEntryDto)
  entries: BudgetEntryDto[];
}

export class CreateBudgetDto extends CommandBudgetDto {}
export class EditBudgetDto extends CommandBudgetDto {}
