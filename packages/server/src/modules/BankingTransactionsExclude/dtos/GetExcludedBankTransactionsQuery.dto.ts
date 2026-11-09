import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetExcludedBankTransactionsQueryDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: 'Page size', example: 25 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;

  @ApiPropertyOptional({ description: 'Filter by bank account ID', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  accountId?: number;

  @ApiPropertyOptional({
    description: 'Minimum date (ISO)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  minDate?: string;

  @ApiPropertyOptional({
    description: 'Maximum date (ISO)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  maxDate?: string;

  @ApiPropertyOptional({ description: 'Minimum amount', example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum amount', example: 10000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxAmount?: number;
}
