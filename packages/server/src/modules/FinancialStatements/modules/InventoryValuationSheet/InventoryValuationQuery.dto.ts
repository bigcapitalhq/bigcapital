import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { INumberFormatQuery } from '../../types/Report.types';
import { Transform, Type } from 'class-transformer';
import { parseBoolean } from '@/utils/parse-boolean';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InventoryValuationQueryDto {
  @ApiPropertyOptional({
    description: 'The date for which the inventory valuation is requested',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  asDate: Date | string;

  @ApiPropertyOptional({
    description: 'Number format options',
    type: NumberFormatQueryDto,
    example: { currency: 'USD', decimals: 2 },
  })
  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: INumberFormatQuery;

  @ApiPropertyOptional({
    description: 'Whether to exclude transactions',
    example: false,
    type: Boolean,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneTransactions: boolean;

  @ApiPropertyOptional({
    description: 'Whether to exclude zero values',
    example: false,
    type: Boolean,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneZero: boolean;

  @ApiPropertyOptional({
    description: 'Whether to include only active items',
    example: true,
    type: Boolean,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  onlyActive: boolean;

  @ApiPropertyOptional({
    description: 'Array of item IDs to filter',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  itemsIds: number[];

  @ApiPropertyOptional({
    description: 'Array of warehouse IDs to filter',
    example: [10, 20],
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  warehousesIds?: number[];

  @ApiPropertyOptional({
    description: 'Array of branch IDs to filter',
    example: [100, 200],
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  branchesIds?: number[];
}
