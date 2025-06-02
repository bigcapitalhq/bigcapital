import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUncategorizedTransactionsQueryDto {
  @IsOptional()
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    type: Number,
    example: 1
  })
  page?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    type: Number,
    example: 10
  })
  pageSize?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Minimum date for filtering transactions',
    required: false,
    type: Date,
    example: '2023-01-01'
  })
  minDate?: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Maximum date for filtering transactions',
    required: false,
    type: Date,
    example: '2023-12-31'
  })
  maxDate?: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Minimum amount for filtering transactions',
    required: false,
    type: Number,
    example: 100
  })
  minAmount?: number;

  @IsOptional()
  @ApiProperty({
    description: 'Maximum amount for filtering transactions',
    required: false,
    type: Number,
    example: 1000
  })
  maxAmount?: number;
}
