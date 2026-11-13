import { ToNumber } from '@/common/decorators/Validators';
import { PartialType } from '@nestjs/swagger';
import { CreateBatchDto } from './CreateBatch.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class EditBatchDto extends PartialType(CreateBatchDto) {
  @IsInt()
  @IsNotEmpty()
  @ToNumber()
  id: number;
}
