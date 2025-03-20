import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';

export class WarehouseTransferEntryDto {
  @IsNotEmpty()
  index: number;

  @IsNotEmpty()
  @IsInt()
  itemId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsOptional()
  @IsDecimal()
  cost?: number;
}

export class CommandWarehouseTransferDto {
  @IsNotEmpty()
  @IsInt()
  fromWarehouseId: number;

  @IsNotEmpty()
  @IsInt()
  toWarehouseId: number;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsOptional()
  @IsString()
  transactionNumber?: string;

  @IsBoolean()
  @IsOptional()
  transferInitiated: boolean = false;

  @IsBoolean()
  @IsOptional()
  transferDelivered: boolean = false;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WarehouseTransferEntryDto)
  entries: WarehouseTransferEntryDto[];
}

export class CreateWarehouseTransferDto extends CommandWarehouseTransferDto {}
export class EditWarehouseTransferDto extends CommandWarehouseTransferDto {}
