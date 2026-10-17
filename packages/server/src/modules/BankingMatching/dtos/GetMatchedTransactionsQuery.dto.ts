import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';
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

  @ApiPropertyOptional({
    description:
      'Days either side of the uncategorized transaction date to search for ' +
      'candidates. Ignored when an explicit fromDate/toDate is given. ' +
      'Zero searches the whole ledger. Defaults to 90.',
    example: 90,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  dateWindowDays?: number;
}
