import { ToNumber } from '@/common/decorators/Validators';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { IFilterRole, ISortOrder } from '../DynamicFilter/DynamicFilter.types';

export class DynamicFilterQueryDto {
  @ApiPropertyOptional({ description: 'Page number (1-based)', type: Number })
  @IsOptional()
  @IsInt()
  @ToNumber()
  page?: number;

  @ApiPropertyOptional({ description: 'Page size', type: Number })
  @IsOptional()
  @IsInt()
  @ToNumber()
  pageSize?: number;

  @ApiPropertyOptional({ description: 'Custom view ID', type: Number })
  @IsOptional()
  @ToNumber()
  customViewId?: number;

  @ApiPropertyOptional({ description: 'Filter roles', type: Array })
  @IsArray()
  @IsOptional()
  filterRoles?: IFilterRole[];

  @ApiPropertyOptional({ description: 'Column to sort by', type: String })
  @IsOptional()
  @IsString()
  columnSortBy: string;

  @ApiPropertyOptional({ description: 'Sort order (asc/desc)', type: String })
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  @IsOptional()
  sortOrder: ISortOrder;

  @ApiPropertyOptional({
    description: 'Stringified filter roles',
    type: String,
  })
  @IsString()
  @IsOptional()
  stringifiedFilterRoles?: string;

  @ApiPropertyOptional({ description: 'Search keyword', type: String })
  @IsString()
  @IsOptional()
  searchKeyword?: string;

  @ApiPropertyOptional({ description: 'View slug', type: String })
  @IsString()
  @IsOptional()
  viewSlug?: string;

  filterQuery?: (query: any) => void;
}
