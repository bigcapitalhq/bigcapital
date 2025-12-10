import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { INumberFormatQuery } from '../../types/Report.types';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { parseBoolean } from '@/utils/parse-boolean';

export class InventoryItemDetailsQueryDto {
  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Start date for the inventory item details',
  })
  fromDate: Date | string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'End date for the inventory item details',
  })
  toDate: Date | string;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Number format for the inventory item details',
  })
  numberFormat: NumberFormatQueryDto;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Whether to exclude transactions' })
  noneTransactions: boolean;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Items IDs for the inventory item details',
  })
  itemsIds: number[];

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Warehouses IDs for the inventory item details',
  })
  warehousesIds?: number[];

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Branches IDs for the inventory item details',
  })
  branchesIds?: number[];
}
