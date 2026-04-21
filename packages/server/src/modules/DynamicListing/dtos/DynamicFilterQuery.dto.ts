import { ToNumber } from '@/common/decorators/Validators';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { IFilterRole, ISortOrder } from '../DynamicFilter/DynamicFilter.types';

export class DynamicFilterQueryDto {
  @ApiPropertyOptional({ description: 'Page number (1-based)', type: Number })
  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Number of results per page', type: Number })
  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(1)
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
  @IsString()
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
