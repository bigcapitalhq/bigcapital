import { ToNumber } from '@/common/decorators/Validators';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { IFilterRole, ISortOrder } from '../DynamicFilter/DynamicFilter.types';

export class DynamicFilterQueryDto {
  @IsOptional()
  @ToNumber()
  customViewId?: number;

  @IsArray()
  @IsOptional()
  filterRoles?: IFilterRole[];

  @IsOptional()
  @IsString()
  columnSortBy: string;

  @IsString()
  @IsOptional()
  sortOrder: ISortOrder;

  @IsString()
  @IsOptional()
  stringifiedFilterRoles?: string;

  @IsString()
  @IsOptional()
  searchKeyword?: string;

  @IsString()
  @IsOptional()
  viewSlug?: string;
}
