import { Type } from 'class-transformer';
import { IsIn, IsJSON, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetBillPaymentsFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly customViewId?: number;

  @IsOptional()
  @IsJSON()
  readonly stringifiedFilterRoles?: string;

  @IsOptional()
  readonly columnSortBy?: string;

  @IsOptional()
  @IsIn(['desc', 'asc'])
  readonly sortOrder?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly pageSize?: number;

  @IsOptional()
  @IsString()
  readonly searchKeyword?: string;
}
