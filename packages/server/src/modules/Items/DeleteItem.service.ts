import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IItemEventDeletedPayload,
  IItemEventDeletingPayload,
} from '@/interfaces/Item';
import { events } from '@/common/events/events';
import { Item } from './models/Item';
import { ItemImage } from './models/ItemImage';
import { ERRORS } from './Items.constants';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { S3StorageService } from '../S3/S3Storage.service';

@Injectable()
export class DeleteItemService {
  /**
   * Constructor for the class.
   * @param {EventEmitter2} eventEmitter - Event emitter for publishing item deletion events.
   * @param {UnitOfWork} uow - Unit of Work for tenant database transactions.
   * @param {typeof Item} itemModel - The Item model class for database operations.
   */
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly s3StorageService: S3StorageService,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    @Inject(ItemImage.name)
    private readonly itemImageModel: TenantModelProxy<typeof ItemImage>,
  ) {}

  /**
   * Delete the given item from the storage.
   * @param {number} itemId - Item id.
   * @return {Promise<void>}
   */
  public async deleteItem(
    itemId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Retrieve the given item or throw not found service error.
    const oldItem = await this.itemModel()
      .query()
      .findOne('id', itemId)
      .throwIfNotFound();

    // Retrieve the image keys before deleting the item so the S3 objects can
    // be removed after the transaction is committed.
    const itemImages = await this.itemImageModel()
      .query()
      .where('itemId', itemId);

    // Delete item in unit of work.
    await this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Delete the image rows first so `deleteIfNoRelations` does not treat
      // the item's own images as a dependent relation that blocks deletion.
      await this.itemImageModel().query(trx).where('itemId', itemId).delete();

      // Triggers `onItemDeleting` event.
      await this.eventEmitter.emitAsync(events.item.onDeleting, {
        trx,
        oldItem,
      } as IItemEventDeletingPayload);

      // Deletes the item.
      await this.itemModel().query(trx).findById(itemId).deleteIfNoRelations({
        type: ERRORS.ITEM_HAS_ASSOCIATED_TRANSACTINS,
      });
      // Triggers `onItemDeleted` event.
      await this.eventEmitter.emitAsync(events.item.onDeleted, {
        itemId,
        oldItem,
        trx,
      } as IItemEventDeletedPayload);
    }, trx);

    // Remove the item image objects from S3, best-effort.
    await this.s3StorageService.deleteObjects(
      itemImages.flatMap((image) => [image.key, image.thumbnailKey]),
    );
  }
}
