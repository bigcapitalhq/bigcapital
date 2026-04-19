import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAssetsQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Search query for name or code',
    example: 'laptop',
  })
  q?: string;

  @IsOptional()
  @IsEnum(['active', 'fully_depreciated', 'disposed', 'sold'])
  @ApiPropertyOptional({
    description: 'Filter by status',
    example: 'active',
    enum: ['active', 'fully_depreciated', 'disposed', 'sold'],
  })
  status?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Filter by asset account ID',
    example: 1,
  })
  assetAccountId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
  })
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Page size',
    example: 20,
  })
  pageSize?: number = 20;
}
