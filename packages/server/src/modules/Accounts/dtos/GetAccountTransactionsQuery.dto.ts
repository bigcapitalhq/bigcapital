import { IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ToNumber } from '@/common/decorators/Validators';

export class GetAccountTransactionsQueryDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'ID of the account to fetch transactions for',
  })
  @IsOptional()
  @IsInt()
  @ToNumber()
  accountId?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Maximum number of transactions to return',
  })
  @IsOptional()
  @IsInt()
  @ToNumber()
  limit?: number;
}
