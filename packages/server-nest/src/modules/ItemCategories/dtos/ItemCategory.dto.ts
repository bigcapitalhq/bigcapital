import { IsNumber } from 'class-validator';
import { IsOptional, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

class CommandItemCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsOptional()
  costAccountId?: number;

  @IsNumber()
  @IsOptional()
  sellAccountId?: number;

  @IsNumber()
  @IsOptional()
  inventoryAccountId?: number;

  @IsString()
  @IsOptional()
  costMethod?: string;
}

export class CreateItemCategoryDto extends CommandItemCategoryDto {}
export class EditItemCategoryDto extends CommandItemCategoryDto {}
