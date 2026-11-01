import { IsOptional, ToNumber } from '@/common/decorators/Validators';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class InventoryAdjustmentsFilterDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @ToNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsInt()
  @ToNumber()
  @IsOptional()
  pageSize?: number;
}
