import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { parseBoolean } from '@/utils/parse-boolean';
import { IAccountsStructureType } from '../Accounts.types';
import {
  IFilterRole,
  ISortOrder,
} from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';
import { ToNumber } from '@/common/decorators/Validators';

export class GetAccountsQueryDto {
  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter to show only inactive accounts',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  onlyInactive?: boolean;

  @ApiPropertyOptional({
    enum: IAccountsStructureType,
    description: 'Structure type for the accounts list',
    default: IAccountsStructureType.Tree,
  })
  @IsOptional()
  @IsEnum(IAccountsStructureType)
  structure?: IAccountsStructureType;

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
    example: '{"fieldKey":"root_type","value":"asset"}',
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
    example: 'assets',
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
}
