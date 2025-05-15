import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { IsOptional, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

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

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, description: 'The cost account ID' })
  costAccountId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, description: 'The sell account ID' })
  sellAccountId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, description: 'The inventory account ID' })
  inventoryAccountId?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'FIFO', description: 'The cost method' })
  costMethod?: string;
}

export class CreateItemCategoryDto extends CommandItemCategoryDto {}
export class EditItemCategoryDto extends CommandItemCategoryDto {}
