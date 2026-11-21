import { ToNumber } from '@/common/decorators/Validators';
import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBatchDto } from './CreateBatch.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class EditBatchDto extends PartialType(
  OmitType(CreateBatchDto, ['openingWarehouseId'] as const),
) {
  @IsInt()
  @IsNotEmpty()
  @ToNumber()
  id: number;
}
