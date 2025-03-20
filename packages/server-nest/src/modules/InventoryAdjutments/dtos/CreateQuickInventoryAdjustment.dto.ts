import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

enum IAdjustmentTypes {
  INCREMENT = 'increment',
  DECREMENT = 'decrement',
}

export class CreateQuickInventoryAdjustmentDto {
  @ApiProperty({ description: 'Date of the inventory adjustment' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ description: 'Type of adjustment', enum: IAdjustmentTypes })
  @IsNotEmpty()
  @IsEnum(IAdjustmentTypes)
  type: 'increment' | 'decrement';

  @ApiProperty({ description: 'ID of the adjustment account' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  adjustmentAccountId: number;

  @ApiProperty({ description: 'Reason for the adjustment' })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Description of the adjustment' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Reference number' })
  @IsNotEmpty()
  @IsString()
  referenceNo: string;

  @ApiProperty({ description: 'ID of the item being adjusted' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  itemId: number;

  @ApiProperty({ description: 'Quantity to adjust' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ description: 'Cost of the item' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cost: number;

  @ApiProperty({ description: 'Whether to publish the adjustment immediately' })
  @IsNotEmpty()
  @IsBoolean()
  publish: boolean;

  @ApiPropertyOptional({ description: 'ID of the warehouse (optional)' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  warehouseId?: number;

  @ApiPropertyOptional({ description: 'ID of the branch (optional)' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  branchId?: number;
}
