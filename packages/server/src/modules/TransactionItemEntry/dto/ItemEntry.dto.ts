import { ToNumber } from '@/common/decorators/Validators';
import { DiscountType } from '@/common/types/Discount';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ItemEntryDto {
  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: 'The index of the item entry',
    example: 1,
  })
  index: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'The id of the item',
    example: 1,
  })
  itemId: number;

  @IsNotEmpty()
  @ToNumber()
  @IsNumber()
  @ApiProperty({
    description: 'The rate of the item entry',
    example: 1,
  })
  rate: number;

  @IsNotEmpty()
  @ToNumber()
  @IsNumber()
  @ApiProperty({
    description: 'The quantity of the item entry',
    example: 1,
  })
  quantity: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @ToNumber()
  @ApiProperty({
    description: 'The discount of the item entry',
    example: 1,
  })
  discount?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  @ApiProperty({
    description: 'The type of the discount',
    example: DiscountType.Percentage,
  })
  discountType?: DiscountType = DiscountType.Percentage;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The description of the item entry',
    example: 'This is a description',
  })
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The tax code of the item entry',
    example: '123456',
  })
  taxCode?: string;

  /**
   * @deprecated Use taxRateIds instead for multiple taxes support.
   */
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'The tax rate id of the item entry (deprecated, use taxRateIds)',
    example: 1,
    deprecated: true,
  })
  taxRateId?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ApiProperty({
    description: 'Array of tax rate IDs to apply to this item entry',
    example: [1, 2],
    type: [Number],
  })
  taxRateIds?: number[];

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'The warehouse id of the item entry',
    example: 1,
  })
  warehouseId?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'The project id of the item entry',
    example: 1,
  })
  projectId?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'The project ref id of the item entry',
    example: 1,
  })
  projectRefId?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(['TASK', 'BILL', 'EXPENSE'])
  @ApiProperty({
    description: 'The project ref type of the item entry',
    example: 'TASK',
  })
  projectRefType?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The project ref invoiced amount of the item entry',
    example: 100,
  })
  projectRefInvoicedAmount?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'The sell account id of the item entry',
    example: 1020,
  })
  sellAccountId?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'The cost account id of the item entry',
    example: 1021,
  })
  costAccountId?: number;
}
