import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator";

export class NumberFormatQueryDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly precision: number;

  @IsBoolean()
  @IsOptional()
  readonly divideOn1000: boolean;

  @IsBoolean()
  @IsOptional()
  readonly showZero: boolean;

  @IsEnum(['total', 'always', 'none'])
  @IsOptional()
  readonly formatMoney: 'total' | 'always' | 'none';

  @IsEnum(['parentheses', 'mines'])
  @IsOptional()
  readonly negativeFormat: 'parentheses' | 'mines';
}