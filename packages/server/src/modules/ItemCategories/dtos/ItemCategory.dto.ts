import { Transform } from 'class-transformer';
import { IsOptional, ToNumber } from '@/common/decorators/Validators';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber } from 'class-validator';
import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import {
  COST_METHODS,
  TCostMethod,
} from '@/common/constants/inventory.constants';

class CommandItemCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Category name', description: 'The category name' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Category description',
    description: 'The category description',
  })
  description?: string;

  @ToNumber()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, description: 'The cost account ID' })
  costAccountId?: number;

  @ToNumber()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, description: 'The sell account ID' })
  sellAccountId?: number;

  @ToNumber()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, description: 'The inventory account ID' })
  inventoryAccountId?: number;

  @Transform(({ value }) => {
    if (value === null || value === undefined) {
      return value;
    }
    if (value === '') {
      return null;
    }
    return String(value).toUpperCase();
  })
  @IsString()
  @IsOptional()
  @IsIn(COST_METHODS)
  @ApiProperty({
    example: 'FIFO',
    description:
      'The cost method. Null means inherit from the items default cost method preference.',
    enum: COST_METHODS,
    required: false,
    nullable: true,
  })
  costMethod?: TCostMethod | null;
}

export class CreateItemCategoryDto extends CommandItemCategoryDto {}
export class EditItemCategoryDto extends CommandItemCategoryDto {}
