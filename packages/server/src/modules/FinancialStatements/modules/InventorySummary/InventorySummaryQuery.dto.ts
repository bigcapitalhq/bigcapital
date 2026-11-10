import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { parseBoolean } from '@/utils/parse-boolean';

export class InventorySummaryQueryDto {
  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Start date for the inventory summary',
    example: '2024-01-01',
  })
  fromDate: Date | string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'End date for the inventory summary',
    example: '2024-01-31',
  })
  toDate: Date | string;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: NumberFormatQueryDto;

  @Transform(({ value }) => parseBoolean(value, false))
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Whether to exclude items without transactions',
  })
  noneTransactions: boolean;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Items IDs for the inventory summary',
  })
  itemsIds: number[];

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Warehouses IDs for the inventory summary',
  })
  warehousesIds?: number[];

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Branches IDs for the inventory summary',
  })
  branchesIds?: number[];
}
