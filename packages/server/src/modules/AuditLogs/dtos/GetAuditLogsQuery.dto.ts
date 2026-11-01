import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ToNumber } from '@/common/decorators/Validators';

function toOptionalStringArray(value: unknown): string[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const raw = Array.isArray(value) ? value : [value];
  const filtered = raw
    .map((v) => (v == null ? '' : String(v).trim()))
    .filter((v) => v.length > 0);
  if (!filtered.length) {
    return undefined;
  }
  return [...new Set(filtered)];
}

export class GetAuditLogsQueryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @ApiPropertyOptional({ type: [String], isArray: true })
  @Transform(({ value }) => toOptionalStringArray(value))
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  subject?: string[];

  @ApiPropertyOptional({ type: [String], isArray: true })
  @Transform(({ value }) => toOptionalStringArray(value))
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  action?: string[];

  @ApiPropertyOptional({ description: 'System user id' })
  @IsOptional()
  @ToNumber()
  @IsInt()
  userId?: number;

  @ApiPropertyOptional({ description: 'ISO date (inclusive), start of day' })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({ description: 'ISO date (inclusive), end of day' })
  @IsOptional()
  @IsString()
  to?: string;
}
