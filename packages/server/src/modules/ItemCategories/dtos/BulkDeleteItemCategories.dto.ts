import {
  IsArray,
  IsInt,
  ArrayNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { parseBoolean } from '@/utils/parse-boolean';

export class BulkDeleteItemCategoriesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({
    description: 'Array of item category IDs to delete',
    type: [Number],
    example: [1, 2, 3],
  })
  ids: number[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value, obj }) =>
    parseBoolean(value ?? obj?.skip_undeletable, false),
  )
  @ApiPropertyOptional({
    description:
      'When true, undeletable item categories will be skipped and only deletable ones removed.',
    type: Boolean,
    default: false,
  })
  skipUndeletable?: boolean;
}

export class ValidateBulkDeleteItemCategoriesResponseDto {
  @ApiProperty({
    description: 'Number of item categories that can be deleted',
    example: 2,
  })
  deletableCount: number;

  @ApiProperty({
    description: 'Number of item categories that cannot be deleted',
    example: 1,
  })
  nonDeletableCount: number;

  @ApiProperty({
    description: 'IDs of item categories that can be deleted',
    type: [Number],
    example: [1, 2],
  })
  deletableIds: number[];

  @ApiProperty({
    description: 'IDs of item categories that cannot be deleted',
    type: [Number],
    example: [3],
  })
  nonDeletableIds: number[];
}
