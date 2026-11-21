import { ToNumber } from '@/common/decorators/Validators';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BankReconciliationTransactionKeyDto } from './BankReconciliationTransactionKey.dto';

export class FinishBankReconciliationDto {
  @ApiPropertyOptional({
    description: 'Final statement ending balance',
    example: 12500.75,
    type: Number,
  })
  @IsOptional()
  @ToNumber()
  @IsNumber()
  endingBalance?: number;

  @ApiPropertyOptional({
    description: 'Final checked/cleared transaction keys',
    type: [BankReconciliationTransactionKeyDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BankReconciliationTransactionKeyDto)
  transactions?: BankReconciliationTransactionKeyDto[];

  @ApiPropertyOptional({
    description: 'Optional reconciliation notes',
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
