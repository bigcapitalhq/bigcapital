import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ClsService } from 'nestjs-cls';
import { Knex } from 'knex';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { S3StorageService } from '../S3/S3Storage.service';
import { Item } from './models/Item';
import { ItemImage, ItemImageType } from './models/ItemImage';
import { ItemImageProcessor } from './ItemImageProcessor';
import { ServiceError } from './ServiceError';
import {
  ERRORS,
  ITEM_IMAGE_TYPES,
  MAX_ITEM_IMAGES,
  MAX_ITEM_IMAGE_SIZE,
} from './Items.constants';

interface UploadedImageObject {
  key: string;
  thumbnailKey: string;
  mimeType: string;
}

@Injectable()
export class AddItemImagesService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly clsService: ClsService,
    private readonly uploader: S3StorageService,
    private readonly processor: ItemImageProcessor,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    @Inject(ItemImage.name)
    private readonly itemImageModel: TenantModelProxy<typeof ItemImage>,
  ) {}

  /**
   * Validates the requested image role.
   * @param {string} type - The image role.
   */
  private assertImageType(type: string): asserts type is ItemImageType {
    if (!ITEM_IMAGE_TYPES.includes(type as ItemImageType)) {
      throw new ServiceError(
        ERRORS.ITEM_IMAGE_INVALID_TYPE,
        'The item image type is invalid.',
      );
    }
  }

  /**
   * Validates the uploaded files before processing.
   * @param {Express.Multer.File[]} files - Uploaded files.
   * @param {ItemImageType} type - The image role.
   */
  private validateFiles(files: Express.Multer.File[], type: ItemImageType) {
    if (!files || files.length === 0) {
      throw new ServiceError(
        ERRORS.ITEM_IMAGE_UPLOAD_FAILED,
        'No item images were uploaded.',
      );
    }
    if ((type === 'front' || type === 'rear') && files.length > 1) {
      throw new ServiceError(
        ERRORS.ITEM_IMAGE_INVALID_TYPE,
        'Only one image can be uploaded for the front or rear role.',
      );
    }
    files.forEach((file) => {
      if (file.size > MAX_ITEM_IMAGE_SIZE) {
        throw new ServiceError(
          ERRORS.ITEM_IMAGE_UPLOAD_FAILED,
          'The uploaded image exceeds the maximum allowed size.',
        );
      }
    });
  }

  /**
   * Resolves the thumbnail key of the primary item image.
   * @param {ItemImage[]} images - The item images.
   * @returns {string | null}
   */
  private resolvePrimaryThumbnailKey(images: ItemImage[]): string | null {
    const primary =
      images.find((image) => image.type === 'front') ??
      images.find((image) => image.type === 'rear') ??
      images[0];

    return primary?.thumbnailKey ?? null;
  }

  /**
   * Updates the item's primary thumbnail key.
   * @param {number} itemId - The item id.
   * @param {Knex.Transaction} trx - The transaction.
   */
  private async syncItemPictureUri(
    itemId: number,
    trx: Knex.Transaction,
  ): Promise<void> {
    const images = await this.itemImageModel()
      .query(trx)
      .where('itemId', itemId)
      .orderBy('id', 'asc');

    await this.itemModel()
      .query(trx)
      .findById(itemId)
      .patch({ pictureUri: this.resolvePrimaryThumbnailKey(images) });
  }

  /**
   * Uploads the given file and its thumbnail to S3.
   * @param {number} itemId - The item id.
   * @param {Express.Multer.File} file - The uploaded file.
   * @returns {Promise<UploadedImageObject>}
   */
  private async uploadFile(
    itemId: number,
    file: Express.Multer.File,
  ): Promise<UploadedImageObject> {
    const organizationId = this.clsService.get<string>('organizationId');
    if (!organizationId) {
      throw new ServiceError(
        ERRORS.ITEM_IMAGE_UPLOAD_FAILED,
        'Tenant context is required for uploads.',
      );
    }
    const processed = await this.processor.process(file.buffer);
    const baseKey = `${organizationId}/items/${itemId}/${randomUUID()}`;
    const key = `${baseKey}.${processed.extension}`;
    const thumbnailKey = `${baseKey}-thumb.jpg`;

    await this.uploader.uploadObject({
      key,
      body: file.buffer,
      contentType: processed.mimeType,
    });
    await this.uploader.uploadObject({
      key: thumbnailKey,
      body: processed.thumbnail,
      contentType: 'image/jpeg',
    });

    return { key, thumbnailKey, mimeType: processed.mimeType };
  }

  /**
   * Uploads item images and replaces the existing front/rear image.
   * @param {number} itemId - The item id.
   * @param {Express.Multer.File[]} files - The uploaded files.
   * @param {string} type - The image role.
   * @returns {Promise<ItemImage[]>}
   */
  public async addItemImages(
    itemId: number,
    files: Express.Multer.File[],
    type: string,
  ): Promise<ItemImage[]> {
    this.assertImageType(type);
    this.validateFiles(files, type);

    // Validate the item before uploading anything to S3.
    await this.itemModel().query().findById(itemId).throwIfNotFound();

    const uploadedObjects: UploadedImageObject[] = [];
    const replacedKeys: string[] = [];

    try {
      // Process sequentially to keep memory usage predictable for large images.
      for (const file of files) {
        const object = await this.uploadFile(itemId, file);
        uploadedObjects.push(object);
      }

      await this.uow.withTransaction(async (trx: Knex.Transaction) => {
        // Serializes image mutations for the same item.
        await this.itemModel()
          .query(trx)
          .findById(itemId)
          .forUpdate()
          .throwIfNotFound();

        const existingImages = await this.itemImageModel()
          .query(trx)
          .where('itemId', itemId);

        const replacedImages =
          type === 'front' || type === 'rear'
            ? existingImages.filter((image) => image.type === type)
            : [];

        const allowedCount =
          MAX_ITEM_IMAGES - existingImages.length + replacedImages.length;

        if (files.length > allowedCount) {
          throw new ServiceError(
            ERRORS.ITEM_IMAGES_LIMIT_EXCEEDED,
            `An item can have up to ${MAX_ITEM_IMAGES} images.`,
          );
        }
        if (replacedImages.length > 0) {
          await this.itemImageModel()
            .query(trx)
            .whereIn(
              'id',
              replacedImages.map((image) => image.id),
            )
            .delete();

          replacedKeys.push(
            ...replacedImages.flatMap((image) => [
              image.key,
              image.thumbnailKey,
            ]),
          );
        }

        // Objection does not support batch inserts on MySQL/MariaDB.
        for (let index = 0; index < files.length; index++) {
          const file = files[index];
          await this.itemImageModel().query(trx).insert({
            itemId,
            key: uploadedObjects[index].key,
            thumbnailKey: uploadedObjects[index].thumbnailKey,
            type,
            originName: file.originalname,
            mimeType: uploadedObjects[index].mimeType,
            size: file.size,
          });
        }

        await this.syncItemPictureUri(itemId, trx);
      });
    } catch (error) {
      await this.uploader.deleteObjects(
        uploadedObjects.flatMap((object) => [object.key, object.thumbnailKey]),
      );
      throw error;
    }

    // The replaced objects are no longer referenced by the storage.
    await this.uploader.deleteObjects(replacedKeys);

    return this.itemImageModel()
      .query()
      .where('itemId', itemId)
      .orderBy('id', 'asc');
  }

  /**
   * Retrieves the item images with presigned URLs.
   * @param {ItemImage[]} images - The item images.
   * @returns {Promise<Array<ItemImage & { imageUri: string | null; thumbnailUri: string | null }>>}
   */
  public async withPresignedUrls(images: ItemImage[]) {
    const urls = await this.uploader.getPresignedUrls(
      images.flatMap((image) => [image.key, image.thumbnailKey]),
    );
    return images.map((image) => ({
      ...image,
      imageUri: urls[image.key] ?? null,
      thumbnailUri: urls[image.thumbnailKey] ?? null,
    }));
  }
}
