import { ToNumber } from '@/common/decorators/Validators';
import { DynamicFilterQueryDto } from '@/modules/DynamicListing/dtos/DynamicFilterQuery.dto';
import { parseBoolean } from '@/utils/parse-boolean';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class GetItemsQueryDto extends DynamicFilterQueryDto {
  @IsOptional()
  @IsInt()
  @ToNumber()
  page?: number;

  @IsOptional()
  @IsInt()
  @ToNumber()
  pageSize?: number;

  @IsOptional()
  @Transform((param) => parseBoolean(param.value, false))
  @IsBoolean()
  inactiveMode?: boolean;
}
