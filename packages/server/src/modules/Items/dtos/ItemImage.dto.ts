import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';
import { ITEM_IMAGE_TYPES, ItemImageRole } from '../Items.constants';

/**
 * Upload item images DTO (multipart text fields).
 */
export class UploadItemImagesDto {
  @IsNotEmpty()
  @IsIn([...ITEM_IMAGE_TYPES])
  @ApiProperty({
    description: 'The role of the uploaded item images',
    enum: [...ITEM_IMAGE_TYPES],
    example: 'front',
  })
  type: ItemImageRole;
}

/**
 * Item image response DTO.
 */
export class ItemImageResponseDto {
  @ApiProperty({ description: 'The item image id', example: 1 })
  id: number;

  @ApiProperty({
    description: 'The role of the image',
    enum: [...ITEM_IMAGE_TYPES],
    example: 'front',
  })
  type: ItemImageRole;

  @ApiProperty({
    description: 'The original file name',
    required: false,
    example: 'front.jpg',
  })
  originName?: string;

  @ApiProperty({
    description: 'The image MIME type',
    required: false,
    example: 'image/jpeg',
  })
  mimeType?: string;

  @ApiProperty({
    description: 'The image size in bytes',
    required: false,
    example: 123456,
  })
  size?: number;

  @ApiProperty({
    description: 'The presigned URL of the original image',
    required: false,
    nullable: true,
  })
  imageUri?: string | null;

  @ApiProperty({
    description: 'The presigned URL of the resized image',
    required: false,
    nullable: true,
  })
  thumbnailUri?: string | null;

  @ApiProperty({
    description: 'The image creation date',
    required: false,
  })
  createdAt?: Date;
}

/**
 * Upload item images response DTO.
 */
export class UploadItemImagesResponseDto {
  @ApiProperty({
    description: 'The item images',
    type: [ItemImageResponseDto],
  })
  images: ItemImageResponseDto[];
}
