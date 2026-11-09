import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { parseBoolean } from '@/utils/parse-boolean';

export class GetNotificationsQueryDto {
  @ApiPropertyOptional({
    description: 'Number of notifications per page',
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Offset for pagination',
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;

  @ApiPropertyOptional({
    description: 'Filter to only unread notifications',
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  unreadOnly?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by notification category',
    example: 'inventory',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
