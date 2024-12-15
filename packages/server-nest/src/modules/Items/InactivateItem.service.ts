import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Item } from './models/Item';
import { events } from '@/common/events/events';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';

@Injectable()
export class InactivateItem {
  constructor(
    @Inject(Item.name) private itemModel: typeof Item,
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
  ) {}

  /**
   * Inactivates the given item on the storage.
   * @param {number} itemId
   * @return {Promise<void>}
   */
  public async inactivateItem(
    itemId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Retrieves the item or throw not found error.
    const oldItem = await this.itemModel
      .query()
      .findById(itemId)
      .throwIfNotFound();

    // Inactivate item under unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Inactivate item on the storage.
      await this.itemModel.query(trx).findById(itemId).patch({ active: false });

      // Triggers `onItemInactivated` event.
      await this.eventEmitter.emitAsync(events.item.onInactivated, { trx });
    }, trx);
  }
}
