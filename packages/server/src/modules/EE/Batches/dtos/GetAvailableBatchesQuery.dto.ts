import { ToNumber } from '@/common/decorators/Validators';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class GetAvailableBatchesQueryDto {
  @ApiProperty({ description: 'The item id', example: 1 })
  @ToNumber()
  @IsInt()
  @IsNotEmpty()
  itemId: number;

  @ApiProperty({ description: 'The warehouse id', required: false })
  @ToNumber()
  @IsInt()
  @IsOptional()
  warehouseId?: number;
}
