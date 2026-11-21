import type { ItemImageResponseDto } from './dtos/ItemImage.dto';
import type { ItemImageType } from './models/ItemImage';

interface ItemImageResponseSource {
  id: number;
  type: ItemImageType;
  originName: string | null;
  mimeType: string | null;
  size: number | null;
  imageUri?: string | null;
  thumbnailUri?: string | null;
  createdAt?: Date;
}

/**
 * Maps an item image (with presigned URLs) to the API response shape.
 * @param {ItemImageResponseSource} image
 * @returns {ItemImageResponseDto}
 */
export function toItemImageResponse(
  image: ItemImageResponseSource,
): ItemImageResponseDto {
  return {
    id: image.id,
    type: image.type,
    originName: image.originName,
    mimeType: image.mimeType,
    size: image.size,
    imageUri: image.imageUri ?? null,
    thumbnailUri: image.thumbnailUri ?? null,
    createdAt: image.createdAt,
  };
}
