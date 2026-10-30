import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class TrackingCategoryOptionDto {
  @ApiPropertyOptional({
    description: 'Option ID (only provided when updating an existing option)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ description: 'Option name', example: 'North Store' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Whether the option is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class CreateTrackingCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Location' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Tracks the business location of transactions',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the category is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description:
      'Whether every manual journal entry must assign this tracking category',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  mandatory?: boolean;

  @ApiPropertyOptional({
    description: 'Tracking options',
    type: [TrackingCategoryOptionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackingCategoryOptionDto)
  options?: TrackingCategoryOptionDto[];
}

export class EditTrackingCategoryDto {
  @ApiPropertyOptional({ description: 'Category name', example: 'Location' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Tracks the business location of transactions',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the category is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description:
      'Whether every manual journal entry must assign this tracking category',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  mandatory?: boolean;

  @ApiPropertyOptional({
    description: 'Tracking options',
    type: [TrackingCategoryOptionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TrackingCategoryOptionDto)
  options?: TrackingCategoryOptionDto[];
}

export class TrackingCategoryAssignmentDto {
  @ApiProperty({ description: 'Tracking category ID', example: 1 })
  @IsInt()
  categoryId: number;

  @ApiProperty({ description: 'Tracking category option ID', example: 2 })
  @IsInt()
  optionId: number;
}
