import { ToNumber } from '@/common/decorators/Validators';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { BatchStatus } from '../types/Batches.types';

export class GetBatchesQueryDto {
  @ApiProperty({ description: 'The item id', required: false })
  @ToNumber()
  @IsInt()
  @IsOptional()
  itemId?: number;

  @ApiProperty({
    description: 'The item ids',
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  itemsIds?: number[];

  @ApiProperty({
    description: 'Search term applied to batch number, batch ref and item name',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'The batch status',
    required: false,
    enum: BatchStatus,
  })
  @IsEnum(BatchStatus)
  @IsOptional()
  status?: BatchStatus;

  @ApiProperty({
    description: 'Filter batches created on or after this date',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @ApiProperty({
    description: 'Filter batches created on or before this date',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  toDate?: string;

  @ApiProperty({ description: 'The page number', required: false })
  @ToNumber()
  @IsInt()
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'The page size', required: false })
  @ToNumber()
  @IsInt()
  @IsOptional()
  pageSize?: number;
}
