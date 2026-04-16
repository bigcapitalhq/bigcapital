import { ToNumber } from '@/common/decorators/Validators';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class EditCategorizeBankTransactionDto {
  @ApiPropertyOptional({
    description: 'ID of the credit account (category) for this transaction',
    type: Number,
    example: 1001,
  })
  @IsInt()
  @ToNumber()
  @IsOptional()
  creditAccountId?: number;

  @ApiPropertyOptional({
    description: 'Transaction type (e.g. OtherIncome, OtherExpense, TransferToAccount)',
    type: String,
    example: 'OtherExpense',
  })
  @IsString()
  @IsOptional()
  transactionType?: string;

  @ApiPropertyOptional({
    description: 'Description of the transaction',
    type: String,
    example: 'Office supplies purchase',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
