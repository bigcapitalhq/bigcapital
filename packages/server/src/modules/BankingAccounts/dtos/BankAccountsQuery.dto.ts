import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ToNumber } from '@/common/decorators/Validators';
import { IFilterRole, ISortOrder } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';
import { parseBoolean } from '@/utils/parse-boolean';

export class BankAccountsQueryDto {
  @ApiPropertyOptional({
    description: 'Custom view ID',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @ToNumber()
  @IsInt()
  customViewId?: number;

  @ApiPropertyOptional({
    description: 'Filter roles array',
    type: Array,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  filterRoles?: IFilterRole[];

  @ApiPropertyOptional({
    description: 'Column to sort by',
    type: String,
    example: 'created_at',
  })
  @IsOptional()
  @IsString()
  columnSortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ISortOrder,
    example: ISortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(ISortOrder)
  sortOrder?: string;

  @ApiPropertyOptional({
    description: 'Stringified filter roles',
    type: String,
    example: '{"fieldKey":"status","value":"active"}',
  })
  @IsOptional()
  @IsString()
  stringifiedFilterRoles?: string;

  @ApiPropertyOptional({
    description: 'Search keyword',
    type: String,
    example: 'bank account',
  })
  @IsOptional()
  @IsString()
  searchKeyword?: string;

  @ApiPropertyOptional({
    description: 'View slug',
    type: String,
    example: 'active-accounts',
  })
  @IsOptional()
  @IsString()
  viewSlug?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    type: Number,
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Page size',
    type: Number,
    example: 25,
    minimum: 1,
  })
  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(1)
  pageSize?: number;

  @ApiPropertyOptional({
    description: 'Include inactive accounts',
    type: Boolean,
    example: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  inactiveMode?: boolean;
}
