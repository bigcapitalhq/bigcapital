import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkDeleteItemsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({
    description: 'Array of item IDs to delete',
    type: [Number],
    example: [1, 2, 3],
  })
  ids: number[];
}

export class ValidateBulkDeleteItemsResponseDto {
  @ApiProperty({
    description: 'Number of items that can be deleted',
    example: 2,
  })
  deletableCount: number;

  @ApiProperty({
    description: 'Number of items that cannot be deleted',
    example: 1,
  })
  nonDeletableCount: number;

  @ApiProperty({
    description: 'IDs of items that can be deleted',
    type: [Number],
    example: [1, 2],
  })
  deletableIds: number[];

  @ApiProperty({
    description: 'IDs of items that cannot be deleted',
    type: [Number],
    example: [3],
  })
  nonDeletableIds: number[];
}

