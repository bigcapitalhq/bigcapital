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

export class CreateAssetDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @ApiProperty({
    description: 'Asset name',
    example: 'Office Laptop',
  })
  name: string;

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

  @IsNumber()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Asset account ID',
    example: 1,
  })
  assetAccountId: number;

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

  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Purchase price',
    example: 2000.00,
  })
  purchasePrice: number;

  @IsDateString()
  @ApiProperty({
    description: 'Purchase date',
    example: '2024-01-15',
  })
  purchaseDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'Purchase reference (bill/invoice number)',
    example: 'INV-001',
    required: false,
  })
  purchaseReference?: string;

  @IsEnum(['straight_line', 'declining_balance', 'sum_of_years_digits', 'units_of_production'])
  @ApiProperty({
    description: 'Depreciation method',
    example: 'straight_line',
    enum: ['straight_line', 'declining_balance', 'sum_of_years_digits', 'units_of_production'],
  })
  depreciationMethod: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({
    description: 'Depreciation rate (percentage, required for declining balance)',
    example: 20,
    required: false,
  })
  depreciationRate?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Useful life in years (required for straight-line)',
    example: 5,
    required: false,
  })
  usefulLifeYears?: number;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Residual value',
    example: 200.00,
    default: 0,
  })
  residualValue: number = 0;

  @IsDateString()
  @ApiProperty({
    description: 'Depreciation start date',
    example: '2024-02-01',
  })
  depreciationStartDate: string;

  @IsEnum(['daily', 'monthly', 'yearly'])
  @ApiProperty({
    description: 'Depreciation frequency',
    example: 'monthly',
    enum: ['daily', 'monthly', 'yearly'],
    default: 'monthly',
  })
  depreciationFrequency: string = 'monthly';

  @IsNumber()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Depreciation expense account ID',
    example: 45,
  })
  depreciationExpenseAccountId: number;

  @IsNumber()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Accumulated depreciation account ID',
    example: 9,
  })
  accumulatedDepreciationAccountId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Opening depreciation (for existing assets)',
    example: 0,
    default: 0,
    required: false,
  })
  openingDepreciation?: number;

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
    default: true,
    required: false,
  })
  active?: boolean = true;
}
