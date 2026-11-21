import { BadRequestException } from '@nestjs/common';
import * as multer from 'multer';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
  ERRORS,
  MAX_ITEM_IMAGES,
  MAX_ITEM_IMAGE_SIZE,
} from './Items.constants';

export const ITEM_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

/**
 * Multer options for item image uploads.
 * Files are kept in memory so they can be resized before being sent to S3.
 */
export const uploadItemImagesMulterOptions: MulterOptions = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_ITEM_IMAGE_SIZE,
    files: MAX_ITEM_IMAGES,
  },
  fileFilter: (_req, file, callback) => {
    if (
      !ITEM_IMAGE_MIME_TYPES.includes(
        file.mimetype as (typeof ITEM_IMAGE_MIME_TYPES)[number],
      )
    ) {
      return callback(
        new BadRequestException(ERRORS.ITEM_IMAGE_INVALID_FORMAT),
        false,
      );
    }
    callback(null, true);
  },
};
