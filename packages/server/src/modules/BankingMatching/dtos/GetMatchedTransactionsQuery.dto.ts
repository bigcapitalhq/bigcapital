import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMatchedTransactionsQueryDto {
  @ApiPropertyOptional({
    description: 'Filter from date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({ description: 'Filter to date', example: '2024-12-31' })
  @IsOptional()
  @IsString()
  toDate?: string;

  @ApiPropertyOptional({ description: 'Minimum amount', example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum amount', example: 10000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(Number.MAX_SAFE_INTEGER)
  maxAmount?: number;

  @ApiPropertyOptional({
    description: 'Transaction type filter',
    example: 'SaleInvoice',
  })
  @IsOptional()
  @IsString()
  transactionType?: string;
}
