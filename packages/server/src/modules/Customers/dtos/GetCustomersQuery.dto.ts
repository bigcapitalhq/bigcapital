import { IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ToNumber } from '@/common/decorators/Validators';
import { DynamicFilterQueryDto } from '@/modules/DynamicListing/dtos/DynamicFilterQuery.dto';
import { parseBoolean } from '@/utils/parse-boolean';
import { Transform } from 'class-transformer';

export class GetCustomersQueryDto extends DynamicFilterQueryDto {
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
