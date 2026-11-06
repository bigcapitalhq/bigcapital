import { ToNumber } from '@/common/decorators/Validators';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BankReconciliationTransactionKeyDto } from './BankReconciliationTransactionKey.dto';

export class UpdateBankReconciliationDto {
  @ApiPropertyOptional({
    description: 'Reconciliation period start date',
    example: '2026-11-01',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Reconciliation period end date',
    example: '2026-11-30',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Statement ending balance',
    example: 12500.75,
    type: Number,
  })
  @IsOptional()
  @ToNumber()
  @IsNumber()
  endingBalance?: number;

  @ApiPropertyOptional({
    description: 'Optional reconciliation notes',
    example: 'November statement',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Checked/cleared transaction keys',
    type: [BankReconciliationTransactionKeyDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BankReconciliationTransactionKeyDto)
  transactions?: BankReconciliationTransactionKeyDto[];
}
