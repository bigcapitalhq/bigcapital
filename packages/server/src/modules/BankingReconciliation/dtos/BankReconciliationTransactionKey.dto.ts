import { ToNumber } from '@/common/decorators/Validators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BankReconciliationTransactionKeyDto {
  @ApiProperty({
    description: 'Ledger reference type',
    example: 'CashflowTransaction',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  referenceType: string;

  @ApiProperty({
    description: 'Ledger reference id',
    example: 1001,
    type: Number,
  })
  @ToNumber()
  @IsInt()
  referenceId: number;

  @ApiPropertyOptional({
    description: 'Ledger line index within the reference',
    example: 1,
    type: Number,
    default: 0,
  })
  @IsOptional()
  @ToNumber()
  @IsInt()
  index?: number;
}
