import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IItemEventDeletedPayload,
  IItemEventDeletingPayload,
} from '@/interfaces/Item';
import { events } from '@/common/events/events';
import { Item } from './models/Item';
import { ERRORS } from './Items.constants';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

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

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,
  ) { }

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

    // Delete item in unit of work.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
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
  }
}
