import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { parseBoolean } from '@/utils/parse-boolean';

export class BulkDeleteCustomersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({
    description: 'Array of customer IDs to delete',
    type: [Number],
    example: [1, 2, 3],
  })
  ids: number[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value, obj }) => parseBoolean(value ?? obj?.skip_undeletable, false))
  @ApiPropertyOptional({
    description:
      'When true, undeletable customers will be skipped and only deletable ones removed.',
    type: Boolean,
    default: false,
  })
  skipUndeletable?: boolean;
}

export class ValidateBulkDeleteCustomersResponseDto {
  @ApiProperty({
    description: 'Number of customers that can be deleted',
    example: 2,
  })
  deletableCount: number;

  @ApiProperty({
    description: 'Number of customers that cannot be deleted',
    example: 1,
  })
  nonDeletableCount: number;

  @ApiProperty({
    description: 'IDs of customers that can be deleted',
    type: [Number],
    example: [1, 2],
  })
  deletableIds: number[];

  @ApiProperty({
    description: 'IDs of customers that cannot be deleted',
    type: [Number],
    example: [3],
  })
  nonDeletableIds: number[];
}

