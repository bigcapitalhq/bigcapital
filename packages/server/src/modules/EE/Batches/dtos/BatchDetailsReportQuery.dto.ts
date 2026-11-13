import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { BatchStatus } from '../types/Batches.types';

export class BatchDetailsReportQueryDto {
  @ApiProperty({ description: 'From date', required: false })
  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @ApiProperty({ description: 'To date', required: false })
  @IsDateString()
  @IsOptional()
  toDate?: string;

  @ApiProperty({ description: 'The item ids', required: false, type: [Number] })
  @IsArray()
  @IsOptional()
  itemsIds?: number[];

  @ApiProperty({
    description: 'The batch status',
    required: false,
    enum: BatchStatus,
  })
  @IsEnum(BatchStatus)
  @IsOptional()
  status?: BatchStatus;

  @ApiProperty({
    description: 'Search term applied to batch number, batch ref and item name',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}
