import {
  IsBoolean,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { INumberFormatQuery } from '../../types/Report.types';
import { NumberFormatQueryDto } from '@/modules/BankingTransactions/dtos/NumberFormatQuery.dto';
import { Transform, Type } from 'class-transformer';
import { parseBoolean } from '@/utils/parse-boolean';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PurchasesByItemsQueryDto {
  @ApiPropertyOptional({
    description: 'Start date for the purchases by items report',
    example: '2024-01-01',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  fromDate: Date | string;

  @ApiPropertyOptional({
    description: 'End date for the purchases by items report',
    example: '2024-01-31',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  toDate: Date | string;

  @ApiPropertyOptional({
    description: 'Array of item IDs to filter the purchases report',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @IsOptional()
  itemsIds: number[];

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
  noneTransactions: boolean;

  @ApiPropertyOptional({
    description: 'Whether to include only active items',
    example: false,
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  @Transform(({ value }) => parseBoolean(value, false))
  onlyActive: boolean;
}
