import {
  IsString,
  IsIn,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsInt,
  IsArray,
  ValidateIf,
  MaxLength,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CommandItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsIn(['service', 'non-inventory', 'inventory'])
  type: 'service' | 'non-inventory' | 'inventory';

  @IsOptional()
  @IsString()
  @MaxLength(255)
  code?: string;

  // Purchase attributes
  @IsOptional()
  @IsBoolean()
  purchasable?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @ValidateIf((o) => o.purchasable === true)
  costPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ValidateIf((o) => o.purchasable === true)
  costAccountId?: number;

  // Sell attributes
  @IsOptional()
  @IsBoolean()
  sellable?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @ValidateIf((o) => o.sellable === true)
  sellPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ValidateIf((o) => o.sellable === true)
  sellAccountId?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ValidateIf((o) => o.type === 'inventory')
  inventoryAccountId?: number;

  @IsOptional()
  @IsString()
  sellDescription?: string;

  @IsOptional()
  @IsString()
  purchaseDescription?: string;

  @IsOptional()
  @IsInt()
  sellTaxRateId?: number;

  @IsOptional()
  @IsInt()
  purchaseTaxRateId?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  categoryId?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  mediaIds?: number[];
}

export class CreateItemDto extends CommandItemDto {}
export class EditItemDto extends CommandItemDto {}
