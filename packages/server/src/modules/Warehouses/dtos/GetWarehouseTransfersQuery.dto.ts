import { ToNumber } from '@/common/decorators/Validators';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class GetWarehouseTransfersQueryDto {
  @IsInt()
  @ToNumber()
  @IsOptional()
  page: number;

  @IsInt()
  @ToNumber()
  @IsOptional()
  pageSize: number;

  @IsString()
  @IsOptional()
  searchKeyword: string;
}
