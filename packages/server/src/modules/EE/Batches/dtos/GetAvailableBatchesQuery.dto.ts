import { ToNumber } from '@/common/decorators/Validators';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetAvailableBatchesQueryDto {
  @ApiProperty({ description: 'The item id', example: 1 })
  @ToNumber()
  @IsInt()
  @IsNotEmpty()
  itemId: number;
}
