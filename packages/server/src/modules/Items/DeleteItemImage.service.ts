import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { S3StorageService } from '../S3/S3Storage.service';
import { Item } from './models/Item';
import { ItemImage } from './models/ItemImage';
import { ServiceError } from './ServiceError';
import { ERRORS } from './Items.constants';

@Injectable()
export class DeleteItemImageService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly uploader: S3StorageService,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    @Inject(ItemImage.name)
    private readonly itemImageModel: TenantModelProxy<typeof ItemImage>,
  ) {}

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
   * Deletes the given item image.
   * @param {number} itemId - The item id.
   * @param {number} imageId - The item image id.
   */
  public async deleteItemImage(
    itemId: number,
    imageId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    let deletedKeys: string[] = [];

    await this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Serializes image mutations for the same item.
      await this.itemModel()
        .query(trx)
        .findById(itemId)
        .forUpdate()
        .throwIfNotFound();

      const foundImage = await this.itemImageModel()
        .query(trx)
        .findOne({ id: imageId, itemId });

      if (!foundImage) {
        throw new ServiceError(
          ERRORS.ITEM_IMAGE_NOT_FOUND,
          'The item image was not found.',
        );
      }

      deletedKeys = [foundImage.key, foundImage.thumbnailKey];

      await this.itemImageModel().query(trx).findById(imageId).delete();
      await this.syncItemPictureUri(itemId, trx);
    }, trx);

    await this.uploader.deleteObjects(deletedKeys);
  }
}
