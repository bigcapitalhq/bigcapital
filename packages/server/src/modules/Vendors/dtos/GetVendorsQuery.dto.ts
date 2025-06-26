import { ToNumber } from '@/common/decorators/Validators';
import { DynamicFilterQueryDto } from '@/modules/DynamicListing/dtos/DynamicFilterQuery.dto';
import { parseBoolean } from '@/utils/parse-boolean';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class GetVendorsQueryDto extends DynamicFilterQueryDto {
  @IsString()
  @IsOptional()
  stringifiedFilterRoles?: string;

  @IsOptional()
  @IsInt()
  @ToNumber()
  page?: number;

  @IsOptional()
  @IsInt()
  @ToNumber()
  pageSize?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  inactiveMode?: boolean;
}
