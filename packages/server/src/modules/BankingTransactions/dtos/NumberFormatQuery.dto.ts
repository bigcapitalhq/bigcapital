import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { parseBoolean } from '@/utils/parse-boolean';

export class NumberFormatQueryDto {
  @ApiPropertyOptional({
    description: 'Number of decimal places to display',
    example: 2,
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly precision: number;

  @ApiPropertyOptional({
    description: 'Whether to divide the number by 1000',
    example: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  readonly divideOn1000: boolean;

  @ApiPropertyOptional({
    description: 'Whether to show zero values',
    example: true,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  readonly showZero: boolean;

  @ApiPropertyOptional({
    description: 'How to format money values',
    example: 'total',
    enum: ['total', 'always', 'none'],
  })
  @IsEnum(['total', 'always', 'none'])
  @IsOptional()
  readonly formatMoney: 'total' | 'always' | 'none';

  @ApiPropertyOptional({
    description: 'How to format negative numbers',
    example: 'parentheses',
    enum: ['parentheses', 'mines'],
  })
  @IsEnum(['parentheses', 'mines'])
  @IsOptional()
  readonly negativeFormat: 'parentheses' | 'mines';
}
