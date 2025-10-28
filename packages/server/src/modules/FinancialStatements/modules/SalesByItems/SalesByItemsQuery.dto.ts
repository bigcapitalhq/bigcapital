import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { INumberFormatQuery } from '../../types/Report.types';
import { Transform, Type } from 'class-transformer';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { parseBoolean } from '@/utils/parse-boolean';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SalesByItemsQueryDto {
  @ApiPropertyOptional({
    description: 'Start date for the sales by items report',
    example: '2024-01-01',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  fromDate: Date | string;

  @ApiPropertyOptional({
    description: 'End date for the sales by items report',
    example: '2024-01-31',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  toDate: Date | string;

  @ApiPropertyOptional({
    description: 'Number formatting options for the report',
    type: NumberFormatQueryDto,
  })
  @ValidateNested()
  @Type(() => NumberFormatQueryDto)
  @IsOptional()
  numberFormat: INumberFormatQuery;

  @ApiPropertyOptional({
    description: 'Whether to exclude items with no transactions',
    example: false,
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  noneTransactions: boolean;

  @ApiPropertyOptional({
    description: 'Whether to include only active items',
    example: false,
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  @IsOptional()
  onlyActive: boolean;

  @ApiPropertyOptional({
    description: 'Array of item IDs to filter the sales report',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @IsOptional()
  itemsIds: number[];
}
