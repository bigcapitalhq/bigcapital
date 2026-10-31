import {
  IsArray,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { INumberFormatQuery } from '../../types/Report.types';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';

export class InventoryTurnoverByAmountQueryDto {
  @ApiPropertyOptional({
    description: 'Start date for the inventory turnover report',
    example: '2024-01-01',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  fromDate: Date | string;

  @ApiPropertyOptional({
    description: 'End date for the inventory turnover report',
    example: '2024-01-31',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  toDate: Date | string;

  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: INumberFormatQuery;

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
