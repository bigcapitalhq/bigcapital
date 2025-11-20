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

export class BulkDeleteVendorsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({
    description: 'Array of vendor IDs to delete',
    type: [Number],
    example: [1, 2, 3],
  })
  ids: number[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value, obj }) => parseBoolean(value ?? obj?.skip_undeletable, false))
  @ApiPropertyOptional({
    description:
      'When true, undeletable vendors will be skipped and only deletable ones removed.',
    type: Boolean,
    default: false,
  })
  skipUndeletable?: boolean;
}

export class ValidateBulkDeleteVendorsResponseDto {
  @ApiProperty({
    description: 'Number of vendors that can be deleted',
    example: 2,
  })
  deletableCount: number;

  @ApiProperty({
    description: 'Number of vendors that cannot be deleted',
    example: 1,
  })
  nonDeletableCount: number;

  @ApiProperty({
    description: 'IDs of vendors that can be deleted',
    type: [Number],
    example: [1, 2],
  })
  deletableIds: number[];

  @ApiProperty({
    description: 'IDs of vendors that cannot be deleted',
    type: [Number],
    example: [3],
  })
  nonDeletableIds: number[];
}

