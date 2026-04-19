import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class EditAssetDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({
    description: 'Asset name',
    example: 'Office Laptop',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    description: 'Asset code',
    example: 'LAPTOP-001',
    required: false,
  })
  code?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Asset description',
    example: 'MacBook Pro 16-inch',
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Category ID',
    example: 1,
    required: false,
  })
  categoryId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'Serial number',
    example: 'SN123456',
    required: false,
  })
  serialNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'Asset location',
    example: 'Main Office',
    required: false,
  })
  location?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the asset is active',
    example: true,
    required: false,
  })
  active?: boolean;
}
