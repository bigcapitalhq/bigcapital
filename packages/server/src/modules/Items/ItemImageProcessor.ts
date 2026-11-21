import { Injectable } from '@nestjs/common';
import { fromBuffer as fileTypeFromBuffer } from 'file-type';
import * as sharp from 'sharp';
import { ServiceError } from './ServiceError';
import {
  ERRORS,
  ITEM_IMAGE_THUMBNAIL_QUALITY,
  ITEM_IMAGE_THUMBNAIL_SIZE,
} from './Items.constants';
import { ITEM_IMAGE_MIME_TYPES } from './ItemImages.multer';

export interface ProcessedItemImage {
  /** The detected image MIME type. */
  mimeType: string;
  /** The detected file extension (without a dot). */
  extension: string;
  /** The resized JPEG thumbnail buffer. */
  thumbnail: Buffer;
}

/**
 * Validates and resizes item images.
 */
@Injectable()
export class ItemImageProcessor {
  /**
   * Validates the image bytes and generates a resized thumbnail.
   * @param {Buffer} buffer - The uploaded file buffer.
   * @returns {Promise<ProcessedItemImage>}
   */
  public async process(buffer: Buffer): Promise<ProcessedItemImage> {
    const detectedType = await fileTypeFromBuffer(buffer);
    const isSupported =
      detectedType &&
      ITEM_IMAGE_MIME_TYPES.includes(
        detectedType.mime as (typeof ITEM_IMAGE_MIME_TYPES)[number],
      );

    if (!isSupported) {
      throw new ServiceError(
        ERRORS.ITEM_IMAGE_INVALID_FORMAT,
        'The uploaded file is not a supported image.',
      );
    }
    const thumbnail = await sharp(buffer, { failOn: 'none' })
      .rotate()
      .resize(ITEM_IMAGE_THUMBNAIL_SIZE, ITEM_IMAGE_THUMBNAIL_SIZE, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: ITEM_IMAGE_THUMBNAIL_QUALITY })
      .toBuffer();

    return {
      mimeType: detectedType.mime,
      extension: detectedType.ext,
      thumbnail,
    };
  }
}
