import { ToNumber } from '@/common/decorators/Validators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBankReconciliationDto {
  @ApiProperty({
    description: 'Bank account ID',
    example: 1000,
    type: Number,
  })
  @ToNumber()
  @IsInt()
  @IsNotEmpty()
  accountId: number;

  @ApiProperty({
    description: 'Reconciliation period start date',
    example: '2026-11-01',
    type: String,
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'Reconciliation period end date',
    example: '2026-11-30',
    type: String,
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: 'Statement ending balance',
    example: 12500.75,
    type: Number,
  })
  @ToNumber()
  @IsNumber()
  @IsNotEmpty()
  endingBalance: number;

  @ApiPropertyOptional({
    description: 'Optional reconciliation notes',
    example: 'November statement',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
